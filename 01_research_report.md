# 01 — Báo cáo nghiên cứu thị trường và đối thủ (bản nháp)

**Ngày truy cập nguồn:** 22/11/2026  
**Thị trường ưu tiên:** Việt Nam  
**Ngôn ngữ đích:** Anh, Nhật, Hàn  
**Trạng thái:** Bản nháp Giai đoạn 1; các phần thiếu được đánh dấu rõ, không dùng làm kết luận đầu tư.

## 1. Tóm tắt

1. [ĐÃ XÁC MINH] Các sản phẩm trong danh sách không cùng một loại: có ứng dụng học theo chương trình, công cụ SRS, ứng dụng luyện nói bằng AI, thư viện nội dung nhập vai và trợ lý đa dụng. Vì vậy, điểm đánh giá App Store, giá gói và số người dùng không thể so sánh trực tiếp nếu không chuẩn hóa phạm vi.
2. [SUY LUẬN] Khoảng trống có thể kiểm chứng tiếp là kết hợp nội dung có kiểm duyệt với SRS, luyện nói có phản hồi giới hạn theo bằng chứng, và đo chuyển giao sang giao tiếp tự do. Đây là giả thuyết định vị, chưa phải lợi thế cạnh tranh đã được chứng minh.
3. [ĐÃ XÁC MINH] Một số đối thủ công khai quảng bá hội thoại AI hoặc luyện nói; một số khác tập trung vào SRS, bài học theo giáo trình, video người bản xứ hoặc nội dung đọc/nghe. Chi tiết từng sản phẩm và nguồn được ghi trong D2.
4. [ĐÃ XÁC MINH] Giá API có thể lấy từ nguồn chính thức nhưng cách tính khác nhau (phút audio, ký tự, token hoặc thời gian phiên). Không quy đổi thành chi phí mỗi phiên/người dùng nếu chưa cố định kịch bản sử dụng.
5. [ĐÃ XÁC MINH] Repo FSRS hiện công khai FSRS-7 với 34 tham số; README của `ts-fsrs` nêu thư viện hỗ trợ FSRS-7. Phiên bản package và phiên bản thuật toán là hai thứ riêng. Cần xác minh tương thích cụ thể với `py-fsrs` trước khi chốt kiến trúc.
6. [SUY LUẬN] Rà soát ban đầu chưa tìm thấy bằng chứng độc lập đủ mạnh để xếp hạng hiệu quả học tập của từng ứng dụng. Nguồn học thuật tìm được là phân tích tổng hợp về MALL nói chung, không kiểm chứng các ứng dụng trong danh sách.
7. [ĐÃ XÁC MINH] Đã lấy mẫu 531 đánh giá App Store gần đây cho 18 sản phẩm: 17 sản phẩm có đủ 30 đánh giá; Bunpro có 21 đánh giá trong cửa hàng Nhật/Mỹ. Đây là mẫu tiện lợi, không đại diện toàn bộ người dùng; bảng chi tiết và giới hạn ở mục 4 và D2.

## 2. Phạm vi và phương pháp

- Danh sách gồm 10 đối thủ được yêu cầu (Duolingo, ELSA Speak, Anki, Speak, Babbel, Busuu, Memrise, LingQ, Praktika, Langua), hai trợ lý đa dụng (ChatGPT Voice, Gemini Live), ba ứng dụng có mặt tại cửa hàng Việt Nam (eJOY, Cake, MochiVocab), và ba ứng dụng chuyên Nhật/Hàn (LingoDeer, Bunpro, Teuida).
- Tính năng được tổng hợp từ trang/tài liệu chính thức hoặc mô tả cửa hàng ứng dụng. Tuyên bố do hãng tự công bố không được xem là đánh giá độc lập.
- Giá gói tiêu dùng chỉ được ghi khi trang chính thức hiển thị giá và thời hạn đủ rõ. Giá theo quốc gia, nền tảng, khuyến mãi và tài khoản có thể khác; nơi không thể xác minh được đánh dấu **CHƯA XÁC MINH**.
- Xếp hạng và số lượng rating trên Apple App Store là ảnh chụp dữ liệu theo cửa hàng Việt Nam tại ngày truy cập, không phải số lượt tải, người dùng hoạt động hay đánh giá hiệu quả.
- Đánh giá gần đây: khoảng thời gian 22/11/2025–22/11/2026; lấy tối đa 30 đánh giá mới nhất trong RSS App Store theo cửa hàng Việt Nam. Với sản phẩm thiếu mẫu tại Việt Nam, dùng cửa hàng Mỹ; riêng Bunpro dùng Nhật và Mỹ. Chỉ tổng hợp rating và một số tín hiệu từ từ khóa; không lưu danh tính hay trích nguyên văn review.
- Không khảo sát Google Play review theo mẫu 30 trong giai đoạn này. Mọi rating/review trong báo cáo vì vậy chỉ đại diện mẫu App Store đã mô tả.

