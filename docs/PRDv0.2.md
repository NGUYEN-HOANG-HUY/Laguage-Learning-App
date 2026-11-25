# PRD v0.2: Ứng dụng học ngoại ngữ thông minh, không phụ thuộc AI tạo sinh (Anh / Nhật / Hàn cho người Việt)

> **Trạng thái:** v0.2, viết lại từ v0.1 theo hướng **không dùng dịch vụ AI (LLM, ASR, TTS đám mây) khi người dùng sử dụng app**. Chưa qua nghiên cứu thị trường có nguồn đầy đủ.
> **Nhãn độ tin cậy:** `[ĐÃ XÁC MINH]` có nguồn trực tiếp · `[SUY LUẬN]` rút ra từ dữ kiện · `[GIẢ ĐỊNH]` cần kiểm chứng trước khi dùng làm số liệu trong đồ án hoặc hồ sơ gọi vốn.
> **Cập nhật:** 2026-11-25

---

## 0. Nhật ký thay đổi so với v0.1

| Hạng mục | v0.1 (có AI) | v0.2 (không AI) | Lý do |
|---|---|---|---|
| Hội thoại | LLM hội thoại tự do, voice + text | **Hội thoại có kịch bản** (nhánh hữu hạn, biên tập viên viết, audio người thật) | Bỏ phụ thuộc LLM, nội dung kiểm soát được, không ảo giác |
| Luyện nói | Whisper chấm "độ dễ hiểu" | **Nghe – nhại – so sánh** (ghi âm cục bộ, phát lại cạnh audio mẫu, tự đánh giá), không có điểm máy | Không có ASR; tránh tạo cảm giác chính xác giả |
| Phản hồi lỗi | LLM giải thích lỗi | **Phản hồi theo luật** do biên tập viên soạn, gắn nhãn lỗi cho từng đáp án sai | Xác định, kiểm duyệt được |
| Audio | TTS đám mây | **Thu âm người bản xứ** (bộ lõi); TTS tạo sẵn một lần chỉ là phương án tiết kiệm, ghi rõ (xem D3) | Không cần AI lúc chạy; chất lượng cao hơn |
| Hạn mức, `usage_ledger`, chi phí AI/người dùng | Có | **Bỏ** | Không còn chi phí API theo lượt |
| Ngoại tuyến | Chỉ ôn thẻ | **Toàn bộ chức năng lõi chạy ngoại tuyến** | Không cần gọi dịch vụ ngoài |
| Quyền riêng tư giọng nói | Gửi audio lên server | **Audio không rời khỏi máy** | Giảm rủi ro và nghĩa vụ pháp lý |
| Giữ lại | | FSRS, chống tuyết lở, đồng bộ log idempotent (tùy chọn), báo lỗi nội dung, QA nội dung | Không phụ thuộc AI |

---

## 1. Tóm tắt

**Tầm nhìn.** Một người bạn đồng hành ôn tập cho người Việt học tiếng Anh, Nhật, Hàn: đưa đúng thứ cần ôn vào đúng lúc, chạy hoàn toàn ngoại tuyến, nội dung do con người biên soạn và duyệt, tập trung vào **nghe, đọc, từ vựng, ngữ pháp nhận biết** và luyện thi.

**Định nghĩa dùng trong tài liệu này**
- **"Thông minh"** nghĩa là thích ứng bằng **thuật toán xác định chạy trên máy**: lập lịch ôn bằng FSRS, chọn bài theo trạng thái người học, hồ sơ điểm yếu dựng từ nhãn lỗi, kiểm tra trình độ từ ngân hàng câu hỏi cố định.
- **"Không cần AI"** nghĩa là **không gọi LLM, ASR hay TTS đám mây khi người dùng đang dùng app**; không có hội thoại sinh tự do và không chấm giọng nói tự động. FSRS là thuật toán mã nguồn mở với tham số mặc định đã huấn luyện sẵn, chạy cục bộ, không gọi dịch vụ ngoài `[SUY LUẬN]`.

