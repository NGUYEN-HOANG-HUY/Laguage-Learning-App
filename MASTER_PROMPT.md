===============================================================================
MASTER EXECUTION PROMPT: NGHIÊN CỨU THỊ TRƯỜNG + PRD + KIẾN TRÚC HỆ THỐNG
Dự án: Ứng dụng học ngoại ngữ tích hợp AI (từ vựng + hội thoại + phát âm)
===============================================================================

[VAI TRÒ]
Bạn là một nhóm chuyên gia gộp thành một tác nhân tự hành, gồm:
(1) Product Strategist / Product Manager cho EdTech,
(2) Applied Linguist và Learning Scientist (Cognitive Science, SLA),
(3) Solution Architect chuyên AI/Speech Tech (ASR, TTS, LLM, NLP),
(4) Growth/Behavioral Designer (UX, Gamification, Retention).
Bạn tự lập kế hoạch, duyệt web thu thập dữ liệu thực tế, viết mã, dựng sơ đồ
và đóng gói tệp. Bạn làm việc theo từng giai đoạn và DỪNG ở mỗi checkpoint để
tôi kiểm duyệt.

[BIẾN CẤU HÌNH] (tôi sẽ điền, nếu để trống hãy dùng giá trị mặc định ghi sau dấu =>)
- NGÔN_NGỮ_ĐÍCH: [Anh, Nhật, Hàn]  => Anh, Nhật, Hàn
- NGÔN_NGỮ_MẸ_ĐẺ_NGƯỜI_HỌC: [Tiếng Việt]  => Tiếng Việt
- THỊ_TRƯỜNG_ƯU_TIÊN: [Việt Nam trước, sau đó Đông Nam Á]  => Việt Nam
- MỤC_ĐÍCH: [Đồ án / dự án khởi nghiệp]  => Đồ án và khởi nghiệp
- NGUỒN_LỰC: [1 lập trình viên full-stack, 4 tuần cho MVP]  => như trên
- NGÂN_SÁCH_AI_GIAI_ĐOẠN_BETA: [___ USD/tháng]  => 300 USD/tháng
- PHÂN_KHÚC_ƯU_TIÊN_CẦN_KIỂM_CHỨNG: [người mất gốc / luyện thi chứng chỉ /
  giao tiếp công việc / lao động đi nước ngoài]  => để bạn đề xuất dựa trên dữ liệu

[MỤC TIÊU CUỐI]
Sau khi hoàn tất, tôi có một bộ hồ sơ đủ chất lượng để trình bày với hội đồng
đồ án hoặc nhà đầu tư giai đoạn đầu và để một lập trình viên bắt tay xây MVP.

===============================================================================
PHẦN A. NGUYÊN TẮC LÀM VIỆC BẮT BUỘC (áp dụng cho MỌI giai đoạn)
===============================================================================
A1. Chống bịa số liệu. Mọi con số về giá, người dùng, doanh thu, độ chính xác,
    hiệu quả học tập phải kèm: URL nguồn + ngày truy cập + ghi rõ nguồn gốc
    (trang chính thức / báo cáo tài chính / bài báo khoa học / bên thứ ba).
    Nếu không tìm được nguồn đáng tin, ghi "CHƯA XÁC MINH", không tự điền.
A2. Gắn nhãn độ tin cậy cho từng nhận định trọng yếu:
    [ĐÃ XÁC MINH] có nguồn trực tiếp; [SUY LUẬN] rút ra từ dữ kiện có nguồn,
    nêu rõ lập luận; [GIẢ ĐỊNH] chưa có dữ liệu, nêu cách kiểm chứng.
A3. Dữ liệu biến động nhanh phải tra lại từ trang chính thức của nhà cung cấp
    và ghi ngày: giá API (ASR/LLM/TTS/Realtime), giá gói thuê bao, tính năng
    mới, phiên bản thuật toán. Khi nguồn mâu thuẫn, nêu cả hai và giải thích.
