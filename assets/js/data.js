/**
 * MedicaOS — Dữ Liệu Y Dược Mẫu Chuẩn Lâm Sàng
 * Học phần, Bệnh án SOAP, Dược điển bỏ túi, Spaced Repetition, Flashcards & Labo
 */

const DEFAULT_SUBJECTS = [
  {
    id: "sub-1",
    code: "MED-302",
    title: "Giải phẫu & Bệnh học Tim Mạch",
    category: "y",
    credits: 4,
    lecturer: "PGS.TS. Lê Minh Quân",
    progress: 74,
    status: "Đang học",
    image: "assets/images/card_anatomy.jpg",
    tags: ["Tim Mạch", "Giải Phẫu", "ECG"],
    summary: "Nghiên cứu hình thái học buồng tim, hệ mạch vành, chu chuyển tim và các bệnh lý suy tim, hội chứng vành cấp, rối loạn nhịp tim.",
    keyNotes: [
      "Giải phẫu cấp máu tim: Động mạch vành trái (LCA) chia nhánh LAD và LCx; Động mạch vành phải (RCA).",
      "Tiêu chuẩn Framingham chẩn đoán suy tim: Cần 2 tiêu chuẩn chính hoặc 1 chính + 2 phụ.",
      "Tứ trụ điều trị suy tim phân suất tống máu giảm (HFrEF): ARNI/ACEi, Beta-blocker, MRA, SGLT2i."
    ]
  },
  {
    id: "sub-2",
    code: "PHA-405",
    title: "Dược Lý Lâm Sàng & Hoạt Chất",
    category: "duoc",
    credits: 3,
    lecturer: "TS. Dược sĩ Trần Bích Hạnh",
    progress: 88,
    status: "Trọng tâm thi",
    image: "assets/images/card_pharma.jpg",
    tags: ["Kháng Sinh", "Dược Động Học", "Chỉnh Liều"],
    summary: "Dược động học (ADME), tương tác thuốc, phân tầng kháng sinh theo phổ vi khuẩn, theo dõi TDM và chỉnh liều trên bệnh nhân suy thận.",
    keyNotes: [
      "Kháng sinh phụ thuộc thời gian (T > MIC): Penicillin, Cephalosporin, Carbapenem -> Tối ưu bằng truyền kéo dài.",
      "Kháng sinh phụ thuộc nồng độ (Cmax / MIC): Aminoglycoside (Gentamicin, Amikacin), Fluoroquinolone.",
      "Tính CrCl theo Cockcroft-Gault là tiêu chuẩn vàng để tra cứu bảng chỉnh liều thuốc đào thải qua thận."
    ]
  },
  {
    id: "sub-3",
    code: "MED-204",
    title: "Vi Sinh Lâm Sàng & Kháng Sinh Đồ",
    category: "y",
    credits: 3,
    lecturer: "ThS.BS. Hoàng Mai Phương",
    progress: 52,
    status: "Đang học",
    image: "assets/images/card_anatomy.jpg",
    tags: ["Vi Khuẩn", "Kháng Thuốc", "Cấy Máu"],
    summary: "Kỹ thuật nhuộm Gram, phân lập vi khuẩn hiếu khí/kỵ khí, đọc kết quả MIC và cơ chế đề kháng sinh học (ESBL, CRE, MRSA).",
    keyNotes: [
      "MRSA (Tụ cầu vàng kháng Methicillin): Đột biến gen mecA mã hóa PBP2a, điều trị ưu tiên bằng Vancomycin hoặc Linezolid.",
      "Trực khuẩn mủ xanh (Pseudomonas aeruginosa): Vi khuẩn cơ hội Gram âm nguy hiểm tại ICU, nhạy với Ceftazidime, Cefepime, Meropenem."
    ]
  },
  {
    id: "sub-4",
    code: "PHA-301",
    title: "Hóa Dược & Bào Chế Sinh Dược",
    category: "duoc",
    credits: 4,
    lecturer: "PGS.TS. Nguyễn Văn Tuấn",
    progress: 60,
    status: "Đang học",
    image: "assets/images/card_pharma.jpg",
    tags: ["Bào Chế", "Sinh Khả Dụng", "Độ Ổn Định"],
    summary: "Cấu trúc hóa học và mối quan hệ cấu trúc - tác dụng (SAR), tương đương sinh học, dạng bào chế phóng thích kéo dài (XR/CR).",
    keyNotes: [
      "Khung cấu trúc Beta-lactam nhạy cảm với thủy phân acid dịch vị và men beta-lactamase.",
      "Hệ phân tán nano và liposome ứng dụng tăng tính hướng đích của thuốc chống ung thư (Doxorubicin)."
    ]
  },
  {
    id: "sub-5",
    code: "MED-401",
    title: "Nội Khoa Hô Hấp & Cấp Cứu",
    category: "y",
    credits: 4,
    lecturer: "BSCKII. Vũ Trọng Khang",
    progress: 45,
    status: "Lâm sàng",
    image: "assets/images/card_anatomy.jpg",
    tags: ["Viêm Phổi", "COPD", "Khí Máu"],
    summary: "Tiếp cận chẩn đoán khó thở cấp, đợt cấp COPD, cơn hen phế quản nặng, suy hô hấp cấp và phân tích khí máu động mạch (ABG).",
    keyNotes: [
      "Quy tắc đọc khí máu động mạch 4 bước: 1. Đánh giá pH; 2. Đánh giá PaCO2 (hô hấp); 3. Đánh giá HCO3- (chuyển hóa); 4. Tính Anion Gap.",
      "Phân tầng nguy cơ viêm phổi cộng đồng bằng thang điểm CURB-65 để quyết định điều trị ngoại trú hay nhập viện."
    ]
  },
  {
    id: "sub-6",
    code: "SUR-308",
    title: "Ngoại Khoa & Bụng Cấp Cứu",
    category: "y",
    credits: 3,
    lecturer: "TS.BS. Đỗ Quang Hưng",
    progress: 38,
    status: "Lâm sàng",
    image: "assets/images/card_anatomy.jpg",
    tags: ["Ngoại Khoa", "Khám Bụng", "Viêm Ruột Thừa"],
    summary: "Các triệu chứng hội chứng viêm phúc mạc, tắc ruột cơ học, thủng tạng rỗng, chấn thương bụng kín và chuẩn bị bệnh nhân tiền phẫu.",
    keyNotes: [
      "Dấu hiệu Mac-Burney, Blumberg (+), phản ứng thành bụng là chìa khóa nhận diện viêm ruột thừa cấp.",
      "Tam chứng Charcot trong nhiễm trùng đường mật: Đau hạ sườn phải -> Sốt rét run -> Vàng da."
    ]
  }
];