## 3. Đối thủ và điểm cần kiểm chứng

| Sản phẩm | Điểm mạnh có nguồn | Điểm mù / giới hạn bằng chứng |
|---|---|---|
| Duolingo | [ĐÃ XÁC MINH] Mô tả App Store nêu luyện nghe, nói, đọc, viết, bài ngắn, điểm thưởng và leaderboard; có nhiều khóa học, gồm Nhật/Hàn/Anh. [S01] | [SUY LUẬN] Gamification và bài tập ngắn có thể tăng tần suất dùng nhưng chưa đủ chứng minh khả năng nói tự do. [CHƯA XÁC MINH] Giá theo gói tại Việt Nam, hạn mức AI, thuật toán SRS và hiệu quả riêng cho người Việt. |
| ELSA Speak | [ĐÃ XÁC MINH] Trang Việt Nam định vị luyện phát âm, phản hồi tức thì, từ điển và lộ trình học; tuyên bố có phản hồi đến âm tiết/âm vị. [S02] | [SUY LUẬN] Tuyên bố chấm chi tiết là tuyên bố của nhà cung cấp, không phải kết quả kiểm thử độc lập. [CHƯA XÁC MINH] Độ chính xác theo giọng người Việt, mô hình/pipeline nội bộ và giá hiện hành theo từng gói. |
| Anki | [ĐÃ XÁC MINH] Ứng dụng flashcard tùy biến, hỗ trợ media, sync miễn phí qua AnkiWeb; lịch ôn được thiết kế để ưu tiên nội dung dễ quên. [S03] | [SUY LUẬN] Công cụ linh hoạt nhưng người học tự tìm/tạo deck và tự thiết kế hoạt động nghe-nói; trải nghiệm phụ thuộc deck/add-on. [CHƯA XÁC MINH] Giá AnkiMobile tại Việt Nam trong đợt tra cứu này. |
| Speak | [ĐÃ XÁC MINH] Trang chính thức mô tả curriculum do chuyên gia thiết kế, luyện câu mẫu rồi hội thoại qua Speak Tutor; có nhiều ngôn ngữ, trong đó có Anh, Nhật, Hàn. [S04] | [SUY LUẬN] Thế mạnh tập trung vào output nói; [CHƯA XÁC MINH] SRS có thể kiểm tra độc lập, mức phủ bốn kỹ năng, offline và giá Việt Nam. |
| Babbel | [ĐÃ XÁC MINH] Trang chính thức nêu bài học ngắn, thực hành đọc/nghe/viết/nói, nhận diện giọng nói, hội thoại tương tác và AI partner. [S05] | [SUY LUẬN] Nội dung giáo trình có cấu trúc; [CHƯA XÁC MINH] giá gói Việt Nam, hạn mức AI, chất lượng nhận diện giọng Việt và mức độ hỗ trợ Nhật/Hàn tại cửa hàng Việt Nam. |
| Busuu | [ĐÃ XÁC MINH] Trang chính thức nêu khóa học theo trình độ, kỹ năng thực tế, grammar và phản hồi từ cộng đồng người học. Các số “registered users”/“community interactions” là số do hãng tự công bố. [S06] | [SUY LUẬN] Community feedback có thể tạo yếu tố con người nhưng độ đồng nhất/chất lượng sửa bài cần đo. [CHƯA XÁC MINH] SRS, AI conversation, giá và offline theo Việt Nam. |
| Memrise | [ĐÃ XÁC MINH] Trang chính thức giới thiệu video người bản xứ, luyện nghe-nhại, smart review và AI practice; con số người học trên website là tuyên bố của hãng. [S07] | [SUY LUẬN] Video tự nhiên hỗ trợ nhận diện ngôn ngữ đời thực; [CHƯA XÁC MINH] đo năng lực giao tiếp tự do, giá Việt Nam và mức độ sắp xếp nội dung Nhật/Hàn cho người học Việt. |
| LingQ | [ĐÃ XÁC MINH] Tập trung vào nội dung đọc/nghe thực tế, từ vựng trong ngữ cảnh và theo dõi tiến độ; website nêu 53 ngôn ngữ và 5M+ người học (tự công bố). [S08] | [SUY LUẬN] Học qua nội dung tự chọn có thể phù hợp người học trung cấp nhưng làm tăng gánh nặng chọn tài liệu cho người mới. [CHƯA XÁC MINH] Giá, SRS theo nghĩa thuật toán, và chất lượng hội thoại AI ở thị trường Việt Nam. |
| Praktika | [ĐÃ XÁC MINH] Website giới thiệu AI language tutors và các kịch bản hội thoại; số rating/learner trên website là tuyên bố của hãng. [S09] | [SUY LUẬN] Avatar/role-play có thể giảm ngại nói; [CHƯA XÁC MINH] chất lượng feedback theo bằng chứng, hỗ trợ SRS, khóa học Nhật/Hàn và giá tại Việt Nam. |
| Langua | [ĐÃ XÁC MINH] Website giới thiệu hội thoại với AI, role-play, sửa lỗi, lưu từ vào flashcard/story/conversation; trial và giá phụ thuộc gói/kênh. [S10] | [SUY LUẬN] Có thể nối luyện nói và từ vựng trong ngữ cảnh; [CHƯA XÁC MINH] độ phủ/kiểm duyệt nội dung tiếng Nhật-Hàn, giá Việt Nam và bằng chứng hiệu quả độc lập. |
| ChatGPT Voice | [ĐÃ XÁC MINH] Voice hỗ trợ hội thoại tự do; Live có thể nghe-nói đồng thời, còn transcript/text vẫn dùng được. Giới hạn phụ thuộc gói/khu vực. [S11] | [SUY LUẬN] Là đối chứng hội thoại linh hoạt, không phải chương trình học ngôn ngữ có mục tiêu/kiểm duyệt SRS mặc định. [CHƯA XÁC MINH] Giá API ASR/TTS theo kịch bản hội thoại mới và chi phí/giới hạn consumer Việt Nam. |
| Gemini Live | [ĐÃ XÁC MINH] Hỗ trợ hội thoại tự nhiên, ngắt lời và luyện nói thành tiếng; khả năng cung cấp theo đợt, tài liệu nêu trải nghiệm trên ứng dụng di động. [S12] | [SUY LUẬN] Là đối chứng đa dụng, chưa cho thấy có lịch học, đánh giá phát âm có kiểm chứng hay SRS gắn với từng lỗi. [CHƯA XÁC MINH] hạn mức/tính khả dụng cụ thể tại Việt Nam trong ngày truy cập. |
| eJOY | [ĐÃ XÁC MINH] Trang chính thức nêu video có phụ đề, tra/lưu từ, review theo spaced repetition, và hội thoại AI; số 1.5M+ worldwide users là tự công bố. [S13] | [SUY LUẬN] Có lợi thế nối nội dung video với từ vựng; [CHƯA XÁC MINH] độ phủ Nhật/Hàn, điều kiện dùng video bên thứ ba, chi phí/tỷ lệ sử dụng AI và đánh giá độc lập. |
| Cake | [ĐÃ XÁC MINH] Trang chính thức giới thiệu học tiếng Anh/Hàn qua video/ngôn ngữ đời thực; có ứng dụng tại cửa hàng Việt Nam. [S14] | [SUY LUẬN] Học từ nội dung ngắn có thể tăng tính gần gũi; [CHƯA XÁC MINH] tính năng SRS, curriculum/đầu ra CEFR, mức AI và giá thuê bao tại Việt Nam. |
| MochiVocab | [ĐÃ XÁC MINH] Trang Việt Nam giới thiệu từ vựng tiếng Anh, spaced repetition, 5 cấp độ ghi nhớ và hiển thị giá một lần 749.000đ/1 năm, 1.499.000đ/3 năm cùng các ưu đãi. Trang đồng thời hiển thị thời hạn khuyến mãi khác nhau, nên không thể coi đây là báo giá ổn định. [S15] | [SUY LUẬN] Tập trung từ vựng/SRS, không tương đương ứng dụng hội thoại đa kỹ năng. [CHƯA XÁC MINH] phiên bản thuật toán, tính hợp lệ của tuyên bố “thời điểm vàng”, và giá checkout thực tế sau đăng nhập/ưu đãi. |
| LingoDeer | [ĐÃ XÁC MINH] Website nêu curriculum theo grammar, flashcards, audio người bản xứ, stories và khóa Nhật/Hàn; có các khóa ngôn ngữ khác. [S16] | [SUY LUẬN] Phù hợp làm đối chứng học chuyên ngôn ngữ có cấu trúc; [CHƯA XÁC MINH] giá Việt Nam, offline, chấm phát âm và đánh giá chuyển giao hội thoại. |
| Bunpro | [ĐÃ XÁC MINH] Website/Google Play mô tả grammar library, SRS, câu ví dụ có audio; listing Google Play nêu 25 JLPT practice tests hỗ trợ offline. [S17] | [SUY LUẬN] Mạnh ở grammar/review tiếng Nhật, không phải đối thủ đầy đủ cho hội thoại đa ngôn ngữ. [CHƯA XÁC MINH] giá Việt Nam và tính chính xác của mọi nội dung do người học/cộng đồng đóng góp. |
| Teuida | [ĐÃ XÁC MINH] Website giới thiệu bài học hội thoại tình huống thực, luyện nói từ đầu và phản hồi phát âm; nội dung mẫu tập trung tiếng Hàn. [S18] | [SUY LUẬN] Có thể giảm ngại nói nhờ kịch bản; [CHƯA XÁC MINH] SRS, hỗ trợ offline, giá Việt Nam và độ tin cậy của điểm phát âm độc lập. |

