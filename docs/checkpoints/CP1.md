# CHECKPOINT 1 — Thu thập và đối chiếu dữ liệu thực tế

## 1) Đã làm được gì

- Tạo `01_research_report.md` (bản nháp) với so sánh đối thủ, giá API, nguồn học thuật, tình trạng giấy phép dữ liệu, các mục **CHƯA XÁC MINH** và danh mục URL/ngày truy cập.
- Tạo ma trận D2 ở `02_feature_matrix.xlsx`, gồm sheet đối thủ, mẫu đánh giá, giá API và danh mục nguồn.
- Nghiên cứu 18 sản phẩm/dịch vụ đúng phạm vi tối thiểu: 10 đối thủ chính, 2 trợ lý đa dụng, 3 ứng dụng có mặt tại Việt Nam và 3 ứng dụng chuyên Nhật/Hàn.
- Lấy mẫu 531 đánh giá App Store trong giai đoạn 22/11/2025–22/11/2026: 17 sản phẩm đạt 30 đánh giá; Bunpro có 21 (6 từ cửa hàng Nhật, 15 từ cửa hàng Mỹ).
- Ghi rõ mọi số rating mẫu là rating App Store theo storefront; không lưu danh tính người đánh giá hay trích nguyên văn nội dung review.
- Kiểm tra trạng thái FSRS trên repo chính thức, tài liệu giá API và một nguồn nghiên cứu MALL.

## 2) 5–7 phát hiện quan trọng nhất

1. [ĐÃ XÁC MINH] Danh sách đủ 18 sản phẩm; chọn eJOY, Cake, MochiVocab cho nhóm có mặt tại Việt Nam và LingoDeer, Bunpro, Teuida cho nhóm Nhật/Hàn.
2. [SUY LUẬN] Mẫu đánh giá đạt 531/540 theo mục tiêu 30 mỗi sản phẩm; thiếu 9 đánh giá cho Bunpro sau khi tìm trong cửa hàng Nhật/Mỹ. Mẫu rating tiện lợi không đại diện toàn bộ người dùng.
3. [ĐÃ XÁC MINH] Giá tiêu dùng Việt Nam chưa xác định được nhất quán cho đa số app; trang MochiVocab có giá hiển thị nhưng đồng thời có các thời hạn/ưu đãi khác nhau, cần xác nhận checkout.
4. [ĐÃ XÁC MINH] Bằng chứng marketing về quy mô của một số hãng là tự công bố và dùng các định nghĩa khác nhau (downloads, learners, registered users); không thể so sánh thành thị phần. Doanh thu/ARPU nhiều hãng **CHƯA XÁC MINH**.
5. [ĐÃ XÁC MINH] Mức giá API dùng đơn vị khác nhau; tính chi phí mỗi lượt hoặc mỗi người dùng/tháng cần một kịch bản thực đo, thuộc Giai đoạn 3.
6. [ĐÃ XÁC MINH] Repo FSRS công bố FSRS-7 với 34 parameters và 11 tham số định hình forgetting curve; `ts-fsrs` README nêu hỗ trợ FSRS-7. `py-fsrs` mới nhất truy cập được là v6.3.3 nhưng chưa xác nhận tương thích thuật toán với client.
7. [SUY LUẬN] Nguồn nghiên cứu tìm được về MALL không đủ để xếp hạng hiệu quả từng app; chưa có bằng chứng peer-reviewed cụ thể cho người học Việt và từng sản phẩm trong danh sách.

## 3) Các giả định đã phải đặt ra

- [GIẢ ĐỊNH — ĐÃ ĐƯỢC DUYỆT TẠI CP0] “Đánh giá gần đây” là từ 22/11/2025 đến ngày lấy dữ liệu 22/11/2026.
- [GIẢ ĐỊNH — ĐÃ ĐƯỢC DUYỆT TẠI CP0] Ưu tiên storefront Việt Nam; dùng Mỹ/Nhật khi storefront Việt Nam không cung cấp đủ mẫu hoặc khi phù hợp sản phẩm chuyên ngôn ngữ.
- [GIẢ ĐỊNH] Rating tổng của Apple Store chỉ dùng làm snapshot về phản hồi cửa hàng, không dùng làm chỉ số hiệu quả học tập.
- [GIẢ ĐỊNH] Trang giá MochiVocab phản ánh một offer hiển thị tại thời điểm truy cập, không phải giá niêm yết ổn định hay xác nhận checkout.