const DEFAULT_DRUGS = [
  {
    id: "drug-1",
    name: "Ceftriaxone",
    tradeNames: "Rocephin, Cefaxon, Biocefa",
    group: "Kháng sinh Cephalosporin thế hệ 3",
    category: "khangsinh",
    moa: "Ức chế tổng hợp thành tế bào vi khuẩn thông qua gắn kết và bất hoạt enzyme Transpeptidase (PBP). Diệt khuẩn phổ rộng trên Gram (-) đường ruột và phế cầu khuẩn.",
    indication: "Nhiễm khuẩn huyết, viêm màng não mủ, viêm phổi mắc phải cộng đồng (CAP) nặng, viêm phúc mạc, lậu cầu.",
    dose: "1 - 2g tiêm IV hoặc IM một lần duy nhất mỗi 24 giờ. Trường hợp viêm màng não có thể dùng 4g/ngày.",
    renalAdjust: "Đào thải kép (qua thận 60% và qua mật 40%). KHÔNG cần chỉnh liều nếu chỉ suy thận đơn thuần, trừ khi kết hợp suy gan nặng (tối đa 2g/ngày).",
    warning: "CẤM tiêm đồng thời hoặc pha chung với dung dịch chứa Canxi (như Ringer Lactate) do nguy cơ kết tủa muối Ceftriaxone-Canxi gây tắc vi mạch ở phổi và thận.",
    sideEffects: "Tiêu chảy do loạn khuẩn ruột, bùn mật/sỏi mật giả do kết tủa muối canxi ở túi mật, phản ứng dị ứng ngoại ban.",
    pearl: "Kháng sinh đầu tay thuận tiện tại khoa cấp cứu do chỉ cần dùng 1 lần/ngày và ít phải canh liều theo eGFR."
  },
  {
    id: "drug-2",
    name: "Bisoprolol",
    tradeNames: "Concor, Bisotens, Cardicor",
    group: "Thuốc chẹn thụ thể Beta-1 giao cảm chọn lọc",
    category: "timmach",
    moa: "Phong bế chọn lọc thụ thể Beta-1 tại cơ tim, làm giảm tần số tim, giảm co bóp cơ tim, giảm cung lượng tim và ức chế tiết renin tại bộ máy cạnh cầu thận.",
    indication: "Tăng huyết áp, đau thắt ngực mạn tính ổn định, suy tim mạn tính ổn định phân suất tống máu giảm (HFrEF) theo phác đồ GDMT.",
    dose: "Khởi trị suy tim 1.25mg/ngày uống sáng, tăng liều dần mỗi 2-4 tuần đến liều mục tiêu 10mg/ngày nếu dung nạp tốt.",
    renalAdjust: "CrCl < 20 mL/phút: Khuyến cáo liều tối đa không vượt quá 10mg/ngày.",
    warning: "Chống chỉ định tuyệt đối trong suy tim cấp mất bù đang sung huyết nặng, sốc tim, block nhĩ thất độ II-III, nhịp chậm xoang < 50 ck/phút, hen phế quản nặng.",
    sideEffects: "Nhịp tim chậm, mệt mỏi, hạ huyết áp tư thế, lạnh đầu chi, che lấp triệu chứng hạ đường huyết (trừ đổ mồ hôi).",
    pearl: "Chỉ khởi trị hoặc tăng liều Bisoprolol khi bệnh nhân suy tim đã ở trạng thái huyết động 'khô và ấm' (không còn ứ dịch cấp)."
  },
  {
    id: "drug-3",
    name: "Metformin",
    tradeNames: "Glucophage, Panfor, Meglucon",
    group: "Thuốc điều trị đái tháo đường nhóm Biguanide",
    category: "noitiet",
    moa: "Kích hoạt AMPK, ức chế quá trình tân tạo glucose tại gan (gluconeogenesis), tăng nhạy cảm của thụ thể insulin tại mô cơ và mô mỡ ngoại vi, làm chậm hấp thu đường ở ruột.",
    indication: "Đái tháo đường type 2 (Lựa chọn hàng đầu ở bệnh nhân thừa cân, béo phì), hội chứng buồng trứng đa nang (PCOS).",
    dose: "Khởi đầu 500mg hoặc 850mg uống 1-2 lần/ngày trong hoặc ngay sau bữa ăn. Liều tối đa 2000 - 2500mg/ngày.",
    renalAdjust: "eGFR 45-59: Tối đa 1000mg/ngày; eGFR 30-44: Cân nhắc giảm liều 50% (tối đa 500mg/ngày); eGFR < 30 mL/min/1.73m²: Chống chỉ định tuyệt đối.",
    warning: "Nguy cơ nhiễm toan Acid Lactic (Lactic Acidosis) hiếm gặp nhưng tử vong cao. Phải ngưng thuốc 48h trước và sau khi chụp phim có tiêm thuốc cản quang tĩnh mạch.",
    sideEffects: "Rối loạn tiêu hóa (đầy hơi, buồn nôn, tiêu chảy phân lỏng) chiếm 20%, vị kim loại trong miệng, dùng kéo dài có thể gây thiếu vitamin B12.",
    pearl: "Không gây hạ đường huyết khi dùng đơn trị liệu; giúp kiểm soát cân nặng rất tốt."
  },
  {
    id: "drug-4",
    name: "Enoxaparin",
    tradeNames: "Lovenox, Clexane",
    group: "Kháng đông Heparin trọng lượng phân tử thấp (LMWH)",
    category: "timmach",
    moa: "Gắn kết chọn lọc với Antithrombin III (AT-III), làm tăng hoạt tính ức chế chọn lọc yếu tố Xa (tỷ lệ kháng Xa / IIa khoảng 4:1), ngăn chặn hình thành cục máu đông.",
    indication: "Dự phòng và điều trị huyết khối tĩnh mạch sâu (DVT), thuyên tắc phổi (PE), hội chứng vành cấp (NSTEMI, STEMI, UAP), hỗ trợ can thiệp mạch vành PCI.",
    dose: "Dự phòng: 40mg (4000 IU) tiêm dưới da (SC) 1 lần/ngày. Điều trị: 1mg/kg (100 IU/kg) tiêm SC mỗi 12 giờ.",
    renalAdjust: "CrCl < 30 mL/phút: Giảm liều điều trị xuống còn 1mg/kg tiêm SC 1 lần duy nhất mỗi 24 giờ. Dự phòng giảm xuống 20mg 1 lần/ngày.",
    warning: "Theo dõi chặt chẽ dấu hiệu xuất huyết, tiểu cầu giảm do heparin (HIT). Chống chỉ định khi đang có xuất huyết hoạt động hoặc tiền sử HIT.",
    sideEffects: "Chảy máu vi thể/đại thể, bầm tím tại vị trí tiêm bụng, tăng men gan thoáng qua, giảm tiểu cầu.",
    pearl: "Thuốc giải độc đặc hiệu một phần là Protamine Sulfate (1mg Protamine trung hòa khoảng 100 IU Enoxaparin dùng trong 8h trước đó)."
  },
  {
    id: "drug-5",
    name: "Furosemide",
    tradeNames: "Lasix, Diuril, Furosemid 40mg",
    group: "Thuốc lợi tiểu quai Henle",
    category: "timmach",
    moa: "Ức chế thuận nghịch hệ đồng vận chuyển Na+/K+/2Cl- tại đoạn dày nhánh lên của quai Henle, ức chế tái hấp thu muối nước tối đa lên đến 25% lượng lọc cầu thận.",
    indication: "Phù do suy tim sung huyết cấp và mạn, xơ gan cổ trướng, hội chứng thận hư, cơn tăng huyết áp kịch phát kèm suy tim trái.",
    dose: "Uống 20 - 80mg một liều buổi sáng. Cấp cứu phù phổi cấp: Tiêm IV chậm 40 - 80mg, có thể lặp lại sau 1-2 giờ nếu chưa đạt đáp ứng bài niệu.",
    renalAdjust: "Vẫn có hiệu quả khi eGFR thấp, nhưng có thể cần dùng liều cao hơn (120 - 240mg) để vượt qua ngưỡng bài niệu ở bệnh nhân suy thận mạn tiến triển.",
    warning: "Nguy cơ hạ Kali máu trầm trọng (dẫn đến xoắn đỉnh nếu phối hợp Digoxin), tụt huyết áp do giảm thể tích nội mạch, độc tính trên tai khi tiêm IV quá nhanh.",
    sideEffects: "Hạ Kali, hạ Natri, hạ Magie máu, tăng Acid Uric máu (thúc đẩy cơn Gout cấp), tăng đường huyết nhẹ.",
    pearl: "Khi tiêm Furosemide tĩnh mạch, tốc độ tiêm không được vượt quá 4mg/phút để tránh tổn thương thần kinh ốc tai gây điếc tai không hồi phục."
  },
  {
    id: "drug-6",
    name: "Augmentin (Amoxicillin + Clavulanate)",
    tradeNames: "Augmentin 625mg/1g, Curam, Klamentin",
    group: "Kháng sinh nhóm Penicillin phối hợp ức chế Beta-lactamase",
    category: "khangsinh",
    moa: "Amoxicillin diệt khuẩn qua gắn PBP; Acid Clavulanic là chất ức chế enzym beta-lactamase 'tự sát', bảo vệ phân tử Amoxicillin khỏi sự phân hủy của vi khuẩn tiết men.",
    indication: "Viêm đường hô hấp trên và dưới (viêm tai giữa, viêm xoang, viêm amiđan mủ, viêm phế quản cấp bội nhiễm, viêm phổi CAP), nhiễm khuẩn da - mô mềm, nhiễm trùng răng miệng.",
    dose: "Người lớn: 625mg uống 3 lần/ngày hoặc viên 1g (875/125) uống 2 lần/ngày sau bữa ăn.",
    renalAdjust: "CrCl 10-30 mL/phút: Dùng liều 625mg mỗi 12 giờ. CrCl < 10 mL/phút: Dùng 625mg mỗi 24 giờ. Không dùng dạng viên 1g cho bệnh nhân suy thận vừa và nặng.",
    warning: "Tiền sử vàng da ứ mật hoặc suy gan liên quan đến Acid Clavulanic là chống chỉ định. Thận trọng với người có cơ địa dị ứng Penicillin.",
    sideEffects: "Tiêu chảy nhiều do kích thích nhu động ruột của Acid Clavulanic, viêm đại tràng giả mạc Clostridioides difficile, nấm Candida hầu họng/âm đạo.",
    pearl: "Uống ngay trước bữa ăn sẽ giảm tối đa tác dụng phụ buồn nôn, tiêu chảy và tăng hấp thu thuốc tối ưu."
  },
  {
    id: "drug-7",
    name: "Atorvastatin",
    tradeNames: "Lipitor, Atorlip, Torvast",
    group: "Thuốc hạ lipid máu nhóm ức chế HMG-CoA Reductase",
    category: "timmach",
    moa: "Ức chế cạnh tranh men HMG-CoA reductase - bước giới hạn tốc độ tổng hợp cholesterol tại gan, làm tăng biểu hiện thụ thể LDL-R trên màng tế bào gan, tăng thanh thải LDL-C khỏi tuần hoàn.",
    indication: "Tăng cholesterol máu nguyên phát, rối loạn lipid máu hỗn hợp, phòng ngừa biến cố tim mạch thứ phát sau nhồi máu cơ tim hoặc đột quỵ thiếu máu não.",
    dose: "Khởi đầu 10 - 20mg/ngày uống vào buổi tối. Cường độ cao (sau biến cố mạch vành cấp): 40 - 80mg/ngày.",
    renalAdjust: "Đào thải chủ yếu qua gan mật. Không cần chỉnh liều theo chức năng thận.",
    warning: "Theo dõi tình trạng đau cơ, yếu cơ không giải thích được do nguy cơ tiêu cơ vân cấp (Rhabdomyolysis) dẫn đến suy thận cấp do Myoglobin niệu.",
    sideEffects: "Đau mỏi cơ (Myalgia), tăng men gan AST/ALT (ngừng thuốc nếu tăng > 3 lần giới hạn trên bình thường), tăng nhẹ HbA1c.",
    pearl: "Thời gian bán thải dài (14h) nên có thể uống vào bất kỳ thời điểm nào trong ngày, không nhất thiết phải uống trước lúc đi ngủ như Simvastatin."
  },
  {
    id: "drug-8",
    name: "Omeprazole",
    tradeNames: "Losec, Omez, Lomac",
    group: "Thuốc ức chế bơm Proton (PPI)",
    category: "tieuhoa",
    moa: "Tiền chất gắn kết không thuận nghịch vào bơm H+/K+-ATPase tại tế bào viền dạ dày bằng liên kết disulfide, ức chế giai đoạn cuối cùng của quá trình bài tiết acid dạ dày.",
    indication: "Loét dạ dày - tá tràng, trào ngược dạ dày thực quản (GERD), hội chứng Zollinger-Ellison, phối hợp kháng sinh tiệt trừ Helicobacter pylori (HP), dự phòng loét do stress.",
    dose: "20 - 40mg uống 1 lần/ngày vào buổi sáng trước bữa ăn 30-60 phút. Xuất huyết tiêu hóa do loét: Bolus IV 80mg, sau đó truyền liên tục 8mg/giờ trong 72h.",
    renalAdjust: "Không cần chỉnh liều ở bệnh nhân suy thận hoặc người cao tuổi.",
    warning: "Dùng kéo dài (> 1 năm) làm giảm hấp thu Canxi và Magie gây loãng xương gãy xương, tăng nguy cơ nhiễm trùng Clostridioides difficile và viêm phổi mắc phải cộng đồng.",
    sideEffects: "Nhức đầu, đau bụng, táo bón hoặc tiêu chảy nhẹ, giảm hấp thu Vitamin B12 và Sắt.",
    pearl: "Phải uống nguyên viên thuốc trước bữa ăn sáng 30 - 60 phút khi số lượng bơm proton trên tế bào viền được kích hoạt nhiều nhất."
  },
  {
    id: "drug-9",
    name: "Paracetamol (Acetaminophen)",
    tradeNames: "Panadol, Efferalgan, Hapacol, Perfalgan",
    group: "Thuốc giảm đau hạ sốt nhóm Aniline",
    category: "giamdau",
    moa: "Ức chế tổng hợp Prostaglandin tại hệ thần kinh trung ương (thông qua ức chế COX-3 / biến thể COX-1), tác động lên trung tâm điều nhiệt ở vùng dưới đồi gây giãn mạch ngoại vi và hạ nhiệt.",
    indication: "Hạ sốt, giảm đau nhẹ đến vừa (đau đầu, đau cơ khớp, đau răng, đau bụng kinh, đau hậu phẫu mức độ nhẹ).",
    dose: "10 - 15 mg/kg mỗi 4 - 6 giờ khi cần. Người lớn: 500mg - 1000mg/lần. Tối đa không quá 4g/ngày (hoặc không quá 3g/ngày ở người có bệnh gan hoặc nghiện rượu).",
    renalAdjust: "CrCl 10-50 mL/phút: Giãn khoảng cách dùng thuốc mỗi 6 giờ; CrCl < 10 mL/phút: Giãn cách mỗi 8 giờ.",
    warning: "Ngộ độc cấp do chuyển hóa thành chất chuyển hóa độc hại NAPQI vượt quá lượng Glutathione của gan, gây hoại tử tế bào gan cấp tính.",
    sideEffects: "Dung nạp tốt ở liều điều trị, hiếm gặp hội chứng Stevens-Johnson, độc tính gan khi dùng quá liều.",
    pearl: "Thuốc giải độc đặc hiệu ngộ độc Paracetamol là N-Acetylcysteine (NAC), hiệu quả cao nhất khi dùng trong vòng 8 giờ đầu sau khi uống thuốc quá liều."
  }
];