## 4. Đánh giá người dùng: mẫu gần đây

Nguồn là Apple App Store RSS theo storefront; URL mẫu được tạo theo mẫu ở [S20]. “Trung bình” là rating trong **mẫu đánh giá mới nhất**, không phải rating tổng của ứng dụng. Phân bố dưới đây không chứng minh nguyên nhân hài lòng/không hài lòng.

| Sản phẩm | Store | n | Rating TB mẫu | 1 sao | Phân bố rating trong mẫu |
|---|---:|---:|---:|---:|---|
| Duolingo | Việt Nam | 30 | 3,87 | 6 | 1★:6, 3★:3, 4★:4, 5★:17 |
| ELSA Speak | Việt Nam | 30 | 3,70 | 8 | 1★:8, 2★:1, 3★:1, 4★:2, 5★:18 |
| AnkiMobile | Mỹ | 30 | 1,47 | 23 | 1★:23, 2★:4, 4★:2, 5★:1 |
| Speak | Việt Nam | 30 | 3,40 | 9 | 1★:9, 2★:3, 3★:1, 4★:1, 5★:16 |
| Babbel | Mỹ | 30 | 2,87 | 11 | 1★:11, 2★:3, 3★:5, 4★:1, 5★:10 |
| Busuu | Việt Nam | 30 | 4,03 | 5 | 1★:5, 2★:1, 4★:6, 5★:18 |
| Memrise | Việt Nam | 30 | 3,53 | 6 | 1★:6, 2★:4, 3★:3, 4★:2, 5★:15 |
| LingQ | Mỹ | 30 | 3,97 | 4 | 1★:4, 2★:2, 3★:1, 4★:7, 5★:16 |
| Praktika | Việt Nam | 30 | 3,67 | 9 | 1★:9, 2★:1, 4★:1, 5★:19 |
| Langua | Mỹ | 30 | 3,23 | 9 | 1★:9, 2★:3, 3★:3, 4★:2, 5★:13 |
| ChatGPT | Việt Nam | 30 | 4,13 | 5 | 1★:5, 3★:2, 4★:2, 5★:21 |
| Gemini | Việt Nam | 30 | 4,87 | 0 | 2★:1, 4★:1, 5★:28 |
| eJOY | Việt Nam | 30 | 4,73 | 1 | 1★:1, 4★:4, 5★:25 |
| Cake | Việt Nam | 30 | 4,70 | 2 | 1★:2, 4★:1, 5★:27 |
| MochiVocab | Việt Nam | 30 | 3,93 | 4 | 1★:4, 2★:2, 3★:3, 4★:4, 5★:17 |
| LingoDeer | Việt Nam | 30 | 4,70 | 1 | 1★:1, 3★:1, 4★:3, 5★:25 |
| Bunpro | Nhật 6; Mỹ 15 | 21 | Không gộp | 1 (Mỹ) | Nhật: 4★:1, 5★:5; Mỹ: 1★:1, 3★:1, 4★:1, 5★:12 |
| Teuida | Việt Nam | 30 | 4,93 | 0 | 3★:1, 5★:29 |