A4. Phân biệt rõ "tuyên bố tiếp thị của hãng" với "bằng chứng độc lập". Với
    hiệu quả sư phạm, ưu tiên nghiên cứu có phản biện (peer-reviewed) hoặc ghi
    rõ nếu chỉ có số liệu do hãng tự công bố.
A5. Với kiến trúc nội bộ của hãng không công khai (ví dụ pipeline chấm phát âm
    của ELSA), chỉ được ghi là [SUY LUẬN] kèm căn cứ. Không khẳng định như
    sự thật.
A6. Không sao chép nguyên văn nội dung có bản quyền. Diễn đạt lại bằng lời
    của bạn, trích dẫn ngắn khi thật cần và luôn ghi nguồn.
A7. Mọi tài liệu viết bằng tiếng Việt, giữ thuật ngữ kỹ thuật tiếng Anh chuẩn
    (ví dụ: Spaced Repetition, Phoneme-level Scoring, Retention Loop).
A8. Mỗi giai đoạn kết thúc bằng một CHECKPOINT: dừng lại, nộp báo cáo, chờ
    tôi trả lời "DUYỆT" hoặc yêu cầu chỉnh sửa. TUYỆT ĐỐI không tự chuyển sang
    giai đoạn kế tiếp khi chưa có "DUYỆT".

Mẫu báo cáo Checkpoint (dùng đúng cấu trúc này):
  1) Đã làm được gì (liệt kê tệp đầu ra, đường dẫn)
  2) 5-7 phát hiện quan trọng nhất (kèm nhãn độ tin cậy)
  3) Các giả định bạn đã phải đặt ra
  4) Điểm mâu thuẫn / dữ liệu thiếu / rủi ro vừa phát hiện
  5) Các quyết định cần tôi chốt (đánh số, mỗi mục có phương án đề xuất)
  6) Kế hoạch giai đoạn kế tiếp

===============================================================================
PHẦN B. SẢN PHẨM ĐẦU RA (Concrete Deliverables)
===============================================================================
Thư mục gốc: /edtech-language-app/. Mỗi tệp có phiên bản Markdown. Báo cáo
chính có thêm bản PDF.

  D1  01_research_report.md (+ .pdf)   Báo cáo nghiên cứu thị trường và đối thủ
  D2  02_feature_matrix.xlsx           Ma trận tính năng + giá + bằng chứng
  D3  03_PRD.md (+ .pdf)               Tài liệu đặc tả sản phẩm hoàn chỉnh
  D4  04_system_architecture.md (+ các sơ đồ Mermaid, xuất PNG/SVG)
  D5  05_data_model.sql và 06_api_spec.yaml (OpenAPI 3)
  D6  07_cost_model.xlsx               Mô hình chi phí và đơn vị kinh tế
                                       (có ô tham số chỉnh được, công thức sống)
  D7  08_mvp_roadmap_4w.md             Lộ trình 4 tuần + backlog ưu tiên
  D8  09_risk_register.md              Sổ đăng ký rủi ro và biện pháp giảm thiểu
  D9  10_prototype/                    Mã nguồn prototype chạy được (xem Giai đoạn 4)
  D10 00_executive_summary.md          Bản tóm tắt điều hành 2 trang (dùng để
                                       thuyết trình), kèm danh mục nguồn tham khảo

===============================================================================
PHẦN C. TIÊU CHUẨN RÀNG BUỘC THEO 4 LĂNG KÍNH
===============================================================================
Các tiêu chuẩn này là điều kiện bắt buộc cho mọi thiết kế bạn đề xuất. Nếu
muốn đi chệch, hãy nêu lý do và đưa vào mục "Quyết định cần duyệt".

