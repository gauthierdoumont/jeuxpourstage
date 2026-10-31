/* Étage 4 — Jugement clinique (transversal). Créé par Gauthier Doumont
 * Hypothèse : stage évaluant le raisonnement clinique (Tanner/Lasater, démarche de soins, priorisation, SBAR).
 * Même format que data/soins-intensifs.js — ajouter les nouvelles cartes à la fin. */
window.ETAGES = window.ETAGES || [];
window.ETAGES.push({
  id: 'jugement', num: 4, titre: 'Le Sommet', emoji: '🧭', couleur: '#F18F01',
  service: 'Jugement clinique', lieu: 'Lieu à préciser',
  stage: { debut: '2027-05-03', fin: '2027-05-23' },
  accroche: 'Au sommet, tout se mélange : réa, bloc, neuro… Ici on t’entraîne à penser comme une infirmière : remarquer, interpréter, répondre, réfléchir.',
  boss: 'La garde aux 6 patients',
  themes: {
    tanner: 'Modèle de Tanner & Lasater', demarche: 'Démarche de soins', modeles: 'Modèles de recueil',
    prio: 'Priorisation', news: 'Détection de la dégradation (NEWS2)', comm: 'Communication & SBAR',
    medic: 'Sécurité médicamenteuse', legal: 'Cadre légal belge', reflex: 'Réflexivité & biais'
  },
  sources: {
    TAN: 'Tanner C.A. — Thinking like a nurse: a research-based model of clinical judgment, J Nurs Educ 2006 🟡',
    LAS: 'Lasater K. — Clinical judgment development: using simulation to create a rubric, J Nurs Educ 2007 ; validation BMC Nursing 2025 🟡',
    NEWS: 'Royal College of Physicians — National Early Warning Score (NEWS) 2, 2017 🟢',
    SSC: 'Surviving Sepsis Campaign — International Guidelines 2026 🟢',
    NANDA: 'NANDA International — Diagnostics infirmiers : définitions et classification 🟡',
    HEND: 'V. Henderson — Principes fondamentaux des soins infirmiers (CII) 🟠',
    GORD: 'M. Gordon — Modes fonctionnels de santé 🟠',
    SBAR: 'SBAR — OMS, Patient Safety Solutions (2007) ; Haute Autorité de Santé 2014 🟡',
    LEGAL: 'Loi coordonnée du 10 mai 2015 relative à l’exercice des professions des soins de santé ; AR du 18 juin 1990 🟢',
    MED: 'Sécurité médicamenteuse : règle des « B », double vérification (consensus) ; CBIP 🟡',
    GIBBS: 'Gibbs G. — Learning by Doing (cycle réflexif), 1988 🟠',
    RAIS: 'Raisonnement clinique et biais cognitifs (consensus d’enseignement) 🟠'
  },
  cartes: [
    ['tanner', 'Les 4 étapes du modèle de jugement clinique de Tanner ?', 'Remarquer (noticing) → Interpréter → Répondre (responding) → Réfléchir (reflecting)', 'C’est la façon dont une infirmière experte « pense » une situation : percevoir, comprendre, agir, apprendre.', 'TAN'],
    ['tanner', 'Selon Tanner, qu’est-ce qui influence ce qu’une infirmière « remarque » ?', 'Ses connaissances, son expérience, sa relation avec le patient, ses valeurs et le contexte de l’unité', 'On remarque mieux ce qui change quand on connaît le patient et sa situation habituelle.', 'TAN'],
    ['tanner', 'Les 3 types de raisonnement décrits par Tanner ?', 'Analytique (pas à pas), intuitif (reconnaissance rapide de patterns), narratif (comprendre l’histoire du patient)', 'Les novices raisonnent surtout de façon analytique ; l’intuition se construit avec l’expérience.', 'TAN'],
    ['tanner', 'Combien de dimensions compte la grille de Lasater ?', '11 dimensions réparties dans les 4 étapes de Tanner, chacune sur 4 niveaux (débutant → exemplaire)', 'Elle permet de s’auto-évaluer et de cibler ce qui reste à travailler.', 'LAS'],
    ['tanner', 'Dimensions de « Remarquer » (Lasater) ?', 'Observation ciblée, reconnaissance des écarts par rapport à l’attendu, recherche d’informations', 'Il faut savoir quoi regarder, ce qui n’est pas normal, et aller chercher ce qui manque.', 'LAS'],
    ['tanner', 'Dimensions de « Interpréter » (Lasater) ?', 'Hiérarchiser les données, donner du sens aux données', 'Toutes les données n’ont pas la même importance : il faut trouver celles qui comptent.', 'LAS'],
    ['tanner', 'Dimensions de « Répondre » (Lasater) ?', 'Attitude calme et assurée, communication claire, intervention bien planifiée/flexible, habileté technique', 'Agir juste, c’est aussi rassurer le patient et bien communiquer avec l’équipe.', 'LAS'],
    ['tanner', 'Dimensions de « Réfléchir » (Lasater) ?', 'Évaluation / auto-analyse, engagement dans l’amélioration', 'Revenir sur une situation transforme l’expérience en compétence.', 'LAS'],
    ['demarche', 'Les étapes de la démarche de soins ?', 'Recueil de données → analyse / problèmes (diagnostics infirmiers) → objectifs → interventions → évaluation', 'C’est un cycle : l’évaluation relance le recueil de données.', 'NANDA'],
    ['demarche', 'Structure d’un diagnostic infirmier « en PES » ?', 'Problème (titre NANDA-I) lié à (Étiologie / facteurs favorisants) se manifestant par (Signes / caractéristiques)', 'L’étiologie guide les interventions ; les signes servent à évaluer l’évolution.', 'NANDA'],
    ['demarche', 'Diagnostic infirmier de risque : particularité ?', 'Pas de signes (le problème n’existe pas encore) : on écrit « Risque de… lié à (facteurs de risque) »', 'Les interventions visent la prévention.', 'NANDA'],
    ['demarche', 'Diagnostic infirmier vs problème traité en collaboration (PTC) ?', 'DI : l’infirmière en a la responsabilité et peut agir de son propre chef. PTC : complication médicale potentielle que l’infirmière surveille et dont le traitement est prescrit', 'Exemple de PTC : « risque de complication : hémorragie post-opératoire ».', 'NANDA'],
    ['demarche', 'Un objectif de soins SMART, c’est ?', 'Spécifique, Mesurable, Atteignable (Acceptable), Réaliste, Temporellement défini', 'Un objectif mesurable permet de savoir si les soins ont fonctionné.', 'NANDA'],
    ['demarche', 'Qui est le sujet d’un objectif de soins ?', 'Le patient (ex. « Le patient marchera 20 m avec aide d’ici mardi »)', 'L’objectif décrit le résultat attendu chez le patient, pas l’action de l’infirmière.', 'NANDA'],
    ['modeles', 'Combien de besoins fondamentaux selon Henderson ?', '14', 'Respirer, boire et manger, éliminer, se mouvoir, dormir, se vêtir, maintenir sa température, être propre, éviter les dangers, communiquer, agir selon ses valeurs, s’occuper, se récréer, apprendre.', 'HEND'],
    ['modeles', 'Combien de modes fonctionnels de santé selon Gordon ?', '11', 'Perception/gestion de la santé, nutrition/métabolisme, élimination, activité/exercice, sommeil/repos, cognition/perception, perception de soi, rôles/relations, sexualité/reproduction, adaptation/tolérance au stress, valeurs/croyances.', 'GORD'],
    ['modeles', 'Donnée objective vs subjective ?', 'Objective : observée ou mesurée (PA, plaie). Subjective : exprimée par le patient (« j’ai mal »)', 'Les deux comptent : la douleur est ce que le patient dit qu’elle est.', 'NANDA'],
    ['prio', 'Règle de base de la priorisation ?', 'Menace vitale d’abord (A-B-C), puis aigu avant chronique, problème réel avant potentiel', 'On ne meurt pas d’une toilette retardée, mais d’une obstruction des voies aériennes non vue.', 'RAIS'],
    ['prio', 'Comment la pyramide de Maslow aide-t-elle à prioriser ?', 'Les besoins physiologiques et de sécurité passent avant les besoins d’appartenance, d’estime et de réalisation', 'Utile pour les besoins non urgents ; en urgence, l’ABCDE prime.', 'RAIS'],
    ['prio', 'Patient « pas comme d’habitude » sans paramètre anormal : que faire ?', 'Le prendre au sérieux : réévaluer de façon complète, en parler et tracer', 'Les changements subtils (comportement, confusion, FR) précèdent souvent la dégradation des chiffres.', 'NEWS'],
    ['news', 'Les 7 paramètres du score NEWS2 ?', 'Fréquence respiratoire, SpO₂, oxygène (oui/non), PA systolique, pouls, conscience (ACVPU), température', 'Ce sont des paramètres simples, mesurés partout, qui se dégradent avant un arrêt.', 'NEWS'],
    ['news', 'NEWS2 : que signifie ACVPU ?', 'Alert, nouvelle Confusion, réagit à la Voix, à la douleur (Pain), Unresponsive (aucune réponse)', 'Toute nouvelle confusion vaut 3 points : c’est un signe d’alerte majeur.', 'NEWS'],
    ['news', 'NEWS2 : seuils de déclenchement ?', '1 paramètre à 3 ou total 5-6 : réévaluation urgente par le médecin ; total ≥ 7 : réponse d’urgence (équipe de réa), monitorage continu', 'Les seuils sont adaptables au patient selon le protocole local.', 'NEWS'],
    ['news', 'NEWS2 : FR qui vaut 3 points ?', '≤ 8/min ou ≥ 25/min', 'La fréquence respiratoire est souvent le premier paramètre à s’altérer, et le plus oublié.', 'NEWS'],
    ['news', 'NEWS2 : à quoi sert l’échelle SpO₂ n°2 ?', 'Aux patients hypercapniques (ex. certaines BPCO) dont la cible de saturation prescrite est 88-92 %', 'Viser 96 % chez eux peut aggraver l’hypercapnie.', 'NEWS'],
    ['news', 'Selon la SSC 2026, quel outil de dépistage du sepsis préférer à l’hôpital ?', 'Un score unique type NEWS/NEWS2, MEWS ou SIRS plutôt que le qSOFA', 'Le NEWS2 est donc aussi un outil de dépistage du sepsis.', 'SSC'],
    ['comm', 'Que signifie SBAR ?', 'Situation – Background (contexte) – Assessment (évaluation) – Recommendation (demande)', 'Un message structuré réduit les oublis et les malentendus, surtout au téléphone.', 'SBAR'],
    ['comm', 'Que dit-on dans le « S » ?', 'Qui j’appelle, pour qui (nom, chambre), et le problème actuel en une phrase', 'Le médecin doit savoir en 10 secondes pourquoi on l’appelle.', 'SBAR'],
    ['comm', 'Que dit-on dans le « R » ?', 'Ce que l’on demande clairement (venir voir le patient, une prescription, un délai) et on reformule la réponse', 'Sans demande claire, l’appel risque de ne rien changer.', 'SBAR'],
    ['comm', 'Transmissions ciblées : structure DAR ?', 'Données – Actions – Résultats, autour d’une cible (problème)', 'Elles rendent le dossier lisible et centré sur l’évolution du patient.', 'SBAR'],
    ['medic', 'Les « B » avant d’administrer un médicament ?', 'Bon patient, bon médicament, bonne dose, bonne voie, bon moment (+ bonne documentation, bonne raison selon les écoles)', 'Chaque « B » bloque un type d’erreur fréquent.', 'MED'],
    ['medic', 'Médicaments à haut risque qui demandent une double vérification ?', 'Ex. : insuline, anticoagulants, potassium concentré, opioïdes, chimiothérapies (selon la liste de l’hôpital)', 'Une erreur avec ces médicaments peut être mortelle.', 'MED'],
    ['medic', 'Prescription illisible ou dose qui te paraît anormale : que faire ?', 'Ne pas administrer, vérifier (CBIP, pharmacien) et contacter le prescripteur', 'L’infirmière est responsable de l’administration : « je ne fais que suivre » n’est pas une excuse.', 'MED+LEGAL'],
    ['legal', 'Que sont les prestations B1 (AR du 18 juin 1990) ?', 'Prestations techniques infirmières qui ne nécessitent PAS de prescription médicale', 'Exemples typiques : soins d’hygiène, prévention d’escarres, surveillance des paramètres.', 'LEGAL'],
    ['legal', 'Que sont les prestations B2 ?', 'Prestations techniques infirmières qui nécessitent une prescription médicale', 'Exemples typiques : injections, pose de sonde, soins de plaie selon prescription.', 'LEGAL'],
    ['legal', 'Que sont les actes médicaux confiés ?', 'Actes que le médecin peut confier à l’infirmier(ère), dans un cadre défini (prescription/protocole)', 'Le médecin reste responsable de la prescription, l’infirmière de l’exécution.', 'LEGAL'],
    ['legal', 'Quelle loi encadre aujourd’hui les professions des soins de santé en Belgique ?', 'La loi coordonnée du 10 mai 2015 relative à l’exercice des professions des soins de santé', 'Elle a remplacé l’ancien AR n° 78 et définit l’art infirmier.', 'LEGAL'],
    ['legal', 'Ce qu’une étudiante peut faire en stage ?', 'Des soins dans le cadre de sa formation, sous la supervision et la responsabilité d’un(e) infirmier(ère)', 'Elle doit connaître ses limites et signaler ce qu’elle ne maîtrise pas.', 'LEGAL'],
    ['reflex', 'Les étapes du cycle réflexif de Gibbs ?', 'Description → sentiments → évaluation → analyse → conclusion → plan d’action', 'Il transforme une situation vécue (bonne ou difficile) en apprentissage.', 'GIBBS'],
    ['reflex', 'Biais d’ancrage ?', 'Rester accroché à la première hypothèse malgré de nouvelles données', 'Ex. : « il est confus parce qu’il est âgé » alors qu’il fait un sepsis.', 'RAIS'],
    ['reflex', 'Biais de confirmation ?', 'Chercher seulement les informations qui confirment ce qu’on pense déjà', 'Remède : se demander « qu’est-ce qui pourrait me faire changer d’avis ? ».', 'RAIS'],
    ['reflex', 'Fermeture prématurée ?', 'Arrêter de réfléchir dès qu’une explication semble suffisante', 'Remède : « et si c’était autre chose de grave ? » (le pire diagnostic à ne pas rater).', 'RAIS'],
    ['reflex', 'Erreur en stage : bonne attitude ?', 'La signaler immédiatement, protéger le patient, analyser sans se culpabiliser, apprendre', 'La culture de sécurité repose sur le signalement, pas sur la sanction.', 'RAIS']
  ],
  questions: [
    { th: 'tanner', n: 1, q: 'Quelles sont les 4 étapes du modèle de Tanner, dans l’ordre ?', c: ['Remarquer, interpréter, répondre, réfléchir', 'Interpréter, remarquer, réfléchir, répondre', 'Recueillir, diagnostiquer, planifier, évaluer', 'Observer, agir, transmettre, noter'], b: [0], x: ['On perçoit, on donne du sens, on agit, puis on apprend de la situation.'], s: 'TAN' },
    { th: 'tanner', n: 2, q: 'Tu remarques que Mme L., d’habitude bavarde, est silencieuse et répond lentement. Selon Tanner, à quelle étape es-tu ?', c: ['Remarquer', 'Interpréter', 'Répondre', 'Réfléchir'], b: [0], x: ['Tu perçois un écart par rapport à ce qui est attendu pour CETTE patiente.', 'Connaître le patient « habituel » aide à remarquer.'], s: 'TAN+LAS' },
    { th: 'tanner', n: 2, q: 'Le soir, tu repenses à ta journée et à ce que tu aurais pu faire autrement. Quelle étape ?', c: ['Réfléchir (reflecting)', 'Remarquer', 'Interpréter', 'Répondre'], b: [0], x: ['La réflexion « sur l’action » nourrit tes prochains jugements.'], s: 'TAN' },
    { th: 'tanner', n: 3, q: 'Quelles dimensions appartiennent à « Répondre » dans la grille de Lasater ? (plusieurs réponses)', c: ['Attitude calme et assurée', 'Communication claire', 'Habileté technique', 'Hiérarchisation des données'], b: [0, 1, 2], x: ['Hiérarchiser les données appartient à « Interpréter ».', 'Répondre = attitude, communication, intervention planifiée/flexible, habileté.'], s: 'LAS' },
    { th: 'tanner', n: 3, q: 'Une infirmière experte « sent » qu’un patient va mal avant que les chiffres changent. Type de raisonnement selon Tanner ?', c: ['Intuitif', 'Analytique', 'Narratif', 'Aléatoire'], b: [0], x: ['L’intuition, c’est une reconnaissance rapide de situations déjà vécues.', 'Pour toi, c’est un signal à prendre au sérieux… puis à objectiver par une évaluation.'], s: 'TAN' },
    { th: 'demarche', n: 1, q: 'Quelle est la première étape de la démarche de soins ?', c: ['Le recueil de données', 'Les interventions', 'L’évaluation', 'Les objectifs'], b: [0], x: ['Sans données fiables, tout le reste repose sur du sable.'], s: 'NANDA' },
    { th: 'demarche', n: 2, q: 'Dans « Douleur aiguë liée à l’incision chirurgicale se manifestant par une EN à 7/10 », que représente « se manifestant par » ?', c: ['Les signes (caractéristiques)', 'L’étiologie', 'Le problème', 'L’objectif'], b: [0], x: ['P = douleur aiguë ; E = liée à l’incision ; S = EN 7/10.', 'Les signes serviront à évaluer l’efficacité des interventions.'], s: 'NANDA' },
    { th: 'demarche', n: 2, q: 'Lequel est un diagnostic infirmier de RISQUE correctement formulé ?', c: ['Risque de chute lié à une faiblesse musculaire et à des vertiges', 'Risque de chute se manifestant par une chute hier', 'Chute liée à l’âge', 'Risque de chute lié à la chute'], b: [0], x: ['Un diagnostic de risque n’a pas de signes : seulement des facteurs de risque.'], s: 'NANDA' },
    { th: 'demarche', n: 2, q: 'Lequel de ces objectifs est SMART ?', c: ['Mme D. marchera 20 m avec son déambulateur, avec l’aide d’une personne, d’ici jeudi', 'Améliorer la mobilité', 'L’infirmière aidera Mme D. à marcher', 'Mme D. ira mieux'], b: [0], x: ['Le sujet est la patiente, c’est mesurable (20 m), réaliste et daté.'], s: 'NANDA' },
    { th: 'demarche', n: 3, q: '« Risque de complication : hémorragie post-opératoire » est :', c: ['Un problème traité en collaboration (PTC)', 'Un diagnostic infirmier NANDA', 'Un objectif', 'Une intervention'], b: [0], x: ['L’infirmière surveille et détecte, le traitement relève du médecin.'], s: 'NANDA' },
    { t: 'vf', th: 'demarche', n: 1, q: 'L’évaluation est la dernière étape de la démarche : une fois faite, le plan de soins est terminé.', b: false, x: ['La démarche est cyclique : l’évaluation relance le recueil et ajuste le plan.'], s: 'NANDA' },
    { th: 'modeles', n: 1, q: 'Combien de besoins fondamentaux décrit Virginia Henderson ?', c: ['14', '11', '5', '10'], b: [0], x: ['11, c’est Gordon (modes fonctionnels de santé).'], s: 'HEND' },
    { th: 'modeles', n: 2, q: 'Quelles données sont SUBJECTIVES ? (plusieurs réponses)', c: ['« J’ai peur de l’opération »', '« J’ai mal au ventre, 6/10 »', 'PA 150/90', 'Rougeur de 3 cm au point de ponction'], b: [0, 1], x: ['Subjectif = exprimé par le patient. Objectif = observé ou mesuré.'], s: 'NANDA' },
    { th: 'prio', n: 1, q: 'Quel patient vois-tu EN PREMIER ?', c: ['Un patient qui fait un bruit de ronflement et dont la SpO₂ baisse', 'Un patient qui réclame un antalgique pour une douleur à 5/10', 'Une patiente qui veut parler à l’assistante sociale', 'Un patient qui attend sa toilette'], b: [0], x: ['A (voies aériennes) d’abord : le ronflement évoque une obstruction.'], s: 'RAIS' },
    { th: 'prio', n: 2, q: 'Quel patient est prioritaire ?', c: ['Patient diabétique, sueurs, confusion, glycémie à 48 mg/dL', 'Patient dont la perfusion se termine dans 30 min', 'Patiente qui demande à se lever', 'Patient sortant qui attend ses documents'], b: [0], x: ['L’hypoglycémie avec confusion est une urgence vite corrigeable (D de l’ABCDE).'], s: 'RAIS' },
    { th: 'prio', n: 3, q: 'Classe ces situations : laquelle passe AVANT les autres ?', c: ['Un patient post-opératoire avec une PA qui passe de 125/70 à 88/50 et une FC de 120', 'Un patient avec une douleur chronique stable à 4/10', 'Une patiente anxieuse avant son examen de demain', 'Un pansement à refaire selon le planning'], b: [0], x: ['Hypotension + tachycardie post-op = suspicion d’hémorragie (C de l’ABCDE).'], s: 'RAIS' },
    { th: 'prio', n: 2, q: 'Une aide-soignante te dit : « M. B. n’est pas comme d’habitude, mais ses paramètres sont normaux ». Que fais-tu ?', c: ['Je vais l’évaluer moi-même complètement (ABCDE, FR, conscience) et j’en parle', 'Rien, les paramètres sont normaux', 'Je lui demande de revenir me voir si ça empire', 'Je note « RAS »'], b: [0], x: ['Les changements de comportement précèdent souvent la dégradation des chiffres.', 'Une remarque de collègue est une donnée précieuse.'], s: 'NEWS+RAIS' },
    { th: 'news', n: 1, q: 'Combien de paramètres compte le score NEWS2 ?', c: ['7', '5', '3', '10'], b: [0], x: ['FR, SpO₂, O₂ oui/non, PAS, pouls, conscience, température.'], s: 'NEWS' },
    { th: 'news', n: 2, q: 'NEWS2 total de 7 ou plus. Quelle réponse est attendue ?', c: ['Réponse d’urgence : équipe d’urgence/réa, monitorage continu', 'Paramètres toutes les 12 h', 'Simple information au médecin le lendemain', 'Aucune, c’est un score moyen'], b: [0], x: ['≥ 7 = risque élevé de dégradation grave.', 'Le protocole local précise qui appeler (équipe MET, réa…).'], s: 'NEWS' },
    { th: 'news', n: 2, q: 'Patient : FR 26/min, tout le reste est normal. Que dit le NEWS2 ?', c: ['Un paramètre à 3 : avis médical urgent et surveillance au moins horaire', 'Score 0 : rien à faire', 'Score ≥ 7 : appel de la réa', 'La FR ne fait pas partie du NEWS2'], b: [0], x: ['FR ≥ 25 = 3 points.', 'Un seul paramètre « rouge » suffit à déclencher une réévaluation urgente.'], s: 'NEWS' },
    { th: 'news', n: 2, q: 'Nouvelle confusion chez une patiente de 82 ans. Combien de points dans le NEWS2 ?', c: ['3', '0', '1', '2'], b: [0], x: ['Toute nouvelle confusion (C de ACVPU) vaut 3 points.', 'Ne jamais l’attribuer « à l’âge » sans chercher une cause (sepsis, hypoglycémie, rétention…).'], s: 'NEWS' },
    { th: 'news', n: 3, q: 'Patient BPCO hypercapnique, cible SpO₂ prescrite 88-92 %. Quelle échelle SpO₂ du NEWS2 utiliser ?', c: ['L’échelle 2', 'L’échelle 1', 'Aucune, on ignore la SpO₂', 'L’échelle pédiatrique'], b: [0], x: ['L’échelle 2 évite de pénaliser une saturation volontairement plus basse.', 'Elle s’utilise uniquement sur décision médicale documentée.'], s: 'NEWS' },
    { th: 'comm', n: 1, q: 'Dans SBAR, que contient le « B » ?', c: ['Le contexte : antécédents, motif d’hospitalisation, traitements pertinents', 'Le problème actuel', 'Ta demande', 'Ton évaluation'], b: [0], x: ['Background = ce que le médecin doit savoir pour comprendre la situation.'], s: 'SBAR' },
    { th: 'comm', n: 2, q: 'Quelle phrase est un bon « R » ?', c: ['« Pouvez-vous venir l’examiner dans les 15 prochaines minutes ? »', '« Je voulais juste vous informer »', '« Il ne va pas très bien »', '« Faites ce que vous voulez »'], b: [0], x: ['Une demande claire, avec un délai, et on reformule la réponse obtenue.'], s: 'SBAR' },
    { th: 'comm', n: 3, q: 'Le médecin te donne une prescription orale par téléphone en urgence. Bonne pratique ?', c: ['La répéter à voix haute pour confirmation (read-back), la noter et la faire signer dès que possible selon la procédure', 'L’exécuter sans rien noter', 'Refuser systématiquement', 'La noter sans la répéter'], b: [0], x: ['La reformulation évite les erreurs de compréhension (dose, voie, unité).'], s: 'SBAR+MED' },
    { th: 'medic', n: 1, q: 'Quels sont les « B » de base de l’administration des médicaments ? (plusieurs réponses)', c: ['Bon patient', 'Bonne dose', 'Bonne voie', 'Bonne couleur'], b: [0, 1, 2], x: ['Aussi : bon médicament, bon moment, et la bonne documentation.'], s: 'MED' },
    { th: 'medic', n: 2, q: 'La dose prescrite te paraît 10 fois trop élevée. Que fais-tu ?', c: ['Je n’administre pas, je vérifie (CBIP, pharmacien) et j’appelle le prescripteur', 'J’administre, c’est le médecin qui a prescrit', 'J’administre la moitié', 'Je demande au patient'], b: [0], x: ['Les erreurs « ×10 » (virgule, unités) sont classiques et graves.', 'L’infirmière est responsable de ce qu’elle administre.'], s: 'MED+LEGAL' },
    { th: 'medic', n: 2, q: 'Quels médicaments sont généralement considérés « à haut risque » ? (plusieurs réponses)', c: ['Insuline', 'Potassium concentré IV', 'Anticoagulants', 'Sérum physiologique 0,9 % en flacon de 100 mL'], b: [0, 1, 2], x: ['Ils justifient des précautions renforcées (double vérification, stockage séparé) selon la liste de l’hôpital.'], s: 'MED' },
    { th: 'legal', n: 1, q: 'Une prestation infirmière B1 :', c: ['Ne nécessite pas de prescription médicale', 'Nécessite une prescription', 'Est réservée au médecin', 'Est un acte administratif'], b: [0], x: ['B1 = initiative infirmière ; B2 = sur prescription ; actes médicaux confiés.'], s: 'LEGAL' },
    { th: 'legal', n: 2, q: 'Quel texte encadre l’exercice de l’art infirmier en Belgique aujourd’hui ?', c: ['La loi coordonnée du 10 mai 2015', 'Le Code civil', 'La loi sur les hôpitaux de 1963', 'Une circulaire de l’école'], b: [0], x: ['Elle a remplacé l’AR n° 78. La liste des prestations figure dans l’AR du 18 juin 1990.'], s: 'LEGAL' },
    { t: 'vf', th: 'legal', n: 1, q: 'En stage, l’étudiante peut poser des actes infirmiers sous la supervision d’un(e) infirmier(ère).', b: true, x: ['Dans le cadre de sa formation, sous supervision.', 'Elle signale ce qu’elle ne maîtrise pas encore.'], s: 'LEGAL' },
    { th: 'reflex', n: 2, q: 'Un patient de 85 ans devient confus. L’équipe dit « c’est l’âge ». Quel biais ?', c: ['Biais d’ancrage / fermeture prématurée', 'Biais de disponibilité positive', 'Aucun biais', 'Effet placebo'], b: [0], x: ['Une confusion nouvelle est un signe d’alerte (NEWS2 = 3 points).', 'Penser au pire à ne pas rater : sepsis, hypoglycémie, hypoxie, rétention, médicaments…'], s: 'RAIS+NEWS' },
    { th: 'reflex', n: 2, q: 'Le cycle réflexif de Gibbs commence par :', c: ['La description de la situation', 'Le plan d’action', 'L’analyse', 'La conclusion'], b: [0], x: ['Description → sentiments → évaluation → analyse → conclusion → plan d’action.'], s: 'GIBBS' },
    { th: 'reflex', n: 1, q: 'Tu t’es trompée d’heure pour un antibiotique. Que fais-tu ?', c: ['Je le signale immédiatement à l’infirmier(ère), on évalue le patient et on suit la procédure', 'Je le cache', 'Je donne une double dose à la prochaine prise', 'J’attends de voir si quelqu’un le remarque'], b: [0], x: ['Signaler protège le patient et permet d’améliorer le système.', 'Ne jamais « rattraper » seule une dose : c’est au prescripteur de décider.'], s: 'RAIS+MED' }
  ],
  mini: {
    news2: true,
    calculs: ['pam', 'debit', 'gouttes', 'dose', 'diurese'],
    ordre: [
      { titre: 'La démarche de soins', etapes: ['Recueil de données', 'Analyse et formulation des problèmes (diagnostics infirmiers, PTC)', 'Objectifs SMART', 'Interventions', 'Évaluation'], pourquoi: 'C’est un cycle : l’évaluation relance le recueil.', s: 'NANDA' },
      { titre: 'Le modèle de Tanner', etapes: ['Remarquer', 'Interpréter', 'Répondre', 'Réfléchir'], pourquoi: 'Percevoir, comprendre, agir, apprendre.', s: 'TAN' },
      { titre: 'Le cycle de Gibbs', etapes: ['Description', 'Sentiments', 'Évaluation', 'Analyse', 'Conclusion', 'Plan d’action'], pourquoi: 'On part des faits et des émotions pour arriver à ce qu’on fera différemment.', s: 'GIBBS' },
      { titre: 'Appel SBAR', etapes: ['S — Mme T., chambre 5 : PA 85/50, FC 125, nouvelle confusion', 'B — Opérée hier d’une colectomie, sous anticoagulant préventif', 'A — Je suspecte une hémorragie ou un sepsis, NEWS2 à 9', 'R — Je vous demande de venir tout de suite'], pourquoi: 'Toujours le même ordre : le médecin sait où trouver l’information.', s: 'SBAR' }
    ],
    tri: [
      { titre: 'Diagnostic infirmier ou PTC ?', cats: ['Diagnostic infirmier', 'Problème traité en collaboration'], items: [['Risque de chute', 0], ['Risque de complication : hémorragie', 1], ['Anxiété', 0], ['Risque de complication : hypoglycémie sous insuline', 1], ['Atteinte à l’intégrité de la peau', 0], ['Risque de complication : HTIC', 1], ['Déficit en soins personnels : se laver', 0]] },
      { titre: 'Henderson : quel besoin ?', cats: ['Respirer', 'Éliminer', 'Éviter les dangers', 'Communiquer'], items: [['Dyspnée d’effort', 0], ['Constipation depuis 4 jours', 1], ['Risque de chute la nuit', 2], ['Patient aphasique', 3], ['Rétention urinaire', 1], ['Désorientation et errance', 2], ['Toux productive', 0], ['Patient malentendant sans appareil', 3]] },
      { titre: 'Subjective ou objective ?', cats: ['Subjective', 'Objective'], items: [['« J’ai des nausées »', 0], ['Vomissement de 200 mL', 1], ['« Je dors mal »', 0], ['SpO₂ 91 %', 1], ['« J’ai peur »', 0], ['Œdème des chevilles', 1]] }
    ],
    associe: [
      { titre: 'Qui a dit quoi ?', s: 'TAN+LAS+HEND+GORD+GIBBS', paires: [['Tanner', 'Remarquer, interpréter, répondre, réfléchir'], ['Lasater', 'Grille à 11 dimensions'], ['Henderson', '14 besoins fondamentaux'], ['Gordon', '11 modes fonctionnels'], ['Gibbs', 'Cycle réflexif'], ['Maslow', 'Pyramide des besoins']] },
      { titre: 'SBAR', s: 'SBAR', paires: [['S', 'Le problème actuel'], ['B', 'Le contexte, les antécédents'], ['A', 'Mon évaluation'], ['R', 'Ma demande'], ['Read-back', 'Reformuler une prescription orale'], ['DAR', 'Transmissions ciblées']] }
    ],
    erreur: [
      { titre: 'La transmission de 14 h', scene: 'Une collègue te passe les patients. Repère les problèmes de jugement clinique.', s: 'NEWS+RAIS+MED', items: [['« M. P. est confus depuis ce matin, mais à son âge c’est normal »', true, 'Une confusion nouvelle vaut 3 points au NEWS2 : il faut chercher une cause.'], ['« Mme R. a une FR à 28, je n’ai pas compté le reste du NEWS2 »', true, 'FR ≥ 25 = 3 points : avis médical urgent ; il faut calculer le score complet.'], ['« J’ai noté la glycémie de 14 h dans le dossier »', false], ['« J’ai donné la moitié de l’insuline car il n’a pas mangé, sans demander »', true, 'Toute adaptation de dose relève de la prescription ou du protocole.'], ['« J’ai prévenu le médecin en SBAR pour Mme K. et il passe à 15 h »', false], ['« Le diagnostic infirmier : l’infirmière aidera le patient à marcher »', true, 'C’est une intervention, pas un diagnostic ni un objectif.']] }
    ]
  },
  garde: {
    titre: 'La garde aux 6 patients',
    intro: 'Stage de jugement clinique. Il est 7 h. Tu reçois 6 patients venus de services différents. Ton défi : remarquer, interpréter, répondre… et prioriser.',
    retenir: 'Le jugement clinique, c’est : remarquer ce qui change, interpréter avec des outils (ABCDE, NEWS2), répondre dans l’ordre des menaces vitales, communiquer en SBAR, puis réfléchir sur sa pratique.',
    sbar: ['Mme T., 71 ans, chambre 5 : PA 86/52, FC 118, FR 26, nouvelle confusion, NEWS2 à 10', 'J1 d’une colectomie, porteuse d’un drain abdominal, sous anticoagulant préventif', 'Je pense à une hémorragie ou à un sepsis : le drain a donné 300 mL de sang en 2 h', 'Je vous demande de venir immédiatement et je prépare un bilan sanguin selon vos instructions'],
    noeuds: {
      debut: { heure: '07 h 00', patient: '6 patients', v: { FC: 96, PAS: 118, PAD: 68, SpO2: 95, FR: 22, T: 37.6, GCS: 15 }, texte: 'Tes 6 patients : (1) Mme T., J1 colectomie ; (2) M. J., diabétique, n’a pas pris son petit-déjeuner ; (3) Mme N., sortante ; (4) M. B., BPCO stable ; (5) Mme E., douleur chronique ; (6) M. O., HSD chronique drainé hier. Comment démarres-tu ?', s: 'RAIS',
        choix: [
          { t: 'Un tour rapide de tous les patients (« coup d’œil ABCDE ») puis je priorise', q: 2, fb: 'Un premier tour rapide permet de repérer qui est instable avant de s’engager dans des soins longs.', suite: 'tour' },
          { t: 'Je commence par les papiers de sortie de Mme N.', q: 0, fb: 'L’administratif peut attendre ; un patient instable, non.', suite: 'tour' },
          { t: 'Je fais la toilette complète du premier patient puis je passe au suivant', q: 1, fb: 'Tu risques de passer 30 minutes dans une chambre pendant qu’un autre patient se dégrade.', suite: 'tour' }
        ] },
      tour: { heure: '07 h 20', patient: 'Mme T., 71 ans — J1 colectomie', v: { FC: 112, PAS: 98, PAD: 58, SpO2: 94, FR: 24, T: 37.8, GCS: 15 }, texte: 'Mme T. est pâle, dit « je ne me sens pas bien ». FC 112, PA 98/58 (hier 130/75), FR 24. Que fais-tu (remarquer → interpréter) ?', s: 'NEWS+TAN',
        choix: [
          { t: 'Je calcule son NEWS2, je regarde le drain, le pansement, la diurèse, et je compare avec hier', q: 2, fb: 'Remarquer l’écart avec la valeur habituelle et chercher les données manquantes : c’est le cœur du jugement clinique.', suite: 'glyc' },
          { t: 'Je lui dis que c’est normal après une opération', q: 0, fb: 'Tachycardie + PA qui baisse en post-op = alerte. « Je ne me sens pas bien » est une donnée importante.', suite: 'glyc', v: { FC: 120, PAS: 90, PAD: 54 } },
          { t: 'Je reprends ses paramètres dans 4 h', q: 0, fb: 'Avec FR 24, FC 112 et PA en baisse, une surveillance rapprochée et une évaluation complète s’imposent.', suite: 'glyc', v: { FC: 120, PAS: 90, PAD: 54 } }
        ] },
      glyc: { heure: '07 h 35', patient: 'M. J., 64 ans — diabétique', v: { FC: 104, PAS: 128, PAD: 74, SpO2: 97, FR: 18, T: 36.4, GCS: 14 }, texte: 'En passant, tu entends M. J. tenir des propos incohérents. Il est en sueur. Il a reçu son insuline mais n’a rien mangé.', s: 'RAIS',
        choix: [
          { t: 'Glycémie capillaire immédiate et resucrage selon le protocole, puis réévaluation', q: 2, fb: 'Glycémie à 52 mg/dL : hypoglycémie. Le resucrage selon protocole corrige vite. C’est le « D » de l’ABCDE.', suite: 'retour', v: { GCS: 15, FC: 88 } },
          { t: 'Le laisser se reposer, il est sûrement fatigué', q: 0, fb: 'Sueurs + confusion chez un diabétique sous insuline = hypoglycémie jusqu’à preuve du contraire.', suite: 'retour', v: { GCS: 13 } },
          { t: 'Lui redonner de l’insuline car il est diabétique', q: 0, fb: 'Danger : cela aggraverait une hypoglycémie. On mesure avant d’agir.', suite: 'retour', v: { GCS: 12 } }
        ] },
      retour: { heure: '07 h 50', patient: 'Mme T., 71 ans — J1 colectomie', v: { FC: 118, PAS: 86, PAD: 52, SpO2: 93, FR: 26, T: 37.9, GCS: 14 }, texte: 'Tu retournes voir Mme T. Elle est un peu confuse, PA 86/52, FC 118, FR 26. Le drain a donné 300 mL de sang depuis 6 h. NEWS2 = 10.', s: 'NEWS',
        choix: [
          { t: 'Réponse d’urgence : je reste avec elle, je fais appeler le médecin/l’équipe d’urgence et je prépare ma transmission SBAR', q: 2, fb: 'NEWS2 ≥ 7 + suspicion d’hémorragie : réponse d’urgence. Tu ne la laisses pas seule.', suite: 'autres' },
          { t: 'J’envoie un message au médecin pour qu’il passe dans la matinée', q: 0, fb: 'Avec un NEWS2 à 10, c’est une urgence immédiate, pas une visite « dans la matinée ».', suite: 'autres' },
          { t: 'Je mets de l’oxygène et je continue mon tour', q: 1, fb: 'L’oxygène peut aider, mais tu ne règles ni la cause, ni l’alerte.', suite: 'autres' }
        ] },
      autres: { heure: '08 h 30', patient: 'Mme T. prise en charge par le médecin', v: { FC: 104, PAS: 104, PAD: 62, GCS: 15 }, texte: 'Mme T. est prise en charge. Mme E. (douleur chronique) réclame son antalgique, M. O. (HSD drainé) dit avoir un peu mal à la tête, Mme N. attend ses papiers. Qui vois-tu en premier ?', s: 'RAIS',
        choix: [
          { t: 'M. O. : évaluation neuro (Glasgow, pupilles, motricité) car une céphalée après drainage d’HSD peut annoncer une récidive', q: 2, fb: 'Son Glasgow est à 15, pupilles symétriques : tu le notes, tu le signales et tu le réévalues plus souvent. Puis Mme E., puis Mme N.', suite: 'reflex' },
          { t: 'Mme E. : elle a mal depuis longtemps', q: 1, fb: 'Sa douleur compte, mais une céphalée chez un patient neuro post-opératoire peut être plus urgente.', suite: 'reflex' },
          { t: 'Mme N. : elle doit libérer la chambre', q: 0, fb: 'Les sorties administratives passent après l’évaluation des patients à risque.', suite: 'reflex' }
        ] },
      reflex: { heure: '14 h 00', texte: 'Fin de garde. Ton infirmière référente te demande ce que tu retiens de ta matinée.', s: 'TAN+GIBBS',
        choix: [
          { t: 'Je décris ce qui s’est passé, ce que j’ai ressenti, ce qui a bien marché, ce que je ferais autrement, et je me fixe un objectif', q: 2, fb: 'C’est la réflexion (Tanner) structurée comme le cycle de Gibbs : elle transforme la journée en apprentissage.', suite: 'fin' },
          { t: '« Tout s’est bien passé, rien à dire »', q: 0, fb: 'Même une bonne journée mérite d’être analysée : c’est comme ça que l’intuition clinique se construit.', suite: 'fin' },
          { t: 'Je liste seulement les soins techniques réalisés', q: 1, fb: 'Les soins comptent, mais la réflexion porte surtout sur ton raisonnement et tes décisions.', suite: 'fin' }
        ] },
      fin: { fin: true, texte: 'Avant de partir, l’infirmière te demande de reformuler l’appel que tu as fait pour Mme T. à 7 h 50, en SBAR.' }
    }
  },
  escape: {
    titre: 'Le cadenas du Sommet',
    intro: 'Le toit de l’hôpital est fermé par un cadenas à 5 chiffres. Les indices sont dans ta tête : modèles, scores et outils du jugement clinique.',
    final: 'Le cadenas attend 5 chiffres.',
    victoire: 'Le cadenas s’ouvre. Du sommet, tu vois tout l’hôpital : tu es prête pour ton stage de jugement clinique !',
    enigmes: [
      { titre: 'Énigme 1 — Tanner', texte: 'Combien d’étapes compte le modèle de jugement clinique de Tanner ?', type: 'code', reponses: ['4', 'quatre'], chiffre: '4', indice: 'Remarquer, …, …, réfléchir.', explication: 'Remarquer, interpréter, répondre, réfléchir.' },
      { titre: 'Énigme 2 — Henderson', texte: 'Nombre de besoins fondamentaux selon Henderson ? Le chiffre du code est le chiffre des unités.', type: 'qcm', choix: ['11', '14', '10', '5'], b: 1, chiffre: '4', indice: 'Plus que Gordon.', explication: '14 besoins → 4.' },
      { titre: 'Énigme 3 — NEWS2', texte: 'Combien de points vaut une nouvelle confusion dans le NEWS2 ?', type: 'qcm', choix: ['1', '2', '3', '0'], b: 2, chiffre: '3', indice: 'C’est le maximum pour un paramètre.', explication: 'Toute nouvelle confusion = 3 points.' },
      { titre: 'Énigme 4 — SBAR', texte: 'Remets les lettres de la transmission dans l’ordre.', type: 'ordre', etapes: ['Situation', 'Background', 'Assessment', 'Recommendation'], chiffre: '1', indice: 'S… B… A… R…', explication: 'SBAR ! Chiffre : 1 (une seule bonne façon de transmettre).' },
      { titre: 'Énigme 5 — Lasater', texte: 'Combien de dimensions compte la grille de Lasater ? Le chiffre du code est le chiffre des unités.', type: 'code', reponses: ['11', 'onze'], chiffre: '1', indice: 'Autant que les modes de Gordon.', explication: '11 dimensions → 1.' }
    ]
  }
});
