# CHECKPOINT 2 — Chiến lược và PRD

## 1) Đã làm được gì

- Tạo `03_PRD.md` (bản nháp) gồm định vị, phân khúc/persona, Jobs-To-Be-Done, phạm vi MVP, user stories Given/When/Then, yêu cầu phi chức năng, UX, chỉ số, mô hình giá giả thuyết, thí nghiệm và lộ trình sau MVP.
- Tạo `09_risk_register.md` (bản nháp) với 14 rủi ro, mức xác suất/tác động định tính, biện pháp giảm thiểu, chỉ báo sớm và vai trò chủ trì.
- Tạo `00_executive_summary.md` (bản nháp) tóm tắt đề xuất và quyết định cần duyệt.
- Chưa xuất PDF cho D3; môi trường không có công cụ xuất PDF sẵn. Bản bàn giao hiện là Markdown.
- Đối chiếu D1 và `MASTER_PROMPT.md`; không dùng rating mẫu như bằng chứng hiệu quả học, không đặt giá/ARPU/độ chính xác hoặc kết quả học chưa được xác minh.
- Thiết kế ba thử nghiệm: “người nghe có hiệu chuẩn”, SRS gắn với ngữ cảnh so với ôn tách rời, và một so với tối đa hai gợi ý sửa.

## 2) 5–7 phát hiện quan trọng nhất

1. [ĐÃ XÁC MINH] D1 ghi nhận đối thủ thuộc nhiều nhóm sản phẩm và một số đã có hội thoại AI; nghiên cứu chưa xác lập ứng dụng nào hiệu quả hơn về học tập. (D1 mục 3, 9–10; nguồn S01–S18, S33; truy cập nguồn 22/11/2026.)
2. [SUY LUẬN] “Có hội thoại AI” không đủ làm định vị khác biệt; PRD đề xuất kiểm tra vòng luyện nối diễn đạt, phản hồi giới hạn, mục tiêu ngôn ngữ và truy hồi sau đó.
3. [GIẢ ĐỊNH] Người lớn Việt Nam luyện giao tiếp tiếng Anh là nhóm pilot đầu tiên; chưa có phỏng vấn, số liệu quy mô hay willingness-to-pay chứng minh lựa chọn này.
4. [GIẢ ĐỊNH] Hỗ trợ kỹ thuật Anh/Nhật/Hàn nhưng pilot nội dung một ngôn ngữ trước sẽ giảm rủi ro chất lượng so với ra mắt đồng thời cả ba; cần duyệt lựa chọn tiếng Anh.
5. [ĐÃ XÁC MINH] Ràng buộc dự án yêu cầu MVP chỉ đo “độ dễ hiểu”, không coi Whisper/ASR là bộ chấm phát âm; PRD giữ giới hạn này và không phát điểm âm vị. (`CLAUDE.md`, `MASTER_PROMPT.md` C2, đọc 23/11/2026; D1 nguồn S26 truy cập 22/11/2026.)
6. [SUY LUẬN] Retention, lượt nói và engagement không chứng minh transfer; PRD tách recall trì hoãn/nhiệm vụ mới khỏi chỉ số sử dụng.
7. [CHƯA XÁC MINH] Chưa có baseline, ngưỡng A/B, cỡ mẫu có power, giá, quota, chi phí/MAU, WTP, mốc CEFR hoặc hiệu quả riêng theo ngôn ngữ/người Việt.

## 3) Các giả định đã phải đặt ra

