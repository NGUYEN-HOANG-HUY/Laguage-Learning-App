# 03 — PRD (bản nháp Giai đoạn 2)

**Ngày:** 23/11/2026
**Trạng thái:** Bản nháp chờ duyệt tại CHECKPOINT 2; chưa phải cam kết triển khai.
**Thị trường ưu tiên:** Việt Nam.
**Ngôn ngữ đích dự kiến:** Anh, Nhật, Hàn.
**Quy ước:** `[ĐÃ XÁC MINH]` có nguồn; `[SUY LUẬN]` là diễn giải từ bằng chứng; `[GIẢ ĐỊNH]` cần kiểm chứng; `CHƯA XÁC MINH` là dữ liệu chưa có.

## 1. Tóm tắt sản phẩm và định vị

### Tầm nhìn

Giúp người học Việt Nam luyện diễn đạt trong tình huống thực tế, nhận phản hồi vừa đủ và ôn lại mục tiêu ngôn ngữ đúng lúc — không tuyên bố chấm giọng chuẩn hay thay thế giáo viên.

### Vấn đề cần giải quyết

- [ĐÃ XÁC MINH] D1 ghi nhận các sản phẩm nghiên cứu chia thành nhóm giáo trình, luyện nói, nội dung, và SRS; một số đã có hội thoại AI, trong khi các công cụ hội thoại đa dụng cũng hỗ trợ luyện nói. D1 không tìm thấy bằng chứng độc lập đủ để xếp hạng hiệu quả học tập của từng ứng dụng. (D1, mục 3, 9–10; nguồn S01–S18, S33; truy cập 22/11/2026.)
- [SUY LUẬN] Chỉ thêm hội thoại AI hoặc flashcard không phải khác biệt đã được chứng minh. Khoảng trống đáng thử là nối một lượt nói với mục tiêu học có kiểm duyệt, phản hồi ít và có căn cứ, cùng lần ôn sau đó.
- [GIẢ ĐỊNH] Người học Việt cần một cách luyện ngắn, ít áp lực, có thể chuyển từ nói sang nhắn tin khi không thể nói thành tiếng. Cần phỏng vấn và kiểm thử khả năng sử dụng trước khi xem đây là nhu cầu phổ quát.

### Định vị đề xuất

> Một vòng luyện ngôn ngữ ngắn: thử diễn đạt → nhận phản hồi có giới hạn → dùng lại mục tiêu trong ngữ cảnh → ôn lại theo lịch.

- [SUY LUẬN] Đây là giả thuyết định vị, không phải lợi thế cạnh tranh đã chứng minh. Các tính năng hội thoại, nội dung và SRS đã xuất hiện riêng lẻ ở đối thủ theo D1.
- [GIẢ ĐỊNH] Khác biệt cần chứng minh bằng khả năng hoàn thành nhiệm vụ giao tiếp, khả năng nhớ/dùng lại sau trì hoãn, mức độ tin cậy của phản hồi và chi phí vận hành — không bằng số phút dùng, streak hay điểm phát âm.

## 2. Phân khúc và persona giả định

Chưa có phỏng vấn người dùng hoặc dữ liệu willingness-to-pay; các mô tả dưới đây là giả thuyết tuyển mẫu, không phải quy mô thị trường.

### Phân khúc chính — người lớn Việt Nam luyện giao tiếp tiếng Anh

- [GIẢ ĐỊNH] Người học từ 18 tuổi, trình độ sơ cấp đến trung cấp thấp theo tự khai/đầu vào kiểm tra; cần thực hành các tình huống quen thuộc như giới thiệu, công việc, học tập hoặc đi lại.
- [GIẢ ĐỊNH] Có thể học trong thời gian ngắn, đôi khi không tiện nói thành tiếng; cần có lựa chọn nhắn tin và quyền bỏ qua buổi học mà không bị phạt.
- Persona minh họa: người học bận rộn, hiểu bài đọc cơ bản nhưng ít cơ hội nói; ngại bị sửa quá nhiều và không tin một điểm số phát âm thiếu giải thích.

### Phân khúc phụ — người lớn Việt Nam bắt đầu học tiếng Nhật hoặc Hàn

