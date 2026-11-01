/* =====================================================================
 * Garde de nuit — jeu de révision des stages infirmiers (bac 4, Henallux)
 * Créé par Gauthier Doumont
 *
 * Journal des changements
 * 1.0.0 (2026-10-31) : première version complète — 4 étages, mode Garde,
 *   quiz à 5 niveaux + boss, escape games, flashcards Leitner, 7 mini-jeux,
 *   XP / grades / série / badges / cafés, export-import, PWA hors ligne.
 * 1.1.0 (2026-11-01) : plusieurs gardes par étage (data/scenarios-*.js), 6 nouveaux mini-jeux
 *   (situations flash, qui en premier ?, sprint 60 s, memory, mot mystère, gaz du sang express), 7 badges.
 * 1.2.0 (2026-11-01) : « Salle de jeux » dans la barre du bas et sur l’accueil, tuile Mini-jeux remontée,
 *   version affichée sur l’accueil, mise à jour automatique de l’appli installée.
 * 1.3.0 (2026-11-01) : gardes à embranchements (suite aléatoire, fins multiples mémorisées, variation des
 *   constantes, joker café « Appeler le référent »), validation stricte des gardes ; 4 gardes de la Réa réécrites.
 * 1.6.0 (2026-11-01) : missions du jour (graine = date), coffre, défi de la semaine, 10 récompenses par paliers
 *   d’étoiles (accessoires de Monito, couleurs, titres, Garde de la mort, Nuit blanche), jokers 50/50 et
 *   indice d’escape, Monito contextuel, 6 nouveaux badges.
 * 1.5.0 (2026-11-01) : sauvegarde v2 (migration v1→v2), étoiles 1-3 sur chaque contenu, carnet d’erreurs
 *   (rattrapage à J+1/J+3/J+7), stats par thème et mode « Mes points faibles ».
 * 1.4.0 (2026-11-01) : Réa enrichie — 68 cartes, 122 questions (31 niveau 3), 21 situations, 4 « qui en premier ? », 15 mots.
 * ===================================================================== */
'use strict';

/* ============================== CONFIG ============================== */
const APP_VERSION = '1.6.0';
const STORAGE_KEY = 'jeuxpourstage_v1';
const SCHEMA_VERSION = 2;
const INTERVALLES = [0, 1, 2, 4, 7, 14];          // jours avant révision, par boîte Leitner (1 à 5)
const CAFES_MAX = 5;
const RAPPEL_EXPORT_JOURS = 14;
const GRADES = [
  [0, 'Stagiaire', '🩺'], [300, 'Étudiante confirmée', '📋'], [900, 'Infirmière', '💉'],
  [2000, 'Infirmière référente', '⭐'], [4000, 'Cheffe d’unité', '👑'], [7000, 'Légende de Godinne', '🏆']
];
const ETAGES = (window.ETAGES || []).slice().sort((a, b) => a.num - b.num);

const BADGES = [
  ['premiers-pas', '👣', 'Premiers pas', 'Répondre à ta 1re question', s => s.stats.reponses >= 1],
  ['cent', '💯', 'Centurionne', '100 bonnes réponses', s => s.stats.bonnes >= 100],
  ['combo', '🔥', 'En feu', 'Série de 10 bonnes réponses d’affilée', s => s.stats.meilleurCombo >= 10],
  ['flash50', '🃏', 'Mémoire d’éléphant', '50 flashcards révisées', s => s.stats.cartes >= 50],
  ['flash300', '🐘', 'Archiviste', '300 flashcards révisées', s => s.stats.cartes >= 300],
  ['pupilles', '👁️', 'Pupilles d’aigle', '20 Glasgow parfaits', s => s.stats.glasgowParfaits >= 20],
  ['calme', '😌', 'Calme en réa', 'Finir la garde de réa avec ≥ 80 %', s => (s.etages.rea || {}).garde >= 80],
  ['compresse', '🧽', 'Zéro compresse oubliée', 'Finir la garde du bloc avec ≥ 80 %', s => (s.etages.bloc || {}).garde >= 80],
  ['neuro', '🧠', 'Neurone d’or', 'Finir la garde de neuro avec ≥ 80 %', s => (s.etages.neuro || {}).garde >= 80],
  ['sommet', '🧭', 'Boussole clinique', 'Finir la garde du Sommet avec ≥ 80 %', s => (s.etages.jugement || {}).garde >= 80],
  ['sbar', '📞', 'SBAR d’or', '5 transmissions SBAR parfaites', s => s.stats.sbarParfaits >= 5],
  ['evade', '🔓', 'Évadée', 'Réussir un escape game', s => s.stats.escapes >= 1],
  ['evade4', '🗝️', 'Passe-muraille', 'Réussir les 4 escape games', s => ETAGES.every(e => (s.etages[e.id] || {}).escape)],
  ['boss1', '🥊', 'Tueuse de boss', 'Battre un boss', s => s.stats.boss >= 1],
  ['boss4', '🏆', 'Reine des étages', 'Battre les 4 boss', s => ETAGES.every(e => (s.etages[e.id] || {}).boss)],
  ['calcul', '🧮', 'Calculette humaine', '20 calculs justes', s => s.stats.calculs >= 20],
  ['serie7', '📅', 'Une semaine pile', 'Série de 7 jours', s => s.serie.max >= 7],
  ['serie30', '🌙', 'Gardienne de nuit', 'Série de 30 jours', s => s.serie.max >= 30],
  ['mini', '🎮', 'Touche-à-tout', '25 mini-jeux terminés', s => s.stats.miniJeux >= 25],
  ['situ50', '🚑', 'Réflexes de pro', '50 situations flash réussies', s => s.stats.situationsJustes >= 50],
  ['prio', '🚦', 'Chef(fe) d’orchestre', '5 classements de priorité parfaits', s => s.stats.prioParfaites >= 5],
  ['sprint', '⚡', 'Éclair', '15 bonnes réponses en un sprint', s => ETAGES.some(e => (s.etages[e.id] || {}).sprint >= 15)],
  ['memory', '🧩', 'Mémoire photographique', '10 Memory terminés', s => s.stats.memory >= 10],
  ['mots', '🔤', 'Dico vivant', '30 mots mystères trouvés', s => s.stats.mots >= 30],
  ['gds', '🩸', 'Gazométriste', '30 gaz du sang justes', s => s.stats.gds >= 30],
  ['gardes', '🌃', 'Toutes les nuits', 'Jouer toutes les gardes d’un étage', s => ETAGES.some(e => e.gardes.every(g => ((s.etages[e.id] || {}).gardes || {})[g.id] != null))],
  ['toutesfins', '🗺️', 'Exploratrice', 'Découvrir toutes les fins d’une garde', s => ETAGES.some(e => e.gardes.some(g => finsGarde(g).every(f => (((s.etages[e.id] || {}).fins || {})[g.id] || []).includes(f))))],
  ['carnetvide', '🧹', 'Carnet vide', 'Vider complètement son carnet d’erreurs', s => !!s.stats.carnetVide],
  ['ratt50', '🩹', 'Reine du rattrapage', '50 erreurs rattrapées', s => s.stats.rattrapages >= 50],
  ['trois10', '🌟', 'Perfectionniste', '10 contenus à ★★★', s => Object.values(s.etoiles || {}).filter(n => n === 3).length >= 10],
  ['missions7', '📆', 'Assidue', 'Missions du jour remplies 7 jours d’affilée', s => (s.missionsSerie || {}).max >= 7],
  ['examen80', '🎓', 'Examen blanc réussi', '80 % ou plus à un examen blanc', s => !!s.stats.examen80],
  ['maitrise', '🎓', 'Prête pour le stage', 'Un étage maîtrisé à 80 %', s => ETAGES.some(e => maitrise(e.id) >= 80)]
];

const MESSAGES_MONITO = [
  'Bip… bip… Une petite révision et je suis rassuré !',
  'Rappel : le protocole du service et ton/ta référent(e) priment toujours sur le jeu 😉',
  'Mains propres, esprit clair ! 🧼',
  'Tu sais ce qui fait monter mon rythme cardiaque ? Une série de 10 bonnes réponses 💚',
  'Pense à boire un verre d’eau. Moi je suis branché sur secteur.',
  'Même les infirmières légendaires ont commencé par « Stagiaire ».',
  'Un patient qui « n’est pas comme d’habitude », ça se signale. Toujours.'
];

/* ============================== UTILITAIRES ============================== */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function dateLocale(d = new Date()) { const p = n => String(n).padStart(2, '0'); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }
function jours(a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000); }
function ajouteJours(d, n) { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return dateLocale(x); }
function semaineISO(d) { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + 3 - ((x.getDay() + 6) % 7)); const s1 = new Date(x.getFullYear(), 0, 4); return x.getFullYear() + '-' + (1 + Math.round(((x - s1) / 86400000 - 3 + ((s1.getDay() + 6) % 7)) / 7)); }
function dateFr(d) { return new Date(d + 'T12:00:00').toLocaleDateString('fr-BE', { day: 'numeric', month: 'long' }); }
function fmtTemps(s) { const m = Math.floor(s / 60), r = s % 60; return m + ':' + String(r).padStart(2, '0'); }
const etage = id => ETAGES.find(e => e.id === id);
function sourceTexte(e, s) { if (!s) return ''; return s.split('+').map(k => (e.sources && e.sources[k.trim()]) || k.trim()).join(' · '); }

/* ============================== ÉTAT ============================== */
function etatParDefaut() {
  const et = {};
  ETAGES.forEach(e => { et[e.id] = { niveaux: [0, 0, 0, 0, 0], boss: 0, garde: null, gardes: {}, fins: {}, escape: null, sprint: 0 }; });
  return {
    schemaVersion: SCHEMA_VERSION, cree: dateLocale(), xp: 0, cafes: CAFES_MAX,
    serie: { n: 0, max: 0, dernier: null, jokerSemaine: null },
    cartes: {}, etages: et, badges: {}, etoiles: {}, carnet: {}, themes: {},
    jour: null, semaine: null, minisJoues: {}, missionsSerie: { n: 0, max: 0, dernier: null }, derniereVisite: null, absence: 0,
    apparence: { accessoire: null, palette: 'defaut', titre: null },
    stats: { reponses: 0, bonnes: 0, meilleurCombo: 0, cartes: 0, glasgowParfaits: 0, escapes: 0, boss: 0, calculs: 0, miniJeux: 0, gardes: 0, sbarParfaits: 0, cartesDepuisCafe: 0, situations: 0, situationsJustes: 0, prioParfaites: 0, memory: 0, mots: 0, gds: 0, rattrapages: 0, finsDecouvertes: 0 },
    reglages: { theme: 'auto', son: true, vibration: true, animations: true },
    dernierExport: null
  };
}
let S = etatParDefaut();
let nettoyages = [];   // fonctions à appeler quand on quitte une vue (minuteurs, animations)

/* ============================== STOCKAGE ============================== */
/* Migration des sauvegardes : chaque étape ne fait qu’ajouter, rien n’est perdu */
function migrer(d) {
  if (!d || typeof d !== 'object') return d;
  if (!d.schemaVersion || d.schemaVersion < 2) {
    // v1 → v2 : étoiles calculées à partir des records existants, carnet et stats par thème vides
    d.etoiles = d.etoiles || {}; d.carnet = d.carnet || {}; d.themes = d.themes || {};
    const et = d.etages || {};
    Object.keys(et).forEach(id => {
      const st = et[id] || {};
      (st.niveaux || []).forEach((b, k) => { const n = etoilesQuiz(b); if (n) d.etoiles[`niv:${id}:${k}`] = n; });
      if (st.boss) { const n = etoilesBoss(st.boss); if (n) d.etoiles[`boss:${id}`] = n; }
      const gs = Object.assign({}, st.gardes || {});
      if (st.garde != null && !Object.keys(gs).length) gs.g0 = st.garde;   // v1.0 : un seul record de garde
      Object.entries(gs).forEach(([gid, sc]) => { const n = etoilesGarde(sc); if (n) d.etoiles[`garde:${id}:${gid}`] = n; });
      if (st.escape != null) d.etoiles[`escape:${id}`] = 1;                 // réussi (indices inconnus en v1)
      st.fins = st.fins || {};
    });
    d.schemaVersion = 2;
  }
  return d;
}
function fusion(base, d) {
  for (const k in d) {
    if (d[k] && typeof d[k] === 'object' && !Array.isArray(d[k]) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) fusion(base[k], d[k]);
    else base[k] = d[k];
  }
  return base;
}
function charger() {
  try {
    const brut = localStorage.getItem(STORAGE_KEY);
    if (brut) { const d = JSON.parse(brut), v = d.schemaVersion; S = fusion(etatParDefaut(), migrer(d)); if (v !== S.schemaVersion) sauver(); }
  } catch (e) { console.warn('Lecture impossible, nouvelle partie.', e); S = etatParDefaut(); }
}
function sauver() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); } catch (e) { console.warn('Sauvegarde impossible', e); }
}
function exporter() {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'garde-de-nuit-sauvegarde-' + dateLocale() + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  S.dernierExport = dateLocale(); sauver(); toast('💾 Sauvegarde exportée');
}
function importer(fichier) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      if (!d || typeof d !== 'object' || !('xp' in d)) throw new Error('format');
      if (!confirm('Remplacer ta progression actuelle par celle du fichier ?')) return;
      S = fusion(etatParDefaut(), migrer(d)); sauver(); appliquerReglages(); toast('📥 Sauvegarde importée'); aller('accueil');
    } catch (e) { alert('Ce fichier n’est pas une sauvegarde valide.'); }
  };
  r.readAsText(fichier);
}

/* ============================== SONS, VIBRATIONS, EFFETS ============================== */
let audioCtx = null;
function son(type) {
  if (!S.reglages.son) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = { ok: [660, 880], ko: [220, 160], niveau: [523, 659, 784, 1046], bip: [1000], clic: [440] }[type] || [440];
    notes.forEach((f, i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = type === 'ko' ? 'sawtooth' : 'sine'; o.frequency.value = f;
      const t = audioCtx.currentTime + i * 0.09;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + 0.18);
    });
  } catch (e) { /* audio indisponible */ }
}
function vibre(p) { if (S.reglages.vibration && navigator.vibrate) try { navigator.vibrate(p); } catch (e) { } }
function toast(txt, ms = 2600) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = txt;
  $('#toasts').appendChild(t); setTimeout(() => t.remove(), ms);
}
function animationsOn() { return S.reglages.animations && !matchMedia('(prefers-reduced-motion: reduce)').matches; }
function confettis() {
  if (!animationsOn()) return;
  const c = $('#confettis'), ctx = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const cols = ['#2E86AB', '#3BB273', '#7B5EA7', '#F18F01', '#E15554'];
  const p = Array.from({ length: 110 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.4, vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 4, r: Math.random() * 6.28, c: pick(cols), s: 5 + Math.random() * 6 }));
  let n = 0;
  (function f() {
    ctx.clearRect(0, 0, c.width, c.height);
    p.forEach(q => { q.x += q.vx; q.y += q.vy; q.r += .1; ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.r); ctx.fillStyle = q.c; ctx.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2); ctx.restore(); });
    if (++n < 160) requestAnimationFrame(f); else ctx.clearRect(0, 0, c.width, c.height);
  })();
}

/* ============================== PROGRESSION ============================== */
function grade(xp = S.xp) { let g = GRADES[0], i = 0; GRADES.forEach((x, k) => { if (xp >= x[0]) { g = x; i = k; } }); return { nom: g[1], ico: g[2], i, min: g[0], max: (GRADES[i + 1] || [g[0]])[0] }; }
function majSerie() {
  const auj = dateLocale(), s = S.serie;
  if (s.dernier === auj) return;
  if (!s.dernier) s.n = 1;
  else {
    const ecart = jours(s.dernier, auj);
    if (ecart === 1) s.n++;
    else if (ecart === 2 && s.jokerSemaine !== semaineISO(auj)) { s.n++; s.jokerSemaine = semaineISO(auj); toast('☕ Jour de congé utilisé : ta série est sauvée !'); }
    else s.n = 1;
  }
  s.dernier = auj; s.max = Math.max(s.max, s.n);
}
function gagneXP(n) {
  if (n <= 0) return;
  const avant = grade().i;
  S.xp += Math.round(n); majSerie();
  const g = grade();
  if (g.i > avant) { toast(g.ico + ' Nouveau grade : ' + g.nom + ' !', 3500); son('niveau'); confettis(); }
  verifBadges(); sauver();
}
function verifBadges() {
  BADGES.forEach(([id, ico, nom, , test]) => {
    if (!S.badges[id]) { let ok = false; try { ok = test(S); } catch (e) { } if (ok) { S.badges[id] = dateLocale(); toast(ico + ' Badge débloqué : ' + nom, 3500); son('niveau'); } }
  });
}
function cartesEtage(e) { return e.cartes.map((c, i) => ({ id: e.id + '-c' + i, th: c[0], recto: c[1], verso: c[2], pourquoi: c[3], s: c[4], etage: e.id })); }
function maitrise(id) {
  const e = etage(id), st = S.etages[id]; if (!e || !st) return 0;
  const cs = cartesEtage(e);
  const fortes = cs.filter(c => (S.cartes[c.id] || {}).boite >= 3).length;
  const niv = st.niveaux.filter(x => x >= 6).length;
  return Math.round(niv / 5 * 35 + (st.boss ? 15 : 0) + (cs.length ? fortes / cs.length * 30 : 0) + (e.gardes.length ? e.gardes.reduce((n, g) => n + Math.min((st.gardes || {})[g.id] || 0, 100), 0) / e.gardes.length / 10 : 0) + (st.escape ? 10 : 0));
}
function prochainStage() {
  const auj = dateLocale();
  const enCours = ETAGES.find(e => e.stage.debut <= auj && auj <= e.stage.fin);
  if (enCours) return { e: enCours, enCours: true, j: jours(auj, enCours.stage.fin) };
  const futurs = ETAGES.filter(e => e.stage.debut > auj).sort((a, b) => a.stage.debut.localeCompare(b.stage.debut));
  return futurs.length ? { e: futurs[0], enCours: false, j: jours(auj, futurs[0].stage.debut) } : null;
}
function cartesDues(ids) {
  const auj = dateLocale(), dues = [], nouvelles = [];
  ETAGES.filter(e => !ids || ids.includes(e.id)).forEach(e => cartesEtage(e).forEach(c => {
    const st = S.cartes[c.id];
    if (!st) nouvelles.push(c); else if (st.due <= auj) dues.push(c);
  }));
  return { dues, nouvelles };
}