## 4) Điểm mâu thuẫn / dữ liệu thiếu / rủi ro vừa phát hiện

- Bunpro chưa đạt 30 đánh giá gần đây trong hai storefront có dữ liệu; không lấy đánh giá cũ để bù.
- Phân tích review hiện chủ yếu là rating/phân bố và đếm từ khóa sơ bộ; chưa hoàn tất mã hóa định tính nhất quán cho toàn bộ 18 sản phẩm. Đặc biệt, năm mẫu ngoài Việt Nam chưa được mã hóa chủ đề; không kết luận các nỗi đau lặp lại từ mẫu này.
- Chưa có mẫu Google Play review; kết quả từ App Store chịu thiên lệch nền tảng, quốc gia và người tự chọn đánh giá.
- Giá app tiêu dùng, hạn mức AI và tính năng có thể khác giữa Việt Nam, web/iOS/Android, trial và chương trình khuyến mãi.
- Giá API phụ thuộc đơn vị thanh toán, mô hình/region, ngôn ngữ, loại realtime/batch, lưu lượng đầu vào/ra và khuyến mãi; không thể so sánh trực tiếp các mức giá hiển thị.
- Tương thích FSRS-7 giữa `ts-fsrs` và `py-fsrs` chưa được chứng minh chỉ từ số phiên bản package; cần đọc implementation/test vectors trước khi triển khai.
- Bằng chứng về hiệu quả học, độ chính xác pronunciation assessment theo giọng người Việt, doanh thu/ARPU, quyền dùng thương mại và độ phủ ngôn ngữ của các dataset còn thiếu.

## 5) Các quyết định cần tôi chốt

1. **Bunpro thiếu 9 đánh giá so với ngưỡng 30:** đề xuất chấp nhận n=21 và giữ rõ giới hạn, hoặc yêu cầu mở rộng thêm một nguồn review công khai khác trước khi coi phần review của Giai đoạn 1 là hoàn tất.
2. **Mức hoàn thiện review synthesis:** đề xuất xem D1/D2 hiện tại là bản nháp nghiên cứu; nếu cần kết luận nỗi đau theo từng app, cần duyệt thêm thời gian để mã hóa định tính nhất quán và bổ sung Google Play khi truy cập được.
3. **MochiVocab pricing:** đề xuất giữ giá hiển thị ở trạng thái tham khảo, đánh dấu chưa xác minh checkout; không dùng làm căn cứ so sánh giá cho tới khi có xác nhận.
4. **Tương thích FSRS:** chưa cần chốt ở giai đoạn này; đề xuất kiểm tra tiếp ở Giai đoạn 3 và chỉ chọn cùng model version sau khi kiểm thử chéo giữa hai thư viện.

## 6) Kế hoạch giai đoạn kế tiếp

Chỉ sau khi nhận được “DUYỆT”, thực hiện Giai đoạn 2:

- Tổng hợp khoảng trống và lựa chọn định vị/phân khúc dưới dạng giả thuyết, không biến số liệu đối thủ thành kết luận willingness-to-pay.
- Viết bản nháp PRD (D3), risk register (D8) và executive summary (D10) theo yêu cầu trong `MASTER_PROMPT.md`.
- Thiết kế thí nghiệm để kiểm chứng ít nhất ba giả thuyết sư phạm/sản phẩm, bao gồm “người nghe có hiệu chuẩn”.
- Mang các mục chưa xác minh trong CP1 vào PRD/rủi ro và không tự hoàn tất quyết định về giá hoặc FSRS khi chưa có nguồn/bằng chứng.
- Kết thúc bằng `docs/checkpoints/CP2.md`, commit và dừng chờ duyệt; không tự chuyển sang Giai đoạn 3.