**Cỡ mẫu:** 17 × 30 + 6 + 15 = 531 đánh giá [SUY LUẬN từ số mẫu đã lấy]. Bunpro là sản phẩm duy nhất chưa đạt 30; nguồn App Store Nhật có 6 và Mỹ có 15 đánh giá trong khoảng thời gian. Không lấy review cũ hơn để đủ số lượng.

**Tín hiệu từ khóa sơ bộ (không phải phân tích cảm xúc):** với 13 mẫu storefront Việt Nam, đã thử đếm review có chứa từ khóa thuộc nhóm paywall/giá, kỹ thuật, nội dung, nói/phát âm, động lực. Một review có thể thuộc nhiều nhóm; bộ từ khóa không phân biệt lời khen với phàn nàn. Số đếm theo từng sản phẩm không được đóng gói vào D1/D2; sheet `Reviews` chỉ chứa rating và phân bố rating. Năm mẫu storefront khác Việt Nam chưa được mã hóa định tính. Do đó **chưa có kết luận đã kiểm chứng về “nỗi đau lặp lại” cho từng đối thủ**.

**Hạn chế:** mẫu App Store không đại diện người dùng Android/web; storefront Mỹ/Nhật không đại diện Việt Nam; review tự chọn chịu thiên lệch; rating có thể bị ảnh hưởng bởi cập nhật, thanh toán hoặc sự cố ngắn hạn. Không dùng rating mẫu để xếp hạng chất lượng sư phạm.

