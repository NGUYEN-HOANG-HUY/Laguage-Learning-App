# 08 — Lộ trình MVP bốn tuần (bản nháp Giai đoạn 3)

**Giả định nguồn lực:** một lập trình viên full-stack, bốn tuần là cấu hình từ `MASTER_PROMPT.md`; không phải cam kết ngày phát hành.

## Tuần 1 — Nền tảng và contract

- **Mục tiêu:** dựng React/Vite/TypeScript, FastAPI Python 3.11, PostgreSQL, Docker Compose; migrations và local seed tối thiểu.
- **Bàn giao:** health endpoint, UI shell, schema D5, OpenAPI; `.env.example` chỉ có placeholder.
- **Hoàn thành khi:** một lệnh chạy stack local; không có key thật; schema validation và smoke test API qua.
- **Cắt giảm:** chưa auth ngoài local fixture, chưa production deployment, chưa thanh toán.

## Tuần 2 — SRS và độ dễ hiểu

- **Mục tiêu:** implementar FSRS candidate + SM-2 comparator; scorer word/kana/jamo.
- **Bàn giao:** unit/golden tests và mô phỏng SRS; tối thiểu 10 ca/ngôn ngữ cho scorer, gồm transcript rỗng/ảo giác.
- **Hoàn thành khi:** vectors Python/TypeScript khớp trên trường hợp được hỗ trợ; mọi sai khác làm client không thể ghi lịch cuối; scorer nêu substitutions/deletions/insertions và không tuyên bố phoneme score.
- **Cắt giảm:** không tối ưu FSRS từ dữ liệu người dùng; không tự chấm giọng/audio quality.

## Tuần 3 — Turn API và demo UX

- **Mục tiêu:** `/turn`, adapters mock ASR/LLM/TTS, quota/usage ledger, review screen và chat text/voice state.
- **Bàn giao:** JSON schema, corrections tối đa hai mục, target words, text fallback, UI so khớp.
- **Hoàn thành khi:** quota chặn provider mock đúng lúc; retry idempotent; ASR mock empty/uncertain không tạo gợi ý phát âm giả.
- **Cắt giảm:** không gọi API thật, không đăng nhập thật, không audio persistence.

## Tuần 4 — Tích hợp, accessibility, đóng gói

- **Mục tiêu:** tích hợp toàn luồng, review privacy/security, README, test smoke và tài liệu rủi ro.
- **Bàn giao:** compose chạy một lệnh, kết quả test thực tế, ảnh chụp UI, known limitations.
- **Hoàn thành khi:** cài mới chạy được theo README; lỗi test được xử lý/ghi rõ; không có secret hoặc PII mẫu; lưu ý benchmark và giá đều không bị trình bày như production fact.
- **Cắt giảm:** không scale/load certification, không payment, không production migrations/realtime provider, không hiệu quả sư phạm claim.

## Backlog ưu tiên

| Ưu tiên | Hạng mục | Lý do / điều kiện |
|---|---|---|
| P0 | Secret handling, privacy consent, quota, provider adapters | Ngăn rò rỉ dữ liệu/chi phí và khóa provider |
| P0 | SRS event model, package parity vectors, idempotent sync | Không làm sai lịch ôn khi offline |
| P0 | WER/CER và lỗi edit operations; fallback ASR uncertain | Ranh giới “độ dễ hiểu”, tránh chấm âm vị |
| P1 | Structured output + max corrections | Kiểm soát phản hồi/QA |
| P1 | Text mode, keyboard access, screen-reader labels | UX cần dùng được ở nơi không tiện nói |
| P1 | Review/curation/license workflow | Ngăn phát hành nội dung chưa duyệt |
| P2 | Auth OIDC production, provider thật, monitoring backend | Sau prototype và privacy/security review |
| P2 | Offline content download, billing, A/B platform | Chỉ sau quyết định CP3, cost model và consent |

## Giả định và rủi ro lịch

- [GIẢ ĐỊNH] Năng lực đội là một người và khung bốn tuần theo `MASTER_PROMPT.md`; chưa có sizing dựa trên codebase hiện hành.
- [SUY LUẬN] Vector parity FSRS, `ja` kana normalization và quyền xử lý audio là critical path; nếu bất kỳ mục nào chưa đạt, cắt voice persistence/production integration thay vì hạ tiêu chí đúng/safety.
- Chưa có cơ sở để cam kết ngày cụ thể hoặc release date.