- [GIẢ ĐỊNH] Nhóm pilot là người lớn 18+; chưa xác định người học vị thành niên và yêu cầu bảo vệ tương ứng.
- [GIẢ ĐỊNH] Tiếng Anh được ưu tiên cho pilot; Nhật/Hàn mở rộng sau khi kiểm duyệt nội dung và chuẩn hóa.
- [GIẢ ĐỊNH] Mô hình freemium + thuê bao chỉ là phương án nghiên cứu; chưa ấn định giá, quota hoặc hạn mức.
- [GIẢ ĐỊNH] Audio mặc định không lưu sau xử lý; phải xác minh yêu cầu pháp lý, threat model, backup và consent trước production.
- [GIẢ ĐỊNH] Các nhãn xác suất/tác động trong D8 là đánh giá định tính ban đầu, không phải tần suất đo thực tế.
- [GIẢ ĐỊNH] Các thí nghiệm E1–E3 chỉ khởi chạy sau khi thống nhất quy trình tuyển mẫu, consent, power analysis, outcome và tiêu chí dừng.

## 4) Điểm mâu thuẫn / dữ liệu thiếu / rủi ro vừa phát hiện

- Chưa có hồ sơ phỏng vấn người dùng, dữ liệu segment, willingness-to-pay, baseline retention/transfer hay cost model.
- Tham vọng ba ngôn ngữ có thể vượt năng lực tạo và kiểm duyệt nội dung của một lập trình viên trong MVP; cần quyết định pilot tập trung hay ra mắt đồng thời.
- Thiết kế A/B chưa có cỡ mẫu hoặc ngưỡng thành công; không thể kết luận thống kê nếu không làm power analysis và đăng ký trước.
- Chính sách audio, thời gian lưu, xóa/backup, xử lý dữ liệu cá nhân và nghĩa vụ pháp lý **CHƯA XÁC MINH**; cần review chuyên môn trước pilot dùng audio thật.
- Chưa có nguồn phù hợp để ước lượng giờ đạt B1/B2 cho người học Việt theo từng ngôn ngữ; PRD không hứa hẹn mốc CEFR.
- D1 chỉ cung cấp ngày truy cập nguồn 22/11/2026; các thông tin thay đổi nhanh về sản phẩm/giá phải được kiểm tra lại trước quyết định định giá ở Giai đoạn 3.
- Yêu cầu PDF cho D3 trong danh mục đầu ra chưa hoàn tất; không cài thêm công cụ trong checkpoint này.

## 5) Các quyết định cần tôi chốt

1. **Định vị:** duyệt giả thuyết “vòng luyện ngắn: diễn đạt → phản hồi giới hạn → dùng lại → ôn”, không định vị là AI chấm phát âm?
2. **Phân khúc/ngôn ngữ pilot:** duyệt nhóm người lớn Việt Nam luyện giao tiếp tiếng Anh làm pilot; Nhật/Hàn mở rộng có điều kiện?
3. **Mô hình giá:** duyệt chỉ thử nghiệm freemium + thuê bao, chưa đặt mức giá hoặc quota cho tới khi có cost model?
4. **Voice/privacy:** duyệt nguyên tắc chỉ thu khi bật chủ động, mặc định không lưu audio sau xử lý, và phải hoàn tất consent/legal review trước production?
5. **Thí nghiệm:** duyệt E1–E3 và lấy recall/transfer, an toàn, UX làm tiêu chí thay vì engagement đơn thuần?

## 6) Kế hoạch giai đoạn kế tiếp

Chỉ sau khi nhận được “DUYỆT”, thực hiện Giai đoạn 3:

- Tạo D4 sơ đồ kiến trúc, luồng SRS/offline sync, hội thoại, chấm độ dễ hiểu và pipeline nội dung có QA.
- Tạo D5 schema SQL/OpenAPI nhất quán với PRD và xác định xử lý dữ liệu audio/quota.
- Tạo D6 mô hình chi phí có công thức; kiểm tra lại giá nhà cung cấp từ nguồn chính thức trước khi đưa số vào mô hình.
- Tạo D7 roadmap MVP bốn tuần và hoàn thiện D8 sau khi duyệt các lựa chọn PRD.
- Nêu rõ giả định ảnh hưởng cost; kết thúc CP3, commit và dừng chờ duyệt. Không bắt đầu Giai đoạn 4 trước khi checkpoint Giai đoạn 3 được duyệt.
