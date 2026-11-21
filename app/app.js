// Leonida Trophy Guide: checklist + tracker for the 55 official GTA VI PS5 trophies.
// Progress is kept in localStorage; export/import moves it as JSON. Filters, search,
// the spoiler setting and URL params (?grade=, ?kind=, ?missable=1, ?spoiler=0, ?trophy=<id>)
// all shape the same list, so screenshots can show any view directly.
const KEY = 'leonida-trophy-guide-progress-v1';
const params = new URLSearchParams(location.search);
const rowsEl = document.getElementById('rows');
const detailEl = document.getElementById('detail');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const kindEl = document.getElementById('kind');
const missableEl = document.getElementById('missableOnly');
const spoilerEl = document.getElementById('spoiler');
const hideEarnedEl = document.getElementById('hideEarned');

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
let selectedId = null;
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function gradeLabel(g) {
  return g[0].toUpperCase() + g.slice(1);
}

function isSpoiled(t) {
  // A trophy is shown only when the spoiler setting is off, it is not hidden,
  // or the player already earned it. Hidden trophies stay hidden even in search
  // results, so the spoiler setting never leaks a story beat by accident.
  return !spoilerEl.checked || !t.hidden || earned.has(t.id);
}

function matches(t) {
  const q = searchEl.value.trim().toLowerCase();
  if (q && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) return false;
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
  if (missableEl.checked && !t.missable) return false;
  if (hideEarnedEl.checked && earned.has(t.id)) return false;
  return true;
}

function renderProgress() {
  const n = earned.size;
  const pct = Math.round((n / trophies.length) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = `${n} of ${trophies.length} earned — ${pct}%`;
  for (const stage of [1, 2, 3, 4, 5, 6]) {
    const inStage = trophies.filter((t) => t.stage === stage);
    const done = inStage.filter((t) => earned.has(t.id)).length;
    const el = document.querySelector(`[data-stage="${stage}"]`);
    if (el) el.textContent = `(${done}/${inStage.length} earned)`;
  }
}

function renderDetail(t) {
  if (!t) {
    detailEl.innerHTML = '<p class="detail-empty">Click a trophy to read its guide and sources here.</p>';
    return;
  }
  detailEl.innerHTML = '';
  const h = document.createElement('h3');
  h.textContent = t.name;
  const meta = document.createElement('p');
  meta.className = 'detail-meta';
  const bits = [gradeLabel(t.grade), t.kind];
  if (t.hidden) bits.push('Hidden on PSN');
  if (t.missable) bits.push('MISSABLE');
  meta.textContent = bits.join(' · ');
  const desc = document.createElement('p');
  desc.className = 'detail-desc';
  desc.textContent = 'Official: “' + t.description + '”';
  const guide = document.createElement('p');
  guide.className = 'detail-guide';
  guide.textContent = t.guide;
  const srcTitle = document.createElement('p');
  srcTitle.className = 'detail-src-title';
  srcTitle.textContent = 'Sources';
  const srcList = document.createElement('ul');
  srcList.className = 'detail-sources';
  for (const s of t.sources) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.textContent = s.name;
    a.target = '_blank';
    a.rel = 'noopener';
    li.append(a);
    srcList.append(li);
  }
  const earnedBtn = document.createElement('button');
  earnedBtn.type = 'button';
  earnedBtn.className = 'earned-btn';
  earnedBtn.textContent = earned.has(t.id) ? '✓ Earned — click to unmark' : 'Mark as earned';
  earnedBtn.addEventListener('click', () => toggleEarned(t.id));
  detailEl.append(h, meta, desc, guide, srcTitle, srcList, earnedBtn);
}

function toggleEarned(id) {
  if (earned.has(id)) earned.delete(id);
  else earned.add(id);
  save();
  render();
}

function render() {
  renderProgress();
  rowsEl.replaceChildren();
  const visible = trophies.filter(matches);
  document.getElementById('countLine').textContent =
    `${visible.length} of ${trophies.length} trophies shown` +
    (spoilerEl.checked ? ' · spoilers hidden' : '');
  for (const t of visible) {
    const li = document.createElement('li');
    li.className = 'row' + (earned.has(t.id) ? ' is-earned' : '') + (selectedId === t.id ? ' is-selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', 'Earned: ' + t.name);
    box.addEventListener('change', () => toggleEarned(t.id));
    const main = document.createElement('button');
    main.type = 'button';
    main.className = 'row-main';
    const name = document.createElement('span');
    name.className = 'row-name';
    name.textContent = isSpoiled(t) ? t.name : 'Hidden trophy — earn it to reveal';
    const desc = document.createElement('span');
    desc.className = 'row-desc';
    desc.textContent = isSpoiled(t) ? t.description : 'This trophy is hidden on PlayStation until earned.';
    main.append(name, desc);
    main.addEventListener('click', () => {
      selectedId = t.id;
      renderDetail(t);
      render();
    });
    const badges = document.createElement('span');
    badges.className = 'row-badges';
    const g = document.createElement('span');
    g.className = 'badge grade-' + t.grade;
    g.textContent = gradeLabel(t.grade);
    badges.append(g);
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'badge missable';
      m.textContent = 'MISSABLE';
      badges.append(m);
    }
    if (t.hidden && !earned.has(t.id)) {
      const h = document.createElement('span');
      h.className = 'badge hidden-badge';
      h.textContent = 'HIDDEN';
      badges.append(h);
    }
    li.append(box, main, badges);
    rowsEl.append(li);
  }
  const sel = trophies.find((t) => t.id === selectedId);
  if (sel) renderDetail(sel);
}

document.getElementById('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify([...earned])], { type: 'application/json' }));
  a.download = 'leonida-trophy-progress.json';
  a.click();
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const ids = JSON.parse(await file.text());
    earned = new Set(ids.filter((id) => trophies.some((t) => t.id === id)));
    save();
    render();
  } catch {
    alert('That file is not a valid progress export.');
  }
});
for (const el of [searchEl, gradeEl, kindEl, missableEl, spoilerEl, hideEarnedEl]) {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
}

// URL params drive the same filters, so any view can be linked or screenshotted.
if (params.get('grade')) gradeEl.value = params.get('grade');
if (params.get('kind')) kindEl.value = params.get('kind');
if (params.get('missable') === '1') missableEl.checked = true;
if (params.get('spoiler') === '0') spoilerEl.checked = false;
if (params.get('search')) searchEl.value = params.get('search');
const openId = Number(params.get('trophy'));
if (openId && trophies.some((t) => t.id === openId)) selectedId = openId;

render();