**Định vị.** Không cạnh tranh ở việc "có AI để nói chuyện", vì tính năng này đang thành hàng hóa: `[ĐÃ XÁC MINH]` Duolingo báo cáo chi phí mỗi cuộc Video Call giảm từ khoảng $0,30 xuống dưới $0,01 nhờ mô hình mở, và đang ngừng bán gói Max để đưa Video Call vào gói Super (earnings call Q2 và Q3/2026; nguồn thứ cấp, đọc tháng 11/2026; "mỗi cuộc gọi" là đơn vị nội bộ, độ dài không công bố). Lợi thế cần xây thay vào đó `[SUY LUẬN]`:

| Lợi thế | Vì sao khả thi khi không dùng AI |
|---|---|
| **Nội dung chọn lọc cho người Việt** (cặp âm hay nhầm theo L1, từ vựng bám đề thi) | Do biên tập viên và người bản xứ làm, không phải mô hình tổng quát |
| **Chạy ngoại tuyến, chi phí biên gần bằng 0** | Không có chi phí API theo lượt, mở được gói giá thấp phù hợp sức mua Việt Nam |
| **Độ tin cậy nội dung** | Mọi mục qua QA trước khi hiển thị, không có ảo giác |
| **Riêng tư** | Không gửi giọng nói hay dữ liệu học đi đâu nếu không cần |

**Điều sản phẩm KHÔNG hứa (nói thẳng với người dùng)**
1. App **không** thay thế việc nói chuyện với người thật. Kỹ năng nói tự do cần thực hành tương tác; app chỉ giúp **chuẩn bị** (từ vựng, nghe, bắt chước, kịch bản mẫu).
2. App **không** chấm phát âm tự động. `[ĐÃ XÁC MINH]` Nghiên cứu về mô hình đa phương thức cho thấy đánh giá cấp âm vị còn khó (arXiv 2509.15701), nên tránh đưa ra điểm số tạo cảm giác chính xác giả.
3. App **không** tuyên bố trình độ tương đương JLPT/TOPIK/CEFR chính thức; chỉ đưa ước lượng nội bộ có ghi chú.

**Đánh đổi cần chấp nhận `[SUY LUẬN]`:** bỏ hội thoại tự do và phản hồi nói tự động nghĩa là mất hai tính năng nhiều người học coi là quan trọng cho kỹ năng nói. Cách giảm thiểu: định vị rõ vào luyện thi và nền tảng; thí nghiệm đo nhu cầu (H4); thiết kế sẵn điểm mở để thêm tính năng AI tùy chọn về sau (D7).

---

## 2. Vấn đề và phân khúc

| Persona | Vấn đề | Mức độ phù hợp với bản không AI | Chắc chắn |
|---|---|---|---|
| **P1. Người luyện thi** (JLPT N5–N4, TOPIK I, TOEIC Nghe–Đọc) | Cần từ vựng, nghe, đọc bám đề; đo được tiến bộ | **Rất phù hợp**: kỹ năng thi chủ yếu là nhận biết, kiểm tra đúng/sai xác định được | `[GIẢ ĐỊNH]` |
| **P2. Lao động chuẩn bị đi Nhật/Hàn** (kỹ năng đặc định, EPS-TOPIK) | Cần từ vựng chuyên ngành và nghe hiểu trong thời gian ngắn, thường có điện thoại cấu hình thấp, mạng yếu | **Rất phù hợp**: ngoại tuyến, nhẹ | `[GIẢ ĐỊNH]`, cần khảo sát |
| **P3. Người đi làm, mất gốc** (Anh giao tiếp) | Học nhiều app nhưng không dám nói | **Phù hợp một phần**: nền tảng từ vựng/nghe tốt, phần nói hạn chế | `[GIẢ ĐỊNH]` |

**Jobs-To-Be-Done chung:** "Khi tôi có 10–15 phút rảnh, tôi muốn ôn đúng thứ tôi sắp quên và luyện đúng cặp âm tôi hay nhầm, kể cả khi không có mạng."

---

## 3. Phạm vi MVP

