/**
 * MedicaOS — Main Application Logic
 * Quản lý View, Theme, LocalStorage, Pomodoro, SOAP Notes, Dược điển, Flashcards, Checklist & Tra cứu
 */

// Application State
const AppState = {
  theme: localStorage.getItem('medicaos_theme') || 'botanical',
  currentView: 'dashboard',
  subjects: JSON.parse(localStorage.getItem('medicaos_subjects')) || DEFAULT_SUBJECTS,
  drugs: JSON.parse(localStorage.getItem('medicaos_drugs')) || DEFAULT_DRUGS,
  spacedRep: JSON.parse(localStorage.getItem('medicaos_spaced_rep')) || DEFAULT_SPACED_REP,
  soapNotes: JSON.parse(localStorage.getItem('medicaos_soap_notes')) || DEFAULT_SOAP_NOTES,
  checklist: JSON.parse(localStorage.getItem('medicaos_checklist')) || DEFAULT_CHECKLIST,
  flashcards: JSON.parse(localStorage.getItem('medicaos_flashcards')) || DEFAULT_FLASHCARDS,

  // Selected state
  selectedSoapId: null,
  currentFlashcardIdx: 0,
  flashcardFlipped: false,

  // Pomodoro
  pomoTimeLeft: 25 * 60,
  pomoTotalTime: 25 * 60,
  pomoRunning: false,
  pomoInterval: null,
  pomoCompletedCount: parseInt(localStorage.getItem('medicaos_pomo_count') || '7'),

  saveToStorage: function(key) {
    if (key === 'drugs') localStorage.setItem('medicaos_drugs', JSON.stringify(this.drugs));
    if (key === 'soap') localStorage.setItem('medicaos_soap_notes', JSON.stringify(this.soapNotes));
    if (key === 'spaced') localStorage.setItem('medicaos_spaced_rep', JSON.stringify(this.spacedRep));
    if (key === 'checklist') localStorage.setItem('medicaos_checklist', JSON.stringify(this.checklist));
    if (key === 'flashcards') localStorage.setItem('medicaos_flashcards', JSON.stringify(this.flashcards));
    if (key === 'pomo') localStorage.setItem('medicaos_pomo_count', this.pomoCompletedCount.toString());
  }
};

// =====================================================================
// THEME & VIEW SWITCHER
// =====================================================================
function setTheme(theme, showNotice = true) {
  AppState.theme = theme;
  localStorage.setItem('medicaos_theme', theme);

  if (theme === 'botanical') {
    document.documentElement.removeAttribute('data-theme');
    if (showNotice) showToast('Đã chọn theme: Botanical Apothecary (Kem ấm & Xanh Sage)');
  } else if (theme === 'matcha') {
    document.documentElement.setAttribute('data-theme', 'matcha');
    if (showNotice) showToast('Đã chọn theme: Matcha Clinical (Xanh Matcha tươi mát)');
  } else if (theme === 'midnight') {
    document.documentElement.setAttribute('data-theme', 'midnight');
    if (showNotice) showToast('Đã chọn theme: Midnight On-Call (Chế độ Trực đêm dịu mắt)');
  }

  // Sync palette buttons
  const themes = ['botanical', 'matcha', 'midnight'];
  themes.forEach(t => {
    const topBtn = document.getElementById('paletteBtn_' + t);
    const sideBtn = document.getElementById('sidePaletteBtn_' + t);
    if (topBtn) {
      if (t === theme) {
        topBtn.classList.add('ring-2', 'ring-emerald-400');
        topBtn.classList.remove('opacity-60');
      } else {
        topBtn.classList.remove('ring-2', 'ring-emerald-400');
        topBtn.classList.add('opacity-60');
      }
    }
    if (sideBtn) {
      if (t === theme) {
        sideBtn.classList.add('ring-2', 'ring-emerald-600/70');
      } else {
        sideBtn.classList.remove('ring-2', 'ring-emerald-600/70');
      }
    }
  });
}

function switchView(viewName, updateHash = true) {
  AppState.currentView = viewName;
  if (updateHash && window.location.hash !== '#' + viewName) {
    window.location.hash = viewName;
  }
  const views = ['dashboard', 'soap', 'drugs', 'calculators', 'flashcards', 'library', 'tokens'];

  views.forEach(v => {
    const el = document.getElementById('view_' + v);
    const navBtn = document.getElementById('navBtn_' + v);
    const sideBtn = document.getElementById('sideNavBtn_' + v);

    if (el) {
      el.classList.toggle('hidden', v !== viewName);
    }

    if (navBtn) {
      if (v === viewName) {
        navBtn.className = 'px-3 py-1.5 rounded-lg font-semibold transition bg-white text-slate-900 shadow-sm';
      } else {
        navBtn.className = 'px-3 py-1.5 rounded-lg font-medium transition text-neutral-300 hover:text-white';
      }
    }

    if (sideBtn) {
      if (v === viewName) {
        sideBtn.className = 'w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-medium notion-surface text-main transition shadow-sm';
      } else {
        sideBtn.className = 'w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-medium text-sub hover:opacity-80 transition';
      }
    }
  });

  // Mobile sidebar close
  closeMobileSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Refresh view contents if needed
  if (viewName === 'soap') renderSoapView();
  if (viewName === 'drugs') renderDrugCardsGrid();
  if (viewName === 'flashcards') renderFlashcardStudy();
  if (viewName === 'calculators') {
    MedicalCalculators.calculateCrCl();
    MedicalCalculators.calculateBmiBsa();
  }
}

