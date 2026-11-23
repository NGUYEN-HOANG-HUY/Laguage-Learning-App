-- =====================================================================
-- data_model.sql | v0.1 | PostgreSQL 15+ (thiết kế cho Supabase)
--
-- Ghi chú:
--  * Dùng auth.users và auth.uid() của Supabase. Nếu chạy Postgres thuần
--    (không Supabase): tạo schema "auth" với bảng users(id uuid) và hàm
--    auth.uid() giả để chạy thử, hoặc bỏ phần RLS ở cuối tệp.
--  * Nguồn sự thật của SRS là review_logs (append-only). user_cards là
--    trạng thái dẫn xuất, có thể dựng lại bằng replay.
--  * Giá trị trong quota_limits là [GIẢ ĐỊNH], chỉnh theo mô hình chi phí.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. NGƯỜI DÙNG
-- ---------------------------------------------------------------------
create table public.profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  display_name       text,
  native_lang        text not null default 'vi',
  target_langs       text[] not null default '{en}',
  plan               text not null default 'free' check (plan in ('free','plus','pro')),
  desired_retention  real not null default 0.90
                       check (desired_retention between 0.70 and 0.97),
  new_cards_per_day  int  not null default 10
                       check (new_cards_per_day between 0 and 50),
  store_raw_audio    boolean not null default false,   -- mặc định KHÔNG lưu audio thô
  created_at         timestamptz not null default now()
);

-- Tạo hồ sơ cho từng tài khoản Supabase Auth mới, không cho client tự
-- tạo hồ sơ thay mặt một user khác.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(btrim(new.raw_user_meta_data ->> 'display_name'), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 2. NỘI DUNG (dùng chung, không phụ thuộc người dùng)
-- ---------------------------------------------------------------------
create table public.vocab_items (
  id          uuid primary key default gen_random_uuid(),
  lang        text not null check (lang in ('en','ja','ko')),
  lemma       text not null,                 -- run / 食べる / 먹다
  reading     text,                          -- IPA / かな / romaja
  pos         text,
  gloss_vi    text not null,
  level       text,                          -- A1.. | JLPT N5 | TOPIK 1
  freq_rank   int,
  audio_url   text,
  source      text,                          -- nguồn dữ liệu
  license     text,                          -- giấy phép (theo dõi nghĩa vụ ghi nguồn)
  qa_status   text not null default 'draft'
                check (qa_status in ('draft','sampled','verified','rejected')),
  created_at  timestamptz not null default now()
);
create unique index uq_vocab_lang_lemma_pos
  on public.vocab_items (lang, lemma, coalesce(pos, ''));
create index idx_vocab_lang_level on public.vocab_items (lang, level, freq_rank);

create table public.example_sentences (
  id          uuid primary key default gen_random_uuid(),
  vocab_id    uuid not null references public.vocab_items(id) on delete cascade,
  lang        text not null check (lang in ('en','ja','ko')),
  text        text not null,
  reading     text,
  gloss_vi    text,
  audio_url   text,
  source      text,
  license     text,
  qa_status   text not null default 'draft'
                check (qa_status in ('draft','sampled','verified','rejected')),
  created_at  timestamptz not null default now()
);
create index idx_sentences_vocab on public.example_sentences (vocab_id);

-- ---------------------------------------------------------------------
-- 3. SRS: trạng thái thẻ + nhật ký ôn + tham số FSRS
-- ---------------------------------------------------------------------
create table public.user_cards (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  item_id      uuid not null references public.vocab_items(id) on delete cascade,
  state        smallint not null default 0
                 check (state between 0 and 3),     -- 0 New, 1 Learning, 2 Review, 3 Relearning
  stability    real,                              -- S (ngày)
  difficulty   real,                              -- D (1..10)
  due_at       timestamptz not null default now(),
  last_review  timestamptz,
  reps         int not null default 0,
  lapses       int not null default 0,
  fsrs_version text,                              -- ghi rõ phiên bản thuật toán
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, item_id)
);
-- Chỉ mục quan trọng nhất: hàng đợi ôn hôm nay
create index idx_user_cards_due on public.user_cards (user_id, due_at)
  where state <> 0;