/* ============================== RENDU : CADRE ============================== */
function appliquerReglages() {
  const r = document.documentElement;
  if (S.reglages.theme === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', S.reglages.theme);
  r.setAttribute('data-anim', S.reglages.animations ? 'on' : 'off');
  const pal = S.apparence && S.apparence.palette;
  if (pal && pal !== 'defaut' && recompenseDebloquee('pal-' + pal)) r.setAttribute('data-palette', pal); else r.removeAttribute('data-palette');
}
function entete(titre, retour) {
  return `<div class="topbar">${retour ? `<button class="btn-retour" data-retour aria-label="Retour">←</button>` : ''}<h1>${titre}</h1>
  <div class="chips"><span class="chip" title="Cafés">☕ ${S.cafes}</span><span class="chip" title="Série">🔥 ${S.serie.n}</span></div></div>`;
}
function vue(html) {
  nettoyages.forEach(f => { try { f(); } catch (e) { } }); nettoyages = [];
  const m = $('#main'); m.innerHTML = html; window.scrollTo(0, 0);
  $$('[data-retour]', m).forEach(b => b.onclick = () => history.back());
  return m;
}
function monitoSVG(humeur = 'content') {
  const bouche = humeur === 'triste' ? 'M22 44 Q32 38 42 44' : 'M22 40 Q32 48 42 40';
  return `<svg viewBox="0 -4 64 68" aria-hidden="true"><rect x="4" y="6" width="56" height="44" rx="10" fill="#2E86AB"/><rect x="9" y="11" width="46" height="34" rx="6" fill="#071016"/>
  <polyline points="11,30 20,30 24,22 28,38 32,26 35,30 53,30" fill="none" stroke="#4BE07A" stroke-width="2"/>
  <circle cx="24" cy="20" r="2.6" fill="#fff"/><circle cx="40" cy="20" r="2.6" fill="#fff"/><path d="${bouche}" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <rect x="26" y="50" width="12" height="6" fill="#2E86AB"/><rect x="18" y="55" width="28" height="5" rx="2.5" fill="#2E86AB"/>${accessoireSVG()}</svg>`;
}
function accessoireSVG() {
  const a = S.apparence && S.apparence.accessoire;
  if (!a || !recompenseDebloquee('acc-' + a)) return '';
  return ({
    stetho: '<path d="M8 40 Q2 52 14 58 Q24 60 26 52" fill="none" stroke="#E15554" stroke-width="2.4"/><circle cx="26" cy="51" r="3" fill="#B0BEC5" stroke="#455A64"/>',
    calot: '<path d="M10 9 Q32 -6 54 9 L54 12 L10 12 Z" fill="#3BB273"/><rect x="10" y="10" width="44" height="3" fill="#2E7D52"/>',
    lunettes: '<g fill="none" stroke="#F18F01" stroke-width="2"><circle cx="24" cy="20" r="5"/><circle cx="40" cy="20" r="5"/><path d="M29 20 H35"/></g>',
    couronne: '<path d="M14 9 L20 0 L26 7 L32 -2 L38 7 L44 0 L50 9 Z" fill="#F7C948" stroke="#B8860B" stroke-width="1"/>'
  })[a] || '';
}
function monito(txt, humeur) { return `<div class="monito">${monitoSVG(humeur)}<div class="bulle">${txt}</div></div>`; }

/* ============================== NAVIGATION ============================== */
const VUES = {};
function aller(nom, params = {}, remplace = false) {
  const etat = { nom, params };
  if (remplace) history.replaceState(etat, ''); else history.pushState(etat, '');
  afficher(etat);
}
function afficher(etat) {
  const f = VUES[etat.nom] || VUES.accueil;
  $$('nav.bas button').forEach(b => b.classList.toggle('actif', b.dataset.nav === etat.nom));
  f(etat.params || {});
}
window.addEventListener('popstate', e => afficher(e.state || { nom: 'accueil' }));

/* ============================== VUE : ACCUEIL (HÔPITAL) ============================== */
VUES.accueil = () => {
  const g = grade(), ps = prochainStage();
  const pct = g.max > g.min ? Math.round((S.xp - g.min) / (g.max - g.min) * 100) : 100;
  const msg = messageMonito(ps) || pick(MESSAGES_MONITO);
  const { dues, nouvelles } = cartesDues();
  const rappel = (S.xp > 0 && (S.dernierExport ? jours(S.dernierExport, dateLocale()) >= RAPPEL_EXPORT_JOURS : jours(S.cree, dateLocale()) >= RAPPEL_EXPORT_JOURS));
  const etagesHTML = ETAGES.slice().reverse().map(e => {
    const vedette = ps && ps.e.id === e.id;
    const m = maitrise(e.id);
    return `<button class="etage ${vedette ? 'vedette' : ''}" style="--c:${e.couleur}" data-etage="${e.id}">
      ${vedette ? `<span class="badge-stage">${ps.enCours ? 'En stage !' : 'Stage dans ' + ps.j + ' j'}</span>` : ''}
      <span class="num">É${e.num}</span><span class="em">${e.emoji}</span>
      <span class="info"><b>${esc(e.titre)}</b><small>${esc(e.service)} · ${dateFr(e.stage.debut)} → ${dateFr(e.stage.fin)}</small>
      <span class="barre" style="margin-top:5px"><i style="width:${m}%"></i></span></span><small>${m}%</small></button>`;
  }).join('');
  vue(`<div class="topbar"><h1>🏥 Garde de nuit</h1><div class="chips"><span class="chip" aria-label="Étoiles">★ ${etoilesTotal().n}</span><span class="chip">☕ ${S.cafes}</span><span class="chip">🔥 ${S.serie.n}</span></div></div>
  <div class="carte" style="padding:10px 14px"><div style="display:flex;justify-content:space-between;align-items:center"><b>${g.ico} ${g.nom}${titreActuel() ? ' · « ' + titreActuel() + ' »' : ''}</b><small>${S.xp} XP${g.max > g.min ? ' / ' + g.max : ''} · ★ ${etoilesTotal().n}/${etoilesTotal().max}</small></div>
  <div class="barre" style="margin-top:6px"><i style="width:${pct}%"></i></div></div>
  ${monito(msg)}
  ${missionsHTML()}
  ${rappel ? `<div class="carte alerte-export">💾 Pense à <b>exporter ta sauvegarde</b> (le navigateur peut l’effacer).<button class="btn orange" id="exp">Exporter maintenant</button></div>` : ''}
  <button class="btn orange" data-go="jeux">🎮 Mini-jeux : situations flash, memory, sprint…</button>
  ${carnetListe().length ? `<button class="btn rouge" data-go="rattrapage">🩹 Rattrapage : ${carnetDus().length} erreur(s) à revoir aujourd’hui</button>` : ''}
  ${(dues.length || nouvelles.length) ? `<button class="btn violet" id="mission">🃏 Flashcards : ${dues.length ? dues.length + ' carte(s) à revoir' : 'découvrir de nouvelles cartes'}</button>` : ''}
  <div class="hopital"><div class="toit"><span>✚ HÔPITAL DES STAGES ✚</span></div>${etagesHTML}
  <div class="rdc"><button data-go="jeux">🎮 Salle de jeux</button><button data-go="revision">🃏 Salle de révision</button></div></div>
  <p class="signature">Garde de nuit v${APP_VERSION} · Créé par Gauthier Doumont</p>`);
  $$('[data-etage]').forEach(b => b.onclick = () => { son('clic'); aller('etage', { id: b.dataset.etage }); });
  $$('[data-go]').forEach(b => b.onclick = () => aller(b.dataset.go));
  if ($('#exp')) $('#exp').onclick = () => { exporter(); aller('accueil', {}, true); };
  if ($('#mission')) $('#mission').onclick = () => lancerFlash(null);
  $$('[data-mission]').forEach(b => b.onclick = () => { const m = missionsDuJour().missions[+b.dataset.mission]; if (m.type === 'flash') lancerFlash(null); else aller(m.aller[0], m.aller[1]); });
  if ($('#coffre')) $('#coffre').onclick = ouvrirCoffre;
};

/* ============================== VUE : ÉTAGE ============================== */
VUES.etage = ({ id }) => {
  const e = etage(id), st = S.etages[id];
  if (!e) return aller('accueil', {}, true);
  const { dues, nouvelles } = cartesDues([id]);
  const niv = st.niveaux.filter(x => x >= 6).length;
  vue(`${entete(e.emoji + ' ' + esc(e.titre), true)}
  <div class="carte" style="border-left:6px solid ${e.couleur}"><b>${esc(e.service)}</b><br><small>${esc(e.lieu)} · du ${dateFr(e.stage.debut)} au ${dateFr(e.stage.fin)}</small>
  <div style="display:flex;align-items:center;gap:8px;margin-top:8px"><div class="barre" style="flex:1"><i style="width:${maitrise(id)}%"></i></div><b>${maitrise(id)}%</b></div><small>Maîtrise de l’étage</small></div>
  ${monito(esc(e.accroche))}
  <div class="carte" style="padding:10px 14px"><div class="ligne" style="border:none;padding:0"><b>★ Étoiles de l’étage</b><span>${etoilesEtage(e).n}/${etoilesEtage(e).max}</span></div></div>
  <div class="grille2">
    <button class="tuile" data-m="garde"><span class="ico">🌙</span><b>Gardes</b><small>${Object.keys(st.gardes || {}).length}/${e.gardes.length} jouées</small></button>
    <button class="tuile" data-m="mini" style="border:2px solid var(--violet)"><span class="ico">🎮</span><b>Mini-jeux</b><small>${listeJeux(id).length} jeux rapides</small></button>
    <button class="tuile" data-m="quiz"><span class="ico">🏆</span><b>Quiz</b><small>${niv}/5 niveaux${st.boss ? ' · boss ✔' : ''}</small></button>
    <button class="tuile" data-m="escape"><span class="ico">🔐</span><b>Escape game</b><small>${st.escape ? 'Record : ' + fmtTemps(st.escape) : 'Trouve le code'}</small></button>
    <button class="tuile" data-m="flash"><span class="ico">🃏</span><b>Flashcards</b><small>${dues.length} à revoir · ${nouvelles.length} nouvelles</small></button>
    <button class="tuile" data-m="fiches"><span class="ico">📖</span><b>Fiches mémo</b><small>${e.cartes.length} notions</small></button>
    <button class="tuile" data-m="rattrapage"><span class="ico">🩹</span><b>Rattrapage</b><small>${carnetDus(id).length} à revoir · ${carnetListe(id).length} au carnet</small></button>
    <button class="tuile" data-m="faibles"><span class="ico">🎯</span><b>Mes points faibles</b><small>10 questions ciblées</small></button>
  </div>
  <details class="fiche" style="margin-top:12px"><summary>📊 Mes thèmes (taux de réussite)</summary>
  ${statsThemes(e).map(x => `<div class="carte-fiche"><div class="ligne" style="border:none;padding:0"><span>${iconeTheme(x)} ${esc(x.nom)}</span><span>${x.n ? Math.round(x.taux * 100) + ' %' : '—'} <small>(${x.n} rép.)</small></span></div><div class="barre"><i style="width:${x.n ? Math.round(x.taux * 100) : 0}%"></i></div></div>`).join('')}
  <p class="doux" style="font-size:.78rem">✅ ≥ 80 % · ⚠️ 50-79 % · ❌ < 50 % · ❔ moins de 5 réponses</p></details>
  <p class="doux" style="font-size:.82rem;margin-top:14px">⚠️ Ce jeu reprend des recommandations générales. Le protocole du service et ton/ta référent(e) de stage priment toujours.</p>`);
  $$('[data-m]').forEach(b => b.onclick = () => {
    son('clic'); const m = b.dataset.m;
    if (m === 'garde') aller('garde', { id });
    else if (m === 'quiz') aller('niveaux', { id });
    else if (m === 'escape') aller('escape', { id });
    else if (m === 'flash') lancerFlash([id]);
    else if (m === 'mini') aller('mini', { id });
    else if (m === 'rattrapage') aller('rattrapage', { id });
    else if (m === 'faibles') lancerPointsFaibles(id);
    else aller('fiches', { id });
  });
};

/* ============================== VUE : FICHES ============================== */
VUES.fiches = ({ id }) => {
  const e = etage(id), cs = cartesEtage(e);
  const parTheme = Object.keys(e.themes).map(th => {
    const liste = cs.filter(c => c.th === th);
    if (!liste.length) return '';
    return `<details class="fiche"><summary>${esc(e.themes[th])} <small style="margin-left:auto">${liste.length}</small></summary>
    ${liste.map(c => `<div class="carte-fiche"><b>${esc(c.recto)}</b>${esc(c.verso)}${c.pourquoi ? `<br><small>🧠 ${esc(c.pourquoi)}</small>` : ''}<div class="source">📚 ${esc(sourceTexte(e, c.s))}</div></div>`).join('')}</details>`;
  }).join('');
  vue(`${entete('📖 Fiches — ' + esc(e.titre), true)}<p class="doux">Toutes les notions de l’étage, classées par thème. Touche un thème pour l’ouvrir.</p>${parTheme}
  <div class="carte"><b>📚 Sources de l’étage</b>${Object.values(e.sources).map(s => `<div class="source">• ${esc(s)}</div>`).join('')}</div>`);
};

/* ============================== QUESTIONS ============================== */
function questionsEtage(e, avecAuto = true) {
  const qs = e.questions.map((q, i) => Object.assign({ t: 'qcm', id: e.id + '-q' + i, etage: e.id }, q));
  if (!avecAuto) return qs;
  const cs = cartesEtage(e);
  const auto = cs.map(c => {
    const autres = shuffle(cs.filter(x => x.verso !== c.verso && x.th === c.th)).concat(shuffle(cs.filter(x => x.verso !== c.verso && x.th !== c.th)));
    const distr = [...new Set(autres.map(x => x.verso))].slice(0, 3);
    if (distr.length < 3) return null;
    const choix = shuffle([c.verso, ...distr]);
    return { t: 'qcm', id: c.id + '-auto', etage: e.id, th: c.th, n: 1, q: c.recto, c: choix, b: [choix.indexOf(c.verso)], x: [c.verso, c.pourquoi], s: c.s, auto: true };
  }).filter(Boolean);
  return qs.concat(auto);
}
const POOLS = [q => q.n === 1, q => q.n <= 2, q => q.n === 2, q => q.n >= 2, q => q.n === 3];
function explicationHTML(e, q, juste) {
  const x = q.x || [];
  let h = `<div class="verdict ${juste ? 'ok' : 'ko'}">${juste ? pick(['Bravo ! ✅', 'Exact ! 🎯', 'Parfait ! 💚', 'Bien vu ! 👏']) : pick(['Pas tout à fait… ❌', 'Raté, mais on apprend ! 📘', 'Oups ! ❌'])}</div>`;
  if (q.t === 'vf') h += `<div class="bloc b-tech"><b class="t">🔬 Réponse</b>${q.b ? 'VRAI' : 'FAUX'}</div>`;
  else if (!juste) h += `<div class="bloc b-tech"><b class="t">🔬 Bonne réponse</b>${q.b.map(i => esc(q.c[i])).join('<br>')}</div>`;
  if (x[0]) h += `<div class="bloc b-clair"><b class="t">💬 En clair</b>${esc(x[0])}</div>`;
  if (x[1]) h += `<div class="bloc b-pourquoi"><b class="t">🧠 Le pourquoi</b>${esc(x[1])}</div>`;
  if (x[2]) h += `<div class="bloc b-stage"><b class="t">🩺 En stage</b>${esc(x[2])}</div>`;
  if (x[3]) h += `<div class="bloc b-piege"><b class="t">⚠️ Piège</b>${esc(x[3])}</div>`;
  if (q.s) h += `<div class="source">📚 ${esc(sourceTexte(e, q.s))}</div>`;
  return h;
}

/* Moteur de quiz générique : opts = { titre, questions, chrono (s/question ou 0), fin(bonnes,total) } */
function quiz(opts) {
  let i = 0, bonnes = 0, combo = 0, xpTotal = 0, minuteur = null, jokerQuiz = false;
  const total = opts.questions.length;
  function question() {
    const q = opts.questions[i], e = etage(q.etage);
    const multi = q.t === 'qcm' && q.b.length > 1;
    let ordre = q.t === 'qcm' ? shuffle(q.c.map((_, k) => k)) : [];
    const m = vue(`${entete(opts.titre, true)}
      <div class="progression"><span>Question ${i + 1}/${total}</span><span class="combo">${combo >= 3 ? '🔥 Combo ×' + (combo >= 6 ? 3 : 2) : ''}</span><span>✅ ${bonnes}</span></div>
      ${opts.chrono ? `<div class="chrono"><i id="chr" style="width:100%"></i></div>` : ''}
      <div class="carte"><div class="doux" style="font-size:.78rem">${e.emoji} ${esc(e.themes[q.th] || '')}${q.t === 'vf' ? ' · Vrai ou faux ?' : multi ? ' · Plusieurs bonnes réponses' : ''}</div>
      <div class="question">${esc(q.q)}</div></div>
      <div id="rep">${q.t === 'vf'
        ? `<div class="rangee"><button class="choix centre" data-v="1">👍 Vrai</button><button class="choix centre" data-v="0">👎 Faux</button></div>`
        : ordre.map(k => `<button class="choix" data-k="${k}">${esc(q.c[k])}</button>`).join('') + (multi ? `<button class="btn" id="valider">Valider</button>` : '')}</div>
      ${q.t === 'qcm' && !multi && q.c.length >= 4 && !opts.sansJoker ? `<button class="btn sec" id="j5050" ${S.cafes > 0 ? '' : 'disabled'}>☕ 50/50 ${S.cafes > 0 ? '(−1 café)' : '(plus de café)'}</button>` : ''}
      <div id="fb"></div>`);
    if ($('#j5050')) $('#j5050').onclick = () => {
      if (S.cafes <= 0) return; S.cafes--; jokerQuiz = true; sauver(); son('clic');
      shuffle(q.c.map((_, k) => k).filter(k => !q.b.includes(k))).slice(0, 2).forEach(k => { const b = $(`[data-k="${k}"]`, m); if (b) { b.disabled = true; b.style.opacity = '.3'; b.setAttribute('aria-label', 'Option écartée'); } });
      $('#j5050').remove(); toast('☕ Deux mauvaises réponses écartées (étoiles max ★★)');
    };
    const debut = Date.now();
    let fini = false;
    if (opts.chrono) {
      let reste = opts.chrono;
      requestAnimationFrame(() => { const c = $('#chr'); if (c) c.style.width = '100%'; });
      minuteur = setInterval(() => {
        reste--; const c = $('#chr'); if (c) c.style.width = (reste / opts.chrono * 100) + '%';
        if (reste <= 0) { clearInterval(minuteur); if (!fini) corriger(null); }
      }, 1000);
      nettoyages.push(() => clearInterval(minuteur));
    }
    function corriger(rep) {
      if (fini) return; fini = true; clearInterval(minuteur);
      let juste;
      if (q.t === 'vf') juste = rep !== null && (rep === '1') === !!q.b;
      else { const sel = rep || []; juste = sel.length === q.b.length && sel.every(k => q.b.includes(k)); }
      S.stats.reponses++;
      noterTheme(q, juste);
      if (!juste && !opts.pasDeCarnet) enregistrerErreur({ type: 'q', etage: q.etage, qid: q.id });
      if (juste) {
        bonnes++; combo++; S.stats.bonnes++; S.stats.meilleurCombo = Math.max(S.stats.meilleurCombo, combo);
        const mult = combo >= 6 ? 3 : combo >= 3 ? 2 : 1;
        const vite = opts.chrono && (Date.now() - debut) < opts.chrono * 500 ? 5 : 0;
        const gain = 10 * mult + vite; xpTotal += gain; gagneXP(gain); son('ok'); vibre(30);
      } else { combo = 0; son('ko'); vibre([60, 40, 60]); sauver(); }
      // marquer les réponses
      if (q.t === 'vf') $$('[data-v]', m).forEach(b => { b.disabled = true; if ((b.dataset.v === '1') === !!q.b) b.classList.add('ok'); else if (b.dataset.v === rep) b.classList.add('ko'); });
      else $$('[data-k]', m).forEach(b => { const k = +b.dataset.k; b.disabled = true; b.classList.remove('sel'); if (q.b.includes(k)) b.classList.add('ok'); else if ((rep || []).includes(k)) b.classList.add('ko'); });
      if ($('#valider')) $('#valider').remove(); if ($('#j5050')) $('#j5050').remove();
      $('#fb').innerHTML = (rep === null ? '<div class="verdict ko">⏰ Temps écoulé !</div>' : '') + explicationHTML(e, q, juste) + `<button class="btn" id="suiv">${i + 1 < total ? 'Question suivante →' : 'Voir le résultat'}</button>`;
      $('#suiv').onclick = () => { i++; if (i < total) question(); else opts.fin(bonnes, total, xpTotal, jokerQuiz); };
      $('#fb').scrollIntoView({ behavior: animationsOn() ? 'smooth' : 'auto', block: 'start' });
    }
    if (q.t === 'vf') $$('[data-v]', m).forEach(b => b.onclick = () => corriger(b.dataset.v));
    else if (!multi) $$('[data-k]', m).forEach(b => b.onclick = () => corriger([+b.dataset.k]));
    else {
      $$('[data-k]', m).forEach(b => b.onclick = () => { if (!fini) b.classList.toggle('sel'); });
      $('#valider').onclick = () => corriger($$('[data-k].sel', m).map(b => +b.dataset.k));
    }
  }
  question();
}
function ecranResultat(titre, html, boutons) {
  vue(`${entete(titre, true)}<div class="carte centre">${html}</div>${boutons.map((b, k) => `<button class="btn ${b[2] || ''}" data-b="${k}">${b[0]}</button>`).join('')}`);
  $$('[data-b]').forEach(el => el.onclick = () => boutons[+el.dataset.b][1]());
}

/* ============================== VUE : NIVEAUX DE QUIZ ============================== */
const NOMS_NIVEAUX = ['Échauffement', 'Premiers soins', 'Vitesse de croisière', 'Situations délicates', 'Expert(e)'];
VUES.niveaux = ({ id }) => {
  const e = etage(id), st = S.etages[id];
  const debloque = k => k === 0 || st.niveaux[k - 1] >= 6;
  const bossOuvert = st.niveaux[2] >= 6;
  vue(`${entete('🏆 Quiz — ' + esc(e.titre), true)}
  <p class="doux">8 questions par niveau. Il faut <b>6/8</b> pour débloquer le suivant. Les combos multiplient l’XP !</p>
  ${NOMS_NIVEAUX.map((n, k) => `<button class="etage" style="--c:${e.couleur}" data-n="${k}" ${debloque(k) ? '' : 'disabled'}>
    <span class="em">${debloque(k) ? (st.niveaux[k] >= 6 ? '⭐' : '▶️') : '🔒'}</span><span class="info"><b>Niveau ${k + 1} · ${n}</b><small>${st.niveaux[k] ? 'Meilleur score : ' + st.niveaux[k] + '/8 · ' + etoilesTexte(S.etoiles[`niv:${id}:${k}`]) : debloque(k) ? 'À jouer · ★ 6/8 · ★★ 7/8 · ★★★ 8/8' : 'Réussis le niveau ' + k + ' pour ouvrir'}</small></span></button>`).join('')}
  <button class="etage" style="--c:var(--rouge)" id="boss" ${bossOuvert ? '' : 'disabled'}><span class="em">${bossOuvert ? '👹' : '🔒'}</span><span class="info"><b>BOSS : ${esc(e.boss)}</b>
  <small>${st.boss ? 'Vaincu ! ' + st.boss + '/10 · ' + etoilesTexte(S.etoiles[`boss:${id}`]) : bossOuvert ? '10 questions · 25 s chacune · 7/10 pour gagner' : 'Réussis le niveau 3 pour l’affronter'}</small></span></button>`);
  $$('[data-n]').forEach(b => b.onclick = () => { if (debloque(+b.dataset.n)) lancerNiveau(id, +b.dataset.n); });
  $('#boss').onclick = () => { if (bossOuvert) lancerBoss(id); };
};
function lancerNiveau(id, k) {
  const e = etage(id), toutes = questionsEtage(e);
  let pool = toutes.filter(POOLS[k]);
  if (pool.length < 8) pool = pool.concat(shuffle(toutes.filter(q => !pool.includes(q))).slice(0, 8 - pool.length));
  // privilégier les questions rédigées (les questions auto complètent)
  const redigees = shuffle(pool.filter(q => !q.auto)), autos = shuffle(pool.filter(q => q.auto));
  const choix = shuffle(redigees.slice(0, 6).concat(autos).concat(redigees.slice(6)).slice(0, 8));
  quiz({
    titre: `Niveau ${k + 1} · ${NOMS_NIVEAUX[k]}`, questions: choix, chrono: 0,
    fin: (b, t, xp, joker) => {
      const st = S.etages[id], dejaReussi = st.niveaux[k] >= 6;
      st.niveaux[k] = Math.max(st.niveaux[k], b);
      donnerEtoiles(`niv:${id}:${k}`, etoilesQuiz(b), joker); evenement('niveau', { id, b });
      if (b >= 6 && !dejaReussi) { gagneXP(50); confettis(); son('niveau'); }
      sauver();
      ecranResultat('Résultat', `<div class="grand-emoji">${b >= 6 ? '🎉' : '💪'}</div><h2>${b}/${t}</h2><p>${b >= 6 ? (k < 4 ? 'Niveau réussi ! Le suivant est ouvert.' : 'Tu as terminé tous les niveaux !') : 'Il faut 6/8. Réessaie, les questions changent à chaque partie.'}</p><p class="doux">+${xp + (b >= 6 && !dejaReussi ? 50 : 0)} XP</p>`,
        [['Rejouer ce niveau', () => lancerNiveau(id, k)], ...(b >= 6 && k < 4 ? [['Niveau suivant →', () => lancerNiveau(id, k + 1), 'vert']] : []), ['Retour aux niveaux', () => aller('niveaux', { id }, true), 'sec']]);
    }
  });
}
function lancerBoss(id) {
  const e = etage(id), toutes = questionsEtage(e);
  const dures = shuffle(toutes.filter(q => q.n >= 2 && !q.auto));
  const qs = shuffle(dures.slice(0, 8).concat(shuffle(toutes.filter(q => !dures.slice(0, 8).includes(q))).slice(0, 10 - Math.min(8, dures.length)))).slice(0, 10);
  quiz({
    titre: '👹 ' + e.boss, questions: qs, chrono: 25,
    fin: (b, t, xp, joker) => {
      const st = S.etages[id], deja = st.boss;
      donnerEtoiles(`boss:${id}`, etoilesBoss(b), joker);
      if (b >= 7) { st.boss = Math.max(st.boss, b); if (!deja) { S.stats.boss++; gagneXP(150); } confettis(); son('niveau'); }
      sauver();
      ecranResultat('Boss', `<div class="grand-emoji">${b >= 7 ? '🏆' : '👹'}</div><h2>${b}/${t}</h2><p>${b >= 7 ? 'Boss vaincu ! Tu gères cet étage.' : 'Le boss résiste… Il faut 7/10. Revois les fiches et retente !'}</p><p class="doux">+${xp + (b >= 7 && !deja ? 150 : 0)} XP</p>`,
        [['Revanche !', () => lancerBoss(id), 'rouge'], ['Retour', () => aller('niveaux', { id }, true), 'sec']]);
    }
  });
}

/* ============================== FLASHCARDS (LEITNER) ============================== */
function lancerFlash(ids) {
  let { dues, nouvelles } = cartesDues(ids);
  const aRevoir = shuffle(dues).slice(0, 20);
  let paquet = aRevoir.concat(shuffle(nouvelles).slice(0, Math.max(8, 15 - aRevoir.length)));   // ≥ 15 cartes si possible (mission du jour)
  let libre = false;
  if (!paquet.length) {
    const toutes = ETAGES.filter(e => !ids || ids.includes(e.id)).flatMap(cartesEtage);
    return ecranResultat('Flashcards', `<div class="grand-emoji">😴</div><h2>Rien à revoir aujourd’hui !</h2><p>Toutes tes cartes sont à jour. Tu peux quand même t’entraîner en mode libre (sans changer les boîtes).</p>`,
      [['Mode libre (10 cartes)', () => { flashSession(shuffle(toutes).slice(0, 10), true, ids); }], ['Retour', () => history.back(), 'sec']]);
  }
  flashSession(shuffle(paquet), libre, ids);
}
function flashSession(paquet, libre, ids) {
  let i = 0, sues = 0;
  function carte() {
    const c = paquet[i], e = etage(c.etage), st = S.cartes[c.id] || { boite: 0 };
    vue(`${entete('🃏 Flashcards' + (libre ? ' (libre)' : ''), true)}
    <div class="progression"><span>Carte ${i + 1}/${paquet.length}</span><span>${e.emoji} ${esc(e.themes[c.th] || '')}</span></div>
    <div class="boites" title="Boîte Leitner">${[1, 2, 3, 4, 5].map(b => `<span class="${st.boite >= b ? 'on' : ''}">${b}</span>`).join('')}</div>
    <div class="flash" id="fl"><div class="flash-in">
      <div class="face recto"><div class="gros">${esc(c.recto)}</div><p class="centre doux" style="margin-top:14px">Touche pour retourner</p></div>
      <div class="face verso"><div class="gros">${esc(c.verso)}</div>${c.pourquoi ? `<div class="bloc b-pourquoi"><b class="t">🧠 Le pourquoi</b>${esc(c.pourquoi)}</div>` : ''}<div class="source">📚 ${esc(sourceTexte(e, c.s))}</div></div>
    </div></div>
    <div id="act"><button class="btn" id="ret">Retourner la carte</button></div>`);
    const ret = () => {
      $('#fl').classList.add('retournee'); son('clic');
      $('#act').innerHTML = `<div class="rangee"><button class="btn rouge" data-r="0">😵 Raté</button><button class="btn orange" data-r="1">🤔 Pas sûre</button><button class="btn vert" data-r="2">😎 Je savais</button></div>`;
      $$('[data-r]').forEach(b => b.onclick = () => noter(+b.dataset.r));
    };
    $('#ret').onclick = ret; $('#fl').onclick = () => { if (!$('#fl').classList.contains('retournee')) ret(); };
    function noter(r) {
      if (!libre) {
        let b = st.boite || 0;
        b = r === 2 ? Math.min(5, b + 1) : r === 1 ? Math.max(1, b) : 1;
        S.cartes[c.id] = { boite: b, due: ajouteJours(dateLocale(), INTERVALLES[b]) };
      }
      if (r === 2) sues++;
      S.stats.cartes++; S.stats.cartesDepuisCafe++; evenement('carte', {});
      if (S.stats.cartesDepuisCafe >= 10) { S.stats.cartesDepuisCafe = 0; if (S.cafes < CAFES_MAX) { S.cafes++; toast('☕ +1 café rechargé grâce aux flashcards !'); } }
      gagneXP(r === 2 ? 5 : 2);
      i++; if (i < paquet.length) carte(); else fin();
    }
  }
  function fin() {
    confettis();
    ecranResultat('Flashcards', `<div class="grand-emoji">🧠</div><h2>Session terminée !</h2><p>${sues}/${paquet.length} cartes sues du premier coup.</p><p class="doux">Les cartes ratées reviennent demain, les cartes sues de plus en plus tard (1 → 2 → 4 → 7 → 14 jours).</p>`,
      [['Encore une session', () => lancerFlash(ids)], ['Retour', () => history.back(), 'sec']]);
  }
  carte();
}

/* ============================== VUE : RÉVISION (toutes matières) ============================== */
VUES.revision = () => {
  const lignes = ETAGES.map(e => { const { dues, nouvelles } = cartesDues([e.id]); return `<button class="etage" style="--c:${e.couleur}" data-f="${e.id}"><span class="em">${e.emoji}</span><span class="info"><b>${esc(e.titre)}</b><small>${dues.length} à revoir · ${nouvelles.length} nouvelles · ${e.cartes.length} au total</small></span></button>`; }).join('');
  const { dues } = cartesDues();
  const boites = [0, 0, 0, 0, 0, 0]; Object.values(S.cartes).forEach(c => boites[c.boite || 0]++);
  vue(`${entete('🃏 Salle de révision', false)}
  ${monito('Les flashcards fonctionnent en <b>répétition espacée</b> : ce que tu sais revient moins souvent, ce que tu rates revient demain. 10 cartes = 1 café ☕')}
  <button class="btn violet" id="tout">Tout réviser (${dues.length} à revoir)</button>
  ${lignes}
  <div class="carte"><b>Tes boîtes</b><div class="boites" style="justify-content:space-around;margin-top:8px">${[1, 2, 3, 4, 5].map(b => `<div class="centre"><span class="on" style="margin:auto">${b}</span><small>${boites[b]}</small></div>`).join('')}</div></div>
  <button class="btn sec" id="calc">🧮 Calcul flash toutes matières</button>`);
  $('#tout').onclick = () => lancerFlash(null);
  $$('[data-f]').forEach(b => b.onclick = () => lancerFlash([b.dataset.f]));
  $('#calc').onclick = () => jeuCalcul(null);
};

/* ============================== VUE : VESTIAIRE (PROFIL) ============================== */
VUES.vestiaire = () => {
  const g = grade(), st = S.stats;
  const taux = st.reponses ? Math.round(st.bonnes / st.reponses * 100) : 0;
  vue(`${entete('🎖️ Vestiaire', false)}
  <div class="carte centre"><div class="grand-emoji">${g.ico}</div><h2>${g.nom}</h2><p>${S.xp} XP · série ${S.serie.n} j (record ${S.serie.max} j)</p>
  <div class="cafes">${'☕'.repeat(S.cafes)}${'▫️'.repeat(CAFES_MAX - S.cafes)}</div><small>Les cafés se perdent sur une erreur grave en garde et se rechargent avec les flashcards (10 cartes = 1 café).</small></div>
  <div class="carte"><b>Grades</b>${GRADES.map(x => `<div class="ligne"><span>${x[2]} ${x[1]}</span><span>${S.xp >= x[0] ? '✅' : x[0] + ' XP'}</span></div>`).join('')}</div>
  <div class="carte"><b>Maîtrise par étage</b>${ETAGES.map(e => `<div class="ligne"><span>${e.emoji} ${esc(e.titre)}</span><span>${maitrise(e.id)}%</span></div>`).join('')}</div>
  <div class="carte"><b>🎁 Récompenses (★ ${etoilesTotal().n}/${etoilesTotal().max})</b><p class="doux" style="font-size:.8rem">Elles se débloquent avec les étoiles. Rien ne se dépense.</p>
  ${RECOMPENSES.map(r => { const ok = etoilesTotal().n >= seuilRecompense(r[0]); return `<div class="ligne"><span>${ok ? '✅' : '🔒'} ${esc(r[2])}</span><span>★ ${seuilRecompense(r[0])}</span></div>`; }).join('')}</div>
  <div class="carte"><b>👗 Apparence</b>
  <label class="switch"><span>Accessoire de Monito</span><select id="acc"><option value="">Aucun</option>${['stetho:Stéthoscope', 'calot:Calot', 'lunettes:Lunettes', 'couronne:Couronne'].map(x => x.split(':')).filter(([k]) => recompenseDebloquee('acc-' + k)).map(([k, n]) => `<option value="${k}">${n}</option>`).join('')}</select></label>
  <label class="switch"><span>Couleurs</span><select id="pal"><option value="defaut">Bleu soin</option>${['menthe:Menthe', 'violet:Nuit violette', 'corail:Corail'].map(x => x.split(':')).filter(([k]) => recompenseDebloquee('pal-' + k)).map(([k, n]) => `<option value="${k}">${n}</option>`).join('')}</select></label>
  <label class="switch"><span>Titre</span><select id="tit"><option value="">Aucun</option>${recompenseDebloquee('titre-lynx') ? '<option value="lynx">Œil de lynx</option>' : ''}${recompenseDebloquee('acc-couronne') ? '<option value="legende">Légende des étages</option>' : ''}</select></label>
  <div class="centre" style="width:96px;height:96px;margin:8px auto">${monitoSVG()}</div></div>
  <h2>Badges (${Object.keys(S.badges).length}/${BADGES.length})</h2>
  <div class="grille3">${BADGES.map(([id, ico, nom, desc]) => `<div class="badge ${S.badges[id] ? '' : 'off'}" title="${esc(desc)}"><span class="ico">${ico}</span><b>${esc(nom)}</b><small>${esc(desc)}</small></div>`).join('')}</div>
  <div class="carte"><b>Statistiques</b>
  <div class="ligne"><span>Réponses</span><span>${st.reponses} (${taux}% justes)</span></div>
  <div class="ligne"><span>Meilleur combo</span><span>${st.meilleurCombo}</span></div>
  <div class="ligne"><span>Flashcards révisées</span><span>${st.cartes}</span></div>
  <div class="ligne"><span>Gardes terminées</span><span>${st.gardes}</span></div>
  <div class="ligne"><span>Escape games réussis</span><span>${st.escapes}</span></div>
  <div class="ligne"><span>Mini-jeux</span><span>${st.miniJeux}</span></div>
  <div class="ligne"><span>Erreurs rattrapées</span><span>${st.rattrapages}</span></div>
  <div class="ligne"><span>Série de missions</span><span>${S.missionsSerie.n} j (record ${S.missionsSerie.max})</span></div></div>`);
  $('#acc').value = S.apparence.accessoire || ''; $('#pal').value = S.apparence.palette || 'defaut'; $('#tit').value = S.apparence.titre || '';
  $('#acc').onchange = ev => { S.apparence.accessoire = ev.target.value || null; sauver(); aller('vestiaire', {}, true); };
  $('#pal').onchange = ev => { S.apparence.palette = ev.target.value; sauver(); appliquerReglages(); };
  $('#tit').onchange = ev => { S.apparence.titre = ev.target.value || null; sauver(); };
};

/* ============================== VUE : RÉGLAGES / À PROPOS ============================== */
VUES.parametres = () => {
  const r = S.reglages;
  const nbQ = ETAGES.reduce((n, e) => n + questionsEtage(e).length, 0), nbC = ETAGES.reduce((n, e) => n + e.cartes.length, 0);
  vue(`${entete('⚙️ Réglages', false)}
  <div class="carte">
    <label class="switch"><span>🌗 Thème</span><select id="theme"><option value="auto">Automatique</option><option value="light">Clair</option><option value="dark">Sombre</option></select></label>
    <label class="switch"><span>🔊 Sons</span><input type="checkbox" id="son" ${r.son ? 'checked' : ''} style="width:24px;height:24px"></label>
    <label class="switch"><span>📳 Vibrations</span><input type="checkbox" id="vib" ${r.vibration ? 'checked' : ''} style="width:24px;height:24px"></label>
    <label class="switch"><span>✨ Animations</span><input type="checkbox" id="anim" ${r.animations ? 'checked' : ''} style="width:24px;height:24px"></label>
  </div>
  <div class="carte"><b>💾 Sauvegarde</b><p class="doux">Ta progression est enregistrée dans ce navigateur. Exporte-la de temps en temps (changement de téléphone, nettoyage…).${S.dernierExport ? ' Dernier export : ' + dateFr(S.dernierExport) + '.' : ''}</p>
  <button class="btn" id="exp">Exporter ma progression</button>
  <label class="btn sec" for="imp">Importer une sauvegarde</label><input type="file" id="imp" accept="application/json,.json" hidden>
  <button class="btn rouge" id="raz">Tout recommencer à zéro</button></div>
  <div class="carte"><b>ℹ️ À propos</b>
  <p>Garde de nuit v${APP_VERSION} — jeu de révision des stages infirmiers (bac 4). ${nbC} flashcards et ${nbQ} questions réparties sur ${ETAGES.length} étages.</p>
  <p class="doux">Le contenu s’appuie sur des recommandations publiées (ERC, Surviving Sepsis Campaign, SCCM, OMS, NICE, AHA, Brain Trauma Foundation, RCP…) citées sous chaque explication. Il ne remplace ni le cours, ni le protocole du service, ni l’avis de ton/ta référent(e). Les doses de médicaments se vérifient toujours sur le CBIP et la prescription.</p>
  <p class="doux">Tous les patients du jeu sont fictifs.</p>
  <p class="signature" style="margin:8px 0 0">Créé par Gauthier Doumont</p></div>`);
  $('#theme').value = r.theme;
  $('#theme').onchange = e => { r.theme = e.target.value; appliquerReglages(); sauver(); };
  $('#son').onchange = e => { r.son = e.target.checked; sauver(); son('ok'); };
  $('#vib').onchange = e => { r.vibration = e.target.checked; sauver(); vibre(40); };
  $('#anim').onchange = e => { r.animations = e.target.checked; appliquerReglages(); sauver(); };
  $('#exp').onclick = exporter;
  $('#imp').onchange = e => { if (e.target.files[0]) importer(e.target.files[0]); };
  $('#raz').onclick = () => { if (confirm('Effacer toute ta progression ? (Pense à exporter avant !)') && confirm('Vraiment sûre ? C’est définitif.')) { S = etatParDefaut(); sauver(); appliquerReglages(); toast('Nouvelle partie !'); aller('accueil', {}, true); } };
};

/* ============================== MODE GARDE ============================== */
const NORMES = { FC: [50, 110], PAS: [90, 160], PAM: [65, 110], SpO2: [92, 100], FR: [10, 24], T: [36, 38.4], GCS: [15, 15] };
function moniteurHTML(v) {
  const pam = v.PAS && v.PAD ? Math.round((v.PAS + 2 * v.PAD) / 3) : null;
  const al = (k, x) => x != null && NORMES[k] && (x < NORMES[k][0] || x > NORMES[k][1]) ? 'alerte' : '';
  return `<div class="moniteur" role="img" aria-label="Moniteur : FC ${v.FC}, PA ${v.PAS}/${v.PAD}, SpO2 ${v.SpO2}%, FR ${v.FR}"><canvas id="ecg" height="70"></canvas>
  <div class="constantes">
    <div class="cst fc ${al('FC', v.FC)}"><small>FC /min</small><b>${v.FC ?? '--'}</b></div>
    <div class="cst pa ${al('PAS', v.PAS) || al('PAM', pam)}"><small>PA (PAM)</small><b>${v.PAS ?? '--'}/${v.PAD ?? '--'}</b> <small style="display:inline">(${pam ?? '--'})</small></div>
    <div class="cst sp ${al('SpO2', v.SpO2)}"><small>SpO₂ %</small><b>${v.SpO2 ?? '--'}</b></div>
    <div class="cst fr ${al('FR', v.FR)}"><small>FR /min</small><b>${v.FR ?? '--'}</b></div>
    <div class="cst t ${al('T', v.T)}"><small>T °C</small><b>${v.T ?? '--'}</b></div>
    <div class="cst gcs ${v.GCS != null && (v.GCSlabel === 'RASS' ? (v.GCS > 0 || v.GCS < -1) : v.GCS < 15) ? 'alerte' : ''}"><small>${v.GCSlabel || 'GCS'}</small><b>${v.GCS == null ? '--' : (v.GCSlabel === 'RASS' && v.GCS > 0 ? '+' : '') + v.GCS}</b></div>
  </div></div>`;
}
function animerECG(fc) {
  const c = $('#ecg'); if (!c) return;
  const ctx = c.getContext('2d'); c.width = c.clientWidth * (devicePixelRatio || 1); c.height = 70 * (devicePixelRatio || 1);
  const W = c.width, H = c.height, k = devicePixelRatio || 1;
  if (!W || !H) return;
  const periode = 60 / Math.max(fc || 70, 20); // secondes par battement
  const vitesse = W / 4;                       // 4 secondes à l’écran
  const fv = fc === 0; // arrêt cardiaque : tracé de fibrillation
  const forme = t => { // t ∈ [0,1[ phase du battement
    if (fv) return .28 * Math.sin(t * 6.283 * 3) + .18 * Math.sin(t * 6.283 * 7.3 + 1) + .1 * Math.sin(t * 6.283 * 11.7);
    if (t < .08) return Math.sin(t / .08 * Math.PI) * .12;
    if (t > .16 && t < .18) return -.15; if (t >= .18 && t < .21) return 1; if (t >= .21 && t < .24) return -.3;
    if (t > .38 && t < .52) return Math.sin((t - .38) / .14 * Math.PI) * .25; return 0;
  };
  if (!animationsOn()) {
    ctx.strokeStyle = '#4BE07A'; ctx.lineWidth = 2 * k; ctx.beginPath();
    for (let x = 0; x < W; x++) { const y = H * .62 - forme(((x / vitesse) / periode) % 1) * H * .5; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke(); return;
  }
  let x = 0, t0 = performance.now(), dernierY = H * .62, id, dernierBip = -1;
  ctx.fillStyle = '#071016'; ctx.fillRect(0, 0, W, H);
  function f(now) {
    // now (horodatage rAF) peut précéder t0 : on borne pour éviter une boucle infinie
    const t = Math.max(0, (now - t0) / 1000), nx = ((Math.floor(t * vitesse) % W) + W) % W;
    let garde = 0;
    while (x !== nx && garde++ < W) {
      const tt = (t - (((nx - x + W) % W) / vitesse));
      const y = H * .62 - forme((tt / periode) % 1) * H * .5;
      ctx.fillStyle = '#071016'; ctx.fillRect(x, 0, 8 * k, H);
      ctx.strokeStyle = '#4BE07A'; ctx.lineWidth = 2 * k; ctx.beginPath(); ctx.moveTo(x, dernierY); ctx.lineTo(x + 1, y); ctx.stroke();
      dernierY = y; x = (x + 1) % W; if (x === 0) dernierY = H * .62;
    }
    const battement = Math.floor(t / periode); if (battement !== dernierBip && S.reglages.son) { dernierBip = battement; son('bip'); }
    id = requestAnimationFrame(f);
  }
  id = requestAnimationFrame(f);
  nettoyages.push(() => cancelAnimationFrame(id));
}
const finsGarde = g => Object.entries(g.noeuds).filter(([, n]) => n.fin).map(([k]) => k);
const ICONE_ISSUE = { bonne: '🌅', moyenne: '🌤️', mauvaise: '🌧️' };
VUES.garde = ({ id, g: gi }) => {
  const e = etage(id), st = S.etages[id];
  if (gi == null) {
    vue(`${entete('🌙 Gardes — ' + esc(e.titre), true)}
    ${monito('Choisis ta garde. Chaque décision change la suite : il existe plusieurs fins à découvrir ! ☕ ' + S.cafes + ' café(s) en poche.')}
    ${e.gardes.map((g, k) => { const r = (st.gardes || {})[g.id], fins = finsGarde(g), vues = ((st.fins || {})[g.id] || []).filter(f => fins.includes(f)).length;
      return `<button class="etage" style="--c:${e.couleur}" data-g="${k}"><span class="em">${r != null ? (r >= 80 ? '🌅' : r >= 50 ? '🌤️' : '🌧️') : '🌙'}</span>
      <span class="info"><b>${esc(g.titre)}</b><small>Difficulté ${'🌶️'.repeat(g.difficulte || 2)}${r != null ? ' · record ' + r + '% · ' + etoilesTexte(S.etoiles[`garde:${id}:${g.id}`]) : ' · pas encore jouée'} · 🏁 ${vues}/${fins.length} fins</small></span></button>`; }).join('')}`);
    $$('[data-g]').forEach(b => b.onclick = () => aller('garde', { id, g: +b.dataset.g }));
    return;
  }
  const g = e.gardes[gi], rec = (st.gardes || {})[g.id];
  vue(`${entete('🌙 ' + esc(g.titre), true)}
  ${monito(esc(g.intro))}
  <div class="carte"><b>Comment ça marche ?</b><p>À chaque étape, choisis l’action la plus juste. Tes choix changent l’état du patient… et la suite de l’histoire. Une erreur grave coûte ☕ un café.</p>
  <p>Besoin d’aide ? Le bouton <b>☕ Appeler le référent</b> donne un indice contre 1 café.</p>
  <p>Tu as <span class="cafes">${'☕'.repeat(S.cafes) || '0 café'}</span>${S.cafes === 0 ? ' — pas de joker possible : révise 10 flashcards pour recharger un café. Tu peux quand même jouer !' : ''}</p>
  <p class="doux">🏁 ${((st.fins || {})[g.id] || []).length}/${finsGarde(g).length} fins découvertes.${rec != null ? ' Ton record : ' + rec + '%.' : ''}</p></div>
  ${recompenseDebloquee('blanche') ? '<label class="switch carte"><span>🌑 Mode Nuit blanche (constantes plus variables, sans joker)</span><input type="checkbox" id="blanche" style="width:24px;height:24px"></label>' : ''}
  <button class="btn violet" id="go">Prendre la garde</button>`);
  $('#go').onclick = () => jouerGarde(id, gi, { blanche: !!($('#blanche') && $('#blanche').checked) });
};
/* Constantes : bornes d’affichage et variation tirée au début de chaque partie (garde.varier) */
const BORNES = { FC: [30, 180], PAS: [50, 230], PAD: [25, 130], SpO2: [60, 100], FR: [4, 45], T: [34, 41.5] };
function tirerDecalage(varier) {
  const d = {};
  Object.entries(varier || {}).forEach(([k, amp]) => { const r = (Math.random() * 2 - 1) * amp; d[k] = k === 'T' ? Math.round(r * 10) / 10 : Math.round(r); });
  if (d.PAS != null && d.PAD == null) d.PAD = Math.round(d.PAS * 0.6);
  return d;
}
function appliquerDecalage(v, d) {
  const r = Object.assign({}, v);
  Object.keys(d).forEach(k => {
    if (r[k] == null || typeof r[k] !== 'number' || !BORNES[k]) return;
    if (r[k] === 0) return;                        // arrêt (FC 0, FR 0) : jamais modifié
    const x = clamp(r[k] + d[k], BORNES[k][0], BORNES[k][1]);
    r[k] = k === 'T' ? Math.round(x * 10) / 10 : Math.round(x);
  });
  if (r.PAS != null && r.PAD != null && r.PAD >= r.PAS - 10) r.PAD = r.PAS - 15;
  return r;
}
const suiteDe = c => Array.isArray(c.suite) ? pick(c.suite) : c.suite;
function jouerGarde(id, gi = 0, mode = {}) {
  const e = etage(id), g = e.gardes[gi];
  const varier = Object.assign({}, g.varier); if (mode.blanche) Object.keys(varier).forEach(k => varier[k] *= 2);
  const decalage = tirerDecalage(varier);
  let points = 0, max = 0, erreurs = 0, joker = false, v = Object.assign({}, g.noeuds.debut.v || {});
  function noeud(nid) {
    const n = g.noeuds[nid];
    if (n.v) v = Object.assign({}, v, n.v);
    if (n.fin) return sbar(n, nid);
    let retires = [];
    function dessin() {
      const visibles = n.choix.map((c, k) => k).filter(k => !retires.includes(k));
      const m = vue(`${entete('🌙 ' + esc(g.titre), true)}
        ${n.patient ? `<div class="chip" style="margin-bottom:6px">🛏️ ${esc(n.patient)}</div>` : ''}
        ${n.evenement ? `<div class="chip" style="margin-bottom:6px;border-color:var(--orange)">⚡ Imprévu</div>` : ''}
        ${moniteurHTML(appliquerDecalage(v, decalage))}
        <div class="carte">${n.heure ? `<small class="doux">🕑 ${esc(n.heure)}</small>` : ''}<p>${esc(n.texte)}</p></div>
        <div id="aide"></div>
        <div id="ch">${shuffle(visibles).map(k => `<button class="choix" data-k="${k}">${esc(n.choix[k].t)}</button>`).join('')}</div>
        ${mode.blanche ? '<p class="doux centre">🌑 Nuit blanche : pas de joker</p>' : `<button class="btn sec" id="joker" ${S.cafes > 0 ? '' : 'disabled'}>☕ Appeler le référent ${S.cafes > 0 ? '(−1 café)' : '(plus de café)'}</button>`}<div id="fb"></div>`);
      animerECG(v.FC);
      if ($('#joker')) $('#joker').onclick = () => {
        if (S.cafes <= 0) return;
        S.cafes--; joker = true; sauver(); son('clic');
        const q0 = n.choix.map((c, k) => k).filter(k => n.choix[k].q === 0 && !retires.includes(k));
        if (n.indice) { $('#aide').innerHTML = `<div class="bloc b-stage"><b class="t">☕ Ton/ta référent(e) te glisse</b>${esc(n.indice)}</div>`; $('#joker').remove(); }
        else if (q0.length) { retires.push(q0[0]); dessin(); toast('☕ Le référent écarte une mauvaise option'); }
      };
      $$('[data-k]', m).forEach(b => b.onclick = () => {
        const c = n.choix[+b.dataset.k];
        max += 2; points += c.q;
        $$('[data-k]', m).forEach(x => { x.disabled = true; if (n.choix[+x.dataset.k].q === 2) x.classList.add('ok'); });
        if ($('#joker')) $('#joker').remove();
        if (c.q < 2) b.classList.add('ko');
        if (c.q === 0) { erreurs++; if (S.cafes > 0) { S.cafes--; toast('☕ −1 café'); } son('ko'); vibre([80, 50, 80]); enregistrerErreur({ type: 'g', etage: id, g: g.id, n: nid }); }
        else if (c.q === 2) { son('ok'); vibre(30); gagneXP(15); } else son('clic');
        if (c.v) v = Object.assign({}, v, c.v);
        sauver();
        const titre = c.q === 2 ? '<div class="verdict ok">Excellent choix ✅</div>' : c.q === 1 ? '<div class="verdict" style="color:var(--orange)">Acceptable, mais pas le plus prioritaire 🟠</div>' : '<div class="verdict ko">Décision risquée ❌</div>';
        $('#fb').innerHTML = `${titre}<div class="bloc b-pourquoi"><b class="t">🧠 Le pourquoi</b>${esc(c.fb)}</div>${n.s ? `<div class="source">📚 ${esc(sourceTexte(e, n.s))}</div>` : ''}<button class="btn" id="suiv">Continuer →</button>`;
        $('#suiv').onclick = () => noeud(suiteDe(c));
        $('#fb').scrollIntoView({ behavior: animationsOn() ? 'smooth' : 'auto', block: 'start' });
      });
    }
    dessin();
  }
  function sbar(n, nid) {
    const st = S.etages[id]; st.fins = st.fins || {}; st.fins[g.id] = st.fins[g.id] || [];
    const nouvelle = !st.fins[g.id].includes(nid);
    if (nouvelle) { st.fins[g.id].push(nid); S.stats.finsDecouvertes = (S.stats.finsDecouvertes || 0) + 1; S.jourFins = dateLocale(); sauver(); }
    const lettres = ['S — Situation', 'B — Background (antécédents)', 'A — Assessment (évaluation)', 'R — Recommandation'];
    const items = g.sbar.map((t, k) => ({ t, k }));
    let melange = shuffle(items), choisi = [];
    const issue = n.issue || 'bonne';
    function dessin() {
      vue(`${entete('📞 Transmission SBAR', true)}
      <div class="carte centre"><div class="grand-emoji">${ICONE_ISSUE[issue]}</div><h2>${esc(n.titre || 'Fin de garde')}</h2>${nouvelle ? '<p>🏁 <b>Nouvelle fin découverte !</b></p>' : ''}<p>${esc(n.texte)}</p></div>
      ${monito('<b>Dernière étape : la transmission.</b> Remets les 4 morceaux dans l’ordre S-B-A-R.')}
      <div class="carte"><b>Ta transmission</b>${choisi.map((x, k) => `<div class="etape"><span class="n">${'SBAR'[k]}</span>${esc(x.t)}</div>`).join('') || '<p class="doux">Touche les éléments ci-dessous dans l’ordre.</p>'}</div>
      <div>${melange.filter(x => !choisi.includes(x)).map(x => `<button class="etape" data-k="${x.k}">${esc(x.t)}</button>`).join('')}</div>
      ${choisi.length ? '<button class="btn sec" id="annul">↩️ Annuler le dernier</button>' : ''}`);
      $$('[data-k]').forEach(b => b.onclick = () => { choisi.push(items[+b.dataset.k]); son('clic'); if (choisi.length === 4) fin(); else dessin(); });
      if ($('#annul')) $('#annul').onclick = () => { choisi.pop(); dessin(); };
    }
    function fin() {
      const justes = choisi.filter((x, k) => x.k === k).length;
      if (justes === 4) S.stats.sbarParfaits++;
      const decisions = max ? points / max : 1;
      const bonusCafe = S.cafes > 0 ? 5 : 0;
      const score = Math.min(100, Math.round(decisions * 80 + justes / 4 * 15 + bonusCafe));
      st.garde = Math.max(st.garde || 0, score); st.gardes = st.gardes || {}; st.gardes[g.id] = Math.max(st.gardes[g.id] || 0, score);
      S.stats.gardes++; gagneXP(Math.round(score * 1.5) + (nouvelle ? 20 : 0));
      apresGarde({ id, g, score, joker, issue, nouvelle });
      if (score >= 80) confettis(); son('niveau'); sauver();
      const fins = finsGarde(g);
      ecranResultat('Rapport de garde', `<div class="grand-emoji">${ICONE_ISSUE[issue]}</div><h2>Score : ${score}%</h2>
      <div class="ligne"><span>🏁 Fin</span><span>${esc(n.titre || issue)}</span></div>
      <div class="ligne"><span>🩺 Décisions</span><span>${Math.round(decisions * 100)}%</span></div>
      <div class="ligne"><span>❌ Décisions risquées</span><span>${erreurs}</span></div>
      <div class="ligne"><span>📞 SBAR</span><span>${justes}/4</span></div>
      <div class="ligne"><span>☕ Joker utilisé</span><span>${joker ? 'oui' : 'non'}</span></div>
      <div class="ligne"><span>☕ Bonus café</span><span>${bonusCafe ? '+5' : '0'}</span></div>
      <div class="ligne"><span>🗺️ Fins découvertes</span><span>${st.fins[g.id].filter(f => fins.includes(f)).length}/${fins.length}</span></div>
      <div class="bloc b-clair" style="text-align:left"><b class="t">📞 La bonne transmission</b>${lettres.map((l, k) => `<b>${l}</b> : ${esc(g.sbar[k])}`).join('<br>')}</div>
      <div class="bloc b-stage" style="text-align:left"><b class="t">🩺 À retenir de cette garde</b>${esc(g.retenir)}</div>`,
        [['Rejouer (autre fin ?)', () => jouerGarde(id, gi, mode), 'violet'], ...(gi + 1 < e.gardes.length ? [['Garde suivante →', () => aller('garde', { id, g: gi + 1 }, true), 'vert']] : []), ['Toutes les gardes', () => aller('garde', { id }, true), 'sec']]);
    }
    dessin();
  }
  noeud('debut');
}

/* ============================== ESCAPE GAME ============================== */
VUES.escape = ({ id }) => {
  const e = etage(id), x = e.escape;
  vue(`${entete('🔐 ' + esc(x.titre), true)}
  <div class="carte"><div class="grand-emoji">🚪</div><p>${esc(x.intro)}</p>
  <p class="doux">${x.enigmes.length} énigmes. Chaque énigme résolue te donne un chiffre du code. Mauvaise réponse = +30 s de pénalité. Un indice coûte +20 s.</p>
  ${S.etages[id].escape ? `<p>⏱️ Ton record : <b>${fmtTemps(S.etages[id].escape)}</b> · ${etoilesTexte(S.etoiles['escape:' + id])}</p>` : ''}
  <p class="doux">★ réussi · ★★ sans indice · ★★★ sans indice ni erreur, en moins de 90 s par énigme.</p></div>
  <button class="btn violet" id="go">Entrer dans la salle</button>`);
  $('#go').onclick = () => jouerEscape(id);
};
function jouerEscape(id) {
  const e = etage(id), x = e.escape;
  let k = 0, penalite = 0, debut = Date.now(), chiffres = [], minuteur, indices = 0, fautes = 0, jokerEsc = false;
  const temps = () => Math.floor((Date.now() - debut) / 1000) + penalite;
  function cadre(contenu) {
    const m = vue(`${entete('🔐 ' + esc(x.titre), true)}
      <div class="progression"><span>Énigme ${Math.min(k + 1, x.enigmes.length)}/${x.enigmes.length}</span><span>⏱️ <b id="tps">${fmtTemps(temps())}</b></span></div>
      <div class="code">${x.enigmes.map((en, j) => `<span class="${j < chiffres.length ? 'trouve' : ''}">${j < chiffres.length ? chiffres[j] : '?'}</span>`).join('')}</div>${contenu}`);
    clearInterval(minuteur);
    minuteur = setInterval(() => { const t = $('#tps'); if (t) t.textContent = fmtTemps(temps()); }, 1000);
    nettoyages.push(() => clearInterval(minuteur));
    return m;
  }
  function enigme() {
    if (k >= x.enigmes.length) return final();
    const en = x.enigmes[k];
    let corps = `<div class="carte"><b>${esc(en.titre)}</b><p>${esc(en.texte)}</p></div>`;
    if (en.type === 'code') corps += `<input id="rep" autocomplete="off" placeholder="Ta réponse"><button class="btn" id="val">Valider</button>`;
    else if (en.type === 'ordre') corps += `<div id="ord"></div>`;
    else corps += en.choix.map((c, j) => `<button class="choix" data-j="${j}">${esc(c)}</button>`).join('');
    corps += `<div class="rangee"><button class="btn sec" id="ind">💡 Indice (+20 s)</button><button class="btn sec" id="indc" ${S.cafes > 0 ? '' : 'disabled'}>☕ Indice gratuit</button></div><div id="fb"></div>`;
    const m = cadre(corps);
    const reussi = () => { chiffres.push(en.chiffre); son('ok'); vibre(40); gagneXP(20); $('#fb').innerHTML = `<div class="verdict ok">🔓 Chiffre trouvé : ${en.chiffre}</div>${en.explication ? `<div class="bloc b-pourquoi"><b class="t">🧠 Le pourquoi</b>${esc(en.explication)}</div>` : ''}<button class="btn vert" id="suiv">Énigme suivante →</button>`; $('#suiv').onclick = () => { k++; enigme(); }; $$('button.choix,#val,#ind,#indc', m).forEach(b => b.disabled = true); };
    const rate = el => { fautes++; penalite += 30; son('ko'); vibre([60, 40, 60]); toast('❌ +30 s de pénalité'); if (el) { el.classList.add('secoue'); setTimeout(() => el.classList.remove('secoue'), 400); } };
    $('#indc').onclick = () => { if (S.cafes <= 0) return; S.cafes--; jokerEsc = true; sauver(); $('#ind').disabled = true; $('#indc').disabled = true; $('#fb').innerHTML = `<div class="bloc b-stage"><b class="t">☕ Indice (sans pénalité, étoiles max ★★)</b>${esc(en.indice)}</div>`; };
    $('#ind').onclick = () => { indices++; penalite += 20; $('#indc').disabled = true; $('#ind').disabled = true; $('#fb').innerHTML = `<div class="bloc b-stage"><b class="t">💡 Indice</b>${esc(en.indice)}</div>`; };
    if (en.type === 'code') {
      const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
      const valider = () => { const r = norm($('#rep').value); if (en.reponses.map(norm).includes(r)) reussi(); else rate($('#rep')); };
      $('#val').onclick = valider; $('#rep').onkeydown = ev => { if (ev.key === 'Enter') valider(); };
    } else if (en.type === 'ordre') {
      let pris = []; const melange = shuffle(en.etapes.map((t, j) => j));
      const dessin = () => {
        $('#ord').innerHTML = `<div class="carte">${pris.map((j, n) => `<div class="etape"><span class="n">${n + 1}</span>${esc(en.etapes[j])}</div>`).join('') || '<small class="doux">Touche les étapes dans le bon ordre.</small>'}</div>` +
          melange.filter(j => !pris.includes(j)).map(j => `<button class="etape" data-o="${j}">${esc(en.etapes[j])}</button>`).join('') + (pris.length ? '<button class="btn sec" id="raz">↩️ Recommencer</button>' : '');
        $$('[data-o]').forEach(b => b.onclick = () => { pris.push(+b.dataset.o); if (pris.length === en.etapes.length) { if (pris.every((j, n) => j === n)) { dessin(); reussi(); } else { rate($('#ord')); pris = []; dessin(); } } else dessin(); });
        if ($('#raz')) $('#raz').onclick = () => { pris = []; dessin(); };
      };
      dessin();
    } else {
      $$('[data-j]', m).forEach(b => b.onclick = () => { if (+b.dataset.j === en.b) { b.classList.add('ok'); reussi(); } else { b.classList.add('ko'); b.disabled = true; rate(b); } });
    }
  }
  function final() {
    const code = x.enigmes.map(en => en.chiffre).join('');
    cadre(`<div class="carte"><b>🚪 La porte finale</b><p>${esc(x.final)}</p></div><input id="code" inputmode="numeric" autocomplete="off" placeholder="Code à ${code.length} chiffres"><button class="btn vert" id="ouvrir">Ouvrir la porte</button>`);
    const ouvrir = () => {
      if ($('#code').value.replace(/\D/g, '') === code) {
        clearInterval(minuteur);
        const t = temps(), st = S.etages[id], premier = !st.escape;
        st.escape = st.escape ? Math.min(st.escape, t) : t; if (premier) S.stats.escapes++;
        donnerEtoiles(`escape:${id}`, indices || fautes ? 1 : (t < 90 * x.enigmes.length ? 3 : 2), jokerEsc);
        gagneXP(premier ? 120 : 40); confettis(); son('niveau'); sauver();
        ecranResultat('Évadée !', `<div class="grand-emoji">🔓</div><h2>Porte ouverte en ${fmtTemps(t)}</h2><p>${esc(x.victoire)}</p><p class="doux">Record : ${fmtTemps(st.escape)} (dont ${penalite} s de pénalités)</p>`,
          [['Rejouer (battre le record)', () => jouerEscape(id), 'violet'], ['Retour à l’étage', () => aller('etage', { id }, true), 'sec']]);
      } else { fautes++; penalite += 30; son('ko'); toast('❌ Mauvais code (+30 s)'); }
    };
    $('#ouvrir').onclick = ouvrir; $('#code').onkeydown = ev => { if (ev.key === 'Enter') ouvrir(); };
  }
  enigme();
}

/* ============================== MINI-JEUX ============================== */
function listeJeux(id) {
  const e = etage(id), m = e.mini || {}, jeux = [];
  if ((m.situations || []).length) jeux.push(['situations', '🚑', 'Situations flash', m.situations.length + ' situations de stage']);
  if ((m.prio || []).length) jeux.push(['prio', '🚦', 'Qui en premier ?', 'Classe les patients par priorité']);
  jeux.push(['sprint', '⚡', 'Sprint 60 s', S.etages[id].sprint ? 'Record : ' + S.etages[id].sprint : 'Un max de réponses en 1 min']);
  if ((m.associe || []).length) jeux.push(['memory', '🧩', 'Memory', 'Retrouve les paires']);
  if ((m.mots || []).length) jeux.push(['mots', '🔤', 'Mot mystère', 'Reconstitue le terme']);
  if (m.gds) jeux.push(['gds', '🩸', 'Gaz du sang express', 'Interprète en 3 secondes']);
  if ((m.ordre || []).length) jeux.push(['ordre', '🔢', 'Remets dans l’ordre', 'Les étapes d’un soin']);
  if ((m.tri || []).length) jeux.push(['tri', '🗂️', 'Tri express', 'Classe chaque élément']);
  if ((m.associe || []).length) jeux.push(['associe', '🔗', 'Associe', 'Relie les paires']);
  if ((m.erreur || []).length) jeux.push(['erreur', '🔍', 'Trouve l’erreur', 'Repère ce qui cloche']);
  if ((m.glasgow || []).length) jeux.push(['glasgow', '👁️', 'Glasgow express', 'Calcule Y + V + M']);
  if (m.news2) jeux.push(['news2', '🚨', 'NEWS2 express', 'Score d’alerte précoce']);
  if ((m.calculs || []).length) jeux.push(['calcul', '🧮', 'Calcul flash', 'PAM, débits, doses…']);
  return jeux;
}
function lancerJeu(id, j) { aller('jeu', { id, j }); }   // une entrée d'historique : « retour » ramène à la liste
let jeuCourant = null;
VUES.jeu = ({ id, j }) => {
  jeuCourant = j;
  ({ ordre: jeuOrdre, tri: jeuTri, associe: jeuAssocie, erreur: jeuErreur, glasgow: jeuGlasgow, news2: jeuNews2, calcul: () => jeuCalcul(id), situations: jeuSituations, prio: jeuPrio, sprint: jeuSprint, memory: jeuMemory, mots: jeuMots, gds: jeuGds })[j](id);
};
const tuileJeu = (id, j) => `<button class="tuile" data-id="${id}" data-j="${j[0]}"><span class="ico">${j[1]}</span><b>${j[2]}</b><small>${esc(j[3])}</small>${j[0] !== 'sprint' ? `<small>${etoilesTexte(S.etoiles[`mini:${id}:${j[0]}`])}</small>` : ''}</button>`;
VUES.mini = ({ id }) => {
  const e = etage(id), jeux = listeJeux(id);
  vue(`${entete('🎮 Mini-jeux — ' + esc(e.titre), true)}<p class="doux">${jeux.length} mini-jeux pour cet étage. Une partie dure 1 à 2 minutes.</p><div class="grille2">${jeux.map(j => tuileJeu(id, j)).join('')}</div>`);
  $$('[data-j]').forEach(b => b.onclick = () => lancerJeu(b.dataset.id, b.dataset.j));
};
/* Salle de jeux : tous les mini-jeux de tous les étages, accessible depuis la barre du bas */
VUES.jeux = ({ id: choix } = {}) => {
  const ps = prochainStage();
  const id = choix || (ps ? ps.e.id : ETAGES[0].id), e = etage(id);
  vue(`${entete('🎮 Salle de jeux', false)}
  <p class="doux">Choisis l’étage, puis le mini-jeu. Une partie dure 1 à 2 minutes.</p>
  <div class="seg" style="justify-content:space-between">${ETAGES.map(x => `<button data-et="${x.id}" class="${x.id === id ? 'sel' : ''}" style="flex:1;font-size:.85rem">${x.emoji}<br>${esc(x.titre.replace(/^(La|Le) /, ''))}</button>`).join('')}</div>
  <div class="grille2">${listeJeux(id).map(j => tuileJeu(id, j)).join('')}</div>`);
  $$('[data-et]').forEach(b => b.onclick = () => aller('jeux', { id: b.dataset.et }, true));
  $$('[data-j]').forEach(b => b.onclick = () => lancerJeu(b.dataset.id, b.dataset.j));
};
function finMini(id, titre, ok, total, rejouer, extra = '') {
  if (id && jeuCourant) { donnerEtoiles(`mini:${id}:${jeuCourant}`, etoilesPct(total ? ok / total : 0), false); marquerMini(id, jeuCourant); }
  S.stats.miniJeux++; gagneXP(ok * 8 + 10); if (ok === total) { confettis(); son('niveau'); }
  ecranResultat(titre, `<div class="grand-emoji">${ok === total ? '🌟' : ok >= total / 2 ? '👍' : '💪'}</div><h2>${ok}/${total}</h2>${extra}`,
    [['Rejouer', rejouer, 'violet'], ['Autres mini-jeux', () => history.back(), 'sec']]);
}
function jeuOrdre(id) {
  const e = etage(id), p = pick(e.mini.ordre);
  let pris = []; const melange = shuffle(p.etapes.map((t, j) => j));
  function dessin(fini) {
    vue(`${entete('🔢 Remets dans l’ordre', true)}<div class="carte"><b>${esc(p.titre)}</b><br><small class="doux">Touche les étapes dans l’ordre.</small></div>
    <div class="carte">${pris.map((j, n) => `<div class="etape ${fini ? (j === n ? 'ok' : 'ko') : ''}"><span class="n">${n + 1}</span>${esc(p.etapes[j])}</div>`).join('') || '<small class="doux">Ta séquence apparaîtra ici.</small>'}</div>
    ${fini ? '' : melange.filter(j => !pris.includes(j)).map(j => `<button class="etape" data-o="${j}">${esc(p.etapes[j])}</button>`).join('')}
    ${!fini && pris.length ? '<button class="btn sec" id="annul">↩️ Annuler le dernier</button>' : ''}<div id="fb"></div>`);
    $$('[data-o]').forEach(b => b.onclick = () => { pris.push(+b.dataset.o); son('clic'); dessin(pris.length === p.etapes.length); });
    if ($('#annul')) $('#annul').onclick = () => { pris.pop(); dessin(); };
    if (fini) {
      const ok = pris.filter((j, n) => j === n).length; S.stats.ordres = (S.stats.ordres || 0) + 1;
      $('#fb').innerHTML = `<div class="bloc b-clair"><b class="t">✅ Le bon ordre</b>${p.etapes.map((t, n) => (n + 1) + '. ' + esc(t)).join('<br>')}</div>${p.pourquoi ? `<div class="bloc b-pourquoi"><b class="t">🧠 Le pourquoi</b>${esc(p.pourquoi)}</div>` : ''}<div class="source">📚 ${esc(sourceTexte(e, p.s))}</div><button class="btn" id="res">Voir le score</button>`;
      $('#res').onclick = () => finMini(id, 'Remets dans l’ordre', ok, p.etapes.length, () => jeuOrdre(id));
    }
  }
  dessin(false);
}
function jeuTri(id) {
  const e = etage(id), p = pick(e.mini.tri), items = shuffle(p.items);
  let k = 0, ok = 0, rates = [];
  function item() {
    if (k >= items.length) return finMini(id, 'Tri express', ok, items.length, () => jeuTri(id), rates.length ? `<div class="bloc b-piege" style="text-align:left"><b class="t">À revoir</b>${rates.map(r => esc(r[0]) + ' → <b>' + esc(p.cats[r[1]]) + '</b>').join('<br>')}</div>` : '');
    const it = items[k];
    vue(`${entete('🗂️ ' + esc(p.titre), true)}<div class="progression"><span>${k + 1}/${items.length}</span><span>✅ ${ok}</span></div>
    <div class="carte centre" style="min-height:120px;display:flex;align-items:center;justify-content:center"><div class="question">${esc(it[0])}</div></div>
    ${p.cats.map((c, j) => `<button class="btn ${['', 'violet', 'orange', 'vert'][j % 4]}" data-c="${j}">${esc(c)}</button>`).join('')}<div id="fb"></div>`);
    $$('[data-c]').forEach(b => b.onclick = () => {
      $$('[data-c]').forEach(x => x.disabled = true);
      const juste = +b.dataset.c === it[1];
      if (juste) { ok++; son('ok'); } else { rates.push(it); son('ko'); vibre(60); }
      $('#fb').innerHTML = `<div class="verdict ${juste ? 'ok' : 'ko'}">${juste ? '✅ Oui !' : '❌ C’était : ' + esc(p.cats[it[1]])}</div>${it[2] ? `<div class="bloc b-pourquoi">${esc(it[2])}</div>` : ''}`;
      setTimeout(() => { k++; item(); }, juste && !it[2] ? 700 : 1900);
    });
  }
  item();
}
function jeuAssocie(id) {
  const e = etage(id), p = pick(e.mini.associe);
  const paires = shuffle(p.paires).slice(0, 6);
  const gauche = shuffle(paires.map((x, j) => j)), droite = shuffle(paires.map((x, j) => j));
  let sel = null, faites = [], erreurs = 0;
  vue(`${entete('🔗 ' + esc(p.titre), true)}<p class="doux">Touche un élément à gauche puis sa paire à droite.</p>
  <div class="assoc"><div>${gauche.map(j => `<button data-g="${j}" style="width:100%;margin-bottom:8px">${esc(paires[j][0])}</button>`).join('')}</div>
  <div>${droite.map(j => `<button data-d="${j}" style="width:100%;margin-bottom:8px">${esc(paires[j][1])}</button>`).join('')}</div></div><p class="centre doux" id="err">Erreurs : 0</p>`);
  $$('[data-g]').forEach(b => b.onclick = () => { if (faites.includes(+b.dataset.g)) return; $$('[data-g]').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); sel = +b.dataset.g; son('clic'); });
  $$('[data-d]').forEach(b => b.onclick = () => {
    const j = +b.dataset.d; if (sel === null || faites.includes(j)) return;
    if (j === sel) { faites.push(j); son('ok'); $(`[data-g="${j}"]`).classList.remove('sel'); $(`[data-g="${j}"]`).classList.add('fait'); b.classList.add('fait'); sel = null;
      if (faites.length === paires.length) setTimeout(() => finMini(id, 'Associe', Math.max(0, paires.length - erreurs), paires.length, () => jeuAssocie(id), `<p>${erreurs} erreur(s)</p><div class="bloc b-clair" style="text-align:left">${paires.map(x => esc(x[0]) + ' ↔ <b>' + esc(x[1]) + '</b>').join('<br>')}</div><div class="source">📚 ${esc(sourceTexte(e, p.s))}</div>`), 500);
    } else { erreurs++; son('ko'); vibre(60); b.classList.add('secoue'); setTimeout(() => b.classList.remove('secoue'), 400); $('#err').textContent = 'Erreurs : ' + erreurs; }
  });
}
function jeuErreur(id) {
  const e = etage(id), p = pick(e.mini.erreur);
  const items = shuffle(p.items.map((x, j) => j));
  vue(`${entete('🔍 Trouve l’erreur', true)}<div class="carte"><b>${esc(p.titre)}</b><p>${esc(p.scene)}</p><small class="doux">Sélectionne <b>toutes</b> les erreurs, puis valide.</small></div>
  ${items.map(j => `<button class="choix" data-j="${j}">${esc(p.items[j][0])}</button>`).join('')}<button class="btn" id="val">Valider</button><div id="fb"></div>`);
  $$('[data-j]').forEach(b => b.onclick = () => b.classList.toggle('sel'));
  $('#val').onclick = () => {
    let ok = 0;
    $$('[data-j]').forEach(b => { const it = p.items[+b.dataset.j], s = b.classList.contains('sel'); b.disabled = true; b.classList.remove('sel'); if (s === it[1]) ok++; if (it[1]) b.classList.add(s ? 'ok' : 'ko'); else if (s) b.classList.add('ko'); });
    $('#val').remove(); son(ok === p.items.length ? 'ok' : 'ko');
    $('#fb').innerHTML = `<div class="bloc b-pourquoi"><b class="t">🧠 Les erreurs</b>${p.items.filter(x => x[1]).map(x => '• ' + esc(x[0]) + ' → ' + esc(x[2])).join('<br>')}</div><div class="source">📚 ${esc(sourceTexte(e, p.s))}</div><button class="btn" id="res">Voir le score</button>`;
    $('#res').onclick = () => finMini(id, 'Trouve l’erreur', ok, p.items.length, () => jeuErreur(id));
  };
}
function jeuGlasgow(id) {
  const e = etage(id), cas = shuffle(e.mini.glasgow).slice(0, 5);
  let k = 0, ok = 0;
  const Y = ['1 · Aucune', '2 · À la pression', '3 · Au bruit / à la demande', '4 · Spontanée'];
  const V = ['1 · Aucune', '2 · Sons', '3 · Mots', '4 · Confuse', '5 · Orientée'];
  const M = ['1 · Aucune', '2 · Extension', '3 · Flexion anormale', '4 · Flexion normale (retrait)', '5 · Localise', '6 · Obéit'];
  function un() {
    if (k >= cas.length) return finMini(id, 'Glasgow express', ok, cas.length, () => jeuGlasgow(id), '<p class="doux">Rappel : on note la <b>meilleure</b> réponse observée, et « NT » si un élément n’est pas testable (ex. patient intubé pour le verbal).</p>');
    const c = cas[k], rep = { y: 0, v: 0, m: 0 };
    vue(`${entete('👁️ Glasgow express', true)}<div class="progression"><span>Patient ${k + 1}/${cas.length}</span><span>✅ ${ok}</span></div>
    <div class="carte"><p>${esc(c.desc)}</p></div>
    <b>👁️ Ouverture des yeux (Y)</b><div class="seg" data-g="y">${Y.map((t, j) => `<button data-v="${j + 1}">${esc(t)}</button>`).join('')}</div>
    <b>💬 Réponse verbale (V)</b><div class="seg" data-g="v">${V.map((t, j) => `<button data-v="${j + 1}">${esc(t)}</button>`).join('')}</div>
    <b>✋ Réponse motrice (M)</b><div class="seg" data-g="m">${M.map((t, j) => `<button data-v="${j + 1}">${esc(t)}</button>`).join('')}</div>
    <button class="btn" id="val">Valider</button><div id="fb"></div>`);
    $$('.seg').forEach(s => $$('button', s).forEach(b => b.onclick = () => { $$('button', s).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); rep[s.dataset.g] = +b.dataset.v; }));
    $('#val').onclick = () => {
      if (!rep.y || !rep.v || !rep.m) return toast('Choisis Y, V et M');
      const juste = rep.y === c.y && rep.v === c.v && rep.m === c.m;
      if (juste) { ok++; S.stats.glasgowParfaits++; son('ok'); } else son('ko');
      $('#val').remove();
      $('#fb').innerHTML = `<div class="verdict ${juste ? 'ok' : 'ko'}">${juste ? '✅ Parfait' : '❌ Pas tout à fait'} — GCS = Y${c.y} V${c.v} M${c.m} = ${c.y + c.v + c.m}/15</div><div class="bloc b-pourquoi">${esc(c.pourquoi)}</div><button class="btn" id="suiv">Suivant →</button>`;
      $('#suiv').onclick = () => { k++; un(); };
    };
  }
  un();
}
/* NEWS2 (Royal College of Physicians, 2017) — échelle SpO₂ n°1 */
function news2Score(p) {
  const r = [];
  r.push(['FR', p.fr <= 8 ? 3 : p.fr <= 11 ? 1 : p.fr <= 20 ? 0 : p.fr <= 24 ? 2 : 3]);
  r.push(['SpO₂', p.sp <= 91 ? 3 : p.sp <= 93 ? 2 : p.sp <= 95 ? 1 : 0]);
  r.push(['O₂', p.o2 ? 2 : 0]);
  r.push(['PAS', p.pas <= 90 ? 3 : p.pas <= 100 ? 2 : p.pas <= 110 ? 1 : p.pas <= 219 ? 0 : 3]);
  r.push(['FC', p.fc <= 40 ? 3 : p.fc <= 50 ? 1 : p.fc <= 90 ? 0 : p.fc <= 110 ? 1 : p.fc <= 130 ? 2 : 3]);
  r.push(['Conscience', p.acvpu === 'A' ? 0 : 3]);
  r.push(['T°', p.t <= 35 ? 3 : p.t <= 36 ? 1 : p.t <= 38 ? 0 : p.t <= 39 ? 1 : 2]);
  return r;
}
function jeuNews2(id) {
  let k = 0, ok = 0; const N = 4;
  function un() {
    if (k >= N) return finMini(id, 'NEWS2 express', ok, N, () => jeuNews2(id), '<div class="bloc b-stage" style="text-align:left"><b class="t">🩺 Seuils (RCP 2017)</b>0-4 : surveillance de routine, l’infirmier(ère) évalue · un paramètre à 3 ou total 5-6 : réévaluation urgente par le médecin, surveillance au moins horaire · ≥ 7 : réponse d’urgence (équipe de réanimation), monitorage continu. Toujours selon le protocole local.</div>');
    const grave = Math.random() < .6;
    const p = { fr: grave ? rnd(8, 30) : rnd(12, 22), sp: grave ? rnd(86, 98) : rnd(94, 99), o2: Math.random() < (grave ? .5 : .15), pas: grave ? rnd(80, 150) : rnd(105, 160), fc: grave ? rnd(45, 140) : rnd(55, 100), acvpu: Math.random() < (grave ? .25 : .03) ? pick(['C', 'V']) : 'A', t: +(grave ? (35 + Math.random() * 4.6) : (36.2 + Math.random() * 1.8)).toFixed(1) };
    const det = news2Score(p), total = det.reduce((n, x) => n + x[1], 0);
    vue(`${entete('🚨 NEWS2 express', true)}<div class="progression"><span>Patient ${k + 1}/${N}</span><span>✅ ${ok}</span></div>
    <div class="carte"><div class="ligne"><span>Fréquence respiratoire</span><b>${p.fr}/min</b></div><div class="ligne"><span>SpO₂ (échelle 1)</span><b>${p.sp}%</b></div><div class="ligne"><span>Oxygène</span><b>${p.o2 ? 'Oui' : 'Air ambiant'}</b></div><div class="ligne"><span>PA systolique</span><b>${p.pas} mmHg</b></div><div class="ligne"><span>Pouls</span><b>${p.fc}/min</b></div><div class="ligne"><span>Conscience (ACVPU)</span><b>${{ A: 'Alerte', C: 'Confusion nouvelle', V: 'Réagit à la voix' }[p.acvpu]}</b></div><div class="ligne"><span>Température</span><b>${String(p.t).replace('.', ',')} °C</b></div></div>
    <label>Score NEWS2 total :</label><input id="rep" type="number" inputmode="numeric" min="0" max="20"><button class="btn" id="val">Valider</button><div id="fb"></div>`);
    const valider = () => {
      const r = parseInt($('#rep').value, 10); if (isNaN(r)) return toast('Entre un nombre');
      const juste = r === total; if (juste) { ok++; S.stats.calculs++; son('ok'); } else son('ko');
      const unTrois = det.some(x => x[1] === 3);
      const conduite = total >= 7 ? '🔴 ≥ 7 : réponse d’urgence, appel de l’équipe d’urgence/réa, monitorage continu.' : total >= 5 ? '🟠 5-6 : réévaluation urgente par le médecin, surveillance au moins horaire.' : unTrois ? '🟡 Un paramètre à 3 : avis médical urgent, surveillance au moins horaire.' : '🟢 0-4 : surveillance selon le protocole (au moins toutes les 4-12 h), évaluation infirmière.';
      $('#val').remove();
      $('#fb').innerHTML = `<div class="verdict ${juste ? 'ok' : 'ko'}">${juste ? '✅' : '❌'} NEWS2 = ${total}</div><div class="bloc b-tech">${det.map(x => x[0] + ' : ' + x[1]).join(' · ')}</div><div class="bloc b-stage">${conduite}</div><button class="btn" id="suiv">Suivant →</button>`;
      $('#suiv').onclick = () => { k++; un(); };
    };
    $('#val').onclick = valider; $('#rep').onkeydown = ev => { if (ev.key === 'Enter' && $('#val')) valider(); };
  }
  un();
}
/* Générateurs de calculs — résultats arrondis, tolérance indiquée */
const CALCULS = {
  pam: () => { const pas = rnd(8, 18) * 10, pad = rnd(4, Math.min(10, pas / 10 - 3)) * 10; return { q: `PA = ${pas}/${pad} mmHg. Quelle est la PAM ?`, r: (pas + 2 * pad) / 3, tol: 1, u: 'mmHg', exp: `PAM = (PAS + 2 × PAD) / 3 = (${pas} + 2 × ${pad}) / 3 ≈ ${Math.round((pas + 2 * pad) / 3)} mmHg. La diastole compte double car le cœur passe plus de temps en diastole.` }; },
  ppc: () => { const pam = rnd(65, 105), pic = rnd(5, 35); return { q: `PAM = ${pam} mmHg, PIC = ${pic} mmHg. Quelle est la pression de perfusion cérébrale (PPC) ?`, r: pam - pic, tol: 0, u: 'mmHg', exp: `PPC = PAM − PIC = ${pam} − ${pic} = ${pam - pic} mmHg. Cible BTF chez le traumatisé crânien grave : 60-70 mmHg.${pam - pic < 60 ? ' Ici la PPC est trop basse : risque d’ischémie cérébrale !' : ''}` }; },
  debit: () => { const v = pick([250, 500, 1000]), h = pick([2, 4, 6, 8, 12, 24]); return { q: `Perfuser ${v} mL en ${h} h à la pompe. Quel débit (mL/h) ?`, r: v / h, tol: 1, u: 'mL/h', exp: `Débit = volume / temps = ${v} / ${h} ≈ ${Math.round(v / h * 10) / 10} mL/h.` }; },
  gouttes: () => { const v = pick([500, 1000]), h = pick([4, 6, 8, 12, 24]); const r = v * 20 / (h * 60); return { q: `Perfuser ${v} mL en ${h} h par gravité (perfuseur standard : 20 gouttes = 1 mL). Combien de gouttes/min ?`, r, tol: 1, u: 'gttes/min', exp: `gouttes/min = volume (mL) × 20 / temps (min) = ${v} × 20 / ${h * 60} ≈ ${Math.round(r)} gouttes/min.` }; },
  seringue: () => { const mg = pick([10, 20, 50, 100]), vol = 50, dose = pick([1, 2, 3, 4, 5]) * mg / 50; const conc = mg / vol; return { q: `Seringue : ${mg} mg dilués dans ${vol} mL. Prescription : ${dose} mg/h. À quel débit (mL/h) régler le pousse-seringue ?`, r: dose / conc, tol: 0.1, u: 'mL/h', exp: `Concentration = ${mg} / ${vol} = ${conc} mg/mL. Débit = dose / concentration = ${dose} / ${conc} = ${Math.round(dose / conc * 10) / 10} mL/h. (Exercice de calcul : en pratique, dilution et dose selon prescription et protocole.)` }; },
  dose: () => { const kg = rnd(50, 95), mgkg = pick([0.5, 1, 1.5, 2]); return { q: `Prescription d’exercice : ${String(mgkg).replace('.', ',')} mg/kg pour une patiente de ${kg} kg. Dose totale en mg ?`, r: kg * mgkg, tol: 0.5, u: 'mg', exp: `Dose = ${String(mgkg).replace('.', ',')} × ${kg} = ${kg * mgkg} mg. (Calcul d’entraînement : toujours vérifier la dose réelle sur la prescription et le CBIP, avec double vérification.)` }; },
  diurese: () => { const kg = rnd(50, 100), ml = rnd(10, 70); return { q: `Patient de ${kg} kg, diurèse de ${ml} mL sur la dernière heure. Diurèse en mL/kg/h (1 décimale) ?`, r: ml / kg, tol: 0.05, u: 'mL/kg/h', exp: `${ml} / ${kg} ≈ ${(ml / kg).toFixed(2).replace('.', ',')} mL/kg/h. ${ml / kg < 0.5 ? 'Sous 0,5 mL/kg/h : oligurie → à signaler.' : 'Au-dessus de 0,5 mL/kg/h : diurèse correcte.'}` }; }
};
function jeuCalcul(id) {
  const types = id ? etage(id).mini.calculs : Object.keys(CALCULS);
  let k = 0, ok = 0; const N = 5;
  function un() {
    if (k >= N) return finMini(id, 'Calcul flash', ok, N, () => jeuCalcul(id));
    const c = CALCULS[pick(types)]();
    vue(`${entete('🧮 Calcul flash', true)}<div class="progression"><span>Calcul ${k + 1}/${N}</span><span>✅ ${ok}</span></div>
    <div class="carte"><div class="question">${esc(c.q)}</div></div>
    <input id="rep" inputmode="decimal" autocomplete="off" placeholder="Réponse en ${esc(c.u)}"><button class="btn" id="val">Valider</button><div id="fb"></div>`);
    const valider = () => {
      const r = parseFloat($('#rep').value.replace(',', '.')); if (isNaN(r)) return toast('Entre un nombre');
      const juste = Math.abs(r - c.r) <= c.tol + 1e-9; if (juste) { ok++; S.stats.calculs++; son('ok'); } else son('ko');
      $('#val').remove();
      $('#fb').innerHTML = `<div class="verdict ${juste ? 'ok' : 'ko'}">${juste ? '✅ Juste !' : '❌ Réponse attendue ≈ ' + (Math.round(c.r * 100) / 100).toString().replace('.', ',') + ' ' + esc(c.u)}</div><div class="bloc b-pourquoi">${esc(c.exp)}</div><button class="btn" id="suiv">Suivant →</button>`;
      $('#suiv').onclick = () => { k++; un(); };
    };
    $('#val').onclick = valider; $('#rep').onkeydown = ev => { if (ev.key === 'Enter' && $('#val')) valider(); };
  }
  un();
}


