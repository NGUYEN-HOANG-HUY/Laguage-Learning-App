# CHECKPOINT 0 — Lập kế hoạch

## 1) Đã làm được gì

- Đọc `MASTER_PROMPT.md` và `CLAUDE.md`.
- Xác định chỉ dẫn trong `MASTER_PROMPT.md` yêu cầu bắt đầu Giai đoạn 0.
- Kiểm tra cấu trúc repo: hiện chỉ có `MASTER_PROMPT.md`, `CLAUDE.md` và thư mục `.kilo`; chưa có thư mục `docs/` hay tài liệu đầu vào nào trong `docs/`.
- Lập kế hoạch thực thi dưới đây. Chưa thu thập dữ liệu thị trường, chưa tạo các deliverable D1–D10 và chưa thực hiện giai đoạn khác.
- Công cụ web có sẵn trong phiên; chưa kiểm tra hay trích dẫn nguồn web ở giai đoạn lập kế hoạch.

## 2) 5–7 phát hiện quan trọng nhất

1. [ĐÃ XÁC MINH] `MASTER_PROMPT.md` chỉ dẫn bắt đầu Giai đoạn 0 và yêu cầu dừng ở checkpoint để chờ duyệt.
2. [ĐÃ XÁC MINH] Quy mô đối thủ tối thiểu theo prompt là 17–20 sản phẩm/dịch vụ: 10 đối thủ nêu tên, 2 trợ lý đa dụng, 3–5 ứng dụng có mặt tại Việt Nam và 2–3 ứng dụng chuyên tiếng Nhật hoặc Hàn.
3. [SUY LUẬN] Nếu áp dụng yêu cầu tối thiểu 30 đánh giá gần đây cho từng đối thủ, giai đoạn nghiên cứu cần tổng hợp ít nhất khoảng 510–600 đánh giá. Cỡ mẫu thực tế còn phụ thuộc số đối thủ tìm được và khả năng truy cập dữ liệu.
4. [ĐÃ XÁC MINH] Prompt đặt thị trường Việt Nam làm ưu tiên, ngôn ngữ đích gồm Anh/Nhật/Hàn, và ngân sách AI beta mặc định là 300 USD/tháng; các giá trị này cần được ghi là cấu hình/giả định của dự án, không phải dữ liệu thị trường đã xác minh.
5. [ĐÃ XÁC MINH] Bộ đầu ra bao gồm nghiên cứu, PRD, kiến trúc, mô hình dữ liệu/API, mô hình chi phí, roadmap, risk register, prototype và executive summary; từng giai đoạn có checkpoint riêng.
6. [ĐÃ XÁC MINH] Yêu cầu kỹ thuật nhấn mạnh FSRS, đánh giá phát âm chỉ ở mức “độ dễ hiểu” cho MVP, quyền riêng tư giọng nói, kiểm soát nội dung AI và các nhãn độ tin cậy.
7. [SUY LUẬN] Chưa có tài liệu trong `docs/` để dùng làm nguồn đầu vào bổ sung; các kết luận giai đoạn sau cần dựa trên prompt và nguồn được tra cứu, không được xem mặc định dự án đã có nghiên cứu hay quyết định sản phẩm trước đó.

## 3) Các giả định đã phải đặt ra

- [GIẢ ĐỊNH] Thư mục gốc của repo hiện tại là thư mục gốc đầu ra mà `MASTER_PROMPT.md` gọi là `/edtech-language-app/`; các deliverable được đặt ở đó, còn checkpoint đặt trong `docs/checkpoints/` theo chỉ dẫn dự án.
- [GIẢ ĐỊNH] Dùng cấu hình mặc định trong prompt khi chưa có quyết định khác: Việt Nam trước, Anh/Nhật/Hàn, ngân sách AI beta 300 USD/tháng, một lập trình viên full-stack và MVP 4 tuần.
- [GIẢ ĐỊNH] “Đánh giá gần đây” sẽ được đề xuất là đánh giá trong 12 tháng gần nhất, ưu tiên nguồn Việt Nam khi có thể; đây là định nghĩa vận hành cần duyệt trước khi lấy mẫu.
- [GIẢ ĐỊNH] Tài liệu tiếng Việt; thuật ngữ kỹ thuật giữ bằng tiếng Anh khi phù hợp.

