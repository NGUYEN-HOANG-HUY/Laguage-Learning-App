# CHECKPOINT 3 — Giao diện học tập

## 1) Đã làm được gì

- Thêm Trang chủ sau khi đăng nhập, hiển thị streak, số thẻ đến hạn, tiến độ và lối tắt tới ôn tập/hội thoại.
- Tái sử dụng luồng ôn tập SRS hiện có; thêm điều hướng về Trang chủ và tải lại thống kê sau khi ôn.
- Thêm màn hội thoại theo ba tình huống: gọi món, phỏng vấn và giao tiếp công sở; có trạng thái gửi, lỗi và gợi ý sửa câu.
- Vì repo chưa có `aiService.ts` hay endpoint `/turn`, màn hội thoại dùng Mock AI có nhãn rõ trong UI và được ghi giới hạn trong `apps/mobile/README.md`.
- Thêm kiểm thử cho tính streak theo ngày Việt Nam, phần trăm tiến độ và adapter Mock AI.

## 2) Kết quả kiểm tra

- `npm run typecheck` trong `apps/mobile`: đạt.
- `npm run lint` trong `apps/mobile`: đạt, không còn cảnh báo sau khi sửa thứ tự import.
- `npm test` trong `apps/mobile`: 3 test files, 20 tests đạt.
- `npx expo export --platform web`: export thành công.
- `git diff --check`: đạt.

## 3) Giả định

- [GIẢ ĐỊNH] Các tình huống hội thoại mẫu và câu sửa chỉ minh họa luồng UI; chưa được thẩm định sư phạm hoặc kiểm tra bởi người bản ngữ.
- [GIẢ ĐỊNH] Streak được tính theo ngày Việt Nam (UTC+7), phù hợp đối tượng người học mục tiêu.
- [ĐÃ XÁC MINH] Luồng hội thoại không gọi dịch vụ AI thật; phản hồi chỉ đến từ adapter Mock AI mới.

## 4) Rủi ro và giới hạn

- Số liệu Trang chủ cần Supabase và SQLite khả dụng; nếu không tải được dữ liệu, UI hiển thị lỗi để người dùng thử lại.
- Roleplay chưa có ASR/LLM/TTS, lưu hội thoại, usage ledger hoặc quota; các phần đó không thuộc bản giao diện này.
- Chưa xác nhận trải nghiệm trên thiết bị iOS/Android thật; kiểm tra hiện tại gồm typecheck, lint, unit test và web export.

## 5) Quyết định cần duyệt

1. Duyệt giao diện Trang chủ, luồng ôn tập và chat tình huống với nhãn Mock AI.
2. Xác nhận phạm vi Bước 4 là chạy trên thiết bị/giả lập, kiểm thử các luồng và xử lý lỗi runtime trước khi nối dịch vụ AI thật.

## 6) Kế hoạch tiếp

Chờ người dùng duyệt checkpoint. Sau khi duyệt, thực hiện Bước 4: chạy `npx expo start`, kiểm thử trên thiết bị/giả lập và sửa lỗi phát sinh; không tự nối AI thật khi chưa có endpoint và cấu hình được duyệt.