// URL Hash routing listener
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (['dashboard', 'soap', 'drugs', 'calculators', 'flashcards', 'library', 'tokens'].includes(hash)) {
    switchView(hash, false);
  }
});

function toggleMobileSidebar() {
  const sidebar = document.getElementById('mainSidebar');
  const overlay = document.getElementById('sidebarBackdrop');
  if (!sidebar) return;
  const isOpen = !sidebar.classList.contains('-translate-x-full');
  if (isOpen) {
    sidebar.classList.add('-translate-x-full');
    if (overlay) overlay.classList.add('hidden');
  } else {
    sidebar.classList.remove('-translate-x-full');
    if (overlay) overlay.classList.remove('hidden');
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('mainSidebar');
  const overlay = document.getElementById('sidebarBackdrop');
  if (sidebar && window.innerWidth < 1024) {
    sidebar.classList.add('-translate-x-full');
    if (overlay) overlay.classList.add('hidden');
  }
}

// =====================================================================
// POMODORO TIMER & AMBIENCE
// =====================================================================
function updatePomodoroDisplay() {
  const m = Math.floor(AppState.pomoTimeLeft / 60);
  const s = AppState.pomoTimeLeft % 60;
  const str = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);

  const disp = document.getElementById('pomoDisplay');
  if (disp) disp.textContent = str;

  // Title tag update
  if (AppState.pomoRunning) {
    document.title = `(${str}) MedicaOS — Học Y Dược`;
  } else {
    document.title = `MedicaOS — Website Học Tập & Bệnh Án Y Dược`;
  }
}

function togglePomodoro() {
  const btn = document.getElementById('pomoToggleBtn');
  if (AppState.pomoRunning) {
    clearInterval(AppState.pomoInterval);
    AppState.pomoInterval = null;
    AppState.pomoRunning = false;
    if (btn) btn.textContent = 'Tiếp tục';
  } else {
    AppState.pomoRunning = true;
    if (btn) btn.textContent = 'Tạm dừng';
    AppState.pomoInterval = setInterval(() => {
      if (AppState.pomoTimeLeft > 0) {
        AppState.pomoTimeLeft--;
        updatePomodoroDisplay();
      } else {
        clearInterval(AppState.pomoInterval);
        AppState.pomoInterval = null;
        AppState.pomoRunning = false;
        AppState.pomoCompletedCount++;
        AppState.saveToStorage('pomo');
        if (btn) btn.textContent = 'Bắt đầu học';
        medicalAudio.playCompletionChime();
        showToast('🎉 Hoàn thành 1 phiên Pomodoro 25 phút!');
        resetPomodoro(5 * 60, 'Nghỉ 5m');
      }
    }, 1000);
  }
}

function resetPomodoro(seconds = 25 * 60, modeLabel = 'Focus 25m') {
  if (AppState.pomoInterval) {
    clearInterval(AppState.pomoInterval);
    AppState.pomoInterval = null;
  }
  AppState.pomoRunning = false;
  AppState.pomoTimeLeft = seconds;
  AppState.pomoTotalTime = seconds;
  updatePomodoroDisplay();

  const btn = document.getElementById('pomoToggleBtn');
  const badge = document.getElementById('pomoModeBadge');
  if (btn) btn.textContent = 'Bắt đầu học';
  if (badge) badge.textContent = modeLabel;
}

// Quick CrCl on Dashboard
function calcCrClQuick() {
  const age = parseFloat(document.getElementById('crclAge')?.value) || 0;
  const weight = parseFloat(document.getElementById('crclWeight')?.value) || 0;
  const scr = parseFloat(document.getElementById('crclScr')?.value) || 0;
  const out = document.getElementById('crclResultValue');

  if (!out) return;
  if (age <= 0 || weight <= 0 || scr <= 0) {
    out.textContent = '-- mL/phút';
    return;
  }

  const crcl = ((140 - age) * weight) / (72 * scr);
  out.textContent = crcl.toFixed(1) + ' mL/phút';
}

// =====================================================================
// SUBJECT GALLERY & MODAL
// =====================================================================
function filterCategory(cat) {
  const cards = document.querySelectorAll('#subjectGalleryGrid > div');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-cat');
    card.style.display = (cat === 'all' || cardCat === cat) ? '' : 'none';
  });

  const btnMap = { all: 'catBtnAll', y: 'catBtnY', duoc: 'catBtnDuoc' };
  for (const k in btnMap) {
    const b = document.getElementById(btnMap[k]);
    if (b) {
      if (k === cat) {
        b.className = 'px-2.5 py-1 rounded-lg notion-surface font-semibold text-main transition';
      } else {
        b.className = 'px-2.5 py-1 rounded-lg text-sub hover:opacity-80 transition';
      }
    }
  }
}

