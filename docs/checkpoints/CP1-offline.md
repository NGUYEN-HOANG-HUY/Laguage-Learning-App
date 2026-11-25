# CHECKPOINT 1 — Nền tảng học offline deterministic

## 1) Đã làm gì

- Xác nhận workspace có `apps/mobile` (Expo) và `apps/web` (domain/services TypeScript đã khởi tạo); giới hạn bước này trong `apps/web`, không thay đổi Mobile.
- Mở rộng `apps/web/src/types/learning.ts` với kiểu choice/node/tree hội thoại và nội dung từ vựng có collocation/grammar note.
- Giữ nguyên thuật toán hiện có trong `apps/web/src/utils/srs.ts`; bổ sung test SM-2 cho Again, Hard, Good, ease-factor floor, interval và input không hợp lệ.
- Tạo `apps/web/src/data/dialogueTrees.ts` với hai cây hội thoại có nhánh: nhà hàng và phỏng vấn.
- Tạo `apps/web/src/data/sampleContent.ts` làm nguồn nội dung thống nhất cho chín từ/cụm từ, ví dụ, collocation, ghi chú ngữ pháp và hai kịch bản.
- Giữ tương thích với storage hiện có bằng cách chuyển `apps/web/src/data/sampleLessons.ts` thành re-export từ nguồn nội dung mới.
- Thêm kiểm tra tính toàn vẹn link node, lựa chọn nhánh và kết thúc kịch bản.
- Không sửa `docs/PRD.md`; thay đổi chưa commit ở tiêu đề file này được giữ nguyên ngoài commit.

## 2) Kết quả kiểm tra và phát hiện chính

- [ĐÃ XÁC MINH] `node --experimental-strip-types --test apps/web/src/utils/srs.test.mjs apps/web/src/data/sampleContent.test.mjs apps/web/src/services/storage.test.mjs apps/web/src/services/aiService.test.mjs`: 16/16 test đạt.
- [ĐÃ XÁC MINH] Strict TypeScript check đạt cho types, SM-2, sample content, dialogue trees, storage và Mock AI bằng TypeScript sẵn có của mobile workspace.
- [ĐÃ XÁC MINH] Cả hai dialogue tree có node đích hợp lệ cho mọi choice, có start node và có kết thúc.
- [ĐÃ XÁC MINH] Các ID thẻ hiện tại được giữ nguyên để storage bootstrap/migration v0 tiếp tục hoạt động.
- Chưa có giao diện/persistence UI; Bước 1 chỉ hoàn thiện domain, lịch SRS và dữ liệu/kịch bản.

## 3) Giả định

- [GIẢ ĐỊNH] Website offline deterministic tiếp tục được phát triển độc lập trong `apps/web`; không thay thế Expo app hoặc API/backend hiện hữu.
- [GIẢ ĐỊNH] Các đáp án/nhận xét giao tiếp là nội dung mẫu minh họa, chưa được chuyên gia/người bản ngữ kiểm duyệt.
- [GIẢ ĐỊNH] SM-2 hiện tại vẫn dùng mapping Again=1, Hard=3, Good=4, Easy=5 và lịch Again một ngày như CP1-web đã ghi.

## 4) Rủi ro

- Nhánh hội thoại và cách diễn giải sắc thái cần được rà soát ngôn ngữ trước khi dùng làm nội dung phát hành.
- Các lựa chọn đáp án và phản hồi đang cố định trong dữ liệu; bước kế tiếp cần đảm bảo UI trình bày phản hồi sư phạm, không suy diễn thành điểm năng lực chuẩn hóa.
- Test TypeScript dùng compiler sẵn có trong `apps/mobile`; website chưa có package manifest hoặc dev server ở bước này.

## 5) Quyết định cần duyệt

1. Duyệt cấu trúc hai cây hội thoại nhà hàng/phỏng vấn và các nhánh phản hồi.
2. Duyệt chín nội dung tiếng Anh A2–B1 là sample content chưa qua kiểm duyệt chuyên gia.
3. Duyệt tiếp tục giữ Website offline trong `apps/web` tách biệt khỏi Expo Mobile/backend.

## 6) Kế hoạch tiếp

Chỉ sau khi nhận được “DUYỆT”, thực hiện Bước 2 của kiến trúc deterministic: tạo `utils/exerciseEngine.ts` cho Cloze/Scramble và so khớp câu có phản hồi giải thích; mở rộng `services/storage.ts` để lưu review/streak/error history và Export/Import JSON; bổ sung test cho logic và dữ liệu nhập lỗi.