const DEFAULT_SPACED_REP = [
  { id: 1, title: "Giải phẫu động mạch vành & Cấp máu thất trái", subject: "Giải phẫu Tim", status: "Cần ôn ngay", cycle: 1, nextDate: "Hôm nay", intervalDays: 1 },
  { id: 2, title: "Phân loại Kháng sinh theo PK/PD (T>MIC vs Cmax/MIC)", subject: "Dược lý lâm sàng", status: "Đang ngấm", cycle: 2, nextDate: "Còn 2 ngày", intervalDays: 3 },
  { id: 3, title: "Kháng sinh đồ vi khuẩn đa kháng ESBL & MRSA", subject: "Vi sinh lâm sàng", status: "Đang ngấm", cycle: 3, nextDate: "Còn 6 ngày", intervalDays: 7 },
  { id: 4, title: "Tiêu chuẩn chẩn đoán Viêm ruột thừa cấp & Điểm Alvarado", subject: "Ngoại khoa", status: "Đã thuộc lòng", cycle: 4, nextDate: "Còn 14 ngày", intervalDays: 14 },
  { id: 5, title: "Đọc khí máu động mạch (ABG) & Phân tầng toan kiềm", subject: "Nội khoa Hô hấp", status: "Cần ôn ngay", cycle: 1, nextDate: "Hôm nay", intervalDays: 1 },
  { id: 6, title: "Tứ trụ điều trị Suy tim HFrEF theo khuyến cáo ESC/AHA", subject: "Nội Tim Mạch", status: "Đang ngấm", cycle: 2, nextDate: "Còn 3 ngày", intervalDays: 3 }
];