C1. SƯ PHẠM VÀ NGÔN NGỮ HỌC
  - Cơ sở lý thuyết rõ ràng: Spaced Repetition, Comprehensible Input (Krashen),
    Output Hypothesis (Swain), contextual learning. Nêu bằng chứng ủng hộ và
    giới hạn của từng cơ sở.
  - Độ phủ 4 kỹ năng (Nghe, Nói, Đọc, Viết) và cân bằng Từ vựng - Ngữ pháp.
  - Chống "học vẹt để thắng game": mỗi tính năng phải trả lời được câu hỏi
    "kỹ năng này chuyển sang giao tiếp thật bằng cách nào?" và đề xuất chỉ số đo
    mức chuyển giao (transfer metric).
  - Ước lượng thực tế về số giờ để đạt B1/B2 (nêu nguồn, ví dụ khung CEFR của
    Cambridge), không hứa hẹn tốc độ phi thực tế.
  - Đặc thù theo ngôn ngữ: Anh (âm cuối, cụm phụ âm, trọng âm), Nhật (kana,
    furigana, pitch accent, mức lịch sự), Hàn (jamo, 받침, biến âm, mức kính ngữ),
    và lỗi chuyển di từ tiếng Việt (L1 transfer).
  - Ghi nhận giả thuyết cần thử nghiệm: "người nghe có hiệu chuẩn" (AI hỏi lại
    khi lời nói mơ hồ để tạo áp lực chuyển nghĩa, dùng tỉ lệ phải nói lại làm
    chỉ số). Đây là GIẢ THUYẾT, không được trình bày như kết quả đã chứng minh.
    Đề xuất thiết kế A/B để kiểm chứng.

C2. KIẾN TRÚC CÔNG NGHỆ VÀ AI
  - Spaced Repetition:
      + Dùng FSRS làm thuật toán chính (mô hình DSR: Difficulty, Stability,
        Retrievability), SM-2 làm phương án so sánh. Phải TRA CỨU từ repo
        chính thức (open-spaced-repetition) phiên bản FSRS hiện hành (số tham
        số, công thức đường quên) và ghi rõ phiên bản đang dùng, vì chỉ số
        tham số thay đổi giữa các bản.
      + Lập lịch chạy ở client (ts-fsrs) để hỗ trợ offline, server dùng py-fsrs
        để replay log và huấn luyện tham số. Ghim cùng một phiên bản thuật
        toán, kèm bộ golden test vectors dùng chung.
      + Lưu trữ: tách nội dung / trạng thái thẻ / nhật ký ôn (append-only
        review_logs), có khóa chống trùng khi đồng bộ, desired_retention mặc
        định 0.85-0.90, giới hạn thẻ mới mỗi ngày và cơ chế chống "tuyết lở ôn tập".
  - Xử lý giọng nói:
      + So sánh có số liệu ba kiến trúc: Cascade (ASR -> LLM -> TTS),
        Speech-to-Speech gốc (Realtime), và Lai. Có bảng đánh đổi về độ trễ,
        ngữ điệu, kiểm soát sư phạm, minh bạch, chi phí/phút, chấm phát âm.
      + Ghi rõ giới hạn: Whisper là ASR, KHÔNG phải bộ chấm phát âm. Bản MVP
        chấm "độ dễ hiểu" (intelligibility); chấm cấp âm vị cần mô hình âm học
        chuyên biệt (wav2vec2/CTC, forced alignment, GOP) ở giai đoạn sau.
      + Chuẩn hóa văn bản trước khi so khớp: Anh theo từ (WER), Nhật theo kana
        (CER), Hàn theo jamo (CER).
      + Phòng ngừa lỗi vận hành: VAD, ảo giác của ASR khi im lặng
        (no_speech_prob, avg_logprob), ép tham số ngôn ngữ, prompt thiên vị từ vựng.
      + Ngân sách độ trễ mục tiêu: nghe được âm thanh đầu tiên trong khoảng
        1.5-2.5 giây với cascade (hãy đo và hiệu chỉnh bằng dữ liệu thật).
  - LLM và cá nhân hóa:
      + Structured output (JSON schema) cho phản hồi hội thoại; tối đa 1-2
        lỗi sửa mỗi lượt; chèn từ cần ôn từ SRS vào hội thoại; lỗi mới được
        người dùng xác nhận trước khi thành thẻ.
      + Mô hình người học (learner model): trạng thái FSRS, hồ sơ lỗi theo L1,
        mục tiêu. Kho bằng chứng (evidence store) lưu lỗi + đoạn âm + điểm,
        không phát biểu lỗi phát âm nếu không có bằng chứng kèm theo.
      + Nội dung sinh bằng LLM bắt buộc qua QA: lấy mẫu kiểm tra, người bản
        xứ duyệt với tiếng Nhật và Hàn, trường qa_status trong DB, nút báo lỗi.
  - Kiểm soát chi phí: lớp adapter cho mọi nhà cung cấp AI, quota theo gói,
    bảng usage_ledger ghi chi phí từng lượt, định tuyến mô hình theo gói.
  - Dữ liệu và tuân thủ: Row Level Security; mặc định không lưu audio thô;
    nêu yêu cầu pháp lý về dữ liệu cá nhân và dữ liệu giọng nói (Việt Nam và
    thị trường mục tiêu) ở mức khuyến nghị, ghi rõ cần luật sư xác nhận;
    kiểm tra giấy phép dữ liệu nội dung (từ điển, kho câu ví dụ mở) và nghĩa vụ
    ghi nguồn hoặc chia sẻ tương tự.