## 4) Điểm mâu thuẫn / dữ liệu thiếu / rủi ro vừa phát hiện

- Chưa xác định khoảng thời gian cụ thể cho khái niệm “đánh giá gần đây”; đề xuất 12 tháng để thống nhất cách lấy mẫu.
- Chưa có dữ liệu đầu vào trong `docs/`; hiện chỉ thấy prompt và chỉ dẫn dự án ở thư mục gốc.
- Giá, số người dùng, doanh thu, độ chính xác, hiệu quả học tập và phiên bản/phí dịch vụ có thể thay đổi. Giai đoạn 1 phải tra cứu nguồn phù hợp, ghi URL/ngày truy cập và phân biệt nguồn chính thức với nguồn độc lập; mục chưa được xác minh phải ghi rõ.
- Có thể không truy cập đủ đánh giá theo quốc gia hoặc lịch sử giá của một số ứng dụng; khi đó cần nêu cỡ mẫu, giới hạn thiên lệch và đánh dấu nội dung chưa xác minh, không suy diễn thành dữ kiện.
- Khối lượng thu thập đánh giá đáng kể (ước tính tối thiểu 510–600 đánh giá theo phạm vi tối thiểu nêu trên); cần ghi phương pháp chọn mẫu để tránh biến việc đọc đánh giá thành kết luận đại diện cho toàn bộ người dùng.
- Chưa kiểm chứng khả năng xuất PDF, XLSX, PNG/SVG và chạy prototype trong môi trường này; sẽ đánh giá khi tới đúng giai đoạn có deliverable tương ứng.

## 5) Các quyết định cần tôi chốt

1. **Khoảng thời gian “đánh giá gần đây”:** đề xuất dùng 12 tháng gần nhất tính đến ngày thu thập; nếu nền tảng không cho lọc theo thời gian thì ghi rõ giới hạn và ngày lấy mẫu.
2. **Phân bổ mẫu đánh giá:** đề xuất ưu tiên đánh giá tiếng Việt/thị trường Việt Nam khi có sẵn; với ứng dụng chuyên Nhật/Hàn, bổ sung đánh giá liên quan trực tiếp đến việc học ngôn ngữ đó và ghi rõ khu vực/ngôn ngữ của mẫu.
3. **Phạm vi tài liệu đầu vào:** hiện không có tệp trong `docs/`; nếu có tài liệu khác cần dùng ngoài prompt và `CLAUDE.md`, vui lòng bổ sung trước giai đoạn tương ứng.

## 6) Kế hoạch giai đoạn kế tiếp

Chỉ sau khi nhận được “DUYỆT”, thực hiện Giai đoạn 1:

- Chọn 3–5 ứng dụng bổ sung phổ biến/có mặt tại Việt Nam và 2–3 ứng dụng chuyên Nhật/Hàn theo tiêu chí: phù hợp người học Việt, tính năng liên quan trực tiếp đến học ngôn ngữ, có thông tin công khai kiểm chứng được và có thể khảo sát đánh giá.
- Thu thập dữ liệu đối thủ, tính năng, giá, quy mô, cơ chế giữ chân, công nghệ, bằng chứng học tập và đánh giá người dùng; với mỗi nhận định trọng yếu ghi nhãn tin cậy, URL, ngày truy cập và nguồn gốc.
- Tra cứu tài liệu chính thức cho dịch vụ AI, repo `open-spaced-repetition` và các thư viện FSRS; tìm nghiên cứu học thuật và nguồn nội dung mở, đồng thời ghi giấy phép.
- Tạo bản nháp D1 và ma trận D2 theo vị trí đầu ra ở thư mục gốc; lập danh mục rõ các mục “CHƯA XÁC MINH”.
- Kết thúc bằng `docs/checkpoints/CP1.md`, commit và dừng chờ duyệt; không tự chuyển sang Giai đoạn 2.