### Trong phạm vi
1. **Học và ôn từ vựng bằng FSRS** (4 nút Again/Hard/Good/Easy), lập lịch trên máy, hàng đợi ôn hằng ngày, giới hạn thẻ mới, chống tuyết lở.
2. **Nội dung 3 ngôn ngữ, quy mô nhỏ nhưng đã duyệt:** khoảng 300–500 từ mỗi gói (JA cấp N5, KO cấp TOPIK I, EN trình độ A1–A2) `[GIẢ ĐỊNH]`, mỗi mục có nghĩa tiếng Việt, cách đọc (`reading`), câu ví dụ, audio.
3. **Mô-đun bảng chữ cái:** Hiragana, Katakana, Hangul (thẻ có audio, ôn bằng FSRS).
4. **Bài tập có đáp án xác định** (chấm bằng luật, không cần AI):
   - Flashcard nhìn–nhớ; chọn nghĩa (MCQ); nghe–chọn từ.
   - **Chính tả nghe–gõ** (so khớp sau chuẩn hóa văn bản; danh sách đáp án chấp nhận do biên tập viên soạn).
   - Điền khuyết (cloze); sắp xếp câu.
5. **Cặp tối thiểu theo L1 tiếng Việt:** nghe và chọn từ đúng trong cặp dễ nhầm (xem 4.US-05).
6. **Nghe – nhại – so sánh:** ghi âm cục bộ, phát lại cạnh audio mẫu, tự đánh giá bằng checklist; không có điểm máy, audio không rời khỏi máy.
7. **Hội thoại có kịch bản:** 3 kịch bản mỗi ngôn ngữ, nhánh hữu hạn do biên tập viên viết, audio người thật; người học chọn câu đáp hoặc đọc theo gợi ý.
8. **Hồ sơ điểm yếu dựa trên luật:** mỗi đáp án sai gắn nhãn loại lỗi, hệ thống thống kê và đề xuất bài củng cố (có giải thích lý do đề xuất).
9. **Kiểm tra trình độ nội bộ** từ ngân hàng câu hỏi cố định (đầu vào và định kỳ), chấm tự động.
10. **Streak, mục tiêu hằng ngày, nhắc học cục bộ**, thống kê tiến bộ (số từ vững, dự báo số thẻ ôn).
11. **Báo lỗi nội dung**, **xuất/nhập dữ liệu** (sao lưu JSON), xóa toàn bộ dữ liệu.

### Ngoài phạm vi (v1.1 trở đi)
Hội thoại tự do bằng AI, chấm phát âm tự động (ASR/âm vị), chế độ speech-to-speech, đồng bộ thời gian thực đa thiết bị, bảng xếp hạng/xã hội, kiểm tra xếp lớp thích ứng theo mô hình IRT, pitch accent tiếng Nhật, luyện viết tay, thanh toán trong app (xem D6).

---

## 4. User stories và tiêu chí chấp nhận

**US-01. Học và ôn thẻ (ngoại tuyến)**
- *Given* người dùng có thẻ đến hạn và không có mạng, *When* mở màn hình Ôn tập, *Then* thấy hàng đợi sắp theo `due_at`, mỗi thẻ một nhiệm vụ chính và 4 nút đánh giá.
- *Given* người dùng bấm một nút, *When* lập lịch xong, *Then* `review_log` ghi cục bộ ngay, trạng thái thẻ cập nhật, thẻ kế tiếp hiện ra trong dưới 200 ms.

**US-02. Chống "tuyết lở ôn tập"**
- *Given* số thẻ đến hạn vượt ngưỡng (mặc định 150), *When* người dùng mở app, *Then* tạm dừng thẻ mới và hiển thị thông báo giải thích kèm nút "Ôn dần".

**US-03. Sao lưu và đồng bộ (tùy chọn)**
- *Given* người dùng không đăng nhập, *When* xuất dữ liệu, *Then* nhận tệp JSON gồm thẻ và log; nhập lại trên máy khác dựng lại đúng trạng thái.
- *Given* người dùng có tài khoản và mạng trở lại, *When* đồng bộ, *Then* log đẩy lên idempotent (khóa `user_id, card_id, reviewed_at`), không ghi trùng, trạng thái thẻ khớp sau replay (nếu D4 chọn có tài khoản).