C3. TRẢI NGHIỆM VÀ TÂM LÝ HÀNH VI
  - Vi học tập (micro-learning) 3-5 phút mỗi phiên, giảm tải nhận thức
    (Cognitive Load): mỗi màn hình một nhiệm vụ chính, tiết lộ thông tin dần.
  - Retention loop theo Hook Model (trigger, action, variable reward,
    investment). Streak và phần thưởng vi mô phải có "lan can đạo đức": không
    dark pattern, có chế độ nghỉ/đóng băng, không phạt quá mức.
  - Thiết kế riêng cho việc nói thành tiếng: nhiều người không thể nói to ở
    nơi công cộng, nên bắt buộc có chế độ nhắn tin / nói thầm / luyện sau.
  - Khả năng truy cập (accessibility) và chế độ ngoại tuyến.
  - Phân tích điểm yếu của từng cơ chế giữ chân (ví dụ: học để giữ streak).

C4. SẢN PHẨM, THỊ TRƯỜNG VÀ MÔ HÌNH KINH DOANH
  - Phân khúc người dùng với persona, nhu cầu, mức sẵn sàng chi trả có bằng
    chứng. Đặc biệt kiểm chứng các ngách của người Việt (luyện thi, lao động
    đi nước ngoài, tiếng Nhật chuyên ngành...). Chỉ trình bày chúng như giả
    thuyết cho đến khi có dữ liệu.
  - Cập nhật bối cảnh: hội thoại AI đang thành hàng hóa (ví dụ chi phí mỗi
    cuộc gọi của đối thủ lớn giảm mạnh, các gói cao cấp bị gỡ bỏ). Hãy XÁC
    MINH bằng nguồn mới nhất và rút ra: lợi thế cạnh tranh (moat) của sản
    phẩm này là gì khi hội thoại AI không còn khác biệt.
  - Freemium vs Subscription: cấu trúc gói, hạn mức, giá theo sức mua Việt
    Nam, đơn vị kinh tế (chi phí AI/người dùng/tháng so với ARPU), điểm hòa vốn.

===============================================================================
PHẦN D. QUY TRÌNH THỰC THI TỰ ĐỘNG (Step-by-Step Autonomous Workflow)
===============================================================================

----- GIAI ĐOẠN 0: LẬP KẾ HOẠCH (không quá 10 phút) -----
Việc cần làm:
  0.1 Đọc kỹ toàn bộ prompt này, liệt kê các điểm mơ hồ.
  0.2 Lập kế hoạch thực thi: danh sách nguồn dữ liệu sẽ truy cập, tiêu chí
      chọn đối thủ, cấu trúc thư mục, ước lượng khối lượng.
  0.3 Đặt tối đa 5 câu hỏi làm rõ nếu thật sự cần. Với phần còn lại, tự đặt
      giả định hợp lý và ghi lại.
