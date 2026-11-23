-- D5 schema draft: PostgreSQL.
-- Runtime must verify the access token, begin a transaction, and SET LOCAL
-- app.user_id to the authenticated internal UUID before any user-scoped query.
-- Application credentials must not own these tables or bypass RLS.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS app;

CREATE TABLE app.users (
    user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_subject text NOT NULL UNIQUE,
    locale text NOT NULL DEFAULT 'vi-VN',
    created_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
);

CREATE TABLE app.vocab_items (
    vocab_item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    target_language text NOT NULL CHECK (target_language IN ('en', 'ja', 'ko')),
    lemma text NOT NULL,
    normalized_form text NOT NULL,
    part_of_speech text,
    level_code text,
    source_url text,
    license_id text,
    license_status text NOT NULL CHECK (license_status IN ('pending', 'approved', 'rejected')),
    content_version integer NOT NULL DEFAULT 1 CHECK (content_version > 0),
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (target_language, normalized_form, content_version),
    CHECK (published_at IS NULL OR license_status = 'approved')
);

CREATE TABLE app.example_sentences (
    sentence_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vocab_item_id uuid NOT NULL REFERENCES app.vocab_items(vocab_item_id) ON DELETE RESTRICT,
    target_language text NOT NULL CHECK (target_language IN ('en', 'ja', 'ko')),
    sentence_text text NOT NULL,
    reading_text text,
    translation_vi text,
    context_label text,
    source_url text,
    license_id text,
    license_status text NOT NULL CHECK (license_status IN ('pending', 'approved', 'rejected')),
    reviewer_id text,
    content_version integer NOT NULL DEFAULT 1 CHECK (content_version > 0),
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (published_at IS NULL OR (license_status = 'approved' AND reviewer_id IS NOT NULL))
);

CREATE TABLE app.user_cards (
    card_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES app.users(user_id) ON DELETE CASCADE,
    vocab_item_id uuid NOT NULL REFERENCES app.vocab_items(vocab_item_id) ON DELETE RESTRICT,
    due_at timestamptz NOT NULL,
    desired_retention numeric(4, 3) NOT NULL CHECK (desired_retention > 0 AND desired_retention < 1),
    algorithm_version text NOT NULL,
    scheduler_state jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, vocab_item_id),
    UNIQUE (card_id, user_id)
);

CREATE TABLE app.review_logs (
    review_log_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES app.users(user_id) ON DELETE CASCADE,
    card_id uuid NOT NULL,
    idempotency_key uuid NOT NULL,
    rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 4),
    reviewed_at timestamptz NOT NULL,
    algorithm_version text NOT NULL,
    scheduler_package text NOT NULL,
    previous_state jsonb,
    resulting_state jsonb NOT NULL,
    review_duration_ms integer CHECK (review_duration_ms IS NULL OR review_duration_ms >= 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, idempotency_key),
    CONSTRAINT review_logs_card_owner_fk
        FOREIGN KEY (card_id, user_id)
        REFERENCES app.user_cards(card_id, user_id)
        ON DELETE RESTRICT
);

CREATE TABLE app.user_fsrs_params (
    params_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES app.users(user_id) ON DELETE CASCADE,
    algorithm_version text NOT NULL,
    scheduler_package text NOT NULL,
    parameters jsonb NOT NULL CHECK (jsonb_typeof(parameters) = 'array'),
    desired_retention numeric(4, 3) NOT NULL CHECK (desired_retention > 0 AND desired_retention < 1),
    effective_from timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, algorithm_version, effective_from)
);

CREATE TABLE app.conversation_sessions (
    conversation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES app.users(user_id) ON DELETE CASCADE,
    target_language text NOT NULL CHECK (target_language IN ('en', 'ja', 'ko')),
    input_mode text NOT NULL CHECK (input_mode IN ('text', 'voice')),
    consent_to_store_text boolean NOT NULL DEFAULT false,
    retention_until timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (conversation_id, user_id),
    CHECK (
        (consent_to_store_text AND retention_until IS NOT NULL)
        OR (NOT consent_to_store_text AND retention_until IS NULL)
    )
);

CREATE TABLE app.conversation_turns (
    turn_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid NOT NULL,
    user_id uuid NOT NULL REFERENCES app.users(user_id) ON DELETE CASCADE,
    request_id uuid NOT NULL,
    target_language text NOT NULL CHECK (target_language IN ('en', 'ja', 'ko')),
    user_input_text text,
    asr_transcript text,
    asr_status text CHECK (asr_status IS NULL OR asr_status IN ('ok', 'empty', 'uncertain', 'failed')),
    assistant_reply text,
    corrections jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (
        jsonb_typeof(corrections) = 'array' AND jsonb_array_length(corrections) <= 2
    ),
    target_words_used text[] NOT NULL DEFAULT ARRAY[]::text[],
    provider text,
    model text,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, request_id),
    CONSTRAINT conversation_turns_session_owner_fk
        FOREIGN KEY (conversation_id, user_id)
        REFERENCES app.conversation_sessions(conversation_id, user_id)
        ON DELETE CASCADE
);

-- Reserved for a future, separately consented research feature.
-- MVP must not populate phoneme-level assessments or present them to learners.
CREATE TABLE app.user_phoneme_stats (
    user_id uuid NOT NULL REFERENCES app.users(user_id) ON DELETE CASCADE,
    language_code text NOT NULL CHECK (language_code IN ('en', 'ja', 'ko')),
    phoneme_code text NOT NULL,
    attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
    accepted_count integer NOT NULL DEFAULT 0 CHECK (accepted_count >= 0 AND accepted_count <= attempts),
    consent_id uuid NOT NULL,
    last_seen_at timestamptz,
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, language_code, phoneme_code)
);