const DEFAULT_SOAP_NOTES = [
  {
    id: "soap-1",
    code: "BA-2026-089",
    patientName: "Nguyễn Văn H.",
    age: 64,
    gender: "Nam",
    department: "Khoa Nội Tim Mạch — BV ĐHYD TPHCM",
    date: "14/11/2026",
    lecturer: "PGS.TS. Lê Minh Quân",
    status: "Sẵn sàng trình bệnh",
    diagnosisPrimary: "Suy tim cấp mất bù (ADHF) thể Ấm - Ẩn / Đợt cấp suy tim mạn trên nền Tăng huyết áp độ 2",
    icd10: "I50.9 / I10",
    subjective: [
      "Bệnh nhân nam 64 tuổi, vào viện vì khó thở kịch phát về đêm và phù 2 chi dưới tăng dần 5 ngày nay.",
      "Khó thở xuất hiện khi nằm đầu thấp, phải kê 3 gối để ngủ (Orthopnea), giảm bớt khi ngồi dậy thõng chân mép giường.",
      "Ho khan về đêm, không sốt, không đau ngực kiểu màng phổi.",
      "Tiền sử: Tăng huyết áp 10 năm nay, điều trị không liên tục bằng Amlodipine 5mg + Perindopril 5mg, tự ý ngưng thuốc 2 tuần gần đây."
    ],
    objective: {
      vitals: "Mạch: 108 l/p (đều), HA: 165/95 mmHg, Thân nhiệt: 36.8°C, Nhịp thở: 26 l/p, SpO2: 91% (khí phòng)",
      physicalExam: "Tỉnh, tiếp xúc tốt. Phù mềm ấn lõm 2 cẳng chân (+), tĩnh mạch cổ nổi (+) ở tư thế 45 độ, phản hồi gan - tĩnh mạch cổ (+). Tim nhịp nhanh đều, T1 T2 rõ, T3 nghe rõ ở mỏm, âm thổi tâm thu 2/6 ở mỏm. Phổi nghe ran ẩm nhiều ở 1/3 dưới 2 phế trường.",
      labResults: "NT-proBNP: 4,850 pg/mL (tăng rất cao). Troponin T hs: 18 ng/L (giới hạn bình thường). ECG: Nhịp xoang 106 l/p, dày thất trái theo Sokolow-Lyon (SV1 + RV5 = 39mm). Siêu âm tim qua thành ngực: Giãn thất trái (LVEDD 58mm), giảm động toàn bộ thất trái, EF = 34%. Ion đồ: Na+ 137, K+ 4.2, Cl- 101 mmol/L. Creatinine: 1.4 mg/dL -> eGFR: 51 mL/phút."
    },
    assessment: "Chẩn đoán xác định: Suy tim cấp mất bù (tiêu chuẩn Framingham: 3 tiêu chuẩn chính + 2 tiêu chuẩn phụ) phân độ NYHA IV, phân loại lâm sàng thể Ấm - Ẩm (Warm-Wet), EF giảm (HFrEF 34%). Yếu tố khởi kích: Kém tuân thủ điều trị thuốc hạ áp dẫn đến cơn tăng huyết áp.",
    plan: [
      "Hồi sức cấp cứu: Nằm đầu cao 45 độ (tư thế Fowler), thở oxy qua kính mũi 3 L/phút duy trì SpO2 > 94%.",
      "Lợi tiểu giải quyết ứ huyết: Furosemide 40mg tiêm tĩnh mạch chậm, theo dõi lượng nước tiểu mục tiêu đạt > 500mL trong 2 giờ đầu.",
      "Kiểm soát huyết áp: Nitroglycerin truyền tĩnh mạch nếu huyết áp tâm thu vẫn > 140 mmHg sau lợi tiểu.",
      "Dài hạn (GDMT sau khi bệnh nhân hết ứ huyết): Chuyển sang Tứ trụ điều trị HFrEF: Sacubitril/Valsartan (ARNI) thay ACEi, bổ sung Spironolactone 25mg, Dapagliflozin 10mg, và bắt đầu Bisoprolol liều thấp 1.25mg khi đã hết ran phổi và phù."
    ],
    cornellTakeaway: "KHÔNG được khởi trị hoặc tăng liều thuốc chẹn Beta trong lúc bệnh nhân đang trong giai đoạn sung huyết cấp tính (ran ẩm phổi, phù nhiều). Cần theo dõi sát điện giải đồ (K+, Na+) và chức năng thận (Creatinine) mỗi 24 giờ sau khi dùng lợi tiểu quai."
  },
  {
    id: "soap-2",
    code: "BA-2026-104",
    patientName: "Trần Thị M.",
    age: 58,
    gender: "Nữ",
    department: "Khoa Nội Hô Hấp — BV Nhân Dân Gia Định",
    date: "13/11/2026",
    lecturer: "BSCKII. Vũ Trọng Khang",
    status: "Đã duyệt",
    diagnosisPrimary: "Viêm phổi mắc phải cộng đồng (CAP) mức độ trung bình (CURB-65 = 2 điểm) / Đái tháo đường type 2",
    icd10: "J18.9 / E11",
    subjective: [
      "Bệnh nhân nữ 58 tuổi, vào viện vì sốt cao lạnh run và ho khạc đàm mủ màu rỉ sắt 3 ngày nay.",
      "Đau ngực kiểu màng phổi bên phải khi hít sâu, mệt mỏi ăn uống kém.",
      "Tiền sử: Đái tháo đường type 2 đang uống Metformin 1000mg/ngày, HbA1c gần nhất 7.8%."
    ],
    objective: {
      vitals: "Mạch: 98 l/p, HA: 110/70 mmHg, Thân nhiệt: 38.9°C, Nhịp thở: 31 l/p, SpO2: 92% (khí phòng)",
      physicalExam: "Bệnh nhân lơ mơ nhẹ thoáng qua nhưng định hướng được, môi khô lưỡi dơ. Lồng ngực bên phải giảm di động khi thở, rung thanh tăng ở đáy phổi phải, gõ đục đáy phổi phải, nghe tiếng ran nổ và ran ẩm khu trú thùy dưới phổi phải.",
      labResults: "Công thức máu: Bạch cầu (WBC) 16.4 G/L, Neutrophil 86%. CRP: 94 mg/L (tăng cao). Ure máu: 7.8 mmol/L. X-quang ngực thẳng: Hình ảnh đông đặc phế nang thùy dưới phổi phải kèm phế quản hơi (Air-bronchogram)."
    },
    assessment: "Viêm phổi mắc phải cộng đồng (CAP) thùy dưới phổi phải, nghĩ nhiều do Phế cầu khuẩn (Streptococcus pneumoniae). Thang điểm CURB-65 = 2 điểm (Nhịp thở >= 30, Tuổi < 65 nhưng có yếu tố đái tháo đường và SpO2 giảm) -> Chỉ định nhập viện khoa Hô hấp điều trị nội trú.",
    plan: [
      "Kháng sinh kinh nghiệm theo phác đồ BYT: Ceftriaxone 2g IV mỗi 24h + Clarithromycin 500mg IV mỗi 12h (phối hợp Beta-lactam + Macrolide phổ rộng).",
      "Thở oxy qua ống thông mũi 2 L/phút.",
      "Hạ sốt: Paracetamol 1g truyền tĩnh mạch khi sốt >= 38.5°C.",
      "Kiểm soát đường huyết: Tạm ngưng Metformin, chuyển sang tiêm Insulin phác đồ Basal-Bolus trong thời gian nằm viện nhiễm trùng cấp.",
      "Cấy đàm và cấy máu 2 mẫu trước khi bắt đầu liều kháng sinh đầu tiên."
    ],
    cornellTakeaway: "Luôn tính thang điểm CURB-65 và đánh giá bệnh nền (đái tháo đường, suy tim) trước khi quyết định điều trị ngoại trú hay nội trú. Phải cấy vi sinh trước liều kháng sinh đầu tiên để có kháng sinh đồ chỉnh liều sau 48-72h."
  }
];

