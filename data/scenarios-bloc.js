/* Scénarios supplémentaires — Étage 2, Bloc opératoire. Créé par Gauthier Doumont
 * Format : voir data/scenarios-rea.js */
window.SCENARIOS = window.SCENARIOS || {};
window.SCENARIOS.bloc = {
  tirage: 5,
  escape: [
    { titre: 'La blouse', texte: 'Quelle partie de la blouse stérile n’est PAS considérée comme stérile ? Chiffre : 7 si tu trouves.', type: 'qcm', choix: ['L’avant de la poitrine', 'Les manches', 'Le dos', 'Le devant jusqu’au niveau du champ'], b: 2, chiffre: '7', indice: 'Ce que tu ne vois pas…', explication: 'Le dos n’est pas surveillable → 7.' },
    { titre: 'Le jeûne', texte: 'Jusqu’à combien d’heures avant l’anesthésie les liquides clairs sont-ils généralement autorisés chez l’adulte ?', type: 'code', reponses: ['2', 'deux'], chiffre: '2', indice: 'Moins que pour les solides (6 h).', explication: '2 heures pour les liquides clairs (selon protocole) → 2.' },
    { titre: 'Le comptage', texte: 'Remets dans l’ordre la conduite à tenir en cas de comptage faux. Chiffre : le nombre d’étapes.', type: 'ordre', etapes: ['Annoncer la discordance', 'Suspendre la fermeture', 'Rechercher partout', 'Imagerie si non retrouvé'], chiffre: '4', indice: 'On commence par le dire.', explication: '4 étapes → 4.' },
    { titre: 'L’ASA', texte: 'Patient avec une maladie systémique sévère : quel score ASA ?', type: 'qcm', choix: ['1', '2', '3', '5'], b: 2, chiffre: '3', indice: '1 sain, 2 léger, … sévère.', explication: 'ASA 3 → 3.' },
    { titre: 'Le plexus', texte: 'Abduction maximale du bras sur l’appui-bras (en degrés) ? Le chiffre à trouver est le premier chiffre.', type: 'code', reponses: ['90', '9'], chiffre: '9', indice: 'Un angle droit.', explication: 'Moins de 90° → 9.' },
    { titre: 'L’anaphylaxie', texte: 'Après une 1re adrénaline IM, au bout de combien de minutes la répète-t-on si les signes persistent (RCUK) ?', type: 'qcm', choix: ['1', '5', '30', '60'], b: 1, chiffre: '5', indice: 'Ni trop tôt, ni trop tard.', explication: '5 minutes → 5.' }
  ],
  sources: {
    RCUK: 'Resuscitation Council UK — Emergency treatment of anaphylaxis (2021, mise à jour 2025) 🟢',
    EMHG: 'European Malignant Hyperthermia Group — reconnaissance et prise en charge d’une crise (Br J Anaesth 2010) ; disponibilité du dantrolène (BJA 2020) 🟢',
    CBIP: 'CBIP — Répertoire commenté des médicaments (à consulter pour toute dose) 🟢',
    RAU: 'Rétention urinaire post-opératoire : protocoles locaux (seuils de sondage variables, souvent 300 à 800 mL) 🟠'
  },
  gardes: [
    {
      id: 'bloc-anaph', titre: 'Choc anaphylactique en salle 1', difficulte: 3,
      varier: { FC: 6, PAS: 8, SpO2: 1, FR: 2, T: 0.2 },
      intro: 'Il est 8 h 20. M. Karim S., 45 ans, est installé pour une cure de hernie inguinale. L’anesthésiste vient d’injecter l’antibioprophylaxie et les produits d’induction.',
      retenir: 'Anaphylaxie au bloc : reconnaître vite (peau, respiration, PA), alerter, arrêter le produit suspect, adrénaline intramusculaire précoce selon protocole (l’IV est réservée aux équipes expérimentées), O₂, remplissage, noter les heures et les produits, prélèvements selon protocole pour l’enquête allergologique.',
      sbar: ['M. S., 45 ans, salle 1 : choc anaphylactique quelques minutes après l’induction', 'Cure de hernie programmée, aucun antécédent d’allergie connu, antibiotique et curare injectés juste avant', 'PA remontée après adrénaline et remplissage, bronchospasme levé, éruption en régression', 'Je recommande une surveillance rapprochée en SSPI ou soins intensifs et une consultation d’allergologie'],
      noeuds: {
        debut: { heure: '08 h 22', patient: 'M. S., 45 ans — hernie inguinale', v: { FC: 128, PAS: 78, PAD: 42, SpO2: 91, FR: 14, T: 36.6, GCS: 3 }, texte: 'Quelques minutes après l’induction, tu vois des plaques rouges sur le thorax. La PA chute et l’anesthésiste signale que le patient est difficile à ventiler.', s: 'RCUK', indice: 'Peau + respiration + circulation, juste après une injection…',
          choix: [
            { t: 'Dire tout haut ce que tu vois (« éruption + chute de PA ») et aider l’anesthésiste : appel à l’aide', q: 2, v: {}, fb: 'Peau + atteinte respiratoire + hypotension brutale après injection : anaphylaxie jusqu’à preuve du contraire.', suite: 'stop' },
            { t: 'Penser à une simple réaction cutanée et continuer l’installation', q: 0, v: { PAS: 68, PAD: 36, SpO2: 87 }, fb: 'L’éruption n’est pas isolée : il y a aussi hypotension et bronchospasme.', suite: 'comp_retard' },
            { t: 'Préparer la peau pour que le chirurgien commence vite', q: 0, v: { PAS: 68, PAD: 36, SpO2: 87 }, fb: 'La vie du patient passe avant l’intervention.', suite: 'comp_retard' }
          ] },
        comp_retard: { heure: '08 h 25', v: { FC: 142, PAS: 62, PAD: 32, SpO2: 84 }, texte: '⚠️ Complication : la PA s’effondre encore, le visage gonfle, la saturation chute.', s: 'RCUK', indice: 'C’est une urgence vitale : il faut le dire et agir maintenant.',
          choix: [
            { t: 'Alerter immédiatement l’anesthésiste, appel à l’aide, chariot d’anaphylaxie', q: 2, v: {}, fb: 'Rattrapage : l’équipe démarre le traitement, avec quelques minutes de retard.', suite: 'stop' },
            { t: 'Attendre que ça passe', q: 0, v: { FC: 0, PAS: null, PAD: null, SpO2: null }, fb: 'Sans adrénaline, l’anaphylaxie peut mener à l’arrêt cardiaque.', suite: 'fin_mauvaise' }
          ] },
        stop: { heure: '08 h 26', texte: 'L’anesthésiste annonce : « Anaphylaxie ! ». Que fais-tu en tant que circulante ?', s: 'RCUK', indice: 'Supprimer l’exposition et préparer le traitement de première ligne.',
          choix: [
            { t: 'Arrêter la perfusion d’antibiotique en cours, apporter le chariot/kit d’anaphylaxie et préparer ce que l’anesthésiste prescrit (adrénaline, remplissage)', q: 2, v: { FC: 120, PAS: 86, PAD: 48, SpO2: 93 }, fb: 'On supprime l’exposition au produit suspect et on prépare l’adrénaline.', suite: ['adre', 'evt_chir'] },
            { t: 'Donner un antihistaminique en premier', q: 1, v: {}, fb: 'Les antihistaminiques ne traitent ni le choc ni le bronchospasme : l’adrénaline est le traitement de première ligne.', suite: 'adre' },
            { t: 'Quitter la salle pour aller chercher un médecin', q: 0, v: { PAS: 70, PAD: 38 }, fb: 'Le médecin est là : on appelle des renforts sans quitter l’équipe.', suite: 'comp_retard2' }
          ] },
        comp_retard2: { heure: '08 h 30', v: { FC: 138, PAS: 66, PAD: 34, SpO2: 86 }, texte: '⚠️ Complication : l’anesthésiste est seul et n’a pas encore pu préparer l’adrénaline.', s: 'RCUK', indice: 'Ton aide est indispensable ici et maintenant.',
          choix: [
            { t: 'Revenir immédiatement, apporter le kit, préparer selon les instructions et appeler du renfort par téléphone', q: 2, v: { PAS: 80, PAD: 44 }, fb: 'Rattrapage : l’adrénaline est administrée, mais le choc a duré plus longtemps.', suite: 'adre_tard' },
            { t: 'Continuer à chercher quelqu’un dans les couloirs', q: 0, v: { FC: 0, PAS: null, PAD: null, SpO2: null }, fb: 'Le patient évolue vers l’arrêt cardiaque.', suite: 'fin_mauvaise' }
          ] },
        evt_chir: { evenement: true, heure: '08 h 27', texte: 'Imprévu : le chirurgien, impatient, demande s’il peut « au moins inciser ».', s: 'RCUK', indice: 'Le patient est-il stable ?',
          choix: [
            { t: 'Rappeler calmement que le patient est en choc et que l’anesthésiste décide de la suite', q: 2, v: {}, fb: 'La sécurité du patient prime : l’intervention attend.', suite: 'adre' },
            { t: 'Lui tendre le bistouri', q: 0, v: { PAS: 72, PAD: 40 }, fb: 'Commencer une chirurgie chez un patient en choc est dangereux.', suite: 'comp_retard2' }
          ] },
        adre: { heure: '08 h 30', v: { FC: 112, PAS: 96, PAD: 56, SpO2: 95 }, texte: 'L’adrénaline a été administrée selon le protocole, le remplissage est lancé. La PA remonte. Ensuite ?', s: 'RCUK', indice: 'L’enquête allergologique aura besoin de quoi ?',
          choix: [
            { t: 'Noter précisément les heures, les produits injectés avant la réaction et les traitements donnés', q: 2, v: {}, fb: 'Indispensable pour identifier le produit responsable.', suite: 'surv' },
            { t: 'Rien, l’anesthésiste s’en souviendra', q: 1, v: {}, fb: 'Dans l’urgence, personne ne retient tout.', suite: 'surv' },
            { t: 'Jeter les seringues vides pour faire de la place', q: 0, v: {}, fb: 'Les seringues et ampoules aident à identifier le produit : on les garde selon le protocole.', suite: 'surv' }
          ] },
        adre_tard: { heure: '08 h 40', v: { FC: 118, PAS: 88, PAD: 50, SpO2: 93 }, texte: 'Le patient se stabilise lentement après un choc prolongé. Que fais-tu ?', s: 'RCUK', indice: 'Traçabilité et surveillance.',
          choix: [
            { t: 'Tracer heures et produits, rester disponible pour l’anesthésiste et préparer un transfert en surveillance renforcée', q: 2, v: { PAS: 96, PAD: 56 }, fb: 'La suite se fera en surveillance rapprochée.', suite: 'fin_moyenne' },
            { t: 'Ranger la salle', q: 0, v: {}, fb: 'Le patient reste instable.', suite: 'fin_mauvaise' }
          ] },
        surv: { heure: '08 h 40', v: { FC: 104, PAS: 108, PAD: 64, SpO2: 97 }, texte: 'La situation se stabilise. Le chirurgien demande s’il peut commencer.', s: 'RCUK', indice: 'Une réaction peut-elle revenir ?',
          choix: [
            { t: 'Rappeler que la décision revient à l’équipe et que la surveillance reste prioritaire (réaction prolongée ou récidive possibles)', q: 2, v: {}, fb: 'L’intervention programmée est souvent reportée après une anaphylaxie.', suite: 'fin_bonne' },
            { t: 'Ne rien dire', q: 1, v: {}, fb: 'Ton avis compte : la sécurité est l’affaire de toute l’équipe.', suite: 'fin_moyenne' },
            { t: 'Dire oui, la PA est remontée', q: 0, v: { PAS: 92, PAD: 54 }, fb: 'Une stabilisation récente ne veut pas dire que le danger est passé.', suite: 'fin_moyenne' }
          ] },
        fin_bonne: { fin: true, issue: 'bonne', titre: 'Anaphylaxie maîtrisée', texte: 'M. S. est transféré en surveillance, stable. Une consultation d’allergologie est prévue grâce à la traçabilité précise.' },
        fin_moyenne: { fin: true, issue: 'moyenne', titre: 'Stabilisé, mais le choc a duré', texte: 'M. S. est stable, mais le traitement ou la surveillance ont été retardés.' },
        fin_mauvaise: { fin: true, issue: 'mauvaise', titre: 'Arrêt cardiaque au bloc', texte: 'Sans traitement rapide, le choc a mené à l’arrêt cardiaque. L’équipe réanime M. S. Rejoue : reconnaître, alerter, adrénaline.' }
      }
    },
    {
      id: 'bloc-hm', titre: 'Le CO₂ qui monte', difficulte: 3,
      varier: { FC: 6, PAS: 8, SpO2: 1, FR: 1, T: 0.2 },
      intro: 'Il est 10 h 40. Lucas T., 19 ans, est opéré d’une épaule sous anesthésie générale par gaz halogéné. Tout se passe bien depuis 30 minutes.',
      retenir: 'Hyperthermie maligne : penser à une hausse inexpliquée de l’EtCO₂, une tachycardie, une rigidité. La fièvre est souvent tardive. Alerter, arrêter le gaz halogéné, apporter le dantrolène et le matériel de refroidissement, chacun dans son rôle.',
      sbar: ['Lucas T., 19 ans, salle 3 : suspicion d’hyperthermie maligne pendant une chirurgie d’épaule', 'Anesthésie générale par gaz halogéné, aucun antécédent connu', 'EtCO₂ en hausse inexpliquée, tachycardie, rigidité, température en hausse ; dantrolène administré', 'Je demande un transfert en soins intensifs et l’orientation de la famille vers un centre de référence'],
      noeuds: {
        debut: { heure: '10 h 40', patient: 'Lucas T., 19 ans — épaule', v: { FC: 104, PAS: 132, PAD: 74, SpO2: 98, FR: 12, T: 37.2, GCS: 3 }, texte: 'L’anesthésiste remarque que le CO₂ expiré (EtCO₂) augmente sans explication malgré une ventilation correcte. La FC monte.', s: 'EMHG', indice: 'Quel est le signe le plus précoce de l’hyperthermie maligne ?',
          choix: [
            { t: 'Rester attentive, aider l’anesthésiste et signaler tout autre signe (rigidité, sueurs, chaleur)', q: 2, v: {}, fb: 'Une hausse inexpliquée de l’EtCO₂ est souvent le premier signe d’hyperthermie maligne.', suite: 'rigide' },
            { t: 'Considérer que c’est normal pendant une chirurgie', q: 0, v: { FC: 128, T: 38.0 }, fb: 'Une hausse inexpliquée de l’EtCO₂ ne doit jamais être banalisée.', suite: 'comp_tard' },
            { t: 'Aller en pause, ce n’est pas ton domaine', q: 0, v: { FC: 128, T: 38.0 }, fb: 'La circulante est indispensable en cas d’urgence.', suite: 'comp_tard' }
          ] },
        comp_tard: { heure: '10 h 55', v: { FC: 146, PAS: 150, PAD: 84, T: 39.0 }, texte: '⚠️ Complication : la température grimpe, les muscles sont raides, la FC s’emballe. L’anesthésiste appelle à l’aide.', s: 'EMHG', indice: 'Le seul traitement spécifique se trouve dans un kit…',
          choix: [
            { t: 'Courir chercher le kit d’hyperthermie maligne (dantrolène) et le matériel de refroidissement', q: 2, v: {}, fb: 'Rattrapage : le traitement arrive, avec du retard.', suite: 'dantro' },
            { t: 'Donner du paracétamol', q: 0, v: { T: 39.6, FC: 152 }, fb: 'La fièvre vient d’un emballement musculaire : le paracétamol n’agit pas.', suite: 'fin_mauvaise' }
          ] },
        rigide: { heure: '10 h 45', v: { FC: 132, PAS: 140, PAD: 78, T: 38.1 }, texte: 'Le chirurgien signale des muscles très raides. La température monte. L’anesthésiste annonce : « Suspicion d’hyperthermie maligne ! »', s: 'EMHG', indice: 'Kit, renforts, refroidissement.',
          choix: [
            { t: 'Appeler des renforts et apporter immédiatement le kit d’hyperthermie maligne (dantrolène) et le matériel de refroidissement', q: 2, v: {}, fb: 'Le dantrolène est le seul traitement spécifique ; sa préparation demande des bras.', suite: ['gaz', 'evt_famille'] },
            { t: 'Attendre de voir si la température continue à monter', q: 0, v: { T: 38.9, FC: 144 }, fb: 'La survie dépend de la rapidité.', suite: 'comp_tard' }
          ] },
        evt_famille: { evenement: true, heure: '10 h 46', texte: 'Imprévu : l’accueil du bloc appelle : la mère de Lucas est là et demande si « tout va bien ».', s: 'EMHG', indice: 'Qui informe la famille, et quand ?',
          choix: [
            { t: 'Demander à l’accueil de lui dire que l’équipe est occupée avec son fils et qu’un médecin viendra lui parler', q: 2, v: {}, fb: 'Pas d’abandon de poste ; l’information viendra du médecin.', suite: 'gaz' },
            { t: 'Aller lui expliquer toi-même la situation', q: 0, v: { T: 38.8 }, fb: 'Tu quittes la salle en pleine urgence.', suite: 'comp_tard' }
          ] },
        gaz: { heure: '10 h 47', texte: 'L’anesthésiste arrête le gaz halogéné. Pourquoi est-ce essentiel ?', s: 'EMHG', indice: 'Qu’est-ce qui déclenche la crise ?',
          choix: [
            { t: 'Parce que les halogénés (et la succinylcholine) déclenchent la crise chez les personnes prédisposées', q: 2, v: {}, fb: 'Supprimer le déclencheur est la première étape.', suite: 'dantro' },
            { t: 'Pour réveiller le patient tout de suite', q: 1, v: {}, fb: 'L’anesthésie est maintenue autrement ; le but est d’arrêter le déclencheur.', suite: 'dantro' },
            { t: 'Parce que le gaz est trop cher', q: 0, v: { T: 38.6 }, fb: 'Non : c’est le déclencheur de la crise.', suite: 'dantro' }
          ] },
        dantro: { heure: '10 h 50', v: { FC: 138, T: 38.9 }, texte: 'On te demande d’aider à préparer le dantrolène (dose calculée par l’anesthésiste selon le poids).', s: 'EMHG+CBIP', indice: 'Dose prescrite, double vérification, plusieurs flacons.',
          choix: [
            { t: 'Préparer selon les instructions du kit et de l’anesthésiste, avec double vérification ; demander de l’aide pour les nombreux flacons', q: 2, v: { FC: 118, T: 38.4 }, fb: 'La reconstitution est longue : c’est un travail d’équipe.', suite: 'froid' },
            { t: 'Laisser l’anesthésiste tout faire seul', q: 1, v: { T: 38.8 }, fb: 'Il a besoin d’aide.', suite: 'froid' },
            { t: 'Calculer toi-même une dose au hasard pour gagner du temps', q: 0, v: { FC: 140 }, fb: 'Jamais : la dose est prescrite et vérifiée.', suite: 'comp_dose' }
          ] },
        comp_dose: { heure: '10 h 55', texte: '⚠️ Complication : l’anesthésiste arrête ta préparation : la quantité ne correspond pas à sa prescription.', s: 'EMHG+CBIP', indice: 'Prescription + double vérification.',
          choix: [
            { t: 'Reprendre la préparation selon sa prescription, avec double vérification', q: 2, v: { FC: 124 }, fb: 'Rattrapage : l’erreur est interceptée, mais du temps a été perdu.', suite: 'froid' },
            { t: 'Insister pour utiliser ta préparation', q: 0, v: { FC: 146 }, fb: 'Erreur médicamenteuse grave.', suite: 'fin_mauvaise' }
          ] },
        froid: { heure: '11 h 05', v: { PAS: 124, PAD: 70 }, texte: 'Le dantrolène est administré. Quelles autres mesures peux-tu aider à mettre en place ?', s: 'EMHG', indice: 'Température, reins, électrolytes…',
          choix: [
            { t: 'Refroidissement selon prescription, surveillance de la température, de la diurèse et des prélèvements demandés', q: 2, v: { FC: 104, T: 37.8 }, fb: 'On traite l’hyperthermie et on surveille les complications (muscles, potassium, reins).', suite: 'fin_bonne' },
            { t: 'Ranger la salle', q: 1, v: {}, fb: 'Le patient reste instable : la surveillance prime.', suite: 'fin_moyenne' },
            { t: 'Couvrir le patient avec la couverture chauffante', q: 0, v: { T: 38.9 }, fb: 'Au contraire : il faut le refroidir.', suite: 'fin_moyenne' }
          ] },
        fin_bonne: { fin: true, issue: 'bonne', titre: 'Crise maîtrisée', texte: 'Lucas est stabilisé et transféré en soins intensifs. Reconnaissance précoce et dantrolène rapide ont fait la différence.' },
        fin_moyenne: { fin: true, issue: 'moyenne', titre: 'Stabilisé avec des complications', texte: 'Lucas est stabilisé, mais le retard a entraîné des complications (atteinte musculaire, reins à surveiller).' },
        fin_mauvaise: { fin: true, issue: 'mauvaise', titre: 'Crise non contrôlée', texte: 'La crise s’est aggravée. Rejoue : EtCO₂ qui monte = pense à l’hyperthermie maligne, alerte, dantrolène.' }
      }
    },
    {
      id: 'bloc-sspi', titre: 'SSPI : quatre réveils en même temps', difficulte: 2,
      varier: { FC: 6, PAS: 8, SpO2: 1, FR: 2, T: 0.2 },
      intro: 'Il est 11 h. En salle de réveil, tu surveilles avec ton infirmière 4 patients arrivés en 20 minutes.',
      retenir: 'En SSPI : voies aériennes et respiration d’abord, puis circulation (saignement), puis douleur, nausées, température et miction. Le score d’Aldrete ne mesure ni la douleur ni les nausées.',
      sbar: ['Mme W., 67 ans, prothèse de genou : saignement important au pansement avec PA basse', 'Anesthésie générale, sous anticoagulant préventif, redon déjà productif', 'Je suspecte une hémorragie post-opératoire', 'Je demande que le chirurgien vienne l’examiner maintenant'],
      noeuds: {
        debut: { heure: '11 h 00', patient: 'M. V. — chirurgie abdominale', v: { FC: 88, PAS: 128, PAD: 72, SpO2: 88, FR: 8, T: 36.1, GCS: 13 }, texte: 'M. V. ronfle bruyamment, sa saturation baisse. Mme W. (genou) se plaint de son pansement. Mme X. vomit. M. Y. (rachianesthésie) demande à uriner.', s: 'PERIOP', indice: 'A avant tout.',
          choix: [
            { t: 'M. V. d’abord : libérer les voies aériennes (subluxation de la mâchoire), O₂, stimuler et alerter l’anesthésiste', q: 2, v: { SpO2: 96, FR: 12 }, fb: 'Ronflement + désaturation = obstruction des voies aériennes supérieures.', suite: 'mme_w' },
            { t: 'Mme X. d’abord, elle vomit', q: 1, v: { SpO2: 85 }, fb: 'Les vomissements sont à gérer vite, mais une obstruction avec désaturation est plus urgente.', suite: 'mme_w' },
            { t: 'Accompagner M. Y. aux toilettes', q: 0, v: { SpO2: 80, FC: 104 }, fb: 'Il ne peut pas se lever seul, et M. V. désature.', suite: 'comp_obstr' }
          ] },
        comp_obstr: { heure: '11 h 04', v: { SpO2: 78, FC: 112 }, texte: '⚠️ Complication : à ton retour, M. V. est cyanosé et ne ronfle plus.', s: 'PERIOP', indice: 'Plus de bruit ne veut pas dire mieux…',
          choix: [
            { t: 'Libérer les voies aériennes, O₂, appel immédiat de l’anesthésiste', q: 2, v: { SpO2: 92, FC: 96 }, fb: 'Rattrapage : l’obstruction complète est levée de justesse.', suite: 'mme_w' },
            { t: 'Le laisser dormir, il est calme', q: 0, v: { SpO2: 70, FC: 50 }, fb: 'L’absence de bruit signait une obstruction complète.', suite: 'fin_mauvaise' }
          ] },
        mme_w: { heure: '11 h 08', patient: 'Mme W., 67 ans — prothèse de genou', v: { FC: 118, PAS: 92, PAD: 54, SpO2: 96, FR: 20, T: 36.2, GCS: 15 }, texte: 'Le pansement de Mme W. est saturé de sang et le redon s’est rempli vite. Elle est tachycarde et sa PA a baissé.', s: 'PERIOP', indice: 'C de l’ABCDE.',
          choix: [
            { t: 'Prévenir immédiatement l’anesthésiste/le chirurgien (SBAR), surveiller PA/FC rapprochées et ne pas refaire le pansement seule', q: 2, v: { FC: 108, PAS: 102, PAD: 60 }, fb: 'Tachycardie + hypotension + saignement = hémorragie possible.', suite: ['nvpo', 'evt_unite'] },
            { t: 'Renforcer le pansement et attendre', q: 1, v: {}, fb: 'L’alerte est prioritaire.', suite: 'nvpo' },
            { t: 'Donner un antalgique car elle a mal', q: 0, v: { FC: 128, PAS: 84, PAD: 48 }, fb: 'L’hémorragie possible passe d’abord.', suite: 'comp_hemo' }
          ] },
        comp_hemo: { heure: '11 h 20', v: { FC: 132, PAS: 80, PAD: 44 }, texte: '⚠️ Complication : Mme W. est pâle, en sueur, la PA continue de baisser.', s: 'PERIOP', indice: 'Choc hémorragique : qui appeler ?',
          choix: [
            { t: 'Appel urgent du chirurgien et de l’anesthésiste, surveillance continue', q: 2, v: { FC: 116, PAS: 94, PAD: 54 }, fb: 'Rattrapage : la reprise chirurgicale est organisée.', suite: 'nvpo' },
            { t: 'Attendre la fin de l’antalgique', q: 0, v: { FC: 140, PAS: 70, PAD: 40 }, fb: 'Le choc s’aggrave.', suite: 'fin_mauvaise' }
          ] },
        evt_unite: { evenement: true, heure: '11 h 15', texte: 'Imprévu : l’unité d’orthopédie appelle pour savoir si elle peut venir chercher « la patiente du genou ».', s: 'ALD+PERIOP', indice: 'Mme W. est-elle prête à partir ?',
          choix: [
            { t: 'Répondre que non : elle est en cours d’évaluation pour un saignement', q: 2, v: {}, fb: 'Un patient instable ne quitte pas la SSPI.', suite: 'nvpo' },
            { t: 'Dire oui pour libérer une place', q: 0, v: {}, fb: 'Transférer une patiente qui saigne est dangereux.', suite: 'comp_hemo' }
          ] },
        nvpo: { heure: '11 h 25', patient: 'Mme X., 34 ans — cholécystectomie', v: { FC: 92, PAS: 118, PAD: 70, SpO2: 97, FR: 16, T: 36.4, GCS: 15 }, texte: 'Mme X., non-fumeuse, connue pour le mal des transports, vomit pour la deuxième fois.', s: 'APFEL', indice: 'Combien de facteurs d’Apfel a-t-elle ?',
          choix: [
            { t: 'La positionner sur le côté ou assise, aspirer si besoin, prévenir l’anesthésiste pour un antiémétique selon prescription', q: 2, v: {}, fb: 'Score d’Apfel élevé : on protège les voies aériennes et on traite selon prescription.', suite: 'globe' },
            { t: 'Lui dire que c’est normal et attendre', q: 1, v: {}, fb: 'Les NVPO se traitent.', suite: 'globe' },
            { t: 'Lui donner à boire pour rincer', q: 0, v: { SpO2: 93 }, fb: 'Boire augmente les nausées et le risque de fausse route.', suite: 'globe' }
          ] },
        globe: { heure: '11 h 40', patient: 'M. Y., 71 ans — rachianesthésie', v: { FC: 84, PAS: 146, PAD: 82, SpO2: 97, FR: 16, T: 36.0, GCS: 15 }, texte: 'M. Y. n’arrive pas à uriner, il a mal au bas-ventre. Le bladder scan montre un volume important.', s: 'RAU', indice: 'Le seuil de sondage est défini par…',
          choix: [
            { t: 'Signaler la rétention et appliquer le protocole du service (sondage évacuateur selon le seuil prévu)', q: 2, v: { FC: 78, PAS: 134, PAD: 76 }, fb: 'La rachianesthésie favorise la rétention ; on suit le protocole local.', suite: 'temp' },
            { t: 'Le faire lever pour aller aux toilettes', q: 0, v: {}, fb: 'Risque de chute tant que le bloc moteur n’a pas disparu.', suite: 'temp' },
            { t: 'Lui donner beaucoup à boire', q: 1, v: { FC: 90 }, fb: 'La vessie est déjà pleine.', suite: 'temp' }
          ] },
        temp: { heure: '12 h 00', v: { T: 35.6 }, texte: 'Avant le transfert, tu remarques que M. Y. a moins de 36 °C et frissonne. Son Aldrete est à 9.', s: 'NICEH+ALD', indice: 'NICE : pas de transfert sous…',
          choix: [
            { t: 'Le réchauffer (air pulsé) et attendre ≥ 36 °C avant le transfert', q: 2, v: { T: 36.2 }, fb: 'NICE : pas de transfert si la température est < 36 °C.', suite: 'fin_bonne' },
            { t: 'Lui donner une couverture et le transférer', q: 1, v: {}, fb: 'Réchauffement actif recommandé.', suite: 'fin_moyenne' },
            { t: 'Le transférer, son Aldrete est bon', q: 0, v: { T: 35.4 }, fb: 'L’Aldrete ne prend pas en compte la température.', suite: 'fin_moyenne' }
          ] },
        fin_bonne: { fin: true, issue: 'bonne', titre: 'SSPI sous contrôle', texte: 'Chaque patient a été vu dans le bon ordre : voies aériennes, saignement, nausées, rétention et température.' },
        fin_moyenne: { fin: true, issue: 'moyenne', titre: 'Tout le monde va bien… presque', texte: 'Les patients sont stables, mais une surveillance (température, nausées, saignement) a été négligée.' },
        fin_mauvaise: { fin: true, issue: 'mauvaise', titre: 'Événement grave en SSPI', texte: 'Une obstruction ou une hémorragie n’a pas été prise en charge à temps. Rejoue : A, B, C d’abord.' }
      }
    }
  ],
  situations: [
    { patient: 'Salle 2 — instrumentiste habillée', texte: 'Une compresse imbibée tombe du champ opératoire sur le sol.', s: 'OMS+PERIOP', stage: 'Une compresse tombée reste dans le comptage : on ne la jette jamais.',
      choix: [{ t: 'La circulante la ramasse avec une pince/gant, la montre à l’instrumentiste et la garde à part pour le comptage', q: 2, fb: 'Elle n’est plus stérile, mais elle doit rester comptabilisée jusqu’au comptage final.' }, { t: 'La jeter à la poubelle', q: 0, fb: 'Le comptage final serait faux : on la chercherait dans le patient !' }, { t: 'La remettre sur la table stérile', q: 0, fb: 'Elle est contaminée.' }] },
    { patient: 'Salle 4 — intervention en cours', texte: 'L’instrumentiste remarque un petit trou dans son gant pendant l’intervention.', s: 'AORN', stage: 'Le double gantage permet de repérer plus facilement une perforation.',
      choix: [{ t: 'Le signaler et changer de gant (selon la technique du service), en s’éloignant brièvement du champ', q: 2, fb: 'Un gant perforé n’est plus une barrière : on le change sans attendre.' }, { t: 'Continuer jusqu’à la fin', q: 0, fb: 'Risque de contamination du patient et d’exposition au sang pour l’instrumentiste.' }, { t: 'Mettre un pansement sur le trou', q: 0, fb: 'Le gant n’est plus stérile.' }] },
    { patient: 'M. Z., 66 ans — accueil au bloc', texte: 'À l’accueil, M. Z. te dit : « On opère bien mon genou gauche ? » Le planning indique genou droit.', s: 'OMS', stage: 'Le patient est un partenaire de sa sécurité : sa remarque est une alerte.',
      choix: [{ t: 'Arrêter le processus et vérifier avec l’équipe : dossier, consentement, marquage, imagerie', q: 2, fb: 'C’est exactement l’erreur que la check-list vise à éviter.' }, { t: 'Le rassurer : « Le planning ne se trompe jamais »', q: 0, fb: 'Les plannings se trompent parfois. On vérifie.' }, { t: 'Le noter pour plus tard', q: 0, fb: 'Plus tard, il sera endormi.' }] },
    { patient: 'Mme A., 50 ans — jeûne', texte: 'Juste avant l’induction, Mme A. te dit avoir bu un café au lait il y a 2 heures.', s: 'JEUN', stage: 'Reformule toujours la question du jeûne : « Qu’avez-vous mangé et bu, et à quelle heure ? »',
      choix: [{ t: 'Le signaler immédiatement à l’anesthésiste avant l’induction', q: 2, fb: 'Le lait n’est pas un liquide clair : c’est à l’anesthésiste de décider (report, technique adaptée).' }, { t: 'Ne rien dire, ce n’est qu’un café', q: 0, fb: 'Risque d’inhalation à l’induction.' }, { t: 'La faire vomir', q: 0, fb: 'Jamais : c’est dangereux et inutile.' }] },
    { patient: 'Salle 1 — patient endormi', texte: 'En cours d’intervention, tu vois que le bras du patient a glissé de l’appui-bras et pend dans le vide.', s: 'PERIOP', stage: 'Vérifie les points d’appui après chaque mouvement de table.',
      choix: [{ t: 'Le signaler et le repositionner avec l’anesthésiste, sans toucher au champ stérile', q: 2, fb: 'Un bras qui pend étire le plexus brachial : risque de paralysie au réveil.' }, { t: 'Attendre la fin de l’intervention', q: 0, fb: 'La compression ou l’étirement dure toute l’intervention.' }, { t: 'Le remettre seule en passant sous les champs', q: 1, fb: 'Bonne intention, mais on coordonne avec l’anesthésiste et on respecte le stérile.' }] },
    { patient: 'Sortie de salle', texte: 'Au moment du sign out, tu trouves un pot de prélèvement sans étiquette.', s: 'OMS', stage: 'Étiquette les prélèvements en salle, au moment où ils sont faits.',
      choix: [{ t: 'Ne pas laisser sortir le pot : vérifier avec le chirurgien ce qu’il contient et l’étiqueter avant la sortie', q: 2, fb: 'Un prélèvement non identifié est inexploitable et peut être perdu ou attribué au mauvais patient.' }, { t: 'Deviner et l’étiqueter seule', q: 0, fb: 'Une erreur d’étiquetage peut avoir des conséquences graves.' }, { t: 'L’envoyer tel quel', q: 0, fb: 'Le labo ne pourra pas l’attribuer.' }] },
    { patient: 'Arsenal', texte: 'Tu vas ouvrir un set d’instruments : la date de péremption est dépassée de 3 jours.', s: 'CSS', stage: 'Contrôle : intégrité, sécheresse, date, indicateur. Un seul défaut = pas d’ouverture.',
      choix: [{ t: 'Ne pas l’utiliser, en prendre un autre et signaler pour retraitement', q: 2, fb: 'La stérilité n’est plus garantie.' }, { t: 'L’utiliser, 3 jours ce n’est rien', q: 0, fb: 'La règle ne se négocie pas.' }, { t: 'Le désinfecter à l’alcool', q: 0, fb: 'L’alcool ne rend pas un instrument stérile.' }] },
    { patient: 'M. B., 40 ans — allergie au latex', texte: 'Le dossier indique « allergie au latex ». La salle a été préparée comme d’habitude.', s: 'PERIOP', stage: 'Connais la procédure « patient allergique au latex » du bloc (salle, matériel, programmation).',
      choix: [{ t: 'Le signaler à l’équipe et vérifier que la salle et le matériel sont sans latex selon la procédure', q: 2, fb: 'Le latex est une cause classique d’anaphylaxie au bloc.' }, { t: 'Mettre simplement des gants sans latex', q: 1, fb: 'Les gants comptent, mais d’autres dispositifs peuvent contenir du latex.' }, { t: 'Ne rien changer', q: 0, fb: 'Risque d’anaphylaxie.' }] },
    { patient: 'SSPI — Mme C., 72 ans', v: { FC: 76, PAS: 132, PAD: 74, SpO2: 96, FR: 14, T: 35.4, GCS: 15 }, texte: 'Mme C. tremble et dit avoir très froid. Température 35,4 °C.', s: 'NICEH', stage: 'Note la température à l’arrivée en SSPI puis régulièrement.',
      choix: [{ t: 'Réchauffement actif par air pulsé et contrôle régulier de la température', q: 2, fb: 'Hypothermie < 36 °C : réchauffement actif (NICE).' }, { t: 'Une couverture en coton suffit', q: 1, fb: 'C’est insuffisant pour une hypothermie.' }, { t: 'La transférer en chambre où il fait plus chaud', q: 0, fb: 'Pas de transfert sous 36 °C.' }] },
    { patient: 'Installation — bistouri électrique', texte: 'En vérifiant l’installation, tu vois que la plaque neutre est à moitié décollée.', s: 'PERIOP', stage: 'Vérifie la plaque après chaque changement de position.',
      choix: [{ t: 'Prévenir et remplacer la plaque (nouvelle plaque, zone adaptée) avant l’utilisation du bistouri', q: 2, fb: 'Un mauvais contact concentre le courant : brûlure au niveau de la plaque.' }, { t: 'La recoller avec du sparadrap', q: 0, fb: 'Le contact reste mauvais.' }, { t: 'Ne rien dire', q: 0, fb: 'Risque de brûlure.' }] },
    { patient: 'Salle 3 — friction chirurgicale', texte: 'Une étudiante entre en salle après sa friction chirurgicale, les mains encore mouillées de produit.', s: 'CSS', stage: 'La friction se poursuit jusqu’au séchage complet, sans essuyage.',
      choix: [{ t: 'Lui rappeler que la friction doit aller jusqu’au séchage complet avant l’habillage', q: 2, fb: 'Le produit agit pendant qu’il s’évapore : des mains mouillées ne sont pas prêtes.' }, { t: 'Lui tendre une serviette non stérile', q: 0, fb: 'Elle contaminerait ses mains.' }, { t: 'Ne rien dire', q: 1, fb: 'Mieux vaut le signaler gentiment.' }] },
    { patient: 'SSPI — M. D., 58 ans', v: { FC: 64, PAS: 102, PAD: 60, SpO2: 92, FR: 8, T: 36.3, GCS: 13 }, texte: 'M. D., sous morphinique, est très somnolent, respire 8 fois par minute.', s: 'PERIOP', stage: 'Surveille sédation et fréquence respiratoire chez tout patient sous opioïdes.',
      choix: [{ t: 'Le stimuler, O₂ et appeler l’anesthésiste (dépression respiratoire liée aux opioïdes ?)', q: 2, fb: 'FR basse + somnolence sous opioïdes : risque de dépression respiratoire.' }, { t: 'Le laisser dormir, il est fatigué', q: 0, fb: 'Une FR à 8 est anormale.' }, { t: 'Lui redonner un antalgique', q: 0, fb: 'Cela aggraverait la dépression respiratoire.' }] },
    { patient: 'Salle 5 — patient endormi', v: { FC: 132, PAS: 76, PAD: 40, SpO2: 90, FR: 14, T: 36.4, GCS: 3 }, texte: 'Juste après l’injection de l’antibiotique : éruption rouge sur le thorax, PA effondrée, ventilation difficile.', s: 'RCUK', stage: 'Sache où se trouve le kit d’anaphylaxie de ton bloc.',
      choix: [{ t: 'Annoncer la suspicion d’anaphylaxie, arrêter le produit, appel à l’aide, préparer l’adrénaline selon le protocole', q: 2, fb: 'Reconnaître vite et traiter par adrénaline.' }, { t: 'Donner un antihistaminique et attendre', q: 0, fb: 'L’adrénaline est le traitement de première ligne.' }, { t: 'Laisser commencer l’intervention', q: 0, fb: 'Le patient est en choc.' }] },
    { patient: 'Salle 3 — anesthésie aux halogénés', v: { FC: 128, PAS: 138, PAD: 78, SpO2: 97, FR: 12, T: 37.9, GCS: 3 }, texte: 'L’EtCO₂ monte sans explication, la FC grimpe et la mâchoire est rigide.', s: 'EMHG', stage: 'Connais l’emplacement du kit d’hyperthermie maligne.',
      choix: [{ t: 'Alerter : suspicion d’hyperthermie maligne, apporter le kit de dantrolène et le matériel de refroidissement', q: 2, fb: 'Reconnaissance précoce = survie.' }, { t: 'Attendre la fièvre pour être sûre', q: 0, fb: 'La fièvre est souvent tardive.' }, { t: 'Donner du paracétamol', q: 0, fb: 'Aucun effet sur la cause.' }] },
    { patient: 'Arsenal — préparation', texte: 'Tu vas ouvrir un set : l’indicateur de stérilisation n’a pas changé de couleur.', s: 'CSS', stage: 'Vérifie l’indicateur à chaque ouverture.',
      choix: [{ t: 'Ne pas l’utiliser, prendre un autre set et signaler pour retraitement', q: 2, fb: 'Indicateur non viré : stérilité non garantie.' }, { t: 'L’utiliser, la date est bonne', q: 0, fb: 'Tous les contrôles doivent être conformes.' }, { t: 'Le passer à l’alcool', q: 0, fb: 'L’alcool ne stérilise pas.' }] },
    { patient: 'Salle 2 — patiente en Trendelenburg', v: { FC: 84, PAS: 134, PAD: 76, SpO2: 92, FR: 14, T: 36.5, GCS: 3 }, texte: 'Patiente inclinée tête en bas depuis 2 heures. Tu remarques qu’elle a glissé vers le haut de la table et que sa saturation baisse.', s: 'PERIOP', stage: 'Le maintien du patient sur la table se vérifie avant toute inclinaison.',
      choix: [{ t: 'Le signaler à l’anesthésiste et au chirurgien pour réévaluer la position et la sécurisation', q: 2, fb: 'Le Trendelenburg gêne la respiration et peut faire glisser le patient.' }, { t: 'Ne rien dire', q: 0, fb: 'Risque de chute ou de compression.' }, { t: 'Remettre la table à plat seule', q: 0, fb: 'Toute modification se décide avec l’équipe.' }] },
    { patient: 'SSPI — M. E., 62 ans, rachianesthésie', v: { FC: 58, PAS: 86, PAD: 48, SpO2: 97, FR: 14, T: 36.2, GCS: 15 }, texte: 'Après une rachianesthésie, M. E. se plaint de nausées et sa PA baisse.', s: 'PERIOP', stage: 'La rachianesthésie peut provoquer une hypotension : PA rapprochée.',
      choix: [{ t: 'Prévenir l’anesthésiste, surveiller la PA de près, position adaptée selon ses consignes', q: 2, fb: 'Nausées + hypotension après rachianesthésie : à signaler rapidement.' }, { t: 'Le faire asseoir au bord du lit', q: 0, fb: 'Risque de malaise et de chute.' }, { t: 'Lui donner à manger', q: 0, fb: 'Pas le moment.' }] },
    { patient: 'Salle 4 — fin d’intervention', texte: 'L’alcool de la préparation cutanée n’a pas encore séché et le chirurgien saisit le bistouri électrique.', s: 'NICEI+PERIOP', stage: 'Laisse sécher complètement la préparation alcoolique.',
      choix: [{ t: 'Signaler que la préparation n’est pas sèche (risque de feu) et attendre le séchage', q: 2, fb: 'Les vapeurs d’alcool sont inflammables.' }, { t: 'Le laisser faire', q: 0, fb: 'Risque de brûlure par incendie.' }, { t: 'Éponger avec une compresse non stérile', q: 0, fb: 'Contamination du champ.' }] },
    { patient: 'Accueil du bloc — Mme F., 74 ans', texte: 'Mme F. porte encore ses bijoux, ses lunettes et son appareil dentaire.', s: 'PERIOP+OMS', stage: 'La préparation pré-opératoire se vérifie à l’accueil.',
      choix: [{ t: 'Vérifier avec elle la procédure du service (retrait des bijoux, prothèses selon consignes de l’anesthésiste) et tracer', q: 2, fb: 'Bijoux et prothèses peuvent gêner l’intubation, provoquer des brûlures ou se perdre.' }, { t: 'Laisser tout, ce n’est pas important', q: 0, fb: 'Risques réels pour la patiente.' }, { t: 'Retirer tout sans lui expliquer', q: 1, fb: 'On explique et on trace.' }] },
    { patient: 'SSPI — M. G., 45 ans', v: { FC: 104, PAS: 148, PAD: 86, SpO2: 97, FR: 20, T: 36.6, GCS: 15 }, texte: 'M. G. est agité, il dit avoir très mal (8/10) au niveau de la cicatrice.', s: 'PERIOP', stage: 'Évalue la douleur avec une échelle et réévalue après l’antalgique.',
      choix: [{ t: 'Évaluer la douleur avec une échelle et prévenir pour l’antalgie prescrite, puis réévaluer', q: 2, fb: 'Une douleur non soulagée augmente la FC, la PA et l’agitation.' }, { t: 'Lui dire que c’est normal', q: 0, fb: 'La douleur se traite.' }, { t: 'Lui donner un somnifère', q: 0, fb: 'Pas adapté et non prescrit.' }] }
  ],
  prio: [
    { titre: 'La SSPI déborde', intro: 'Quatre patients, une seule paire de mains (la tienne) pendant 2 minutes.', s: 'PERIOP',
      patients: [['M. E. ronfle, tirage, SpO₂ 87 %', 'A : obstruction des voies aériennes.'], ['Mme F. : PA 85/50, FC 122, pansement abdominal qui se teinte', 'C : hémorragie possible.'], ['M. G. : douleur 8/10', 'Douleur intense à traiter vite, mais pas de menace vitale immédiate.'], ['Mme H. : demande quand elle pourra manger', 'Information de confort, en dernier.']] },
    { titre: 'Avant l’induction', intro: 'Tu prépares la salle 2. Quatre points à régler.', s: 'OMS',
      patients: [['Le patient dit être allergique à la pénicilline, non noté dans le dossier', 'L’antibioprophylaxie est imminente : à signaler en premier.'], ['Le site opératoire n’est pas marqué', 'Doit être réglé avant l’induction (check-list).'], ['La couverture à air pulsé n’est pas encore branchée', 'Important pour prévenir l’hypothermie, à faire rapidement.'], ['La poubelle de la salle est pleine', 'Logistique, en dernier.']] },
    { titre: 'Urgences en même temps au bloc', intro: 'Tu es circulante. Quatre choses arrivent dans la même minute.', s: 'RCUK+OMS+PERIOP',
      patients: [['Le patient de ta salle fait une chute de PA avec éruption après l’antibiotique', 'Anaphylaxie : urgence vitale.'], ['Le comptage est faux juste avant la fermeture', 'Il faut arrêter la fermeture.'], ['L’instrumentiste demande un fil supplémentaire', 'À faire rapidement, mais sans urgence vitale.'], ['Le planning de l’après-midi doit être imprimé', 'Administratif, en dernier.']] },
    { titre: 'Accueil au bloc : 4 patients', intro: 'Quatre patients attendent à l’accueil du bloc.', s: 'OMS+JEUN',
      patients: [['Un patient dit qu’on va l’opérer du « mauvais genou »', 'Erreur de côté possible : vérification immédiate.'], ['Une patiente a bu un café au lait il y a 2 heures', 'À signaler à l’anesthésiste avant l’induction.'], ['Un patient porte encore ses bijoux', 'À régler avant d’entrer en salle.'], ['Un patient demande quand il pourra rentrer chez lui', 'Information, en dernier.']] }
  ],
  mots: [
    ['ASEPSIE', 'Ensemble des mesures qui empêchent les germes d’atteindre le champ opératoire', 'Elle ne se négocie pas : une faute se signale toujours.'],
    ['INSTRUMENTISTE', 'Infirmier(ère) en stérile qui sert les instruments au chirurgien', 'Garant(e) du champ stérile avec le reste de l’équipe.'],
    ['CIRCULANTE', 'Infirmière hors stérile qui ouvre le matériel et assure la traçabilité', 'Le lien entre la zone stérile et le reste de la salle.'],
    ['COMPRESSE', 'Elle est radio-opaque et doit être comptée avant la fermeture', 'Un corps étranger oublié est un événement grave évitable.'],
    ['HYPOTHERMIE', 'Température centrale inférieure à 36 °C', 'Elle augmente saignements et infections.'],
    ['ALDRETE', 'Score de réveil sur 10 points', 'Sortie de SSPI habituellement à partir de 9/10, selon protocole.'],
    ['DANTROLENE', 'Seul traitement spécifique de l’hyperthermie maligne', 'Il doit être disponible là où l’on utilise des halogénés.'],
    ['ANAPHYLAXIE', 'Réaction allergique grave, avec atteinte respiratoire et/ou circulatoire', 'Traitement de première ligne : l’adrénaline.'],
    ['CURARE', 'Médicament qui relâche les muscles pendant l’anesthésie', 'Cause fréquente d’anaphylaxie au bloc.'],
    ['INDUCTION', 'Phase où le patient est endormi', 'Moment à risque pour les voies aériennes.'],
    ['TONDEUSE', 'Seul outil recommandé si une dépilation est nécessaire', 'Le rasoir augmente les infections (NICE).'],
    ['PLEXUS', 'Réseau de nerfs de l’épaule, abîmé si le bras dépasse 90° d’abduction', 'Le patient endormi ne peut pas signaler l’étirement.'],
    ['TRENDELENBURG', 'Position tête plus basse que les pieds', 'Gêne respiratoire et glissement à surveiller.'],
    ['BIPOLAIRE', 'Bistouri dont le courant passe entre les deux mors de la pince', 'Pas de plaque neutre nécessaire.'],
    ['ADRENALINE', 'Traitement de première ligne de l’anaphylaxie', 'Voie intramusculaire en première intention.']
  ],
  ordre: [
    { titre: 'Conduite en cas de comptage faux', etapes: ['Annoncer la discordance à toute l’équipe', 'Le chirurgien suspend la fermeture', 'Recompter et rechercher (champ, sol, poubelles, plaie)', 'Si non retrouvé : radiographie selon protocole', 'Tracer l’événement dans le dossier et déclarer selon la procédure'], pourquoi: 'On ne ferme pas sur un comptage faux sans recherche.', s: 'OMS+PERIOP' },
    { titre: 'Réaction anaphylactique au bloc (rôle d’équipe)', etapes: ['Reconnaître et annoncer la suspicion', 'Appeler à l’aide', 'Arrêter le produit suspect', 'Adrénaline selon le protocole (anesthésiste)', 'O₂ et remplissage', 'Noter heures et produits, prélèvements selon protocole'], pourquoi: 'L’adrénaline est le traitement de première ligne ; la traçabilité sert à l’enquête allergologique.', s: 'RCUK' }
  ],
  tri: [
    { titre: 'Liquide clair ou non ? (jeûne)', cats: ['Liquide clair', 'Pas un liquide clair'], items: [['Eau', 0], ['Café noir sans lait', 0], ['Café au lait', 1, 'Le lait se comporte comme un aliment.'], ['Jus de pomme sans pulpe', 0], ['Jus d’orange avec pulpe', 1], ['Thé sans lait', 0], ['Soupe', 1]] },
    { titre: 'Signe d’hyperthermie maligne ou non ?', cats: ['Évoque une hyperthermie maligne', 'N’en fait pas partie'], items: [['Hausse inexpliquée de l’EtCO₂', 0], ['Tachycardie', 0], ['Rigidité musculaire', 0], ['Bradycardie isolée', 1], ['Hyperthermie (souvent tardive)', 0], ['Éruption urticarienne', 1, 'Plutôt une anaphylaxie.']] }
  ],
  associe: [
    { titre: 'Urgences au bloc', s: 'RCUK+EMHG+PERIOP', paires: [['Anaphylaxie', 'Adrénaline'], ['Hyperthermie maligne', 'Dantrolène'], ['Hypothermie', 'Air pulsé'], ['Obstruction en SSPI', 'Subluxation de la mâchoire'], ['Comptage faux', 'Radiographie'], ['Allergie au latex', 'Salle sans latex']] }
  ],
  erreur: [
    { titre: 'SSPI, 12 h', scene: 'Tu observes les soins en salle de réveil. Repère les erreurs.', s: 'NICEH+ALD+PERIOP', items: [['Un patient à 35,5 °C part en unité car son Aldrete est à 10', true, 'Pas de transfert sous 36 °C.'], ['La SpO₂ de chaque patient est surveillée en continu', false], ['Une patiente qui vomit reste à plat sur le dos', true, 'Position latérale ou assise pour éviter l’inhalation.'], ['La douleur est évaluée avec une échelle', false], ['Un patient sous rachianesthésie est levé alors qu’il ne sent pas encore ses jambes', true, 'Risque de chute : lever selon la levée du bloc et le protocole.']] }
  ]
};
