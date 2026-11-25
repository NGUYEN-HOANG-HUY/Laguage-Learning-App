# CHECKPOINT 2 — Lưu trữ cục bộ và Mock AI

## 1) Đã làm gì

- Tạo `apps/web/src/services/storage.ts` với LocalStorage key ổn định, envelope `version: 1`, bootstrap dữ liệu mẫu, đọc/ghi, hàng đợi thẻ đến hạn và ghi `ReviewEvent`.
- Thêm migration từ schema `version: 0` dạng progress map sang v1; migration giữ lịch SM-2 theo card ID, khởi tạo metadata mới và báo lỗi nếu dữ liệu cũ không hợp lệ hoặc tham chiếu card không tồn tại.
- Tạo `apps/web/src/services/aiService.ts` với ba tình huống gọi món/phỏng vấn/công sở; phản hồi dựa trên nội dung và lịch sử, có bốn mẫu sửa câu cơ bản, giới hạn tối đa hai correction.
- Bổ sung kiểu chat/correction/turn trong `types/learning.ts`; đổi import runtime trong `sampleLessons.ts` sang `.ts` để chạy kiểm thử Node native.
- Tạo `storage.test.mjs` và `aiService.test.mjs`, dùng Node test runner, không thêm dependency hoặc API key.

## 2) Kết quả kiểm tra và phát hiện chính

- [ĐÃ XÁC MINH] TypeScript strict check các file web đạt bằng TypeScript sẵn có ở `apps/mobile`.
- [ĐÃ XÁC MINH] `node --experimental-strip-types --test apps/web/src/services/storage.test.mjs apps/web/src/services/aiService.test.mjs`: 10/10 test đạt.
- [ĐÃ XÁC MINH] Storage báo lỗi rõ ràng với JSON hỏng, schema không hỗ trợ, dữ liệu v1 không hợp lệ và migration tham chiếu card không tồn tại; không tự xóa/reset dữ liệu lỗi.
- [ĐÃ XÁC MINH] Mock AI trả `provider: 'mock'`, không gọi API thật và giới hạn tối đa hai gợi ý sửa mỗi lượt.
- `apps/web` chưa có `package.json`/Vite shell; chưa thể chạy `npm run dev` trong checkpoint này.

## 3) Giả định

- [GIẢ ĐỊNH] Schema v0 cần migration chỉ là progress map theo card ID; chưa có bản web cũ hoặc dữ liệu người dùng thực tế cần migrate.
- [GIẢ ĐỊNH] LocalStorage chỉ lưu trên cùng trình duyệt/thiết bị; chưa có đồng bộ giữa thiết bị.
- [GIẢ ĐỊNH] Bộ sửa ngữ pháp Mock AI chỉ bao phủ một số mẫu cơ bản, không thay thế giáo viên hoặc LLM thật.

## 4) Rủi ro

- Nếu đổi ID sample card trước migration, tiến độ v0 sẽ bị từ chối có chủ đích thay vì tự ghép sai card.
- Dữ liệu LocalStorage có thể bị trình duyệt xóa hoặc không khả dụng trong chế độ riêng tư; UI ở Bước 3 cần hiển thị lỗi lưu/thử lại rõ ràng.
- Chưa có package script để chạy test; hiện phải gọi Node trực tiếp bằng `--experimental-strip-types`.

## 5) Quyết định cần duyệt

1. Duyệt schema LocalStorage v1 và migration v0 progress map theo card ID.
2. Duyệt phạm vi Mock AI: ba tình huống và correction heuristic giới hạn, không gọi dịch vụ ngoài.

## 6) Kế hoạch tiếp

Chỉ sau khi nhận được “DUYỆT”, thực hiện Bước 3: tạo Vite/React shell và giao diện Dashboard, SRS, hội thoại; nối với `storage.ts` và `aiService.ts`. Không thêm API thật hoặc tuyên bố Mock AI là mô hình AI đang chạy.