CREATE TABLE app.usage_ledger (
    usage_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES app.users(user_id) ON DELETE CASCADE,
    request_id uuid NOT NULL,
    component text NOT NULL CHECK (component IN ('asr', 'llm', 'tts', 'realtime', 'other')),
    provider text NOT NULL,
    model text NOT NULL,
    quantity numeric(18, 6) NOT NULL CHECK (quantity >= 0),
    unit text NOT NULL,
    estimated_cost_usd numeric(18, 8),
    billed_cost_usd numeric(18, 8),
    cost_status text NOT NULL CHECK (cost_status IN ('estimated', 'billed', 'unpriced')),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, request_id, component, provider, model),
    CHECK (estimated_cost_usd IS NULL OR estimated_cost_usd >= 0),
    CHECK (billed_cost_usd IS NULL OR billed_cost_usd >= 0),
    CHECK (
        (cost_status = 'unpriced' AND estimated_cost_usd IS NULL AND billed_cost_usd IS NULL)
        OR (cost_status = 'estimated' AND estimated_cost_usd IS NOT NULL)
        OR (cost_status = 'billed' AND billed_cost_usd IS NOT NULL)
    )
);

CREATE TABLE app.quota_periods (
    quota_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES app.users(user_id) ON DELETE CASCADE,
    feature text NOT NULL,
    period_start timestamptz NOT NULL,
    period_end timestamptz NOT NULL,
    limit_units numeric(18, 6) NOT NULL CHECK (limit_units >= 0),
    reserved_units numeric(18, 6) NOT NULL DEFAULT 0 CHECK (reserved_units >= 0),
    used_units numeric(18, 6) NOT NULL DEFAULT 0 CHECK (used_units >= 0),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, feature, period_start),
    CHECK (period_end > period_start),
    CHECK (reserved_units + used_units <= limit_units)
);

CREATE INDEX vocab_items_published_idx
    ON app.vocab_items (target_language, level_code, normalized_form)
    WHERE published_at IS NOT NULL AND license_status = 'approved';
CREATE INDEX example_sentences_vocab_idx
    ON app.example_sentences (vocab_item_id, target_language)
    WHERE published_at IS NOT NULL AND license_status = 'approved';
CREATE INDEX user_cards_due_idx ON app.user_cards (user_id, due_at);
CREATE INDEX review_logs_user_time_idx ON app.review_logs (user_id, reviewed_at DESC);
CREATE INDEX conversation_turns_user_time_idx ON app.conversation_turns (user_id, created_at DESC);
CREATE INDEX usage_ledger_user_time_idx ON app.usage_ledger (user_id, created_at DESC);
CREATE INDEX quota_periods_user_feature_idx ON app.quota_periods (user_id, feature, period_end);

CREATE FUNCTION app.reject_review_log_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'review_logs is append-only';
END;
$$;

CREATE TRIGGER review_logs_append_only
BEFORE UPDATE OR DELETE ON app.review_logs
FOR EACH ROW EXECUTE FUNCTION app.reject_review_log_mutation();

-- User isolation: set app.user_id from a verified identity inside each transaction.
ALTER TABLE app.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.users FORCE ROW LEVEL SECURITY;
CREATE POLICY users_self ON app.users
    USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid)
    WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);

ALTER TABLE app.user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.user_cards FORCE ROW LEVEL SECURITY;
CREATE POLICY user_cards_self ON app.user_cards
    USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid)
    WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);

ALTER TABLE app.review_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.review_logs FORCE ROW LEVEL SECURITY;
CREATE POLICY review_logs_self ON app.review_logs
    USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid)
    WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);

ALTER TABLE app.user_fsrs_params ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.user_fsrs_params FORCE ROW LEVEL SECURITY;
CREATE POLICY user_fsrs_params_self ON app.user_fsrs_params
    USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid)
    WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);

ALTER TABLE app.conversation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.conversation_sessions FORCE ROW LEVEL SECURITY;
CREATE POLICY conversation_sessions_self ON app.conversation_sessions
    USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid)
    WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);

ALTER TABLE app.conversation_turns ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.conversation_turns FORCE ROW LEVEL SECURITY;
CREATE POLICY conversation_turns_self ON app.conversation_turns
    USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid)
    WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);

ALTER TABLE app.user_phoneme_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.user_phoneme_stats FORCE ROW LEVEL SECURITY;
CREATE POLICY user_phoneme_stats_self ON app.user_phoneme_stats
    USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid)
    WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);

ALTER TABLE app.usage_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.usage_ledger FORCE ROW LEVEL SECURITY;
CREATE POLICY usage_ledger_self ON app.usage_ledger
    USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid)
    WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);

ALTER TABLE app.quota_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.quota_periods FORCE ROW LEVEL SECURITY;
CREATE POLICY quota_periods_self ON app.quota_periods
    USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid)
    WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);

ALTER TABLE app.vocab_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY vocab_items_published_read ON app.vocab_items
    FOR SELECT USING (published_at IS NOT NULL AND license_status = 'approved');

ALTER TABLE app.example_sentences ENABLE ROW LEVEL SECURITY;
CREATE POLICY example_sentences_published_read ON app.example_sentences
    FOR SELECT USING (
        published_at IS NOT NULL
        AND license_status = 'approved'
        AND EXISTS (
            SELECT 1
            FROM app.vocab_items v
            WHERE v.vocab_item_id = app.example_sentences.vocab_item_id
              AND v.published_at IS NOT NULL
              AND v.license_status = 'approved'
        )
    );

COMMENT ON TABLE app.user_phoneme_stats IS
    'Future opt-in only; do not populate in MVP or expose as pronunciation score.';
COMMENT ON TABLE app.usage_ledger IS
    'Provider units and cost status only; never store raw audio or API secrets here.';
