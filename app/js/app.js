/* À CÔTÉ DE TOI — application (prototype). Conte Games Studio.
   Aucune donnée de lieu n'est écrite ici : tout vient de js/donnees.js (sources ouvertes). */
(function () {
  'use strict';
  const D = window.ACDT_DATA, T = window.ACDT_T, LANGS = window.ACDT_LANGS, H = window.ACDT_H;
  const CONFIG = {
    URL_ETAT: '',                       // plus tard : adresse du fichier qui désactive une fiche à distance
    MAIL_SIGNALEMENT: 'contegamesstudio@gmail.com',
    PUB_TEST: false, PUB_LISTE_TOUS_LES: 6, PUB_ENTRE_RECHERCHES: 3,
    // affiliation : identifiants à coller ici une fois les comptes partenaires créés (vides = lien simple, sans commission)
    GYG_PARTENAIRE: 'CFAS8OQ',               // GetYourGuide partner_id
    BOOKING_AID: '',                    // Booking.com aid
    URL_STUDIO: 'https://contegames.com', // « Découvrez nos autres applications »
  };
  const CATS_RESERVABLES = ['musees', 'chateaux', 'patrimoine', 'animaux', 'loisirs', 'culture'];
  const LOC_GYG = { fr: 'fr-FR', en: 'en-US', es: 'es-ES', de: 'de-DE', it: 'it-IT', pt: 'pt-PT', nl: 'nl-NL', pl: 'pl-PL', ru: 'ru-RU', sv: 'sv-SE', da: 'da-DK', nb: 'no-NO', fi: 'fi-FI', ja: 'ja-JP', ko: 'ko-KR', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', tr: 'tr-TR', cs: 'cs-CZ', ro: 'ro-RO' };
  function reservation(l, v) {
    const q = encodeURIComponent(nomDe(l) + ' ' + v.nom);
    if (l.cat === 'hotels') return { url: `https://www.booking.com/searchresults.html?ss=${q}${CONFIG.BOOKING_AID ? '&aid=' + encodeURIComponent(CONFIG.BOOKING_AID) : ''}`, cle: 'book_hotel', part: !!CONFIG.BOOKING_AID };
    if (!CATS_RESERVABLES.includes(l.cat)) return null;
    return { url: `https://www.getyourguide.com/s/?q=${q}${LOC_GYG[S.lang] ? '&locale=' + LOC_GYG[S.lang] : ''}${CONFIG.GYG_PARTENAIRE ? '&partner_id=' + encodeURIComponent(CONFIG.GYG_PARTENAIRE) + '&cmp=acdt' : ''}`, cle: 'book', part: !!CONFIG.GYG_PARTENAIRE };
  }
  const CATS = ['patrimoine', 'musees', 'chateaux', 'parcs', 'nature', 'plages', 'animaux', 'culture', 'loisirs', 'marches', 'restaurants', 'cafes', 'shopping', 'hotels'];
  const TEINTE = { patrimoine: '#b4532a', musees: '#7a3ea8', chateaux: '#8a6a1f', parcs: '#2e8b4f', nature: '#1f7a6a', plages: '#1c8bb8', animaux: '#b8651c', culture: '#b02a6b', loisirs: '#d0612a', hotels: '#4a4f9c', marches: '#a8791a', restaurants: '#c93338', cafes: '#6b4a2f', shopping: '#3a5fb0' };
  const ICONE = { patrimoine: 'camera', musees: 'camera', culture: 'camera', chateaux: 'castle', parcs: 'tree', nature: 'tree', plages: 'wave', animaux: 'paw', loisirs: 'star', marches: 'basket', restaurants: 'fork', cafes: 'cup', shopping: 'bag', hotels: 'bed' };
  const FAMILLES = { see: ['patrimoine', 'musees', 'culture', 'chateaux', 'loisirs'], eat: ['restaurants', 'cafes', 'marches'], nature: ['parcs', 'nature', 'plages', 'animaux'], sleep: ['hotels'], shop: ['shopping'] };
  let famCarte = 'all';
  const DUREE = { patrimoine: 45, musees: 120, chateaux: 90, parcs: 60, nature: 120, plages: 120, animaux: 180, culture: 60, loisirs: 90, marches: 45, restaurants: 75, cafes: 30, shopping: 45, hotels: 0 };
  const AFFINITE = { family: ['animaux', 'parcs', 'plages', 'musees', 'nature', 'loisirs'], couple: ['patrimoine', 'chateaux', 'culture', 'restaurants', 'parcs'], solo: ['musees', 'patrimoine', 'cafes', 'nature'], friends: ['restaurants', 'cafes', 'marches', 'plages', 'culture', 'loisirs'] };
  const ALIAS = { paris: 'paris parigi', lyon: 'lyon lione', marseille: 'marseille marsella marsiglia marseilles', nice: 'nice niza nizza', bordeaux: 'bordeaux burdeos', toulouse: 'toulouse tolosa', strasbourg: 'strasbourg strassburg estrasburgo strasburgo', nantes: 'nantes', annecy: 'annecy', 'saint-etienne': 'saint-etienne saint etienne st-etienne st etienne' };
  // zones (régions, départements) : la recherche ouvre la liste des villes de la zone
  const ZONES = { bretagne: 'bretagne', brittany: 'bretagne', normandie: 'normandie', normandy: 'normandie', alsace: 'rhin', provence: 'provence', corse: 'corse', corsica: 'corse', pyrenees: 'pyrenees', alpes: 'alpes', alps: 'alpes', occitanie: 'occitanie', 'cote d azur': 'alpes-maritimes', riviera: 'alpes-maritimes' };
  const NON_COUVERT = ['mont-saint-michel', 'disneyland', 'outre-mer', 'guadeloupe', 'martinique', 'reunion', 'guyane', 'mayotte'];
  const JOURS_MOTS = [['lundi', 'monday', 'lunes', 'montag', 'lunedi'], ['mardi', 'tuesday', 'martes', 'dienstag', 'martedi'], ['mercredi', 'wednesday', 'miercoles', 'mittwoch', 'mercoledi'], ['jeudi', 'thursday', 'jueves', 'donnerstag', 'giovedi'], ['vendredi', 'friday', 'viernes', 'freitag', 'venerdi'], ['samedi', 'saturday', 'sabado', 'samstag', 'sabato'], ['dimanche', 'sunday', 'domingo', 'sonntag', 'domenica']];
  const VIDES = new Set('a à de du des le la les l d en in at au aux un une pres près near cerca vicino bei nahe ouvert ouverte open abierto aperto geoffnet avec with con mit sortie sorties activite activites activity things to do que faire the el los las il lo gli der die das und et and y e ou or'.split(' '));
  const CUISINE = { french: ['française', 'French', 'francesa', 'französisch', 'francese'], regional: ['régionale', 'regional', 'regional', 'regional', 'regionale'], italian: ['italienne', 'Italian', 'italiana', 'italienisch', 'italiana'], japanese: ['japonaise', 'Japanese', 'japonesa', 'japanisch', 'giapponese'], pizza: ['pizza', 'pizza', 'pizza', 'Pizza', 'pizza'], seafood: ['fruits de mer', 'seafood', 'marisco', 'Meeresfrüchte', 'frutti di mare'], coffee_shop: ['café', 'coffee shop', 'cafetería', 'Café', 'caffetteria'], burger: ['burgers', 'burgers', 'hamburguesas', 'Burger', 'hamburger'], crepe: ['crêpes', 'crêpes', 'crepes', 'Crêpes', 'crêpes'], brasserie: ['brasserie', 'brasserie', 'brasserie', 'Brasserie', 'brasserie'], bistro: ['bistrot', 'bistro', 'bistró', 'Bistro', 'bistrot'], mediterranean: ['méditerranéenne', 'Mediterranean', 'mediterránea', 'mediterran', 'mediterranea'], vegetarian: ['végétarienne', 'vegetarian', 'vegetariana', 'vegetarisch', 'vegetariana'], chinese: ['chinoise', 'Chinese', 'china', 'chinesisch', 'cinese'], indian: ['indienne', 'Indian', 'india', 'indisch', 'indiana'], lebanese: ['libanaise', 'Lebanese', 'libanesa', 'libanesisch', 'libanese'], tea: ['thé', 'tea', 'té', 'Tee', 'tè'] };

  // ---------- état ----------
  const DEF = { lang: null, city: null, budget: 'all', cats: [], when: 'now', date: null, dur: 'any', who: 'any', q: '', view: 'cards', favs: [], hist: [], vd: {}, noAds: false, adsPerso: false, nSearch: 0 };
  let S = Object.assign({}, DEF);
  try { Object.assign(S, JSON.parse(localStorage.getItem('acdt.v1') || '{}')); } catch (e) { /* stockage indisponible */ }
  const save = () => { try { localStorage.setItem('acdt.v1', JSON.stringify(S)); } catch (e) { /* idem */ } };
  let pos = null;            // position de l'utilisateur : en mémoire seulement, jamais enregistrée
  let etat = Object.assign({}, D.desactives || {});
  let plan = null, planDetail = false, carte = null, avisRecherche = '', destQ = '', proches = [];
  // Chargement à la demande : un petit fichier par ville (500 villes = impossible de tout charger d'un coup).
  const charge = new Set(), enCours = {};
  window.ACDT_CHARGE = (id, lieux) => { const vus = new Set(D.lieux.map(l => l.id)); for (const l of lieux) if (!vus.has(l.id)) D.lieux.push(l); charge.add(id); };
  function charger(id) {
    if (charge.has(id)) return Promise.resolve();
    return enCours[id] || (enCours[id] = new Promise(res => { const sc = document.createElement('script'); sc.src = 'donnees/v/' + id + '.js';
      sc.onload = () => res(); sc.onerror = () => { charge.add(id); res(); }; document.head.appendChild(sc); }));
  }
  const NOMS_VILLES = D.villes.map(v => [' ' + String(v.nom).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, ' ') + ' ', v.id]).sort((a, b) => b[0].length - a[0].length);

  function langueTel() {           // langue du téléphone, si elle fait partie des 50
    for (const n of (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'])) {
      const x = String(n).toLowerCase(), ex = LANGS.find(l => l.c.toLowerCase() === x) || (/^zh-(tw|hk|mo|hant)/.test(x) && LANGS.find(l => l.c === 'zh-TW')) || (x.startsWith('zh') && LANGS.find(l => l.c === 'zh-CN'))
        || ((x.startsWith('no') || x.startsWith('nn')) && LANGS.find(l => l.c === 'nb')) || (x.startsWith('tl') && LANGS.find(l => l.c === 'fil')) || LANGS.find(l => l.c === x.split('-')[0]);
      if (ex) return ex.c;
    }
    return 'en';
  }
  if (!S.lang || !LANGS.some(l => l.c === S.lang)) S.lang = langueTel();
  // 5 langues dans i18n.js ; les 45 autres dans js/lang/<code>.js, chargées seulement quand on les choisit
  const BASE = ['fr', 'en', 'es', 'de', 'it'];
  const li = () => Math.max(0, LANGS.findIndex(l => l.c === S.lang));
  const t = (k, v) => { const b = BASE.indexOf(S.lang), TL = window.ACDT_TL && window.ACDT_TL[S.lang];
    let s = b >= 0 ? (T[k] || [k])[b] : (TL && TL[k]) || (T[k] || [k])[1] || (T[k] || [k])[0];
    if (v) for (const x in v) s = s.replace('{' + x + '}', v[x]); return s; };
  const langPrete = c => BASE.includes(c) || (window.ACDT_TL && window.ACDT_TL[c]);
  function chargerLangue(c) {
    if (langPrete(c)) return Promise.resolve();
    return new Promise(res => { const sc = document.createElement('script'); sc.src = 'js/lang/' + c + '.js'; sc.onload = sc.onerror = () => res(); document.head.appendChild(sc); });
  }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, ' ').replace(/\s+/g, ' ').trim();
  const ville = id => D.villes.find(v => v.id === id);
  const lieu = id => D.lieux.find(l => l.id === id);
  const nomDe = l => typeof l.nom === 'string' ? l.nom : (l.nom[S.lang] || l.nom.fr || l.nom.en || Object.values(l.nom)[0]);
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const cuisineTxt = c => c.split(';').map(x => x.trim()).filter(Boolean).map(x => CUISINE[x] ? CUISINE[x][li()] : x.replace(/_/g, ' ')).join(', ');
  function courtDe(l) {
    if (l.court && (l.court[S.lang] || l.court.en || l.court.fr)) return cap(l.court[S.lang] || l.court.en || l.court.fr);
    return t('c_' + l.cat) + (l.cuisine ? ' · ' + cuisineTxt(l.cuisine) : '');
  }
  function dist(a, b) {
    const R = 6371, r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  const fmtDist = km => km < 1 ? (Math.max(50, Math.round(km * 20) * 50)) + ' m' : (km < 10 ? km.toFixed(1).replace('.', S.lang === 'en' ? '.' : ',') : Math.round(km)) + ' km';
  const fmtDuree = m => m < 60 ? t('min', { n: m }) : t('hrs', { n: Math.floor(m / 60) }) + (m % 60 ? ' ' + (m % 60) : '');
  const fmtDate = iso => { const [y, m, d] = iso.split('-'); return S.lang === 'en' ? `${d}/${m}/${y}` : `${d}/${m}/${y}`; };
  const prixTxt = l => t({ gratuit: 'price_free', libre: 'price_libre', payant: 'price_paid', inconnu: 'price_unknown' }[l.prix.type] || 'price_unknown');
  const estGratuit = l => l.prix.type === 'gratuit' || l.prix.type === 'libre';
  const origine = () => pos || (S.city ? ville(S.city) : null);

  function dateRef() {
    const n = new Date();
    if (S.when === 'weekend') { const d = new Date(n); const j = d.getDay(); if (j !== 6 && j !== 0) d.setDate(d.getDate() + (6 - j)); d.setHours(12, 0, 0, 0); return j === 6 || j === 0 ? n : d; }
    if (S.when === 'date' && S.date) { const d = new Date(S.date + 'T12:00:00'); if (!isNaN(d)) return d; }
    return n;
  }
  // 'open' | 'closed' | null (inconnu : on ne devine jamais)
  function statut(l) {
    if (!l.horaires) return null;
    const p = H.parse(l.horaires); if (!p) return null;
    const maintenant = S.when === 'now' || (S.when === 'weekend' && [0, 6].includes(new Date().getDay()));
    const r = maintenant ? H.isOpen(p, dateRef()) : H.openOnDay(p, dateRef());
    return r === null ? null : (r ? 'open' : 'closed');
  }

  // ---------- recherche ----------
  function analyser(q) {
    const res = { city: null, cats: [], free: false, jour: null, texte: '', nonCouvert: null, zone: null };
    let s = ' ' + norm(q) + ' ';
    for (const [n, id] of NOMS_VILLES) if (s.includes(n)) { res.city = id; s = s.replace(n, ' '); break; }
    if (!res.city) for (const id in ALIAS) { if (!ville(id)) continue;
      const noms = id === 'saint-etienne' ? ['saint etienne', 'st-etienne', 'st etienne'] : ALIAS[id].split(' ');
      for (const al of noms) if (s.includes(' ' + al + ' ')) { res.city = id; s = s.replace(' ' + al + ' ', ' '); }
    }
    for (const z in ZONES) if (s.includes(' ' + z + ' ')) { res.zone = ZONES[z]; s = s.replace(' ' + z + ' ', ' '); }
    for (const x of NON_COUVERT) if (s.includes(' ' + x + ' ')) { res.nonCouvert = x; s = s.replace(' ' + x + ' ', ' '); }
    const mots = s.trim().split(' ').filter(Boolean), reste = [];
    const libres = window.ACDT_FREE_WORDS.split(' ');
    for (const m of mots) {
      if (libres.includes(m)) { res.free = true; continue; }
      const j = JOURS_MOTS.findIndex(g => g.includes(m)); if (j >= 0) { res.jour = j; continue; }
      let c = null; for (const k in window.ACDT_SYN) if (window.ACDT_SYN[k].split(' ').map(norm).includes(m)) { c = k; break; }
      if (!c) for (const k of CATS) if (norm(t('c_' + k)).split(' ').filter(x => x.length > 2).includes(m)) { c = k; break; }
      if (c) { if (!res.cats.includes(c)) res.cats.push(c); continue; }
      if (VIDES.has(m) || /^\d+$/.test(m) || m === '€') continue;
      reste.push(m);
    }
    res.texte = reste.join(' ');
    return res;
  }
  function lancerRecherche(q) {
    const a = analyser(q);
    S.q = a.texte; avisRecherche = a.nonCouvert ? t('not_covered', { x: cap(a.nonCouvert) }) : '';
    if (a.city) { S.city = a.city; pos = null; proches = []; }
    S.cats = a.cats; S.budget = a.free ? 'free' : 'all';
    if (a.jour !== null) { const d = new Date(); const diff = (a.jour - ((d.getDay() + 6) % 7) + 7) % 7; d.setDate(d.getDate() + diff); S.when = 'date'; S.date = d.toISOString().slice(0, 10); }
    save();
    if (a.nonCouvert) { S.city = null; save(); versResultats(); return; }
    if (!a.city && (a.zone || !S.city)) { destQ = a.zone || ''; if (location.hash === '#/dest') rendre(); else location.hash = '#/dest'; return; }
    versResultats();
  }
  function filtrer(o) {
    o = o || {};
    const cats = o.cats || S.cats, org = origine();
    if (!S.city && !pos) return [];                       // il faut une ville ou la position
    let L = D.lieux.filter(l => !etat[l.id]);
    if (pos) L = L.filter(l => dist(pos, l) <= 30); else L = L.filter(l => l.ville === S.city);
    if (cats.length) L = L.filter(l => cats.includes(l.cat));
    if (S.budget === 'free') L = L.filter(estGratuit);
    else if (S.budget === 'paid') L = L.filter(l => l.prix.type === 'payant');
    else if (S.budget === 'unknown') L = L.filter(l => l.prix.type === 'inconnu');
    const maxD = { '30': 45, '60': 75, half: 180 }[S.dur]; if (maxD) L = L.filter(l => DUREE[l.cat] <= maxD);
    if (S.q) { const mots = norm(S.q).split(' '); L = L.filter(l => { const n = norm(typeof l.nom === 'string' ? l.nom : Object.values(l.nom).join(' ')) + ' ' + norm(l.cuisine || ''); return mots.every(m => n.includes(m)); }); }
    const aff = AFFINITE[S.who] || [], rang = { open: 0, null: 0, closed: 1 };   // un lieu connu comme fermé passe après ; l'inconnu n'est pas pénalisé
    return L.map((l, i) => ({ l, i, st: statut(l), d: org ? dist(org, l) : null }))
      .sort((a, b) => rang[a.st] - rang[b.st] || (aff.includes(b.l.cat) - aff.includes(a.l.cat)) || (pos ? a.d - b.d : a.i - b.i));
  }

  // ---------- publicités (mode test) ----------
  const NATIF = !!(window.ACDT_PUB && window.ACDT_PUB.natif);
  // Appli : vraie bannière AdMob en bas + interstitiel ; sur le web : aucune pub (plus d'encart de test).
  const pubListe = () => (!CONFIG.PUB_TEST || S.noAds) ? '' : `<div class="pub" role="note"><span class="pub-tag">${esc(t('ad_test'))}</span><p>${esc(t('ad_space'))}</p></div>`;
  function overlayPub(recompense, apres) {
    const o = document.createElement('div'); o.className = 'overlay-pub'; o.setAttribute('role', 'dialog');
    let s = recompense ? 5 : 0;
    const maj = () => { o.innerHTML = `<div class="pub-plein"><span class="pub-tag">${esc(t('ad_test'))}</span><p>${esc(t('ad_space'))}</p><button class="btn ${s > 0 ? 'btn-off' : 'btn-primary'}" id="pub-fermer" ${s > 0 ? 'disabled' : ''}>${esc(s > 0 ? t('ad_wait', { s }) : t('ad_close'))}</button></div>`; };
    maj(); document.body.appendChild(o);
    const fin = () => { o.remove(); if (apres) apres(); };
    o.addEventListener('click', e => { if (e.target.id === 'pub-fermer' && s <= 0) fin(); });
    if (s > 0) { const iv = setInterval(() => { s--; maj(); if (s <= 0) clearInterval(iv); }, 1000); }
  }
  function versResultats() {
    S.nSearch = (S.nSearch || 0) + 1; save();
    const aller = () => { location.hash = '#/res'; if (location.hash === '#/res') rendre(); };
    if (NATIF && S.nSearch % CONFIG.PUB_ENTRE_RECHERCHES === 0) window.ACDT_PUB.interstitiel(aller);
    else if (CONFIG.PUB_TEST && !S.noAds && S.nSearch % CONFIG.PUB_ENTRE_RECHERCHES === 0) overlayPub(false, aller); else aller();
  }

  // ---------- morceaux d'interface ----------
  const ic = { home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>', map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>', day: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', fav: '<path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z"/>', more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>', back: '<path d="M15 5l-7 7 7 7"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', pin: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.800 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>', share: '<path d="M12 3v13M7 8l5-5 5 5M5 14v6h14v-6"/>', go: '<path d="M9 5l7 7-7 7"/>', euro: '<path d="M17 6.5A6.5 6.500 0 1 0 17 17.5M4 10h9M4 14h9"/>', star: '<path d="M12 3l2.6 5.600 6 .7-4.500 4.100 1.300 6L12 16.500 6.600 19.400l1.300-6L3.400 9.300l6-.7z"/>', fork: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-2.500 5-2.500 8H17V3zM17 11v10"/>', bag: '<path d="M5 8h14l-1 13H6L5 8zM9 8V6a3 3 0 0 1 6 0v2"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.500 3 14.500 0 18M12 3c-3 3.500-3 14.500 0 18"/>', ad: '<path d="M4 10v4h3l5 4V6L7 10H4zM16 9a4 4 0 0 1 0 6"/>', lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.500v.5"/>', camera: '<path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>', cup: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3M11 3v3"/>', tree: '<path d="M12 3l5 7h-3l4 5H6l4-5H7zM12 15v6"/>', wave: '<path d="M3 15c2 0 2-2 4.5-2s2.5 2 4.5 2 2-2 4.5-2S19 15 21 15M3 19c2 0 2-2 4.5-2s2.5 2 4.5 2 2-2 4.5-2S19 19 21 19M12 4a4 4 0 0 1 4 4"/>', paw: '<circle cx="7" cy="10" r="1.6"/><circle cx="10.5" cy="6.5" r="1.6"/><circle cx="14.5" cy="6.5" r="1.6"/><circle cx="18" cy="10" r="1.6"/><path d="M12.5 12c-3 0-5 3.5-5 5.5 0 1.5 1.5 2 2.5 1.5s2-.5 2.5-.5 1.5 0 2.5.5 2.5 0 2.5-1.5c0-2-2-5.5-5-5.5z"/>', basket: '<path d="M3 10h18l-2 10H5zM8 10l3-6M16 10l-3-6M9 14v3M15 14v3"/>', cible: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>', castle: '<path d="M3 21V9h2V6h2v3h2V6h2v3h2V6h2v3h2V6h2v3h2v12z"/><path d="M10 21v-3.5a2 2 0 0 1 4 0V21M3 13h18M6.5 16.5h1M16.5 16.5h1"/>', ticket: '<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 6v12" stroke-dasharray="2 2"/>', bed: '<path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5M7 11.500a1.500 1.500 0 1 0 0-.01"/>' };
  const svg = (n, cl) => `<svg class="ic ${cl || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic[n]}</svg>`;
  const chip = (act, val, label, on) => `<button class="chip${on ? ' on' : ''}" data-act="${act}" data-val="${esc(val)}" aria-pressed="${on ? 'true' : 'false'}">${esc(label)}</button>`;
  // Photo d'illustration de la catégorie (restaurants, hôtels…) : vraie photo libre de droits, jamais présentée comme celle du lieu (mention « Illustration »).
  const illus = cat => window.ACDT_ILLUS && window.ACDT_ILLUS[cat] ? `<img src="img/illus/${cat}.jpg" alt="" loading="lazy" onerror="this.parentNode.classList.add('sans');this.remove()"><span class="ph-tag">${esc(t('illus_tag'))}</span>` : '';
  // Vraies photos uniquement. Un lieu sans photo affiche la photo réelle de sa ville, avec la mention « Photo de la ville ».
  const scene = cat => (window.ACDT_SCENES || {})[cat] || '';
  function photo(l, cl) {
    // Dans les listes, un lieu sans photo propre n'affiche plus la même photo de ville partout : une vignette avec l'icône de sa catégorie.
    if (!l.photo && cl !== 'grande') return `<div class="ph ph-cat scn ${cl || ''}" style="--c:${TEINTE[l.cat] || '#1d3f8a'}" role="img" aria-label="${esc(nomDe(l))}">${scene(l.cat) || `<span class="ph-rond">${svg(ICONE[l.cat] || 'pin')}</span>`}<span class="ph-tag">${esc(t('illus_tag'))}</span></div>`;
    const p = l.photo || (ville(l.ville) || {}).photo;
    return `<div class="ph ${cl || ''}">${p ? `<img src="${esc(p.url)}" alt="${esc(nomDe(l))}" loading="lazy" onerror="this.remove()">` : ''}${!l.photo && p ? `<span class="ph-tag">${esc(t('city_view'))}</span>` : ''}</div>`;
  }
  function badge(st) { return st === 'open' ? `<span class="bdg ok">${esc(t('open_now'))}</span>` : st === 'closed' ? `<span class="bdg ko">${esc(t('closed_now'))}</span>` : ''; }
  function carteLieu(x, mode) {
    const l = x.l, v = ville(l.ville), fav = S.favs.includes(l.id);
    const meta = `<span class="pill">${esc(t('c_' + l.cat))}</span><span class="pill ${estGratuit(l) ? 'vert' : ''}">${esc(prixTxt(l))}</span>${x.d != null ? `<span class="pill">${svg('pin', 'mini')}${esc(fmtDist(x.d))}</span>` : ''}`;
    return `<article class="lieu ${mode}" data-act="ouvrir" data-val="${l.id}" tabindex="0" role="link" aria-label="${esc(nomDe(l))}">
      ${photo(l)}
      <button class="coeur${fav ? ' on' : ''}" data-act="fav" data-val="${l.id}" aria-label="${esc(t(fav ? 'fav_del' : 'fav_add'))}">${svg('fav')}</button>
      <div class="lieu-txt"><h3>${esc(nomDe(l))}</h3><p class="lieu-ville">${esc(v.nom)} ${badge(x.st)}</p>
      ${mode !== 'grid' ? `<div class="pills">${meta}</div>` : ''}
      ${mode === 'cards' ? `<span class="lien">${esc(t('details'))} ${svg('go', 'mini')}</span>${l.site && /^https?:\/\//.test(l.site) ? `<a class="lien lien-site" data-act="site" href="${esc(l.site)}" target="_blank" rel="noopener">${esc(t('f_site'))} ↗</a>` : ''}` : ''}</div></article>`;
  }
  const entete = (titre, retour) => `<header class="top">${retour !== false ? `<button class="rond" data-act="retour" aria-label="${esc(t('back'))}">${svg('back')}</button>` : ''}<h1>${esc(titre)}</h1></header>`;
  const vide = (msg, tip) => `<div class="vide"><div class="vide-ic">${svg('search')}</div><p><strong>${esc(msg)}</strong></p>${tip ? `<p>${esc(tip)}</p>` : ''}</div>`;
  const rangee = (act, val, icone, label, valeur) => `<button class="rangee" data-act="${act}" data-val="${esc(val || '')}"><span class="rg-ic">${svg(icone)}</span><span class="rg-txt"><small>${esc(label)}</small><b>${esc(valeur)}</b></span>${svg('go', 'mini')}</button>`;

  const lienStudio = () => `<a class="studio" href="${esc(CONFIG.URL_STUDIO)}" target="_blank" rel="noopener" title="Conte Games Studio"><img src="img/conte_games.jpg" alt="" width="26" height="26" loading="lazy">${esc(t('other_apps'))}</a>`;
  // ---------- écrans ----------
  const E = {};
  const resumeCats = () => S.cats.length ? S.cats.map(c => t('c_' + c)).join(', ') : t('c_chip');
  const resumeBudget = () => t({ all: 'b_all', free: 'b_free', paid: 'b_paid', unknown: 'b_unknown' }[S.budget]);
  const TOTAL = D.villes.reduce((a, v) => a + (v.n || 0), 0);
  const resumeVille = () => pos ? t('near_me') : (S.city && ville(S.city) ? ville(S.city).nom : t('choose_city_short'));

  E.accueil = () => {
    const quand = ['now', 'today', 'weekend', 'date'].map(w => chip('when', w, t('w_' + w), S.when === w)).join('');
    const duree = [['any', 'any'], ['30', 'd_30'], ['60', 'd_60'], ['half', 'd_half'], ['full', 'd_full']].map(([v, k]) => chip('dur', v, t(k), S.dur === v)).join('');
    const qui = [['any', 'any'], ['family', 'who_family'], ['couple', 'who_couple'], ['solo', 'who_solo'], ['friends', 'who_friends']].map(([v, k]) => chip('who', v, t(k), S.who === v)).join('');
    const carteVille = v => `<button class="vcarte" data-act="ville" data-val="${v.id}">${v.photo ? `<div class="ph"><img src="${esc(v.photo.url)}" alt="${esc(v.nom)}" loading="lazy" onerror="this.remove()"></div>` : ''}<span class="vnom">${esc(v.nom)}<small>${esc(t('n_places', { n: v.n }))}</small></span></button>`;
    const villes = D.villes.slice(0, 12).map(carteVille).join('');
    return `<section class="hero"><p class="marque"><img src="img/logo.svg" alt="" width="34" height="34"><span>À CÔTÉ DE TOI${S.lang !== 'fr' ? `<small lang="${esc(S.lang)}">${esc(t('brand_tr'))}</small>` : ''}</span></p><h1>${esc(t('app_sub'))}</h1>
      <form class="cherche" data-form="recherche" role="search">${svg('search')}<input name="q" type="search" enterkeyhint="search" autocomplete="off" placeholder="${esc(t('search_ph'))}" aria-label="${esc(t('search'))}"><button class="btn-mini" type="submit">${esc(t('search'))}</button></form>
      <button class="btn btn-clair" data-act="geo">${svg('pin')} ${esc(t('near_me'))}</button></section>
      <section class="bloc"><button class="bandeau-ch" data-act="aller" data-val="#/chateaux"><span class="bc-ic">${svg('castle')}</span><span class="bc-txt"><b>${esc(t('ch_title'))}</b><small>${esc(t('ch_sub'))}</small></span>${svg('go', 'mini')}</button>
        <div class="rangees">
        ${rangee('aller', '#/dest', 'pin', t('q_where'), resumeVille())}
        ${rangee('aller', '#/budget', 'euro', t('q_budget'), resumeBudget())}
        ${rangee('aller', '#/quoi', 'star', t('q_what'), resumeCats())}</div>
        <div class="orne" aria-hidden="true"></div>
        <h2>${esc(t('q_time'))}</h2><div class="chips">${duree}</div>
        <h2>${esc(t('q_when'))}</h2><div class="chips">${quand}</div>
        ${S.when === 'date' ? `<input class="date" type="date" data-champ="date" value="${esc(S.date || '')}" aria-label="${esc(t('w_date'))}">` : ''}
        <h2>${esc(t('q_who'))}</h2><div class="chips">${qui}</div>
        <button class="btn btn-primary large" data-act="voir">${esc(t('see_results'))}</button></section>
      <section class="bloc"><h2>${esc(t('q_where'))}</h2><div class="vcartes">${villes}</div>
      <button class="btn btn-clair bordure large" data-act="aller" data-val="#/dest">${esc(t('all_cities'))} (${D.villes.length})</button>
      <p class="note">${esc(t('data_note', { v: D.villes.length, n: TOTAL }))}</p>${lienStudio()}</section>`;
  };
  const normTxt = v => norm(v.nom + ' ' + v.dept + ' ' + v.region);
  function listeVilles(q) {
    const mots = norm(q).split(' ').filter(Boolean);
    const L = mots.length ? D.villes.filter(v => { const n = normTxt(v); return mots.every(m => n.includes(m)); }) : D.villes;
    if (!L.length) return vide(t('no_results'), t('no_results_tip'));
    return L.slice(0, mots.length ? 500 : 80).map(v => `<button class="choix${S.city === v.id && !pos ? ' on' : ''}" data-act="ville" data-val="${v.id}"><b>${esc(v.nom)}</b><small>${esc(v.dept)} · ${esc(v.region)} · ${esc(t('n_places', { n: v.n }))}</small></button>`).join('')
      + (!mots.length && L.length > 80 ? `<p class="note">${esc(t('type_city', { n: L.length }))}</p>` : '');
  }
  E.dest = () => `${entete(t('q_where'))}<section class="bloc"><button class="btn btn-clair bordure" data-act="geo">${svg('pin')} ${esc(t('near_me'))}</button>
    <div class="cherche bord">${svg('search')}<input type="search" data-filtre="villes" autocomplete="off" value="${esc(destQ)}" placeholder="${esc(t('city_ph'))}" aria-label="${esc(t('city_ph'))}"></div>
    <div class="liste-choix" id="liste-villes">${listeVilles(destQ)}</div></section>`;
  E.budget = () => {
    const n = b => { const s = S.budget; S.budget = b; const c = filtrer({ ignoreAvis: true }).length; S.budget = s; return c; };
    return `${entete(t('q_budget'))}<section class="bloc"><div class="liste-choix">${[['all', 'b_all'], ['free', 'b_free'], ['paid', 'b_paid'], ['unknown', 'b_unknown']].map(([v, k]) => `<button class="choix${S.budget === v ? ' on' : ''}" data-act="budget" data-val="${v}"><b>${esc(t(k))}</b><small>${esc(t('n_places', { n: n(v) }))}</small></button>`).join('')}</div>
    <p class="note">${esc(t('warn_check'))}</p></section>`;
  };
  E.quoi = () => { const dispo = CATS.filter(c => !S.city || !charge.has(S.city) || D.lieux.some(l => l.ville === S.city && l.cat === c));
    const tuile = c => { const l = S.city && D.lieux.find(x => x.ville === S.city && x.cat === c && x.photo);
      return `<button style="--c:${TEINTE[c] || '#1d3f8a'}" class="cat${S.cats.includes(c) ? ' on' : ''}${l || scene(c) ? ' photo' : ''}" data-act="cat" data-val="${c}" aria-pressed="${S.cats.includes(c)}">${l ? `<img src="${esc(l.photo.url)}" alt="" loading="lazy" onerror="this.remove()">` : scene(c) ? scene(c) + `<em class="cat-tag">${esc(t('illus_tag'))}</em>` : svg(ICONE[c] || 'pin', 'cat-ic')}<span>${esc(t('c_' + c))}</span></button>`; };
    return `${entete(t('q_what'))}<section class="bloc"><div class="grille-cats"><button style="--c:#1d3f8a" class="cat tout${!S.cats.length ? ' on' : ''}" data-act="cat" data-val="">${svg('globe', 'cat-ic')}<span>${esc(t('c_all'))}</span></button>${dispo.map(tuile).join('')}</div>
    <button class="btn btn-primary large" data-act="voir">${esc(t('see_results'))}</button></section>`; };

  function listeResultats(R, titre, catsFixes) {
    const filtres = `<div class="chips defile">${chip('aller', '#/dest', resumeVille(), !!(S.city || pos))}${chip('aller', '#/budget', resumeBudget(), S.budget !== 'all')}${catsFixes ? '' : chip('aller', '#/quoi', resumeCats(), S.cats.length > 0)}${chip('budget-bascule', 'free', t('price_free'), S.budget === 'free')}${chip('aller', '#/carte', t('nav_map'), false)}</div>`;
    const vues = `<div class="vues" role="group">${['cards', 'list', 'grid'].map(v => `<button class="${S.view === v ? 'on' : ''}" data-act="vue" data-val="${v}">${esc(t('view_' + v))}</button>`).join('')}</div>`;
    let corps;
    if (!S.city && !pos) corps = vide(avisRecherche || t('choose_city')) + `<button class="btn btn-primary large" data-act="aller" data-val="#/dest">${esc(t('q_where'))}</button>`;
    else if (!R.length) corps = vide(avisRecherche || t('no_results'), t('no_results_tip')) + `<button class="btn btn-clair bordure" data-act="reset">${esc(t('reset'))}</button>`;
    else { const parts = []; R.forEach((x, i) => { parts.push(carteLieu(x, S.view)); if (S.view !== 'grid' && (i + 1) % CONFIG.PUB_LISTE_TOUS_LES === 0 && i + 1 < R.length) parts.push(pubListe()); }); corps = `<div class="res ${S.view}">${parts.join('')}</div>`; }
    return `${entete(titre)}<section class="bloc">${filtres}<div class="res-tete"><span>${esc(t('n_places', { n: R.length }))}${S.q ? ' · « ' + esc(S.q) + ' »' : ''}</span>${vues}</div>${avisRecherche && R.length ? `<p class="avis">${esc(avisRecherche)}</p>` : ''}${corps}<p class="note">${esc(t('warn_check'))}</p></section>`;
  }
  E.res = () => listeResultats(filtrer(), t('results'));
  E.restaurants = () => listeResultats(filtrer({ cats: ['restaurants', 'cafes'], ignoreAvis: true }), t('c_restaurants'), true);
  E.commerces = () => listeResultats(filtrer({ cats: ['shopping', 'marches'], ignoreAvis: true }), t('c_shopping'), true);
  E.hotels = () => listeResultats(filtrer({ cats: ['hotels'], ignoreAvis: true }), t('c_hotels'), true);

  E.carte = () => `${entete(t('map_title'), false)}${S.city || pos ? `<div class="chips fam">${[['all', t('c_all'), 'map'], ['see', t('map_see'), 'camera'], ['eat', t('map_eat'), 'fork'], ['nature', t('map_nature'), 'tree'], ['sleep', t('map_sleep'), 'bed'], ['shop', t('map_shop'), 'bag']].map(([k, lab, ic]) => `<button class="chip${famCarte === k ? ' on' : ''}" data-act="fam-carte" data-val="${k}">${svg(ic, 'mini')} ${esc(lab)}</button>`).join('')}</div>` : ''}<div class="carte-boite"><div id="carte" class="carte" aria-label="${esc(t('map_title'))}"></div>${boutonIci()}</div><p class="note pad">© OpenStreetMap contributors · ${esc(S.city || pos ? t('n_places', { n: filtrer({ ignoreAvis: true }).length }) : t('all_cities') + ' (' + D.villes.length + ')')}</p>`;
  function monterCarte() {
    const el = document.getElementById('carte'); if (!el || !window.L) return;
    const R = filtrer({ ignoreAvis: true }); const v = S.city ? ville(S.city) : null;
    carte = L.map(el, { zoomControl: true, attributionControl: true, fadeAnimation: false }).setView(pos ? [pos.lat, pos.lon] : v ? [v.lat, v.lon] : [46.6, 2.5], v || pos ? 13 : 5);
    carte.attributionControl.setPrefix(false);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>' }).addTo(carte);
    poserIci();
    if (!v && (!pos || !proches.length)) {      // pas de ville choisie : la carte de France montre les villes du guide (et toi, si tu t'es localisé)
      if (pos) carte.setView([pos.lat, pos.lon], 8);
      D.villes.forEach(c => L.circleMarker([c.lat, c.lon], { radius: 5, color: '#c93338', weight: 1, fillColor: '#e5484d', fillOpacity: .85, className: 'pt-ville' }).addTo(carte)
        .bindPopup(`<b>${esc(c.nom)}</b><br>${esc(t('n_places', { n: c.n }))}<br><a href="#/res" data-act="ville-res" data-val="${c.id}">${esc(t('see_results'))} →</a>`));
      return;
    }
    const pts = [];
    R.filter(x => famCarte === 'all' || FAMILLES[famCarte].includes(x.l.cat)).forEach(x => { const l = x.l; pts.push([l.lat, l.lon]);
      const ph = l.photo || (ville(l.ville) || {}).photo;
      L.marker([l.lat, l.lon], { icon: L.divIcon({ className: 'epingle-ic', html: `<span style="--c:${TEINTE[l.cat]}">${svg(ICONE[l.cat] || 'pin')}</span>`, iconSize: [34, 40], iconAnchor: [17, 38], popupAnchor: [0, -34] }), title: nomDe(l) }).addTo(carte)
        .bindPopup(`<div class="bulle">${ph ? `<img src="${esc(ph.url)}" alt="" loading="lazy" onerror="this.remove()">` : ''}<b>${esc(nomDe(l))}</b><span>${esc(t('c_' + l.cat))} · ${esc(prixTxt(l))}</span><a href="#/lieu/${l.id}" data-act="ouvrir" data-val="${l.id}">${esc(t('details'))} →</a></div>`, { maxWidth: 220, minWidth: 180 }); });
    if (pts.length > 1) carte.fitBounds(pts, { padding: [30, 30], maxZoom: 15, animate: false });
  }

  E.lieu = id => {
    const l = lieu(id); if (!l) return entete(t('results')) + vide(t('no_results'));
    const v = ville(l.ville), fav = S.favs.includes(l.id), st = statut(l), org = origine() || v, d = dist(org, l);
    const lg = l.long && l.long[S.lang], lgRepli = !lg && l.long && (l.long.en || l.long.fr), wiki = l.wiki && (l.wiki[S.lang] || (!lg && (l.wiki.en || l.wiki.fr)));
    const hor = l.horaires ? H.format(l.horaires, t) : null;
    const courtEtr = l.court && !l.court[S.lang] && (l.court.en || l.court.fr);
    const etranger = [courtEtr ? courtDe(l) : '', !lg ? lgRepli : '', S.lang !== 'fr' && l.labels ? l.labels.join('\n') : ''].filter(Boolean).join('\n\n');
    const ligne = (k, val) => `<div class="info"><dt>${esc(k)}</dt><dd>${val}</dd></div>`;
    const acc = { yes: 'acc_yes', limited: 'acc_limited', no: 'acc_no' }[l.fauteuil];
    const g = `https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lon}`, a = `https://maps.apple.com/?daddr=${l.lat},${l.lon}&q=${encodeURIComponent(nomDe(l))}`;
    return `<div class="fiche">${photo(l, 'grande')}<button class="rond flot" data-act="retour" aria-label="${esc(t('back'))}">${svg('back')}</button>
      <button class="coeur grand${fav ? ' on' : ''}" data-act="fav" data-val="${l.id}" aria-label="${esc(t(fav ? 'fav_del' : 'fav_add'))}">${svg('fav')}</button>
      ${l.photo ? `<p class="credit"><a href="${esc(l.photo.page)}" target="_blank" rel="noopener">${esc(t('photo_by', { a: auteurOk(l.photo.auteur), l: l.photo.licence }))}</a></p>` : v.photo ? `<p class="credit">${esc(t('city_view'))} (${esc(v.nom)}) · <a href="${esc(v.photo.page)}" target="_blank" rel="noopener">${esc(t('photo_by', { a: auteurOk(v.photo.auteur), l: v.photo.licence }))}</a></p>` : `<p class="credit">${esc(t('no_photo'))}</p>`}
      <section class="bloc">${etat[l.id] ? `<p class="avis">${esc(t('unavailable'))}</p>` : ''}
      <div class="pills"><span class="pill">${esc(t('c_' + l.cat))}</span>${badge(st)}</div>
      <h1 class="titre">${esc(nomDe(l))}</h1><p class="lieu-ville">${esc(v.nom)} · ${esc(v.dept)} · ${esc(v.region)}</p>
      <p class="court">${esc(courtDe(l))}</p>${etranger ? boutonTraduire(etranger) : ''}
      <div class="actions"><a class="btn btn-primary" href="${g}" target="_blank" rel="noopener">${svg('pin')} ${esc(t('go_google'))}</a><a class="btn btn-clair bordure" href="${esc(a)}" target="_blank" rel="noopener">${svg('pin')} ${esc(t('go_apple'))}</a>
      <button class="btn btn-clair bordure" data-act="partager" data-val="${l.id}">${svg('share')} ${esc(t('share'))}</button><button class="btn btn-clair bordure" data-act="fav" data-val="${l.id}">${svg('fav')} ${esc(t(fav ? 'fav_del' : 'fav_add'))}</button></div>
      ${(r => r && !etat[l.id] ? `<div class="reserver"><a class="btn btn-or large" href="${esc(r.url)}" target="_blank" rel="noopener sponsored">${svg('ticket')} ${esc(t(r.cle))}</a>${r.part ? `<p class="note">${esc(t('book_note'))}</p>` : ''}</div>` : '')(reservation(l, v))}
      <p class="alerte">${esc(t('warn_check'))}</p>
      <dl class="infos">
        ${ligne(t('f_price'), esc(prixTxt(l)))}
        ${ligne(t('f_hours'), hor ? hor.map(esc).join('<br>') + `<small>${esc(t('hours_check'))}</small>` : esc(t('hours_check')))}
        ${ligne(t('f_address'), l.adresse ? esc(l.adresse) : esc(t('not_known')) + ` · <a href="#/carte" data-act="surcarte" data-val="${l.id}">${esc(t('on_map'))}</a>`)}
        ${l.tel ? ligne(t('f_phone'), `<a href="tel:${esc(l.tel.replace(/[^+\d]/g, ''))}">${esc(l.tel)}</a>`) : ''}
        ${l.site ? ligne(t('f_site'), `<a href="${esc(l.site)}" target="_blank" rel="noopener">${esc(l.site.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').slice(0, 42))}</a>`) : ''}
        ${l.cuisine ? ligne(t('f_cuisine'), esc(cuisineTxt(l.cuisine))) : ''}
        ${l.labels ? ligne(t('f_labels'), l.labels.map(esc).join('<br>')) : ''}
        ${ligne(pos ? t('f_distance_me') : t('f_distance', { city: v.nom }), esc(fmtDist(d)))}
        ${ligne(t('f_duration'), esc(fmtDuree(DUREE[l.cat])) + ` <small>(${esc(t('indicative'))})</small>`)}
        ${ligne(t('f_access'), esc(acc ? t(acc) : t('not_known')))}
      </dl>
      <h2>${esc(t('f_about'))}</h2>
      ${lg || lgRepli ? `${!lg ? `<p class="note">${esc(t('lang_fallback'))}</p>` : ''}<p class="long">${esc(lg || lgRepli)}</p>${etranger ? boutonTraduire(etranger) : ''}<p class="note">${esc(l.wiki ? t('text_from') : t('text_from_dt'))}${wiki ? ` · <a href="${esc(wiki)}" target="_blank" rel="noopener">${esc(t('read_more'))}</a>` : ''}</p>` : `<p class="note">${esc(t('no_desc'))}</p>`}
      <h2>${esc(t('src'))}</h2><p class="note">${l.sources.filter(s => s.url).map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.nom)}</a> (${esc(s.licence)})`).join(' · ')}<br>${l.majSource ? esc(t('source_updated', { d: fmtDate(l.majSource) })) + '<br>' : ''}${esc(t('verified', { d: fmtDate(l.recupere) }))}</p>
      <button class="btn btn-clair bordure large" data-act="aller" data-val="#/signal/${l.id}">${esc(t('report'))}</button></section></div>`;
  };

  // « Tu es ici » : la position n'est demandée qu'au clic, gardée en mémoire seulement (jamais enregistrée ni envoyée)
  function localiser(versCarte) {
    if (!navigator.geolocation) return toast(t('geo_denied'));
    navigator.geolocation.getCurrentPosition(p => { pos = { lat: p.coords.latitude, lon: p.coords.longitude, ici: true };
      if (!proches.length) proches = D.villes.map(v => ({ v, d: dist(pos, v) })).filter(x => x.d <= 25).sort((a, b) => a.d - b.d).slice(0, 4).map(x => x.v.id);
      if (versCarte && carte) { poserIci(); carte.setView([pos.lat, pos.lon], 12); } else rendre(); },
      () => toast(t('geo_denied')), { enableHighAccuracy: true, timeout: 12000, maximumAge: 120000 });
  }
  function poserIci() {
    if (!carte || !pos || !window.L) return;
    L.marker([pos.lat, pos.lon], { icon: L.divIcon({ className: 'ici', html: '<span></span>', iconSize: [22, 22], iconAnchor: [11, 11] }), title: t('you_here'), zIndexOffset: 1000 }).addTo(carte).bindPopup(`<b>${esc(t('you_here'))}</b>`);
  }
  const boutonIci = () => `<button class="rond ici-btn" data-act="localiser" aria-label="${esc(t('near_me'))}" title="${esc(t('near_me'))}">${svg('cible')}</button>`;
  // texte pas encore dans la langue choisie : bouton qui ouvre la traduction (Google Traduction, gratuit, sans compte)
  const GT = { 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', fil: 'tl', nb: 'no', he: 'iw' };
  const boutonTraduire = txt => !txt ? '' : `<a class="btn traduire" href="https://translate.google.com/?sl=auto&tl=${encodeURIComponent(GT[S.lang] || S.lang)}&op=translate&text=${encodeURIComponent(String(txt).slice(0, 4800))}" target="_blank" rel="noopener">${svg('globe')} <span>${esc(t('translate_btn'))}<small>${esc(LANGS[li()].n)}</small></span></a>`;
  // ---------- Châteaux de France (fichiers donnees/chateaux : index.js + txt_<langue>.js, chargés à la demande) ----------
  const CHX = () => window.ACDT_CHATEAUX, CTX = c => (window.ACDT_CHATEAUX_TXT || {})[c];
  const chargerScript = src => new Promise(res => { const sc = document.createElement('script'); sc.src = src; sc.onload = sc.onerror = () => res(); document.head.appendChild(sc); });
  const chEnCours = {};
  const chargerCh = f => chEnCours[f] || (chEnCours[f] = chargerScript('donnees/chateaux/' + f + '.js'));
  const chateau = id => CHX() && CHX().liste.find(c => c.id === id);
  const chT = (c, k, lang) => { const x = (CTX(lang || S.lang) || {})[c.id]; return x ? x[k] : undefined; };
  const auteurOk = a => !a || /no machine-readable|unknown author|auteur inconnu/i.test(a) ? 'Wikimedia Commons' : a;
  const maj1 = x => x ? x.charAt(0).toLocaleUpperCase(S.lang) + x.slice(1) : x;
  const chNom = c => maj1(chT(c, 'n') || c.nom);
  const chLib = q => { const L = CHX().libelles[q] || {}; return L[S.lang] || L.en || L.fr || null; };
  const chLieu = c => {
    if (!c.commune && !c.dept) { const v = D.villes.map(x => ({ x, d: dist(c, x) })).sort((a, b) => a.d - b.d)[0]; if (v && v.d < 12) return [v.x.nom, v.x.dept, v.x.region].filter(Boolean).join(' · '); }
    return [c.commune, c.dept ? c.dept + (c.depCode ? ' (' + c.depCode + ')' : '') : null, c.region].filter(Boolean).join(' · '); };
  let chQ = '', chN = 60, chVue = 'grid';
  function chFiltres() {
    let L = CHX().liste.slice();
    if (S.chReg) L = L.filter(c => c.region === S.chReg);
    if (chQ) { const q = norm(chQ); L = L.filter(c => norm(chNom(c) + ' ' + c.nom + ' ' + chLieu(c)).includes(q)); }
    const o = origine();
    if (S.chTri === 'near' && o) L.sort((a, b) => dist(o, a) - dist(o, b));
    return L;
  }
  const chCarte = c => { const o = origine(), d = S.chTri === 'near' && o ? dist(o, c) : null;
    return `<article class="lieu grid ch" data-act="aller" data-val="#/chateau/${c.id}" tabindex="0" role="link" aria-label="${esc(chNom(c))}">
      <div class="ph"><img src="${esc(c.photo.url)}" alt="${esc(chNom(c))}" loading="lazy" onerror="this.remove()"></div>
      <button class="coeur${S.favs.includes(c.id) ? ' on' : ''}" data-act="fav" data-val="${c.id}" aria-label="${esc(t(S.favs.includes(c.id) ? 'fav_del' : 'fav_add'))}">${svg('fav')}</button>
      <div class="lieu-txt"><h3>${esc(chNom(c))}</h3><p class="lieu-ville">${esc(c.commune || chLieu(c).split(' · ')[0] || '')}${c.annee ? ' · ' + c.annee : ''}${d != null ? ' · ' + esc(fmtDist(d)) : ''}</p></div></article>`; };
  E.chateaux = () => {
    const X = CHX(); if (!X) return entete(t('ch_title')) + vide(t('ch_none'));
    const regions = [...new Set(X.liste.map(c => c.region).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'));
    const L = chFiltres(), o = origine();
    return `<section class="hero court ch-hero photo" style="--fond:url('${esc(X.liste[0].photo.url)}')"><button class="rond" data-act="retour" aria-label="${esc(t('back'))}">${svg('back')}</button><p class="marque">${svg('castle')} ${esc(t('ch_title'))}</p>
      <h1>${esc(t('ch_sub'))}</h1><p class="sous">${esc(t('ch_count', { n: X.n }))}</p>
      <form class="cherche" data-form="ch-recherche" role="search">${svg('search')}<input name="q" type="search" value="${esc(chQ)}" autocomplete="off" placeholder="${esc(t('ch_search'))}" aria-label="${esc(t('ch_search'))}"><button class="btn-mini" type="submit">${esc(t('search'))}</button></form></section>
      <section class="bloc"><label class="sr-only" for="ch-reg">${esc(t('ch_all_regions'))}</label><select id="ch-reg" class="select" data-champ="chReg"><option value="">${esc(t('ch_all_regions'))}</option>${regions.map(r => `<option ${S.chReg === r ? 'selected' : ''}>${esc(r)}</option>`).join('')}</select>
      <div class="chips">${chip('chTri', 'famous', t('ch_famous'), S.chTri !== 'near')}${chip('chTri', 'near', t('ch_near'), S.chTri === 'near')}</div>
      ${S.chTri === 'near' && !o ? `<p class="note">${esc(t('choose_city'))}</p><button class="btn btn-clair bordure" data-act="geo">${svg('pin')} ${esc(t('near_me'))}</button>` : ''}
      <div class="vues" role="group"><button class="${chVue === 'grid' ? 'on' : ''}" data-act="ch-vue" data-val="grid">${esc(t('view_grid'))}</button><button class="${chVue === 'map' ? 'on' : ''}" data-act="ch-vue" data-val="map">${esc(t('nav_map'))}</button></div>
      <p class="note">${esc(t('ch_count', { n: L.length }))}</p>
      ${!L.length ? vide(t('ch_none')) : chVue === 'map' ? `<div class="carte-boite"><div id="ch-carte" class="carte ch-carte"></div>${boutonIci()}</div><p class="note">© OpenStreetMap contributors</p>`
        : `<div class="res grid">${L.slice(0, chN).map(chCarte).join('')}</div>${L.length > chN ? `<button class="btn btn-clair bordure large" data-act="ch-plus">${esc(t('ch_more'))} (${L.length - chN})</button>` : ''}`}
      <p class="note">${esc(t('src'))} : Wikidata (CC0) · Wikipédia (CC BY-SA 4.0) · Wikimedia Commons</p></section>`;
  };
  function monterCarteCh() {
    const el = document.getElementById('ch-carte'); if (!el || !window.L) return;
    carte = L.map(el, { zoomControl: true, fadeAnimation: false }).setView([46.6, 2.5], 5); carte.attributionControl.setPrefix(false);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>' }).addTo(carte);
    const L2 = chFiltres(), pts = [];
    L2.forEach(c => { pts.push([c.lat, c.lon]); L.circleMarker([c.lat, c.lon], { radius: 6, color: '#7a5a10', weight: 1, fillColor: '#f2b441', fillOpacity: .95, className: 'pt-ch' }).addTo(carte)
      .bindPopup(`<b>${esc(chNom(c))}</b><br>${esc(c.commune || '')}${c.annee ? ' · ' + c.annee : ''}<br><a href="#/chateau/${c.id}">${esc(t('details'))} →</a>`); });
    if (pts.length && pts.length < 60) carte.fitBounds(pts, { padding: [30, 30], maxZoom: 13, animate: false });
    poserIci(); if (pos && S.chTri === 'near') carte.setView([pos.lat, pos.lon], 9);
  }
  E.chateau = id => {
    const c = chateau(id); if (!c) return entete(t('ch_title')) + vide(t('ch_none'));
    const fav = S.favs.includes(c.id), o = origine();
    const hist = chT(c, 'h'), res = chT(c, 'r'), repli = !hist && !res, hR = hist || res || chT(c, 'h', 'en') || chT(c, 'r', 'en') || chT(c, 'h', 'fr') || chT(c, 'r', 'fr');
    const wiki = chT(c, 'w') || (repli && (chT(c, 'w', 'en') || chT(c, 'w', 'fr')));
    const court = chT(c, 'c') || chT(c, 'c', 'en') || chT(c, 'c', 'fr') || '';
    const etranger = [!chT(c, 'c') && court ? court : '', repli && hR ? hR : ''].filter(Boolean).join('\n\n');
    const ligne = (k, val) => val ? `<div class="info"><dt>${esc(k)}</dt><dd>${val}</dd></div>` : '';
    const libs = k => [...new Set((c.faits[k] || []).map(chLib).filter(Boolean).map(maj1))].map(esc).join(', ');
    const g = `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lon}`, a = `https://maps.apple.com/?daddr=${c.lat},${c.lon}&q=${encodeURIComponent(chNom(c))}`;
    const gyg = `https://www.getyourguide.com/s/?q=${encodeURIComponent(c.nom + (c.commune ? ' ' + c.commune : ''))}${LOC_GYG[S.lang] ? '&locale=' + LOC_GYG[S.lang] : ''}${CONFIG.GYG_PARTENAIRE ? '&partner_id=' + encodeURIComponent(CONFIG.GYG_PARTENAIRE) + '&cmp=acdt-chateaux' : ''}`;
    const voisins = (c.proches || []).map(chateau).filter(Boolean);
    const paras = hR ? hR.split(/\n+/).map(p => `<p class="long">${esc(p)}</p>`).join('') : '';
    return `<div class="fiche"><div class="ph grande"><img src="${esc(c.photo.url)}" alt="${esc(chNom(c))}" onerror="this.remove()"></div><button class="rond flot" data-act="retour" aria-label="${esc(t('back'))}">${svg('back')}</button>
      <button class="coeur grand${fav ? ' on' : ''}" data-act="fav" data-val="${c.id}" aria-label="${esc(t(fav ? 'fav_del' : 'fav_add'))}">${svg('fav')}</button>
      <p class="credit"><a href="${esc(c.photo.page)}" target="_blank" rel="noopener">${esc(t('photo_by', { a: auteurOk(c.photo.auteur), l: c.photo.licence }))}</a></p>
      <section class="bloc"><div class="pills"><span class="pill">${svg('castle', 'mini')} ${esc(t('c_chateaux'))}</span>${c.annee ? `<span class="pill">${c.annee}</span>` : ''}</div>
      <h1 class="titre">${esc(chNom(c))}</h1><p class="lieu-ville">${esc(chLieu(c))}</p>${court ? `<p class="court">${esc(court)}</p>` : ''}${etranger ? boutonTraduire(etranger) : ''}
      <div class="actions"><a class="btn btn-primary" href="${g}" target="_blank" rel="noopener">${svg('pin')} ${esc(t('go_google'))}</a><a class="btn btn-clair bordure" href="${esc(a)}" target="_blank" rel="noopener">${svg('pin')} ${esc(t('go_apple'))}</a>
      <button class="btn btn-clair bordure" data-act="ch-partager" data-val="${c.id}">${svg('share')} ${esc(t('share'))}</button><button class="btn btn-clair bordure" data-act="fav" data-val="${c.id}">${svg('fav')} ${esc(t(fav ? 'fav_del' : 'fav_add'))}</button></div>
      <div class="reserver"><a class="btn btn-or large" href="${esc(gyg)}" target="_blank" rel="noopener sponsored">${svg('ticket')} ${esc(t('book'))}</a>${CONFIG.GYG_PARTENAIRE ? `<p class="note">${esc(t('book_note'))}</p>` : ''}</div>
      <p class="alerte">${esc(t('warn_check'))}</p>
      <dl class="infos">${ligne(t('ch_built'), c.annee ? String(c.annee) : '')}${ligne(t('ch_architect'), libs('architecte'))}${ligne(t('ch_style'), libs('style'))}${ligne(t('ch_protection'), libs('protection'))}
        ${c.site ? ligne(t('f_site'), `<a href="${esc(c.site)}" target="_blank" rel="noopener">${esc(c.site.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').slice(0, 42))}</a>`) : ''}
        ${o ? ligne(pos ? t('f_distance_me') : t('f_distance', { city: o.nom }), esc(fmtDist(dist(o, c)))) : ''}</dl>
      <h2>${esc(t('ch_where'))}</h2><p class="court">${esc(chLieu(c))}</p><div id="ch-mini" class="carte ch-mini" data-lat="${c.lat}" data-lon="${c.lon}"></div>
      <h2>${esc(t('ch_history'))}</h2>${hR ? `${repli ? `<p class="note">${esc(t('lang_fallback'))}</p>` : ''}${paras}${repli && etranger ? boutonTraduire(etranger) : ''}<p class="note">${esc(t('text_from'))}${wiki ? ` · <a href="${esc(wiki)}" target="_blank" rel="noopener">${esc(t('read_more'))}</a>` : ''}</p>` : `<p class="note">${esc(t('no_desc'))}</p>`}
      ${voisins.length ? `<h2>${esc(t('ch_nearby'))}</h2><div class="res grid">${voisins.map(chCarte).join('')}</div>` : ''}
      <h2>${esc(t('src'))}</h2><p class="note"><a href="https://www.wikidata.org/wiki/${esc(c.qid)}" target="_blank" rel="noopener">Wikidata</a> (CC0) · Wikipédia (CC BY-SA 4.0) · <a href="${esc(c.photo.page)}" target="_blank" rel="noopener">Wikimedia Commons</a><br>${esc(t('verified', { d: fmtDate(c.recupere) }))}</p>
      <a class="btn btn-clair bordure large" href="mailto:${esc(CONFIG.MAIL_SIGNALEMENT)}?subject=${encodeURIComponent('À Côté de Toi — ' + c.nom + ' (' + c.id + ')')}">${esc(t('report'))}</a></section></div>`;
  };
  function monterMiniCh() {
    const el = document.getElementById('ch-mini'); if (!el || !window.L) return; const p = [+el.dataset.lat, +el.dataset.lon];
    carte = L.map(el, { zoomControl: false, dragging: true, scrollWheelZoom: false, fadeAnimation: false }).setView(p, 11); carte.attributionControl.setPrefix(false);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(carte);
    L.circleMarker(p, { radius: 9, color: '#7a5a10', weight: 2, fillColor: '#f2b441', fillOpacity: 1 }).addTo(carte);
  }
  function besoinsCh(nom, arg) {           // fichiers « châteaux » à charger avant d'afficher
    const f = []; const veut = nom === 'chateaux' || nom === 'chateau' || (nom === 'fav' && S.favs.some(x => x.startsWith('ch-')));
    if (!veut) return f;
    if (!CHX()) f.push('index'); if (!CTX(S.lang)) f.push('txt_' + S.lang);
    if (nom === 'chateau' && CHX()) { const c = chateau(arg); if (c && !chT(c, 'h') && !chT(c, 'r')) { if (!CTX('en')) f.push('txt_en'); if (!CTX('fr')) f.push('txt_fr'); } }
    return f.filter(x => !chEnCours[x] || !chEnCours[x].fini);
  }
  E.fav = () => { const L = S.favs.map(lieu).filter(Boolean).map(l => ({ l, st: statut(l), d: origine() ? dist(origine(), l) : null })), FC = CHX() ? S.favs.map(chateau).filter(Boolean) : [];
    return `${entete(t('nav_fav'), false)}<section class="bloc">${L.length || FC.length ? `${L.length ? `<div class="res list">${L.map(x => carteLieu(x, 'list')).join('')}</div>` : ''}${FC.length ? `<h2>${esc(t('ch_title'))}</h2><div class="res grid">${FC.map(chCarte).join('')}</div>` : ''}` : vide(t('fav_empty'))}</section>`; };
  E.hist = () => { const L = S.hist.map(lieu).filter(Boolean).map(l => ({ l, st: null, d: null }));
    return `${entete(t('hist'))}<section class="bloc">${L.length ? `<div class="res list">${L.map(x => carteLieu(x, 'list')).join('')}</div><button class="btn btn-clair bordure large" data-act="hist-vider">${esc(t('hist_clear'))}</button>` : vide(t('hist_empty'))}</section>`; };
  E.plus = () => `${entete(t('nav_more'), false)}<section class="bloc"><div class="rangees">
    ${rangee('aller', '#/restaurants', 'fork', t('c_restaurants'), resumeVille())}${rangee('aller', '#/commerces', 'bag', t('c_shopping'), resumeVille())}${rangee('aller', '#/hotels', 'bed', t('c_hotels'), resumeVille())}${rangee('aller', '#/chateaux', 'castle', t('ch_title'), t('ch_sub'))}
    ${rangee('aller', '#/hist', 'clock', t('hist'), t('n_places', { n: S.hist.length }))}</div>
    ${lienStudio()}<h2>${esc(t('settings'))}</h2><div class="rangees">
    ${rangee('aller', '#/langue', 'globe', t('language'), LANGS[li()].n)}${NATIF || CONFIG.PUB_TEST ? rangee('aller', '#/pubs', 'ad', t('ads'), NATIF ? t('ads_manage') : (S.noAds ? t('ads_noads') : t('ad_test'))) : ''}
    ${rangee('aller', '#/conf', 'lock', t('privacy'), '')}${rangee('aller', '#/apropos', 'info', t('about'), '')}</div></section>`;
  function grilleLangues(acc) {
    const tel = langueTel(), ord = [LANGS.find(l => l.c === tel), ...LANGS.filter(l => l.c !== tel)];
    return `<div class="langues">${ord.map(l => `<button class="langue${S.lang === l.c ? ' on' : ''}" data-act="${acc ? 'langue-1' : 'langue'}" data-val="${l.c}" lang="${l.c}" dir="${l.dir}"><b>${esc(l.n)}</b>${l.c === tel ? `<small>${esc(l.tel)}</small>` : ''}</button>`).join('')}</div>`;
  }
  E.langue = () => `${entete(t('language'))}<section class="bloc">${grilleLangues(false)}</section>`;
  E.bienvenue = () => `<section class="hero court"><p class="marque"><img src="img/logo.svg" alt="" width="34" height="34"><span>À CÔTÉ DE TOI${S.lang !== 'fr' ? `<small lang="${esc(S.lang)}">${esc(t('brand_tr'))}</small>` : ''}</span></p><h1>${esc(t('choose_lang'))}</h1><p class="sous">Choose your language · Elige tu idioma · 选择语言 · اختر لغتك</p></section><section class="bloc">${grilleLangues(true)}</section>`;
  E.conf = () => `${entete(t('privacy'))}<section class="bloc texte">${[1, 2, 3, 4, 5].map(i => `<p>${esc(t('priv_' + i))}</p>`).join('')}</section>`;
  E.apropos = () => `${entete(t('about'))}<section class="bloc texte"><p>${esc(t('about_text'))}</p><p class="note">${esc(t('data_note', { v: D.villes.length, n: TOTAL }))} · ${esc(fmtDate(D.genere))}</p><p class="note">${esc(t('photo_by', { a: 'Benoît Prieur', l: 'CC0' }))} · <a href="https://commons.wikimedia.org/wiki/File:Rue_de_la_Halle_%C3%A0_P%C3%A9rouges_en_avril_2021.jpg" target="_blank" rel="noopener">Pérouges, Wikimedia Commons</a></p>
    ${window.ACDT_ILLUS ? `<h2 class="sous">${esc(t('illus_title'))}</h2><ul class="credits">${Object.entries(window.ACDT_ILLUS).map(([c, v]) => `<li><b>${esc(t('c_' + c))}</b> · <a href="${esc(v.page)}" target="_blank" rel="noopener">${esc(v.titre)}</a> · ${esc(auteurOk(v.auteur))}, ${esc(v.licence)}</li>`).join('')}</ul>` : ''}</section>`;
  E.pubs = () => `${entete(t('ads'))}<section class="bloc texte"><p>${esc(t('ads_text'))}</p>
    ${NATIF ? `<button class="btn btn-primary large" data-act="pub-choix">${esc(t('ads_manage'))}</button>` : `<label class="bascule"><span>${esc(t('ads_perso'))}</span><input type="checkbox" data-champ="adsPerso" ${S.adsPerso ? 'checked' : ''}></label>
    <label class="bascule"><span>${esc(t('ads_noads'))}<small>${esc(t('ads_noads_test'))}</small></span><input type="checkbox" data-champ="noAds" ${S.noAds ? 'checked' : ''}></label>
    ${pubListe()}`}</section>`;
  E.signal = id => { const l = lieu(id); if (!l) return entete(t('report')) + vide(t('no_results'));
    return `${entete(t('report'))}<section class="bloc"><p class="court"><b>${esc(nomDe(l))}</b> · ${esc(ville(l.ville).nom)}</p><form data-form="signal" data-id="${l.id}">
    <h2>${esc(t('rep_what'))}</h2><div class="liste-choix">${['closed', 'hours', 'price', 'addr', 'other'].map((k, i) => `<label class="choix radio"><input type="radio" name="type" value="${k}" ${i === 0 ? 'checked' : ''}><b>${esc(t('rep_' + k))}</b></label>`).join('')}</div>
    <textarea name="msg" rows="4" maxlength="800" placeholder="${esc(t('rep_msg'))}" aria-label="${esc(t('rep_msg'))}"></textarea>
    <button class="btn btn-primary large" type="submit">${esc(t('rep_send'))}</button></form></section>`; };

  // ---------- programme de journée ----------
  let J = { city: null, dur: 'full', budget: 'all', tr: 'walk', who: 'any', n: 2 };
  function construire() {
    const cid = J.city || S.city || D.villes[0].id, v = ville(cid), saut = { walk: 2.5, transit: 6, car: 15 }[J.tr], aff = AFFINITE[J.who] || [];
    const tous = D.lieux.filter(l => l.ville === cid && !etat[l.id]);
    const repas = tous.filter(l => l.cat === 'restaurants'), cafes = tous.filter(l => l.cat === 'cafes');
    let vis = tous.filter(l => !['restaurants', 'cafes', 'shopping', 'hotels'].includes(l.cat)); if (J.budget === 'free') vis = vis.filter(estGratuit);
    const pris = new Set(), etapes = []; let dernier = null; const jour = dateRef();
    const ouvert = l => { const p = l.horaires && H.parse(l.horaires); return p ? H.openOnDay(p, jour) : null; };
    const choisir = (pool, moment, repasFlag) => {
      let c = pool.filter(l => !pris.has(l.id) && ouvert(l) !== false);
      if (dernier) { const pres = c.filter(l => dist(dernier, l) <= saut); if (pres.length) c = pres; else if (!repasFlag) c = c.slice().sort((a, b) => dist(dernier, a) - dist(dernier, b)).slice(0, 3); }
      if (!c.length) return;
      const cats = new Set(etapes.map(e => e.l.cat));
      c = c.map(l => ({ l, s: (aff.includes(l.cat) ? 3 : 0) + (cats.has(l.cat) ? 0 : 2) - (dernier ? dist(dernier, l) / saut * (repasFlag ? 4 : 1.5) : 0) - tous.indexOf(l) * 0.08 })).sort((a, b) => b.s - a.s);
      const l = c[0].l, pq = [];
      if (repasFlag) pq.push(t('why_meal')); else { if (tous.indexOf(l) < 5) pq.push(t('why_known')); pq.push(t('why_cat', { c: t('c_' + l.cat) })); }
      if (!repasFlag && estGratuit(l)) pq.push(t('why_free'));
      if (aff.includes(l.cat)) pq.push(t('why_who', { w: t('who_' + J.who) }));
      if (dernier) pq.push(t('why_near', { d: fmtDist(dist(dernier, l)) }));
      if (ouvert(l) === true) pq.push(t('why_open'));
      pris.add(l.id); dernier = l; etapes.push({ l, moment, pq });
    };
    choisir(vis, 'morning'); choisir(vis, 'morning');
    choisir(repas.length ? repas : cafes, 'lunch', true);
    if (J.dur === 'full') { choisir(vis, 'afternoon'); choisir(vis, 'afternoon'); choisir(cafes, 'afternoon', true); choisir(vis.filter(estGratuit), 'evening'); choisir(repas, 'evening', true); }
    plan = { v, etapes, ok: etapes.filter(e => !['restaurants', 'cafes'].includes(e.l.cat)).length >= 1 }; planDetail = S.noAds;
  }
  E.jour = () => {
    const sel = (act, opts, cur) => `<div class="chips">${opts.map(([v, k, brut]) => chip(act, v, brut ? k : t(k), cur === v)).join('')}</div>`;
    const cid = J.city || S.city || D.villes[0].id;
    let rendu = '';
    if (plan) {
      if (!plan.ok) rendu = vide(t('day_none'));
      else { const moments = ['morning', 'lunch', 'afternoon', 'evening'];
        rendu = `<p class="alerte">${esc(t('day_warn'))}</p>` + moments.map(m => { const es = plan.etapes.filter(e => e.moment === m); if (!es.length) return '';
          return `<h2>${esc(t('day_' + m))}</h2>` + es.map(e => `<article class="etape" data-act="ouvrir" data-val="${e.l.id}" tabindex="0" role="link">${photo(e.l)}<div><h3>${esc(nomDe(e.l))}</h3><div class="pills"><span class="pill">${esc(t('c_' + e.l.cat))}</span><span class="pill ${estGratuit(e.l) ? 'vert' : ''}">${esc(prixTxt(e.l))}</span>${planDetail ? `<span class="pill">${esc(fmtDuree(DUREE[e.l.cat]))}</span>` : ''}</div>${planDetail ? `<p class="pq"><b>${esc(t('why'))}</b> ${e.pq.map(esc).join(' · ')}</p>` : ''}</div></article>`).join(''); }).join('')
          + (planDetail ? '' : `<button class="btn btn-clair bordure large" data-act="debloquer">${esc(t('day_unlock'))}</button>`);
      }
    }
    return `${entete(t('day_title'), false)}<section class="bloc">
      <h2>${esc(t('city'))}</h2><select class="date" data-champ="jcity" aria-label="${esc(t('city'))}">${D.villes.slice().sort((a, b) => a.nom.localeCompare(b.nom, 'fr')).map(v => `<option value="${v.id}"${v.id === cid ? ' selected' : ''}>${esc(v.nom)}</option>`).join('')}</select>
      <h2>${esc(t('q_time'))}</h2>${sel('j-dur', [['half', 'd_half'], ['full', 'd_full']], J.dur)}
      <h2>${esc(t('q_budget'))}</h2>${sel('j-budget', [['all', 'b_all'], ['free', 'b_free']], J.budget)}
      <h2>${esc(t('day_transport'))}</h2>${sel('j-tr', [['walk', 't_walk'], ['transit', 't_transit'], ['car', 't_car']], J.tr)}
      <h2>${esc(t('q_who'))}</h2>${sel('j-who', [['any', 'any'], ['family', 'who_family'], ['couple', 'who_couple'], ['solo', 'who_solo'], ['friends', 'who_friends']], J.who)}
      <h2>${esc(t('day_people'))}</h2><div class="pas"><button class="rond" data-act="j-n" data-val="-1" aria-label="-">−</button><b>${J.n}</b><button class="rond" data-act="j-n" data-val="1" aria-label="+">+</button></div>
      <button class="btn btn-primary large" data-act="j-go">${esc(t('day_build'))}</button><div id="plan">${rendu}</div></section>`;
  };

  // ---------- navigation ----------
  const ROUTES = { '': 'accueil', dest: 'dest', budget: 'budget', quoi: 'quoi', res: 'res', carte: 'carte', lieu: 'lieu', jour: 'jour', restaurants: 'restaurants', commerces: 'commerces', hotels: 'hotels', bienvenue: 'bienvenue', fav: 'fav', hist: 'hist', plus: 'plus', langue: 'langue', conf: 'conf', pubs: 'pubs', signal: 'signal', apropos: 'apropos', chateaux: 'chateaux', chateau: 'chateau' };
  const ONGLETS = [['', 'home', 'nav_home'], ['carte', 'map', 'nav_map'], ['jour', 'day', 'nav_day'], ['fav', 'fav', 'nav_fav'], ['plus', 'more', 'nav_more']];
  let focusCarte = null;
  function besoins(nom, arg) {
    const b = new Set(), add = x => { if (x && ville(x) && !charge.has(x)) b.add(x); };
    if (['res', 'carte', 'restaurants', 'commerces', 'hotels', 'quoi', 'budget'].includes(nom)) add(S.city);
    if (nom === 'lieu' || nom === 'signal') add(S.vd[arg] || S.city);
    if (nom === 'jour') add(J.city || S.city || D.villes[0].id);
    if (nom === 'fav') S.favs.forEach(i => add(S.vd[i]));
    if (nom === 'hist') S.hist.forEach(i => add(S.vd[i]));
    if (pos) proches.forEach(add);
    return [...b];
  }
  function rendre() {
    let [, r = '', arg] = location.hash.split('/'); let nom = ROUTES[r] || 'accueil';
    if (!S.langOk && nom !== 'bienvenue') { nom = 'bienvenue'; r = 'bienvenue'; }     // premier lancement : choisir la langue
    if (!langPrete(S.lang)) { chargerLangue(S.lang).then(rendre); return; }
    if (S.city && !ville(S.city)) { S.city = null; save(); }
    const manqueCh = besoinsCh(nom, arg);
    if (manqueCh.length) {
      if (!document.getElementById('ecran')) document.getElementById('app').innerHTML = '<main class="ecran" id="ecran"><div class="attente" role="status"></div></main>';
      Promise.all(manqueCh.map(f => chargerCh(f).then(() => { chEnCours[f].fini = true; }))).then(rendre);
      return;
    }
    const manque = besoins(nom, arg);
    if (manque.length) {      // la ville n'est pas encore chargée : on charge son fichier puis on affiche
      if (!document.getElementById('ecran')) document.getElementById('app').innerHTML = '<main class="ecran" id="ecran"><div class="attente" role="status"></div></main>';
      Promise.all(manque.map(charger)).then(() => { manque.forEach(x => charge.add(x)); rendre(); });
      return;
    }
    if (carte) { try { carte.stop(); carte.remove(); } catch (e) { /* carte déjà retirée */ } carte = null; }
    document.documentElement.lang = S.lang; document.documentElement.dir = LANGS[li()].dir;
    if (nom === 'lieu' && lieu(arg)) { S.vd[arg] = lieu(arg).ville; S.hist = [arg, ...S.hist.filter(x => x !== arg)].slice(0, 30); save(); }
    const actif = nom === 'bienvenue' ? null : ['', 'carte', 'jour', 'fav'].includes(r) ? r : (r === 'res' || r === 'dest' || r === 'budget' || r === 'quoi' || r === 'lieu' || r === 'signal' ? '' : 'plus');
    document.getElementById('app').innerHTML = `<main class="ecran e-${nom}" id="ecran">${E[nom](arg)}</main>${nom === 'bienvenue' ? '' : `
      <nav class="onglets" aria-label="Navigation">${ONGLETS.map(([h, i, k]) => `<a href="#/${h}" class="${actif === h ? 'on' : ''}" ${actif === h ? 'aria-current="page"' : ''}>${svg(i)}<span>${esc(t(k))}</span></a>`).join('')}</nav>`}`;
    window.scrollTo(0, 0);
    if (nom === 'chateaux' && chVue === 'map') monterCarteCh();
    if (nom === 'chateau') monterMiniCh();
    if (nom === 'carte') { monterCarte(); if (focusCarte && carte) { const l = lieu(focusCarte); if (l) carte.setView([l.lat, l.lon], 16); focusCarte = null; } }
  }
  function toast(msg) { const d = document.createElement('div'); d.className = 'toast'; d.setAttribute('role', 'status'); d.textContent = msg; document.body.appendChild(d); setTimeout(() => d.remove(), 2600); }
  const aller = h => { if (location.hash === h) rendre(); else location.hash = h; };

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const act = el.dataset.act, val = el.dataset.val;
    const A = {
      retour: () => { if (history.length > 1) history.back(); else aller('#/'); },
      aller: () => aller(val),
      'pub-choix': () => { if (window.ACDT_PUB) window.ACDT_PUB.choix(); },
      ouvrir: () => { e.preventDefault(); const l = lieu(val); if (l) { S.vd[val] = l.ville; save(); } aller('#/lieu/' + val); },
      fav: () => { e.stopPropagation(); const l = lieu(val); if (l) S.vd[val] = l.ville; S.favs = S.favs.includes(val) ? S.favs.filter(x => x !== val) : [val, ...S.favs]; save(); rendre(); },
      ville: () => { e.preventDefault(); S.city = val || null; pos = null; proches = []; avisRecherche = ''; destQ = ''; S.q = ''; save(); aller('#/quoi'); },   // la ville choisie, on arrive sur « Que veux-tu découvrir ? »
      'ville-res': () => { e.preventDefault(); S.city = val || null; pos = null; proches = []; avisRecherche = ''; destQ = ''; S.q = ''; save(); versResultats(); },
      budget: () => { S.budget = val; save(); history.back(); },
      'budget-bascule': () => { S.budget = S.budget === val ? 'all' : val; save(); rendre(); },
      cat: () => { if (!val) S.cats = []; else S.cats = S.cats.includes(val) ? S.cats.filter(c => c !== val) : [...S.cats, val]; save(); rendre(); },
      when: () => { S.when = val; if (val === 'date' && !S.date) S.date = new Date().toISOString().slice(0, 10); save(); rendre(); },
      dur: () => { S.dur = val; save(); rendre(); }, who: () => { S.who = val; save(); rendre(); },
      vue: () => { S.view = val; save(); rendre(); },
      'ch-vue': () => { chVue = val; rendre(); },
      chTri: () => { if (val === 'near' && !origine()) { S.chTri = val; save(); return A.geo(); } S.chTri = val; chN = 60; save(); rendre(); },
      localiser: () => localiser(true),
      'fam-carte': () => { famCarte = val; rendre(); },
      'ch-plus': () => { const y = window.scrollY; chN += 60; rendre(); window.scrollTo(0, y); },
      'ch-partager': () => { const c = chateau(val); if (!c) return; const url = `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lon}`, txt = `${chNom(c)} — ${c.commune || ''}`;
        if (navigator.share) navigator.share({ title: chNom(c), text: txt, url }).catch(() => { }); else if (navigator.clipboard) navigator.clipboard.writeText(txt + ' ' + url).then(() => toast(t('copied'))).catch(() => { }); },
      voir: () => { S.q = ''; avisRecherche = ''; if (!S.city && !pos) aller('#/dest'); else versResultats(); },
      reset: () => { Object.assign(S, { budget: 'all', cats: [], when: 'now', dur: 'any', who: 'any', q: '' }); avisRecherche = ''; save(); rendre(); },
      geo: () => { if (!navigator.geolocation) return toast(t('geo_denied'));
        if (location.hash.startsWith('#/chateaux')) return localiser(false);
        navigator.geolocation.getCurrentPosition(p => { const me = { lat: p.coords.latitude, lon: p.coords.longitude, ici: true };
          const pres = D.villes.map(v => ({ v, d: dist(me, v) })).sort((a, b) => a.d - b.d).filter(x => x.d <= 25).slice(0, 4);
          if (!pres.length) { pos = me; toast(t('geo_far')); aller('#/dest'); return; }
          pos = me; proches = pres.map(x => x.v.id); S.city = proches[0]; S.q = ''; avisRecherche = ''; save(); versResultats(); }, () => toast(t('geo_denied')), { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }); },
      partager: () => { const l = lieu(val), v = ville(l.ville), url = `https://www.google.com/maps/search/?api=1&query=${l.lat},${l.lon}`, txt = `${nomDe(l)} — ${v.nom}`;
        if (navigator.share) navigator.share({ title: nomDe(l), text: txt, url }).catch(() => { });
        else if (navigator.clipboard) navigator.clipboard.writeText(txt + ' ' + url).then(() => toast(t('copied')), () => toast(txt));
        else toast(txt); },
      surcarte: () => { e.preventDefault(); const l = lieu(val); S.city = l.ville; pos = null; proches = []; focusCarte = val; save(); aller('#/carte'); },
      langue: () => { S.lang = val; save(); chargerLangue(val).then(() => { history.back(); setTimeout(rendre, 30); }); },
      'langue-1': () => { S.lang = val; S.langOk = true; save(); chargerLangue(val).then(() => { if (location.hash && location.hash !== '#/' && location.hash !== '#/bienvenue') rendre(); else aller('#/'); }); },
      'hist-vider': () => { S.hist = []; save(); rendre(); },
      'j-dur': () => { J.dur = val; plan = null; rendre(); }, 'j-budget': () => { J.budget = val; plan = null; rendre(); },
      'j-tr': () => { J.tr = val; plan = null; rendre(); }, 'j-who': () => { J.who = val; plan = null; rendre(); },
      'j-n': () => { J.n = Math.min(12, Math.max(1, J.n + +val)); rendre(); },
      'j-go': () => { construire(); rendre(); const p = document.getElementById('plan'); if (p && p.scrollIntoView) p.scrollIntoView({ behavior: 'smooth' }); },
      debloquer: () => overlayPub(true, () => { planDetail = true; rendre(); const p = document.getElementById('plan'); if (p && p.scrollIntoView) p.scrollIntoView(); }),
    };
    if (A[act]) A[act]();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches && e.target.matches('article[data-act]')) e.target.click(); });
  document.addEventListener('submit', e => {
    const f = e.target.dataset.form; if (!f) return; e.preventDefault();
    if (f === 'ch-recherche') { chQ = String(new FormData(e.target).get('q') || '').trim(); chN = 60; rendre(); return; }
    if (f === 'recherche') { const q = new FormData(e.target).get('q') || ''; if (q.trim()) lancerRecherche(q); else { S.q = ''; avisRecherche = ''; versResultats(); } }
    if (f === 'signal') { const fd = new FormData(e.target), l = lieu(e.target.dataset.id), v = ville(l.ville);
      const sujet = `[À CÔTÉ DE TOI] ${t('report')} – ${nomDe(l)} (${l.id})`;
      const corps = `${nomDe(l)} — ${v.nom}\nID : ${l.id}\nType : ${fd.get('type')}\nLangue : ${S.lang}\nDonnées du : ${l.recupere}\n\n${fd.get('msg') || ''}`;
      location.href = `mailto:${CONFIG.MAIL_SIGNALEMENT}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
      toast(t('rep_done')); setTimeout(() => history.back(), 400); }
  });
  document.addEventListener('change', e => { const c = e.target.dataset && e.target.dataset.champ; if (!c) return;
    if (c === 'chReg') { S.chReg = e.target.value || null; chN = 60; save(); rendre(); return; }
    if (c === 'jcity') { J.city = e.target.value; plan = null; rendre(); return; }
    if (c === 'date') S.date = e.target.value || null; else S[c] = !!e.target.checked; save(); if (c !== 'date') rendre(); });
  document.addEventListener('input', e => { if (e.target.dataset && e.target.dataset.filtre === 'villes') { destQ = e.target.value; document.getElementById('liste-villes').innerHTML = listeVilles(destQ); } });
  window.addEventListener('hashchange', rendre);

  // Désactivation rapide d'une fiche à distance (lieu fermé, horaires changés…) sans republier l'appli.
  if (CONFIG.URL_ETAT) fetch(CONFIG.URL_ETAT, { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(j => { if (j && j.desactives) { Object.assign(etat, j.desactives); rendre(); } }).catch(() => { });
  // Lien depuis le site (ex. /app/?ville=nimes) : ouvre directement la ville choisie.
  try { const vq = new URLSearchParams(location.search).get('ville'); if (vq && ville(vq) && ville(vq).id === vq) { S.city = vq; save(); if (!location.hash || location.hash === '#/') location.hash = '#/quoi'; history.replaceState(null, '', location.pathname + location.hash); } } catch (e) { }
  window.ACDT = { chargerLangue, langueTel, analyser, filtrer, etat, rendre, S, statut, construire, charger, charge, get plan() { return plan; }, J };
  rendre();
})();
