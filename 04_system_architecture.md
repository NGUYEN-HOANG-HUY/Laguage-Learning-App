# 04 — Kiến trúc hệ thống

**Ngày:** 23/11/2026  
**Trạng thái:** Thiết kế Giai đoạn 3; phụ thuộc quyết định duyệt tại CP2 và parity test FSRS trước khi bật lịch offline production.

## 1. Mục tiêu và ranh giới

- [GIẢ ĐỊNH] MVP dùng React/Vite/TypeScript ở client, Python 3.11/FastAPI ở server, PostgreSQL làm nguồn dữ liệu chuẩn và Docker Compose cho môi trường phát triển; lựa chọn này theo yêu cầu prototype đã nêu.
- Client có thể lưu review events tạm trong IndexedDB; server là authority khi giải quyết sync, quota, corrections và ledger.
- Audio chỉ truyền khi người dùng chủ động bật. Không lưu audio mặc định; transcript/turn chỉ lưu theo consent/retention policy.
- Provider AI nằm sau adapter. Mock là mặc định ở prototype; production adapter cần secrets qua environment/secret manager.
- Mọi đánh giá ngôn ngữ là so khớp văn bản “độ dễ hiểu”, không có Phoneme-level Scoring.

## 2. Sơ đồ thành phần

Nguồn Mermaid: [D4-01-components.mmd](docs/diagrams/D4-01-components.mmd) · Bản SVG: [D4-01-components.svg](docs/diagrams/D4-01-components.svg).

## 3. Luồng SRS và offline sync

Nguồn Mermaid: [D4-02-srs-sync.mmd](docs/diagrams/D4-02-srs-sync.mmd) · Bản SVG: [D4-02-srs-sync.svg](docs/diagrams/D4-02-srs-sync.svg).

### Quy tắc đồng bộ

1. Client lưu event có UUID idempotency key, thời điểm UTC, rating và algorithm/package version.
2. Client tính lịch cục bộ chỉ khi module TS cùng model đã qua golden vectors với `py-fsrs`; nếu chưa, hiển thị due tạm và không coi là lịch cuối.
3. API gửi batch; server kiểm tra quyền sở hữu, idempotency, timestamp và schema; `review_logs` append-only.
4. Server replay theo thứ tự sự kiện chuẩn, trả authoritative card state và conflict list; client thay state cục bộ theo response.
5. Giới hạn thẻ mới/ngày, pause/skip và backlog visibility để tránh “tuyết lở”.
6. Parameter training chỉ là offline job có consent/quality gate; không tự thay parameters live. Lưu lại model/parameter version để có thể replay và rollback.

### FSRS implementation decision