- [GIẢ ĐỊNH] Muốn thực hành câu tình huống cơ bản, phân biệt cách diễn đạt phù hợp ngữ cảnh và lưu cụm từ cần ôn.
- [GIẢ ĐỊNH] Cần cách hiển thị phù hợp chữ viết (furigana/kana hoặc hangul/jamo) và mức lịch sự; chưa xác định phân khúc học thi, công việc hay giao tiếp có willingness-to-pay cao hơn.

### Jobs-To-Be-Done

1. Khi có vài phút rảnh, tôi muốn luyện một tình huống cụ thể để biết mình có thể diễn đạt ý chính hay không.
2. Khi không thể nói thành tiếng, tôi muốn tiếp tục bằng tin nhắn mà không mất tiến độ.
3. Khi phản hồi của hệ thống không chắc chắn, tôi muốn được hỏi lại hoặc được giải thích giới hạn thay vì nhận một lỗi sai được khẳng định như sự thật.
4. Khi quên một cụm từ, tôi muốn gặp lại cụm đó trong lịch ôn và có cơ hội dùng nó trong câu mới.

## 3. Cơ sở sư phạm và giới hạn bằng chứng

- **Spaced Repetition / retrieval practice:** [SUY LUẬN] Dùng lịch ôn để tạo cơ hội truy hồi thay vì chỉ đọc lại. FSRS là thuật toán lập lịch, không phải bằng chứng tự thân rằng ứng dụng cải thiện năng lực giao tiếp. D1 ghi nhận FSRS-7 và thư viện liên quan; tương thích chéo `ts-fsrs`/`py-fsrs` còn cần xác nhận (D1, mục 8; nguồn S28–S32; truy cập 22/11/2026). Trong PRD, chưa khóa algorithm/package version.
- **Comprehensible Input:** [GIẢ ĐỊNH] Hội thoại và ví dụ nên đủ dễ hiểu để người học theo được, nhưng vẫn có một thử thách nhỏ. Mức độ phù hợp và tác động trong nhóm người học Việt mục tiêu **CHƯA XÁC MINH**; sẽ kiểm thử bằng hiểu nhiệm vụ và khả năng dùng lại.
- **Output Hypothesis:** [GIẢ ĐỊNH] Yêu cầu người học tự diễn đạt có thể bộc lộ chỗ chưa diễn đạt được và tạo cơ hội dùng ngôn ngữ. Chưa có dữ liệu của sản phẩm chứng minh sửa lỗi tự động giúp chuyển giao sang nói tự do; chỉ kiểm thử với phản hồi tối đa 1–2 điểm/lượt và đo bằng nhiệm vụ mới.
- **Contextual learning:** [GIẢ ĐỊNH] Gắn từ/cấu trúc vào tình huống và yêu cầu dùng lại có thể hỗ trợ truy hồi theo ngữ cảnh. Chưa được xác nhận cho người dùng mục tiêu; so sánh với ôn riêng lẻ trong thí nghiệm.
- [ĐÃ XÁC MINH] D1 ghi một preprint tổng hợp MALL với nguy cơ bias cao và chất lượng bằng chứng thấp; kết quả chung của MALL không chứng minh ứng dụng hoặc tính năng cụ thể hiệu quả (D1, mục 9; nguồn S33; truy cập 22/11/2026).
- [CHƯA XÁC MINH] Chưa có cơ sở để ước lượng số giờ đạt B1/B2 riêng cho người Việt học Anh/Nhật/Hàn hoặc hứa hẹn mốc tiến bộ. Không đưa cam kết thời gian đạt trình độ vào sản phẩm cho tới khi có nguồn phù hợp và cách đo rõ.

## 4. Phạm vi MVP và ngoài phạm vi

### Trong phạm vi đề xuất

- Một luồng học ngắn 3–5 phút [ĐÃ XÁC MINH — yêu cầu thiết kế từ `MASTER_PROMPT.md`, mục C3; không phải thời lượng tối ưu đã được nghiên cứu].
- Mục tiêu/cụm từ có ví dụ theo ngữ cảnh; người học có thể đánh dấu chưa biết và ôn lại.
- Luyện theo hội thoại tình huống bằng văn bản; thử giọng nói khi có thiết bị/môi trường phù hợp; cho phép tiếp tục bằng văn bản.
- Phản hồi có cấu trúc: câu trả lời, tối đa 1–2 đề xuất sửa có liên quan, và mục tiêu từ/cụm từ đã dùng. Không tự chuyển lỗi chưa xác nhận thành thẻ học.
- Hiển thị so khớp văn bản theo từ tiếng Anh, kana tiếng Nhật và jamo tiếng Hàn như một tín hiệu độ dễ hiểu, không phải điểm phát âm.
- Nhắc lại mục tiêu theo SRS; mọi đề xuất lịch thuật toán ở giai đoạn này là cần kiểm thử, không phải quyết định phiên bản.
- Thiết lập quota có giới hạn và thông báo khi hết lượt; không đặt giá hoặc quota trả phí trước khi có cost model.
- MVP nội dung được biên soạn/kiểm duyệt; nguồn, giấy phép và quyền sử dụng phải được xác minh trước khi phát hành.

