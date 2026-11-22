# language-learning-app
# QUY TẮC LÀM VIỆC CỦA DỰ ÁN

Dự án: ứng dụng học ngoại ngữ (Anh/Nhật/Hàn) tích hợp AI, cho người học Việt.
Mọi tài liệu viết bằng tiếng Việt, giữ thuật ngữ kỹ thuật tiếng Anh chuẩn.

1. Chống bịa số liệu: mọi giá, số người dùng, độ chính xác phải có URL nguồn
   + ngày truy cập. Không có nguồn thì ghi "CHƯA XÁC MINH", không tự điền.
2. Gắn nhãn độ tin cậy: [ĐÃ XÁC MINH] / [SUY LUẬN] / [GIẢ ĐỊNH].
3. Không có công cụ web thì nói rõ, không viết từ trí nhớ rồi trình bày như dữ
   liệu thực. Yêu cầu tôi cung cấp nguồn hoặc tệp đầu vào.
4. Whisper là ASR, không phải bộ chấm phát âm. MVP chỉ chấm "độ dễ hiểu".
5. FSRS: ghi rõ phiên bản, đối chiếu repo open-spaced-repetition. Client dùng
   ts-fsrs, server dùng py-fsrs, chung bộ golden test vectors.
6. Không đưa khóa API hay dữ liệu cá nhân vào mã. Dùng .env.example.
7. Mỗi giai đoạn kết thúc bằng CHECKPOINT: ghi báo cáo vào docs/checkpoints/
   CP{n}.md theo mẫu (đã làm gì / phát hiện chính / giả định / rủi ro /
   quyết định cần duyệt / kế hoạch tiếp), commit git, rồi DỪNG và chờ tôi
   trả lời "DUYỆT". Không tự chuyển giai đoạn.