function filterSubjectsBySearch(q) {
  const query = (q || '').toLowerCase();
  const cards = document.querySelectorAll('#subjectGalleryGrid > div');
  cards.forEach(card => {
    const title = (card.getAttribute('data-title') || '').toLowerCase();
    card.style.display = (!query || title.includes(query)) ? '' : 'none';
  });
}

function openSubjectModal(subjectId) {
  const sub = AppState.subjects.find(s => s.id === subjectId);
  if (!sub) return;

  const modal = document.getElementById('subjectDetailModal');
  const title = document.getElementById('subjectModalTitle');
  const meta = document.getElementById('subjectModalMeta');
  const summary = document.getElementById('subjectModalSummary');
  const notesContainer = document.getElementById('subjectModalNotes');

  if (title) title.textContent = sub.code + ' — ' + sub.title;
  if (meta) meta.innerHTML = `<span>👨‍⚕️ ${sub.lecturer}</span> • <span>🎓 ${sub.credits} Tín chỉ</span> • <span class="badge-emerald px-2 py-0.5 rounded-full font-mono-code">${sub.status} (${sub.progress}%)</span>`;
  if (summary) summary.textContent = sub.summary;

  if (notesContainer) {
    notesContainer.innerHTML = sub.keyNotes.map(n => `
      <li class="p-3 rounded-xl notion-subtle text-xs text-main flex items-start gap-2">
        <span class="text-emerald-600 mt-0.5">📌</span>
        <span>${n}</span>
      </li>
    `).join('');
  }

  if (modal) modal.classList.remove('hidden');
}

function closeSubjectModal() {
  const modal = document.getElementById('subjectDetailModal');
  if (modal) modal.classList.add('hidden');
}