**US-04. Chính tả nghe–gõ**
- *Given* audio mẫu phát xong, *When* người dùng gõ đáp án, *Then* hệ thống chuẩn hóa văn bản (Anh: bỏ phân biệt hoa thường và dấu câu; Nhật: so theo kana hoặc tập đáp án chấp nhận; Hàn: so theo jamo) rồi so khớp, hiển thị khác biệt ở mức ký tự/từ.
- Chỉ chấp nhận đáp án nằm trong `accepted_answers` do biên tập viên soạn. **Không** cố đánh giá "đúng nghĩa" với câu trả lời tự do (không có AI).

**US-05. Cặp tối thiểu theo L1 tiếng Việt**
- *Given* tập cặp tối thiểu đã duyệt (ví dụ minh họa, cần chuyên gia ngôn ngữ xác nhận danh sách: EN *ship/sheep*, *think/sink*; JA *おばさん/おばあさん* (trường âm), *かた/かった* (âm ngắt); KO *불/풀/뿔*, *달/탈/딸* (âm thường/bật hơi/căng)), *When* người dùng nghe và chọn từ đúng, *Then* nhận phản hồi tức thì và hệ thống ghi nhận cặp bị nhầm.
- Cặp hay nhầm tự động quay lại dưới dạng thẻ ôn FSRS.

**US-06. Nghe – nhại – so sánh**
- *Given* câu mẫu có audio, *When* người dùng bấm ghi âm rồi phát lại, *Then* nghe được audio mẫu và bản ghi của mình liền nhau; sau đó tự đánh giá theo checklist (ví dụ: nhịp điệu, âm cuối, độ liền mạch).
- Bản ghi lưu cục bộ, **không tải lên**, người dùng xóa được; giao diện **không hiển thị điểm số máy**.

**US-07. Hội thoại có kịch bản**
- *Given* người dùng chọn kịch bản, *When* chọn câu đáp ở mỗi bước, *Then* hội thoại đi theo nhánh đã viết, có phản hồi ngắn do biên tập viên soạn cho từng lựa chọn, luôn có đường quay lại và xem lại toàn bộ đoạn thoại kèm audio.
- Mỗi kịch bản có ghi chú ngữ cảnh văn hóa, mức lịch sự (Nhật, Hàn) do người bản xứ duyệt.

**US-08. Hồ sơ điểm yếu**
- *Given* người dùng làm sai nhiều lần cùng một loại lỗi (cùng `error_tag`), *When* mở màn hình Tiến bộ, *Then* thấy điểm yếu xếp theo tần suất gần đây, lý do đề xuất bài củng cố, và nút tập ngay.
- Nhãn lỗi gắn sẵn vào đáp án nhiễu (distractor) khi biên soạn; hệ thống **không suy diễn nguyên nhân lỗi** ngoài những nhãn này.

**US-09. Kiểm tra trình độ nội bộ**
- *Given* người dùng làm bài kiểm tra từ ngân hàng cố định, *When* nộp, *Then* nhận kết quả theo từng nhóm kỹ năng và ước lượng số từ đã nắm, kèm ghi chú "ước lượng nội bộ, không phải chứng nhận JLPT/TOPIK/CEFR".

**US-10. Chất lượng nội dung**
- *Given* một mục có `qa_status` khác `verified`/`sampled`, *Then* không hiển thị cho người học. Mọi mục có nút "Báo lỗi", báo cáo đi vào hàng đợi duyệt.

**US-11. Quyền riêng tư**
- *Given* mặc định, *Then* không thu thập audio hay nội dung học lên server; phân tích sử dụng ẩn danh là tùy chọn bật tay (opt-in); người dùng xóa toàn bộ dữ liệu trong một thao tác.

---

## 5. Yêu cầu phi chức năng

