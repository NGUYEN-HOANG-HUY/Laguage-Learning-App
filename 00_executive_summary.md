# Tóm tắt điều hành — Bản nháp Giai đoạn 2

**Ngày:** 23/11/2026
**Trạng thái:** Bản nháp chờ duyệt; không phải kết luận đầu tư hay cam kết tiến độ.

## Cơ hội và đề xuất

[ĐÃ XÁC MINH] Báo cáo nghiên cứu Giai đoạn 1 cho thấy các đối thủ được xem xét phân bố giữa giáo trình, luyện nói, nội dung và SRS; một số đã có hội thoại AI, đồng thời trợ lý đa dụng cũng hỗ trợ thực hành hội thoại. Báo cáo chưa tìm thấy bằng chứng độc lập đủ để xếp hạng hiệu quả từng ứng dụng, và mẫu review chỉ là mẫu tiện lợi. (D1, mục 3–4, 9–10; nguồn S01–S18, S33; nguồn truy cập 22/11/2026.)

[SUY LUẬN] Không nên định vị sản phẩm bằng “có AI voice”. Nên thử một vòng học ngắn gắn nhiệm vụ giao tiếp với phản hồi giới hạn, mục tiêu từ/cụm từ và lần truy hồi sau đó. Khác biệt này hiện là giả thuyết cần đo, không phải moat đã xác minh.

## Người dùng và sản phẩm

[GIẢ ĐỊNH] Nhóm pilot đề xuất là người lớn Việt Nam luyện giao tiếp tiếng Anh; người học tiếng Nhật/Hàn là nhóm mở rộng sau khi có nội dung và reviewer tương ứng. Chọn nhóm này để giảm biến số trong pilot, không phải vì có dữ liệu thị trường chứng minh đây là phân khúc lớn hơn.

Luồng MVP: chọn tình huống → nói hoặc nhắn tin → nhận tối đa 1–2 gợi ý có căn cứ hoặc câu hỏi làm rõ → dùng mục tiêu trong ngữ cảnh → ôn lại. ASR chỉ đưa transcript và tín hiệu “độ dễ hiểu”; không tuyên bố chấm âm vị hay phát âm chuẩn. Giọng nói chỉ được thu khi người học chủ động đồng ý; mặc định không lưu audio sau xử lý là đề xuất cần duyệt pháp lý/kiến trúc.

## Kiểm chứng trước khi mở rộng

1. Thử “người nghe có hiệu chuẩn”: hỏi lại khi transcript mơ hồ và đo hoàn thành đúng ý, không xem số lần nói lại là thành công tự thân.
2. So sánh dùng lại mục tiêu trong hội thoại với ôn thẻ tách rời; đo recall trì hoãn và dùng trong prompt mới.
3. So sánh một gợi ý sửa với tối đa hai; đo áp dụng sửa lỗi và tải nhận thức.

Retention D1/D7/D30, số từ nói mỗi phút, chi phí AI/MAU, recall và transfer sẽ được định nghĩa và đo riêng. Chưa có baseline, sample size, ngưỡng thành công hay chi phí sản xuất được xác minh; không tuyên bố sản phẩm cải thiện năng lực trước khi có kết quả.

## Mô hình kinh doanh và rủi ro

[GIẢ ĐỊNH] Freemium với quota rõ ràng và thuê bao là mô hình để thử; chưa đặt giá hoặc quota. WTP, conversion, churn, chi phí/phiên và hòa vốn **CHƯA XÁC MINH**; cần cost model trước thử giá.

Ưu tiên rủi ro: quyền riêng tư audio; transcript/feedback sai; nội dung sai ở Nhật/Hàn; tiến bộ bị đo bằng streak; chi phí/quota; giấy phép dữ liệu; lệch phiên bản SRS; phân phối. Rào chắn là không chấm âm vị, hỏi lại khi ASR mơ hồ, duyệt nội dung, tắt/bỏ qua được, không lưu audio mặc định và đo transfer độc lập.

## Quyết định cần duyệt

- Định vị vòng luyện ngắn thay vì “AI chấm phát âm”.
- Pilot tiếng Anh trước; Nhật/Hàn mở rộng theo điều kiện reviewer và chất lượng nội dung.
- Freemium + thuê bao là giả thuyết, chưa định giá.
- Thiết kế consent/retention của audio và ba thí nghiệm E1–E3.

**Tài liệu chi tiết:** `03_PRD.md`, `09_risk_register.md`, `01_research_report.md`.
**Nguồn chính:** D1, truy cập 23/11/2026; nguồn D1 S01–S18, S28–S33 được truy cập 22/11/2026. Mọi phân khúc, tác động, mô hình giá và ưu thế sản phẩm chưa được kiểm chứng đều được gắn nhãn giả định/suy luận.