### Ngoài phạm vi MVP

- Chấm âm vị, “giọng bản xứ”, chẩn đoán y tế/ngôn ngữ trị liệu, hoặc tuyên bố chính xác pronunciation score.
- Hứa hẹn đạt CEFR/JLPT/TOPIK trong thời gian cố định; kiểm tra chứng chỉ chính thức.
- Nội dung tự sinh không qua kiểm duyệt; tự động thêm mọi sửa lỗi AI vào từ điển/SRS.
- Mạng xã hội, leaderboard cạnh tranh, streak gây phạt, marketplace nội dung, voice clone và thu thập giọng nói nền.
- Tuyên bố triển khai ngoại tuyến đầy đủ. Hỗ trợ offline, đồng bộ xung đột và retention dữ liệu cần quyết định kiến trúc ở Giai đoạn 3.
- Mở bán trước khi hoàn thành thử nghiệm giá, chính sách quyền riêng tư và cost model.

### Ngôn ngữ và chiến lược ra mắt

- [GIẢ ĐỊNH — CẦN DUYỆT] Giữ mục tiêu kỹ thuật Anh/Nhật/Hàn nhưng chỉ thử nghiệm nội dung/UX với một nhóm ngôn ngữ đầu tiên; đề xuất chọn tiếng Anh để giảm số biến trong pilot. Bài kiểm thử chuẩn hóa kana/jamo vẫn cần có trước khi phát hành hỗ trợ Nhật/Hàn.
- Nếu cần ra mắt cả ba ngay, cần mở rộng biên tập/kiểm duyệt theo từng ngôn ngữ; chưa có bằng chứng năng lực sản xuất nội dung cho cả ba trong bốn tuần của một lập trình viên.

## 5. User stories và tiêu chí chấp nhận

1. **Luyện khi không thể nói**
   - Given tôi đang ở nơi không tiện nói, When tôi mở một bài hội thoại, Then tôi có thể chọn chế độ nhắn tin và hoàn thành cùng mục tiêu học mà không bị yêu cầu bật microphone.

2. **Nhận phản hồi có giới hạn**
   - Given tôi gửi một lượt nói hoặc văn bản, When hệ thống phản hồi, Then phản hồi theo schema có `reply`, `corrections` tối đa hai mục và `target_words_used`; nội dung không chắc chắn phải nêu không chắc chắn hoặc hỏi lại.

3. **Xem so khớp mà không bị chẩn đoán quá mức**
   - Given có transcript và câu/ý mục tiêu, When kết quả được hiển thị, Then phép so khớp dùng đơn vị phù hợp (từ/kana/jamo), chỉ rõ thay thế/xóa/chèn và có nhãn “độ dễ hiểu”; không hiển thị nhãn phoneme-level hoặc “phát âm chuẩn”.

4. **Tạo thẻ từ lỗi đã xác nhận**
   - Given phản hồi đề xuất một sửa lỗi mới, When tôi chưa xác nhận, Then lỗi đó chưa được đưa vào bộ thẻ cá nhân; khi tôi xác nhận, hệ thống mới lưu mục tiêu để ôn.

5. **Ôn với quyền kiểm soát**
   - Given một thẻ đến hạn, When tôi chọn đánh giá mức nhớ, Then hệ thống lưu lựa chọn và lịch ôn mới; tôi có thể bỏ qua hoặc điều chỉnh số thẻ mới mà không mất nội dung.

6. **Quota minh bạch**
   - Given lượt dùng đã chạm quota cấu hình, When tôi gửi lượt mới, Then hệ thống trả trạng thái quota và cách tiếp tục rõ ràng, không tính phí hoặc tạo giao dịch ngầm.

