# PRD: Ứng dụng học ngoại ngữ tích hợp AI (Anh / Nhật / Hàn cho người Việt)

> **Trạng thái:** v0.1, bản khởi đầu tổng hợp từ phiên thảo luận thiết kế. **Chưa qua nghiên cứu thị trường có nguồn đầy đủ.**
> **Nhãn độ tin cậy:** `[ĐÃ XÁC MINH]` có nguồn trực tiếp · `[SUY LUẬN]` rút ra từ dữ kiện · `[GIẢ ĐỊNH]` cần kiểm chứng trước khi dùng làm số liệu trong đồ án hoặc hồ sơ gọi vốn.
> **Cập nhật:** 2026-11-23

---

## 1. Tóm tắt

**Tầm nhìn.** Một "gia sư có trí nhớ" cho người Việt học tiếng Anh, Nhật, Hàn: hệ thống biết bạn đã học gì, hay quên gì, hay sai gì, và đưa đúng thứ đó vào buổi nói chuyện tiếp theo.

**Định vị.** Không cạnh tranh ở việc "có AI để nói chuyện", vì đây đang thành hàng hóa:
- `[ĐÃ XÁC MINH]` Duolingo báo cáo chi phí mỗi cuộc Video Call giảm từ khoảng $0,30 xuống dưới $0,01 nhờ mô hình mở, và đang ngừng bán gói Max để đưa Video Call vào gói Super (earnings call Q2 và Q3/2026; nguồn thứ cấp, đọc tháng 11/2026). Lưu ý "mỗi cuộc gọi" là đơn vị nội bộ, độ dài không công bố.
- Lợi thế cần xây thay vào đó: **vòng lặp kín** SRS ↔ hội thoại ↔ bằng chứng lỗi ↔ drill, dữ liệu lỗi theo L1 tiếng Việt, và đo lường chuyển giao sang giao tiếp thật.

**Điều sản phẩm KHÔNG hứa:** chấm phát âm cấp âm vị trong MVP. MVP chỉ chấm **"độ dễ hiểu" (intelligibility)**. `[ĐÃ XÁC MINH]` Các nghiên cứu về mô hình đa phương thức cho thấy cấp từ và câu làm tốt, cấp âm vị còn khó (arXiv 2509.15701).

---

## 2. Vấn đề và phân khúc

| Persona | Vấn đề | Mức độ chắc chắn |
|---|---|---|
| **P1. Người đi làm, mất gốc, cần giao tiếp công việc** (Anh) | Học nhiều app nhưng không dám nói; không có thời gian cố định | `[GIẢ ĐỊNH]` |
| **P2. Người luyện thi** (IELTS/TOEIC Speaking, JLPT, TOPIK) | Cần luyện nói có phản hồi, đo được tiến bộ | `[GIẢ ĐỊNH]` |
| **P3. Lao động chuẩn bị đi Nhật/Hàn** (kỹ năng đặc định, điều dưỡng, EPS-TOPIK) | Cần từ vựng chuyên ngành và phản xạ giao tiếp trong thời gian ngắn | `[GIẢ ĐỊNH]`, cần khảo sát |

**Jobs-To-Be-Done chung:** "Khi tôi có 10–15 phút rảnh, tôi muốn luyện đúng thứ tôi hay sai để lần sau nói tự tin hơn."

> **Quyết định D1 (cần chốt):** MVP nhắm phân khúc nào trước? Đề xuất mặc định: P1 với tiếng Anh làm ngôn ngữ chính, JA/KO ra mắt dạng gói beta nhỏ. Lý do: tokenization đơn giản, thị trường lớn nhất, nhưng cần dữ liệu để xác nhận.

---

## 3. Phạm vi MVP (4 tuần, 1 lập trình viên full-stack)

### Trong phạm vi
1. Đăng ký/đăng nhập, hồ sơ, chọn ngôn ngữ đích và giới hạn thẻ mới mỗi ngày.
2. Học và ôn từ vựng bằng **FSRS** (4 nút Again/Hard/Good/Easy), lập lịch trên client, đồng bộ qua log.
3. Nội dung 3 ngôn ngữ: khoảng 1.000 từ Anh, 300–500 từ mỗi gói Nhật (N5) và Hàn (TOPIK I), có `reading`, câu ví dụ, audio TTS tạo sẵn.
4. **Đọc to và nhận "độ dễ hiểu"** (Whisper + so khớp theo từ/kana/jamo).
5. **Hội thoại AI** (giọng nói và nhắn tin), 3 kịch bản mỗi ngôn ngữ, tối đa 2 lỗi sửa mỗi lượt, gài từ cần ôn.
6. Lưu lỗi thành thẻ ôn (người dùng xác nhận).
7. Hạn mức theo gói, sổ chi phí `usage_ledger`, xóa audio sau khi chấm.

