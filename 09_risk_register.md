# 09 — Sổ đăng ký rủi ro (bản nháp Giai đoạn 2)

**Ngày:** 23/11/2026
**Trạng thái:** Bản nháp; xác suất/tác động là đánh giá định tính ban đầu `[SUY LUẬN]`, cần hiệu chỉnh sau prototype/pilot. Không phải số liệu thống kê.

| ID | Rủi ro | Xác suất | Tác động | Giảm thiểu / kiểm soát | Chỉ báo sớm | Chủ trì đề xuất |
|---|---|---|---|---|---|---|
| R1 | LLM tạo nội dung sai/ngượng hoặc không phù hợp ngữ cảnh tiếng Nhật/Hàn | Trung bình | Cao | Thư viện mục tiêu nhỏ do người có năng lực ngôn ngữ duyệt; giới hạn tự do sinh nội dung; yêu cầu schema; log phiên bản/prompt; nút báo lỗi; không đưa nội dung chưa duyệt thành bài học | Lỗi được giáo viên/người học báo; bất đồng người đánh giá; phản hồi vượt phạm vi ngữ cảnh | Product + Language reviewer |
| R2 | ASR rỗng/ảo giác khi im lặng hoặc transcript sai bị diễn giải thành lỗi phát âm | Trung bình | Cao | Chỉ gọi kết quả là transcript/độ dễ hiểu; kiểm tra transcript rỗng/độ tin cậy; hỏi lại/chuyển text; không chấm âm vị; lưu test cases theo ngôn ngữ | Tỷ lệ transcript rỗng/không khớp; gợi ý sửa không được người học xác nhận; hệ thống nói chắc khi dữ liệu mơ hồ | Engineering |
| R3 | Tiến bộ hiển thị gây hiểu lầm (streak/điểm thay cho năng lực) | Trung bình | Cao | Định nghĩa recall/transfer riêng; không dùng streak làm proxy duy nhất; bài kiểm tra mới, đánh giá mù điều kiện; gắn nhãn điểm do mô hình tạo | Engagement tăng nhưng transfer/recall không cải thiện; phản hồi “điểm không khớp năng lực” | Product + Learning reviewer |
| R4 | Chi phí ASR/LLM/TTS vượt ngân sách hoặc biến động | Trung bình | Cao | Quota, giới hạn thời lượng, provider adapter, cache nội dung, đo usage theo lượt; cost model trước khi bán; tắt rõ ràng khi vượt quota | Chi phí/MAU hoặc retry tăng; lượt miễn phí không giới hạn; giá provider đổi | Engineering + Product |
| R5 | Rò rỉ hoặc lưu giữ quá mức audio/transcript/dữ liệu cá nhân | Trung bình | Rất cao | Thu có consent, tối thiểu hóa, mặc định không lưu audio sau xử lý, xóa dữ liệu, phân quyền; không dùng audio train model mặc định; threat/privacy review và luật sư trước production | Audio xuất hiện trong log/backups ngoài chính sách; yêu cầu xóa không hoàn thành; consent không rõ | Engineering + Privacy/legal |
| R6 | Vi phạm giấy phép nội dung hoặc thiếu attribution | Trung bình | Cao | Chỉ dùng nội dung tự biên soạn hoặc có giấy phép được ghi nhận; lưu source/license/attribution; rà từng dataset/record; cách ly nội dung chưa xác minh | Thiếu trường license/source; khiếu nại; không thể xác định quyền thương mại | Content owner |
| R7 | Khóa chặt vào một ASR/LLM/TTS hoặc khác biệt model làm hỏng UX | Trung bình | Trung bình/Cao | Adapter interface; contract tests; model/version field; provider fallback có kiểm duyệt; không giả định giá/latency ổn định | Provider deprecation, schema drift, tăng latency/error, output chất lượng lệch | Engineering |
| R8 | Không tìm được kênh phân phối/khả năng chi trả; WTP thấp | Cao | Cao | Phỏng vấn trước; thử landing page/giá sau cost model; cohort nhỏ; chưa mua quảng cáo hay dự báo doanh thu | Khó tuyển người dùng ngoài mạng lưới; conversion thấp; người dùng từ chối quota/giá | Product/Growth |
| R9 | Tham vọng đồng thời cho Anh/Nhật/Hàn làm giảm chất lượng nội dung | Cao | Cao | Pilot một ngôn ngữ; test normalizer cho ba ngôn ngữ riêng; tiêu chí mở rộng theo reviewer/coverage; không dịch tự động rồi phát hành | Sửa lỗi ngôn ngữ lặp lại; không có reviewer; khác biệt tokenization ảnh hưởng chỉ số | Product + Language reviewer |
| R10 | SRS làm tăng “tuyết lở” thẻ đến hạn hoặc lịch client/server lệch | Trung bình | Cao | Giới hạn thẻ mới; cho pause/skip; giữ append-only review log và idempotency; chỉ chốt FSRS version sau golden vectors chéo `ts-fsrs`/`py-fsrs` | Backlog thẻ tăng; state khác giữa client/server; duplicate review events | Engineering |
| R11 | Người dùng cảm thấy bị ép nói, bị sửa quá nhiều hoặc mất riêng tư ở nơi công cộng | Trung bình | Trung bình/Cao | Text mode, bỏ qua, chế độ nghỉ; tối đa 1–2 sửa/lượt; không phạt streak; thông báo microphone rõ | Bỏ dở ở bước voice; tắt microphone; phản hồi khó chịu | Product/UX |
| R12 | Mẫu thử tiện lợi thiên lệch, kết quả A/B không đủ lực thống kê | Cao | Trung bình/Cao | Định nghĩa cohort/metric trước; power analysis; phân tích theo ngôn ngữ/trình độ; phân biệt usability với efficacy; công bố giới hạn | Nhóm nhỏ/không cân bằng; metric đổi giữa chừng; kết quả không tái lập | Product/Research |
| R13 | Mốc CEFR/JLPT/TOPIK hoặc giờ học bị hứa quá mức | Trung bình | Cao | Không cam kết thời gian/đầu ra trước khi có nguồn và đánh giá độc lập; tách tự báo cáo khỏi assessment | Marketing dùng câu “đạt trình độ trong N tuần”; không có benchmark | Product/Marketing |
| R14 | Lỗi bảo mật/quota cho phép lạm dụng hoặc chi phí tăng đột biến | Trung bình | Cao | Rate limit, quota theo user/session, idempotency, kiểm tra đầu vào, alert và kill switch; secret không nằm trong source control | Spike request, key lộ trong log/repo, ledger không khớp provider | Engineering |

