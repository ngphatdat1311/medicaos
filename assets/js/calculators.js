/**
 * MedicaOS — Bộ Máy Tính Y Khoa & Dược Lâm Sàng
 * CrCl Cockcroft-Gault, BMI & BSA, Glasgow (GCS), CURB-65, CHA2DS2-VASc, Parkland & Drip Rate
 */

const MedicalCalculators = {
  // 1. Cockcroft-Gault CrCl
  calculateCrCl: function() {
    const age = parseFloat(document.getElementById('calcCrclAge')?.value) || 0;
    const weight = parseFloat(document.getElementById('calcCrclWeight')?.value) || 0;
    const scr = parseFloat(document.getElementById('calcCrclScr')?.value) || 0;
    const gender = document.getElementById('calcCrclGender')?.value || 'male';
    const scrUnit = document.getElementById('calcCrclScrUnit')?.value || 'mgdl';

    const resultEl = document.getElementById('calcCrclResult');
    const stageEl = document.getElementById('calcCrclStage');
    const alertEl = document.getElementById('calcCrclAlert');

    if (!resultEl) return;

    if (age <= 0 || weight <= 0 || scr <= 0) {
      resultEl.textContent = '-- mL/phút';
      if (stageEl) stageEl.textContent = 'Nhập đủ thông số để tính';
      if (alertEl) alertEl.className = 'hidden';
      return;
    }

    // Convert µmol/L to mg/dL if needed (1 mg/dL = 88.4 µmol/L)
    const scrInMgDl = scrUnit === 'umol' ? (scr / 88.4) : scr;

    let crcl = ((140 - age) * weight) / (72 * scrInMgDl);
    if (gender === 'female') {
      crcl *= 0.85;
    }

    const val = crcl.toFixed(1);
    resultEl.textContent = val + ' mL/phút';

    // KDIGO staging & Clinical Advice
    let stageText = '';
    let alertText = '';
    let alertClass = 'p-3 rounded-xl text-xs ';

    if (crcl >= 90) {
      stageText = 'G1: Chức năng thận bình thường hoặc tăng lọc';
      alertText = '✅ Liều kháng sinh và thuốc tim mạch: Dùng liều tiêu chuẩn người lớn.';
      alertClass += 'badge-emerald';
    } else if (crcl >= 60) {
      stageText = 'G2: Giảm nhẹ chức năng thận (60 - 89 mL/phút)';
      alertText = 'ℹ Đa số thuốc chưa cần chỉnh liều. Lưu ý theo dõi khi dùng Aminoglycoside, Vancomycin.';
      alertClass += 'badge-emerald';
    } else if (crcl >= 45) {
      stageText = 'G3a: Giảm nhẹ đến vừa (45 - 59 mL/phút)';
      alertText = '⚠ Giảm liều hoặc giãn khoảng cách liều: Enoxaparin, Fluoroquinolone. Metformin tối đa 1000mg/ngày.';
      alertClass += 'badge-amber';
    } else if (crcl >= 30) {
      stageText = 'G3b: Giảm vừa đến nặng (30 - 44 mL/phút)';
      alertText = '⚠ Cần chỉnh liều nhiều loại kháng sinh. Cân nhắc giảm 50% liều Metformin, chỉnh liều Allopurinol.';
      alertClass += 'badge-amber';
    } else if (crcl >= 15) {
      stageText = 'G4: Suy thận nặng (15 - 29 mL/phút)';
      alertText = '🚨 CHỐNG CHỈ ĐỊNH: Metformin, NSAIDs. Chỉnh liều nghiêm ngặt Ceftriaxone/Cefepime, Enoxaparin 1mg/kg mỗi 24h.';
      alertClass += 'badge-rose';
    } else {
      stageText = 'G5: Suy thận giai đoạn cuối (< 15 mL/phút hoặc chạy thận)';
      alertText = '🚨 Lọc máu / Thận nhân tạo chu kỳ. Cần bác sĩ Dược lâm sàng hội chẩn liều cụ thể từng hoạt chất.';
      alertClass += 'badge-rose';
    }

    if (stageEl) stageEl.textContent = stageText;
    if (alertEl) {
      alertEl.className = alertClass;
      alertEl.innerHTML = alertText;
    }
  },

  // 2. BMI & BSA (Mosteller)
  calculateBmiBsa: function() {
    const height = parseFloat(document.getElementById('calcBmiHeight')?.value) || 0; // cm
    const weight = parseFloat(document.getElementById('calcBmiWeight')?.value) || 0; // kg

    const bmiEl = document.getElementById('calcBmiResult');
    const bsaEl = document.getElementById('calcBsaResult');
    const classEl = document.getElementById('calcBmiClass');

    if (!bmiEl || !bsaEl) return;

    if (height <= 0 || weight <= 0) {
      bmiEl.textContent = '-- kg/m²';
      bsaEl.textContent = '-- m²';
      if (classEl) classEl.textContent = 'Nhập chiều cao và cân nặng';
      return;
    }

    const hMeters = height / 100;
    const bmi = weight / (hMeters * hMeters);
    // Mosteller formula: sqrt((height * weight) / 3600)
    const bsa = Math.sqrt((height * weight) / 3600);

    bmiEl.textContent = bmi.toFixed(2) + ' kg/m²';
    bsaEl.textContent = bsa.toFixed(2) + ' m²';

    // Asian Classification (IDI & WPRO)
    let category = '';
    if (bmi < 18.5) category = 'Thiếu cân (Dưới chuẩn)';
    else if (bmi < 23.0) category = 'Cân nặng bình thường (Chuẩn Châu Á)';
    else if (bmi < 25.0) category = 'Tiền béo phì (Thừa cân)';
    else if (bmi < 30.0) category = 'Béo phì độ I';
    else category = 'Béo phì độ II (Nguy cơ tim mạch rất cao)';

    if (classEl) classEl.textContent = category;
  },

  // 3. Glasgow Coma Scale (GCS)
  calculateGlasgow: function() {
    const eye = parseInt(document.querySelector('input[name="gcsEye"]:checked')?.value || '4');
    const verbal = parseInt(document.querySelector('input[name="gcsVerbal"]:checked')?.value || '5');
    const motor = parseInt(document.querySelector('input[name="gcsMotor"]:checked')?.value || '6');

    const total = eye + verbal + motor;
    const scoreEl = document.getElementById('gcsTotalScore');
    const textEl = document.getElementById('gcsScoreDetail');
    const actionEl = document.getElementById('gcsActionAdvice');

    if (scoreEl) scoreEl.textContent = total + ' / 15';

    let severity = '';
    let advice = '';
    let badgeClass = 'badge-emerald';

    if (total >= 13) {
      severity = 'Chấn thương sọ não / Hôn mê mức độ NHẸ (GCS 13 - 15)';
      advice = 'Theo dõi tri giác mỗi 2 - 4 giờ, theo dõi dấu thần kinh khu trú và kích thước đồng tử.';
    } else if (total >= 9) {
      severity = 'Chấn thương sọ não / Hôn mê mức độ TRUNG BÌNH (GCS 9 - 12)';
      advice = 'Chỉ định chụp CT Scan sọ não khẩn cấp, theo dõi sát sinh hiệu và chuẩn bị can thiệp đường thở.';
      badgeClass = 'badge-amber';
    } else {
      severity = 'Chấn thương sọ não / Hôn mê mức độ NẶNG (GCS <= 8)';
      advice = '🚨 NGUY CƠ TẮC ĐƯỜNG THỞ! Chỉ định ĐẶT NỘI KHÍ QUẢN bảo vệ đường thở và hồi sức thần kinh tích cực ngay lập tức.';
      badgeClass = 'badge-rose';
    }

    if (textEl) {
      textEl.className = 'text-xs font-semibold px-2 py-1 rounded-full ' + badgeClass;
      textEl.textContent = severity;
    }
    if (actionEl) actionEl.textContent = advice;
  },

  // 4. CURB-65 Viêm Phổi
  calculateCurb65: function() {
    let score = 0;
    if (document.getElementById('curbConfusion')?.checked) score++;
    if (document.getElementById('curbUrea')?.checked) score++;
    if (document.getElementById('curbRr')?.checked) score++;
    if (document.getElementById('curbBp')?.checked) score++;
    if (document.getElementById('curbAge')?.checked) score++;

    const scoreEl = document.getElementById('curb65ResultScore');
    const riskEl = document.getElementById('curb65RiskLevel');
    const recEl = document.getElementById('curb65Recommendation');

    if (scoreEl) scoreEl.textContent = score + ' / 5 điểm';

    let risk = '';
    let rec = '';
    let badgeClass = 'badge-emerald';

    if (score <= 1) {
      risk = 'Nguy cơ tử vong thấp (< 2% - Nhóm 1)';
      rec = 'Điều trị ngoại trú bằng kháng sinh đường uống (Amoxicillin/Clavulanate hoặc Macrolide/Doxycycline).';
    } else if (score === 2) {
      risk = 'Nguy cơ tử vong trung bình (~9% - Nhóm 2)';
      rec = 'Chỉ định nhập viện điều trị nội trú tại Khoa Nội Hô hấp. Kháng sinh đường tiêm hoặc phối hợp.';
      badgeClass = 'badge-amber';
    } else {
      risk = 'Nguy cơ tử vong cao (15 - 40% - Nhóm 3)';
      rec = '🚨 Nhập viện khẩn cấp! Cân nhắc chuyển ICU điều trị tích cực nếu có suy hô hấp hoặc sốc nhiễm trùng.';
      badgeClass = 'badge-rose';
    }

    if (riskEl) {
      riskEl.className = 'text-xs font-semibold px-2 py-1 rounded-full ' + badgeClass;
      riskEl.textContent = risk;
    }
    if (recEl) recEl.textContent = rec;
  },

  // 5. CHA2DS2-VASc
  calculateCha2ds2Vasc: function() {
    let score = 0;
    if (document.getElementById('chaChf')?.checked) score += 1;
    if (document.getElementById('chaHtn')?.checked) score += 1;
    if (document.getElementById('chaAge75')?.checked) score += 2;
    if (document.getElementById('chaDm')?.checked) score += 1;
    if (document.getElementById('chaStroke')?.checked) score += 2;
    if (document.getElementById('chaVasc')?.checked) score += 1;
    if (document.getElementById('chaAge65')?.checked) score += 1;
    if (document.getElementById('chaFemale')?.checked) score += 1;

    const scoreEl = document.getElementById('chaScoreDisplay');
    const adviceEl = document.getElementById('chaAdviceDisplay');

    if (scoreEl) scoreEl.textContent = score + ' điểm';

    const isFemale = document.getElementById('chaFemale')?.checked;
    let text = '';
    if (score === 0 || (isFemale && score === 1)) {
      text = 'Nguy cơ đột quỵ rất thấp. Khuyến cáo KHÔNG cần dùng thuốc chống đông máu.';
    } else if (score === 1 && !isFemale) {
      text = 'Nguy cơ đột quỵ trung bình. Cân nhắc dùng thuốc chống đông đường uống (NOAC/DOAC ưu tiên hơn Warfarin).';
    } else {
      text = '🚨 Nguy cơ đột quỵ CAO! Có CHỈ ĐỊNH BẮT BUỘC dùng thuốc chống đông đường uống (Rivaroxaban, Apixaban, Dabigatran hoặc VKA).';
    }

    if (adviceEl) adviceEl.textContent = text;
  },

  // 6. Parkland & Drip Rate
  calculateParkland: function() {
    const weight = parseFloat(document.getElementById('parklandWeight')?.value) || 0;
    const tbsa = parseFloat(document.getElementById('parklandTbsa')?.value) || 0;

    const totalEl = document.getElementById('parklandTotalFluid');
    const first8El = document.getElementById('parklandFirst8h');
    const next16El = document.getElementById('parklandNext16h');

    if (!totalEl) return;

    if (weight <= 0 || tbsa <= 0) {
      totalEl.textContent = '-- mL';
      if (first8El) first8El.textContent = '-- mL ( -- mL/giờ)';
      if (next16El) next16El.textContent = '-- mL ( -- mL/giờ)';
      return;
    }

    // Parkland Formula: 4 mL * Weight (kg) * % TBSA
    const totalMl = 4 * weight * tbsa;
    const first8Ml = totalMl / 2;
    const next16Ml = totalMl / 2;

    const rateFirst8 = (first8Ml / 8).toFixed(0);
    const rateNext16 = (next16Ml / 16).toFixed(0);

    totalEl.textContent = totalMl.toLocaleString() + ' mL (Ringer Lactate)';
    if (first8El) first8El.textContent = first8Ml.toLocaleString() + ' mL (Tốc độ: ' + rateFirst8 + ' mL/giờ)';
    if (next16El) next16El.textContent = next16Ml.toLocaleString() + ' mL (Tốc độ: ' + rateNext16 + ' mL/giờ)';
  },

  calculateDripRate: function() {
    const vol = parseFloat(document.getElementById('dripVolume')?.value) || 0; // mL
    const hours = parseFloat(document.getElementById('dripHours')?.value) || 0; // hours
    const dropFactor = parseInt(document.getElementById('dripFactor')?.value || '20'); // gtt/mL

    const resultEl = document.getElementById('dripResultRate');
    if (!resultEl) return;

    if (vol <= 0 || hours <= 0) {
      resultEl.textContent = '-- giọt/phút';
      return;
    }

    const totalMinutes = hours * 60;
    const dropsPerMin = (vol * dropFactor) / totalMinutes;
    const mlPerHour = vol / hours;

    resultEl.textContent = Math.round(dropsPerMin) + ' giọt/phút (' + mlPerHour.toFixed(0) + ' mL/giờ)';
  }
};