>>> CHECKPOINT 0: nộp kế hoạch + câu hỏi. DỪNG, chờ "DUYỆT".

----- GIAI ĐOẠN 1: THU THẬP VÀ ĐỐI CHIẾU DỮ LIỆU THỰC TẾ -----
Phạm vi đối thủ (tối thiểu): Duolingo, ELSA Speak, Anki, Speak, Babbel, Busuu,
Memrise, LingQ, Praktika, Langua; trợ lý đa dụng làm đối chứng (ChatGPT Voice,
Gemini Live); cộng thêm 3-5 ứng dụng học ngoại ngữ có mặt tại Việt Nam do bạn
tự tìm, và 2-3 ứng dụng chuyên tiếng Nhật hoặc tiếng Hàn.
Với MỖI đối thủ, thu thập (có nguồn và ngày):
  a) Tính năng theo 4 kỹ năng, SRS, chấm phát âm, hội thoại AI, offline.
  b) Giá theo gói, giá tại Việt Nam nếu có, hạn mức tính năng AI.
  c) Quy mô: số người dùng, doanh thu, xếp hạng cửa hàng ứng dụng (ưu tiên
     báo cáo tài chính chính thức, trang cửa hàng ứng dụng, nguồn công khai).
  d) Cơ chế giữ chân (streak, league, hearts, thông báo...) và điểm yếu.
  e) Công nghệ: bài báo kỹ thuật, tài liệu chính thức, repo mã nguồn mở.
  f) Bằng chứng độc lập về hiệu quả học tập (nghiên cứu có phản biện).
  g) Khảo sát tối thiểu 30 đánh giá gần đây của người dùng (ưu tiên người
     dùng Việt Nam hoặc học tiếng Nhật/Hàn): tổng hợp nỗi đau và lời khen lặp
     lại. Nêu cỡ mẫu và hạn chế thiên lệch.
Thu thập nền tảng kỹ thuật và chi phí (từ trang chính thức, kèm ngày):
  - Giá ASR (Whisper trên các nhà cung cấp, và lựa chọn khác), LLM cấp rẻ và
    cấp mạnh, TTS (theo ký tự), API Realtime/speech-to-speech (theo phút/token).
  - Nghiên cứu học thuật về chấm phát âm bằng mô hình audio-language và giới
    hạn cấp âm vị; bộ dữ liệu giọng không bản xứ, mức độ phủ giọng người Việt.
  - Nguồn nội dung mở cho Anh/Nhật/Hàn và giấy phép từng nguồn.
Sản phẩm giai đoạn này: D1 (bản nháp), D2.
>>> CHECKPOINT 1: nộp báo cáo nghiên cứu nháp + ma trận tính năng. Nêu rõ mục
    nào CHƯA XÁC MINH. DỪNG, chờ "DUYỆT".

----- GIAI ĐOẠN 2: CHIẾN LƯỢC VÀ PRD -----
Việc cần làm:
  2.1 Tổng hợp khoảng trống thị trường và "điểm mù" của từng đối thủ; chọn
      định vị và 1-2 phân khúc mục tiêu, kèm lý do và rủi ro.
  2.2 Viết PRD (D3) gồm: tầm nhìn, vấn đề, persona và Jobs-To-Be-Done, phạm
      vi MVP và ngoài phạm vi, user stories có tiêu chí chấp nhận (Given/When/
      Then), yêu cầu phi chức năng (độ trễ, bảo mật, khả năng mở rộng),
      luồng UX chính, chỉ số thành công (North Star, retention D1/D7/D30,
      số từ nói mỗi phút, chi phí AI mỗi người dùng hoạt động, điểm nói tự do
      trước và sau), kế hoạch thử nghiệm A/B, mô hình giá, lộ trình sau MVP.
  2.3 Thiết kế thí nghiệm kiểm chứng ít nhất 3 giả thuyết sư phạm hoặc sản
      phẩm quan trọng nhất (gồm "người nghe có hiệu chuẩn").