## Thang đánh giá

- **Xác suất:** Thấp / Trung bình / Cao — đánh giá định tính trước dữ liệu vận hành.
- **Tác động:** Trung bình / Cao / Rất cao — dựa trên ảnh hưởng tiềm tàng tới người học, độ tin cậy, quyền riêng tư hoặc khả năng vận hành.
- Mọi mức trong bảng là `[SUY LUẬN]`, không phải tỷ lệ xảy ra đã đo.

## Rủi ro ưu tiên trước pilot

1. R5 quyền riêng tư giọng nói và R14 bảo vệ quota/secret.
2. R2 độ tin cậy transcript/phản hồi, nhất là khi im lặng hoặc ASR không chắc.
3. R1/R9 chất lượng nội dung và độ phủ từng ngôn ngữ.
4. R3 đo lường chuyển giao, không đánh đồng engagement với học tập.
5. R10 tính nhất quán SRS và R4 chi phí biến đổi.

## Điều kiện mở rộng pilot

- Có consent và luồng xóa dữ liệu được kiểm tra.
- Có bộ test âm thầm/rỗng/ảo giác và quy tắc fallback.
- Có người duyệt nội dung theo từng ngôn ngữ và nhật ký nguồn/giấy phép.
- Có quota/usage ledger và ngưỡng cảnh báo đã được duyệt sau cost model.
- Có pre-registration tối thiểu cho outcome chính, cohort, phân tích và quyết định dừng.

**Nguồn:** yêu cầu rủi ro trong `MASTER_PROMPT.md` mục 3.6 và các giới hạn trong `01_research_report.md` (D1, truy cập 23/11/2026; nguồn D1 truy cập 22/11/2026). Các mức rủi ro là đánh giá định tính `[SUY LUẬN]`.