/* ---------- Situations flash : une situation, un moniteur, une décision ---------- */
function jeuSituations(id) {
  const e = etage(id), liste = shuffle(e.mini.situations).slice(0, 5);
  let k = 0, ok = 0;
  function une() {
    if (k >= liste.length) return finMini(id, 'Situations flash', ok, liste.length, () => jeuSituations(id), '<p class="doux">Chaque partie tire 5 situations au hasard parmi ' + e.mini.situations.length + '.</p>');
    const x = liste[k];
    const m = vue(`${entete('🚑 Situations flash', true)}<div class="progression"><span>Situation ${k + 1}/${liste.length}</span><span>✅ ${ok}</span></div>
    ${x.patient ? `<div class="chip" style="margin-bottom:6px">🛏️ ${esc(x.patient)}</div>` : ''}${x.v ? moniteurHTML(x.v) : ''}
    <div class="carte"><p>${esc(x.texte)}</p><b>Que fais-tu en premier ?</b></div>
    ${shuffle(x.choix.map((c, j) => j)).map(j => `<button class="choix" data-k="${j}">${esc(x.choix[j].t)}</button>`).join('')}<div id="fb"></div>`);
    if (x.v) animerECG(x.v.FC);
    $$('[data-k]', m).forEach(b => b.onclick = () => {
      const c = x.choix[+b.dataset.k], meilleur = x.choix.find(y => y.q === 2);
      $$('[data-k]', m).forEach(y => { y.disabled = true; if (x.choix[+y.dataset.k].q === 2) y.classList.add('ok'); });
      if (c.q < 2) b.classList.add('ko');
      S.stats.situations++;
      if (c.q < 2) enregistrerErreur({ type: 's', etage: id, i: e.mini.situations.indexOf(x) });
      if (c.q === 2) { ok++; S.stats.situationsJustes++; evenement('situation_ok', { id }); son('ok'); vibre(30); gagneXP(12); } else { son(c.q ? 'clic' : 'ko'); if (!c.q) vibre([60, 40, 60]); sauver(); }
      $('#fb').innerHTML = `<div class="verdict ${c.q === 2 ? 'ok' : 'ko'}">${c.q === 2 ? 'Excellent réflexe ✅' : c.q === 1 ? 'Pas faux, mais pas la priorité 🟠' : 'Décision risquée ❌'}</div>
      <div class="bloc b-pourquoi"><b class="t">🧠 Le pourquoi</b>${esc(c.fb)}</div>${c !== meilleur ? `<div class="bloc b-clair"><b class="t">✅ Le meilleur choix</b>${esc(meilleur.t)} — ${esc(meilleur.fb)}</div>` : ''}
      ${x.stage ? `<div class="bloc b-stage"><b class="t">🩺 En stage</b>${esc(x.stage)}</div>` : ''}<div class="source">📚 ${esc(sourceTexte(e, x.s))}</div><button class="btn" id="suiv">Suivant →</button>`;
      $('#suiv').onclick = () => { k++; une(); };
      $('#fb').scrollIntoView({ behavior: animationsOn() ? 'smooth' : 'auto', block: 'start' });
    });
  }
  une();
}

