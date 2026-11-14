# 🌿 MedicaOS — Website Học Tập, Bệnh Án SOAP & Dược Điển Y Dược

> **MedicaOS** là nền tảng web ứng dụng được thiết kế chuyên biệt dành cho **Sinh viên Y Đa Khoa, Dược Học và Bác Sĩ Thực Tập Lâm Sàng**, lấy cảm hứng từ phong cách Notion & Figma UI Kit Y Khoa thẩm mỹ cao (Botanical Apothecary, Matcha Clinical và Midnight On-Call).

---

## ✨ 1. Điểm Nổi Bật Về Giao Diện (Design System)

- **Bảng Màu 3 Theme Tinh Tế**:
  - 🌿 **Botanical Apothecary (Mặc định)**: Nền giấy kem ấm `#F7F4EE`, thẻ trắng viền mảnh `#E4DFD3`, màu nhấn xanh lá xô thơm `#2F5243`, đất nung `#C86D51` và vàng ấm `#B68D40`.
  - 🍵 **Matcha Clinical**: Tone xanh rêu ngọc bích tươi mát `#2D6A4F` kết hợp nền ngà `#F3F7F4`.
  - 🌙 **Midnight On-Call (Chế độ Trực Đêm)**: Tone than chì dịu mắt `#111614`, chống mỏi mắt khi trực ca đêm tại bệnh viện với độ tương phản cao đạt chuẩn WCAG.
- **3-Font Typography Pairing**:
  - **Tiêu đề & Trích dẫn**: `Instrument Serif` (Editorial sang trọng, thanh lịch).
  - **Nội dung giao diện**: `Plus Jakarta Sans` (Rõ ràng, dễ đọc khi tra cứu nhanh).
  - **Thông số, Liều thuốc, ICD-10 & Đồng hồ**: `JetBrains Mono` (Chuẩn xác, chống nhầm lẫn số liệu y khoa).
- **Bố Cục Bento Grid 12 Cột Bất Đối Xứng (3 - 6 - 3)**:
  - Tối ưu hóa mật độ thông tin, không lãng phí không gian màn hình.

---

## 🚀 2. Các Phân Hệ Tính Năng Chính

### 🌿 1. Dashboard Tổng Quan Học Kỳ
- **Banner Bìa Notion**: Ảnh minh họa y học, câu danh ngôn Hippocrates, ca trực sắp tới và floating avatar Rx.
- **Đồng Hồ Pomodoro Lo-Fi**: Bộ đếm 25m Focus / 5m Break, lưu số phiên học trong ngày, phát chuông báo hoàn thành.
- **Máy Phát Âm Thanh Tập Trung (Web Audio API Synthesizer)**:
  - 🌧 *Tiếng mưa rơi (Vinyl Rain)*
  - 💓 *Nhịp tim 70 bpm (Acoustic Stethoscope Heartbeat)*
  - 🍃 *Tiếng trắng tập trung (Pink Noise)*
  - Chạy thuần bằng code âm thanh trình duyệt, không cần kết nối mạng hay tải file mp3.
- **Máy Tính Nhanh CrCl (Cockcroft-Gault)**: Chỉnh liều kháng sinh và đánh giá chức năng thận trực tiếp trên Dashboard.
- **Gallery Học Phần Y Dược**: Danh mục môn học trọng tâm, thanh tiến độ %, giảng viên phụ trách, click để xem đề cương và bài học cốt lõi.
- **Lịch Trực Lâm Sàng & Checklist Đi Buồng**: Tích chọn vật dụng y tế (áo blouse, ống nghe Littmann, búa phản xạ, đèn soi đồng tử...), có thể thêm/xóa việc cần làm.
- **Thẻ Lật Nhanh Active Recall**: Rèn luyện phản xạ ghi nhớ câu hỏi lâm sàng ngay trên trang chủ.

