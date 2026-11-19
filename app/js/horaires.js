// Lecture des horaires au format OpenStreetMap (sous-ensemble sûr).
// Si une règle n'est pas comprise à 100 %, on renvoie null : l'appli affiche alors
// « Horaires à vérifier » au lieu de deviner « ouvert » ou « fermé ».
(function () {
  const J = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const mins = s => { const m = /^(\d{1,2}):(\d{2})$/.exec(s); if (!m) return null; const v = +m[1] * 60 + +m[2]; return v <= 1440 ? v : null; };

  function jours(txt) {
    const set = new Set();
    for (const part of txt.split(',')) {
      const p = part.trim();
      const r = /^(Mo|Tu|We|Th|Fr|Sa|Su)(?:-(Mo|Tu|We|Th|Fr|Sa|Su))?$/.exec(p);
      if (!r) return null;
      let a = J.indexOf(r[1]); const b = r[2] ? J.indexOf(r[2]) : a;
      for (let i = a; ; i = (i + 1) % 7) { set.add(i); if (i === b) break; }
    }
    return [...set];
  }
  function plages(txt) {
    const out = [];
    for (const part of txt.split(',')) {
      const r = /^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/.exec(part.trim());
      if (!r) return null;
      const a = mins(r[1]), b = mins(r[2]); if (a === null || b === null) return null;
      out.push([a, b <= a ? b + 1440 : b]);
    }
    return out;
  }
  function parse(str) {
    if (!str || typeof str !== 'string') return null;
    const s = str.trim();
    const sem = Array.from({ length: 7 }, () => []);
    if (s === '24/7') return { sem: sem.map(() => [[0, 1440]]), h24: true };
    let compris = 0;
    for (let regle of s.split(';')) {
      regle = regle.trim(); if (!regle) continue;
      if (/^PH\b/.test(regle)) continue;              // jours fériés : ignorés pour le calcul
      regle = regle.replace(/,\s*PH\b/, '').replace(/\bPH\s*,\s*/, '');
      let m = /^((?:Mo|Tu|We|Th|Fr|Sa|Su)[A-Za-z,\- ]*?)\s+(.+)$/.exec(regle);
      let js, reste;
      if (m) { js = jours(m[1].replace(/\s+/g, '')); reste = m[2].trim(); }
      else if (/^(Mo|Tu|We|Th|Fr|Sa|Su)[A-Za-z,\-]*$/.test(regle)) { js = jours(regle); reste = '00:00-24:00'; }
      else { js = [0, 1, 2, 3, 4, 5, 6]; reste = regle; }
      if (!js) return null;
      let pl;
      if (/^(off|closed)$/i.test(reste)) pl = [];
      else { pl = plages(reste); if (!pl) return null; }
      for (const j of js) sem[j] = pl;
      compris++;
    }
    return compris ? { sem } : null;
  }
  const jourIdx = d => (d.getDay() + 6) % 7; // lundi = 0
  function isOpen(p, date) {
    if (!p) return null;
    const j = jourIdx(date), t = date.getHours() * 60 + date.getMinutes();
    if (p.sem[j].some(([a, b]) => t >= a && t < b)) return true;
    return p.sem[(j + 6) % 7].some(([a, b]) => b > 1440 && t < b - 1440);
  }
  function openOnDay(p, date) { return p ? p.sem[jourIdx(date)].length > 0 : null; }
  // Affichage traduit de la chaîne d'origine (les jours et mots-clés seulement).
  function format(str, t) {
    if (!str) return '';
    if (str.trim() === '24/7') return t('h_247');
    const noms = t('days').split(',');
    return str.split(';').map(r => r.trim()).filter(Boolean).map(r =>
      r.replace(/\b(Mo|Tu|We|Th|Fr|Sa|Su)\b/g, m => noms[J.indexOf(m)])
        .replace(/\bPH\b/g, t('h_ph')).replace(/\b(off|closed)\b/gi, t('h_off'))
    );
  }
  window.ACDT_H = { parse, isOpen, openOnDay, format };
  if (typeof module !== 'undefined') module.exports = window.ACDT_H;
})();
