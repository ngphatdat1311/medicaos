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
  const views = ['dashboard', 'soap', 'drugs', 'calculators', 'flashcards', 'library'];

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
        sideBtn.className = 'w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold notion-surface text-main transition shadow-sm';
      } else {
        sideBtn.className = 'w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-sub hover:opacity-80 transition';
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
  if (['dashboard', 'soap', 'drugs', 'calculators', 'flashcards', 'library'].includes(hash)) {
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
  const sideDisp = document.getElementById('sidePomoDisplay');
  if (disp) disp.textContent = str;
  if (sideDisp) sideDisp.textContent = str;

  // Title tag update
  if (AppState.pomoRunning) {
    document.title = `(${str}) MedicaOS — Học Y Dược`;
  } else {
    document.title = `MedicaOS — Website Học Tập & Bệnh Án Y Dược`;
  }

  // Update session counter
  const counterEl = document.getElementById('pomoSessionCounter');
  if (counterEl) {
    counterEl.textContent = `${AppState.pomoCompletedCount}/12 phiên (${(AppState.pomoCompletedCount * 0.4).toFixed(1)}h)`;
  }
}

function togglePomodoro() {
  const btn = document.getElementById('pomoToggleBtn');
  if (AppState.pomoRunning) {
    clearInterval(AppState.pomoInterval);
    AppState.pomoRunning = false;
    if (btn) btn.textContent = 'Tiếp tục học';
  } else {
    AppState.pomoRunning = true;
    if (btn) btn.textContent = 'Tạm dừng';
    AppState.pomoInterval = setInterval(() => {
      if (AppState.pomoTimeLeft > 0) {
        AppState.pomoTimeLeft--;
        updatePomodoroDisplay();
      } else {
        clearInterval(AppState.pomoInterval);
        AppState.pomoRunning = false;
        AppState.pomoCompletedCount++;
        AppState.saveToStorage('pomo');
        if (btn) btn.textContent = 'Bắt đầu';
        medicalAudio.playCompletionChime();
        showToast('🎉 Chúc mừng! Bạn vừa hoàn thành 1 phiên học Pomodoro!');
        resetPomodoro(5 * 60, 'Nghỉ ngắn 5m');
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
function calcQuickCrCl() {
  const age = parseFloat(document.getElementById('quickCrclAge')?.value) || 0;
  const weight = parseFloat(document.getElementById('quickCrclWeight')?.value) || 0;
  const scr = parseFloat(document.getElementById('quickCrclScr')?.value) || 0;
  const isFemale = document.getElementById('quickCrclFemale')?.checked;
  const out = document.getElementById('quickCrclResult');

  if (!out) return;
  if (age <= 0 || weight <= 0 || scr <= 0) {
    out.textContent = '-- mL/phút';
    return;
  }

  let crcl = ((140 - age) * weight) / (72 * scr);
  if (isFemale) crcl *= 0.85;

  out.textContent = crcl.toFixed(1) + ' mL/phút';
}

// =====================================================================
// SUBJECT GALLERY & MODAL
// =====================================================================
function renderSubjects(category = 'all', searchQuery = '') {
  const container = document.getElementById('subjectGalleryGrid');
  if (!container) return;

  const query = searchQuery.trim().toLowerCase();
  const filtered = AppState.subjects.filter(sub => {
    const matchCat = category === 'all' || sub.category === category;
    const matchQuery = !query ||
      sub.title.toLowerCase().includes(query) ||
      sub.code.toLowerCase().includes(query) ||
      sub.tags.some(t => t.toLowerCase().includes(query));
    return matchCat && matchQuery;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="col-span-2 p-8 text-center text-mute text-xs">Không tìm thấy học phần nào phù hợp với từ khóa.</div>';
    return;
  }

  container.innerHTML = filtered.map(sub => `
    <div onclick="openSubjectModal('${sub.id}')" class="group relative rounded-2xl notion-surface overflow-hidden hover:shadow-lg transition cursor-pointer flex flex-col justify-between">
      <div class="h-32 sm:h-36 overflow-hidden relative">
        <img src="${sub.image}" alt="${sub.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span class="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded bg-white/90 text-slate-900 shadow-sm">${sub.code}</span>
          <span class="text-[10px] font-mono-code px-2 py-0.5 rounded-full ${sub.status === 'Trọng tâm thi' ? 'badge-rose' : 'badge-emerald'}">${sub.status}</span>
        </div>
        <div class="absolute bottom-2 left-2.5 right-2.5 text-white">
          <div class="text-[11px] opacity-80">${sub.lecturer} • ${sub.credits} tín chỉ</div>
          <h3 class="font-editorial text-lg sm:text-xl font-medium leading-snug truncate">${sub.title}</h3>
        </div>
      </div>
      <div class="p-3.5 space-y-2.5">
        <p class="text-xs text-sub line-clamp-2 leading-relaxed">${sub.summary}</p>
        <div class="space-y-1">
          <div class="flex justify-between text-[11px] font-mono-code text-mute">
            <span>Tiến độ học tập</span>
            <span class="font-semibold text-main">${sub.progress}%</span>
          </div>
          <div class="w-full h-1.5 rounded-full bg-black/10 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500" style="width: ${sub.progress}%; background-color: var(--accent-primary);"></div>
          </div>
        </div>
        <div class="flex flex-wrap gap-1 pt-1">
          ${sub.tags.map(t => `<span class="text-[10px] font-mono-code px-2 py-0.5 rounded notion-subtle text-sub">#${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function filterSubjectCategory(cat) {
  ['all', 'y', 'duoc'].forEach(c => {
    const btn = document.getElementById('subCatBtn_' + c);
    if (btn) {
      if (c === cat) {
        btn.className = 'px-3 py-1 rounded-lg notion-surface font-semibold text-main text-xs transition';
      } else {
        btn.className = 'px-3 py-1 rounded-lg text-sub hover:opacity-80 text-xs transition';
      }
    }
  });
  renderSubjects(cat);
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
  const filterVal = document.getElementById('spacedRepFilter')?.value || 'all';
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
      <tr class="row-hover-theme transition border-b border-theme/60">
        <td class="py-3 px-3 font-semibold text-main text-xs sm:text-sm">${item.title}</td>
        <td class="py-3 px-3"><span class="px-2 py-0.5 rounded notion-subtle text-sub font-mono-code text-[11px]">${item.subject}</span></td>
        <td class="py-3 px-3"><span class="px-2.5 py-0.5 rounded-full font-mono-code text-[11px] font-semibold ${badgeClass}">● ${item.status}</span></td>
        <td class="py-3 px-3 font-mono-code text-sub text-xs">Chu kỳ R${item.cycle}</td>
        <td class="py-3 px-3 font-mono-code font-semibold text-main text-xs">${item.nextDate}</td>
        <td class="py-3 px-3 text-right">
          <button onclick="reviewSpacedTopic(${item.id})" class="px-3 py-1 rounded-xl notion-subtle hover:opacity-80 text-main font-mono-code text-[11px] transition">
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
  showToast(`Đã ghi nhận ôn R${item.cycle} cho "${item.title}" (+${days} ngày)!`);
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
    <div onclick="openDrugDetailModal('${d.id}')" class="p-4 rounded-2xl notion-surface space-y-3 flex flex-col justify-between hover:shadow-md transition cursor-pointer">
      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[10px] font-mono-code px-2 py-0.5 rounded-full notion-subtle text-sub truncate max-w-[200px]">${d.group}</span>
          <span class="text-sm">💊</span>
        </div>
        <h3 class="font-editorial text-2xl text-main">${d.name}</h3>
        <p class="text-[11px] text-mute font-mono-code">Biệt dược: ${d.tradeNames}</p>
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
  const listContainer = document.getElementById('soapCasesList');
  const headingEl = document.getElementById('soapCasesHeading');
  if (!listContainer) return;

  if (headingEl) {
    headingEl.textContent = `Danh Sách Ca Bệnh (${AppState.soapNotes.length})`;
  }

  if (!AppState.selectedSoapId && AppState.soapNotes.length > 0) {
    AppState.selectedSoapId = AppState.soapNotes[0].id;
  }

  // Render list of cases
  listContainer.innerHTML = AppState.soapNotes.map(note => {
    const isSelected = note.id === AppState.selectedSoapId;
    return `
      <div onclick="selectSoapCase('${note.id}')" class="p-3.5 rounded-xl cursor-pointer transition ${isSelected ? 'notion-surface ring-2 ring-emerald-600/70 shadow-sm' : 'notion-subtle hover:opacity-80'}">
        <div class="flex items-center justify-between text-[11px] font-mono-code mb-1">
          <span class="font-bold text-main">${note.code}</span>
          <span class="px-2 py-0.5 rounded-full badge-amber font-semibold">${note.status}</span>
        </div>
        <div class="text-xs font-semibold text-main truncate">${note.patientName} (${note.age}t, ${note.gender})</div>
        <div class="text-[11px] text-mute truncate">${note.department}</div>
      </div>
    `;
  }).join('');

  renderActiveSoapDetail();
}

function selectSoapCase(id) {
  AppState.selectedSoapId = id;
  renderSoapView();
}

function renderActiveSoapDetail() {
  const note = AppState.soapNotes.find(n => n.id === AppState.selectedSoapId);
  const container = document.getElementById('soapActiveDetailContainer');
  if (!container || !note) return;

  container.innerHTML = `
    <!-- Case Header & Actions -->
    <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-theme">
      <div>
        <div class="text-[11px] font-mono-code text-mute uppercase">${note.department} • ${note.date}</div>
        <h2 class="font-editorial text-2xl sm:text-3xl text-main mt-0.5">${note.code}: ${note.patientName} (${note.gender}, ${note.age} tuổi)</h2>
        <div class="text-xs text-sub mt-0.5">Giảng viên / Bác sĩ hướng dẫn: <strong class="text-main">${note.lecturer}</strong></div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="printCurrentSoap()" class="px-3 py-1.5 rounded-xl text-xs font-mono-code notion-subtle text-main hover:opacity-80 transition flex items-center gap-1.5">
          <span>🖨 In / PDF</span>
        </button>
        <button onclick="copySoapMarkdown()" class="px-3 py-1.5 rounded-xl text-xs font-mono-code notion-subtle text-main hover:opacity-80 transition flex items-center gap-1.5">
          <span>📋 Copy Markdown</span>
        </button>
        <button onclick="openNewSoapModal()" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold btn-primary-theme transition flex items-center gap-1.5">
          <span>+ Bệnh án mới</span>
        </button>
      </div>
    </div>

    <!-- Properties Summary -->
    <div class="p-4 rounded-2xl notion-surface grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
      <div>
        <div class="text-[10px] font-mono-code uppercase text-mute">Chẩn đoán sơ bộ</div>
        <div class="font-semibold text-main mt-0.5 line-clamp-2">${note.diagnosisPrimary}</div>
      </div>
      <div>
        <div class="text-[10px] font-mono-code uppercase text-mute">Mã ICD-10</div>
        <div class="font-mono-code text-xs text-main mt-0.5 font-bold">${note.icd10}</div>
      </div>
      <div>
        <div class="text-[10px] font-mono-code uppercase text-mute">Thời điểm ghi nhận</div>
        <div class="font-mono-code text-xs text-main mt-0.5">${note.date}</div>
      </div>
      <div>
        <div class="text-[10px] font-mono-code uppercase text-mute">Trạng thái duyệt</div>
        <div class="font-mono-code text-[11px] inline-block px-2 py-0.5 rounded-full badge-amber font-semibold mt-0.5">${note.status}</div>
      </div>
    </div>

    <!-- SOAP 4-QUADRANT MATRIX -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- S: Subjective -->
      <div class="p-5 rounded-2xl notion-surface space-y-2.5 border-t-4" style="border-top-color: var(--accent-primary);">
        <div class="flex items-center justify-between">
          <span class="font-editorial text-2xl text-main">S — Subjective (Cơ năng & Bệnh sử)</span>
          <span class="text-[10px] font-mono-code px-2 py-0.5 rounded notion-subtle">Hỏi bệnh</span>
        </div>
        <ul class="text-xs text-sub space-y-1.5 list-disc pl-4 leading-relaxed">
          ${note.subjective.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>

      <!-- O: Objective -->
      <div class="p-5 rounded-2xl notion-surface space-y-2.5 border-t-4" style="border-top-color: var(--accent-secondary);">
        <div class="flex items-center justify-between">
          <span class="font-editorial text-2xl text-main">O — Objective (Thực thể & Labo)</span>
          <span class="text-[10px] font-mono-code px-2 py-0.5 rounded notion-subtle">Khám & CLS</span>
        </div>
        <div class="space-y-2 text-xs leading-relaxed">
          <div class="p-2.5 rounded-xl notion-subtle font-mono-code text-[11px] text-main">
            <strong>Sinh hiệu:</strong> ${note.objective.vitals}
          </div>
          <div><strong class="text-main">Khám thực thể:</strong> <span class="text-sub">${note.objective.physicalExam}</span></div>
          <div><strong class="text-main">Cận lâm sàng:</strong> <span class="text-sub">${note.objective.labResults}</span></div>
        </div>
      </div>

      <!-- A: Assessment -->
      <div class="p-5 rounded-2xl notion-surface space-y-2.5 border-t-4" style="border-top-color: var(--accent-gold);">
        <div class="flex items-center justify-between">
          <span class="font-editorial text-2xl text-main">A — Assessment (Biện luận & Chẩn đoán)</span>
          <span class="text-[10px] font-mono-code px-2 py-0.5 rounded notion-subtle">ICD-10: ${note.icd10}</span>
        </div>
        <p class="text-xs text-sub leading-relaxed">${note.assessment}</p>
      </div>

      <!-- P: Plan -->
      <div class="p-5 rounded-2xl notion-surface space-y-2.5 border-t-4" style="border-top-color: #059669;">
        <div class="flex items-center justify-between">
          <span class="font-editorial text-2xl text-main">P — Plan (Y lệnh & Phác đồ điều trị)</span>
          <span class="text-[10px] font-mono-code px-2 py-0.5 rounded notion-subtle">Y lệnh</span>
        </div>
        <ul class="text-xs text-sub space-y-1.5 list-disc pl-4 leading-relaxed">
          ${note.plan.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>
    </div>

    <!-- Cornell Summary Takeaway -->
    <div class="p-5 rounded-2xl notion-callout space-y-2 border-l-4" style="border-left-color: var(--accent-primary);">
      <div class="text-xs font-mono-code uppercase text-mute">📌 Tóm Tắt Cornell Lâm Sàng (Key Takeaway Khi Trình Bệnh)</div>
      <p class="text-xs sm:text-sm text-main leading-relaxed font-medium">
        ${note.cornellTakeaway}
      </p>
    </div>
  `;
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
  const dept = document.getElementById('inputSoapDept')?.value.trim() || 'Khoa Nội Tổng Quát';
  const lecturer = document.getElementById('inputSoapLecturer')?.value.trim() || 'BS. Hướng Dẫn';
  const diag = document.getElementById('inputSoapDiagnosis')?.value.trim();
  const icd = document.getElementById('inputSoapIcd')?.value.trim() || 'R69';
  const sText = document.getElementById('inputSoapS')?.value.trim();
  const vitals = document.getElementById('inputSoapVitals')?.value.trim();
  const exam = document.getElementById('inputSoapExam')?.value.trim();
  const lab = document.getElementById('inputSoapLab')?.value.trim();
  const aText = document.getElementById('inputSoapA')?.value.trim();
  const pText = document.getElementById('inputSoapP')?.value.trim();
  const cornell = document.getElementById('inputSoapCornell')?.value.trim() || 'Theo dõi diễn tiến lâm sàng sát sao.';

  if (!patient || !diag || !sText || !aText) {
    showToast('Vui lòng điền đủ: Tên bệnh nhân, Chẩn đoán, Triệu chứng cơ năng (S) và Biện luận (A)!');
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
    status: 'Bản thảo sinh viên',
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
  const note = AppState.soapNotes.find(n => n.id === AppState.selectedSoapId);
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
// ACTIVE RECALL FLASHCARDS (3D FLIP STUDY MODE)
// =====================================================================
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

  // Reset flip to front
  AppState.flashcardFlipped = false;
  if (innerEl) innerEl.classList.remove('flipped');

  // Render quick flip on Dashboard too
  renderQuickFlashcardDashboard();
}

function flipStudyCard() {
  const innerEl = document.getElementById('studyCardInner');
  if (!innerEl) return;
  AppState.flashcardFlipped = !AppState.flashcardFlipped;
  innerEl.classList.toggle('flipped', AppState.flashcardFlipped);
}

function rateFlashcard(rating) {
  // Spaced repetition progression
  const card = AppState.flashcards[AppState.currentFlashcardIdx];
  const ratingsMap = {
    again: { name: 'Chưa thuộc (R1)', days: 1, toast: 'Sẽ ôn lại vào ngày mai!' },
    hard: { name: 'Khó (R2)', days: 3, toast: 'Lịch ôn tiếp theo: 3 ngày tới.' },
    good: { name: 'Tốt (R3)', days: 7, toast: 'Lịch ôn tiếp theo: 7 ngày tới.' },
    easy: { name: 'Thuộc lòng (R4)', days: 14, toast: 'Đã thuộc! Hẹn gặp lại sau 14 ngày.' }
  };

  const choice = ratingsMap[rating] || ratingsMap.good;
  showToast(`${card.subject}: ${choice.toast}`);

  // Move to next card
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

function renderQuickFlashcardDashboard() {
  const card = AppState.flashcards[AppState.currentFlashcardIdx];
  const qEl = document.getElementById('quickFlashcardPrompt');
  const aEl = document.getElementById('quickFlashcardAnswer');
  const idxEl = document.getElementById('quickFlashcardIndex');
  const btn = document.getElementById('quickRevealBtn');

  if (qEl && card) qEl.textContent = card.question;
  if (aEl && card) {
    aEl.innerHTML = card.answer;
    aEl.classList.add('hidden');
  }
  if (idxEl) idxEl.textContent = `${AppState.currentFlashcardIdx + 1} / ${AppState.flashcards.length}`;
  if (btn) btn.textContent = '👁 Hiện đáp án';
}

function toggleQuickDashboardAnswer() {
  const aEl = document.getElementById('quickFlashcardAnswer');
  const btn = document.getElementById('quickRevealBtn');
  if (!aEl || !btn) return;
  const isHidden = aEl.classList.toggle('hidden');
  btn.textContent = isHidden ? '👁 Hiện đáp án' : '🙈 Ẩn đáp án';
}

function nextQuickDashboardCard() {
  AppState.currentFlashcardIdx = (AppState.currentFlashcardIdx + 1) % AppState.flashcards.length;
  renderQuickFlashcardDashboard();
}

// =====================================================================
// CLINICAL CHECKLIST
// =====================================================================
function renderChecklist() {
  const container = document.getElementById('clinicalChecklist');
  const badge = document.getElementById('taskCounterBadge');
  if (!container) return;

  const doneCount = AppState.checklist.filter(item => item.done).length;
  if (badge) badge.textContent = `${doneCount}/${AppState.checklist.length} xong`;

  container.innerHTML = AppState.checklist.map(item => `
    <label class="flex items-center justify-between p-2 rounded-xl notion-subtle cursor-pointer hover:opacity-90 transition group">
      <div class="flex items-center gap-2.5 min-w-0">
        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleChecklistItem(${item.id})" class="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer" />
        <span class="text-xs truncate ${item.done ? 'line-through text-mute' : 'text-main'}">${item.text}</span>
      </div>
      <button onclick="deleteChecklistItem(${item.id}); event.preventDefault();" class="opacity-0 group-hover:opacity-100 text-mute hover:text-rose-500 text-xs px-1.5 transition">✕</button>
    </label>
  `).join('');
}

function toggleChecklistItem(id) {
  const item = AppState.checklist.find(i => i.id === id);
  if (item) {
    item.done = !item.done;
    AppState.saveToStorage('checklist');
    renderChecklist();
  }
}

function addChecklistItem() {
  const input = document.getElementById('newChecklistInput');
  const text = input?.value.trim();
  if (!text) return;

  AppState.checklist.push({
    id: Date.now(),
    text,
    done: false
  });
  input.value = '';
  AppState.saveToStorage('checklist');
  renderChecklist();
  showToast('Đã thêm mục mới vào checklist!');
}

function deleteChecklistItem(id) {
  AppState.checklist = AppState.checklist.filter(i => i.id !== id);
  AppState.saveToStorage('checklist');
  renderChecklist();
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
// DATA BACKUP & RESTORE
// =====================================================================
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
  // Restore theme without initial toast
  setTheme(AppState.theme, false);

  // Check URL hash for direct routing (#soap, #drugs, etc.)
  const initialHash = window.location.hash.replace('#', '');
  if (['dashboard', 'soap', 'drugs', 'calculators', 'flashcards', 'library'].includes(initialHash)) {
    switchView(initialHash, false);
  } else {
    switchView(AppState.currentView, false);
  }

  // Initialize Views and Components
  renderSubjects();
  renderSpacedRepTable();
  renderDrugCardsGrid();
  renderChecklist();
  renderSoapView();
  renderFlashcardStudy();
  renderLabValuesTable();
  updatePomodoroDisplay();

  // Run quick CrCl calculation
  calcQuickCrCl();
});