### 🩺 2. Sổ Tay Bệnh Án & Ghi Chú Lâm Sàng (SOAP Notes)
- Định dạng chuẩn y khoa **SOAP**:
  - **S (Subjective)**: Lý do vào viện, bệnh sử, tiền căn.
  - **O (Objective)**: Sinh hiệu (Mạch, HA, SpO2, Thở, Nhiệt độ), khám thực thể, cận lâm sàng & X-quang/ECG.
  - **A (Assessment)**: Chẩn đoán xác định, phân biệt, biện luận lâm sàng và mã ICD-10.
  - **P (Plan)**: Y lệnh cấp cứu, phác đồ điều trị, kế hoạch xét nghiệm theo dõi.
  - **Cornell Summary**: Điểm cốt lõi rút ra khi đi thi trình bệnh án OSCE.
- Sẵn có các ca bệnh thực tế:
  - *BA-2026-089: Suy tim cấp mất bù (ADHF) / THA độ 2*
  - *BA-2026-104: Viêm phổi cộng đồng CAP (CURB-65 = 2 điểm) / ĐTĐ type 2*
- **Công cụ thực chiến**:
  - `+ Tạo Bệnh Án Mới` lưu trực tiếp vào trình duyệt.
  - `🖨 In / Xuất PDF` định dạng bệnh án chuẩn để nộp hoặc báo cáo.
  - `📋 Copy Markdown` sao chép nhanh văn bản để dán vào tài liệu học tập.

### 💊 3. Dược Điển Bỏ Túi & Tra Cứu Hoạt Chất (Drug Formulary)
- Cơ sở dữ liệu phong phú các hoạt chất phổ biến tại bệnh viện Việt Nam: *Ceftriaxone, Augmentin, Bisoprolol, Metformin, Enoxaparin, Furosemide, Atorvastatin, Paracetamol, Omeprazole...*
- Đầy đủ thông tin: Biệt dược thường gặp, Phân nhóm dược lý, Cơ chế tác dụng (MOA), Chỉ định & Liều lượng, **Chỉnh liều suy thận theo CrCl**, Cảnh báo & Tác dụng phụ, **Clinical Pearl (Mẹo lâm sàng)**.
- Bộ lọc theo chuyên khoa (Kháng sinh, Tim mạch, Nội tiết, Tiêu hóa, Giảm đau).
- Tính năng **+ Thêm Hoạt Chất Mới** lưu trữ vào máy cá nhân.

### 🧮 4. Bộ 6 Máy Tính Y Khoa Lâm Sàng
1. **Cockcroft-Gault (CrCl) & Phân Độ Suy Thận KDIGO (G1 -> G5)** kèm khuyến cáo dùng thuốc.
2. **BMI & Diện Tích Bề Mặt Da (BSA Mosteller)** theo chuẩn phân loại thừa cân Châu Á (IDI & WPRO).
3. **Thang Điểm Hôn Mê Glasgow (GCS)** (Mắt E1-4, Lời nói V1-5, Vận động M1-6) và phân độ chấn thương sọ não.
4. **Thang Điểm CURB-65**: Đánh giá nguy cơ tử vong viêm phổi cộng đồng, quyết định ngoại trú / nhập viện / ICU.
5. **Thang Điểm CHA2DS2-VASc**: Đánh giá nguy cơ đột quỵ tắc mạch ở bệnh nhân rung nhĩ và chỉ định thuốc kháng đông.
6. **Quy Tắc Parkland & Tốc Độ Truyền Dịch**: Tính thể tích Ringer Lactate hồi sức 24h đầu bỏng và tính giọt/phút theo loại dây truyền.

### 🧠 5. Active Recall & Spaced Repetition (Anki Flashcard 3D Deck)
- Chế độ ôn tập Flashcard 3D tương tác (click để lật mặt câu hỏi / đáp án).
- 4 nút đánh giá chuẩn Anki:
  - 🔴 **Quên / Chưa thuộc (R1)**: Ôn lại ngày mai (1 ngày).
  - 🟡 **Khó nhớ (R2)**: Ôn lại sau 3 ngày.
  - 🔵 **Nhớ tốt (R3)**: Ôn lại sau 7 ngày.
  - 🟢 **Thuộc lòng (R4)**: Lên lịch ôn sau 14 ngày.
