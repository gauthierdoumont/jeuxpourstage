<!-- Créé par Gauthier Doumont -->
# CLAUDE.md — « Garde de nuit » : jeu de révision des stages infirmiers

Ce fichier guide Claude pour construire et faire évoluer, dans ce dépôt, un **jeu web mobile très ludique** qui permet de réviser la matière de 4 stages infirmiers (bac 4, Bachelier infirmier responsable de soins généraux, Henallux).

---

## 1. Le projet en une phrase

Une appli web **100 % hors ligne**, jouable sur smartphone, où la joueuse est une étudiante infirmière qui monte dans les étages d'un hôpital fictif : chaque étage correspond à un stage, et elle y gagne de l'XP en soignant des patients virtuels, en résolvant des escape games, en jouant aux quiz et en révisant des flashcards.

### Joueuse cible
- Étudiante en **bac 4 Soins infirmiers (Henallux, Belgique)**. Tutoiement, ton bienveillant, humour léger, jamais infantilisant.
- Elle joue surtout **sur son téléphone**, par petites sessions (5-10 min) : dans le bus, pendant une pause, le soir avant un stage.

### Calendrier des stages (année académique 2026-2027)

| # | Dates | Stage | Lieu (hypothèse à confirmer) | Étage du jeu |
|---|-------|-------|------------------------------|--------------|
| 1 | 30/11/2026 → 20/12/2026 | Soins intensifs | Clinique Saint-Pierre, Ottignies | 🫁 Étage 1 « La Réa » |
| 2 | 04/01/2027 → 24/01/2027 | Bloc opératoire | Clinique Saint-Luc, Bouge (Namur) | 🔪 Étage 2 « Le Bloc » |
| 3 | 08/03/2027 → 18/04/2027 | Neurochirurgie — **projet LAT** (unité tenue par des étudiants) | CHU UCL Namur, site Godinne | 🧠 Étage 3 « La Neuro » |
| 4 | 03/05/2027 → 23/05/2027 | Jugement clinique | À préciser | 🧭 Étage 4 « Le Sommet » (transversal) |

