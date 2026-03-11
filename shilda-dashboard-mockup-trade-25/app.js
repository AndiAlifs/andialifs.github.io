// ============================================================
// Shila Dashboard — app.js
// Interactive logic: navigation, rendering, state transitions
// ============================================================

// --------------- State ---------------
let currentView = 'dashboard';
let currentFilter = 'all';
let timerInterval = null;

// --------------- Navigation ---------------
function switchView(view) {
    currentView = view;

    // Toggle active nav
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.view === view);
    });

    // Toggle views
    document.querySelectorAll('.view').forEach(el => {
        el.classList.toggle('active', el.id === `view-${view}`);
    });

    // Update top bar (translated)
    const titleKeys = {
        dashboard: 'page.dashboard.title',
        queue: 'page.queue.title',
        sla: 'page.sla.title',
        eventlog: 'page.eventlog.title',
    };
    const crumbKeys = {
        dashboard: 'page.dashboard.breadcrumb',
        queue: 'page.queue.breadcrumb',
        sla: 'page.sla.breadcrumb',
        eventlog: 'page.eventlog.breadcrumb',
    };
    document.getElementById('page-title').textContent = t(titleKeys[view] || 'page.dashboard.title');
    document.getElementById('page-breadcrumb').textContent = t(crumbKeys[view] || 'page.dashboard.breadcrumb');

    // Render the active view
    renderAll();
}

// --------------- Rendering ---------------
function renderAll() {
    applyStaticTranslations();
    renderKPIs();
    renderStageChart();
    renderRecentActivity();
    renderDashboardSummary();
    renderQueue();
    renderSlaForm();
    renderEventLog();
    updateQueueBadge();
    updateLangButton();
}

function renderKPIs() {
    const data = getData();
    const sla = getSlaConfig();

    const active = data.filter(r => r.status !== 'Released').length;
    const completed = data.filter(r => r.status === 'Released').length;
    const breaches = data.filter(r => {
        const elapsed = getElapsedMinutes(r);
        return elapsed > sla.slaMaxMinutes && r.status !== 'Released';
    }).length + data.filter(r => r.status === 'Breached').length;

    // Avg processing time for released
    const releasedItems = data.filter(r => r.status === 'Released' && r.releasedAt);
    let avgTime = 0;
    if (releasedItems.length > 0) {
        const totalMin = releasedItems.reduce((sum, r) => {
            return sum + Math.round((new Date(r.releasedAt) - new Date(r.receivedAt)) / 60000);
        }, 0);
        avgTime = Math.round(totalMin / releasedItems.length);
    }

    document.getElementById('kpi-active').textContent = active;
    document.getElementById('kpi-completed').textContent = completed;
    document.getElementById('kpi-breaches').textContent = breaches;
    document.getElementById('kpi-avgtime').textContent = avgTime + 'm';
}

function renderStageChart() {
    const data = getData();
    let inboxWaits = [], draftingTimes = [], checkingTimes = [], totalTimes = [];

    data.forEach(r => {
        if (r.draftingStartedAt) {
            inboxWaits.push((new Date(r.draftingStartedAt) - new Date(r.receivedAt)) / 60000);
        }
        if (r.draftingStartedAt && r.checkingStartedAt) {
            draftingTimes.push((new Date(r.checkingStartedAt) - new Date(r.draftingStartedAt)) / 60000);
        }
        if (r.checkingStartedAt && r.releasedAt) {
            checkingTimes.push((new Date(r.releasedAt) - new Date(r.checkingStartedAt)) / 60000);
        }
        if (r.releasedAt) {
            totalTimes.push((new Date(r.releasedAt) - new Date(r.receivedAt)) / 60000);
        }
    });

    const avg = arr => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    const maxVal = 180;

    const avgInbox = avg(inboxWaits);
    const avgDraft = avg(draftingTimes);
    const avgCheck = avg(checkingTimes);
    const avgTotal = avg(totalTimes);

    setBar('bar-inbox', avgInbox, maxVal);
    setBar('bar-drafting', avgDraft, maxVal);
    setBar('bar-checking', avgCheck, maxVal);
    setBar('bar-total', avgTotal, maxVal);
}

function setBar(id, value, maxVal) {
    const el = document.getElementById(id);
    if (!el) return;
    const pct = Math.min(100, Math.max(5, (Math.abs(value) / maxVal) * 100));
    el.style.width = pct + '%';
    el.textContent = Math.abs(Math.round(value)) + ' min';
}

function renderRecentActivity() {
    const log = getEventLog().slice(0, 8);
    const tbody = document.getElementById('recent-activity-body');
    if (!tbody) return;

    if (log.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2" style="text-align:center;color:var(--text-muted);padding:2rem">${t('recent.empty')}</td></tr>`;
        return;
    }

    tbody.innerHTML = log.map(e => `
    <tr>
      <td style="white-space:nowrap;font-size:0.775rem;color:var(--text-muted)">${formatTime(e.timestamp)}</td>
      <td><strong>${e.urn}</strong> → ${e.to} <span style="color:var(--text-muted);font-size:0.75rem">by ${e.user}</span></td>
    </tr>
  `).join('');
}