| Hạng mục | Mục tiêu | Ghi chú |
|---|---|---|
| Ngoại tuyến | **100% chức năng lõi** (học, ôn, bài tập, cặp tối thiểu, shadowing, kịch bản, kiểm tra) chạy không cần mạng sau khi tải gói nội dung | |
| Phản hồi bài tập | < 100 ms (tính cục bộ) | |
| Gói nội dung | Tải theo gói có phiên bản, audio nén (ví dụ Opus), có thể gỡ từng gói | Kích thước cần đo thực tế `[GIẢ ĐỊNH]` |
| Thiết bị | Chạy mượt trên điện thoại cấu hình thấp, dung lượng nhỏ | Quan trọng với P2 |
| Bảo mật | Dữ liệu cục bộ; nếu có tài khoản thì Row Level Security; không khóa bí mật trong mã | |
| Chi phí hạ tầng | Gần bằng 0 theo số lượt dùng: chủ yếu lưu trữ/CDN gói nội dung | `[SUY LUẬN]`, xác nhận bằng ước tính khi chọn nhà cung cấp |
| Khả năng truy cập | Cỡ chữ lớn, tương phản, chế độ không dùng âm thanh (chỉ đọc) | |
| Giảm tải nhận thức | Mỗi màn hình một nhiệm vụ chính; phiên 3–5 phút | |
| Bảo trì thuật toán | Ghim phiên bản FSRS, dùng bộ golden test vectors | Đối chiếu repo `open-spaced-repetition` khi chọn phiên bản |

---

## 6. Chỉ số thành công

| Loại | Chỉ số | Mục tiêu beta |
|---|---|---|
| **North Star** | Số từ **"vững"** (stability ≥ ngưỡng, ví dụ 21 ngày) mỗi người dùng hoạt động mỗi tuần | `[GIẢ ĐỊNH]` ngưỡng và mục tiêu đặt sau khi có baseline |
| Giữ chân | Retention D1 / D7 / D30 | Đặt mục tiêu sau 2 tuần beta |
| Hiệu quả học | Điểm kiểm tra từ vựng/nghe trước–sau 4 tuần trên ngân hàng cố định; so nhóm đối chứng nếu có | Đo tiến bộ khách quan |
| Ghi nhớ | Tỉ lệ nhớ thực tế so với `desired_retention` | Kiểm định mô hình |
| Cặp tối thiểu | Tỉ lệ đúng theo cặp qua các phiên | Theo dõi cải thiện nghe phân biệt |
| Chất lượng nội dung | Tỉ lệ mục bị báo lỗi / tổng mục hiển thị | Theo dõi hàng tuần |
| Kinh tế | **Chi phí nội dung trên mỗi mục đã duyệt** và chi phí hạ tầng trên người dùng hoạt động | Thay cho "chi phí AI" của v0.1 |

---

## 7. Giả thuyết và thí nghiệm

| # | Giả thuyết | Thiết kế | Chỉ số |
|---|---|---|---|
| H1 | Bài cặp tối thiểu + hồ sơ điểm yếu theo luật cải thiện khả năng nghe phân biệt nhiều hơn chỉ dùng flashcard | A/B: có/không mô-đun cặp tối thiểu | Điểm bài nghe phân biệt trước–sau, retention D7 |
| H2 | Hội thoại có kịch bản kèm audio tăng thời gian học và retention so với chỉ flashcard | A/B | Phút học/tuần, retention D7 |
| H3 | Gói nội dung bám đề thi (JLPT/TOPIK/EPS-TOPIK) có tỉ lệ chuyển đổi trả phí cao hơn gói chung | Thử nghiệm giá và gói | Tỉ lệ chuyển đổi |
| H4 | **Nhu cầu "luyện nói với AI" đủ lớn để cần bổ sung** | "Cửa giả" (fake door): nút "Luyện nói với AI (sắp ra mắt)", đo tỉ lệ nhấp và đăng ký chờ; phỏng vấn người dùng | Tỉ lệ nhấp, lý do rời đi (nếu có) |

Mọi giả thuyết trên là **chưa chứng minh**, kết quả quyết định có mở rộng sang AI tùy chọn hay không (D7).

---

## 8. Mô hình kinh doanh và chi phí

`[GIẢ ĐỊNH]` Chưa có mô hình tài chính; cần dựng sau khi chốt D6.

