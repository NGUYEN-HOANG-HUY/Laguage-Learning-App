# CHECKPOINT 1 — Nền tảng Website học ngoại ngữ

## 1) Đã làm gì

- Kiểm tra workspace: repo đã có Expo app ở `apps/mobile`, nhưng chưa có web app hoặc package manifest cho web.
- Tạo `apps/web/src/types/learning.ts` cho ngôn ngữ, CEFR level, card, lesson, trạng thái SM-2 và review event.
- Tạo `apps/web/src/utils/srs.ts` triển khai SM-2 với bốn mức đánh giá và kiểm tra input.
- Tạo `apps/web/src/data/sampleLessons.ts` gồm ba tình huống tiếng Anh A2–B1, tổng cộng chín từ/cụm từ có IPA, nghĩa và câu ví dụ.
- Gắn `contentStatus: 'sample'` cho nội dung minh họa; chưa khẳng định nội dung đã được chuyên gia ngôn ngữ duyệt.
- Không sửa Expo app, cấu hình nhạy cảm hoặc cài dependency.

## 2) Kết quả kiểm tra và phát hiện chính

- [ĐÃ XÁC MINH] TypeScript strict check cho ba file mới đạt bằng TypeScript sẵn có trong `apps/mobile`.
- [ĐÃ XÁC MINH] Kiểm tra runtime SM-2 đạt: Again reset repetition/tăng lapse và hẹn sau một ngày; Good tạo khoảng một ngày ở lần đầu, sáu ngày ở lần kế tiếp.
- [ĐÃ XÁC MINH] Kiểm tra dữ liệu runtime đạt: ba lesson, chín cards, toàn bộ có ngôn ngữ `en` và trạng thái `sample`.
- [ĐÃ XÁC MINH] `apps/web` hiện chưa có `package.json`, Vite config hoặc UI; `npm run dev` chưa khả dụng ở checkpoint này.
- Do `docs/checkpoints/CP1.md` đã tồn tại cho giai đoạn nghiên cứu trước, checkpoint website được lưu riêng ở `CP1-web.md` để không ghi đè lịch sử.

## 3) Giả định

- [GIẢ ĐỊNH] Website dùng SM-2 riêng theo yêu cầu mới; không thay đổi FSRS đang dùng trong Expo Mobile.
- [GIẢ ĐỊNH] Mapping quality cho SM-2 là Again=1, Hard=3, Good=4, Easy=5.
- [GIẢ ĐỊNH] Một lần Again được hẹn lại sau một ngày; lần trả lời đúng đầu tiên sau một ngày, lần thứ hai sau sáu ngày, các lần sau nhân ease factor.
- [GIẢ ĐỊNH] Mẫu từ/câu và IPA được tự soạn để minh họa MVP, cần rà soát ngôn ngữ trước khi phát hành.

## 4) Rủi ro

- Mapping bốn nút và cách hẹn Again cần được duyệt trước khi storage/UI phụ thuộc vào lịch này.
- Sample content chưa được chuyên gia/người bản ngữ kiểm tra; không dùng làm nội dung phát hành.
- Chưa có package/Vite shell, persistence, AI adapter hoặc giao diện; website chưa chạy độc lập.

## 5) Quyết định cần duyệt

1. Duyệt mapping Again=1, Hard=3, Good=4, Easy=5 và lịch Again +1 ngày.
2. Duyệt ba tình huống cùng bộ từ/câu mẫu là dữ liệu demo chưa kiểm duyệt.

## 6) Kế hoạch tiếp

Chỉ sau khi nhận được “DUYỆT”, thực hiện Bước 2: tạo tầng `services/storage.ts` với LocalStorage có versioning/migration và `services/aiService.ts` Mock AI theo ngữ cảnh, kèm kiểm thử. Chưa bắt đầu UI hoặc nối API thật.