function renderDashboardSummary() {
    const data = getData();
    const sla = getSlaConfig();
    const tbody = document.getElementById('dashboard-summary-body');
    if (!tbody) return;

    tbody.innerHTML = data.slice(0, 15).map(r => `
    <tr>
      <td><strong>${r.urn}</strong></td>
      <td style="font-size:0.8rem;color:var(--text-secondary)">${r.senderEmail}</td>
      <td>${statusBadge(r.status)}</td>
      <td style="font-size:0.8rem;color:var(--text-muted)">${formatTime(r.receivedAt)}</td>
      <td class="elapsed-time">${formatElapsed(r)}</td>
      <td>${slaIndicator(r, sla)}</td>
    </tr>
  `).join('');
}

// --------------- Queue ---------------
function setQueueFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.table-filters .filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderQueue();
}

function renderQueue() {
    const data = getData();
    const sla = getSlaConfig();
    const search = (document.getElementById('queue-search')?.value || '').toLowerCase();
    const tbody = document.getElementById('queue-body');
    if (!tbody) return;

    let filtered = data;
    if (currentFilter !== 'all') {
        filtered = filtered.filter(r => r.status === currentFilter);
    }
    if (search) {
        filtered = filtered.filter(r =>
            r.urn.toLowerCase().includes(search) ||
            r.senderEmail.toLowerCase().includes(search) ||
            r.subject.toLowerCase().includes(search) ||
            r.assignedTo.toLowerCase().includes(search)
        );
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:var(--text-muted);padding:2rem">${t('queue.no_records')}</td></tr>`;
    } else {
        tbody.innerHTML = filtered.map((r, i) => `
      <tr>
        <td style="color:var(--text-muted)">${i + 1}</td>
        <td><strong>${r.urn}</strong></td>
        <td style="font-size:0.8rem">${r.senderEmail}</td>
        <td style="font-size:0.8rem;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${r.subject}">${r.subject}</td>
        <td style="font-size:0.8rem">${r.assignedTo}</td>
        <td>${statusBadge(r.status)}</td>
        <td style="font-size:0.8rem;color:var(--text-muted);white-space:nowrap">${formatTime(r.receivedAt)}</td>
        <td class="elapsed-time">${formatElapsed(r)}</td>
        <td>${slaIndicator(r, sla)}</td>
        <td>${actionButton(r)}</td>
      </tr>
    `).join('');
    }

    document.getElementById('queue-count').textContent = `${t('queue.showing')} ${filtered.length} ${t('queue.of')} ${data.length} ${t('queue.records')}`;
}

function updateQueueBadge() {
    const data = getData();
    const active = data.filter(r => r.status !== 'Released').length;
    const badge = document.getElementById('queue-badge');
    if (badge) {
        badge.textContent = active;
    }
}

// --------------- SLA ---------------
function renderSlaForm() {
    const sla = getSlaConfig();
    const minEl = document.getElementById('sla-min');
    const maxEl = document.getElementById('sla-max');
    if (minEl) minEl.value = sla.slaMinMinutes;
    if (maxEl) maxEl.value = sla.slaMaxMinutes;
}

function handleSaveSla() {
    const slaMin = parseInt(document.getElementById('sla-min').value) || 90;
    const slaMax = parseInt(document.getElementById('sla-max').value) || 120;
    saveSlaConfig({ slaMinMinutes: slaMin, slaMaxMinutes: slaMax });
    showToast('success', t('toast.sla_saved'));
    renderAll();
}

function handleResetSla() {
    saveSlaConfig({ slaMinMinutes: 90, slaMaxMinutes: 120 });
    renderSlaForm();
    showToast('info', t('toast.sla_reset'));
    renderAll();
}

// --------------- Event Log ---------------
function renderEventLog() {
    const log = getEventLog();
    const tbody = document.getElementById('eventlog-body');
    if (!tbody) return;

    if (log.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:2rem">${t('eventlog.empty')}</td></tr>`;
    } else {
        tbody.innerHTML = log.map(e => `
      <tr>
        <td style="white-space:nowrap;font-size:0.8rem">${formatDateTime(e.timestamp)}</td>
        <td><strong>${e.urn}</strong></td>
        <td style="font-size:0.8rem">${e.user}</td>
        <td style="font-size:0.8rem">${e.action}</td>
        <td>${statusBadge(e.from)}</td>
        <td>${statusBadge(e.to)}</td>
        <td style="font-size:0.8rem;color:var(--text-muted)">${e.notes || '—'}</td>
      </tr>
    `).join('');
    }

    document.getElementById('eventlog-count').textContent = `${log.length} ${t('eventlog.events')}`;
}

function clearEventLog() {
    localStorage.removeItem('shila_event_log');
    renderEventLog();
    showToast('info', t('toast.log_cleared'));
}