/* ---------- Qui en premier ? : classer des patients par priorité ---------- */
function jeuPrio(id) {
  const e = etage(id), p = pick(e.mini.prio);
  let pris = []; const melange = shuffle(p.patients.map((x, j) => j));
  function dessin(fini) {
    vue(`${entete('🚦 Qui en premier ?', true)}<div class="carte"><b>${esc(p.titre)}</b><p>${esc(p.intro)}</p><small class="doux">Touche les patients du <b>plus urgent</b> au moins urgent.</small></div>
    <div class="carte">${pris.map((j, n) => `<div class="etape ${fini ? (j === n ? 'ok' : 'ko') : ''}"><span class="n">${n + 1}</span>${esc(p.patients[j][0])}</div>`).join('') || '<small class="doux">Ton ordre de passage apparaîtra ici.</small>'}</div>
    ${fini ? '' : melange.filter(j => !pris.includes(j)).map(j => `<button class="etape" data-o="${j}">🛏️ ${esc(p.patients[j][0])}</button>`).join('')}
    ${!fini && pris.length ? '<button class="btn sec" id="annul">↩️ Annuler le dernier</button>' : ''}<div id="fb"></div>`);
    $$('[data-o]').forEach(b => b.onclick = () => { pris.push(+b.dataset.o); son('clic'); dessin(pris.length === p.patients.length); });
    if ($('#annul')) $('#annul').onclick = () => { pris.pop(); dessin(); };
    if (fini) {
      const ok = pris.filter((j, n) => j === n).length; if (ok === p.patients.length) S.stats.prioParfaites++;
      $('#fb').innerHTML = `<div class="bloc b-clair"><b class="t">✅ L’ordre attendu</b>${p.patients.map((x, n) => `<b>${n + 1}. ${esc(x[0])}</b><br><small>${esc(x[1])}</small>`).join('<br>')}</div><div class="source">📚 ${esc(sourceTexte(e, p.s))}</div><button class="btn" id="res">Voir le score</button>`;
      $('#res').onclick = () => finMini(id, 'Qui en premier ?', ok, p.patients.length, () => jeuPrio(id), '<p class="doux">Règle d’or : menace vitale (A-B-C-D) d’abord, puis aigu avant chronique, puis le confort et l’administratif.</p>');
    }
  }
  dessin(false);
}