// =====================================================================
// SPACED REPETITION (ACTIVE RECALL DATABASE TABLE)
// =====================================================================
function renderSpacedRepTable() {
  const tbody = document.getElementById('spacedRepTableBody');
  const filterSelect = document.getElementById('srFilterSelect');
  const filterVal = filterSelect ? filterSelect.value : 'all';
  if (!tbody) return;

  const items = AppState.spacedRep.filter(item => {
    return filterVal === 'all' || item.status === filterVal;
  });

  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="py-6 text-center text-mute text-xs">Không có chuyên đề nào trong bộ lọc này.</td></tr>';
    return;
  }

  tbody.innerHTML = items.map(item => {
    let badgeClass = 'badge-emerald';
    if (item.status === 'Cần ôn ngay') badgeClass = 'badge-rose';
    else if (item.status === 'Đang ngấm') badgeClass = 'badge-amber';

    return `
      <tr class="row-hover-theme transition">
        <td class="py-3 px-3 font-medium text-main">${item.title}</td>
        <td class="py-3 px-3"><span class="px-2 py-0.5 rounded notion-subtle text-sub font-mono-code text-[11px]">${item.subject}</span></td>
        <td class="py-3 px-3"><span class="px-2.5 py-0.5 rounded-full font-mono-code text-[11px] font-semibold ${badgeClass}">● ${item.status}</span></td>
        <td class="py-3 px-3 font-mono-code text-sub">Chu kỳ R${item.cycle}</td>
        <td class="py-3 px-3 font-mono-code text-main">${item.nextDate}</td>
        <td class="py-3 px-3 text-right">
          <button onclick="reviewSpacedTopic(${item.id})" class="px-2.5 py-1 rounded-lg notion-subtle hover:opacity-80 text-main font-mono-code text-[11px] transition">
            ✓ Đã ôn hôm nay
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function reviewSpacedTopic(id) {
  const item = AppState.spacedRep.find(t => t.id === id);
  if (!item) return;

  item.cycle = Math.min(item.cycle + 1, 4);
  item.status = item.cycle >= 4 ? 'Đã thuộc lòng' : 'Đang ngấm';
  const days = item.cycle * 3;
  item.nextDate = `Còn ${days} ngày`;

  AppState.saveToStorage('spaced');
  renderSpacedRepTable();
  showToast(`Đã ghi nhận chu kỳ R${item.cycle} cho "${item.title}" (+${days} ngày)!`);
}

// =====================================================================
// DRUG FORMULARY (DƯỢC ĐIỂN BỎ TÚI)
// =====================================================================
function renderDrugCardsGrid(filterCategory = 'all', searchQuery = '') {
  const containerDashboard = document.getElementById('drugCardsContainer');
  const containerAll = document.getElementById('allDrugsCardsContainer');
  const searchInput = document.getElementById('drugSearchInput');
  const query = (searchQuery || searchInput?.value || '').trim().toLowerCase();

  if (!containerDashboard && !containerAll) return;

  const filtered = AppState.drugs.filter(d => {
    const matchCat = filterCategory === 'all' || d.category === filterCategory;
    const matchQuery = !query ||
      d.name.toLowerCase().includes(query) ||
      d.tradeNames.toLowerCase().includes(query) ||
      d.group.toLowerCase().includes(query) ||
      d.moa.toLowerCase().includes(query);
    return matchCat && matchQuery;
  });

  const emptyHtml = '<div class="col-span-full p-8 text-center text-mute text-xs">Không tìm thấy hoạt chất nào phù hợp.</div>';
  const cardsHtml = filtered.length === 0 ? emptyHtml : filtered.map(d => `
    <div onclick="openDrugDetailModal('${d.id}')" class="p-4 rounded-2xl notion-surface space-y-2.5 flex flex-col justify-between hover:shadow-md transition cursor-pointer">
      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[10px] font-mono-code px-2 py-0.5 rounded-md notion-subtle text-sub leading-normal inline-block">${d.group}</span>
          <span class="text-xs">💊</span>
        </div>
        <h3 class="font-editorial text-2xl text-main">${d.name}</h3>
        <p class="text-xs text-sub leading-relaxed line-clamp-3"><strong class="text-main">Cơ chế (MOA):</strong> ${d.moa}</p>
      </div>

      <div class="pt-2.5 border-t border-theme space-y-1.5 text-[11px]">
        <div class="font-mono-code text-main"><strong>Liều chuẩn:</strong> ${d.dose}</div>
        <div class="px-2 py-1 rounded-lg badge-rose font-medium line-clamp-2"><strong>⚠ Lưu ý:</strong> ${d.warning}</div>
      </div>
    </div>
  `).join('');

  if (containerDashboard) containerDashboard.innerHTML = cardsHtml;
  if (containerAll) containerAll.innerHTML = cardsHtml;
}

function renderDrugCards() {
  renderDrugCardsGrid();
}

function filterDrugCategory(cat) {
  const categories = ['all', 'khangsinh', 'timmach', 'noitiet', 'tieuhoa', 'giamdau'];
  categories.forEach(c => {
    const btn = document.getElementById('drugCatBtn_' + c);
    if (btn) {
      if (c === cat) {
        btn.className = 'px-3 py-1 rounded-lg notion-surface font-semibold text-main text-xs transition';
      } else {
        btn.className = 'px-3 py-1 rounded-lg text-sub hover:opacity-80 text-xs transition';
      }
    }
  });
  renderDrugCardsGrid(cat);
}

function openDrugDetailModal(drugId) {
  const d = AppState.drugs.find(item => item.id === drugId);
  if (!d) return;

  const modal = document.getElementById('drugDetailModal');
  const title = document.getElementById('drugModalTitle');
  const group = document.getElementById('drugModalGroup');
  const moa = document.getElementById('drugModalMoa');
  const indication = document.getElementById('drugModalIndication');
  const dose = document.getElementById('drugModalDose');
  const renal = document.getElementById('drugModalRenal');
  const warning = document.getElementById('drugModalWarning');
  const pearl = document.getElementById('drugModalPearl');

  if (title) title.textContent = d.name + ' (' + d.tradeNames + ')';
  if (group) group.textContent = d.group;
  if (moa) moa.textContent = d.moa;
  if (indication) indication.textContent = d.indication || 'Theo chỉ định của bác sĩ điều trị.';
  if (dose) dose.textContent = d.dose;
  if (renal) renal.textContent = d.renalAdjust || 'Chưa có khuyến cáo đặc biệt.';
  if (warning) warning.textContent = d.warning;
  if (pearl) pearl.textContent = d.pearl || 'Theo dõi chặt chẽ đáp ứng lâm sàng và xét nghiệm chức năng định kỳ.';

  if (modal) modal.classList.remove('hidden');
}

function closeDrugDetailModal() {
  const modal = document.getElementById('drugDetailModal');
  if (modal) modal.classList.add('hidden');
}

function openNewDrugModal() {
  document.getElementById('newDrugModal')?.classList.remove('hidden');
}

function closeNewDrugModal() {
  document.getElementById('newDrugModal')?.classList.add('hidden');
}

function openNewFlashcardModal() {
  openNewDrugModal();
}

function closeNewFlashcardModal() {
  closeNewDrugModal();
}

function saveNewDrug() {
  const name = document.getElementById('inputDrugName')?.value.trim();
  const trade = document.getElementById('inputDrugTrade')?.value.trim() || 'Generic';
  const group = document.getElementById('inputDrugGroup')?.value.trim() || 'Thuốc lâm sàng';
  const category = document.getElementById('inputDrugCategory')?.value || 'timmach';
  const moa = document.getElementById('inputDrugMoa')?.value.trim();
  const dose = document.getElementById('inputDrugDose')?.value.trim() || 'Theo phác đồ điều trị chuẩn';
  const renal = document.getElementById('inputDrugRenal')?.value.trim() || 'Xem xét chỉnh liều khi CrCl < 50 mL/phút';
  const warning = document.getElementById('inputDrugWarning')?.value.trim() || 'Thận trọng với phụ nữ có thai và suy giảm chức năng gan/thận';

  if (!name || !moa) {
    showToast('Vui lòng nhập tên thuốc và cơ chế tác dụng!');
    return;
  }

  const newDrug = {
    id: 'drug-' + Date.now(),
    name,
    tradeNames: trade,
    group,
    category,
    moa,
    dose,
    renalAdjust: renal,
    warning,
    indication: 'Được thêm bởi người dùng',
    pearl: 'Cập nhật từ tài liệu lâm sàng cá nhân.'
  };

  AppState.drugs.unshift(newDrug);
  AppState.saveToStorage('drugs');
  closeNewDrugModal();
  renderDrugCardsGrid();
  showToast(`Đã thêm hoạt chất "${name}" vào Dược điển!`);
}

// =====================================================================
// CLINICAL SOAP NOTES & CORNELL CASE MANAGER
// =====================================================================
function renderSoapView() {
  const selector = document.getElementById('soapCaseSelector');
  const sideBadge = document.getElementById('sideSoapBadge');
  if (sideBadge) sideBadge.textContent = `${AppState.soapNotes.length} ca`;

  if (!AppState.selectedSoapId && AppState.soapNotes.length > 0) {
    AppState.selectedSoapId = AppState.soapNotes[0].id;
  }

  if (selector) {
    selector.innerHTML = AppState.soapNotes.map(n => `
      <option value="${n.id}" ${n.id === AppState.selectedSoapId ? 'selected' : ''}>
        ${n.code} • ${n.patientName} (${n.diagnosisPrimary})
      </option>
    `).join('');
  }

  const note = AppState.soapNotes.find(n => n.id === AppState.selectedSoapId) || AppState.soapNotes[0];
  if (!note) return;

  // Metadata block
  const codeEl = document.getElementById('soapMetaCode');
  const diagEl = document.getElementById('soapMetaDiag');
  const lecEl = document.getElementById('soapMetaLecturer');
  const statusEl = document.getElementById('soapMetaStatus');

  if (codeEl) codeEl.textContent = `${note.code} • ${note.department}`;
  if (diagEl) diagEl.textContent = note.diagnosisPrimary;
  if (lecEl) lecEl.textContent = note.lecturer;
  if (statusEl) statusEl.textContent = `● ${note.status}`;

  // SOAP 4 Quadrants
  const sList = document.getElementById('soapDetailS');
  if (sList) {
    sList.innerHTML = note.subjective.map(s => `<li>${s}</li>`).join('');
  }

  const vitalsEl = document.getElementById('soapDetailOVitals');
  const examEl = document.getElementById('soapDetailOExam');
  const labEl = document.getElementById('soapDetailOLab');
  if (vitalsEl) vitalsEl.innerHTML = `<strong>Sinh hiệu:</strong> ${note.objective.vitals}`;
  if (examEl) examEl.innerHTML = `<strong>Khám:</strong> ${note.objective.physicalExam}`;
  if (labEl) labEl.innerHTML = `<strong>Cận lâm sàng:</strong> ${note.objective.labResults}`;

  const icdEl = document.getElementById('soapDetailAIcd');
  const aEl = document.getElementById('soapDetailA');
  if (icdEl) icdEl.textContent = `ICD-10: ${note.icd10}`;
  if (aEl) aEl.textContent = note.assessment;

  const pList = document.getElementById('soapDetailP');
  if (pList) {
    pList.innerHTML = note.plan.map(p => `<li>${p}</li>`).join('');
  }

  const cornellEl = document.getElementById('soapDetailCornell');
  if (cornellEl) cornellEl.textContent = note.cornellTakeaway;
}

function selectSoapCase(id) {
  AppState.selectedSoapId = id;
  renderSoapView();
}

function openNewSoapModal() {
  document.getElementById('newSoapModal')?.classList.remove('hidden');
}

function closeNewSoapModal() {
  document.getElementById('newSoapModal')?.classList.add('hidden');
}

function saveNewSoapCase() {
  const patient = document.getElementById('inputSoapPatient')?.value.trim();
  const age = parseInt(document.getElementById('inputSoapAge')?.value) || 30;
  const gender = document.getElementById('inputSoapGender')?.value || 'Nam';
  const dept = document.getElementById('inputSoapDept')?.value.trim() || 'Khoa Nội Tim Mạch — BV ĐHYD';
  const lecturer = document.getElementById('inputSoapLecturer')?.value.trim() || 'BS. Hướng Dẫn';
  const diag = document.getElementById('inputSoapDiagnosis')?.value.trim();
  const icd = document.getElementById('inputSoapIcd')?.value.trim() || 'I50.9';
  const sText = document.getElementById('inputSoapS')?.value.trim();
  const vitals = document.getElementById('inputSoapVitals')?.value.trim();
  const exam = document.getElementById('inputSoapExam')?.value.trim();
  const lab = document.getElementById('inputSoapLab')?.value.trim();
  const aText = document.getElementById('inputSoapA')?.value.trim();
  const pText = document.getElementById('inputSoapP')?.value.trim();
  const cornell = document.getElementById('inputSoapCornell')?.value.trim() || 'Theo dõi diễn tiến lâm sàng sát sao.';

  if (!patient || !diag || !sText || !aText) {
    showToast('Vui lòng điền đủ: Tên bệnh nhân, Chẩn đoán, Triệu chứng (S) và Biện luận (A)!');
    return;
  }

  const newCase = {
    id: 'soap-' + Date.now(),
    code: 'BA-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900),
    patientName: patient,
    age,
    gender,
    department: dept,
    date: new Date().toLocaleDateString('vi-VN'),
    lecturer,
    status: 'Sẵn sàng trình bệnh',
    diagnosisPrimary: diag,
    icd10: icd,
    subjective: sText.split('\n').filter(line => line.trim().length > 0),
    objective: {
      vitals: vitals || 'Chưa ghi nhận sinh hiệu bất thường',
      physicalExam: exam || 'Khám tổng trạng bình thường',
      labResults: lab || 'Các xét nghiệm cơ bản chưa có kết quả'
    },
    assessment: aText,
    plan: pText.split('\n').filter(line => line.trim().length > 0),
    cornellTakeaway: cornell
  };

  AppState.soapNotes.unshift(newCase);
  AppState.selectedSoapId = newCase.id;
  AppState.saveToStorage('soap');
  closeNewSoapModal();
  renderSoapView();
  showToast(`Đã lưu bệnh án "${newCase.code}"!`);
}

function printCurrentSoap() {
  window.print();
}

function copySoapMarkdown() {
  const note = AppState.soapNotes.find(n => n.id === AppState.selectedSoapId) || AppState.soapNotes[0];
  if (!note) return;

  const md = `# BỆNH ÁN LÂM SÀNG: ${note.code}
**Khoa:** ${note.department} | **Ngày:** ${note.date}
**Bệnh nhân:** ${note.patientName} (${note.gender}, ${note.age} tuổi)
**Giảng viên hướng dẫn:** ${note.lecturer}
**Chẩn đoán:** ${note.diagnosisPrimary} (ICD-10: ${note.icd10})

---

### S — SUBJECTIVE (Triệu chứng cơ năng & Bệnh sử)
${note.subjective.map(s => `- ${s}`).join('\n')}

### O — OBJECTIVE (Thực thể & Cận lâm sàng)
- **Sinh hiệu:** ${note.objective.vitals}
- **Khám thực thể:** ${note.objective.physicalExam}
- **Cận lâm sàng:** ${note.objective.labResults}

### A — ASSESSMENT (Biện luận & Chẩn đoán)
${note.assessment}

### P — PLAN (Kế hoạch điều trị & Y lệnh)
${note.plan.map(p => `- ${p}`).join('\n')}

---
**📌 Cornell Takeaway:** ${note.cornellTakeaway}
`;

  copyToClipboard(md, 'Đã copy Bệnh án dưới định dạng Markdown!');
}

// =====================================================================
// ACTIVE RECALL FLASHCARDS (CLOZE & 3D STUDY MODE)
// =====================================================================
function toggleQuickFlashcardAnswer() {
  const ans = document.getElementById('quickFlashcardAnswer');
  const btn = document.getElementById('btnRevealAnswer');
  if (!ans || !btn) return;
  const isHidden = ans.classList.toggle('hidden');
  btn.textContent = isHidden ? '👁 Hiện đáp án' : '🙈 Ẩn đáp án';
}

function nextQuickFlashcard() {
  AppState.currentFlashcardIdx = (AppState.currentFlashcardIdx + 1) % AppState.flashcards.length;
  const item = AppState.flashcards[AppState.currentFlashcardIdx];
  const qEl = document.getElementById('quickFlashcardPrompt');
  const aEl = document.getElementById('quickFlashcardAnswer');
  const idxEl = document.getElementById('flashcardIndexLabel');
  const btn = document.getElementById('btnRevealAnswer');
  if (qEl && item) qEl.textContent = item.question;
  if (aEl && item) {
    aEl.innerHTML = '✓ Đáp án: ' + item.answer;
    aEl.classList.add('hidden');
  }
  if (idxEl) idxEl.textContent = `${AppState.currentFlashcardIdx + 1} / ${AppState.flashcards.length}`;
  if (btn) btn.textContent = '👁 Hiện đáp án';
}

function renderFlashcardStudy() {
  if (AppState.flashcards.length === 0) return;
  const idx = AppState.currentFlashcardIdx;
  const card = AppState.flashcards[idx];

  const questionEl = document.getElementById('studyCardQuestion');
  const answerEl = document.getElementById('studyCardAnswer');
  const subjectEl = document.getElementById('studyCardSubject');
  const indexEl = document.getElementById('studyCardProgress');
  const innerEl = document.getElementById('studyCardInner');

  if (questionEl) questionEl.innerHTML = card.question;
  if (answerEl) answerEl.innerHTML = card.answer;
  if (subjectEl) subjectEl.textContent = 'Môn: ' + card.subject;
  if (indexEl) indexEl.textContent = `Thẻ ${idx + 1} / ${AppState.flashcards.length}`;

  AppState.flashcardFlipped = false;
  if (innerEl) innerEl.classList.remove('flipped');
}

function flipStudyCard() {
  const innerEl = document.getElementById('studyCardInner');
  if (!innerEl) return;
  AppState.flashcardFlipped = !AppState.flashcardFlipped;
  innerEl.classList.toggle('flipped', AppState.flashcardFlipped);
}

function rateFlashcard(rating) {
  const card = AppState.flashcards[AppState.currentFlashcardIdx];
  const ratingsMap = {
    again: { name: 'Chưa thuộc (R1)', toast: 'Sẽ ôn lại vào ngày mai!' },
    hard: { name: 'Khó (R2)', toast: 'Lịch ôn tiếp theo: 3 ngày tới.' },
    good: { name: 'Tốt (R3)', toast: 'Lịch ôn tiếp theo: 7 ngày tới.' },
    easy: { name: 'Thuộc lòng (R4)', toast: 'Đã thuộc! Hẹn gặp lại sau 14 ngày.' }
  };

  const choice = ratingsMap[rating] || ratingsMap.good;
  showToast(`${card.subject}: ${choice.toast}`);

  AppState.currentFlashcardIdx = (AppState.currentFlashcardIdx + 1) % AppState.flashcards.length;
  renderFlashcardStudy();
}

function nextStudyCard() {
  AppState.currentFlashcardIdx = (AppState.currentFlashcardIdx + 1) % AppState.flashcards.length;
  renderFlashcardStudy();
}

function prevStudyCard() {
  AppState.currentFlashcardIdx = (AppState.currentFlashcardIdx - 1 + AppState.flashcards.length) % AppState.flashcards.length;
  renderFlashcardStudy();
}

// =====================================================================
// CLINICAL CHECKLIST
// =====================================================================
function updateTaskCount() {
  const checks = document.querySelectorAll('#clinicalChecklist input[type="checkbox"]');
  let done = 0;
  checks.forEach(chk => {
    const span = chk.nextElementSibling;
    if (chk.checked) {
      done++;
      if (span) span.className = 'line-through text-mute leading-snug';
    } else {
      if (span) span.className = 'text-main leading-snug';
    }
  });
  const badge = document.getElementById('taskCounterBadge');
  if (badge) badge.textContent = `${done}/${checks.length} xong`;
}

// =====================================================================
// REFERENCE LAB VALUES TABLE
// =====================================================================
function renderLabValuesTable(filterCategory = 'all') {
  const tbody = document.getElementById('labValuesTableBody');
  if (!tbody) return;

  const items = NORMAL_LAB_VALUES.filter(l => filterCategory === 'all' || l.category === filterCategory);
  tbody.innerHTML = items.map(l => `
    <tr class="row-hover-theme transition border-b border-theme/60">
      <td class="py-2.5 px-3 font-semibold text-main text-xs sm:text-sm">${l.name}</td>
      <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded notion-subtle text-sub font-mono-code text-[11px]">${l.category}</span></td>
      <td class="py-2.5 px-3 font-mono-code font-bold text-main text-xs sm:text-sm">${l.value}</td>
    </tr>
  `).join('');
}

// =====================================================================
// SPOTLIGHT SEARCH (⌘K / Ctrl+K)
// =====================================================================
function openSpotlightSearch() {
  const modal = document.getElementById('spotlightModal');
  const input = document.getElementById('spotlightInput');
  if (modal) {
    modal.classList.remove('hidden');
    setTimeout(() => input?.focus(), 50);
  }
}

function closeSpotlightSearch() {
  const modal = document.getElementById('spotlightModal');
  if (modal) modal.classList.add('hidden');
}

function handleSpotlightInput(query) {
  const resultsContainer = document.getElementById('spotlightResults');
  if (!resultsContainer) return;
  const q = (query || '').trim().toLowerCase();

  if (!q) {
    resultsContainer.innerHTML = '<div class="p-6 text-center text-mute text-xs">Gõ để tìm thuốc, bệnh án, học phần hoặc công cụ tính...</div>';
    return;
  }

  const results = [];

  // Match Drugs
  AppState.drugs.forEach(d => {
    if (d.name.toLowerCase().includes(q) || d.group.toLowerCase().includes(q) || d.tradeNames.toLowerCase().includes(q)) {
      results.push({ type: '💊 Thuốc', title: d.name + ' (' + d.tradeNames + ')', desc: d.group, action: () => { switchView('drugs'); openDrugDetailModal(d.id); } });
    }
  });

  // Match Subjects
  AppState.subjects.forEach(s => {
    if (s.title.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)) {
      results.push({ type: '📚 Học phần', title: s.code + ': ' + s.title, desc: s.lecturer, action: () => { switchView('dashboard'); openSubjectModal(s.id); } });
    }
  });

  // Match SOAP Notes
  AppState.soapNotes.forEach(n => {
    if (n.patientName.toLowerCase().includes(q) || n.diagnosisPrimary.toLowerCase().includes(q) || n.code.toLowerCase().includes(q)) {
      results.push({ type: '🩺 Bệnh án', title: n.code + ': ' + n.patientName, desc: n.diagnosisPrimary, action: () => { switchView('soap'); selectSoapCase(n.id); } });
    }
  });

  // Match Calculators
  const calcs = [
    { title: 'Cockcroft-Gault (CrCl & Thận)', desc: 'Chỉnh liều kháng sinh theo chức năng lọc cầu thận' },
    { title: 'BMI & BSA (Mosteller)', desc: 'Tính chỉ số khối và diện tích da' },
    { title: 'Glasgow (GCS)', desc: 'Đánh giá mức độ hôn mê và chấn thương sọ não' },
    { title: 'CURB-65 Viêm Phổi', desc: 'Phân tầng nguy cơ viêm phổi mắc phải cộng đồng' },
    { title: 'CHA2DS2-VASc Rung Nhĩ', desc: 'Đánh giá nguy cơ đột quỵ chỉ định kháng đông' },
    { title: 'Parkland & Dịch Truyền', desc: 'Quy tắc bù dịch Ringer Lactate trong bỏng' }
  ];
  calcs.forEach(c => {
    if (c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)) {
      results.push({ type: '🧮 Máy tính', title: c.title, desc: c.desc, action: () => switchView('calculators') });
    }
  });

  if (results.length === 0) {
    resultsContainer.innerHTML = '<div class="p-6 text-center text-mute text-xs">Không tìm thấy kết quả nào phù hợp.</div>';
    return;
  }

  resultsContainer.innerHTML = results.slice(0, 8).map((r, idx) => `
    <div onclick="executeSpotlightAction(${idx})" class="p-3 rounded-xl notion-subtle hover:bg-emerald-600/10 cursor-pointer transition flex items-center justify-between">
      <div>
        <div class="text-xs font-semibold text-main">${r.title}</div>
        <div class="text-[11px] text-mute">${r.desc}</div>
      </div>
      <span class="text-[10px] font-mono-code px-2 py-0.5 rounded badge-emerald">${r.type}</span>
    </div>
  `).join('');

  window._currentSpotlightResults = results;
}

function executeSpotlightAction(idx) {
  if (window._currentSpotlightResults && window._currentSpotlightResults[idx]) {
    closeSpotlightSearch();
    window._currentSpotlightResults[idx].action();
  }
}

// Global Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    openSpotlightSearch();
  }
  if (e.key === 'Escape') {
    closeSpotlightSearch();
    closeSubjectModal();
    closeDrugDetailModal();
    closeNewDrugModal();
    closeNewSoapModal();
  }
});

// =====================================================================
// DATA BACKUP & RESTORE & AI PROMPT COPY
// =====================================================================
function copyAiMasterPrompt() {
  const box = document.getElementById('aiMasterPromptBox');
  const txt = box ? box.textContent : '';
  copyToClipboard(txt, 'Đã copy Master Prompt! Bạn có thể dán thẳng cho AI code ngay!');
}

function exportAllDataJson() {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    subjects: AppState.subjects,
    drugs: AppState.drugs,
    spacedRep: AppState.spacedRep,
    soapNotes: AppState.soapNotes,
    checklist: AppState.checklist,
    flashcards: AppState.flashcards
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MedicaOS_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Đã tải xuống file sao lưu dữ liệu MedicaOS!');
}

function importDataJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.drugs) AppState.drugs = data.drugs;
      if (data.soapNotes) AppState.soapNotes = data.soapNotes;
      if (data.checklist) AppState.checklist = data.checklist;
      if (data.spacedRep) AppState.spacedRep = data.spacedRep;
      if (data.flashcards) AppState.flashcards = data.flashcards;

      AppState.saveToStorage('drugs');
      AppState.saveToStorage('soap');
      AppState.saveToStorage('checklist');
      AppState.saveToStorage('spaced');
      AppState.saveToStorage('flashcards');

      location.reload();
    } catch (err) {
      showToast('Lỗi: File dữ liệu không đúng định dạng JSON!');
    }
  };
  reader.readAsText(file);
}

function resetAllDataToDefault() {
  if (confirm('Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu mẫu ban đầu? Những ghi chú tự tạo sẽ bị xóa.')) {
    localStorage.clear();
    location.reload();
  }
}

// =====================================================================
// TOAST NOTIFICATIONS & UTILITY
// =====================================================================
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('appToast');
  const text = document.getElementById('appToastText');
  if (!toast || !text) return;

  text.textContent = message;
  toast.classList.remove('hidden');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3600);
}

function copyToClipboard(text, message) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast(message));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(message);
  }
}

// =====================================================================
// INITIALIZATION ON DOM READY
// =====================================================================
window.addEventListener('DOMContentLoaded', () => {
  // Restore theme without toast
  setTheme(AppState.theme, false);

  // Check URL hash for direct routing (#soap, #drugs, etc.)
  const initialHash = window.location.hash.replace('#', '');
  if (['dashboard', 'soap', 'drugs', 'calculators', 'flashcards', 'library', 'tokens'].includes(initialHash)) {
    switchView(initialHash, false);
  } else {
    switchView(AppState.currentView, false);
  }

  // Initialize Views and Components
  renderSpacedRepTable();
  renderDrugCardsGrid();
  renderSoapView();
  renderFlashcardStudy();
  renderLabValuesTable();
  updatePomodoroDisplay();

  // Run quick CrCl calculation
  calcCrClQuick();
  updateTaskCount();
});
