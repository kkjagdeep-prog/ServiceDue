:root {
  --paper:      #F5F2ED;
  --paper-mid:  #EDE9E1;
  --paper-rule: #D9D4CB;
  --ink:        #1A1A18;
  --ink-mute:   #6B6760;
  --ink-faint:  #A09C97;
  --accent:     #C8460A;
  --surface:    #FFFFFF;

  --ok-ink:     #1A5C3A;
  --ok-bg:      #EBF4EE;
  --ok-rule:    #2E8A57;
  --soon-ink:   #7A4F00;
  --soon-bg:    #F7F0DC;
  --soon-rule:  #C98D00;
  --over-ink:   #8C1F0F;
  --over-bg:    #FAEBE8;
  --over-rule:  #C8460A;
  --none-ink:   #6B6760;
  --none-bg:    #F5F2ED;
  --none-rule:  #A09C97;

  --s1: 8px;  --s2: 16px; --s3: 24px; --s4: 32px;
  --s5: 40px; --s6: 48px; --s7: 56px; --s8: 64px;

  --radius: 3px;
  --font-display: 'DM Serif Display', Georgia, serif;
  --font-ui:      'DM Sans', system-ui, sans-serif;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --paper:      #17161A;
    --paper-mid:  #1E1D21;
    --paper-rule: #2C2B30;
    --ink:        #F0EDE8;
    --ink-mute:   #9B9793;
    --ink-faint:  #5C5956;
    --accent:     #E05512;
    --surface:    #1E1D21;
    --ok-ink:     #6EC99A; --ok-bg:   #0D2318; --ok-rule:   #2E8A57;
    --soon-ink:   #DEB96A; --soon-bg: #1F1800; --soon-rule: #A07000;
    --over-ink:   #E88070; --over-bg: #200A06; --over-rule: #C8460A;
    --none-ink:   #9B9793; --none-bg: #1E1D21; --none-rule: #3A3936;
  }
}

:root[data-theme="dark"] {
  --paper:      #17161A;
  --paper-mid:  #1E1D21;
  --paper-rule: #2C2B30;
  --ink:        #F0EDE8;
  --ink-mute:   #9B9793;
  --ink-faint:  #5C5956;
  --accent:     #E05512;
  --surface:    #1E1D21;
  --ok-ink:     #6EC99A; --ok-bg:   #0D2318; --ok-rule:   #2E8A57;
  --soon-ink:   #DEB96A; --soon-bg: #1F1800; --soon-rule: #A07000;
  --over-ink:   #E88070; --over-bg: #200A06; --over-rule: #C8460A;
  --none-ink:   #9B9793; --none-bg: #1E1D21; --none-rule: #3A3936;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; }

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-ui);
  font-size: 15px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

.app-wrap { max-width: 1080px; margin: 0 auto; padding: 0 var(--s3); }

.site-header {
  border-bottom: 1px solid var(--paper-rule);
  padding: var(--s2) 0;
  position: sticky;
  top: 0;
  background: var(--paper);
  z-index: 10;
}

.header-inner {
  display: flex;
  align-items: center;
  gap: var(--s3);
  flex-wrap: wrap;
}

.wordmark {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-shrink: 0;
}

.wordmark-name {
  font-family: var(--font-display);
  font-size: 22px;
  line-height: 1;
  color: var(--ink);
  letter-spacing: -0.3px;
}

.wordmark-rule {
  width: 1px;
  height: 16px;
  background: var(--paper-rule);
  align-self: center;
}

.wordmark-sub {
  font-size: 12px;
  color: var(--ink-faint);
}

.header-nav { display: flex; gap: 2px; flex: 1; flex-wrap: wrap; }

.nav-btn {
  background: none;
  border: none;
  font-family: var(--font-ui);
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-mute);
  padding: var(--s1) var(--s2);
  cursor: pointer;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color .15s, background .15s;
  white-space: nowrap;
}

.nav-btn:hover { color: var(--ink); background: var(--paper-mid); }
.nav-btn[aria-selected="true"] { color: var(--ink); font-weight: 600; background: var(--paper-mid); }

.header-actions { display: flex; align-items: center; gap: var(--s1); margin-left: auto; }

