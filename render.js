// All page content lives in /content/*.json. Editing those files (by hand,
// or through /admin) is the only thing needed to change what the site says.
async function loadJSON(path){
  const res = await fetch(path + '?v=' + Date.now());
  if(!res.ok) throw new Error('Could not load ' + path);
  return res.json();
}
const esc = (s='') => s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

/* ---------- Home / About ---------- */
async function renderHome(){
  const d = await loadJSON('content/home.json');
  document.getElementById('hero-name').textContent = d.name;
  document.getElementById('hero-title').textContent = d.title;
  document.getElementById('hero-tagline').textContent = d.tagline;
  document.getElementById('hero-photo').src = d.photo;
  document.getElementById('hero-photo').alt = d.name;
  document.getElementById('cred-tags').innerHTML = d.credentials.map(c => `<span class="tag">${esc(c)}</span>`).join('');
  document.getElementById('bio-body').innerHTML = d.bio.map(p => `<p>${esc(p)}</p>`).join('');
}

/* ---------- Treatments ---------- */
async function renderTreatments(){
  const d = await loadJSON('content/treatments.json');
  document.getElementById('treatments-intro').textContent = d.intro;
  document.getElementById('treatments-grid').innerHTML = d.items.map(t => `
    <div class="card treatment-card">
      <div class="treatment-media">
        <img src="${t.image}" alt="${esc(t.name)}">
        <div class="treatment-icon">${icon(t.icon)}</div>
      </div>
      <div class="treatment-body">
        <h3>${esc(t.name)}</h3>
        ${t.ageGroup ? `<span class="eyebrow">${esc(t.ageGroup)}</span>` : ''}
        <p>${esc(t.description)}</p>
      </div>
    </div>
  `).join('');
}

/* ---------- Accomplishments ---------- */
async function renderAccomplishments(){
  const d = await loadJSON('content/accomplishments.json');
  document.getElementById('accom-groups').innerHTML = d.categories.map(cat => `
    <div class="accom-group">
      <h3>${esc(cat.name)}</h3>
      <ul class="accom-list">
        ${cat.items.map(it => `
          <li class="accom-item">
            <span class="accom-year">${esc(it.year || '')}</span>
            <span>${esc(it.text)}</span>
          </li>`).join('')}
      </ul>
    </div>
  `).join('');
}

/* ---------- Publications (Vancouver style) ---------- */
async function renderPublications(){
  const d = await loadJSON('content/publications.json');
  document.getElementById('pub-intro').textContent = d.intro;
  document.getElementById('pub-list').innerHTML = d.items.map(p => `<li class="pub-item">${esc(p)}</li>`).join('');
}

/* ---------- Gallery ---------- */
async function renderGallery(){
  const d = await loadJSON('content/gallery.json');
  document.getElementById('gallery-grid').innerHTML = d.items.map(g => `
    <div class="gallery-item">
      <img src="${g.image}" alt="${esc(g.caption || '')}">
      ${g.caption ? `<div class="gallery-cap">${esc(g.caption)}</div>` : ''}
    </div>
  `).join('');
}

/* ---------- Contact ---------- */
async function renderContact(){
  const d = await loadJSON('content/contact.json');
  const cards = [];
  if(d.email) cards.push({icon:'mail', label:'Email', value:d.email, href:'mailto:'+d.email});
  if(d.phone) cards.push({icon:'phone', label:'Mobile', value:d.phone, href:'tel:'+d.phone.replace(/\s/g,'')});
  if(d.whatsapp) cards.push({icon:'whatsapp', label:'WhatsApp', value:d.whatsapp, href:'https://wa.me/'+d.whatsapp.replace(/[^\d]/g,'')});
  if(d.address) cards.push({icon:'map', label:'Clinic', value:d.address, href:d.mapUrl || '#'});
  (d.social || []).forEach(s => cards.push({icon:'link', label:s.platform, value:s.handle || s.url, href:s.url}));
  document.getElementById('contact-grid').innerHTML = cards.map(c => `
    <a class="contact-card" href="${c.href}" target="${c.href.startsWith('http') ? '_blank' : '_self'}" rel="noopener">
      <div class="contact-icon">${icon(c.icon)}</div>
      <strong>${esc(c.label)}</strong>
      <span>${esc(c.value)}</span>
    </a>
  `).join('');
}

/* ---------- Nav mobile toggle (shared) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(btn && links){
    btn.addEventListener('click', () => links.classList.toggle('open'));
  }
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
});