/* ---------- Sprint 60 s ---------- */
function jeuSprint(id) {
  const e = etage(id);
  const pool = shuffle(questionsEtage(e).filter(q => q.t === 'vf' || (q.t === 'qcm' && q.b.length === 1)));
  let k = 0, ok = 0, faux = 0, reste = 60, fini = false, chrono;
  function q() {
    if (fini) return;
    const x = pool[k % pool.length];
    const ordre = x.t === 'qcm' ? shuffle(x.c.map((_, j) => j)) : [];
    const m = vue(`${entete('⚡ Sprint 60 s', true)}<div class="progression"><span>⏱️ <b id="rs">${reste}</b> s</span><span>✅ ${ok} · ❌ ${faux}</span></div>
    <div class="chrono"><i id="chr" style="width:${reste / 60 * 100}%"></i></div>
    <div class="carte"><div class="question">${esc(x.q)}</div></div>
    ${x.t === 'vf' ? `<div class="rangee"><button class="choix centre" data-v="1">👍 Vrai</button><button class="choix centre" data-v="0">👎 Faux</button></div>` : ordre.map(j => `<button class="choix" data-k="${j}">${esc(x.c[j])}</button>`).join('')}`);
    const repondre = (juste, b) => {
      if (fini) return;
      noterTheme(x, juste);
      if (juste) { ok++; son('ok'); } else { faux++; son('ko'); vibre(40); }
      b.classList.add(juste ? 'ok' : 'ko'); $$('button.choix', m).forEach(y => y.disabled = true);
      k++; setTimeout(q, juste ? 250 : 700);
    };
    if (x.t === 'vf') $$('[data-v]', m).forEach(b => b.onclick = () => repondre((b.dataset.v === '1') === !!x.b, b));
    else $$('[data-k]', m).forEach(b => b.onclick = () => repondre(+b.dataset.k === x.b[0], b));
  }
  chrono = setInterval(() => {
    reste--; const r = $('#rs'), c = $('#chr'); if (r) r.textContent = reste; if (c) c.style.width = (reste / 60 * 100) + '%';
    if (reste <= 0) { clearInterval(chrono); fini = true; fin(); }
  }, 1000);
  function fin() {
    const st = S.etages[id], record = ok > (st.sprint || 0); marquerMini(id, 'sprint');
    if (record) st.sprint = ok;
    S.stats.miniJeux++; S.stats.reponses += ok + faux; S.stats.bonnes += ok; gagneXP(ok * 5);
    if (record && ok) { confettis(); son('niveau'); }
    ecranResultat('Sprint 60 s', `<div class="grand-emoji">⚡</div><h2>${ok} bonne(s) réponse(s)</h2><p>${faux} erreur(s)</p><p>${record && ok ? '🏆 Nouveau record !' : 'Record : ' + (st.sprint || 0)}</p>`,
      [['Encore un sprint !', () => jeuSprint(id), 'violet'], ['Autres mini-jeux', () => history.back(), 'sec']]);
  }
  q();
  // le chrono est arrêté si on quitte la partie (vue() appelle les nettoyages à chaque écran : on le ré-enregistre)
  const garde = setInterval(() => { if (!fini && !$('#rs')) { clearInterval(chrono); clearInterval(garde); fini = true; } if (fini) clearInterval(garde); }, 300);
}