### Ngoài phạm vi (v1.1 trở đi)
Chấm âm vị (wav2vec2/GOP), đồng bộ ngoại tuyến đa thiết bị, bảng xếp hạng/xã hội, thanh toán, kiểm tra xếp lớp thích ứng, pitch accent tiếng Nhật, luyện viết tay, speech-to-speech gốc (thử nghiệm A/B sau MVP).

---

## 4. User stories và tiêu chí chấp nhận

**US-01. Học và ôn thẻ**
- *Given* người dùng có thẻ đến hạn, *When* mở màn hình Ôn tập, *Then* thấy hàng đợi sắp theo `due_at`, mỗi thẻ hiển thị một nhiệm vụ chính và 4 nút đánh giá.
- *Given* người dùng bấm một nút, *When* lập lịch xong, *Then* `review_log` được ghi cục bộ ngay (không chờ mạng), trạng thái thẻ cập nhật, thẻ kế tiếp hiện ra trong dưới 200 ms.

**US-02. Chống "tuyết lở ôn tập"**
- *Given* số thẻ đến hạn vượt ngưỡng (mặc định 150), *When* người dùng mở app, *Then* hệ thống tạm dừng thẻ mới và hiển thị thông báo giải thích kèm nút "Ôn dần".

**US-03. Đồng bộ log**
- *Given* thiết bị mất mạng, *When* người dùng ôn 20 thẻ rồi có mạng lại, *Then* log được gửi, server không ghi trùng (khóa `user_id, card_id, reviewed_at`), trạng thái thẻ trên server khớp trạng thái client sau replay.

**US-04. Đọc to và độ dễ hiểu**
- *Given* người dùng đọc câu mục tiêu, *When* gửi âm thanh, *Then* trong dưới 3 giây nhận điểm 0–100 và danh sách lỗi thay thế/xóa/chèn ở cấp từ (Anh), kana (Nhật) hoặc jamo (Hàn).
- *Given* đoạn ghi âm gần như im lặng, *When* ASR trả về transcript có độ tin cậy thấp, *Then* hệ thống KHÔNG chấm điểm mà yêu cầu thu lại.
- Giao diện gọi tính năng này là **"độ dễ hiểu"**, không gọi là "chấm phát âm".

**US-05. Hội thoại AI**
- *Given* người dùng chọn kịch bản, *When* nói hoặc nhắn một lượt, *Then* nhận phản hồi có transcript, câu trả lời và tối đa 2 chỉnh sửa, kèm nút "Lưu thành thẻ".
- *Given* có từ cần ôn từ SRS, *When* hội thoại bắt đầu, *Then* AI gài ít nhất một từ đó và hệ thống ghi nhận từ nào đã được dùng (`used_item_ids`).
- Chế độ nhắn tin có đầy đủ tính năng như chế độ giọng nói (người dùng không thể nói to nơi công cộng).

**US-06. Hạn mức và chi phí**
- *Given* người dùng gói miễn phí hết hạn mức hội thoại trong ngày, *When* gửi lượt mới, *Then* nhận thông báo rõ ràng, vẫn học và ôn thẻ bình thường.
- Mọi lượt gọi dịch vụ AI đều ghi một dòng vào `usage_ledger`.

**US-07. Chất lượng nội dung**
- *Given* một mục từ vựng chưa qua kiểm duyệt (`qa_status = 'draft'`), *Then* không hiển thị cho người học. Người học có nút "Báo lỗi" trên mọi mục.

**US-08. Quyền riêng tư**
- *Given* mặc định, *When* chấm xong, *Then* file audio thô bị xóa; chỉ lưu nếu người dùng bật `store_raw_audio`. Người dùng có thể xóa toàn bộ dữ liệu của mình.

---

## 5. Yêu cầu phi chức năng

| Hạng mục | Mục tiêu | Ghi chú |
|---|---|---|
| Độ trễ hội thoại (cascade) | p50 đến âm thanh đầu tiên ≤ 2,5 giây | `[GIẢ ĐỊNH]` ước lượng, phải đo thực tế |
| Độ trễ chấm độ dễ hiểu | ≤ 3 giây cho câu ngắn | |
| Ngoại tuyến | Ôn thẻ và ghi log hoạt động không cần mạng | Đồng bộ hai chiều đa thiết bị để v2 |
| Bảo mật | Row Level Security mọi bảng người dùng; không khóa API trong mã | |
| Chi phí | Có trần chi phí AI theo người dùng/ngày | Xem `architecture.md` mục 10 |
| Khả năng truy cập | Cỡ chữ lớn, tương phản, chế độ không dùng âm thanh | |
| Giảm tải nhận thức | Mỗi màn hình một nhiệm vụ chính; phiên 3–5 phút | |

