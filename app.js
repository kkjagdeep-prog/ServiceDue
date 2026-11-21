const icon = (name, size = 16) => {
  const paths = {
    plus:     `<path d="M12 5v14M5 12h14"/>`,
    wrench:   `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
    edit:     `<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>`,
    trash:    `<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>`,
    download: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`,
    sun:      `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>`,
    moon:     `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>`,
    gauge:    `<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>`,
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ''}</svg>`;
};

/* ─── Storage ────────────────────────────────────────────────── */
const KEY = 'servicedue.v2';
const uid = () => Math.random().toString(36).slice(2, 9);

let db = (() => {
  try { return JSON.parse(localStorage.getItem(KEY)) || { vehicles: [], services: [] }; }
  catch { return { vehicles: [], services: [] }; }
})();

const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {} };

/* ─── Helpers ────────────────────────────────────────────────── */
const iso = d => d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
const today = () => iso(new Date());
const addMonths = (s, m) => { const d = new Date(s+'T00:00:00'); d.setMonth(d.getMonth()+m); return iso(d); };
const daysBetween = (a, b) => Math.round((new Date(b+'T00:00:00') - new Date(a+'T00:00:00')) / 864e5);
const fmtDate = s => new Date(s+'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
const fmtKm = n => Number(n).toLocaleString('en-IN') + ' km';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* Highlight all occurrences of a query inside text */
function highlight(text, query) {
  if (!query) return esc(text);
  const safe = esc(text);
  const safeQ = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return safe.replace(new RegExp(safeQ, 'gi'), m => `<mark>${m}</mark>`);
}

/* ─── Prediction ─────────────────────────────────────────────── */
function predict(v) {
  const svcs = db.services.filter(s => s.vid === v.id).sort((a,b) => b.date.localeCompare(a.date));
  const last = svcs[0];
  if (!last) return { status: 'none', label: 'No service logged', last: null };
  const nextKm   = last.km + v.intervalKm;
  const nextDate = addMonths(last.date, v.intervalMonths);
  const kmLeft   = nextKm - v.km;
  const daysLeft = daysBetween(today(), nextDate);
  let status = 'ok', label = 'Up to date';
  if (kmLeft <= 0 || daysLeft < 0)         { status = 'over';  label = 'Overdue'; }
  else if (kmLeft <= 500 || daysLeft <= 30) { status = 'soon';  label = 'Due soon'; }
  return { status, label, last, nextKm, nextDate, kmLeft, daysLeft };
}

/* ─── Toast ──────────────────────────────────────────────────── */
function toast(msg) {
  const wrap = document.getElementById('toast-wrap');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

/* ─── Theme ──────────────────────────────────────────────────── */
let currentTheme = localStorage.getItem('servicedue.theme') || 'auto';

function applyTheme(t) {
  currentTheme = t;
  localStorage.setItem('servicedue.theme', t);
  const root = document.documentElement;
  if (t === 'dark')       root.setAttribute('data-theme', 'dark');
  else if (t === 'light') root.setAttribute('data-theme', 'light');
  else                    root.removeAttribute('data-theme');
  const isDark = t === 'dark' || (t === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.getElementById('theme-btn').innerHTML = icon(isDark ? 'sun' : 'moon', 16);
}

applyTheme(currentTheme);
document.getElementById('theme-btn').onclick = () => {
  applyTheme({ auto: 'dark', dark: 'light', light: 'auto' }[currentTheme]);
};

/* ─── Tab navigation ─────────────────────────────────────────── */
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.setAttribute('aria-selected', 'false'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.setAttribute('aria-selected', 'true');
    document.getElementById(btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'tab-search') {
      populateSearchVehicleFilter();
      renderSearch();
    }
  };
});

/* ─── Dashboard ──────────────────────────────────────────────── */
function renderDash() {
  const dash = document.getElementById('tab-dash');
  if (!db.vehicles.length) {
    dash.innerHTML = `
      <div class="empty-state">
        <div class="empty-left">
          <div class="empty-eyebrow">${icon('gauge', 14)} Vehicle service tracker</div>
          <h2 class="empty-heading">Never miss a service again.</h2>
          <p class="empty-body">Add your vehicle, set a service interval, and log services as you go. ServiceDue tells you exactly when the next one is due.</p>
          <div class="empty-actions">
            <button class="btn btn-primary" id="empty-add">${icon('plus', 15)} Add vehicle</button>
            <button class="btn btn-ghost" id="empty-sample">Load sample data</button>
          </div>
        </div>
        <div class="empty-right">
          <div class="empty-preview-row">
            <span class="empty-preview-dot" style="background:var(--ok-rule)"></span>
            <span class="empty-preview-label">Honda Activa · TN 09 AB 1234</span>
            <span class="empty-preview-val">Up to date</span>
          </div>
          <div class="empty-preview-row">
            <span class="empty-preview-dot" style="background:var(--soon-rule)"></span>
            <span class="empty-preview-label">Hyundai i20 · TN 22 CD 5678</span>
            <span class="empty-preview-val">Due in 24 days</span>
          </div>
          <div class="empty-preview-row">
            <span class="empty-preview-dot" style="background:var(--over-rule)"></span>
            <span class="empty-preview-label">Royal Enfield · TN 07 EF 9012</span>
            <span class="empty-preview-val">Overdue 42 days</span>
          </div>
        </div>
      </div>`;
    document.getElementById('empty-add').onclick = () => openVehicleDlg();
    document.getElementById('empty-sample').onclick = loadSample;
    return;
  }

  const rows = db.vehicles.map(v => ({ v, p: predict(v) }));
  const nOver = rows.filter(r => r.p.status === 'over').length;
  const nSoon = rows.filter(r => r.p.status === 'soon').length;
  const nOk   = rows.filter(r => r.p.status === 'ok' || r.p.status === 'none').length;

  dash.innerHTML = `
    <div class="summary-bar">
      <div class="summary-label">${nOver}<span>Overdue</span></div>
      <div class="summary-divider"></div>
      <div class="summary-label">${nSoon}<span>Due soon</span></div>
      <div class="summary-divider"></div>
      <div class="summary-label">${nOk}<span>Up to date</span></div>
      <div class="summary-bar-actions">
        <button class="btn btn-primary" id="dash-add">${icon('plus', 15)} Add vehicle</button>
      </div>
    </div>
    <div class="vehicle-list" id="vehicle-list">
      ${rows.map(({ v, p }) => vehicleRow(v, p)).join('')}
    </div>`;

  document.getElementById('dash-add').onclick = () => openVehicleDlg();
  document.getElementById('vehicle-list').addEventListener('click', onVehicleAction);
}

function vehicleRow(v, p) {
  const kmText   = p.last ? (p.kmLeft > 0 ? `${fmtKm(p.kmLeft)} left` : `${fmtKm(-p.kmLeft)} over limit`) : '—';
  const daysText = p.last ? (p.daysLeft >= 0 ? `${p.daysLeft}d left` : `${-p.daysLeft}d overdue`) : '—';
  const nextKmTxt = p.last ? fmtKm(p.nextKm) : '—';
  const nextDtTxt = p.last ? fmtDate(p.nextDate) : '—';
  const lastTxt   = p.last ? `${fmtDate(p.last.date)} · ${fmtKm(p.last.km)}` : 'No services logged';

  return `
    <div class="vehicle-row ${p.status}" data-vid="${v.id}">
      <div class="vehicle-row-rule"></div>
      <div class="vehicle-row-body">
        <div>
          <div class="vehicle-number">${esc(v.number)}</div>
          <div class="vehicle-meta">${esc(v.model)} · ${esc(v.owner)} · ${esc(v.year)}</div>
          <span class="status-badge ${p.status}"><span class="status-dot"></span>${p.label}</span>
        </div>
        <div>
          <div class="stat-label">Current reading</div>
          <div class="stat-value">${fmtKm(v.km)}</div>
          <div class="stat-sub">Last service: ${lastTxt}</div>
        </div>
        <div>
          <div class="stat-label">Next service due</div>
          <div class="stat-value ${p.status}">${nextKmTxt}</div>
          <div class="stat-sub">${nextDtTxt} · ${kmText} · ${daysText}</div>
        </div>
      </div>
      <div class="vehicle-row-actions">
        <button class="btn btn-primary btn-sm" data-act="log"  data-vid="${v.id}">${icon('wrench', 13)} Log service</button>
        <button class="btn btn-ghost   btn-sm" data-act="edit" data-vid="${v.id}">${icon('edit', 13)} Edit</button>
        <button class="btn btn-danger  btn-sm" data-act="del"  data-vid="${v.id}">${icon('trash', 13)} Delete</button>
      </div>
    </div>`;
}

function onVehicleAction(e) {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const v = db.vehicles.find(x => x.id === btn.dataset.vid);
  if (!v) return;
  if (btn.dataset.act === 'log')  openServiceDlg(v);
  if (btn.dataset.act === 'edit') openVehicleDlg(v);
  if (btn.dataset.act === 'del') {
    if (!confirm(`Delete ${v.number} and all its service records?`)) return;
    db.vehicles = db.vehicles.filter(x => x.id !== v.id);
    db.services = db.services.filter(s => s.vid !== v.id);
    save(); render(); toast('Vehicle removed');
  }
}

/* ─── Service history tab ────────────────────────────────────── */
let histFilter = 'all';

function renderHist() {
  const hist = document.getElementById('tab-hist');
  const svcs = db.services
    .filter(s => histFilter === 'all' || s.vid === histFilter)
    .sort((a, b) => b.date.localeCompare(a.date));
  const getV  = id => db.vehicles.find(x => x.id === id);
  const total = svcs.reduce((t, s) => t + (+s.cost || 0), 0);

  const filterOpts = db.vehicles.map(v =>
    `<option value="${v.id}" ${histFilter === v.id ? 'selected' : ''}>${esc(v.number)}</option>`
  ).join('');

  const tableBody = svcs.length
    ? svcs.map(s => {
        const v = getV(s.vid);
        return `<tr>
          <td class="mute">${fmtDate(s.date)}</td>
          <td>${v ? `${esc(v.number)}<br><small style="color:var(--ink-faint)">${esc(v.model)}</small>` : '<em>Deleted</em>'}</td>
          <td>${fmtKm(s.km)}</td>
          <td>${esc(s.type)}</td>
          <td class="mute">${esc(s.parts) || '—'}</td>
          <td style="font-weight:600">₹${(+s.cost || 0).toLocaleString('en-IN')}</td>
          <td class="col-actions"><button class="btn btn-danger btn-sm" data-del-s="${s.id}">${icon('trash', 13)}</button></td>
        </tr>`;
      }).join('')
    : `<tr><td colspan="7" style="text-align:center;padding:var(--s5);color:var(--ink-mute)">No service records match this filter.</td></tr>`;

  hist.innerHTML = `
    <div class="hist-toolbar">
      <div class="hist-toolbar-left">
        <h2 class="hist-heading">Service history</h2>
        <select class="hist-filter" id="hist-flt">
          <option value="all">All vehicles</option>${filterOpts}
        </select>
      </div>
      <div class="hist-toolbar-right">
        <span class="hist-total">Total: <strong>₹${total.toLocaleString('en-IN')}</strong> across ${svcs.length} records</span>
        <button class="btn btn-ghost btn-sm" id="csv-btn">${icon('download', 13)} Export CSV</button>
      </div>
    </div>
    <div class="scroll-x">
      <table class="data-table">
        <thead><tr><th>Date</th><th>Vehicle</th><th>Reading</th><th>Service type</th><th>Parts replaced</th><th>Cost</th><th></th></tr></thead>
        <tbody>${tableBody}</tbody>
      </table>
    </div>`;

  document.getElementById('hist-flt').onchange = e => { histFilter = e.target.value; renderHist(); };
  document.getElementById('csv-btn').onclick = exportCsv;
  hist.querySelectorAll('[data-del-s]').forEach(btn => {
    btn.onclick = () => {
      if (!confirm('Remove this service record?')) return;
      db.services = db.services.filter(s => s.id !== btn.dataset.delS);
      save(); render(); toast('Record removed');
    };
  });
}

/* ─── Search tab ─────────────────────────────────────────────── */

// Populate the vehicle dropdown in the search filters
function populateSearchVehicleFilter() {
  const sel = document.getElementById('sf-vehicle');
  const current = sel.value;
  // Remove all options except the first "All vehicles"
  while (sel.options.length > 1) sel.remove(1);
  db.vehicles.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = `${v.number} — ${v.model}`;
    sel.appendChild(opt);
  });
  sel.value = current;
}

function getSearchParams() {
  return {
    query:   (document.getElementById('search-input').value || '').trim().toLowerCase(),
    vehicle: document.getElementById('sf-vehicle').value,
    type:    document.getElementById('sf-type').value,
    sort:    document.getElementById('sf-sort').value,
  };
}

function sortServices(svcs, sort) {
  return [...svcs].sort((a, b) => {
    if (sort === 'date-asc')  return a.date.localeCompare(b.date);
    if (sort === 'cost-desc') return (+b.cost || 0) - (+a.cost || 0);
    if (sort === 'cost-asc')  return (+a.cost || 0) - (+b.cost || 0);
    if (sort === 'km-desc')   return (+b.km || 0) - (+a.km || 0);
    return b.date.localeCompare(a.date); // date-desc default
  });
}

function serviceMatchesQuery(s, v, query) {
  if (!query) return true;
  const haystack = [
    v?.number, v?.model, v?.owner, v?.type, String(v?.year || ''),
    s.type, s.parts, s.date, String(s.km || ''), String(s.cost || ''),
  ].join(' ').toLowerCase();
  // Support multi-word: every word must appear somewhere
  return query.split(/\s+/).every(word => haystack.includes(word));
}

function renderSearch() {
  const resultsEl = document.getElementById('search-results');
  const { query, vehicle, type, sort } = getSearchParams();

  // Show prompt if nothing entered and no filters set
  if (!query && !vehicle && !type) {
    resultsEl.innerHTML = `<div class="search-prompt">Start typing to search across all repair records.</div>`;
    return;
  }

  // Filter services
  let matched = db.services.filter(s => {
    const v = db.vehicles.find(x => x.id === s.vid);
    if (vehicle && s.vid !== vehicle) return false;
    if (type    && s.type !== type)   return false;
    return serviceMatchesQuery(s, v, query);
  });

  matched = sortServices(matched, sort);

  if (!matched.length) {
    resultsEl.innerHTML = `
      <div class="search-empty">
        <strong>No results found</strong>
        Try a different keyword, vehicle number, or part name.
      </div>`;
    return;
  }

  // Group by vehicle
  const groups = {};
  matched.forEach(s => {
    if (!groups[s.vid]) groups[s.vid] = [];
    groups[s.vid].push(s);
  });

  const totalCost = matched.reduce((t, s) => t + (+s.cost || 0), 0);

  let html = `<div class="search-meta">${matched.length} record${matched.length !== 1 ? 's' : ''} found · Total cost <strong>₹${totalCost.toLocaleString('en-IN')}</strong></div>`;

  Object.entries(groups).forEach(([vid, svcs]) => {
    const v = db.vehicles.find(x => x.id === vid);
    const vName = v ? `${v.number}` : 'Deleted vehicle';
    const vSub  = v ? `${v.model} · ${v.owner} · ${v.type}` : '';

    const rows = svcs.map(s => {
      const dateH  = highlight(fmtDate(s.date), query);
      const typeH  = highlight(s.type, query);
      const partsH = highlight(s.parts || '—', query);
      const costH  = highlight(`₹${(+s.cost || 0).toLocaleString('en-IN')}`, query);

      return `<tr>
        <td class="mute">${dateH}</td>
        <td>${fmtKm(s.km)}</td>
        <td>${typeH}</td>
        <td class="mute">${partsH}</td>
        <td style="font-weight:600">${costH}</td>
      </tr>`;
    }).join('');

    html += `
      <div class="search-vehicle-group">
        <div class="search-vehicle-label">
          <div>
            <div class="search-vehicle-name">${highlight(vName, query)}</div>
            ${vSub ? `<div class="search-vehicle-sub">${highlight(vSub, query)}</div>` : ''}
          </div>
          <span class="search-match-count">${svcs.length} record${svcs.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="scroll-x">
          <table class="data-table">
            <thead><tr><th>Date</th><th>Reading</th><th>Service type</th><th>Parts replaced</th><th>Cost</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  });

  resultsEl.innerHTML = html;
}