- [ĐÃ XÁC MINH] Repo chính thức `ts-fsrs` v6.0.1 hỗ trợ các model FSRS 3/4/4.5/5/6/7; v6 mặc định FSRS-7 và yêu cầu Node.js >=24. README nhấn mạnh package version và algorithm version khác nhau.
- [ĐÃ XÁC MINH] `py-fsrs` v6.3.3 đặt `requires-python >=3.10`; default scheduler có 21 model weights. [SUY LUẬN] Đây có vẻ phù hợp với ứng viên model FSRS-6 hơn FSRS-7/34-parameter, nhưng chỉ riêng số weights không chứng minh parity.
- **Quyết định thiết kế tạm:** pin package candidate `ts-fsrs==6.0.1`, `fsrs==6.3.3`; candidate algorithm FSRS-6. Chưa bật client/server schedule authority đồng thời cho đến khi golden vectors bao phủ new/learning/review/relearning, timezone, fuzzing và rating Again/Hard/Good/Easy. Nếu vector lệch, server schedule là authority; client chỉ cache event/due hint cho tới khi được duyệt.
- Nguồn (truy cập 23/11/2026): [ts-fsrs README](https://raw.githubusercontent.com/open-spaced-repetition/ts-fsrs/v6.0.1/README.md), [py-fsrs scheduler v6.3.3](https://raw.githubusercontent.com/open-spaced-repetition/py-fsrs/v6.3.3/fsrs/scheduler.py), [py-fsrs pyproject v6.3.3](https://raw.githubusercontent.com/open-spaced-repetition/py-fsrs/v6.3.3/pyproject.toml), [FSRS algorithm wiki](https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm).
- [CHƯA XÁC MINH] Py-FSRS v6.3.3 và ts-fsrs v6.0.1 tạo cùng trạng thái/interval ở mọi edge case; CP4 phải chạy chung vectors trước khi bật.

## 4. Luồng một lượt hội thoại

Nguồn Mermaid: [D4-03-turn-sequence.mmd](docs/diagrams/D4-03-turn-sequence.mmd) · Bản SVG: [D4-03-turn-sequence.svg](docs/diagrams/D4-03-turn-sequence.svg).

### Quy tắc xử lý lượt

- Bắt đầu lượt bằng quota reservation/idempotency key; hết quota thì trả 429/remaining quota trước khi gọi provider.
- Text đi thẳng vào orchestrator. Voice chỉ được nhận khi client đã có consent; audio xử lý trong memory/temp storage có TTL, không đưa bytes vào logs.
- Adapter trả transcript và confidence metadata nếu có; im lặng/rỗng/không đáng tin phải hỏi lại hoặc chuyển text, không tự bịa transcript.
- LLM chỉ được trả JSON theo schema; corrections tối đa hai mục. Chỉ đưa lỗi mới vào mục tiêu SRS sau khi người học xác nhận.
- Ghi usage và cost estimates theo provider/model/unit; phân biệt estimated với billed actual. Ghi conversation text chỉ khi retention policy/consent cho phép.

## 5. Luồng chấm “độ dễ hiểu”

Nguồn Mermaid: [D4-04-intelligibility.mmd](docs/diagrams/D4-04-intelligibility.mmd) · Bản SVG: [D4-04-intelligibility.svg](docs/diagrams/D4-04-intelligibility.svg).

- English: normalize/case-fold theo policy và word-level edit distance → WER.
- Japanese: normalize Unicode, chuyển/chuẩn hóa reading theo pipeline có kiểm tra; kana-level CER. Kanji reading không xác định duy nhất nên nếu không có kana/reading chuẩn, trả `not_scored` thay vì đoán.
- Korean: normalize Unicode Hangul decomposition → jamo CER; xử lý khoảng trắng theo policy đã test.
- Kết quả chỉ là text-match/độ dễ hiểu proxy. Không suy ra accent, pitch accent, phoneme score hay ý định người nói.
- Rỗng/ảo giác ASR: trả trạng thái `uncertain`/`empty`, edit output có thể chứa insertion/deletion nhưng không quy lỗi phát âm; yêu cầu thử lại/chuyển text.

## 6. Pipeline tạo nội dung offline và QA

Nguồn Mermaid: [D4-05-content-qa.mmd](docs/diagrams/D4-05-content-qa.mmd) · Bản SVG: [D4-05-content-qa.svg](docs/diagrams/D4-05-content-qa.svg).

Pipeline chỉ tạo bản nháp; không publish thẳng nội dung của LLM. Human reviewer xác nhận ngôn ngữ, mức độ, ngữ cảnh, bản dịch, attribution/license; mọi bản publish có version, reviewer, nguồn và rollback.

## 7. Kiến trúc lai Cascade + Speech-to-Speech và evidence loop

Nguồn Mermaid: [D4-06-hybrid-eval.mmd](docs/diagrams/D4-06-hybrid-eval.mmd) · Bản SVG: [D4-06-hybrid-eval.svg](docs/diagrams/D4-06-hybrid-eval.svg).

- **Cascade:** ASR → kiểm tra transcript → LLM structured output → TTS. Dễ quan sát/chặn lỗi và nối score; latency có thể cao hơn.
- **Speech-to-Speech:** audio-native realtime session cho hội thoại; latency/turn-taking có thể tốt hơn nhưng ít minh bạch hơn. Bắt buộc nhận transcript/text event, quyền đánh giá song song và nút fallback.
- **Hybrid:** realtime response cho hội thoại; bản transcript độc lập qua evaluation path để đo lỗi/độ dễ hiểu; chỉ nội dung đã evidence-check mới tạo corrections. Evaluator không được sửa ngầm câu trả lời đã gửi.
- Evidence store lưu version, prompt/schema, model/provider, transcript nếu consent cho phép, edit operations, correction acceptance, quality review và kết quả thử nghiệm. Không lưu audio mặc định.
- Hai đường chạy được bật sau đánh giá chất lượng/chi phí; prototype dùng mock adapters nên latency, accuracy và chi phí thật **CHƯA XÁC MINH**.

## 8. Lựa chọn công nghệ, lý do và điều kiện đổi

| Tầng | Đề xuất | Lý do | Phương án/điều kiện đổi |
|---|---|---|---|
| Client | React + Vite + TypeScript; PWA/IndexedDB cho event queue | Theo yêu cầu prototype; hệ sinh thái quen thuộc, UI web gọn | Native app khi cần audio background/OS integration; IndexedDB sync cần đổi nếu conflict/retention không đạt |
| Backend | Python 3.11 + FastAPI + Pydantic | Theo yêu cầu prototype; schema API và adapter rõ | Chỉ tách worker khi workload/latency đo được vượt một service |
| Database | PostgreSQL, migrations SQL, RLS với `app.user_id` transaction-local | Relational ledger/events, index/transaction, tenant boundary ở DB | Supabase/managed Postgres nếu giảm vận hành mà giữ RLS/backup/data residency yêu cầu |
| Auth | OIDC provider adapter; demo local user fixture | Tránh khóa vào nhà cung cấp trước duyệt | Chọn provider sau threat model, UX, khu vực lưu trữ và chi phí |
| SRS | `ts-fsrs` 6.0.1 và `py-fsrs` 6.3.3; FSRS-6 candidate, SM-2 chỉ làm comparator trong prototype | Lib upstream; server replay và client offline dự kiến | Không bật dual scheduling trước golden vectors; chuyển server-only nếu parity chưa đạt |
| ASR | Provider adapter; Google STT V2/Deepgram/ElevenLabs là candidates, mock mặc định trong prototype | Đo được đơn vị giá và đổi nhà cung cấp; chất lượng theo Vietnamese L1 chưa có benchmark | Chọn provider sau test Anh/Nhật/Hàn, consent, vùng, accuracy transcript/latency và chi phí |
| LLM | Structured JSON provider adapter; budget model candidate, fallback deterministic | corrections giới hạn, tách model khỏi domain | Thay model khi schema compliance, safety/quality và measured cost không đạt |
| TTS | Adapter; Google/ElevenLabs candidates; text-only fallback | Có thể bỏ TTS khi không cần nói thành tiếng | Chọn theo ngôn ngữ/voice rights/latency, không theo demo marketing |
| Quan sát | Structured logs, request IDs, OpenTelemetry interface; redact text/audio | Theo vết chi phí/lỗi mà giảm dữ liệu nhạy cảm | Chọn backend sau retention/access review; không log secret/raw audio |
| Thanh toán | Chưa triển khai; billing adapter interface, quota nội bộ trước | WTP/giá chưa xác minh | Chọn provider sau thị trường/pháp lý/fee test; không bật charge trong MVP |
| Triển khai | Docker Compose cho local, container image cho staging | Một lệnh cho dev/test | Managed hosting sau cost, data residency, backup/restore và load test |

## 9. Ranh giới dữ liệu và vận hành

- Postgres runtime role không sở hữu bảng; bật/force RLS; backend xác minh token rồi `SET LOCAL app.user_id` trong transaction.
- Public content chỉ đọc bản đã duyệt; nội dung staging dùng role/review workflow tách biệt.
- Usage ledger idempotent theo request; unit và provider cost tách khỏi text/audio payload.
- Audio không lưu mặc định; nếu cần opt-in dataset nghiên cứu, consent riêng, retention deadline và quyền rút lại.
- Composite foreign keys giữ `review_logs` cùng owner với `user_cards` và `conversation_turns` cùng owner với `conversation_sessions`; `review_logs` chặn xóa card đã có lịch sử. Xóa dữ liệu tài khoản cần retention/purge workflow có kiểm soát, không hard-delete tùy tiện.
- Database backups, encryption-at-rest/in-transit, retention and deletion workflow cần cấu hình và xác minh ở deployment; không coi schema RLS là đủ bảo vệ.

## 10. Nguồn

- Yêu cầu công nghệ/chức năng: `MASTER_PROMPT.md` mục C2, Giai đoạn 3; `03_PRD.md` (D3), ngày 23/11/2026.
- FSRS version/API: các link ở mục 3, truy cập 23/11/2026; package/algorithm version không đồng nhất.
- Chi phí tham khảo hiện tại: [D6 workbook source sheet](07_cost_model.xlsx), nguồn chính thức truy cập 23/11/2026.