---

## 6. Chỉ số thành công

| Loại | Chỉ số | Mục tiêu beta |
|---|---|---|
| **North Star** | Phút nói có chủ đích mỗi tuần trên mỗi người dùng hoạt động | `[GIẢ ĐỊNH]` đặt sau khi có baseline |
| Giữ chân | Retention D1 / D7 / D30 | Đặt mục tiêu sau 2 tuần beta |
| Hiệu quả học | Điểm nói tự do trước/sau 4 tuần (rubric cố định, hai người chấm) | Đo mức chuyển giao |
| Ghi nhớ | Tỉ lệ nhớ thực tế so với `desired_retention` | Kiểm định mô hình |
| Kinh tế | **Chi phí AI mỗi người dùng hoạt động mỗi tháng** | Phải thấp hơn ARPU dự kiến |
| Chất lượng nội dung | Tỉ lệ mục bị báo lỗi / tổng mục hiển thị | Theo dõi hàng tuần |

---

## 7. Giả thuyết và thí nghiệm

| # | Giả thuyết | Thiết kế | Chỉ số |
|---|---|---|---|
| H1 | Đưa từ cần ôn vào hội thoại và lưu lỗi thành thẻ (vòng lặp kín) tăng giữ chân và ghi nhớ hơn hội thoại rời | A/B: có/không gài từ và nút lưu thẻ | Retention D7, tỉ lệ nhớ sau 14 ngày |
| H2 | **"Người nghe có hiệu chuẩn"** (AI hỏi lại khi lời nói mơ hồ) cải thiện độ rõ và điểm nói tự do so với AI khoan dung mặc định | A/B hai chế độ hội thoại | Tỉ lệ phải nói lại (repair rate), điểm nói tự do. **Đây là GIẢ THUYẾT chưa chứng minh** |
| H3 | Speech-to-speech gốc cải thiện số từ nói mỗi phút đủ để bù chi phí cao hơn cascade | A/B cascade vs S2S ở gói trả phí | Từ nói/phút, retention, chi phí/phút |

---

## 8. Giá và hạn mức (khung giả định)

`[GIẢ ĐỊNH]` Cần mô hình chi phí (`07_cost_model.xlsx` nếu chạy quy trình nghiên cứu) trước khi chốt giá.
- **Miễn phí:** học và ôn thẻ không giới hạn (chi phí gần bằng 0), hội thoại giới hạn theo lượt/ngày.
- **Trả phí:** hạn mức hội thoại cao hơn, phân tích lỗi chi tiết, báo cáo tiến bộ.
- Giá theo sức mua Việt Nam, kiểm tra bằng thử nghiệm.

---

## 9. Rủi ro chính

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Nội dung LLM sinh sai/lệch sắc thái Nhật-Hàn | Cao | `qa_status`, duyệt mẫu bởi người bản xứ, nút báo lỗi |
| Điểm "độ dễ hiểu" bị hiểu nhầm là chấm phát âm | Trung bình | Đặt tên và giải thích rõ trong UI |
| Chi phí AI vượt kiểm soát | Trung bình | Hạn mức, `usage_ledger`, trần chi phí/ngày |
| Ảo giác tiến bộ (nói trôi với AI khoan dung nhưng không chuyển sang đời thực) | Trung bình | Đo điểm nói tự do trước/sau, thí nghiệm H2 |
| Giấy phép dữ liệu nội dung (từ điển, câu ví dụ mở) | Trung bình | Lưu `source`, `license` từng dòng; đọc điều khoản trước khi thương mại hóa |
| Quyền riêng tư dữ liệu giọng nói | Trung bình | Mặc định không lưu audio; xin luật sư xác nhận yêu cầu pháp lý |
| Dàn trải ba ngôn ngữ trong 4 tuần | Cao | Nếu thiếu thời gian, ra mắt sâu tiếng Anh, JA/KO ở dạng beta |

---

## 10. Quyết định cần chốt

| # | Quyết định | Đề xuất mặc định |
|---|---|---|
| D1 | Phân khúc MVP | P1 (người đi làm, Anh) |
| D2 | Ngân sách AI beta mỗi tháng | 300 USD |
| D3 | Có làm JA/KO trong MVP hay beta sau | Làm gói nhỏ beta |
| D4 | Cascade hay speech-to-speech cho gói trả phí | Cascade trước, S2S là thí nghiệm H3 |
| D5 | Nền tảng ra mắt đầu tiên | Web (Expo web) + TestFlight/Play nội bộ |