7. **Quyền riêng tư giọng nói**
   - Given tôi bắt đầu ghi âm, When trước khi thu dữ liệu, Then giao diện thông báo mục đích, thời gian lưu và quyền xóa; mặc định không lưu audio sau khi xử lý nếu không có đồng ý riêng. Cơ chế cụ thể cần duyệt pháp lý và thiết kế ở Giai đoạn 3.

## 6. Yêu cầu phi chức năng và chất lượng

- **Độ trễ:** mục tiêu thiết kế 1.5–2.5 giây tới âm thanh phản hồi đầu tiên cho cascade được lấy từ `MASTER_PROMPT.md` mục C2; chưa đo, không phải cam kết SLA. Ghi riêng latency từng bước và p50/p95 trong pilot.
- **Tính sẵn sàng/khả năng mở rộng:** prototype chỉ chứng minh một luồng nhỏ. Ngưỡng người dùng đồng thời và SLA production **CHƯA XÁC MINH**, phải đặt sau khi có workload và kiến trúc.
- **Bảo mật:** không nhúng khóa API; secret qua môi trường/secret manager; giới hạn dữ liệu cá nhân trong log; kiểm soát truy cập và xóa dữ liệu theo chính sách được duyệt.
- **Quyền riêng tư:** xin phép rõ ràng trước khi ghi; tối thiểu hóa audio/transcript; cho phép xóa; không dùng audio huấn luyện model mặc định. Nghĩa vụ pháp lý ở Việt Nam và thị trường tương lai cần luật sư xác nhận.
- **Accessibility:** thao tác bàn phím, nhãn screen reader, tương phản phù hợp, không dựa duy nhất vào màu để hiển thị lỗi.
- **Độ tin cậy nội dung:** lưu nguồn, ngôn ngữ, mức độ, giấy phép và trạng thái duyệt cho nội dung phát hành; tài liệu chưa rõ quyền không đưa vào production.
- **AI/Speech:** ASR chỉ là nhận dạng; kết quả rỗng/không đáng tin phải yêu cầu thử lại hoặc chuyển sang văn bản. Không diễn giải transcript thành đánh giá âm vị.

## 7. UX chính

Mỗi màn hình có một nhiệm vụ chính; tiết lộ dần thông tin theo yêu cầu `MASTER_PROMPT.md` C3.

1. **Chọn mục tiêu:** chọn ngôn ngữ/tình huống hoặc “ôn đến hạn”; không hiển thị nhiều dashboard cùng lúc.
2. **Tình huống:** đưa một prompt ngắn, mục tiêu giao tiếp và một lựa chọn nói/nhắn tin.
3. **Thực hành:** nhận câu trả lời ngắn; khi ASR mơ hồ, người nghe hiệu chuẩn hỏi lại thay vì đoán.
4. **Phản hồi:** tối đa hai gợi ý; người học chấp nhận/bỏ qua; lỗi mới chỉ được lưu sau xác nhận.
5. **Ôn:** một thẻ tại một thời điểm, bốn mức phản hồi theo SRS; kết thúc không phạt khi dừng giữa chừng.
6. **Kết thúc phiên:** tóm tắt điều đã thử, mục tiêu đã dùng và lịch ôn; không phát điểm tiến bộ không có cơ sở.

## 8. Chỉ số thành công

Không có baseline người dùng; các chỉ số dưới đây là định nghĩa cần thống nhất, chưa có target số được kiểm chứng.

### North Star đề xuất

**Số người học duy nhất mỗi tuần hoàn tất ít nhất một vòng luyện có ý nghĩa:** gửi một lượt nói/nhắn tin → nhận hoặc chủ động bỏ qua phản hồi → hoàn thành một lần truy hồi mục tiêu (trong phiên hoặc khi đến hạn). Báo cáo riêng phiên text và voice. Đây là proxy hành vi, không tự chứng minh tiến bộ.

### Chỉ số hỗ trợ

