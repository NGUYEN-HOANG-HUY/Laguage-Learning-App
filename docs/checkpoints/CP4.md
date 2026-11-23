# CHECKPOINT 4 — Kiểm thử runtime giao diện

## 1) Đã làm gì

- Khởi động Expo Web bằng `npx expo start --web --port 8081`.
- Xác nhận server lắng nghe cổng 8081 và trả HTTP 200.
- Mở ứng dụng trên trình duyệt: tiêu đề “Language Learning App” và màn đăng nhập được render.
- Theo dõi sau reload: không có JavaScript page error hoặc console error.
- Dừng Expo dev server sau kiểm thử.
- Expo cập nhật `apps/mobile/tsconfig.json` để include các tệp TypeScript và `.expo/types`; giữ thay đổi cấu hình do CLI tạo.

## 2) Phát hiện chính

- [ĐÃ XÁC MINH] `apps/mobile/.env.example` chỉ có placeholder cho `EXPO_PUBLIC_SUPABASE_URL` và `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- [ĐÃ XÁC MINH] Không có `apps/mobile/.env`; ứng dụng hiển thị đúng thông báo cần cấu hình Supabase. Vì vậy không thể đăng nhập để đi tới Dashboard, ôn SRS hoặc Roleplay.
- [ĐÃ XÁC MINH] Máy hiện không có `adb`, Android emulator CLI hoặc `xcrun`; không thể kiểm thử trên emulator/thiết bị iOS/Android trong phiên này.
- [CHƯA KIỂM THỬ] Các thao tác đăng nhập và luồng sau đăng nhập trên thiết bị thật/giả lập.

## 3) Giả định

- [GIẢ ĐỊNH] Người dùng sẽ cấu hình Supabase trong `.env` cục bộ, không gửi khóa hoặc secret qua Chat và không commit `.env`.
- [GIẢ ĐỊNH] Kiểm thử runtime đầy đủ cần một Supabase project đã cấu hình cùng tài khoản thử nghiệm và emulator/thiết bị có thể chạy Expo.

## 4) Rủi ro và giới hạn

- Chỉ xác nhận được màn đăng nhập trên trình duyệt khi Supabase chưa cấu hình; kết quả không chứng minh các màn sau đăng nhập hoạt động runtime.
- Không có xác nhận về thao tác SRS, hội thoại, layout native, quyền truy cập hoặc hành vi trên iOS/Android.
- Chưa có lỗi runtime cần sửa được quan sát trong phần màn hình khả dụng.

## 5) Quyết định cần duyệt

1. Duyệt kết quả smoke test giới hạn ở Expo Web/màn đăng nhập.
2. Cấp điều kiện kiểm thử còn thiếu bằng cách cấu hình Supabase cục bộ và bật emulator/thiết bị; giữ thông tin xác thực ngoài Chat và ngoài Git.

## 6) Kế hoạch tiếp

Sau khi checkpoint được duyệt và môi trường sẵn sàng, chạy lại Expo rồi kiểm thử lần lượt đăng nhập, Dashboard, mở hàng đợi/đánh giá SRS, quay về cập nhật thống kê và hội thoại Mock AI. Sửa các lỗi runtime quan sát được; không thay thế Supabase bằng mock auth hoặc tuyên bố các luồng sau đăng nhập đã được kiểm thử khi chưa chạy.