const DEFAULT_CHECKLIST = [
  { id: 1, text: "Áo Blouse trắng ủi phẳng + Bảng tên sinh viên y", done: true },
  { id: 2, text: "Ống nghe Littmann Classic III / Cardiology kiểm tra màng nghe", done: true },
  { id: 3, text: "Đèn soi đồng tử & Búa gõ phản xạ gân xương Babinski", done: true },
  { id: 4, text: "Thước dây y tế đo vòng bụng, vòng chi & chiều cao tử cung", done: false },
  { id: 5, text: "Sổ tay lâm sàng bỏ túi + Bút dạ quang 3 màu ghi chú sinh hiệu", done: true },
  { id: 6, text: "Khẩu trang y tế N95 + Găng tay sạch chuẩn bị thăm khám", done: true },
  { id: 7, text: "Xem hồ sơ bệnh án & cập nhật sinh hiệu buổi sáng trước 06:45", done: false },
  { id: 8, text: "Đi buồng giao ban cùng Bác sĩ nội trú và chuẩn bị bệnh án trình", done: false }
];

const DEFAULT_FLASHCARDS = [
  {
    id: 1,
    subject: "Tim Mạch",
    question: "Tam chứng Beck trong chèn ép tim cấp (Cardiac Tamponade) gồm những dấu hiệu lâm sàng nào?",
    answer: "1. Huyết áp tụt (Hạ huyết áp kẹt)<br>2. Tĩnh mạch cổ nổi to<br>3. Tiếng tim mờ xa xăm (Muffled heart sounds).",
    hint: "Dấu hiệu tắc nghẽn đổ đầy cơ học 3 chữ H-T-T"
  },
  {
    id: 2,
    subject: "Dược Lý",
    question: "Tại sao không được phối hợp kháng sinh nhóm Aminoglycoside với quai Henle Furosemide?",
    answer: "Cả hai nhóm đều có độc tính cao hiệp đồng trên <strong>tai (độc thính giác gây điếc không hồi phục)</strong> và <strong>thận (gây hoại tử ống thận cấp)</strong>.",
    hint: "Cơ quan thính giác và bài tiết"
  },
  {
    id: 3,
    subject: "Ngoại Khoa",
    question: "Tam chứng Charcot và Ngũ chứng Reynolds trong nhiễm trùng đường mật cấp là gì?",
    answer: "<strong>Tam chứng Charcot:</strong> Đau bụng hạ sườn phải -> Sốt rét run -> Vàng da.<br><strong>Ngũ chứng Reynolds:</strong> Tam chứng Charcot + Tụt huyết áp (Sốc nhiễm trùng) + Rối loạn tri giác.",
    hint: "Sỏi kẹt ống mật chủ"
  },
  {
    id: 4,
    subject: "Hô Hấp",
    question: "Tiêu chuẩn chẩn đoán Viêm phổi mắc phải cộng đồng (CAP) trên X-quang phổi chuẩn là gì?",
    answer: "Hình ảnh thâm nhiễm phế nang mới xuất hiện (đám mờ đồng nhất, bóng mờ dạng thùy) kèm theo hình ảnh <strong>Phế quản hơi (Air-bronchogram)</strong>.",
    hint: "Thâm nhiễm nhu mô + phế quản hơi"
  },
  {
    id: 5,
    subject: "Thần Kinh",
    question: "3 thành phần và điểm tối đa của Thang điểm hôn mê Glasgow (GCS) là gì?",
    answer: "<strong>E (Mắt - Eye):</strong> 4 điểm<br><strong>V (Lời nói - Verbal):</strong> 5 điểm<br><strong>M (Vận động - Motor):</strong> 6 điểm<br>Tổng điểm tối đa là 15, thấp nhất là 3 điểm.",
    hint: "E4 - V5 - M6"
  },
  {
    id: 6,
    subject: "Nội Tiết",
    question: "Mức lọc cầu thận (eGFR) bao nhiêu thì chống chỉ định tuyệt đối sử dụng Metformin?",
    answer: "<strong>eGFR < 30 mL/phút/1.73m²</strong> do nguy cơ tích lũy thuốc gây toan acid lactic nghiêm trọng có thể đe dọa tính mạng.",
    hint: "Suy thận giai đoạn 4 trở đi"
  }
];