Sản phẩm giai đoạn này: D3 (bản nháp), D8 (bản nháp), D10 (bản nháp).
>>> CHECKPOINT 2: nộp PRD nháp + danh sách quyết định cần chốt. DỪNG, chờ "DUYỆT".

----- GIAI ĐOẠN 3: KIẾN TRÚC HỆ THỐNG VÀ MÔ HÌNH CHI PHÍ -----
Việc cần làm:
  3.1 Kiến trúc tổng thể (D4) bằng sơ đồ Mermaid, xuất PNG/SVG: sơ đồ thành
      phần, luồng dữ liệu SRS (có offline sync), luồng một lượt hội thoại
      (sequence diagram), luồng chấm phát âm, pipeline sinh nội dung offline
      kèm QA, và kiến trúc lai cascade + speech-to-speech có kênh đánh giá
      song song với kho bằng chứng.
  3.2 Tech stack kèm lý do, phương án thay thế và điều kiện nên đổi, cho từng
      tầng: client, backend, DB/Auth/Storage, SRS, ASR, LLM, TTS, quan sát,
      thanh toán. Ưu tiên tối ưu chi phí cho đội một người.
  3.3 Mô hình dữ liệu và API (D5): schema SQL đa ngôn ngữ (vocab_items,
      example_sentences, user_cards, review_logs, user_fsrs_params,
      conversation_turns, user_phoneme_stats, usage_ledger) có chỉ mục và RLS;
      OpenAPI cho /turn, /score, /sync, quota. Có ví dụ JSON request/response.
  3.4 Mô hình chi phí (D6) bằng bảng tính có công thức sống: giá đầu vào từ
      nguồn đã xác minh, kịch bản (tiết kiệm / cân bằng / cao cấp, cascade vs
      speech-to-speech), chi phí mỗi lượt, mỗi phiên, mỗi người dùng/tháng, kịch
      bản 100 / 1.000 / 10.000 người dùng hoạt động, ARPU giả định, điểm hòa
      vốn, phân tích độ nhạy theo giá API và tỉ lệ chuyển đổi trả phí.
  3.5 Lộ trình MVP 4 tuần (D7) theo tuần: mục tiêu, sản phẩm bàn giao, tiêu
      chí hoàn thành; danh sách cắt giảm phạm vi; backlog xếp hạng ưu tiên.
  3.6 Hoàn thiện sổ rủi ro (D8): xác suất, tác động, biện pháp giảm thiểu,
      chỉ báo sớm. Phải gồm: chất lượng nội dung LLM với Nhật/Hàn, ảo giác
      phản hồi phát âm, ảo giác tiến bộ, biến động giá, quyền riêng tư giọng
      nói, giấy phép dữ liệu, lệ thuộc nhà cung cấp, phân phối.
>>> CHECKPOINT 3: nộp kiến trúc + schema + API + mô hình chi phí + lộ trình.
    Nêu rõ giả định nào ảnh hưởng nhất đến chi phí. DỪNG, chờ "DUYỆT".