## 5. Rating tổng trên cửa hàng và quy mô công khai

- [ĐÃ XÁC MINH] Apple Search/Lookup API có thể trả rating tổng và số rating theo storefront. Tuy nhiên, các giá trị tổng theo từng ứng dụng không được đóng gói vào D1/D2 nên không thể đối chiếu lại từ bộ bàn giao này; không dùng chúng làm số người dùng hay số học viên hoàn thành khóa. AnkiMobile không có số liệu VN được đối chiếu trong lần tra cứu. [S19]
- [ĐÃ XÁC MINH — TỰ CÔNG BỐ] ELSA nêu hơn 50M lượt tải toàn cầu và 10M tại Việt Nam; Busuu nêu 120M+ registered users; Memrise nêu 80M learners; LingQ nêu 5M+ learners; eJOY nêu 1.5M+ users; Langua nêu 30,000+ learners. Đây là các chỉ số khác định nghĩa và do chính nhà cung cấp công bố, không đối chiếu được thành một bảng thị phần. [S02, S06–S08, S10, S13]
- [CHƯA XÁC MINH] Doanh thu/ARPU hiện hành của phần lớn đối thủ, MAU/DAU, tỷ lệ chuyển đổi trả phí và xếp hạng tải chuẩn hóa theo Việt Nam. Trang Investor Relations của Duolingo không trả nội dung qua công cụ truy cập lần này; không chép số thứ cấp thay thế.

## 6. Giá ứng dụng tiêu dùng

| Sản phẩm | Kết quả tại ngày truy cập |
|---|---|
| MochiVocab | [ĐÃ XÁC MINH — GIÁ HIỂN THỊ TRÊN WEBSITE] Trang công khai giá 749.000đ/1 năm và 1.499.000đ/3 năm; đồng thời hiển thị ưu đãi/thời hạn khác ở cùng trang. Cần kiểm tra checkout thực tế và điều khoản trước khi so sánh. [S15] |
| Các sản phẩm còn lại | [CHƯA XÁC MINH] Listing App Store hiện “Free/In-App Purchases” hoặc trang giá phụ thuộc locale, đăng nhập, trial hay khuyến mãi; không suy ra giá Việt Nam từ giá Mỹ hoặc từ quảng cáo cũ. D2 ghi rõ trạng thái theo từng ứng dụng. |

## 7. Nền tảng AI và giá API

Giá USD theo trang chính thức tại ngày truy cập 22/11/2026; không cộng thuế, phí nền tảng, chi phí hạ tầng, retry hoặc chiết khấu chưa đủ điều kiện.