-- Nhật ký ôn: append-only, nguồn sự thật
create table public.review_logs (
  id               bigserial primary key,
  user_id          uuid not null references public.profiles(id) on delete cascade,
  card_id          uuid not null references public.user_cards(id) on delete cascade,
  reviewed_at      timestamptz not null,
  rating           smallint not null check (rating between 1 and 4),  -- 1 Again .. 4 Easy
  elapsed_days     real,
  prev_state       smallint,
  prev_stability   real,
  prev_difficulty  real,
  duration_ms      int,
  client_id        uuid,                           -- thiết bị (phục vụ đồng bộ)
  fsrs_version     text,
  unique (user_id, card_id, reviewed_at)           -- chống ghi trùng khi sync
);
create index idx_review_logs_user_time on public.review_logs (user_id, reviewed_at);

create table public.user_fsrs_params (
  user_id            uuid primary key references public.profiles(id) on delete cascade,
  w                  real[] not null,             -- số tham số tùy phiên bản FSRS
  fsrs_version       text not null,
  desired_retention  real not null default 0.90,
  trained_on_reviews int,
  updated_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 4. HỘI THOẠI + LỖI CỦA NGƯỜI HỌC
-- ---------------------------------------------------------------------
create table public.conversations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  lang        text not null check (lang in ('en','ja','ko')),
  scenario_id text,
  mode        text not null default 'voice' check (mode in ('voice','text')),
  started_at  timestamptz not null default now(),
  ended_at    timestamptz
);
create index idx_conversations_user on public.conversations (user_id, started_at desc);

create table public.conversation_turns (
  id                  uuid primary key default gen_random_uuid(),
  conversation_id     uuid not null references public.conversations(id) on delete cascade,
  user_id             uuid not null references public.profiles(id) on delete cascade,
  turn_index          int  not null,
  transcript          text,
  reply_text          text,
  corrections         jsonb not null default '[]'::jsonb,   -- tối đa 2 phần tử (ép ở tầng ứng dụng)
  target_item_ids     uuid[] not null default '{}',         -- từ cần ôn được gài vào
  used_item_ids       uuid[] not null default '{}',         -- từ người dùng thực sự dùng
  asr_avg_logprob     real,
  asr_no_speech_prob  real,
  intelligibility     smallint check (intelligibility between 0 and 100),
  created_at          timestamptz not null default now(),
  unique (conversation_id, turn_index)
);