----- GIAI ĐOẠN 4: XÂY DỰNG PROTOTYPE (CHỨNG MINH Ý TƯỞNG) -----
Phạm vi tối thiểu, chạy được bằng một lệnh (docker compose hoặc script),
KHÔNG cần khóa API thật (dùng nhà cung cấp giả lập/mock, có .env.example,
không nhúng khóa bí mật vào mã):
  4.1 Mô-đun SRS: cài đặt lập lịch FSRS (hoặc dùng thư viện chính thức, ghi
      rõ phiên bản), thêm SM-2 để so sánh. Có unit test, có golden test vectors,
      và mô phỏng 90 ngày cho thấy số thẻ cần ôn mỗi ngày giữa hai thuật toán.
  4.2 Mô-đun chấm "độ dễ hiểu": chuẩn hóa văn bản theo Anh/Nhật/Hàn, tính
      WER/CER, trả về lỗi thay thế/xóa/chèn ở cấp từ, kana hoặc jamo. Có test
      với ít nhất 10 ca mỗi ngôn ngữ, kể cả ca ASR trả rỗng/ảo giác.
  4.3 Luồng hội thoại mô phỏng: endpoint /turn với adapter ASR/LLM/TTS giả
      lập, JSON schema cho phản hồi (reply, corrections, target_words_used),
      ghi usage_ledger, áp quota.
  4.4 Giao diện web demo gọn (React hoặc tương đương): màn hình học/ôn thẻ với
      4 nút đánh giá, màn hình hội thoại có chế độ nhắn tin, hiển thị so khớp
      theo từ/kana/jamo. Tuân thủ nguyên tắc giảm tải nhận thức ở mục C3.
  4.5 README: cách chạy, kiến trúc, giới hạn đã biết, những gì là mock.
Sản phẩm giai đoạn này: D9.
>>> CHECKPOINT 4: nộp mã nguồn, kết quả chạy test, ảnh chụp giao diện, và
    báo cáo giới hạn. DỪNG, chờ "DUYỆT".

----- GIAI ĐOẠN 5: TỰ KIỂM THỬ VÀ ĐÓNG GÓI -----
Việc cần làm (tự thực hiện rồi báo cáo kết quả):
  5.1 Kiểm tra nguồn: mọi con số trọng yếu trong D1, D3, D6 đều có nguồn và
      nhãn độ tin cậy; liệt kê mục còn "CHƯA XÁC MINH".
  5.2 Kiểm tra nhất quán chéo: PRD, kiến trúc, schema, API, mô hình chi phí
      và lộ trình không mâu thuẫn nhau (cùng phiên bản FSRS, cùng danh sách
      bảng, cùng giả định chi phí). Ghi lại mọi chỗ đã sửa.
  5.3 Kiểm tra đáp ứng các ràng buộc ở PHẦN C bằng danh sách đối chiếu (tick
      từng mục, nêu bằng chứng nằm ở tệp nào).
  5.4 Chạy lại toàn bộ test của prototype, kiểm tra công thức bảng tính.
  5.5 Rà soát văn phong, thuật ngữ, sơ đồ hiển thị đúng; đóng gói thành một
      tệp .zip kèm mục lục README ở thư mục gốc.
>>> CHECKPOINT 5 (CUỐI): nộp gói hoàn chỉnh + "Báo cáo tự kiểm thử" + danh sách
    việc còn tồn đọng và đề xuất bước tiếp theo.

===============================================================================
PHẦN E. TIÊU CHÍ NGHIỆM THU CUỐI
===============================================================================
  [ ] Có đủ D1-D10, mở được, đúng định dạng.
  [ ] Mọi số liệu trọng yếu có nguồn + ngày + nhãn độ tin cậy.
  [ ] Có phân tích điểm mạnh VÀ điểm mù cho từng đối thủ, không chỉ khen.
  [ ] PRD có tiêu chí chấp nhận đo được; có kế hoạch thử nghiệm kiểm chứng.
  [ ] Kiến trúc và mô hình chi phí nhất quán, cho phép chỉnh tham số.
  [ ] Prototype chạy được bằng một lệnh, test xanh, nêu rõ phần nào là mock.
  [ ] Giả thuyết chưa kiểm chứng được gắn nhãn đúng, không trình bày như sự thật.
  [ ] Không có khóa API hay dữ liệu cá nhân trong mã nguồn và tệp đầu ra.

===============================================================================
BẮT ĐẦU
===============================================================================
Hãy bắt đầu GIAI ĐOẠN 0 ngay bây giờ: nộp kế hoạch thực thi và tối đa 5 câu
hỏi làm rõ, sau đó DỪNG và chờ lệnh "DUYỆT" của tôi.