/* ---------- Memory ---------- */
function jeuMemory(id) {
  const e = etage(id);
  const toutes = e.mini.associe.flatMap(a => a.paires);
  const paires = shuffle([...new Map(toutes.map(p => [p[0], p])).values()]).slice(0, 6);
  const cartes = shuffle(paires.flatMap((p, j) => [{ t: p[0], j }, { t: p[1], j }]));
  let ouvertes = [], trouvees = [], coups = 0, bloque = false;
  function dessin() {
    vue(`${entete('🧩 Memory', true)}<div class="progression"><span>Paires : ${trouvees.length}/${paires.length}</span><span>Coups : ${coups}</span></div>
    <div class="grille3">${cartes.map((c, n) => { const vis = ouvertes.includes(n) || trouvees.includes(c.j);
      return `<button class="tuile" data-n="${n}" style="min-height:96px;padding:6px;font-size:.8rem;${trouvees.includes(c.j) ? 'background:var(--vert-l);border-color:var(--vert)' : vis ? 'background:var(--bleu-l)' : ''}">${vis ? esc(c.t) : '<span class="ico">✚</span>'}</button>`; }).join('')}</div>`);
    $$('[data-n]').forEach(b => b.onclick = () => {
      const n = +b.dataset.n; if (bloque || ouvertes.includes(n) || trouvees.includes(cartes[n].j)) return;
      ouvertes.push(n); son('clic');
      if (ouvertes.length === 2) {
        coups++; const [a, c] = ouvertes;
        if (cartes[a].j === cartes[c].j) { trouvees.push(cartes[a].j); ouvertes = []; son('ok'); if (trouvees.length === paires.length) { S.stats.memory++; return setTimeout(() => finMini(id, 'Memory', Math.max(0, paires.length * 2 - coups + paires.length), paires.length * 2, () => jeuMemory(id), `<p>${coups} coups (parfait = ${paires.length})</p><div class="bloc b-clair" style="text-align:left">${paires.map(p => esc(p[0]) + ' ↔ <b>' + esc(p[1]) + '</b>').join('<br>')}</div>`), 500); } }
        else { bloque = true; dessin(); return setTimeout(() => { ouvertes = []; bloque = false; dessin(); }, 1100); }
      }
      dessin();
    });
  }
  dessin();
}