// --------------- Actions ---------------
function handleAction(id, action) {
    const data = getData();
    const record = data.find(r => r.id === id);
    if (!record) return;

    const prevStatus = record.status;
    let newStatus = '';
    let notes = '';

    switch (action) {
        case 'start-drafting':
            record.status = 'Drafting';
            record.draftingStartedAt = new Date().toISOString();
            newStatus = 'Drafting';
            notes = t('note.start_drafting');
            break;
        case 'start-checking':
            record.status = 'Checking Underlying';
            record.checkingStartedAt = new Date().toISOString();
            newStatus = 'Checking Underlying';
            notes = t('note.start_checking');
            break;
        case 'release':
            record.status = 'Released';
            record.releasedAt = new Date().toISOString();
            newStatus = 'Released';
            notes = t('note.release');
            break;
        default:
            return;
    }

    saveData(data);
    addEventLog({
        urn: record.urn,
        user: record.assignedTo,
        action: action.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        from: prevStatus,
        to: newStatus,
        notes: notes,
    });

    showToast('success', `${record.urn} → ${newStatus}`);
    renderAll();
}

function handleReset() {
    if (!confirm(t('toast.confirm_reset'))) return;
    resetAllData();
    renderAll();
    showToast('info', t('toast.data_reset'));
}

// --------------- HTML Builders ---------------
function statusBadge(status) {
    const cls = {
        'Received': 'received',
        'Drafting': 'drafting',
        'Checking Underlying': 'checking',
        'Released': 'released',
        'Breached': 'breached',
    }[status] || 'received';

    return `<span class="status-badge ${cls}"><span class="dot"></span>${status}</span>`;
}

function slaIndicator(record, sla) {
    if (record.status === 'Released') {
        const total = Math.round((new Date(record.releasedAt) - new Date(record.receivedAt)) / 60000);
        if (total <= sla.slaMinMinutes) return `<span class="sla-indicator green">✓ ${total}m</span>`;
        if (total <= sla.slaMaxMinutes) return `<span class="sla-indicator yellow">⚠ ${total}m</span>`;
        return `<span class="sla-indicator red">✗ ${total}m</span>`;
    }

    const elapsed = getElapsedMinutes(record);
    if (elapsed <= sla.slaMinMinutes) return `<span class="sla-indicator green">✓ ${t('sla.ok')}</span>`;
    if (elapsed <= sla.slaMaxMinutes) return `<span class="sla-indicator yellow">⚠ ${t('sla.warning')}</span>`;
    return `<span class="sla-indicator red">✗ ${t('sla.breach')}</span>`;
}

function actionButton(record) {
    switch (record.status) {
        case 'Received':
            return `<button class="action-btn primary" onclick="handleAction(${record.id}, 'start-drafting')">${t('action.start_drafting')}</button>`;
        case 'Drafting':
            return `<button class="action-btn warning" onclick="handleAction(${record.id}, 'start-checking')">${t('action.start_checking')}</button>`;
        case 'Checking Underlying':
            return `<button class="action-btn success" onclick="handleAction(${record.id}, 'release')">${t('action.release')}</button>`;
        case 'Released':
            return `<span class="action-btn completed">${t('action.completed')}</span>`;
        case 'Breached':
            return `<button class="action-btn primary" onclick="handleAction(${record.id}, 'start-drafting')">${t('action.resume')}</button>`;
        default:
            return '';
    }
}

// --------------- Utilities ---------------
function getElapsedMinutes(record) {
    if (record.status === 'Released' && record.releasedAt) {
        return Math.round((new Date(record.releasedAt) - new Date(record.receivedAt)) / 60000);
    }
    return Math.round((Date.now() - new Date(record.receivedAt)) / 60000);
}

function formatElapsed(record) {
    const mins = getElapsedMinutes(record);
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
}

function formatTime(isoStr) {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(isoStr) {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    return d.toLocaleString('en-GB', {
        day: '2-digit', month: 'short',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
}

// --------------- Toast ---------------
function showToast(type, message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
    <div class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</div>
    <span>${message}</span>
  `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('leaving');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --------------- Clock ---------------
function updateClock() {
    const el = document.getElementById('clock');
    if (el) {
        el.textContent = new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        });
    }
}

// --------------- Live Elapsed Timers ---------------
function startLiveTimers() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        // Update elapsed times in visible tables
        if (currentView === 'dashboard') {
            renderKPIs();
            // Only update elapsed cells, not full re-render
        }
        if (currentView === 'queue') {
            renderQueue();
        }
        updateClock();
    }, 30000); // every 30 seconds

    // Clock updates every second
    setInterval(updateClock, 1000);
}

// --------------- Init ---------------
document.addEventListener('DOMContentLoaded', () => {
    // Apply saved language on load
    applyStaticTranslations();
    updateLangButton();

    // Set initial page title/breadcrumb from translations
    document.getElementById('page-title').textContent = t('page.dashboard.title');
    document.getElementById('page-breadcrumb').textContent = t('page.dashboard.breadcrumb');

    renderAll();
    updateClock();
    startLiveTimers();
});