.theme-toggle {
  background: none;
  border: 1px solid var(--paper-rule);
  border-radius: var(--radius);
  padding: 6px;
  cursor: pointer;
  color: var(--ink-mute);
  display: flex;
  align-items: center;
  transition: color .15s, border-color .15s;
}

.theme-toggle:hover { color: var(--ink); border-color: var(--ink-mute); }

button, input, select { font-family: var(--font-ui); }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: var(--radius);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background .15s, color .15s, border-color .15s;
  white-space: nowrap;
  line-height: 1.4;
}

.btn-primary { background: var(--ink); color: var(--paper); border-color: var(--ink); }
.btn-primary:hover { background: var(--accent); border-color: var(--accent); }

.btn-ghost { background: transparent; color: var(--ink-mute); border-color: var(--paper-rule); }
.btn-ghost:hover { color: var(--ink); border-color: var(--ink-mute); background: var(--paper-mid); }

.btn-danger { background: transparent; color: var(--over-ink); border-color: transparent; font-weight: 500; }
.btn-danger:hover { background: var(--over-bg); border-color: var(--over-rule); }

.btn-sm { font-size: 13px; padding: 5px 12px; }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.main-content { padding: var(--s4) 0 var(--s8); }

.tab-panel { display: none; }
.tab-panel.active { display: block; }

.summary-bar {
  display: flex;
  align-items: baseline;
  gap: var(--s4);
  padding: var(--s3) 0 var(--s4);
  border-bottom: 1px solid var(--paper-rule);
  margin-bottom: var(--s4);
  flex-wrap: wrap;
}

.summary-label {
  font-family: var(--font-display);
  font-size: 36px;
  line-height: 1;
  letter-spacing: -1px;
  color: var(--ink);
}

.summary-label span {
  display: block;
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--ink-mute);
  margin-top: 2px;
}

.summary-divider { width: 1px; height: 36px; background: var(--paper-rule); align-self: center; }
.summary-bar-actions { margin-left: auto; }

.vehicle-list { display: flex; flex-direction: column; }

.vehicle-row {
  display: grid;
  grid-template-columns: 4px 1fr auto;
  align-items: stretch;
  border-bottom: 1px solid var(--paper-rule);
  background: var(--surface);
  transition: background .12s;
}

.vehicle-row:first-child { border-top: 1px solid var(--paper-rule); }
.vehicle-row:hover { background: var(--paper-mid); }

.vehicle-row-rule { width: 4px; border-radius: 2px 0 0 2px; }
.vehicle-row.ok   .vehicle-row-rule { background: var(--ok-rule); }
.vehicle-row.soon .vehicle-row-rule { background: var(--soon-rule); }
.vehicle-row.over .vehicle-row-rule { background: var(--over-rule); }
.vehicle-row.none .vehicle-row-rule { background: var(--none-rule); }

.vehicle-row-body {
  padding: var(--s3);
  display: grid;
  grid-template-columns: 220px 1fr 1fr;
  gap: var(--s3);
  align-items: center;
}

@media (max-width: 700px) {
  .vehicle-row-body { grid-template-columns: 1fr; gap: var(--s2); }
}

.vehicle-number {
  font-family: var(--font-display);
  font-size: 20px;
  letter-spacing: -0.3px;
  color: var(--ink);
  line-height: 1.2;
}

.vehicle-meta { font-size: 13px; color: var(--ink-mute); margin-top: 2px; }

.stat-label { font-size: 11px; color: var(--ink-faint); font-weight: 500; margin-bottom: 2px; }
.stat-value { font-size: 15px; font-weight: 600; color: var(--ink); }
.stat-value.ok   { color: var(--ok-ink); }
.stat-value.soon { color: var(--soon-ink); }
.stat-value.over { color: var(--over-ink); }
.stat-sub { font-size: 12px; color: var(--ink-faint); margin-top: 1px; }

.vehicle-row-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: var(--s1);
  padding: var(--s2);
  border-left: 1px solid var(--paper-rule);
  min-width: 128px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 2px;
  margin-top: 6px;
}