- **Cấu trúc chi phí:** chi phí chủ yếu là **nội dung** (biên soạn, duyệt bởi người bản xứ, thu âm) và **phát triển**, không phải chi phí theo lượt dùng. Chi phí biên cho mỗi người dùng thêm rất thấp, nên có thể tặng nhiều tính năng miễn phí.
- **Hướng thu phí khả dĩ:** miễn phí học và ôn cơ bản; trả phí cho **gói nội dung luyện thi**, thống kê nâng cao, kiểm tra đầy đủ, gỡ giới hạn. Hình thức có thể là mua một lần hoặc thuê bao (D6).
- **Giá:** theo sức mua Việt Nam, kiểm chứng bằng thử nghiệm giá (H3).
- **Chi phí cần dự toán:** biên tập và thu âm theo mục, phí tài khoản nhà phát triển cửa hàng ứng dụng và hoa hồng thanh toán (kiểm tra trên trang chính thức của từng cửa hàng trước khi ghi vào kế hoạch), lưu trữ/CDN.

---

## 9. Rủi ro chính

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| **Thiếu hội thoại tự do và phản hồi nói**, người học chuyển sang app có AI | Cao | Định vị luyện thi/nền tảng; thí nghiệm H4; thiết kế sẵn điểm mở AI tùy chọn (D7); nói rõ giới hạn trong app |
| **Nội dung do người làm tốn thời gian, tiền và là nút thắt** | Cao | Bắt đầu nhỏ; quy trình QA; tuyển cộng tác viên bản xứ; có thể ra mắt một ngôn ngữ trước |
| **Cạnh tranh với app miễn phí** (Anki, Duolingo, v.v.) | Cao | Khác biệt ở nội dung bám đề, cặp âm theo L1 Việt, ngoại tuyến nhẹ, giá |
| Giấy phép dữ liệu/audio nguồn mở | Trung bình | Lưu `source`, `license` từng mục; đọc điều khoản trước khi thương mại hóa |
| Tự đánh giá shadowing thiên lệch | Trung bình | Không đưa ra điểm; hiệu chuẩn bằng bài kiểm tra khách quan; không tuyên bố đo phát âm |
| Tuyên bố trình độ gây hiểu nhầm, dùng tên kỳ thi/nhãn hiệu | Trung bình | Ghi chú "ước lượng nội bộ"; kiểm tra quy định nhãn hiệu của đơn vị tổ chức kỳ thi |
| Đáp án nhiễu tự sinh theo luật kém chất lượng | Trung bình | Ưu tiên đáp án nhiễu do biên tập viên soạn; QA lấy mẫu |
| Dàn trải ba ngôn ngữ | Cao | Ra mắt sâu một ngôn ngữ, hai ngôn ngữ còn lại dạng beta |
| Dữ liệu cá nhân | Thấp | Mặc định cục bộ; opt-in cho phân tích |

---

## 10. Lộ trình thực tế

**Nguyên tắc:** kỹ thuật và nội dung chạy **song song**; nội dung mới là điểm nghẽn thật. Ước lượng dưới đây giả định 1 lập trình viên full-stack có kinh nghiệm React Native làm toàn thời gian và 1–2 cộng tác viên nội dung `[GIẢ ĐỊNH]`; làm bán thời gian thì nhân đôi thời gian.

| Tuần | Kỹ thuật | Nội dung (song song) | Tiêu chí xong |
|---|---|---|---|
| **1** | Khung app (Expo + TypeScript), SQLite cục bộ, FSRS (ghim phiên bản + golden tests), màn hình học/ôn, hàng đợi, chống tuyết lở | Chốt khung dữ liệu nội dung, chọn nguồn từ vựng và kiểm tra giấy phép, tuyển cộng tác viên | Học và ôn trọn bộ thẻ mẫu ngoại tuyến; đóng app giữa chừng không mất log |
| **2** | Bài tập xác định (MCQ, nghe–chọn, chính tả, cloze, sắp xếp câu), chuẩn hóa văn bản theo ngôn ngữ, `accepted_answers`, mô-đun bảng chữ cái | 150–200 mục đầu mỗi ngôn ngữ qua QA, bắt đầu thu âm | Mọi loại bài tập chạy đúng trên dữ liệu mẫu, có test cho ca biên |
| **3** | Gói nội dung tải theo phiên bản + audio; cặp tối thiểu; nghe–nhại–so sánh; engine hội thoại kịch bản; hồ sơ điểm yếu theo luật | Hoàn thiện 300–500 mục mỗi gói (nếu kịp), 3 kịch bản mỗi ngôn ngữ, danh sách cặp tối thiểu đã duyệt | Người dùng thử hoàn tất một kịch bản và một phiên cặp tối thiểu |
| **4** | Thống kê, kiểm tra trình độ, nhắc học, xuất/nhập dữ liệu, báo lỗi, khả năng truy cập; beta 10–20 người | QA vòng cuối, sửa lỗi nội dung từ beta | Có số liệu retention D1/D7 và danh sách lỗi nội dung từ beta |