- Bảng Database Spaced Repetition theo dõi tiến độ các chu kỳ R1 -> R4.

### 📚 6. Kho Tham Chiếu Labo Chuẩn & Sách Giáo Trình
- Bảng tra cứu khoảng giá trị xét nghiệm bình thường:
  - **Huyết học**: RBC, Hb, WBC, PLT, Neutrophil.
  - **Sinh hóa**: Glucose, HbA1c, AST, ALT, Creatinine, Ure.
  - **Điện giải đồ**: Natri, Kali, Clo, Canxi.
  - **Khí máu động mạch (ABG)**: pH, PaCO2, PaO2, HCO3-.
- Giới thiệu các sách kinh điển: *Dược thư Quốc gia Việt Nam 2022, Harrison's Principles of Internal Medicine, Robbins Pathology, Netter Atlas...*

### 🔍 7. Spotlight Search Toàn Năng (⌘K / Ctrl+K)
- Bấm `⌘K` hoặc `Ctrl+K` bất kỳ lúc nào để mở hộp tìm kiếm nhanh: gõ tên thuốc, mã bệnh án, tên môn học hay công cụ tính toán để di chuyển tới ngay lập tức.

### 💾 8. Quản Lý Dữ Liệu An Toàn (Data Persistence)
- Tự động lưu mọi thay đổi vào `localStorage`.
- Nút **Sao lưu JSON**: Tải toàn bộ bệnh án, thuốc và checklist về máy.
- Nút **Khôi phục JSON**: Tải file backup lên khi đổi máy tính.
- Nút **Mặc định**: Khôi phục lại dữ liệu mẫu gốc ban đầu.

---

## 💻 3. Hướng Dẫn Mở & Sử Dụng Website

Website được thiết kế hoàn toàn tĩnh (Static Web App), chạy trực tiếp trên mọi trình duyệt hiện đại (Chrome, Edge, Firefox, Safari) mà **không cần cài đặt phần mềm phức tạp**:

### Cách 1: Mở Trực Tiếp Bằng Trình Duyệt
1. Mở thư mục: `/run/media/nguyendat/UBUNTU 24_0/WEBSITE_Y_DUOC`
2. Nhấp đúp chuột vào file `index.html` (hoặc chuột phải chọn *Open With -> Google Chrome / Firefox*).

### Cách 2: Khởi Chạy Local Server Bằng Python
Mở Terminal trong thư mục này và gõ:
```bash
python3 -m http.server 8080
```
Sau đó mở trình duyệt truy cập: `http://localhost:8080`

### Cách 3: Khởi Chạy Bằng Node.js
```bash
npx serve .
```

---

## 📁 4. Cấu Trúc Thư Mục

```
WEBSITE_Y_DUOC/
├── index.html                   # Giao diện chính của Website MedicaOS
├── README.md                    # Hướng dẫn chi tiết sử dụng & tài liệu kỹ thuật
└── assets/
    ├── css/
    │   └── style.css            # Biến màu CSS 3 theme, typography & hiệu ứng 3D
    ├── js/
    │   ├── data.js              # Cơ sở dữ liệu mẫu y dược, bệnh án SOAP & thuốc
    │   ├── audio.js             # Bộ tổng hợp âm thanh Lo-Fi tập trung (Web Audio)
    │   ├── calculators.js       # Bộ 6 máy tính y khoa lâm sàng
    │   └── app.js               # Quản lý sự kiện, theme, view, search & backup
    └── images/
        ├── banner.webp          # Ảnh banner bìa giao diện y khoa
        ├── banner_original.jpg  # Ảnh bìa gốc
        ├── avatar_rx.png        # Icon biểu tượng Rx dược khoa
        ├── card_anatomy.jpg     # Ảnh minh họa giải phẫu tim mạch
        └── card_pharma.jpg      # Ảnh minh họa dược lý lâm sàng
```

---
*Chúc bạn có những giờ học tập hiệu quả, ôn thi OSCE đạt điểm cao và hoàn thành xuất sắc các ca trực lâm sàng cùng MedicaOS!* 🌿🩺
