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