/* ---------- Mot mystère ---------- */
function jeuMots(id) {
  const e = etage(id), mots = shuffle(e.mini.mots).slice(0, 5);
  const norm = s => s.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Z]/g, '');
  let k = 0, ok = 0;
  function un() {
    if (k >= mots.length) return finMini(id, 'Mot mystère', ok, mots.length, () => jeuMots(id));
    const [mot, indice, exp] = mots[k], cible = norm(mot);
    let lettres = shuffle(cible.split('').map((l, j) => ({ l, j })));
    if (lettres.map(x => x.l).join('') === cible && cible.length > 2) lettres = lettres.reverse();
    let pris = [], aide = false;
    function dessin() {
      vue(`${entete('🔤 Mot mystère', true)}<div class="progression"><span>Mot ${k + 1}/${mots.length}</span><span>✅ ${ok}</span></div>
      <div class="carte"><b>Indice :</b> ${esc(indice)}${aide ? `<br><small class="doux">Première lettre : <b>${cible[0]}</b></small>` : ''}</div>
      <div class="code" style="flex-wrap:wrap">${cible.split('').map((_, n) => `<span class="${pris[n] != null ? 'trouve' : ''}" style="width:34px;height:44px">${pris[n] != null ? lettres[pris[n]].l : ''}</span>`).join('')}</div>
      <div class="seg" style="justify-content:center">${lettres.map((x, n) => `<button data-l="${n}" ${pris.includes(n) ? 'disabled style="opacity:.3"' : ''}>${x.l}</button>`).join('')}</div>
      <div class="rangee"><button class="btn sec" id="eff">↩️ Effacer</button><button class="btn sec" id="aide" ${aide ? 'disabled' : ''}>💡 Aide</button></div><button class="btn rouge" id="passe">Je donne ma langue au chat</button><div id="fb"></div>`);
      $$('[data-l]').forEach(b => b.onclick = () => { pris.push(+b.dataset.l); son('clic'); if (pris.length === cible.length) verif(); else dessin(); });
      $('#eff').onclick = () => { pris.pop(); dessin(); };
      $('#aide').onclick = () => { aide = true; dessin(); };
      $('#passe').onclick = () => resultat(false);
    }
    function verif() { const r = pris.map(n => lettres[n].l).join(''); if (r === cible) resultat(true); else { son('ko'); vibre(60); toast('Pas encore… essaie un autre ordre'); pris = []; dessin(); } }
    function resultat(juste) {
      if (juste) { ok++; S.stats.mots++; son('ok'); gagneXP(aide ? 6 : 10); }
      vue(`${entete('🔤 Mot mystère', true)}<div class="carte centre"><div class="verdict ${juste ? 'ok' : 'ko'}">${juste ? '✅ Trouvé !' : 'La réponse était :'}</div><h2>${esc(mot)}</h2></div>
      ${exp ? `<div class="bloc b-pourquoi"><b class="t">🧠 Le pourquoi</b>${esc(exp)}</div>` : ''}<button class="btn" id="suiv">Suivant →</button>`);
      $('#suiv').onclick = () => { k++; un(); };
    }
    dessin();
  }
  un();
}

/* ---------- Gaz du sang express (valeurs générées, troubles primaires simples) ---------- */
function jeuGds(id) {
  const N = 6; let k = 0, ok = 0;
  const TYPES = [
    ['Acidose respiratoire', () => ({ ph: rnd(720, 732), co2: rnd(50, 70), hco3: rnd(24, 28) }), 'pH bas + PaCO₂ haute : le CO₂ s’accumule (hypoventilation : sédation, épuisement, BPCO).'],
    ['Acidose métabolique', () => ({ ph: rnd(715, 732), co2: rnd(25, 34), hco3: rnd(10, 18) }), 'pH bas + HCO₃⁻ bas : acides en excès (lactates, acidocétose, insuffisance rénale). La PaCO₂ basse = compensation respiratoire (le patient respire vite).'],
    ['Alcalose respiratoire', () => ({ ph: rnd(747, 755), co2: rnd(25, 32), hco3: rnd(21, 24) }), 'pH haut + PaCO₂ basse : hyperventilation (douleur, anxiété, hypoxémie, ventilateur réglé trop fort).'],
    ['Alcalose métabolique', () => ({ ph: rnd(747, 755), co2: rnd(42, 50), hco3: rnd(30, 38) }), 'pH haut + HCO₃⁻ haut : perte d’acide (vomissements, aspiration gastrique) ou diurétiques.'],
    ['Normal', () => ({ ph: rnd(736, 744), co2: rnd(36, 44), hco3: rnd(22, 26) }), 'pH 7,35-7,45 ; PaCO₂ 35-45 mmHg ; HCO₃⁻ 22-26 mmol/L : tout est dans les normes.']
  ];
  function un() {
    if (k >= N) return finMini(id, 'Gaz du sang express', ok, N, () => jeuGds(id), '<div class="bloc b-stage" style="text-align:left"><b class="t">🩺 Méthode en 3 temps</b>1. pH : acidose (< 7,35) ou alcalose (> 7,45) ?<br>2. Qui « explique » le pH : la PaCO₂ (respiratoire) ou les HCO₃⁻ (métabolique) ?<br>3. L’autre paramètre bouge-t-il dans le même sens ? → compensation.</div>');
    const t = pick(TYPES), g = t[1]();
    const ph = (g.ph / 100).toFixed(2).replace('.', ',');
    const m = vue(`${entete('🩸 Gaz du sang express', true)}<div class="progression"><span>Gaz ${k + 1}/${N}</span><span>✅ ${ok}</span></div>
    <div class="moniteur"><div class="constantes"><div class="cst t"><small>pH</small><b>${ph}</b></div><div class="cst fr"><small>PaCO₂ mmHg</small><b>${g.co2}</b></div><div class="cst sp"><small>HCO₃⁻ mmol/L</small><b>${g.hco3}</b></div></div></div>
    ${TYPES.map((x, j) => `<button class="choix" data-j="${j}">${x[0]}</button>`).join('')}<div id="fb"></div>`);
    $$('[data-j]', m).forEach(b => b.onclick = () => {
      const juste = TYPES[+b.dataset.j] === t; if (juste) { ok++; S.stats.gds++; son('ok'); } else son('ko');
      $$('[data-j]', m).forEach(y => { y.disabled = true; if (TYPES[+y.dataset.j] === t) y.classList.add('ok'); });
      if (!juste) b.classList.add('ko');
      $('#fb').innerHTML = `<div class="bloc b-pourquoi"><b class="t">🧠 ${esc(t[0])}</b>${esc(t[2])}</div><div class="source">📚 Physiologie / gaz du sang (consensus d’enseignement) 🟠</div><button class="btn" id="suiv">Suivant →</button>`;
      $('#suiv').onclick = () => { k++; un(); };
    });
  }
  un();
}



