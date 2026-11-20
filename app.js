const KEY = 'servicedue.v1';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const fmtKm = n => Number(n).toLocaleString('en-IN') + ' km';
const fmtDate = s => new Date(s + 'T00:00:00').toLocaleDateString('en-IN',
  { day: 'numeric', month: 'short', year: 'numeric' });
const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const today = () => iso(new Date());
const addMonths = (s, m) => { const d = new Date(s + 'T00:00:00'); d.setMonth(d.getMonth() + m); return iso(d); };
const daysBetween = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5);

let db = load();

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { vehicles: [], services: [] }; }
  catch (e) { return { vehicles: [], services: [] }; }
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {}
}

/* ── Service due prediction ── */
function predict(v) {
  const list = db.services.filter(s => s.vid === v.id).sort((a, b) => b.date.localeCompare(a.date));
  const last = list[0];
  if (!last) return { status: 'none', label: 'No service logged' };
  const nextKm = last.km + v.intervalKm;
  const nextDate = addMonths(last.date, v.intervalMonths);
  const kmLeft = nextKm - v.km;
  const daysLeft = daysBetween(today(), nextDate);
  let status = 'ok', label = 'Not due';
  if (kmLeft <= 0 || daysLeft < 0)   { status = 'over'; label = 'Overdue'; }
  else if (kmLeft <= 500 || daysLeft <= 30) { status = 'soon'; label = 'Due soon'; }
  return { status, label, last, nextKm, nextDate, kmLeft, daysLeft };
}

/* ── Vehicles tab ── */
function renderDash() {
  const el = $('#dash');
  if (!db.vehicles.length) {
    el.innerHTML = `<div class="empty">
      <p>No vehicles yet. Add your first vehicle to start tracking service dates.</p>
      <button class="btn" id="e1">Add vehicle</button>
      <button class="btn ghost" id="e2">Try sample data</button>
    </div>`;
    $('#e1').onclick = () => openVehicle();
    $('#e2').onclick = sample;
    return;
  }
  const P = db.vehicles.map(v => ({ v, p: predict(v) }));
  const n = k => P.filter(x => x.p.status === k).length;
  el.innerHTML =
    `<p class="summary">
      <span><b>${n('over')}</b>overdue</span>
      <span><b>${n('soon')}</b>due soon</span>
      <span><b>${n('ok')}</b>not due</span>
    </p>` +
    P.map(({ v, p }) => {
      const next = p.last
        ? `<dt>Next service</dt><dd>at ${fmtKm(p.nextKm)} or by ${fmtDate(p.nextDate)}</dd>`
        : `<dt>Next service</dt><dd>Log a service to see this</dd>`;
      const left = p.last
        ? `<dt>Remaining</dt><dd>${p.kmLeft > 0 ? fmtKm(p.kmLeft) + ' left' : fmtKm(-p.kmLeft) + ' over'} · ${p.daysLeft >= 0 ? p.daysLeft + ' days left' : (-p.daysLeft) + ' days over'}</dd>`
        : '';
      return `<article class="card ${p.status}">
        <div class="row">
          <div>
            <h2>${esc(v.model)} · ${esc(v.number)}</h2>
            <div class="sub">${esc(v.owner)} · ${esc(v.type)} · ${esc(v.year)}</div>
          </div>
          <span class="chip ${p.status}">${p.label}</span>
        </div>
        <dl class="facts">
          <div><dt>Current reading</dt><dd>${fmtKm(v.km)}</dd></div>
          <div>${next}</div>
          ${left ? `<div>${left}</div>` : ''}
          <div><dt>Last service</dt><dd>${p.last ? fmtDate(p.last.date) + ' at ' + fmtKm(p.last.km) : 'None yet'}</dd></div>
        </dl>
        <div class="acts">
          <button class="btn sm" data-act="log"  data-id="${v.id}">Log service</button>
          <button class="btn sm ghost" data-act="edit" data-id="${v.id}">Edit vehicle</button>
          <button class="btn sm ghost danger" data-act="del" data-id="${v.id}">Delete</button>
        </div>
      </article>`;
    }).join('');
}

/* ── Service history tab ── */
let filter = 'all';

function renderHist() {
  const el = $('#hist');
  const rows = db.services
    .filter(s => filter === 'all' || s.vid === filter)
    .sort((a, b) => b.date.localeCompare(a.date));
  const name = id => { const v = db.vehicles.find(x => x.id === id); return v ? esc(v.number) : 'Deleted vehicle'; };
  const total = rows.reduce((t, s) => t + (+s.cost || 0), 0);
  el.innerHTML =
    `<div class="bar">
      <label style="margin:0">Vehicle
        <select id="flt">
          <option value="all">All vehicles</option>
          ${db.vehicles.map(v => `<option value="${v.id}" ${filter === v.id ? 'selected' : ''}>${esc(v.number)}</option>`).join('')}
        </select>
      </label>
      <div>
        <strong>Total spent: ₹${total.toLocaleString('en-IN')}</strong>
        <button class="btn sm ghost" id="csv">Download CSV</button>
      </div>
    </div>` +
    (rows.length
      ? `<div class="scroll"><table>
          <thead><tr><th>Date</th><th>Vehicle</th><th>Reading</th><th>Type</th><th>Parts</th><th>Cost</th><th></th></tr></thead>
          <tbody>${rows.map(s => `<tr>
            <td>${fmtDate(s.date)}</td>
            <td>${name(s.vid)}</td>
            <td>${fmtKm(s.km)}</td>
            <td>${esc(s.type)}</td>
            <td>${esc(s.parts) || '–'}</td>
            <td>₹${(+s.cost || 0).toLocaleString('en-IN')}</td>
            <td><button class="btn sm ghost danger" data-del-s="${s.id}">Remove</button></td>
          </tr>`).join('')}</tbody>
        </table></div>`
      : `<div class="empty"><p>No services recorded yet. Use "Log service" on a vehicle to add one.</p></div>`);
  $('#flt').onchange = e => { filter = e.target.value; renderHist(); };
  $('#csv').onclick = exportCsv;
}