.status-badge.ok   { background: var(--ok-bg);   color: var(--ok-ink); }
.status-badge.soon { background: var(--soon-bg);  color: var(--soon-ink); }
.status-badge.over { background: var(--over-bg);  color: var(--over-ink); }
.status-badge.none { background: var(--none-bg);  color: var(--none-ink); }

.status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.status-badge.ok   .status-dot { background: var(--ok-rule); }
.status-badge.soon .status-dot { background: var(--soon-rule); }
.status-badge.over .status-dot { background: var(--over-rule); }
.status-badge.none .status-dot { background: var(--none-rule); }

.empty-state {
  padding: var(--s7) 0 var(--s6);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s6);
  align-items: center;
}

@media (max-width: 600px) { .empty-state { grid-template-columns: 1fr; } }

.empty-eyebrow {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: var(--s2);
  display: flex;
  align-items: center;
  gap: 6px;
}

.empty-heading {
  font-family: var(--font-display);
  font-size: 36px;
  line-height: 1.1;
  letter-spacing: -0.5px;
  color: var(--ink);
  margin-bottom: var(--s2);
}

.empty-body {
  font-size: 15px;
  color: var(--ink-mute);
  line-height: 1.6;
  max-width: 36ch;
  margin-bottom: var(--s3);
}

.empty-actions { display: flex; gap: var(--s1); flex-wrap: wrap; }

.empty-right {
  border: 1px solid var(--paper-rule);
  border-radius: var(--radius);
  padding: var(--s3);
  background: var(--surface);
}

.empty-preview-row {
  display: flex;
  align-items: center;
  gap: var(--s2);
  padding: var(--s1) 0;
  border-bottom: 1px solid var(--paper-rule);
  font-size: 13px;
}

.empty-preview-row:last-child { border-bottom: none; }
.empty-preview-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.empty-preview-label { color: var(--ink-mute); flex: 1; }
.empty-preview-val { font-weight: 600; color: var(--ink); }

.hist-toolbar {
  display: flex;
  align-items: center;
  gap: var(--s2);
  flex-wrap: wrap;
  padding: var(--s3) 0;
  border-bottom: 1px solid var(--paper-rule);
  margin-bottom: var(--s3);
}

.hist-toolbar-left { display: flex; align-items: center; gap: var(--s2); flex: 1; flex-wrap: wrap; }
.hist-toolbar-right { display: flex; align-items: center; gap: var(--s2); }

.hist-heading { font-family: var(--font-display); font-size: 24px; letter-spacing: -0.3px; }

.hist-filter {
  font-family: var(--font-ui);
  font-size: 13px;
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--paper-rule);
  border-radius: var(--radius);
  padding: 5px 10px;
  cursor: pointer;
}

.hist-total { font-size: 13px; font-weight: 600; color: var(--ink-mute); }
.hist-total strong { color: var(--ink); }

.data-table { width: 100%; border-collapse: collapse; font-size: 14px; }

.data-table thead th {
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-faint);
  letter-spacing: 0.03em;
  padding: var(--s1) var(--s2);
  border-bottom: 1px solid var(--paper-rule);
  background: var(--paper);
  position: sticky;
  top: 57px;
}

.data-table tbody tr { border-bottom: 1px solid var(--paper-mid); background: var(--surface); }
.data-table tbody tr:nth-child(even) { background: var(--paper); }
.data-table tbody tr:hover { background: var(--paper-mid); }
.data-table td { padding: 10px var(--s2); color: var(--ink); vertical-align: middle; }
.data-table td.mute { color: var(--ink-mute); }
.data-table .col-actions { text-align: right; }
.scroll-x { overflow-x: auto; }

dialog {
  border: 1px solid var(--paper-rule);
  border-radius: var(--radius);
  padding: 0;
  width: min(520px, 95vw);
  background: var(--surface);
  color: var(--ink);
  box-shadow: 0 8px 40px rgba(0,0,0,.18);
}

dialog::backdrop { background: rgba(10,8,6,.55); }

.dlg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--s3) var(--s3) var(--s2);
  border-bottom: 1px solid var(--paper-rule);
}

.dlg-title { font-family: var(--font-display); font-size: 20px; letter-spacing: -0.2px; }

.dlg-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ink-mute);
  padding: 4px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
}

.dlg-close:hover { color: var(--ink); background: var(--paper-mid); }