Le jeu affiche un **compte à rebours** jusqu'au prochain stage et met en avant l'étage correspondant (« Ton stage en réa commence dans 12 jours : 3 missions recommandées aujourd'hui »).

---

## 2. Règles techniques (conventions des applis perso)

- **Autonome et hors ligne** : aucune IA, aucune API, aucun CDN. Tout est dans le dépôt.
- **Sans framework ni compilation** : HTML + CSS + JavaScript simple.
- **Structure** (le contenu est volumineux) :
  ```
  index.html            ← coquille de l'appli + CSS
  app.js                ← moteur du jeu (sections : CONFIG · ÉTAT · STOCKAGE · RENDU · ÉVÉNEMENTS · UTILITAIRES)
  data/soins-intensifs.js
  data/bloc-operatoire.js
  data/neurochirurgie.js
  data/jugement-clinique.js
  data/scenarios-*.js   ← gardes supplémentaires, situations flash et mini-jeux par étage
  manifest.json         ← installation sur l'écran d'accueil (PWA)
  service-worker.js     ← cache hors ligne (version du cache incrémentée à chaque mise à jour)
  icons/
  ```
  Les données sont des fichiers `.js` (`window.ETAGES.push({...})`, `window.SCENARIOS.rea = {...}`), **pas** des `.json` chargés avec `fetch` (fetch échoue quand on ouvre le fichier en local).
- Constante `APP_VERSION` + journal des changements en commentaire en tête de `app.js`.
- **Sauvegarde** : `localStorage`, clé `jeuxpourstage_v1`, JSON avec `schemaVersion` + fonction de migration ; lectures/écritures dans `try/catch`.
- Boutons **Exporter** (fichier `.json` daté) / **Importer** (confirmation avant d'écraser). Rappel d'export si rien depuis 14 jours.
- **Mobile d'abord** : 1 colonne, testé de 360 à 412 px, zones tactiles ≥ 44 px, boutons d'action en bas (zone du pouce), aucune action au survol uniquement, mode sombre auto + bascule.
- Accessibilité : contrastes suffisants, l'information n'est jamais transmise par la couleur seule (icône + texte), animations désactivables (`prefers-reduced-motion`).
- Sons et vibrations courts, **désactivables** (on peut jouer dans le bus).
- Hébergement : **GitHub Pages** (`https://gauthierdoumont.github.io/jeuxpourstage/`). Le propriétaire du dépôt débute sur GitHub : toujours donner les manipulations pas à pas.
- **Signature discrète** : `<meta name="author" content="Gauthier Doumont">`, commentaire en tête de chaque fichier, et une petite ligne « Créé par Gauthier Doumont » dans l'écran À propos.

---

## 3. Game design : ce qui doit rendre le jeu très ludique

### 3.1 L'hôpital (écran d'accueil)
- Un **immeuble vertical** de 4 étages + un rez-de-chaussée « Vestiaire » (profil, badges, paramètres).
- Chaque étage s'allume avec une animation quand on y entre ; un étage affiche une jauge de **maîtrise** (0-100 %).
- Tous les étages sont accessibles dès le départ, mais l'étage du **prochain stage** est mis en avant (badge « Stage dans X jours »).

### 3.2 Progression
- **XP** à chaque bonne réponse ; bonus de vitesse et de série (combo ×2, ×3…).
- **Grades** : Stagiaire → Étudiante confirmée → Infirmière → Infirmière référente → Cheffe d'unité → Légende de Godinne.
- **Série quotidienne** 🔥 (jours consécutifs joués) avec 1 « jour de congé » par semaine qui protège la série (pas de culpabilisation).
- **Badges** (exemples) : « Main de fée » (10 aiguilles sans erreur d'asepsie), « Zéro compresse oubliée », « Pupilles d'aigle » (20 évaluations de Glasgow parfaites), « Calme en réa » (garde sans perte de patient), « SBAR d'or ».
- **Vies = « énergie de garde »** : 5 cafés ☕ par garde ; une erreur grave de sécurité coûte un café. Jamais de blocage de jeu : les cafés se rechargent en jouant aux flashcards.

### 3.3 Les 4 modes de jeu

**🌙 Mode Garde (histoire à embranchements) — le mode phare**
- La joueuse prend une garde dans un service et reçoit 2 à 4 patients fictifs (prénoms fictifs, aucune donnée réelle).
- Un **moniteur animé** affiche FC, PA, PAM, SpO₂, FR, T°, GCS… qui **évoluent** selon ses choix et le temps qui passe.
- À chaque étape : 3-4 actions possibles (surveiller, appeler le médecin en SBAR, repositionner, vérifier une prescription, prioriser un autre patient…).
- Conséquences visibles : le patient s'améliore ou se dégrade ; feedback immédiat « 🧠 Le pourquoi ».
- Fin de garde : **rapport de garde** (score sécurité, priorisation, communication) + transmission SBAR à reconstituer.

**🏆 Mode Quiz à niveaux**
- Par étage : 5 niveaux de difficulté croissante + un **Boss** (cas clinique complet chronométré).
- Formats : QCM (une ou plusieurs bonnes réponses), Vrai/Faux justifié, « Le plus prioritaire ? », chrono 60 s.
- Chaque correction affiche le bloc pédagogique (voir §5).

**🔐 Mode Escape game**
- Une salle par étage, 4-6 énigmes enchaînées, codes à trouver, minuteur facultatif.
- Idées : « Le bloc est verrouillé » (refaire la check-list OMS dans le bon ordre pour obtenir le code), « La DVE qui fuit » (trouver les 3 erreurs de réglage), « Le box 7 sonne » (décoder les alarmes du ventilateur), « Le dossier mélangé » (reconstruire la démarche de soins).

**🃏 Mode Flashcards + mini-jeux**
- Flashcards en **répétition espacée** (système de Leitner à 5 boîtes ; boîte 1 tous les jours → boîte 5 tous les 14 jours).
- Mini-jeux rapides (30-90 s) :
  - **Remets dans l'ordre** (habillage-gantage stérile, étapes d'une aspiration endotrachéale, check-list OMS…)
  - **Trouve l'erreur** (scène décrite ou illustrée en SVG : faute d'asepsie, mauvaise installation, mauvais niveau de DVE)
  - **Glasgow express** (description clinique → construire Y/V/M)
  - **Calcul flash** (PAM, PPC, débits de perfusion, dilutions — avec calculatrice interdite ou autorisée)
  - **Tri** (signes d'HTIC vs signes de choc, actes B1 / B2 / actes confiés)
  - **Associe** (gaz du sang ↔ trouble acido-basique)

### 3.4 Ambiance
- Palette (charte Clarisse) : bleu soin `#2E86AB`, vert menthe `#3BB273`, violet `#7B5EA7`, orange `#F18F01`, rouge corail `#E15554`, texte `#2B2B2B`.
- Une **mascotte** (ex. « Monito », un petit moniteur cardiaque) qui commente avec humour et encourage.
- Illustrations **dessinées en SVG dans le code** (pas d'images protégées).
- Micro-animations : confettis à la montée de grade, tracé ECG qui défile pendant les gardes.

---

## 4. La matière à couvrir (cahier des charges du contenu)

> Le contenu du jeu doit couvrir ces notions. Chaque notion = au moins 1 flashcard + 2 questions de quiz ; les notions marquées ⭐ doivent aussi apparaître dans une garde ou un escape game.
> Objectif de départ : **≥ 60 cartes et ≥ 120 questions par étage**, enrichies ensuite.

### 🫁 Étage 1 — Soins intensifs (Ottignies)

| Thème | Notions clés |
|-------|-------------|
| ⭐ Évaluation ABCDE | Approche systématique du patient critique, reconnaissance des signes précurseurs d'arrêt |
| ⭐ Monitorage hémodynamique | PAM = (PAS + 2 × PAD) / 3 ; cible usuelle de PAM ≥ 65 mmHg en choc septique (SSC 2026 : 60-65 mmHg suggéré chez les ≥ 65 ans) ; cathéter artériel (courbe, mise à zéro, risques) ; voie veineuse centrale |
| ⭐ Choc | Types (hypovolémique, cardiogénique, distributif/septique, obstructif), signes, lactates, diurèse |
| ⭐ Sepsis (SSC 2026) | Dépistage par un score unique type NEWS/NEWS2/MEWS/SIRS plutôt que qSOFA ; antibiotiques dans l'heure si sepsis probable ; vasopresseur possible en périphérique en attendant l'accès central |
| Amines | Noradrénaline : voie dédiée, pas de rinçage en bolus de la ligne, surveillance du point d'injection (doses → toujours CBIP + prescription) |
| ⭐ Ventilation mécanique | Principes des modes (contrôlé / assisté / aide inspiratoire), alarmes (pression haute/basse, volume), sécurité de la sonde (repère, fixation, pression du ballonnet), aspiration endotrachéale |
| ⭐ Prévention des PAVM | Tête du lit 30-45°, sédation légère (RASS 0 à −1), évaluation quotidienne du sevrage, soins de bouche, mobilisation précoce |
| ⭐ Douleur – sédation – délirium (PADIS 2018 + mise à jour 2025) | Traiter la douleur avant de sédater ; échelles BPS / CPOT (patient non communicant), RASS (−5 à +4), CAM-ICU (dépistage du délirium) ; bundle ABCDEF ; sommeil (mélatonine citée comme intervention à faible risque dans la mise à jour 2025) |
| Gaz du sang | pH 7,35-7,45 ; PaCO₂ 35-45 mmHg ; HCO₃⁻ 22-26 mmol/L ; acidose/alcalose respiratoire ou métabolique, compensation |
| Réanimation (ERC 2025) | Compressions de haute qualité, défibrillation précoce, causes réversibles (4H-4T), reconnaissance des signes précurseurs |
| Prévention | Escarres (décubitus ventral !), thrombose, infections sur cathéter, hygiène des mains |
| Humain | Accueil des familles, communication avec le patient intubé, fin de vie et limitation thérapeutique (cadre général) |

### 🔪 Étage 2 — Bloc opératoire (Bouge)

| Thème | Notions clés |
|-------|-------------|
| ⭐ Rôles | Infirmier(ère) instrumentiste, circulant(e), infirmier(ère) d'anesthésie ; travail d'équipe |
| ⭐ Asepsie chirurgicale | Zones et circuits (propre/sale), tenue, désinfection chirurgicale des mains par friction, habillage et gantage stériles, table et champ stériles, **faute d'asepsie** : la reconnaître, la signaler, la corriger |
| ⭐ Check-list OMS | 3 temps : avant l'induction (« sign in »), avant l'incision (« time out »), avant la sortie de salle (« sign out ») ; vérification identité/site/côté, allergies, risque hémorragique, antibioprophylaxie, comptages |
| ⭐ Comptage | Compresses, aiguilles, instruments : quand, comment, que faire en cas de discordance |
| ⭐ Installation | Décubitus dorsal, latéral, ventral, position gynécologique, assis ; points d'appui ; prévention des compressions nerveuses (bras en abduction limitée) et des escarres peropératoires |
| Bistouri électrique | Plaque neutre (zone musclée, sèche, proche du site, loin des prothèses métalliques), risques de brûlure |
| ⭐ Hypothermie (NICE CG65) | Hypothermie = T° centrale < 36 °C ; réchauffement actif (air pulsé) ; perfusions ≥ 500 mL réchauffées ; pas de retour en unité si T° < 36 °C |
| Infection du site opératoire (NICE NG125) | Pas de dépilation systématique ; si nécessaire, tondeuse électrique le jour même, **jamais de rasoir** ; antibioprophylaxie selon le protocole local |
| Anesthésie | Générale (induction, entretien, réveil), locorégionale, sédation ; score ASA ; jeûne préopératoire ; matériel d'intubation |
| ⭐ Salle de réveil (SSPI) | Score d'Aldrete modifié (sortie si ≥ 9/10, selon protocole local), douleur, nausées-vomissements, saignement, surveillance |
| Urgences au bloc | Choc anaphylactique, hémorragie, hyperthermie maligne (reconnaître, alerter) |
| Matériel | Stérilisation (bases), traçabilité des dispositifs médicaux implantables, prélèvements (étiquetage) |

### 🧠 Étage 3 — Neurochirurgie, projet LAT (Godinne)

| Thème | Notions clés |
|-------|-------------|
| ⭐ Examen neurologique | **Glasgow** (Yeux 1-4, Verbal 1-5, Moteur 1-6 ; total 3-15 ; « NT » si non testable, révision 2014) ; pupilles (taille, symétrie, réactivité) ; GCS-P = GCS − score de réactivité pupillaire (0/1/2) ; force motrice des 4 membres ; parole |
| ⭐ Hypertension intracrânienne | Principe de Monro-Kellie ; signes (céphalées, vomissements, baisse de conscience, anisocorie) ; **triade de Cushing** (HTA, bradycardie, respiration irrégulière) = signe tardif ; PPC = PAM − PIC ; cibles BTF (TC grave) : traiter si PIC > 22 mmHg, PPC 60-70 mmHg |
| ⭐ Rôle infirmier HTIC | Tête à 30°, axe tête-cou-tronc aligné, pas de compression jugulaire, normothermie, éviter toux/efforts/Valsalva, regrouper les soins, surveillance rapprochée |
| ⭐ Dérivation ventriculaire externe (DVE) | Mise à niveau au **tragus** (repère du trou de Monro) ; **clamper avant toute mobilisation** puis déclamper sur prescription ; débit horaire, aspect du LCR (clair, rosé, trouble), oscillations, pansement, signes d'infection ; risques d'un mauvais niveau (surdrainage → hématome sous-dural/collapsus ventriculaire ; sous-drainage → HTIC) |
| ⭐ Hémorragie sous-arachnoïdienne anévrismale (AHA 2023) | Céphalée « en coup de tonnerre » ; nimodipine entérale précoce (prévention de l'ischémie cérébrale retardée — dose à vérifier CBIP, *Nimotop®*) ; **vasospasme** surveillé surtout entre J4 et J14 ; euvolémie ; hyponatrémie |
| Hématome sous-dural chronique | Patient âgé, anticoagulants, chutes ; trou de trépan + drain ; surveillance neuro |
| Tumeurs cérébrales | Craniotomie : surveillance post-op, œdème (corticoïdes), crises d'épilepsie |
| ⭐ Chirurgie du rachis | Hernie discale, laminectomie, arthrodèse ; surveillance sensitivo-motrice des membres, **syndrome de la queue de cheval** (urgence), brèche durale/fuite de LCR, mobilisation en bloc, lever selon protocole |
| Complications | Diabète insipide (polyurie), SIADH, crise épileptique (conduite à tenir infirmière), thrombose, escarres, fausse route |
| ⭐ Projet LAT (unité gérée par des étudiants) | Organisation d'une unité, planification de la charge de travail, délégation, gestion du temps, transmissions orales et écrites (SBAR), leadership, collaboration avec l'infirmier(ère) superviseur(e) et le médecin, gestion des imprévus |

### 🧭 Étage 4 — Jugement clinique (transversal)

| Thème | Notions clés |
|-------|-------------|
| ⭐ Modèle de Tanner | 4 étapes : **remarquer** (noticing) → **interpréter** → **répondre** → **réfléchir** ; grille de Lasater (11 dimensions) pour s'auto-évaluer |
| ⭐ Démarche de soins | Recueil de données (Henderson 14 besoins / Gordon 11 modes fonctionnels), analyse, diagnostics infirmiers (NANDA-I) vs problèmes traitables en collaboration, objectifs SMART, interventions, évaluation |
| ⭐ Priorisation | ABCDE, menace vitale d'abord, aigu avant chronique, Maslow ; « Qui je vois en premier ? » |
| ⭐ Détection de la détérioration | **NEWS2** : déclenchement à 5-6 (ou un paramètre à 3) → réévaluation urgente, à ≥ 7 → réponse d'urgence ; adapter au protocole du service |
| ⭐ Communication | SBAR (Situation, Background/Antécédents, Assessment/Évaluation, Recommandation) ; transmissions ciblées |
| Sécurité médicamenteuse | Vérifications avant administration (bon patient, bon médicament, bonne dose, bonne voie, bon moment…) ; double vérification ; calculs de doses et débits |
| Cadre légal belge | Loi coordonnée du 10 mai 2015 (professions des soins de santé) ; AR du 18 juin 1990 : prestations B1, B2, actes confiés ; ce que l'étudiante peut faire en stage sous supervision |
| Réflexivité | Analyse d'une situation de stage, erreur et apprentissage, éthique |

L'étage 4 **mélange** des cas des étages 1 à 3 : c'est la grande révision finale (« Garde de la mort » = 6 patients de services différents à prioriser).

---

## 5. Règles de rédaction du contenu (style « Clarisse »)

Chaque explication affichée après une réponse suit ce schéma (court, ~5 lignes max par bloc) :

1. 🔬 **Terme technique** en gras
2. 💬 **En clair** : une phrase simple
3. 🧠 **Le pourquoi** : la logique physiopathologique en 2-3 phrases
4. 🩺 **En stage** : ce que ça change concrètement (surveillance, signes d'alerte, geste)
5. ⚠️ **Piège / signe d'alerte** (si pertinent)
6. 📚 **Source** (organisme + année) et niveau de preuve : 🟢 fort · 🟡 modéré · 🟠 faible

Règles strictes :
- **Ne jamais inventer** un chiffre, une étude ou une référence. Si une info n'est pas vérifiée, ne pas l'intégrer.
- **Sources** par ordre de priorité : Belgique (KCE, SPF Santé publique, CSS, Sciensano, **CBIP**, AFMPS, EBMPracticeNet, textes légaux) → recommandations internationales (OMS, HAS, NICE, ERC, SSC, sociétés savantes) → Cochrane / JBI → études publiées. Pas de blogs, forums, Wikipédia.
- **Médicaments** : DCI + nom commercial belge, doses uniquement si vérifiées sur le CBIP, toujours avec le rappel « la prescription et la double vérification priment ».
- Rappeler régulièrement que **le protocole du service et l'infirmier(ère) référent(e) priment** sur le jeu.
- Patients **100 % fictifs** (prénoms inventés, aucune donnée réelle).
- Une reco de plus de 5 ans est signalée « à vérifier » dans le champ `source`.

---

## 6. Format des données

```js
// data/soins-intensifs.js — Créé par Gauthier Doumont
window.ETAGES = window.ETAGES || [];
window.ETAGES.push({
  id: 'rea', num: 1, titre: 'La Réa', emoji: '🫁', couleur: '#2E86AB',
  service: 'Soins intensifs', lieu: '…', stage: { debut: '2026-11-30', fin: '2026-12-20' },
  accroche: '…', boss: 'Nom du boss',
  themes: { pavm: 'Prévention des PAVM', … },
  sources: { IHI: 'IHI Ventilator Bundle … 🟡', … },          // clés réutilisées dans `s`
  cartes: [ ['pavm', 'Recto ?', 'Verso', 'Le pourquoi', 'IHI'], … ],  // [thème, recto, verso, pourquoi, source]
  questions: [
    { th: 'pavm', n: 1, q: 'Énoncé', c: ['A', 'B', 'C', 'D'], b: [0],      // QCM (b = indices des bonnes réponses)
      x: ['En clair', 'Le pourquoi', 'En stage', 'Piège'], s: 'IHI' },
    { t: 'vf', th: 'pavm', n: 2, q: 'Affirmation', b: false, x: [...], s: 'IHI' }  // Vrai/Faux
  ],
  mini: { calculs: ['pam', 'debit'], ordre: [...], tri: [...], associe: [...], erreur: [...], glasgow: [...], news2: true },
  garde: { titre, intro, retenir, sbar: [S, B, A, R], noeuds: { debut: { v: {FC, PAS, PAD, SpO2, FR, T, GCS}, texte, choix: [{ t, q: 2|1|0, fb, suite, v }] }, …, fin: { fin: true, texte } } },
  escape: { titre, intro, final, victoire, enigmes: [{ titre, texte, type: 'qcm'|'code'|'ordre', chiffre, indice, explication, … }] }
});
```

Niveau `n` : 1 = facile, 2 = intermédiaire, 3 = difficile (les niveaux 1-5 du quiz et le boss puisent dedans). Dans une garde, `q` vaut 2 (meilleur choix), 1 (acceptable) ou 0 (risqué, coûte un café).
Valider au chargement que chaque `suite` pointe vers un nœud existant et que chaque question a une source.

---

## 7. Ordre de construction conseillé

1. **Version minimale** : `index.html` + `app.js` + l'étage 1 avec flashcards (Leitner) et quiz, XP, sauvegarde, export/import. → jouable sur téléphone.
2. Ajouter les étages 2, 3, 4 (contenu).
3. Ajouter le **mode Garde** (moniteur animé + 1 scénario par étage).
4. Ajouter les **escape games** et les mini-jeux.
5. Badges, grades, série quotidienne, compte à rebours des stages, mascotte.
6. PWA (installation + hors ligne), puis mise en ligne GitHub Pages.

À chaque étape, livrer des fichiers complets et la liste des changements.

### Check-list avant chaque livraison
- [ ] S'ouvre sans erreur dans la console, y compris en ouvrant `index.html` en local
- [ ] Fonctionne hors ligne
- [ ] Affichage correct de 360 à 412 px ; mode sombre lisible
- [ ] Progression conservée après rechargement ; export puis import = mêmes données
- [ ] Chaque question a une explication et une source ; aucune dose non vérifiée CBIP
- [ ] Signature « Créé par Gauthier Doumont » présente (À propos + en-têtes de fichiers)

---

## 8. État actuel (v1.6.0, 01/11/2026)

> Mission v2.0.0 en cours (phases 1 à 7). Phases 1-4 terminées (phase 3 : sauvegarde v2, étoiles, carnet, points faibles ; phase 4 : missions du jour, défi hebdo, récompenses, jokers) : moteur des gardes à embranchements, 4 gardes de la Réa réécrites, contenu de la Réa à l'objectif (68 cartes, 122 questions dont 31 de niveau 3, 21 situations, 4 « qui en premier ? », 15 mots). Les gardes des autres étages seront réécrites en phase 6 (d'ici là, `valider()` les signale).

Le jeu complet est en place et testé (Chromium 360 px, aucune erreur console, toutes les gardes et tous les mini-jeux joués jusqu'au bout, progression conservée au rechargement).

| Fichier | Rôle |
|---------|------|
| `index.html` | Coquille, CSS (thèmes clair/sombre), navigation du bas |
| `app.js` | Moteur : hôpital, quiz 5 niveaux + boss, gardes multiples (moniteur ECG animé + SBAR final), escape games, flashcards Leitner, 13 mini-jeux, XP/grades/série/27 badges/cafés, réglages, export/import |
| `data/soins-intensifs.js` · `bloc-operatoire.js` · `neurochirurgie.js` · `jugement-clinique.js` | Contenu de base de chaque étage (cartes, questions, 1re garde, escape game, sources) |
| `data/scenarios-rea.js` · `scenarios-bloc.js` · `scenarios-neuro.js` · `scenarios-jugement.js` | Situations supplémentaires : gardes, situations flash, « qui en premier ? », mots mystères, ordre, tri, associe, erreur, Glasgow |
| `manifest.json` · `service-worker.js` · `icons/` · `.nojekyll` | Installation, hors ligne, GitHub Pages |

**Contenu par étage** : 4 gardes · 12-14 situations flash · 2-3 classements « qui en premier ? » · 12 mots mystères · 4-6 « remets dans l'ordre » · 3-4 tris · 2 « trouve l'erreur » · 2-3 jeux d'association (aussi utilisés par le Memory) · ~50 cartes · ~40 questions rédigées (+ 1 question auto par carte). Neuro : 12 cas de Glasgow. Réa et Sommet : gaz du sang express. Sommet : NEWS2 express.

**Accès aux mini-jeux** : bouton « 🎮 Jeux » de la barre du bas (Salle de jeux, choix de l'étage), bouton orange sur l'accueil, et tuile « Mini-jeux » en haut de chaque étage. Lancer un jeu crée une entrée d'historique (le bouton retour du téléphone ramène à la liste).

**Mini-jeux (13)** : situations flash, qui en premier ?, sprint 60 s, memory, mot mystère, gaz du sang express, remets dans l'ordre, tri express, associe, trouve l'erreur, Glasgow express, NEWS2 express, calcul flash.

Format des scénarios supplémentaires (`window.SCENARIOS[idEtage]`) :
```js
{ sources: {...}, gds: true,
  gardes: [{ id: 'rea-acr', titre, difficulte: 1-3, intro, retenir, sbar: [S,B,A,R], noeuds: { debut: {...}, …, fin: { fin: true, texte } } }],
  situations: [{ patient, v: {FC,PAS,PAD,SpO2,FR,T,GCS, GCSlabel:'RASS'?}, texte, s, stage, choix: [{ t, q: 2|1|0, fb }] }],
  prio: [{ titre, intro, s, patients: [[libellé, explication], …] }],   // dans l'ordre de priorité attendu
  mots: [[MOT, indice, explication]], ordre, tri, associe, erreur, glasgow }  // mêmes formats que les fichiers de base
```
**Sauvegarde v2** (`SCHEMA_VERSION = 2`) : `migrer()` v1→v2 calcule les étoiles depuis les records (niveaux, boss, gardes, escape) sans rien supprimer, puis la sauvegarde est réécrite. Nouveaux champs : `etoiles` (clés `niv:<étage>:<0-4>`, `boss:<étage>`, `garde:<étage>:<gardeId>`, `escape:<étage>`, `mini:<étage>:<jeu>` → 1-3), `carnet` (clés `q:<questionId>`, `s:<étage>:<indexSituation>`, `g:<étage>:<gardeId>:<nœud>` → `{ type, boite 1-3, serie, due }`), `themes` (`<étage>:<thème>` → `[bonnes, total]`).
Seuils d'étoiles : niveau 6/7/8 sur 8 · boss 7/9/10 · garde 50/80/95 % · escape réussi / sans indice / sans indice ni erreur et < 90 s par énigme · mini-jeu 60/80/100 %. Un joker café plafonne à ★★. Carnet : boîte 1 → J+1, 2 → J+3, 3 → J+7, 3 réussites d'affilée = sortie, échec = boîte 1. Les identifiants de questions (`<étage>-q<index>`) et de situations (index) servent de clés : ne jamais réordonner.

**Boucle quotidienne** : `missionsDuJour()` tire 3 missions avec un générateur initialisé sur la date (`S.jour`, stable au rechargement) : 1 sur l'étage du stage en cours/prochain, 1 de mémoire (carnet si ≥ 5 erreurs dues, sinon 15 flashcards), 1 au hasard. Les modes émettent des événements (`evenement('garde_fin'|'fin_nouvelle'|'situation_ok'|'carte'|'rattrapage_ok'|'niveau'|'etoile'|'mini_fin', …)`) qui font avancer missions et défi de la semaine (`S.semaine`, graine = semaine ISO). Mission = +30 XP +1 café ; 3/3 = coffre +50 XP ; défi = +150 XP. `RECOMPENSES` : 10 paliers en % des étoiles disponibles (dernier à 70 %), choix d'apparence dans le Vestiaire (`S.apparence`). Jokers café : « Appeler le référent » (garde), 50/50 (QCM à une réponse), indice d'escape sans pénalité ; tout joker plafonne les étoiles à ★★. Jamais de blocage sans café.

**Gardes v2 (obligatoire)** : `varier: { FC, PAS, SpO2, FR, T }` (décalage tiré à chaque partie, appliqué à l'affichage, jamais sur une valeur 0) ; chaque choix a un `v` (q=2 améliore/stabilise, q=1 stagne, q=0 dégrade) ; `suite` = chaîne ou tableau (tirage au hasard → imprévus, nœud avec `evenement: true`) ; chaque nœud a un `indice` (joker « ☕ Appeler le référent ») ; après chaque q=0, un nœud de complication (texte « ⚠️ Complication ») avec un rattrapage ; fins `{ fin: true, issue: 'bonne'|'moyenne'|'mauvaise', titre, texte }`, au moins 2 dont une mauvaise ; ≥ 2 nœuds qui bifurquent ; graphe sans boucle. Les textes restent qualitatifs pour les constantes affichées (pas de chiffres de PA/FC/SpO₂ qui contrediraient le moniteur). Fins découvertes : `S.etages[id].fins[gardeId]`.

`v.FC = 0` affiche un tracé de fibrillation (arrêt cardiaque). Avec `GCSlabel: 'RASS'`, la case GCS du moniteur affiche le RASS.

Règles pour enrichir :
- **Toujours ajouter les cartes à la fin** du tableau `cartes` (l'index sert d'identifiant de progression Leitner) ; **ne jamais changer l'`id` d'une garde** (il sert à mémoriser le record).
- Chaque question/situation a une source `s` (clé de `sources` de l'étage ou du fichier de scénarios).
- `GardeDeNuit.valider()` (console du navigateur) liste les incohérences de données (nœuds manquants, choix sans bonne réponse…).
- Après toute modification, incrémenter `APP_VERSION` (app.js) **et** `CACHE` (service-worker.js) ; tout nouveau fichier `data/*.js` doit être ajouté dans `index.html` **et** dans la liste du service worker.

Prochaines pistes : atteindre 60 cartes / 120 questions rédigées par étage ; ajouter des gardes au fil des retours de stage.

## 9. Hypothèses et points à confirmer

- **Ottignies** = Clinique Saint-Pierre ; **Bouge** = Clinique Saint-Luc de Bouge (hypothèses de lieu).
- **Projet LAT** : un stage LAT où les étudiants gèrent les soins d'une unité sous supervision est documenté au CHU UCL Namur Godinne en **pneumologie** (reportage Matélé), avec l'intention de l'étendre à d'autres unités ; ici, il s'applique à la **neurochirurgie** (info de l'utilisateur). Le sens exact du sigle n'a pas été trouvé.
- **Stage « jugement clinique »** : contenu exact non communiqué par l'école → hypothèse : stage transversal évaluant le raisonnement clinique (Tanner/Lasater, démarche de soins, priorisation, SBAR). À ajuster dès réception du carnet de stage ou de la grille d'évaluation Henallux.
- Les **protocoles locaux** des hôpitaux ne sont pas publics : le jeu enseigne les recommandations générales et le rappelle.

---

## 10. Sources de référence (vérifiées en octobre 2026)

**Soins intensifs**
- Surviving Sepsis Campaign — *International Guidelines for Management of Sepsis and Septic Shock 2026*, Crit Care Med 2026 (doi 10.1097/CCM.0000000000007075) — https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026 🟢
- SCCM — PADIS Guidelines 2018 + *Focused Update* 2025 (Crit Care Med 2025;53(3):e711-e727) — https://sccm.org/clinical-resources/guidelines/guidelines/guidelines-for-the-prevention-and-management-of-pa 🟢
- European Resuscitation Council — *Guidelines 2025 Adult Advanced Life Support*, Resuscitation 2025 — https://pubmed.ncbi.nlm.nih.gov/41117572/ 🟢
- Prévention des PAVM (bundle) — revues PMC : https://pmc.ncbi.nlm.nih.gov/articles/PMC5826669 ; Intensive Care Society : https://journals.sagepub.com/doi/full/10.1177/1751143716644461 🟡

**Bloc opératoire**
- OMS — Check-list de sécurité chirurgicale ; SPF Santé publique (programme qualité et sécurité des patients, usage en Belgique) — https://news.belgium.be/fr/node/17342/pdf 🟢
- NICE CG65 — *Hypothermia: prevention and management in adults having surgery* — https://www.nice.org.uk/guidance/cg65/chapter/1-guidance 🟢 (révision 2016 → à vérifier)
- NICE NG125 — *Surgical site infections* (2019, mis à jour 2020) — https://www.nice.org.uk/guidance/ng125/chapter/Recommendations 🟢
- Score d'Aldrete modifié — MDCalc : https://www.mdcalc.com/calc/10620/aldrete-score 🟡
- Conseil Supérieur de la Santé (hygiène des mains, hygiène hospitalière) — https://www.hgr-css.be (document à consulter pour la friction chirurgicale) 🟢

**Neurochirurgie**
- Brain Trauma Foundation — *Guidelines for the Management of Severe TBI*, 4e éd. (PIC > 22 mmHg, PPC 60-70 mmHg) 🟡
- AHA/ASA — *2023 Guideline for the Management of Patients With aSAH*, Stroke 2023;54:e314-e370 — https://professional.heart.org/en/science-news/2023-guideline-for-the-management-of-patients-with-aneurysmal-subarachnoid-hemorrhage/top-things-to-know 🟢
- Teasdale G. et al. — *The Glasgow Coma Scale at 40 years*, Lancet Neurol 2014 ; Brennan, Murray, Teasdale — GCS-P, J Neurosurg 2018 — https://glasgowcomascale.org/what-is-gcs/ 🟢
- Soins infirmiers DVE — revue de portée, Rev Bras Enferm 2021 — https://scielo.br/j/reben/a/4gPz9sdGrvbqKrgTgR8gfNq/?lang=en ; guideline infirmier 2022 — https://pmc.ncbi.nlm.nih.gov/articles/PMC9782641 🟡 ; AANN *Care of the patient undergoing ICP monitoring/EVD* 🟡
- CHU UCL Namur — service de neurochirurgie Godinne : https://www.chuuclnamur.be/services/neurochirurgie/godinne/473/ ; stage LAT : https://www.matele.be/des-etudiants-infirmiers-aux-commandes-au-chu-ucl-namur

**Jugement clinique**
- Tanner C.A. — *Thinking like a nurse: a research-based model of clinical judgment in nursing*, J Nurs Educ 2006 🟡
- Lasater K. — *Clinical judgment development: using simulation to create a rubric*, J Nurs Educ 2007;46:496-503 ; validation 2025 : https://pmc.ncbi.nlm.nih.gov/articles/PMC11749331 🟡
- Royal College of Physicians — *NEWS2* (2017, guidance complémentaire) — https://www.rcp.ac.uk/media/mrllczrj/news2-chart-4_clinical-response-to-news-trigger-thresholds_0.pdf 🟢
- Cadre légal belge : loi coordonnée du 10 mai 2015 ; AR du 18 juin 1990 (liste des prestations techniques et actes confiés).

**Ajouts v2 (vérifiés en novembre 2026)**
- Code pénal belge, art. 458 (secret professionnel) — Cour constitutionnelle, arrêt 127/2013 : https://fr.const-court.be/public/f/2013/2013-127f.pdf 🟢
- American Diabetes Association — Standards of Care 2025, section 6 (hypoglycémie : niveau 2 < 54 mg/dL, règle 15 g / 15 min) — https://pubmed.ncbi.nlm.nih.gov/39651981/ 🟢
- Resuscitation Council UK — 2025 Adult ALS (adrénaline dès que possible si non choquable, après le 3e choc si choquable) — https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/adult-advanced-life-support-guidelines 🟢
- Resuscitation Council UK — Emergency treatment of anaphylaxis — https://resus.org.uk/media/337/download 🟢
- European Malignant Hyperthermia Group — gestion d’une crise / disponibilité du dantrolène — https://www.emhg.org/recommendations-1/2020/8/26/dantrolene-availability 🟢

**Médicaments** : toujours le **CBIP** — https://www.cbip.be

---

<sub>Créé par Gauthier Doumont</sub>