- **Retention D1/D7/D30:** phần trăm người dùng thuộc cohort đăng nhập/hoàn thành phiên lại lần lượt vào ngày kế tiếp, ngày thứ 7, ngày thứ 30; định nghĩa cửa sổ ngày và mẫu số phải cố định trước phân tích.
- **Transfer:** tỷ lệ hoàn thành nhiệm vụ nói tự do mới với cùng khái niệm nhưng prompt khác. Chấm bằng rubric được người đánh giá độc lập hiệu chuẩn; không lấy WER/CER làm điểm phát âm.
- **Recall:** tỷ lệ truy hồi đúng ở bài kiểm tra trì hoãn (ví dụ 24 giờ/7 ngày là mốc thiết kế giả định) và tỷ lệ dùng mục tiêu phù hợp trong ngữ cảnh mới.
- **Từ nói mỗi phút:** số từ được nhận dạng trong các lượt voice chia cho thời lượng nói chủ động; báo cáo theo ngôn ngữ và chất lượng transcript. Không trộn tin nhắn với lời nói; tokenization tiếng Nhật/Hàn cần định nghĩa riêng.
- **Chi phí AI / MAU:** tổng chi phí ASR + LLM + TTS trong kỳ chia cho người dùng hoạt động tháng; loại riêng mock, retry, audio rỗng, quota miễn phí và thuế. Chưa thể tính bằng số liệu D1; thực hiện ở Giai đoạn 3.
- **An toàn phản hồi:** tỷ lệ gợi ý bị người học/giáo viên đánh dấu sai, tỷ lệ hỏi lại khi mơ hồ, và tỷ lệ sự cố nội dung theo ngôn ngữ.
- **UX:** hoàn thành tác vụ, bỏ dở, chuyển voice→text, yêu cầu xóa dữ liệu, phản hồi về mức quá tải. Không dùng streak hoặc thời lượng làm chỉ số duy nhất.

## 9. Thí nghiệm kiểm chứng

Tất cả giả thuyết dưới đây chưa được kiểm chứng. Trước khi tuyển người, xác định consent, tập nhiệm vụ, quy tắc loại trừ, phân tích thống kê và cỡ mẫu bằng power analysis; không kết luận từ mẫu tiện lợi nhỏ.

### E1 — “Người nghe có hiệu chuẩn”

- **Giả thuyết:** [GIẢ ĐỊNH] Khi câu nói mơ hồ, hệ thống hỏi lại có thể tăng khả năng hoàn thành đúng ý so với đoán và trả lời ngay.
- **Thiết kế:** phân nhóm ngẫu nhiên theo người học hoặc theo nhiệm vụ; đối chứng trả lời theo transcript tốt nhất, nhánh thử nghiệm hỏi lại ở trường hợp mơ hồ theo quy tắc được định trước.
- **Đo lường chính:** hoàn thành đúng ý trong nhiệm vụ mới, được người chấm mù điều kiện đánh giá.
- **Đo lường phụ:** tỷ lệ hỏi lại, lượt cần nói lại, thời gian, bỏ dở, mức tin cậy và sự cố khi hỏi lại không cần thiết.
- **Lan can:** không tính “nói lại nhiều hơn” là thành công nếu tỷ lệ hoàn thành nhiệm vụ/UX xấu đi; cho phép người học chuyển sang văn bản.

### E2 — Mục tiêu SRS trong hội thoại so với ôn tách rời

- **Giả thuyết:** [GIẢ ĐỊNH] Dùng mục tiêu từ/cụm từ trong tình huống mới có thể cải thiện truy hồi trì hoãn hoặc transfer so với chỉ ôn thẻ.
- **Thiết kế:** cùng danh sách mục tiêu và thời lượng; so sánh nhóm có lượt dùng mục tiêu trong hội thoại với nhóm ôn flashcard, có bài kiểm tra 24 giờ/7 ngày.
- **Đo lường chính:** recall trì hoãn và dùng mục tiêu đúng trong prompt chưa từng luyện; phân tích riêng theo ngôn ngữ.
- **Lan can:** ghi nhận thời lượng và tải nhận thức; không cho nhóm nào thiếu nội dung cần thiết.

### E3 — Một gợi ý sửa so với tối đa hai

- **Giả thuyết:** [GIẢ ĐỊNH] Giới hạn phản hồi còn một gợi ý có thể giảm quá tải mà không làm giảm sửa lỗi quan trọng so với tối đa hai gợi ý.
- **Thiết kế:** hai nhánh, cả hai đều không quá hai gợi ý và chỉ phản hồi lỗi có bằng chứng; cùng tình huống và độ khó.
- **Đo lường chính:** tỷ lệ người học áp dụng đúng gợi ý trong lượt sau và trong nhiệm vụ transfer.
- **Đo lường phụ:** bỏ dở, thời gian xử lý phản hồi và mức tự báo cáo tải nhận thức.