| Nhà cung cấp/dịch vụ | Giá/tính phí quan sát được | Ý nghĩa và giới hạn |
|---|---|---|
| Google Cloud Speech-to-Text V2 Standard | [ĐÃ XÁC MINH] $0.016/phút cho bậc đầu đến 500.000 phút/tháng; Dynamic Batch Standard $0.003/phút. [S21] | Tính theo audio được xử lý, làm tròn theo giây; cần kiểm tra locale/model phù hợp Anh/Nhật/Hàn. Không mặc định batch có độ trễ realtime. |
| Azure Speech | [ĐÃ XÁC MINH] F0 công khai 5 giờ STT/tháng và 0,5 triệu ký tự neural TTS/tháng. [S22] | Giá pay-as-you-go phụ thuộc dịch vụ/vùng và bộ chọn giá động; **CHƯA XÁC MINH** một mức trả phí so sánh được. |
| Deepgram Nova-3 | [ĐÃ XÁC MINH] Trang giá hiển thị promo streaming $0.0048/phút mono / $0.0058/phút multilingual; pre-recorded $0.0043 / $0.0052. [S23] | Trang ghi rõ giá khuyến mãi và mức cũ; phải kiểm tra ngày hết hạn, ngôn ngữ, streaming/batch và add-on trước khi chốt ngân sách. |
| ElevenLabs Scribe | [ĐÃ XÁC MINH — TUYÊN BỐ NHÀ CUNG CẤP] Scribe v3 $0.20/giờ; Scribe v3 Live $0.22/giờ. [S24] | “Ít lỗi hơn” trên trang là tuyên bố hãng, không phải đánh giá độc lập theo giọng người Việt. |
| OpenAI transcription | [ĐÃ XÁC MINH] Tài liệu hiện khuyến nghị `gpt-transcribe`; tài liệu đánh dấu `whisper-1`, `gpt-4o-transcribe` và một số model transcription là deprecated, dự kiến ngừng 26/02/2027. [S26] | Giá hiện hành theo phút cho `gpt-transcribe`/`whisper-1` **CHƯA XÁC MINH** trong trang truy cập được; không lấy mức giá cũ làm báo giá. |
| Google Cloud Text-to-Speech | [ĐÃ XÁC MINH] Chirp 3: HD có 1M ký tự miễn phí, sau đó $30/1M ký tự; instant custom voice là $60/1M ký tự. [S27] | Gemini-TTS có biểu giá theo token text/audio; không so sánh trực tiếp với ký tự nếu chưa có cùng văn bản/độ dài. |
| ElevenLabs TTS API | [ĐÃ XÁC MINH] Trang API hiển thị v4 $0.08/1K ký tự, v4 Turbo $0.04/1K, v3 Conversational $0.04/1K. [S24] | Cần xác minh model, giới hạn, chất lượng/giọng/điều khoản thương mại trước khi chọn. |
| OpenAI GPT-Live | [ĐÃ XÁC MINH] API pricing hiển thị $0.05/phút active và $0.02/phút standby; Realtime tính theo token/modality, không tương đương một mức phí phút đơn giản. [S25] | Chi phí thực tế phụ thuộc audio vào/ra và thời lượng; cần một kịch bản đo thống nhất. |
| Deepgram Voice Agent | [ĐÃ XÁC MINH] Standard $0.075/phút; cấu hình Custom BYO LLM+TTS $0.050/phút trên trang giá. [S23] | Khác biệt thành phần bao gồm và chất lượng model nên không so trực tiếp với GPT-Live nếu chưa chuẩn hóa pipeline. |
| LLM text | [ĐÃ XÁC MINH] OpenAI API pricing hiển thị một số model Standard theo 1M token, ví dụ GPT-5 mini $0.25 input / $2.00 output và GPT-4o mini $0.15 / $0.60 ở bảng giá đã truy cập. [S25] | Giá model có thể đổi/deprecate; chi phí mỗi lượt cần token thực đo, không suy ra từ tên “mini”. |

**Whisper và điểm phát âm:** [ĐÃ XÁC MINH] tài liệu OpenAI mô tả các model audio là transcription/ASR trả transcript và ngôn ngữ; không đưa ra điểm phát âm ở cấp âm vị. [S26] [SUY LUẬN] WER/CER so với câu đích có thể đo mức độ khớp văn bản/độ dễ hiểu trong phạm vi giới hạn, nhưng không đủ căn cứ để khẳng định lỗi âm vị hay “giọng chuẩn”. Đây là ranh giới sản phẩm cần giữ cho MVP.

## 8. FSRS và kỹ thuật SRS