-- Kho bằng chứng lỗi: nối hội thoại ngược lại với SRS
create table public.learner_errors (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  turn_id         uuid references public.conversation_turns(id) on delete set null,
  lang            text not null check (lang in ('en','ja','ko')),
  error_type      text not null check (error_type in (
                    'tense','agreement','word_choice','particle','honorific',
                    'sub','del','ins','other')),            -- sub/del/ins: lỗi so khớp độ dễ hiểu
  expected        text,
  observed        text,
  explanation_vi  text,
  saved_as_card   boolean not null default false,             -- người dùng xác nhận mới thành thẻ
  card_id         uuid references public.user_cards(id) on delete set null,
  created_at      timestamptz not null default now()
);
create index idx_learner_errors_user on public.learner_errors (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- 5. CHI PHÍ + HẠN MỨC
-- ---------------------------------------------------------------------
create table public.usage_ledger (
  id         bigserial primary key,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  turn_id    uuid,
  ts         timestamptz not null default now(),
  kind       text not null check (kind in ('asr','llm','tts','s2s')),
  provider   text,
  model      text,
  units_in   numeric,          -- giây audio | token vào | ký tự
  units_out  numeric,          -- token ra
  cost_usd   numeric(10,6) not null default 0
);
create index idx_usage_user_ts on public.usage_ledger (user_id, ts);

create table public.quota_limits (
  plan                       text primary key check (plan in ('free','plus','pro')),
  max_turns_per_day          int not null,
  max_audio_seconds_per_turn int not null,
  max_cost_usd_per_day       numeric(8,4) not null
);
-- [GIẢ ĐỊNH] giá trị khởi đầu, chỉnh theo mô hình chi phí
insert into public.quota_limits values
  ('free', 10, 30, 0.2000),
  ('plus', 40, 30, 0.8000),
  ('pro', 100, 45, 2.0000);

-- Sử dụng hôm nay theo múi giờ Việt Nam (dùng cho kiểm tra quota)
create view public.v_user_today_usage with (security_invoker = true) as
select l.user_id,
       count(distinct l.turn_id)         as turns_today,
       coalesce(sum(l.cost_usd), 0)      as cost_usd_today
from public.usage_ledger l
where l.ts >= (date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh')
               at time zone 'Asia/Ho_Chi_Minh')
group by l.user_id;

-- ---------------------------------------------------------------------
-- 6. HÀM TRUY VẤN
-- ---------------------------------------------------------------------
-- Hàng đợi ôn hôm nay (thẻ sắp quên nhất lên trước)
create or replace function public.get_due_cards(p_limit int default 100)
returns setof public.user_cards
language sql stable security invoker as $$
  select *
  from public.user_cards
  where user_id = auth.uid()
    and state <> 0
    and due_at <= now()
  order by due_at
  limit p_limit;
$$;

-- ---------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------
alter table public.profiles            enable row level security;
alter table public.user_cards          enable row level security;
alter table public.review_logs         enable row level security;
alter table public.user_fsrs_params    enable row level security;
alter table public.conversations       enable row level security;
alter table public.conversation_turns  enable row level security;
alter table public.learner_errors      enable row level security;
alter table public.usage_ledger        enable row level security;
alter table public.vocab_items         enable row level security;
alter table public.example_sentences   enable row level security;
alter table public.quota_limits        enable row level security;

-- Hồ sơ
create policy profiles_select_own on public.profiles
  for select to authenticated using (id = auth.uid());
revoke update on public.profiles from authenticated;
grant update (display_name, native_lang, target_langs, desired_retention,
              new_cards_per_day, store_raw_audio)
  on public.profiles to authenticated;
create policy profiles_update_own on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Nội dung dùng chung: chỉ mục đã qua QA mới hiển thị cho người học
create policy vocab_read_qa on public.vocab_items
  for select to authenticated using (qa_status in ('sampled','verified'));
create policy sentences_read_qa on public.example_sentences
  for select to authenticated using (qa_status in ('sampled','verified'));
create policy quota_read on public.quota_limits
  for select to authenticated using (true);

-- Thẻ của người dùng
create policy cards_select_own on public.user_cards
  for select to authenticated using (user_id = auth.uid());
create policy cards_insert_own on public.user_cards
  for insert to authenticated with check (user_id = auth.uid());
create policy cards_update_own on public.user_cards
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Nhật ký ôn: chỉ đọc và thêm, KHÔNG sửa hoặc xóa (append-only)
create policy logs_select_own on public.review_logs
  for select to authenticated using (user_id = auth.uid());
create policy logs_insert_own on public.review_logs
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.user_cards c
                where c.id = card_id and c.user_id = auth.uid())
  );

-- Tham số FSRS: người dùng chỉ đọc; server (service role) ghi
create policy fsrs_params_select_own on public.user_fsrs_params
  for select to authenticated using (user_id = auth.uid());

-- Hội thoại và lỗi
create policy conv_select_own on public.conversations
  for select to authenticated using (user_id = auth.uid());
create policy conv_insert_own on public.conversations
  for insert to authenticated with check (user_id = auth.uid());
create policy turns_select_own on public.conversation_turns
  for select to authenticated using (user_id = auth.uid());
create policy errors_select_own on public.learner_errors
  for select to authenticated using (user_id = auth.uid());
create policy errors_update_own on public.learner_errors
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Sổ chi phí: người dùng chỉ đọc của mình; ghi chỉ bởi service role (bỏ qua RLS)
create policy usage_select_own on public.usage_ledger
  for select to authenticated using (user_id = auth.uid());

-- Ghi chú: turns, learner_errors (insert), usage_ledger, user_fsrs_params được
-- backend ghi bằng service role. Không cấp policy insert cho người dùng cuối.