/* ============================== BOUCLE QUOTIDIENNE : MISSIONS, DÉFI, RÉCOMPENSES ============================== */
function hashTexte(t) { let h = 1779033703 ^ t.length; for (let i = 0; i < t.length; i++) { h = Math.imul(h ^ t.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return h >>> 0; }
function rngGraine(seed) { let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const choisir = (r, a) => a[Math.floor(r() * a.length)];
const NOMS_JEUX = { situations: 'Situations flash', prio: 'Qui en premier ?', memory: 'Memory', mots: 'Mot mystère', gds: 'Gaz du sang express', ordre: 'Remets dans l’ordre', tri: 'Tri express', associe: 'Associe', erreur: 'Trouve l’erreur', glasgow: 'Glasgow express', news2: 'NEWS2 express', calcul: 'Calcul flash', sprint: 'Sprint 60 s' };
function marquerMini(id, j) { const k = id + ':' + j; if (!S.minisJoues[k]) { S.minisJoues[k] = dateLocale(); } evenement('mini_fin', { id, j }); }
function finsRestantes(id) { const e = etage(id), st = S.etages[id]; return e.gardes.some(g => finsGarde(g).some(f => !(((st.fins || {})[g.id]) || []).includes(f))); }
function creerMission(type, id, r) {
  const e = id && etage(id), et = e ? ` ${e.emoji} ${e.titre}` : '';
  switch (type) {
    case 'garde': return { type, etage: id, cible: 1, texte: `🌙 Termine une garde${et}`, aller: ['garde', { id }] };
    case 'fin': return finsRestantes(id) ? { type, etage: id, cible: 1, texte: `🏁 Découvre une nouvelle fin de garde${et}`, aller: ['garde', { id }] } : null;
    case 'situations': return (e.mini.situations || []).length ? { type, etage: id, cible: 5, texte: `🚑 Réussis 5 situations flash${et}`, aller: ['jeu', { id, j: 'situations' }] } : null;
    case 'flash': return { type, cible: 15, texte: '🃏 Révise 15 flashcards', aller: ['revision', {}] };
    case 'carnet': return carnetDus().length >= 5 ? { type, cible: 5, texte: '🩹 Rattrape 5 erreurs de ton carnet', aller: ['rattrapage', {}] } : null;
    case 'niveau': return { type, etage: id, cible: 1, texte: `🏆 Fais 7/8 ou plus à un niveau de quiz${et}`, aller: ['niveaux', { id }] };
    case 'etoile': return { type, cible: 1, texte: '★ Gagne au moins 1 nouvelle étoile', aller: ['etage', { id }] };
    case 'nouveauMini': { const j = listeJeux(id).map(x => x[0]).filter(x => !S.minisJoues[id + ':' + x]); return j.length ? (jj => ({ type, etage: id, j: jj, cible: 1, texte: `🎮 Découvre « ${NOMS_JEUX[jj]} »${et}`, aller: ['jeu', { id, j: jj }] }))(choisir(r, j)) : null; }
  }
  return null;
}
function missionsDuJour() {
  const auj = dateLocale();
  if (S.jour && S.jour.date === auj) return S.jour;
  const r = rngGraine(hashTexte('missions-' + auj));
  const ps = prochainStage(), idStage = ps ? ps.e.id : choisir(r, ETAGES).id;
  const essayer = (types, id) => { for (const t of shuffleR(types, r)) { const m = creerMission(t, id, r); if (m) return m; } return null; };
  const m1 = essayer(['garde', 'fin', 'situations', 'niveau', 'nouveauMini'], idStage);
  const m2 = creerMission('carnet', null, r) || creerMission('flash', null, r);
  let m3 = null;
  for (let n = 0; n < 6 && !m3; n++) { const id = choisir(r, ETAGES).id; const m = essayer(['garde', 'situations', 'niveau', 'etoile', 'nouveauMini', 'fin'], id); if (m && !(m.type === m1.type && m.etage === m1.etage)) m3 = m; }
  S.jour = { date: auj, missions: [m1, m2, m3 || creerMission('etoile', idStage, r)].map(m => Object.assign(m, { progres: 0, faite: false })), coffre: false };
  sauver(); return S.jour;
}
function shuffleR(a, r) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const DEFIS = [['garde80', 3, '🌙 Termine 3 gardes à 80 % ou plus'], ['situations', 25, '🚑 Réussis 25 situations flash'], ['cartes', 60, '🃏 Révise 60 flashcards'], ['niveaux7', 4, '🏆 Fais 4 niveaux de quiz à 7/8 ou plus'], ['fins', 3, '🏁 Découvre 3 nouvelles fins de garde']];
function defiSemaine() {
  const cle = semaineISO(dateLocale());
  if (S.semaine && S.semaine.cle === cle) return S.semaine;
  const d = choisir(rngGraine(hashTexte('defi-' + cle)), DEFIS);
  S.semaine = { cle, type: d[0], cible: d[1], texte: d[2], progres: 0, fait: false }; sauver(); return S.semaine;
}
/* Événements de jeu → progression des missions et du défi */
function evenement(type, d) {
  if (!ETAGES.length) return;
  const jour = missionsDuJour(), sem = defiSemaine();
  jour.missions.forEach(m => {
    if (m.faite) return;
    let plus = 0;
    if (type === 'garde_fin' && m.type === 'garde' && d.id === m.etage) plus = 1;
    if (type === 'fin_nouvelle' && m.type === 'fin' && d.id === m.etage) plus = 1;
    if (type === 'situation_ok' && m.type === 'situations' && d.id === m.etage) plus = 1;
    if (type === 'carte' && m.type === 'flash') plus = 1;
    if (type === 'rattrapage_ok' && m.type === 'carnet') plus = 1;
    if (type === 'niveau' && m.type === 'niveau' && d.id === m.etage && d.b >= 7) plus = 1;
    if (type === 'etoile' && m.type === 'etoile') plus = d.n;
    if (type === 'mini_fin' && m.type === 'nouveauMini' && d.id === m.etage && d.j === m.j) plus = 1;
    if (!plus) return;
    m.progres = Math.min(m.cible, m.progres + plus);
    if (m.progres >= m.cible) {
      m.faite = true; gagneXP(30); if (S.cafes < CAFES_MAX) S.cafes++;
      toast('🎯 Mission accomplie : +30 XP, +1 ☕', 3200); son('niveau');
      if (jour.missions.every(x => x.faite)) {
        const auj = dateLocale(), ms = S.missionsSerie;
        if (ms.dernier !== auj) { ms.n = ms.dernier === ajouteJours(auj, -1) ? ms.n + 1 : 1; ms.dernier = auj; ms.max = Math.max(ms.max, ms.n); }
        toast('🎁 3 missions sur 3 : le coffre du jour est prêt sur l’accueil !', 3800); confettis();
      }
    }
  });
  if (!sem.fait) {
    let plus = 0;
    if (sem.type === 'garde80' && type === 'garde_fin' && d.score >= 80) plus = 1;
    if (sem.type === 'situations' && type === 'situation_ok') plus = 1;
    if (sem.type === 'cartes' && type === 'carte') plus = 1;
    if (sem.type === 'niveaux7' && type === 'niveau' && d.b >= 7) plus = 1;
    if (sem.type === 'fins' && type === 'fin_nouvelle') plus = 1;
    if (plus) { sem.progres = Math.min(sem.cible, sem.progres + plus); if (sem.progres >= sem.cible) { sem.fait = true; gagneXP(150); toast('🏅 Défi de la semaine réussi : +150 XP !', 3800); confettis(); } }
  }
  verifBadges(); sauver();
}
function apresEtoiles(n) { evenement('etoile', { n }); }
function apresRattrapage() { evenement('rattrapage_ok', {}); }
function apresCarnetVide() { S.stats.carnetVide = true; verifBadges(); }
function ouvrirCoffre() {
  const j = missionsDuJour(); if (j.coffre || !j.missions.every(m => m.faite)) return;
  j.coffre = true; gagneXP(50); confettis(); son('niveau'); toast('🎁 Coffre ouvert : +50 XP !', 3200); sauver(); aller('accueil', {}, true);
}
function missionsHTML() {
  const j = missionsDuJour(), sem = defiSemaine(), nb = j.missions.filter(m => m.faite).length;
  return `<div class="carte"><div class="ligne" style="border:none;padding:0 0 6px"><b>🎯 Missions du jour</b><span>${nb}/3</span></div>
  ${j.missions.map((m, k) => `<button class="etape ${m.faite ? 'ok' : ''}" data-mission="${k}" ${m.faite ? 'disabled' : ''}><span class="n">${m.faite ? '✓' : k + 1}</span><span style="flex:1">${esc(m.texte)}</span><small>${m.progres}/${m.cible}</small></button>`).join('')}
  ${nb === 3 && !j.coffre ? '<button class="btn orange" id="coffre">🎁 Ouvrir le coffre du jour (+50 XP)</button>' : nb === 3 ? '<p class="doux centre">🎁 Coffre ouvert. Reviens demain pour de nouvelles missions !</p>' : '<p class="doux" style="font-size:.8rem">Chaque mission : +30 XP et +1 ☕. Les 3 : un coffre bonus.</p>'}
  <div class="ligne" style="border-top:1px solid var(--bord);margin-top:6px"><span>🏅 Défi de la semaine : ${esc(sem.texte)}</span><span>${sem.fait ? '✅' : sem.progres + '/' + sem.cible}</span></div></div>`;
}
/* Récompenses débloquées par paliers d’étoiles (en % des étoiles disponibles ; rien ne se dépense) */
const RECOMPENSES = [
  [3, 'acc-stetho', '🩺 Stéthoscope pour Monito'],
  [7, 'pal-menthe', '🎨 Thème de couleur « Menthe »'],
  [12, 'titre-lynx', '🏷️ Titre « Œil de lynx »'],
  [18, 'acc-calot', '🧢 Calot de bloc pour Monito'],
  [25, 'pal-violet', '🎨 Thème de couleur « Nuit violette »'],
  [33, 'mortelle', '☠️ Garde de la mort (Révision générale)'],
  [42, 'acc-lunettes', '👓 Lunettes de garde pour Monito'],
  [52, 'blanche', '🌑 Mode « Nuit blanche » : gardes plus dures (constantes plus variables, sans joker)'],
  [61, 'pal-corail', '🎨 Thème de couleur « Corail »'],
  [70, 'acc-couronne', '👑 Couronne + titre « Légende des étages »']
];
function seuilRecompense(pct) { return Math.ceil(etoilesTotal().max * pct / 100); }
function recompenseDebloquee(id) { const r = RECOMPENSES.find(x => x[1] === id || (id === 'titre-legende' && x[1] === 'acc-couronne')); return !!r && etoilesTotal().n >= seuilRecompense(r[0]); }
function titreActuel() { const t = S.apparence.titre; return t === 'lynx' && recompenseDebloquee('titre-lynx') ? 'Œil de lynx' : t === 'legende' && recompenseDebloquee('acc-couronne') ? 'Légende des étages' : null; }
/* Monito contextuel */
function messageMonito(ps) {
  const j = missionsDuJour(), nb = j.missions.filter(m => m.faite).length;
  if (S.absence >= 2) return `Te revoilà après ${S.absence} jours ! 💚 On reprend en douceur : une mission rapide ?`;
  if (ps && !ps.enCours && ps.j <= 7) return `J-${ps.j} avant ton stage <b>${esc(ps.e.titre)}</b> ! Une garde et quelques situations flash à l’étage ${ps.e.num} ?`;
  if (ps && ps.enCours) return `Tu es en stage <b>${esc(ps.e.titre)}</b> ! Encore ${ps.j} jour(s). Courage, je révise avec toi 💪`;
  if (nb === 3) return j.coffre ? 'Missions du jour terminées : tu es au top ! 🌟' : 'Les 3 missions sont faites : ouvre vite ton coffre ! 🎁';
  if (S.jour && S.stats.finsDecouvertes && S.jourFins === dateLocale()) return 'Bravo pour la nouvelle fin de garde découverte aujourd’hui ! 🏁';
  if (ps && ps.j <= 14) return `Ton stage <b>${esc(ps.e.titre)}</b> commence dans <b>${ps.j} jour(s)</b> ! On s’échauffe à l’étage ${ps.e.num} ?`;
  return null;
}

/* ============================== PROGRESSION v2 : ÉTOILES, CARNET D’ERREURS, THÈMES ============================== */
function etoilesQuiz(b) { return b >= 8 ? 3 : b >= 7 ? 2 : b >= 6 ? 1 : 0; }
function etoilesBoss(b) { return b >= 10 ? 3 : b >= 9 ? 2 : b >= 7 ? 1 : 0; }
function etoilesGarde(sc) { return sc >= 95 ? 3 : sc >= 80 ? 2 : sc >= 50 ? 1 : 0; }
function etoilesPct(p) { return p >= 1 ? 3 : p >= 0.8 ? 2 : p >= 0.6 ? 1 : 0; }
/* Affichage accessible : symboles pleins/vides + texte « 2/3 » (jamais la couleur seule) */
function etoilesTexte(n) { n = n || 0; return `<span aria-label="${n} étoile(s) sur 3">${'★'.repeat(n)}${'☆'.repeat(3 - n)} ${n}/3</span>`; }
function donnerEtoiles(cle, n, avecJoker) {
  if (avecJoker) n = Math.min(n, 2);              // un joker café plafonne à ★★
  const avant = S.etoiles[cle] || 0;
  if (n > avant) {
    S.etoiles[cle] = n; S.stats.etoilesGagnees = (S.stats.etoilesGagnees || 0) + (n - avant);
    toast('★ ' + '★'.repeat(n) + ' ' + n + '/3 — nouvelle(s) étoile(s) !', 3000); son('niveau');
    if (typeof apresEtoiles === 'function') apresEtoiles(n - avant);
  }
  sauver();
}
function clesEtoilesEtage(e) {
  const c = [0, 1, 2, 3, 4].map(k => `niv:${e.id}:${k}`).concat([`boss:${e.id}`, `escape:${e.id}`]);
  e.gardes.forEach(g => c.push(`garde:${e.id}:${g.id}`));
  listeJeux(e.id).filter(j => j[0] !== 'sprint').forEach(j => c.push(`mini:${e.id}:${j[0]}`));
  return c;
}
function etoilesEtage(e) { const c = clesEtoilesEtage(e); return { n: c.reduce((t, k) => t + (S.etoiles[k] || 0), 0), max: c.length * 3 }; }
function etoilesTotal() { return ETAGES.reduce((r, e) => { const x = etoilesEtage(e); r.n += x.n; r.max += x.max; return r; }, { n: 0, max: 0 }); }
function apresGarde({ id, g, score, joker, nouvelle }) { donnerEtoiles(`garde:${id}:${g.id}`, etoilesGarde(score), joker); evenement('garde_fin', { id, score }); if (nouvelle) evenement('fin_nouvelle', { id }); }

/* Stats par thème */
function noterTheme(q, juste) {
  if (!q || !q.etage || !q.th) return;
  const k = q.etage + ':' + q.th, t = S.themes[k] || [0, 0];
  t[1]++; if (juste) t[0]++; S.themes[k] = t;
}
function statsThemes(e) {
  return Object.keys(e.themes).map(th => { const t = S.themes[e.id + ':' + th] || [0, 0]; return { th, nom: e.themes[th], ok: t[0], n: t[1], taux: t[1] ? t[0] / t[1] : null }; });
}
function iconeTheme(x) { return x.n < 5 ? '❔' : x.taux >= 0.8 ? '✅' : x.taux >= 0.5 ? '⚠️' : '❌'; }

/* Carnet d’erreurs : boîte 1 → J+1, boîte 2 → J+3, boîte 3 → J+7 ; 3 réussites d’affilée = sortie ; un échec = boîte 1 */
const DELAIS_CARNET = [0, 1, 3, 7];
function cleErreur(it) { return it.type === 'q' ? 'q:' + it.qid : it.type === 's' ? `s:${it.etage}:${it.i}` : `g:${it.etage}:${it.g}:${it.n}`; }
function enregistrerErreur(it) {
  if (!it || (it.type === 's' && it.i < 0)) return;
  const k = cleErreur(it);
  S.carnet[k] = Object.assign({}, it, { boite: 1, serie: 0, due: ajouteJours(dateLocale(), DELAIS_CARNET[1]), ajout: (S.carnet[k] || {}).ajout || dateLocale() });
  sauver();
}
function carnetListe(id) { return Object.entries(S.carnet).filter(([, x]) => !id || x.etage === id).map(([k, x]) => Object.assign({ cle: k }, x)); }
function carnetDus(id) { const auj = dateLocale(); return carnetListe(id).filter(x => x.due <= auj); }
function resoudreErreur(it) {
  const e = etage(it.etage); if (!e) return null;
  if (it.type === 'q') { const q = questionsEtage(e).find(x => x.id === it.qid); return q ? { type: 'q', q } : null; }
  if (it.type === 's') { const x = (e.mini.situations || [])[it.i]; return x ? { type: 's', x } : null; }
  const g = e.gardes.find(y => y.id === it.g), n = g && g.noeuds[it.n];
  if (!n || !n.choix) return null;
  return { type: 's', x: { patient: n.patient || g.titre, v: Object.assign({}, g.noeuds.debut.v, n.v), texte: n.texte, s: n.s, choix: n.choix.map(c => ({ t: c.t, q: c.q, fb: c.fb })) } };
}
function noterRattrapage(it, juste, anticipe) {
  const x = S.carnet[it.cle]; if (!x) return;
  if (juste) {
    S.stats.rattrapages++;
    if (typeof apresRattrapage === 'function') apresRattrapage();
    if (anticipe) return sauver();
    x.serie++;
    if (x.serie >= 3) { delete S.carnet[it.cle]; toast('🩹 Erreur maîtrisée : sortie du carnet !'); }
    else { x.boite = Math.min(3, x.boite + 1); x.due = ajouteJours(dateLocale(), DELAIS_CARNET[x.boite]); }
  } else { x.boite = 1; x.serie = 0; x.due = ajouteJours(dateLocale(), DELAIS_CARNET[1]); }
  sauver();
}
/* Une situation (situation flash ou nœud de garde) jouée seule */
function jouerUneSituation(e, x, titre, entete2, suite) {
  const m = vue(`${entete(titre, true)}${entete2}
    ${x.patient ? `<div class="chip" style="margin-bottom:6px">🛏️ ${esc(x.patient)}</div>` : ''}${x.v ? moniteurHTML(x.v) : ''}
    <div class="carte"><p>${esc(x.texte)}</p><b>Que fais-tu ?</b></div>
    ${shuffle(x.choix.map((c, j) => j)).map(j => `<button class="choix" data-k="${j}">${esc(x.choix[j].t)}</button>`).join('')}<div id="fb"></div>`);
  if (x.v) animerECG(x.v.FC);
  $$('[data-k]', m).forEach(b => b.onclick = () => {
    const c = x.choix[+b.dataset.k], meilleur = x.choix.find(y => y.q === 2), juste = c.q === 2;
    $$('[data-k]', m).forEach(y => { y.disabled = true; if (x.choix[+y.dataset.k].q === 2) y.classList.add('ok'); });
    if (!juste) b.classList.add('ko');
    son(juste ? 'ok' : 'ko'); if (juste) gagneXP(10);
    $('#fb').innerHTML = `<div class="verdict ${juste ? 'ok' : 'ko'}">${juste ? 'Bien rattrapé ✅' : 'Encore raté ❌'}</div><div class="bloc b-pourquoi"><b class="t">🧠 Le pourquoi</b>${esc(c.fb)}</div>${!juste ? `<div class="bloc b-clair"><b class="t">✅ Le meilleur choix</b>${esc(meilleur.t)} — ${esc(meilleur.fb)}</div>` : ''}${x.stage ? `<div class="bloc b-stage"><b class="t">🩺 En stage</b>${esc(x.stage)}</div>` : ''}<div class="source">📚 ${esc(sourceTexte(e, x.s))}</div><button class="btn" id="suiv">Suivant →</button>`;
    $('#suiv').onclick = () => suite(juste);
    $('#fb').scrollIntoView({ behavior: animationsOn() ? 'smooth' : 'auto', block: 'start' });
  });
}
VUES.rattrapage = ({ id }) => {
  const tous = carnetListe(id), dus = carnetDus(id);
  const parBoite = [1, 2, 3].map(b => tous.filter(x => x.boite === b).length);
  vue(`${entete('🩹 Rattrapage' + (id ? ' — ' + esc(etage(id).titre) : ''), true)}
  ${monito(tous.length ? `Ton carnet contient <b>${tous.length}</b> erreur(s), dont <b>${dus.length}</b> à revoir aujourd’hui. 3 réussites d’affilée et une erreur sort du carnet !` : 'Ton carnet est vide : aucune erreur à rattraper. Bravo ! 🎉')}
  <div class="carte"><b>Boîtes</b><div class="ligne"><span>📦 Boîte 1 (revue à J+1)</span><span>${parBoite[0]}</span></div><div class="ligne"><span>📦 Boîte 2 (J+3)</span><span>${parBoite[1]}</span></div><div class="ligne"><span>📦 Boîte 3 (J+7)</span><span>${parBoite[2]}</span></div></div>
  ${dus.length ? `<button class="btn violet" id="go">Rattraper ${Math.min(10, dus.length)} erreur(s)</button>` : ''}
  ${tous.length ? `<button class="btn sec" id="libre">S’entraîner sur tout le carnet (sans changer les boîtes)</button>` : ''}`);
  if ($('#go')) $('#go').onclick = () => sessionRattrapage(shuffle(dus).slice(0, 10), false, id);
  if ($('#libre')) $('#libre').onclick = () => sessionRattrapage(shuffle(tous).slice(0, 10), true, id);
};
function sessionRattrapage(items, anticipe, id) {
  let k = 0, ok = 0;
  const valides = items.filter(it => resoudreErreur(it));
  items.filter(it => !resoudreErreur(it)).forEach(it => delete S.carnet[it.cle]);   // contenu disparu : on nettoie
  if (!valides.length) return aller('rattrapage', { id }, true);
  function un() {
    if (k >= valides.length) {
      sauver(); if (!Object.keys(S.carnet).length && typeof apresCarnetVide === 'function') apresCarnetVide();
      return ecranResultat('Rattrapage', `<div class="grand-emoji">🩹</div><h2>${ok}/${valides.length} rattrapée(s)</h2><p class="doux">${anticipe ? 'Mode entraînement : les boîtes n’ont pas changé.' : 'Les erreurs réussies avancent de boîte ; les autres reviennent demain.'}</p>`,
        [['Encore', () => aller('rattrapage', { id }, true), 'violet'], ['Retour', () => history.back(), 'sec']]);
    }
    const it = valides[k], r = resoudreErreur(it), e = etage(it.etage);
    const bandeau = `<div class="progression"><span>🩹 ${k + 1}/${valides.length}</span><span>📦 Boîte ${it.boite} · ${it.serie}/3 réussites</span></div>`;
    const suite = juste => { if (juste) ok++; noterRattrapage(it, juste, anticipe); k++; un(); };
    if (r.type === 'q') quiz({ titre: '🩹 Rattrapage', questions: [r.q], chrono: 0, pasDeCarnet: true, sansJoker: true, fin: b => suite(b === 1) });
    else jouerUneSituation(e, r.x, '🩹 Rattrapage', bandeau, suite);
  }
  un();
}
/* Points faibles : 10 questions des 3 thèmes les plus faibles (≥ 5 réponses), sinon les moins vus */
function lancerPointsFaibles(id) {
  const e = etage(id), st = statsThemes(e);
  const avecDonnees = st.filter(x => x.n >= 5).sort((a, b) => a.taux - b.taux);
  let cibles = avecDonnees.slice(0, 3).map(x => x.th);
  if (cibles.length < 3) cibles = cibles.concat(st.filter(x => !cibles.includes(x.th)).sort((a, b) => a.n - b.n).slice(0, 3 - cibles.length).map(x => x.th));
  const pool = shuffle(questionsEtage(e).filter(q => cibles.includes(q.th)));
  const qs = shuffle(pool.filter(q => !q.auto)).slice(0, 7).concat(shuffle(pool.filter(q => q.auto)));
  const choix = shuffle(qs.slice(0, 10));
  quiz({ titre: '🎯 Points faibles', questions: choix, chrono: 0,
    fin: (b, t, xp) => ecranResultat('Points faibles', `<div class="grand-emoji">🎯</div><h2>${b}/${t}</h2><p>Thèmes travaillés : ${cibles.map(th => esc(e.themes[th])).join(', ')}</p><p class="doux">+${xp} XP · Tes statistiques par thème sont à jour sur l’écran de l’étage.</p>`,
      [['Encore 10 questions', () => lancerPointsFaibles(id), 'violet'], ['Retour à l’étage', () => aller('etage', { id }, true), 'sec']]) });
}

/* ============================== FUSION DES SCÉNARIOS SUPPLÉMENTAIRES ==============================
 * data/scenarios-*.js remplit window.SCENARIOS[idEtage] = { sources, gardes, situations, prio, mots, ordre, tri, associe, erreur, glasgow } */
function fusionnerScenarios() {
  const X = window.SCENARIOS || {};
  ETAGES.forEach(e => {
    e.garde.id = e.garde.id || 'g0';
    e.gardes = [e.garde];
    e.mini = e.mini || {};
    const x = X[e.id]; if (!x) return;
    Object.assign(e.sources, x.sources || {});
    (x.gardes || []).forEach(g => e.gardes.push(g));
    ['ordre', 'tri', 'associe', 'erreur', 'glasgow', 'situations', 'prio', 'mots'].forEach(k => { if (x[k]) e.mini[k] = (e.mini[k] || []).concat(x[k]); });
    if (x.gds) e.mini.gds = true;
  });
}

/* ============================== VALIDATION DES DONNÉES ============================== */
function valider() {
  const pb = [];
  ETAGES.forEach(e => {
    e.questions.forEach((q, i) => {
      const t = q.t || 'qcm';
      if (!q.s) pb.push(`${e.id} q${i} sans source`);
      if (!e.themes[q.th]) pb.push(`${e.id} q${i} thème inconnu ${q.th}`);
      if (t === 'qcm' && (!q.c || !q.b || !q.b.length || q.b.some(k => k >= q.c.length))) pb.push(`${e.id} q${i} réponses invalides`);
      if (t === 'vf' && typeof q.b !== 'boolean') pb.push(`${e.id} q${i} vf sans booléen`);
    });
    e.cartes.forEach((c, i) => { if (!e.themes[c[0]]) pb.push(`${e.id} carte ${i} thème inconnu`); if (!c[4]) pb.push(`${e.id} carte ${i} sans source`); });
    const ids = new Set();
    e.gardes.forEach(g => {
      if (ids.has(g.id)) pb.push(`${e.id} garde id en double ${g.id}`); ids.add(g.id);
      const n = g.noeuds;
      if (!n.debut) pb.push(`${e.id}/${g.id} sans nœud debut`);
      Object.entries(n).forEach(([k, x]) => (x.choix || []).forEach(c => { (Array.isArray(c.suite) ? c.suite : [c.suite]).forEach(t => { if (!n[t]) pb.push(`${e.id}/${g.id} ${k} → ${t} introuvable`); }); if (![0, 1, 2].includes(c.q)) pb.push(`${e.id}/${g.id} ${k} q invalide`); }));
      if (!Object.values(n).some(x => x.fin)) pb.push(`${e.id}/${g.id} sans fin`);
      if (!g.sbar || g.sbar.length !== 4) pb.push(`${e.id}/${g.id} SBAR incomplet`);
      // graphe : atteignabilité, absence de boucle, bifurcations, fins
      const succ = x => (x.choix || []).flatMap(c => Array.isArray(c.suite) ? c.suite : [c.suite]);
      const vus = new Set(), pile = new Set(); let boucle = false;
      const dfs = k => { if (pile.has(k)) { boucle = true; return; } if (vus.has(k) || !n[k]) return; vus.add(k); pile.add(k); succ(n[k]).forEach(dfs); pile.delete(k); };
      dfs('debut');
      if (boucle) pb.push(`${e.id}/${g.id} boucle infinie`);
      Object.keys(n).forEach(k => { if (!vus.has(k)) pb.push(`${e.id}/${g.id} nœud ${k} inatteignable`); });
      const bif = Object.values(n).filter(x => new Set(succ(x)).size > 1).length;
      if (bif < 2) pb.push(`${e.id}/${g.id} seulement ${bif} bifurcation(s)`);
      const fins = Object.values(n).filter(x => x.fin);
      if (fins.length < 2) pb.push(`${e.id}/${g.id} moins de 2 fins`);
      if (!fins.some(x => x.issue === 'mauvaise')) pb.push(`${e.id}/${g.id} aucune fin mauvaise`);
      Object.entries(n).forEach(([k, x]) => { if (x.fin) return; if (!x.choix.some(c => c.q === 2)) pb.push(`${e.id}/${g.id} ${k} sans choix q=2`); if (x.choix.some(c => !c.v)) pb.push(`${e.id}/${g.id} ${k} choix sans v`); if (!x.indice) pb.push(`${e.id}/${g.id} ${k} sans indice`); });
    });
    const m = e.mini || {};
    (m.situations || []).forEach((x, i) => { if (!x.choix || !x.choix.some(c => c.q === 2)) pb.push(`${e.id} situation ${i} sans bon choix`); });
    (m.tri || []).forEach((x, i) => x.items.forEach(it => { if (it[1] >= x.cats.length) pb.push(`${e.id} tri ${i} catégorie invalide`); }));
    (m.erreur || []).forEach((x, i) => { if (!x.items.some(it => it[1])) pb.push(`${e.id} erreur ${i} sans erreur`); });
    e.escape.enigmes.forEach((en, i) => { if (en.type !== 'code' && en.type !== 'ordre' && (en.b == null || en.b >= en.choix.length)) pb.push(`${e.id} escape ${i} invalide`); });
  });
  if (pb.length) console.warn('Problèmes dans les données :', pb);
  return pb;
}

/* ============================== ÉVÉNEMENTS / DÉMARRAGE ============================== */
function demarrer() {
  fusionnerScenarios(); charger();
  const auj = dateLocale(); S.absence = S.derniereVisite ? jours(S.derniereVisite, auj) : 0; S.derniereVisite = auj; sauver();
  appliquerReglages(); valider();
  matchMedia('(prefers-color-scheme: dark)').addEventListener && matchMedia('(prefers-color-scheme: dark)').addEventListener('change', appliquerReglages);
  $$('nav.bas button').forEach(b => b.onclick = () => { son('clic'); aller(b.dataset.nav); });
  aller('accueil', {}, true);
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register('service-worker.js', { updateViaCache: 'none' }).then(r => r.update()).catch(() => { });
    let recharge = false; // une nouvelle version prend la main : on recharge une fois
    const avait = !!navigator.serviceWorker.controller; // pas de rechargement à la toute 1re visite
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (avait && !recharge) { recharge = true; location.reload(); } });
  }
}
window.GardeDeNuit = { valider, news2Score, CALCULS, version: APP_VERSION }; // utile pour les tests
demarrer();