- [ĐÃ XÁC MINH] Repo `open-spaced-repetition/awesome-fsrs` mô tả FSRS-7: mô hình DSR, trạng thái gồm `S_long`, `S_short`, `D`, tổng 34 tham số, trong đó 11 tham số định dạng đường cong quên. Đường cong có hai thành phần ngắn/dài hạn rồi kết hợp có trọng số; FSRS-7 hỗ trợ khoảng ôn phân số và tính interval lặp. Công thức đầy đủ ở nguồn [S29]. [S28, S29]
- [ĐÃ XÁC MINH] Tại ngày truy cập, release mới nhất đọc được là `ts-fsrs` v6.0.1 và `py-fsrs` v6.3.3. `ts-fsrs` README nói rõ package v6 mặc định dùng FSRS-7 và hỗ trợ nhiều đời model; README cũng cảnh báo package version khác algorithm version. [S30–S32]
- [CHƯA XÁC MINH] Tài liệu đã truy cập chưa đủ để xác nhận `py-fsrs` v6.3.3 chạy cùng mô hình FSRS-7 với `ts-fsrs` v6.0.1 và cùng định nghĩa dữ liệu/state. Không được coi số major của package là số major của FSRS.
- [SUY LUẬN] Để đáp ứng yêu cầu client/server, Giai đoạn 3 cần pin chính xác algorithm version và package commit/tag, kiểm tra trạng thái/đầu ra chéo bằng golden vectors. Nếu một thư viện chưa hỗ trợ cùng algorithm version, phải nêu quyết định đổi phiên bản/thư viện thay vì âm thầm trộn model.

## 9. Nghiên cứu hiệu quả học và nguồn nội dung

- [ĐÃ XÁC MINH — NGUỒN CHƯA PHẢN BIỆN] Một preprint OSF về MALL công bố phân tích tổng hợp 23 effect sizes và báo cáo hiệu ứng tổng hợp `g=0.88`, đồng thời tự đánh giá nguy cơ bias cao và chất lượng bằng chứng thấp. Kết quả là về các ứng dụng MALL nói chung, không chứng minh Duolingo/ELSA/ứng dụng nào cụ thể hiệu quả ở người học Việt. [S33]
- [CHƯA XÁC MINH] Chưa xác lập bộ nghiên cứu peer-reviewed độc lập đủ để so sánh hiệu quả học tập, retention hay chuyển giao nói giữa từng sản phẩm trong danh sách. Không dùng quảng cáo “effective/proven” của hãng như bằng chứng độc lập.
- [ĐÃ XÁC MINH] Creative Commons BY-SA 4.0 yêu cầu ghi công, nêu thay đổi và chia sẻ phái sinh theo cùng giấy phép trong phạm vi áp dụng. [S35]
- [CHƯA XÁC MINH] Chưa xác nhận giấy phép áp dụng cho từng câu/dữ liệu trong Tatoeba, từng mục Wiktionary, hoặc bộ Common Voice cụ thể và điều kiện dùng thương mại/giọng nói. Các nguồn này chưa được duyệt để nhập vào sản phẩm cho tới khi kiểm tra giấy phép theo từng dataset/record và nghĩa vụ lưu attribution. [S34–S36]
- [CHƯA XÁC MINH] Mức phủ người nói tiếng Việt không bản xứ trong các dataset ASR/pronunciation đã rà soát; không tuyên bố một model “chính xác với giọng Việt” khi chưa có benchmark phù hợp.

## 10. Nhận định chiến lược sơ bộ

1. [SUY LUẬN] Không nên định vị chỉ bằng “có hội thoại AI”; các trợ lý đa dụng và nhiều đối thủ học ngôn ngữ đã cung cấp hội thoại/role-play. Cần kiểm chứng khác biệt qua sự nhất quán giáo trình, SRS có giải thích được, kiểm duyệt nội dung và phản hồi nói không bịa lỗi.
2. [SUY LUẬN] Đối chứng cần tách thành ba nhóm: (a) curriculum/retention (Duolingo, Babbel, Busuu, LingoDeer), (b) speech practice (ELSA, Speak, Praktika, Langua, Teuida), (c) content/vocabulary/SRS (Anki, Memrise, LingQ, eJOY, MochiVocab, Bunpro). Không dùng một bảng điểm tổng duy nhất.
3. [GIẢ ĐỊNH] Nhu cầu người Việt về tiếng Nhật/Hàn chuyên ngành, luyện thi và giao tiếp công việc là giả thuyết phân khúc, chưa kiểm chứng bằng dữ liệu người dùng hoặc willingness-to-pay.
4. [SUY LUẬN] Đối với MVP, cần coi kết quả ASR là ước lượng độ dễ hiểu, hỏi lại khi transcript mơ hồ và chỉ sửa lỗi có bằng chứng. Không gắn nhãn “chấm phát âm chính xác” khi chưa có kiểm định độc lập theo âm vị/giọng.