// Wire up search input and filters
let searchTimer;
document.getElementById('search-input').addEventListener('input', e => {
  const val = e.target.value;
  document.getElementById('search-clear').classList.toggle('hide', !val);
  clearTimeout(searchTimer);
  searchTimer = setTimeout(renderSearch, 180); // debounce
});

document.getElementById('search-clear').onclick = () => {
  document.getElementById('search-input').value = '';
  document.getElementById('search-clear').classList.add('hide');
  renderSearch();
};

['sf-vehicle', 'sf-type', 'sf-sort'].forEach(id => {
  document.getElementById(id).addEventListener('change', renderSearch);
});

/* ─── CSV export ─────────────────────────────────────────────── */
function exportCsv() {
  const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const head = ['Date','Vehicle number','Model','Kilometre reading','Service type','Parts replaced','Cost (INR)'];
  const lines = db.services.map(s => {
    const v = db.vehicles.find(x => x.id === s.vid) || {};
    return [s.date, v.number, v.model, s.km, s.type, s.parts, s.cost].map(q).join(',');
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([[head.map(q).join(','), ...lines].join('\n')], { type: 'text/csv' }));
  a.download = 'servicedue-history.csv';
  a.click();
  toast('CSV downloaded');
}

/* ─── Combined render ────────────────────────────────────────── */
function render() {
  renderDash();
  renderHist();
  // Re-render search only if that tab is currently active
  if (document.getElementById('tab-search').classList.contains('active')) {
    populateSearchVehicleFilter();
    renderSearch();
  }
}

/* ─── Vehicle dialog ─────────────────────────────────────────── */
function openVehicleDlg(v) {
  const isEdit = !!v;
  document.getElementById('v-dlg-title').textContent = isEdit ? 'Edit vehicle' : 'Add vehicle';
  const f = document.getElementById('v-form');
  f.reset();
  f.vid.value = isEdit ? v.id : '';
  if (isEdit) {
    f.owner.value          = v.owner;
    f.number.value         = v.number;
    f.model.value          = v.model;
    f.vtype.value          = v.type;
    f.year.value           = v.year;
    f.km.value             = v.km;
    f.intervalKm.value     = v.intervalKm;
    f.intervalMonths.value = v.intervalMonths;
  }
  document.getElementById('v-dlg').showModal();
}

document.getElementById('v-form').onsubmit = e => {
  e.preventDefault();
  const f = e.target;
  const data = {
    owner: f.owner.value.trim(),
    number: f.number.value.trim().toUpperCase(),
    model: f.model.value.trim(),
    type: f.vtype.value,
    year: +f.year.value,
    km: +f.km.value,
    intervalKm: +f.intervalKm.value,
    intervalMonths: +f.intervalMonths.value,
  };
  if (f.vid.value) {
    Object.assign(db.vehicles.find(v => v.id === f.vid.value), data);
    toast('Vehicle updated');
  } else {
    db.vehicles.push({ id: uid(), ...data });
    toast('Vehicle added');
  }
  document.getElementById('v-dlg').close();
  save(); render();
};

/* ─── Service dialog ─────────────────────────────────────────── */
function openServiceDlg(v) {
  document.getElementById('s-dlg-title').textContent = `Log service · ${v.number}`;
  const f = document.getElementById('s-form');
  f.reset();
  f.svid.value  = v.id;
  f.sdate.value = today();
  f.skm.value   = v.km;
  document.getElementById('s-dlg').showModal();
}

document.getElementById('s-form').onsubmit = e => {
  e.preventDefault();
  const f = e.target;
  const km = +f.skm.value;
  const v = db.vehicles.find(x => x.id === f.svid.value);
  db.services.push({
    id: uid(), vid: f.svid.value, date: f.sdate.value,
    km, type: f.stype.value, parts: f.sparts.value.trim(), cost: +f.scost.value || 0,
  });
  if (v && km > v.km) v.km = km;
  document.getElementById('s-dlg').close();
  save(); render();
  toast('Service logged');
};

/* ─── Dialog close buttons ───────────────────────────────────── */
document.querySelectorAll('[data-close-dlg]').forEach(btn => {
  btn.onclick = () => btn.closest('dialog').close();
});

/* ─── Header add button ──────────────────────────────────────── */
document.getElementById('header-add').onclick = () => openVehicleDlg();

/* ─── Sample data ────────────────────────────────────────────── */
function loadSample() {
  const a = uid(), b = uid(), c = uid();
  const ago = m => addMonths(today(), -m);
  db = {
    vehicles: [
      { id:a, owner:'Arun Kumar', number:'TN 09 AB 1234', model:'Honda Activa 6G',          type:'Two-wheeler', year:2021, km:24600, intervalKm:5000,  intervalMonths:6  },
      { id:b, owner:'Meena S',    number:'TN 22 CD 5678', model:'Hyundai i20 Asta',          type:'Car',         year:2019, km:61200, intervalKm:10000, intervalMonths:12 },
      { id:c, owner:'Ravi P',     number:'TN 07 EF 9012', model:'Royal Enfield Classic 350', type:'Two-wheeler', year:2018, km:38000, intervalKm:3000,  intervalMonths:6  },
    ],
    services: [
      { id:uid(), vid:a, date:ago(4),  km:20000, type:'Regular service', parts:'Engine oil, air filter',  cost:1200 },
      { id:uid(), vid:a, date:ago(10), km:15000, type:'Oil change',       parts:'Engine oil',              cost:600  },
      { id:uid(), vid:b, date:ago(5),  km:55000, type:'Regular service', parts:'Oil filter, brake pads',  cost:6400 },
      { id:uid(), vid:b, date:ago(14), km:46000, type:'Oil change',       parts:'Engine oil, oil filter',  cost:3200 },
      { id:uid(), vid:b, date:ago(20), km:40000, type:'Brake service',    parts:'Brake pads, brake fluid', cost:4100 },
      { id:uid(), vid:c, date:ago(8),  km:33500, type:'Oil change',       parts:'Engine oil',              cost:900  },
      { id:uid(), vid:c, date:ago(16), km:29000, type:'Tyre change',      parts:'Front tyre, rear tyre',   cost:5200 },
    ],
  };
  save(); render(); toast('Sample data loaded');
}

/* ─── Init ───────────────────────────────────────────────────── */
render();