**Cảnh báo thực tế `[SUY LUẬN]`:** nếu nội dung 3 ngôn ngữ chưa kịp duyệt, **ra mắt một ngôn ngữ trước** (đề xuất theo D1) và hoãn hai ngôn ngữ còn lại thay vì giảm chất lượng nội dung. Bản không AI giảm mạnh độ phức tạp kỹ thuật, nhưng không giảm khối lượng nội dung.

---

## 11. Quyết định cần chốt

| # | Quyết định | Đề xuất mặc định |
|---|---|---|
| D1 | Phân khúc và ngôn ngữ ra mắt đầu tiên | P1 (luyện thi) với **một** ngôn ngữ (JA N5–N4 hoặc KO TOPIK I), hai ngôn ngữ còn lại beta |
| D2 | Ngân sách | Dành cho **nội dung và thu âm** thay vì chi phí AI (số tiền cụ thể do bạn chốt) |
| D3 | Nguồn audio | Thu âm người bản xứ cho bộ lõi; TTS tạo sẵn một lần chỉ dùng làm bản nháp nội bộ hoặc phương án tiết kiệm có ghi rõ "giọng tổng hợp" (đây là dùng AI **lúc biên soạn**, không phải lúc chạy; nếu muốn tuyệt đối không dùng AI thì loại phương án này) |
| D4 | Tài khoản và đồng bộ trong MVP | Chỉ cục bộ + xuất/nhập JSON; tài khoản và đồng bộ log để v1.1 |
| D5 | Nền tảng ra mắt đầu tiên | Android nội bộ + web; iOS khi có tài khoản nhà phát triển |
| D6 | Mô hình thu phí | Miễn phí cơ bản; gói nội dung luyện thi trả phí; thanh toán trong app để sau MVP |
| D7 | Có chừa điểm mở cho AI tùy chọn không | Có, bằng cờ tính năng (feature flag) và giao diện nhà cung cấp trừu tượng; chỉ bật khi H4 cho thấy nhu cầu |

---

## 12. Ảnh hưởng tới các tài liệu khác

PRD này thay đổi phạm vi, nên các tệp sau (viết cho bản có AI) cần cập nhật tương ứng:

| Tệp | Cần đổi |
|---|---|
| `architecture.md` | Bỏ `/turn`, `/score`, ASR/LLM/TTS, `usage_ledger`, quota; thêm kiến trúc offline-first, gói nội dung có phiên bản, engine bài tập xác định, engine hội thoại kịch bản; backend tối thiểu |
| `data_model.sql` | Bỏ `conversation_turns` kiểu AI, `usage_ledger`, `quota_limits`; thêm bảng bài tập, `accepted_answers`, cặp tối thiểu, `error_tags`, kịch bản hội thoại (nút và nhánh) |
| `openapi.yaml` | Bỏ `/v1/turn`, `/v1/score`, `/v1/quota`; giữ `/v1/sync` (nếu D4 có tài khoản), `/v1/content/report`, `/v1/me/data`; thêm API tải gói nội dung |
| `copilot-instructions.md` | Bỏ quy tắc ASR/LLM, "độ dễ hiểu", quota; thêm quy tắc chuẩn hóa văn bản, `accepted_answers`, không hiển thị điểm phát âm máy, chạy ngoại tuyến |