## 11. Danh mục nguồn

Tất cả nguồn dưới đây được truy cập ngày **22/11/2026**. Nội dung/tính năng và số liệu sản phẩm có thể thay đổi theo thời gian, khu vực và gói dịch vụ.

- [S01] Duolingo App Store Việt Nam: https://apps.apple.com/vn/app/duolingo-language-chess/id570060128
- [S02] ELSA Speak Việt Nam: https://vn.elsaspeak.com/
- [S03] Anki chính thức: https://apps.ankiweb.net/
- [S04] Speak: https://www.speak.com/
- [S05] Babbel: https://www.babbel.com/
- [S06] Busuu: https://www.busuu.com/en
- [S07] Memrise: https://www.memrise.com/
- [S08] LingQ: https://www.lingq.com/en/
- [S09] Praktika: https://praktika.ai/
- [S10] Langua: https://languatalk.com/
- [S11] ChatGPT Voice FAQ: https://help.openai.com/en/articles/20001274-chatgpt-voice
- [S12] Gemini Live: https://support.google.com/gemini/answer/15274899?hl=en
- [S13] eJOY: https://ejoy-english.com/en
- [S14] Cake: https://cake.day/
- [S15] MochiVocab: https://mochidemy.com/tienganh/
- [S16] LingoDeer: https://www.lingodeer.com/
- [S17] Bunpro và listing Google Play: https://bunpro.jp/ ; https://play.google.com/store/apps/details?id=bunpro.jp.bunpro_srs&hl=en&gl=JP
- [S18] Teuida: https://www.teuida.net/en
- [S19] Apple iTunes Search/Lookup API; dữ liệu theo `trackId` từng sản phẩm: https://itunes.apple.com/search?term={app_name}&entity=software&country=vn&limit=5 ; https://itunes.apple.com/lookup?id={app_id}&country=vn
- [S20] Apple App Store RSS reviews, most recent; `{country}` / `{app_id}` thay theo mẫu: https://itunes.apple.com/{country}/rss/customerreviews/page=1/id={app_id}/sortby=mostrecent/json
- [S21] Google Cloud Speech-to-Text pricing: https://cloud.google.com/speech-to-text/pricing
- [S22] Azure Speech pricing: https://azure.microsoft.com/en-us/pricing/details/speech/
- [S23] Deepgram pricing: https://deepgram.com/pricing
- [S24] ElevenLabs API pricing: https://elevenlabs.io/pricing/api
- [S25] OpenAI API pricing: https://developers.openai.com/api/docs/pricing
- [S26] OpenAI audio guides: https://developers.openai.com/api/docs/guides/audio ; https://developers.openai.com/api/docs/guides/speech-to-text ; https://developers.openai.com/api/docs/guides/text-to-speech
- [S27] Google Cloud Text-to-Speech pricing: https://cloud.google.com/text-to-speech/pricing
- [S28] FSRS introduction/current version: https://github.com/open-spaced-repetition/awesome-fsrs/wiki/ABC-of-FSRS
- [S29] FSRS-7 algorithm/equations: https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm
- [S30] Latest `ts-fsrs` release observed: https://github.com/open-spaced-repetition/ts-fsrs/releases/latest
- [S31] `ts-fsrs` README and supported model versions: https://github.com/open-spaced-repetition/ts-fsrs
- [S32] Latest `py-fsrs` release observed: https://github.com/open-spaced-repetition/py-fsrs/releases/tag/v6.3.3
- [S33] Mihaylova & Gorin, “A Meta-Analysis on Mobile-Assisted Language Learning Applications: Benefits and Risks” (OSF preprint, DOI 10.31219/osf.io/ux93y): https://osf.io/ux93y/ ; Crossref metadata: https://api.crossref.org/works/10.31219/osf.io/ux93y
- [S34] Tatoeba terms of use: https://tatoeba.org/en/terms_of_use
- [S35] Creative Commons BY-SA 4.0 deed: https://creativecommons.org/licenses/by-sa/4.0/
- [S36] Mozilla Common Voice datasets: https://commonvoice.mozilla.org/en/datasets
