# Mobile app

## Chạy ứng dụng

Từ thư mục `apps/mobile`:

```powershell
npm ci
npx expo start
```

Mở ứng dụng bằng Expo Go hoặc giả lập theo hướng dẫn của Expo. Các lệnh kiểm tra:

```powershell
npm run typecheck
npm run lint
npm test
npx expo export --platform web
```

## Phạm vi hiện tại

- Đăng nhập và dữ liệu học cần cấu hình Supabase theo thiết lập hiện có trong dự án.
- Trang chủ hiển thị streak, số thẻ đến hạn và tiến độ; thống kê được tải lại khi quay về từ màn ôn tập.
- Màn ôn tập dùng hàng đợi và lưu trữ SRS hiện có.
- Luyện hội thoại hiện chỉ dùng `src/lib/aiService.ts` dạng **Mock AI**: phản hồi và một số gợi ý sửa được viết sẵn, không gọi LLM, ASR, TTS hay API `/turn`. Không dùng nội dung này để đánh giá năng lực thật.

Không đặt khóa API trong mã nguồn. Chưa cấu hình adapter AI thật trong bước giao diện này.