function render() { renderDash(); renderHist(); }

/* ── CSV export ── */
function exportCsv() {
  const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const head = ['Date', 'Vehicle number', 'Model', 'Kilometre reading', 'Service type', 'Parts replaced', 'Cost'];
  const lines = db.services.map(s => {
    const v = db.vehicles.find(x => x.id === s.vid) || {};
    return [s.date, v.number, v.model, s.km, s.type, s.parts, s.cost].map(q).join(',');
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([[head.map(q).join(','), ...lines].join('\n')], { type: 'text/csv' }));
  a.download = 'service-history.csv';
  a.click();
}

/* ── Dialogs ── */
function openVehicle(v) {
  const f = $('#vForm'); f.reset();
  $('#vTitle').textContent = v ? 'Edit vehicle' : 'Add vehicle';
  f.id.value = v ? v.id : '';
  if (v) ['owner', 'number', 'model', 'type', 'year', 'km', 'intervalKm', 'intervalMonths'].forEach(k => f[k].value = v[k]);
  $('#vDlg').showModal();
}

function openService(v) {
  const f = $('#sForm'); f.reset();
  $('#sTitle').textContent = 'Log a service · ' + v.number;
  f.vid.value = v.id; f.date.value = today(); f.km.value = v.km;
  $('#sDlg').showModal();
}

$('#vForm').addEventListener('submit', e => {
  if (e.submitter.value !== 'ok') return;
  const f = e.target;
  const d = {
    owner: f.owner.value.trim(), number: f.number.value.trim().toUpperCase(),
    model: f.model.value.trim(), type: f.type.value,
    year: +f.year.value, km: +f.km.value,
    intervalKm: +f.intervalKm.value, intervalMonths: +f.intervalMonths.value
  };
  if (f.id.value) { Object.assign(db.vehicles.find(v => v.id === f.id.value), d); }
  else { db.vehicles.push({ id: uid(), ...d }); }
  save(); render();
});

$('#sForm').addEventListener('submit', e => {
  if (e.submitter.value !== 'ok') return;
  const f = e.target, km = +f.km.value;
  const v = db.vehicles.find(x => x.id === f.vid.value);
  db.services.push({ id: uid(), vid: f.vid.value, date: f.date.value, km, type: f.type.value, parts: f.parts.value.trim(), cost: +f.cost.value || 0 });
  if (v && km > v.km) v.km = km;
  save(); render();
});

document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => b.closest('dialog').close());

/* ── Action buttons ── */
$('#addVehicle').onclick = () => openVehicle();

$('#dash').addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const v = db.vehicles.find(x => x.id === b.dataset.id); if (!v) return;
  if (b.dataset.act === 'log')  openService(v);
  if (b.dataset.act === 'edit') openVehicle(v);
  if (b.dataset.act === 'del' && confirm('Delete ' + v.number + ' and all its service records?')) {
    db.vehicles = db.vehicles.filter(x => x.id !== v.id);
    db.services = db.services.filter(s => s.vid !== v.id);
    save(); render();
  }
});

$('#hist').addEventListener('click', e => {
  const b = e.target.closest('[data-del-s]'); if (!b) return;
  if (confirm('Remove this service record?')) {
    db.services = db.services.filter(s => s.id !== b.dataset.delS);
    save(); render();
  }
});

document.querySelectorAll('nav button').forEach(b => b.onclick = () => {
  document.querySelectorAll('nav button').forEach(x => x.setAttribute('aria-selected', x === b));
  $('#dash').classList.toggle('hide', b.dataset.tab !== 'dash');
  $('#hist').classList.toggle('hide', b.dataset.tab !== 'hist');
});

/* ── Sample data ── */
function sample() {
  const a = uid(), b = uid(), c = uid();
  const ago = m => addMonths(today(), -m);
  db = {
    vehicles: [
      { id: a, owner: 'Arun Kumar',  number: 'TN 09 AB 1234', model: 'Honda Activa',           type: 'Two-wheeler', year: 2021, km: 24600, intervalKm: 5000,  intervalMonths: 6  },
      { id: b, owner: 'Meena S',     number: 'TN 22 CD 5678', model: 'Hyundai i20',             type: 'Car',         year: 2019, km: 61200, intervalKm: 10000, intervalMonths: 12 },
      { id: c, owner: 'Ravi P',      number: 'TN 07 EF 9012', model: 'Royal Enfield Classic',   type: 'Two-wheeler', year: 2018, km: 38000, intervalKm: 3000,  intervalMonths: 6  }
    ],
    services: [
      { id: uid(), vid: a, date: ago(4), km: 20000, type: 'Regular service', parts: 'Engine oil, air filter', cost: 1200 },
      { id: uid(), vid: b, date: ago(5), km: 55000, type: 'Regular service', parts: 'Oil filter, brake pads', cost: 6400 },
      { id: uid(), vid: c, date: ago(8), km: 33500, type: 'Oil change',       parts: 'Engine oil',            cost: 900  }
    ]
  };
  save(); render();
}

render();
