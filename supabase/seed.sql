-- Nội dung mẫu tự biên soạn, chưa được người có năng lực ngôn ngữ duyệt.
-- Giữ qa_status='draft' để RLS không hiển thị các mục này cho người học.
-- Source/license chưa được xác minh cho phát hành thương mại.

INSERT INTO public.vocab_items (
  id, lang, lemma, reading, pos, gloss_vi, level, source, license, qa_status
)
VALUES
  (
    '10000000-0000-4000-8000-000000000001',
    'en', 'borrow', NULL, 'verb', 'mượn', 'A2-B1 [GIẢ ĐỊNH]',
    'Tự biên soạn cho prototype', 'CHƯA XÁC MINH', 'draft'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'ja', '食べる', 'たべる', 'verb', 'ăn', 'N5 [GIẢ ĐỊNH]',
    'Tự biên soạn cho prototype', 'CHƯA XÁC MINH', 'draft'
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'ko', '먹다', 'meokda', 'verb', 'ăn', 'TOPIK I [GIẢ ĐỊNH]',
    'Tự biên soạn cho prototype', 'CHƯA XÁC MINH', 'draft'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.example_sentences (
  id, vocab_id, lang, text, reading, gloss_vi, source, license, qa_status
)
VALUES
  (
    '20000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'en', 'May I borrow your pen?', NULL,
    'Tôi có thể mượn bút của bạn không?',
    'Tự biên soạn cho prototype', 'CHƯA XÁC MINH', 'draft'
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000002',
    'ja', '毎朝パンを食べます。', 'まいあさぱんをたべます。',
    'Tôi ăn bánh mì mỗi sáng.',
    'Tự biên soạn cho prototype', 'CHƯA XÁC MINH', 'draft'
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000003',
    'ko', '저는 밥을 먹어요.', 'jeoneun babeul meogeoyo.',
    'Tôi ăn cơm.',
    'Tự biên soạn cho prototype', 'CHƯA XÁC MINH', 'draft'
  )
ON CONFLICT (id) DO NOTHING;
