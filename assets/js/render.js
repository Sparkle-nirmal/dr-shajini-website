// Loads content.json (the published, public content) and renders whichever
// page is currently open. Every public page includes this file.

async function loadContent() {
  const res = await fetch('content.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load content.json');
  return res.json();
}

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function renderHome(data) {
  const h = data.home;
  document.getElementById('home-name').textContent = h.name;
  document.getElementById('home-title').textContent = h.title;
  document.getElementById('home-tagline').textContent = h.tagline;
  document.getElementById('home-bio').textContent = h.bio;
  document.getElementById('home-photo').src = h.photo || 'assets/img/placeholder-portrait.jpg';
  const list = document.getElementById('home-quals');
  list.innerHTML = h.qualifications.map(q => `<li>${esc(q)}</li>`).join('');
}

function renderTreatments(data) {
  const grid = document.getElementById('treatments-grid');
  grid.innerHTML = data.treatments.map(t => `
    <div class="card">
      <div class="icon">${t.icon || '🩺'}</div>
      ${t.image ? `<img src="${esc(t.image)}" alt="${esc(t.title)}">` : ''}
      <h3>${esc(t.title)}</h3>
      ${t.detail ? `<p>${esc(t.detail)}</p>` : ''}
    </div>
  `).join('');
}

function renderAccomplishments(data) {
  const a = data.accomplishments;
  const sections = [
    ['awards', 'Awards & Gold Medals'],
    ['memberships', 'Memberships & Fellowships'],
    ['media', 'Media']
  ];
  const root = document.getElementById('accomplishments-root');
  root.innerHTML = sections.map(([key, label]) => {
    const items = a[key] || [];
    return `
      <div class="category">
        <h2>${label}</h2>
        ${items.length
          ? `<ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`
          : `<p class="empty-note">Nothing added yet.</p>`}
      </div>`;
  }).join('');
}

function renderPublications(data) {
  const list = document.getElementById('publications-list');
  const pubs = data.publications || [];
  list.innerHTML = pubs.length
    ? pubs.map(p => `<li>${esc(p)}</li>`).join('')
    : `<p class="empty-note">No publications added yet.</p>`;
}

function renderGallery(data) {
  const grid = document.getElementById('gallery-grid');
  const items = data.gallery || [];
  grid.innerHTML = items.length
    ? items.map(g => `
        <figure>
          <img src="${esc(g.image)}" alt="${esc(g.caption || '')}">
          ${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ''}
        </figure>`).join('')
    : `<p class="empty-note">No photos added yet.</p>`;
}

function renderContact(data) {
  const c = data.contact;
  const root = document.getElementById('contact-root');
  const rows = [];
  if (c.email) rows.push(['Email', `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`]);
  if (c.phone) rows.push(['Mobile / WhatsApp', esc(c.phone)]);
  if (c.address) rows.push(['Clinic', esc(c.address)]);
  root.innerHTML = rows.length
    ? rows.map(([label, val]) => `<div class="contact-row"><span class="label">${label}</span><span>${val}</span></div>`).join('')
    : `<p class="empty-note">Contact details will appear here once added.</p>`;

  const socialRoot = document.getElementById('contact-social');
  if (socialRoot) {
    const social = c.social || [];
    socialRoot.innerHTML = social.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join(' · ');
  }
}

const RENDERERS = {
  home: renderHome,
  treatments: renderTreatments,
  accomplishments: renderAccomplishments,
  publications: renderPublications,
  gallery: renderGallery,
  contact: renderContact
};

document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page;
  try {
    const data = await loadContent();
    if (RENDERERS[page]) RENDERERS[page](data);
  } catch (err) {
    console.error(err);
  }
});

/* ---------------------------------------------------------------
   Basic password gate.
   To change the password: open this file, edit ADMIN_PASSWORD below,
   and re-upload it to your repo. There is no "forgot password" —
   whoever edits this file controls the password.
--------------------------------------------------------------- */
const ADMIN_PASSWORD = "changeme123"; // <-- set this to your real password

const state = {
  content: null,
  sha: null,
  owner: null,
  repo: null,
  branch: null,
  token: null,
  dirty: false
};