const NORMAL_LAB_VALUES = [
  { name: "Hồng cầu (RBC)", value: "Nam: 4.2 - 5.8 T/L | Nữ: 3.8 - 5.0 T/L", category: "Huyết học" },
  { name: "Hemoglobin (Hb)", value: "Nam: 130 - 180 g/L | Nữ: 120 - 160 g/L", category: "Huyết học" },
  { name: "Bạch cầu (WBC)", value: "4.0 - 10.0 G/L (Neutrophil: 40 - 70%)", category: "Huyết học" },
  { name: "Tiểu cầu (PLT)", value: "150 - 450 G/L", category: "Huyết học" },
  { name: "Glucose đói (Fasting)", value: "3.9 - 6.4 mmol/L (70 - 115 mg/dL)", category: "Sinh hóa" },
  { name: "HbA1c", value: "< 5.7% (Bình thường) | >= 6.5% (Đái tháo đường)", category: "Sinh hóa" },
  { name: "Creatinine huyết thanh", value: "Nam: 62 - 106 µmol/L | Nữ: 44 - 80 µmol/L", category: "Sinh hóa" },
  { name: "AST / ALT", value: "< 35 U/L (Nam) | < 30 U/L (Nữ)", category: "Sinh hóa" },
  { name: "Natri (Na+)", value: "135 - 145 mmol/L", category: "Điện giải" },
  { name: "Kali (K+)", value: "3.5 - 5.0 mmol/L (Cấp cứu khi < 3.0 hoặc > 6.0)", category: "Điện giải" },
  { name: "Khí máu pH", value: "7.35 - 7.45", category: "Khí máu" },
  { name: "PaCO2", value: "35 - 45 mmHg", category: "Khí máu" },
  { name: "PaO2", value: "80 - 100 mmHg", category: "Khí máu" },
  { name: "HCO3- thực tế", value: "22 - 26 mmol/L", category: "Khí máu" }
];