.dlg-body { padding: var(--s3); display: flex; flex-direction: column; gap: var(--s2); }

.dlg-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--s1);
  padding: var(--s2) var(--s3);
  border-top: 1px solid var(--paper-rule);
}

.field { display: flex; flex-direction: column; gap: 4px; }
.field-row { display: grid; gap: var(--s2); grid-template-columns: 1fr 1fr; }

@media (max-width: 480px) { .field-row { grid-template-columns: 1fr; } }

.field label { font-size: 13px; font-weight: 600; color: var(--ink-mute); }

.field input,
.field select {
  background: var(--paper);
  border: 1px solid var(--paper-rule);
  border-radius: var(--radius);
  padding: 8px 10px;
  font-size: 14px;
  color: var(--ink);
  width: 100%;
  transition: border-color .15s;
}

.field input:focus,
.field select:focus { border-color: var(--ink-mute); outline: none; background: var(--surface); }

#toast-wrap {
  position: fixed;
  bottom: var(--s4);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s1);
  z-index: 100;
  pointer-events: none;
}

.toast {
  background: var(--ink);
  color: var(--paper);
  font-size: 13px;
  font-weight: 500;
  padding: 10px 18px;
  border-radius: var(--radius);
  animation: toast-in .2s ease, toast-out .3s ease 2.2s forwards;
}

@keyframes toast-in  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
@keyframes toast-out { to   { opacity:0; transform:translateY(4px); } }

@media (prefers-reduced-motion: reduce) {
  .toast { animation: none; }
  .vehicle-row, .btn { transition: none; }
}

.hide { display: none !important; }

/* ─── Search page ─────────────────────────────────────────── */
.search-header {
  padding: var(--s3) 0 var(--s3);
  border-bottom: 1px solid var(--paper-rule);
  margin-bottom: var(--s3);
}

.search-sub {
  font-size: 14px;
  color: var(--ink-mute);
  margin-top: 4px;
}

.search-bar-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--s2);
  margin-bottom: var(--s3);
}

.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--ink-faint);
  pointer-events: none;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--paper-rule);
  border-radius: var(--radius);
  padding: 11px 40px 11px 38px;
  font-size: 15px;
  color: var(--ink);
  transition: border-color .15s;
  font-family: var(--font-ui);
}

.search-input:focus {
  outline: none;
  border-color: var(--ink-mute);
}

.search-input::placeholder { color: var(--ink-faint); }

.search-clear {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ink-faint);
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: var(--radius);
}

.search-clear:hover { color: var(--ink); background: var(--paper-mid); }

.search-filters {
  display: flex;
  gap: var(--s1);
  flex-wrap: wrap;
}

.search-meta {
  font-size: 13px;
  color: var(--ink-mute);
  padding: 0 0 var(--s2);
  border-bottom: 1px solid var(--paper-rule);
  margin-bottom: var(--s2);
}

.search-meta strong { color: var(--ink); }

/* Result cards — one per vehicle that has matching services */
.search-vehicle-group {
  margin-bottom: var(--s4);
}

.search-vehicle-label {
  display: flex;
  align-items: center;
  gap: var(--s2);
  padding: var(--s1) 0 var(--s2);
  border-bottom: 1px solid var(--paper-rule);
  margin-bottom: var(--s1);
}

.search-vehicle-name {
  font-family: var(--font-display);
  font-size: 18px;
  letter-spacing: -0.2px;
}

.search-vehicle-sub { font-size: 13px; color: var(--ink-mute); }

.search-match-count {
  margin-left: auto;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-faint);
}

/* Highlight matched text */
mark {
  background: #FFE484;
  color: var(--ink);
  border-radius: 2px;
  padding: 0 2px;
}

:root[data-theme="dark"] mark,
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) mark {
    background: #6B5000;
    color: #FFE484;
  }
}

.search-empty {
  padding: var(--s6) 0;
  text-align: center;
  color: var(--ink-mute);
}

.search-empty strong { display: block; font-size: 16px; color: var(--ink); margin-bottom: 4px; }

.search-prompt {
  padding: var(--s6) 0;
  text-align: center;
  color: var(--ink-faint);
  font-size: 14px;
}