const DRAFT_KEY = 'drShajiniSiteDraft';

function tryUnlock() {
  const val = document.getElementById('password-input').value;
  if (val === ADMIN_PASSWORD) {
    document.getElementById('lock-screen').style.display = 'none';
    document.getElementById('admin-app').style.display = 'block';
  } else {
    document.getElementById('lock-error').style.display = 'block';
  }
}

async function connectAndLoad() {
  const owner = document.getElementById('repo-owner').value.trim();
  const repo = document.getElementById('repo-name').value.trim();
  const branch = document.getElementById('repo-branch').value.trim() || 'main';
  const token = document.getElementById('gh-token').value.trim();
  const statusEl = document.getElementById('connect-status');

  if (!owner || !repo || !token) {
    statusEl.textContent = 'Please fill in the repository owner, name, and token.';
    return;
  }

  statusEl.textContent = 'Connecting…';
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/content.json?ref=${branch}`, {
      headers: { Authorization: `token ${token}` }
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || `GitHub returned ${res.status}`);
    }
    const json = await res.json();
    const decoded = decodeURIComponent(escape(atob(json.content.replace(/\n/g, ''))));
    state.content = JSON.parse(decoded);
    state.sha = json.sha;
    state.owner = owner;
    state.repo = repo;
    state.branch = branch;
    state.token = token;

    const draftRaw = localStorage.getItem(DRAFT_KEY);
    if (draftRaw) {
      const useDraft = confirm('You have an unpublished draft saved in this browser. Load it instead of the live content?');
      if (useDraft) {
        try { state.content = JSON.parse(draftRaw); } catch (e) { /* ignore bad draft */ }
      }
    }

    statusEl.textContent = 'Connected. Loaded current content.';
    document.getElementById('editor-root').style.display = 'block';
    renderTabs();
    showPanel('home');
  } catch (err) {
    statusEl.textContent = 'Could not connect: ' + err.message;
  }
}

/* ---------------- Tabs ---------------- */
const SECTIONS = [
  ['home', 'Home / About'],
  ['treatments', 'Treatments'],
  ['accomplishments', 'Accomplishments'],
  ['publications', 'Publications'],
  ['gallery', 'Gallery'],
  ['contact', 'Contact']
];

function renderTabs() {
  const tabs = document.getElementById('tabs');
  tabs.innerHTML = SECTIONS.map(([key, label]) =>
    `<button data-tab="${key}" onclick="showPanel('${key}')">${label}</button>`
  ).join('');
}

function showPanel(key) {
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === key));
  const panels = document.getElementById('panels');
  const renderer = { home: renderHomePanel, treatments: renderTreatmentsPanel,
    accomplishments: renderAccomplishmentsPanel, publications: renderPublicationsPanel,
    gallery: renderGalleryPanel, contact: renderContactPanel }[key];
  panels.innerHTML = `<div class="admin-section" id="panel-${key}"></div>`;
  renderer(document.getElementById(`panel-${key}`));
}

function markDirty() {
  state.dirty = true;
  document.getElementById('save-status').textContent = 'Unsaved changes — click "Save draft" or "Publish".';
  localStorage.setItem(DRAFT_KEY, JSON.stringify(state.content));
}

function fileToDataUrl(file, cb) {
  const reader = new FileReader();
  reader.onload = () => cb(reader.result);
  reader.readAsDataURL(file);
}

/* ---------------- Home panel ---------------- */
function renderHomePanel(root) {
  const h = state.content.home;
  root.innerHTML = `
    <h2>Home / About</h2>
    <div class="field"><label>Name</label><input id="h-name" value="${h.name || ''}"></div>
    <div class="field"><label>Title</label><input id="h-title" value="${h.title || ''}"></div>
    <div class="field"><label>Tagline</label><input id="h-tagline" value="${h.tagline || ''}"></div>
    <div class="field"><label>Bio</label><textarea id="h-bio" rows="5">${h.bio || ''}</textarea></div>
    <div class="field"><label>Photo</label><br>
      <img src="${h.photo}" style="width:100px;height:130px;object-fit:cover;border-radius:8px;" id="h-photo-preview">
      <input type="file" accept="image/*" onchange="handleHomePhoto(this)">
    </div>
    <div class="field"><label>Qualifications (one per line)</label>
      <textarea id="h-quals" rows="4">${(h.qualifications || []).join('\n')}</textarea>
    </div>
  `;
  ['h-name','h-title','h-tagline','h-bio','h-quals'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateHomeFromForm);
  });
}
function updateHomeFromForm() {
  const h = state.content.home;
  h.name = document.getElementById('h-name').value;
  h.title = document.getElementById('h-title').value;
  h.tagline = document.getElementById('h-tagline').value;
  h.bio = document.getElementById('h-bio').value;
  h.qualifications = document.getElementById('h-quals').value.split('\n').map(s => s.trim()).filter(Boolean);
  markDirty();
}
function handleHomePhoto(input) {
  if (!input.files[0]) return;
  fileToDataUrl(input.files[0], (url) => {
    state.content.home.photo = url;
    document.getElementById('h-photo-preview').src = url;
    markDirty();
  });
}

/* ---------------- Treatments panel ---------------- */
function renderTreatmentsPanel(root) {
  const items = state.content.treatments;
  root.innerHTML = `<h2>Treatments</h2><div id="t-list"></div>
    <button class="btn secondary" onclick="addTreatment()">+ Add treatment</button>`;
  const list = root.querySelector('#t-list');
  list.innerHTML = items.map((t, i) => `
    <div class="repeat-item">
      <button class="remove-btn" onclick="removeTreatment(${i})">Remove</button>
      <div class="field"><label>Icon (emoji)</label><input value="${t.icon || ''}" oninput="updateTreatment(${i}, 'icon', this.value)"></div>
      <div class="field"><label>Title</label><input value="${t.title || ''}" oninput="updateTreatment(${i}, 'title', this.value)"></div>
      <div class="field"><label>Detail</label><input value="${t.detail || ''}" oninput="updateTreatment(${i}, 'detail', this.value)"></div>
      <div class="field"><label>Image</label><br>
        ${t.image ? `<img src="${t.image}" style="width:90px;height:60px;object-fit:cover;border-radius:6px;">` : ''}
        <input type="file" accept="image/*" onchange="handleTreatmentImage(${i}, this)">
      </div>
    </div>
  `).join('');
}
function updateTreatment(i, field, value) {
  state.content.treatments[i][field] = value;
  markDirty();
}
function handleTreatmentImage(i, input) {
  if (!input.files[0]) return;
  fileToDataUrl(input.files[0], (url) => {
    state.content.treatments[i].image = url;
    markDirty();
    showPanel('treatments');
  });
}
function addTreatment() {
  state.content.treatments.push({ id: 't' + Date.now(), icon: '🩺', title: 'New treatment', detail: '', image: '' });
  markDirty();
  showPanel('treatments');
}
function removeTreatment(i) {
  state.content.treatments.splice(i, 1);
  markDirty();
  showPanel('treatments');
}

/* ---------------- Accomplishments panel ---------------- */
const ACC_CATS = [['awards','Awards & Gold Medals'],['memberships','Memberships & Fellowships'],['media','Media']];
function renderAccomplishmentsPanel(root) {
  const a = state.content.accomplishments;
  root.innerHTML = ACC_CATS.map(([key,label]) => `
    <h2>${label}</h2>
    <textarea rows="4" id="acc-${key}" placeholder="One entry per line">${(a[key]||[]).join('\n')}</textarea>
    <br><br>
  `).join('');
  ACC_CATS.forEach(([key]) => {
    document.getElementById(`acc-${key}`).addEventListener('input', () => {
      state.content.accomplishments[key] = document.getElementById(`acc-${key}`).value.split('\n').map(s=>s.trim()).filter(Boolean);
      markDirty();
    });
  });
}

/* ---------------- Publications panel ---------------- */
function renderPublicationsPanel(root) {
  root.innerHTML = `<h2>Publications</h2>
    <p style="font-size:0.85rem;color:var(--muted);">One publication per line, Vancouver style. Numbering is automatic on the live page — you can include or omit your own numbers here.</p>
    <textarea rows="10" id="pub-list">${(state.content.publications||[]).join('\n')}</textarea>`;
  document.getElementById('pub-list').addEventListener('input', () => {
    state.content.publications = document.getElementById('pub-list').value.split('\n').map(s=>s.trim()).filter(Boolean);
    markDirty();
  });
}

/* ---------------- Gallery panel ---------------- */
function renderGalleryPanel(root) {
  const items = state.content.gallery;
  root.innerHTML = `<h2>Gallery</h2><div id="g-list"></div>
    <input type="file" accept="image/*" onchange="addGalleryPhoto(this)">`;
  const list = root.querySelector('#g-list');
  list.innerHTML = items.map((g, i) => `
    <div class="repeat-item">
      <button class="remove-btn" onclick="removeGalleryPhoto(${i})">Remove</button>
      <img src="${g.image}" style="width:120px;height:80px;object-fit:cover;border-radius:6px;"><br><br>
      <div class="field"><label>Caption</label><input value="${g.caption || ''}" oninput="updateGalleryCaption(${i}, this.value)"></div>
    </div>
  `).join('');
}
function addGalleryPhoto(input) {
  if (!input.files[0]) return;
  fileToDataUrl(input.files[0], (url) => {
    state.content.gallery.push({ image: url, caption: '' });
    markDirty();
    showPanel('gallery');
  });
}
function updateGalleryCaption(i, value) {
  state.content.gallery[i].caption = value;
  markDirty();
}
function removeGalleryPhoto(i) {
  state.content.gallery.splice(i, 1);
  markDirty();
  showPanel('gallery');
}

/* ---------------- Contact panel ---------------- */
function renderContactPanel(root) {
  const c = state.content.contact;
  root.innerHTML = `
    <h2>Contact</h2>
    <div class="field"><label>Email</label><input id="c-email" value="${c.email || ''}"></div>
    <div class="field"><label>Mobile / WhatsApp</label><input id="c-phone" value="${c.phone || ''}"></div>
    <div class="field"><label>Clinic address</label><textarea id="c-address" rows="3">${c.address || ''}</textarea></div>
    <div class="field"><label>Social links (one per line, format: Label | https://...)</label>
      <textarea id="c-social" rows="3">${(c.social||[]).map(s => `${s.label} | ${s.url}`).join('\n')}</textarea>
    </div>
  `;
  ['c-email','c-phone','c-address','c-social'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateContactFromForm);
  });
}
function updateContactFromForm() {
  const c = state.content.contact;
  c.email = document.getElementById('c-email').value;
  c.phone = document.getElementById('c-phone').value;
  c.address = document.getElementById('c-address').value;
  c.social = document.getElementById('c-social').value.split('\n').map(s => s.trim()).filter(Boolean).map(line => {
    const [label, url] = line.split('|').map(s => s.trim());
    return { label, url };
  });
  markDirty();
}

/* ---------------- Save / Publish ---------------- */
function saveDraft() {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(state.content));
  document.getElementById('save-status').textContent = 'Draft saved in this browser (not yet public).';
}

async function publishNow() {
  if (!confirm('Publish these changes so they are visible to everyone on the live site?')) return;
  const statusEl = document.getElementById('save-status');
  statusEl.textContent = 'Publishing…';
  try {
    const contentStr = JSON.stringify(state.content, null, 2);
    const b64 = btoa(unescape(encodeURIComponent(contentStr)));
    const res = await fetch(`https://api.github.com/repos/${state.owner}/${state.repo}/contents/content.json`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${state.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update site content via admin page',
        content: b64,
        sha: state.sha,
        branch: state.branch
      })
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.message || `GitHub returned ${res.status}`);
    state.sha = body.content.sha;
    localStorage.removeItem(DRAFT_KEY);
    statusEl.textContent = 'Published! Changes are now live (may take a minute to appear).';
  } catch (err) {
    statusEl.textContent = 'Publish failed: ' + err.message;
  }
}