### Quy tắc quyết định chung

Không chọn biến thể chỉ vì tăng engagement. Xem xét tiếp khi outcome học tập không giảm, chỉ số tin cậy/an toàn đạt ngưỡng đã thống nhất trước thử nghiệm, và không có dấu hiệu tăng bỏ dở đáng kể. Ngưỡng số và cỡ mẫu **CHƯA XÁC MINH**; cần đặt sau baseline và kế hoạch phân tích.

## 10. Mô hình giá và kế hoạch kinh doanh

- [GIẢ ĐỊNH] Thử mô hình freemium có quota rõ ràng và thuê bao trả phí cho hạn mức/tiện ích mở rộng; không chốt mức giá, quota hay ARPU tại Giai đoạn 2.
- [CHƯA XÁC MINH] WTP của người học Việt, chi phí biến đổi của một phiên, tỉ lệ chuyển đổi, churn và điểm hòa vốn.
- Trước thử giá: tính cost theo kịch bản ở Giai đoạn 3; sau đó thử nghiên cứu willingness-to-pay (phỏng vấn và trang mô tả giá có kiểm soát) và xác minh giá theo nền tảng/khu vực.
- Tránh “free trial” hoặc gia hạn tự động gây bất ngờ; trình bày quota, cách hủy, giới hạn AI và chính sách hoàn tiền rõ ràng.

## 11. Lộ trình sau MVP

Lộ trình dưới đây là thứ tự ưu tiên, không phải cam kết ngày phát hành.

1. **Sau prototype:** kiểm tra tính đúng của SRS, xử lý rỗng/ảo giác ASR, JSON contract, quota, accessibility và consent.
2. **Pilot có kiểm soát:** phỏng vấn, usability test và ba thí nghiệm ở mục 9; chỉ mở cohort mới sau khi xử lý các lỗi nghiêm trọng.
3. **Mở rộng nội dung/ngôn ngữ:** chỉ mở rộng Nhật/Hàn hoặc tăng thư viện khi có kiểm duyệt, quy trình giấy phép và người đánh giá phù hợp.
4. **Production readiness:** auth, đồng bộ offline, observability, moderation, retention/deletion, billing, cost guardrails, review bảo mật và tư vấn pháp lý.
5. **Tối ưu thương mại:** giá/quota và acquisition chỉ sau khi có cost model, WTP và tín hiệu retention/transfer; không dùng số tải/rating của đối thủ làm dự báo doanh thu.

## 12. Quyết định cần duyệt

1. Có đồng ý với định vị giả thuyết “vòng luyện ngắn: diễn đạt → phản hồi có giới hạn → dùng lại → ôn” thay vì định vị “AI chấm phát âm” không?
2. Có đồng ý chọn người lớn luyện giao tiếp tiếng Anh làm nhóm pilot đầu tiên, còn Nhật/Hàn là phạm vi kỹ thuật/nội dung thử nghiệm tiếp theo không?
3. Có đồng ý dùng freemium + thuê bao như một giả thuyết, nhưng chưa đặt giá/quota trước Giai đoạn 3 không?
4. Có đồng ý chỉ thu audio khi người dùng chủ động bật, mặc định không lưu audio sau xử lý, và yêu cầu duyệt chính sách/lawyer trước production không?
5. Có đồng ý các thí nghiệm E1–E3 và ưu tiên nhiệm vụ transfer/recall, không engagement đơn thuần, làm tiêu chí quyết định không?

## 13. Nguồn và giới hạn

- `MASTER_PROMPT.md`, yêu cầu D3 và các mục C1–C4; đọc ngày 23/11/2026.
- `01_research_report.md` (D1), đọc ngày 23/11/2026. Các dữ kiện cạnh tranh tham chiếu nguồn S01–S18; tổng quan MALL S33; FSRS S28–S32; tài liệu ASR S26. Ngày truy cập nguồn như ghi tại D1: 22/11/2026.
- Giá, số người dùng, độ chính xác, WTP, retention, chi phí mỗi phiên, hiệu quả học riêng cho app/ngôn ngữ/người học Việt: **CHƯA XÁC MINH**.
- Giờ học dự kiến tới CEFR B1/B2 cho nhóm này: **CHƯA XÁC MINH**; không đưa ước lượng khi chưa có nguồn phù hợp.