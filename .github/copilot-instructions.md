# Chỉ dẫn cố định cho Copilot (đặt tại `.github/copilot-instructions.md`)

## Dự án
Ứng dụng học ngoại ngữ AI (tiếng Anh, Nhật, Hàn) cho người Việt. Nguồn sự thật về yêu cầu và thiết kế:
`docs/PRD.md`, `docs/architecture.md`, `docs/data_model.sql`, `docs/openapi.yaml`.
**Đọc các tệp này trước khi viết code. Khi code và tài liệu mâu thuẫn, dừng lại và hỏi, đừng tự chọn.**

## Quy tắc làm việc
1. **Chỉ làm đúng phạm vi PRD (mục 3).** Không tự thêm tính năng. Mục "Ngoài phạm vi" không được làm.
2. **Làm theo từng bước nhỏ.** Sau mỗi bước: chạy test thật, báo kết quả thật (không báo "xanh" nếu chưa chạy), commit git với thông điệp rõ ràng, rồi **dừng và chờ tôi gõ "TIẾP"**.
3. **Phần nào còn mock phải ghi rõ** trong README và trong tên lớp/tệp (ví dụ `MockAsrProvider`). Không để mock giả dạng dịch vụ thật.
4. **Không bịa.** Không biết một API, tham số hay phiên bản thư viện thì nói rõ và đề xuất cách kiểm tra, đừng đoán.

## Ràng buộc kỹ thuật
- **Stack:** Expo (React Native, TypeScript) cho client; FastAPI (Python 3.11) cho backend; Supabase (Postgres + Auth + Storage).
- **FSRS:** `ts-fsrs` ở client, `py-fsrs` ở server. Ghim **cùng một phiên bản thuật toán**, ghi vào cột `fsrs_version`. Dùng chung bộ golden test vectors (`packages/fsrs-golden/`); lệch là build lỗi. Trước khi cài, đối chiếu repo `open-spaced-repetition` để biết phiên bản hiện hành.
- **Log ôn (`review_logs`) là append-only.** Không viết code sửa hoặc xóa log. Trạng thái thẻ (`user_cards`) là dữ liệu dẫn xuất, dựng lại bằng replay theo thời gian.
- **Chống trùng khi sync:** khóa `(user_id, card_id, reviewed_at)`; endpoint `/v1/sync` phải idempotent; lệch `fsrs_version` trả 409.
- **Adapter cho mọi nhà cung cấp AI** (ASR, LLM, TTS) trong `services/api/app/providers/`, mỗi loại có bản mock. Đổi nhà cung cấp chỉ sửa một tệp.
- **Chấm giọng nói:** Whisper là ASR, không phải bộ chấm phát âm. Tính năng tên là **"độ dễ hiểu (intelligibility)"**, tuyệt đối không đặt tên hoặc quảng cáo là "chấm phát âm" trong UI, mã, hay tài liệu.
  - Anh so khớp theo từ (WER), Nhật theo kana (CER), Hàn theo jamo (CER).
  - Nghi im lặng/ảo giác (`no_speech_prob`, `avg_logprob`): trả `silence_suspect = true`, `intelligibility = null`, KHÔNG bịa điểm.
  - Luôn truyền `language` cố định cho ASR; không để tự nhận dạng.
  - Không phát biểu lỗi phát âm mà không có bằng chứng kèm theo.
- **Hội thoại:** `corrections` tối đa 2 phần tử mỗi lượt; lỗi chỉ thành thẻ khi người dùng xác nhận (`/v1/errors/{id}/save-as-card`).
- **Nội dung:** chỉ hiển thị mục có `qa_status` là `sampled` hoặc `verified` (đã có RLS). Mọi mục nội dung lưu `source` và `license`.
- **Hạn mức và chi phí:** mọi lần gọi dịch vụ AI ghi một dòng vào `usage_ledger`; kiểm tra quota trước khi gọi. Hết hạn mức thì chặn hội thoại nhưng vẫn cho học và ôn thẻ.

## Bảo mật và quyền riêng tư
- **Không đưa khóa API hay bí mật vào mã hoặc commit.** Dùng biến môi trường; có `.env.example`; `.env` nằm trong `.gitignore`.
- **Mặc định không lưu audio thô**; xóa sau khi xử lý, trừ khi `profiles.store_raw_audio = true`.
- Không gửi thông tin định danh cá nhân vào prompt LLM.
- Mọi bảng dữ liệu người dùng có Row Level Security; ghi vào `usage_ledger`, `user_fsrs_params`, `conversation_turns` bằng service role phía server.
- Giới hạn độ dài audio (≤ 30 giây) và rate limit mỗi người dùng.

## UX
- Mỗi màn hình một nhiệm vụ chính (giảm tải nhận thức); phiên học 3–5 phút.
- Chế độ nhắn tin phải đủ tính năng như chế độ giọng nói (người dùng có thể không nói to được).
- Không dùng dark pattern với streak: có chế độ nghỉ, không phạt quá mức.

## Phong cách
- Tài liệu, thông điệp giao diện và chú thích viết **tiếng Việt**; giữ thuật ngữ kỹ thuật tiếng Anh chuẩn (Spaced Repetition, intelligibility, idempotent...).
- Tên biến, hàm, tệp bằng tiếng Anh.
- Viết test cho logic quan trọng: SRS, chuẩn hóa văn bản, so khớp, quota. Có test cho ca biên: ASR trả rỗng, audio im lặng, log trùng, lệch phiên bản FSRS.