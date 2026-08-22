// Small hand-picked icon set (stroke-based, 24x24) so content editors can
// pick an icon by keyword in the CMS instead of uploading artwork.
const ICONS = {
  baby: '<path d="M12 13c-3.5 0-6 2.5-6 6h12c0-3.5-2.5-6-6-6z"/><circle cx="9" cy="7" r="1"/><circle cx="15" cy="7" r="1"/><path d="M12 3a4 4 0 0 1 4 4c0 2-1.5 3.5-4 5-2.5-1.5-4-3-4-5a4 4 0 0 1 4-4z"/>',
  kidney: '<path d="M9 3c-3 0-5 3-5 7s2 11 6 11c2 0 2-2 2-4s2-2 2 0 0 4 2 4c4 0 6-7 6-11s-2-7-5-7c-2 0-2 2-4 2S11 3 9 3z"/>',
  shield: '<path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
  heart: '<path d="M12 21s-7-4.4-9.5-9C.7 8.4 2 5 5.5 5c2 0 3.4 1.2 4.5 2.6C11.1 6.2 12.5 5 14.5 5 18 5 19.3 8.4 21.5 12 19 16.6 12 21 12 21z"/>',
  scope: '<path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M10 13v3a5 5 0 0 0 10 0v-1"/><circle cx="20" cy="14" r="2"/>',
  scalpel: '<path d="M4 20l9-9"/><path d="M13 11l6-6 2 2-6 6z"/><circle cx="6" cy="18" r="2"/>',
  lungs: '<path d="M12 3v9"/><path d="M12 12c-1 0-2 1-2 3v3c0 1.5-1 2-2 2s-3-1-3-4 1-6 3-7"/><path d="M12 12c1 0 2 1 2 3v3c0 1.5 1 2 2 2s3-1 3-4-1-6-3-7"/>',
  bone: '<path d="M6 10c-1.2 0-2-1-2-2.2S4.8 5.5 6 5.5c1 0 1.7.6 1.9 1.4h8.2c.2-.8.9-1.4 1.9-1.4 1.2 0 2 1 2 2.2S19.2 10 18 10c-.6 0-1.1-.2-1.5-.6L8.9 17.6c.4.4.6.9.6 1.5 0 1.2-1 2.2-2.2 2.2S5 20.3 5 19.1c0-.6.2-1.1.6-1.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C9.6 21 3 14.4 3 6a2 2 0 0 1 2-2z"/>',
  whatsapp: '<path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.7z"/><path d="M9 9c0 3 3 6 6 6l1-2-3-1-1 1c-1.5-.8-2.7-2-3.5-3.5l1-1-1-3z"/>',
  map: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  link: '<path d="M9 15l6-6"/><path d="M8 11l-2 2a4 4 0 0 0 6 6l2-2"/><path d="M16 13l2-2a4 4 0 0 0-6-6l-2 2"/>'
};

function icon(name, size = 24){
  const p = ICONS[name] || ICONS.heart;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
}
