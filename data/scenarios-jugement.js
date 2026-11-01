/* Scénarios supplémentaires — Étage 4, Jugement clinique (transversal). Créé par Gauthier Doumont
 * Format : voir data/scenarios-rea.js */
window.SCENARIOS = window.SCENARIOS || {};
window.SCENARIOS.jugement = {
  tirage: 5,
  escape: [
    { titre: 'Le NEWS2 critique', texte: 'À partir de quel total le NEWS2 impose-t-il une réponse d’urgence ?', type: 'code', reponses: ['7', 'sept'], chiffre: '7', indice: 'Au-dessus de 5-6.', explication: '≥ 7 → 7.' },
    { titre: 'Gordon', texte: 'Combien de modes fonctionnels compte le modèle de Gordon ? Le chiffre à trouver est le chiffre des unités.', type: 'qcm', choix: ['10', '11', '14', '12'], b: 1, chiffre: '1', indice: 'Moins que Henderson.', explication: '11 → 1.' },
    { titre: 'Le cycle de Gibbs', texte: 'Remets les étapes dans l’ordre. Chiffre : le nombre d’étapes.', type: 'ordre', etapes: ['Description', 'Sentiments', 'Évaluation', 'Analyse', 'Conclusion', 'Plan d’action'], chiffre: '6', indice: 'Des faits jusqu’au plan.', explication: '6 étapes → 6.' },
    { titre: 'La perfusion', texte: '500 mL en 4 h à la pompe : débit en mL/h ? Le chiffre à trouver est le chiffre des centaines.', type: 'code', reponses: ['125', '1'], chiffre: '1', indice: 'Volume / durée.', explication: '125 mL/h → 1.' },
    { titre: 'La donnée subjective', texte: 'Laquelle est une donnée subjective ? Chiffre : 9 si tu trouves.', type: 'qcm', choix: ['PA 140/90', '« J’ai mal au ventre »', 'Œdème des chevilles', 'SpO₂ 94 %'], b: 1, chiffre: '9', indice: 'Ce que le patient dit.', explication: 'Exprimée par le patient → 9.' }
  ],
  mortelle: [
    { titre: 'Six patients, six services', intro: 'Tu es l’infirmière de renfort : six appels arrivent en même temps de services différents.', s: 'RAIS+NEWS',
      patients: [['Réa : patient ventilé, alarme de volume bas, saturation qui chute', 'B : ventilation défaillante chez un patient dépendant de la machine.'], ['SSPI : PA qui chute, pansement abdominal saturé de sang', 'C : hémorragie post-opératoire.'], ['Neuro : nouvelle anisocorie et Glasgow qui baisse', 'D : engagement possible, urgence neurochirurgicale.'], ['Médecine : patiente fébrile, NEWS2 à 5', 'Réévaluation urgente, mais moins immédiate que les trois premiers.'], ['Chirurgie : douleur à 7/10 après une prothèse de genou', 'Douleur à soulager rapidement.'], ['Unité : patient sortant qui attend ses papiers', 'Administratif, en dernier.']] },
    { titre: 'La nuit qui s’emballe', intro: 'Il est 3 h. Six situations arrivent dans le même quart d’heure.', s: 'RAIS+NEWS',
      patients: [['Réa : alarme du scope, patient qui ne répond pas et ne respire pas normalement', 'Arrêt cardiaque : massage immédiat.'], ['Réa : stridor et tirage une heure après une extubation', 'A : obstruction des voies aériennes.'], ['Réa : choc septique, PAM sous la cible malgré le remplissage', 'C : choc.'], ['Neuro : Glasgow passé de 15 à 13 après une évacuation d’hématome sous-dural', 'D : dégradation neurologique.'], ['Chirurgie : globe vésical douloureux', 'Inconfort important, à traiter rapidement.'], ['Téléphone : la famille d’un patient stable demande des nouvelles', 'Information, à rappeler quand la situation est sûre.']] },
    { titre: 'Renfort de jour', intro: 'Six collègues t’appellent à l’aide en même temps.', s: 'RAIS+NEWS',
      patients: [['Médecine : patient qui s’étouffe en mangeant, ne peut plus parler', 'A : obstruction complète des voies aériennes.'], ['Pneumologie : FR très rapide et saturation basse malgré l’oxygène', 'B : détresse respiratoire.'], ['Chirurgie cardiaque : drains qui donnent beaucoup de sang, tachycardie', 'C : hémorragie.'], ['Neuro : nouvelle faiblesse des deux jambes après une chirurgie du rachis', 'D : compression possible, urgence chirurgicale.'], ['Médecine : fièvre isolée, patient stable et orienté', 'À surveiller et transmettre.'], ['Pharmacie : commande de la semaine à valider', 'Logistique, en dernier.']] }
  ],
  sources: {
    ADA: 'American Diabetes Association — Standards of Care 2025, section 6 (hypoglycémie : niveau 2 < 54 mg/dL, règle des 15 g / 15 min) 🟢',
    NICEF: 'NICE — Falls: assessment and prevention in older people (chutes à l’hôpital, vérifications après une chute) 🟢',
    GCS: 'Teasdale et al., The Glasgow Coma Scale at 40 years, Lancet Neurol 2014 🟢',
    RAU: 'Rétention urinaire : protocoles locaux (seuils de sondage variables) 🟠'
  },
  gds: true,
  gardes: [
    {
      id: 'jug-confusion', titre: 'La dame qui n’est « pas comme d’habitude »', difficulte: 2,
      varier: { FC: 5, PAS: 8, SpO2: 1, FR: 2, T: 0.2 },
      intro: 'Stage de jugement clinique, unité de gériatrie. Il est 7 h 30. L’aide-soignante te dit : « Mme Rose M., 86 ans, n’est pas comme d’habitude ce matin. »',
      retenir: 'Une confusion nouvelle chez la personne âgée n’est jamais « l’âge » : NEWS2 (nouvelle confusion = 3 points), chercher les causes (infection, hypoglycémie, hypoxie, globe, médicaments), dépister le sepsis et appeler en SBAR.',
      sbar: ['Mme M., 86 ans, chambre 14 : nouvelle confusion depuis ce matin, NEWS2 élevé', 'Hospitalisée pour une chute il y a 4 jours, sonde urinaire posée aux urgences', 'Polypnée, PA basse, tachycardie, fièvre, urines troubles : je suspecte un sepsis d’origine urinaire', 'Je vous demande de venir l’évaluer maintenant'],
      noeuds: {
        debut: { heure: '07 h 30', patient: 'Mme M., 86 ans — gériatrie', v: { FC: 104, PAS: 112, PAD: 62, SpO2: 95, FR: 22, T: 38.1, GCS: 14 }, texte: 'Mme M., d’habitude bavarde et orientée, ne sait plus où elle est. Que fais-tu de cette information ?', s: 'TAN+NEWS', indice: 'Quelqu’un qui connaît la patiente a remarqué un changement.',
          choix: [
            { t: 'La prendre au sérieux : aller l’évaluer moi-même (ABCDE, paramètres complets, NEWS2)', q: 2, v: {}, fb: 'Tu « remarques » grâce à quelqu’un qui connaît la patiente.', suite: 'news' },
            { t: 'Lui dire de surveiller et de revenir si ça empire', q: 1, v: { FC: 110 }, fb: 'C’est à toi d’évaluer.', suite: 'news' },
            { t: 'C’est sûrement la démence de l’âge', q: 0, v: { FC: 114, PAS: 102, PAD: 58 }, fb: 'Biais d’ancrage : une confusion NOUVELLE est un signe d’alerte.', suite: 'comp_ancrage' }
          ] },
        comp_ancrage: { heure: '09 h 00', v: { FC: 122, PAS: 92, PAD: 50, FR: 26, T: 38.8, GCS: 13 }, texte: '⚠️ Complication : à 9 h, Mme M. est somnolente et brûlante. L’aide-soignante insiste.', s: 'NEWS+RAIS', indice: 'Il est encore temps : évalue et appelle.',
          choix: [
            { t: 'Évaluer immédiatement (NEWS2, recherche de cause) et appeler le médecin', q: 2, v: {}, fb: 'Rattrapage : la situation est reconnue, avec 1 h 30 de retard.', suite: 'causes' },
            { t: 'Attendre la visite', q: 0, v: { FC: 132, PAS: 80, PAD: 44 }, fb: 'Le sepsis évolue vers le choc.', suite: 'fin_mauvaise' }
          ] },
        news: { heure: '07 h 40', v: { FC: 112, PAS: 98, PAD: 56, FR: 24, T: 38.6 }, texte: 'FR élevée, SpO₂ un peu basse à l’air, PA basse, tachycardie, fièvre, nouvelle confusion. Que calcules-tu ?', s: 'NEWS', indice: 'Nouvelle confusion = 3 points à elle seule.',
          choix: [
            { t: 'Le NEWS2 : il dépasse largement 7 → réponse d’urgence', q: 2, v: {}, fb: 'NEWS2 ≥ 7 : réponse d’urgence ; c’est aussi l’outil de dépistage du sepsis recommandé par la SSC 2026.', suite: ['causes', 'evt_famille'] },
            { t: 'Seulement la température', q: 1, v: {}, fb: 'C’est l’ensemble qui montre la gravité.', suite: 'causes' },
            { t: 'Rien, je préfère attendre la visite', q: 0, v: { FC: 120, PAS: 92, PAD: 52 }, fb: 'Le score aurait montré qu’elle est en danger.', suite: 'comp_ancrage' }
          ] },
        evt_famille: { evenement: true, heure: '07 h 45', texte: 'Imprévu : le fils de Mme M. arrive et demande pourquoi sa mère « délire ».', s: 'RAIS', indice: 'Écouter, et utiliser ce qu’il sait.',
          choix: [
            { t: 'L’écouter brièvement : il confirme qu’elle était lucide hier. Tu lui dis que tu l’évalues et que le médecin va venir', q: 2, v: {}, fb: 'La famille confirme le caractère nouveau de la confusion : une donnée précieuse.', suite: 'causes' },
            { t: 'Lui dire que c’est l’âge', q: 0, v: {}, fb: 'Biais d’ancrage, et information erronée.', suite: 'causes' }
          ] },
        causes: { heure: '07 h 50', texte: 'En cherchant une cause, tu remarques que les urines de la sonde sont troubles et malodorantes.', s: 'SSC+RAIS', indice: 'Relie les données entre elles.',
          choix: [
            { t: 'Faire le lien (fièvre + confusion + urines troubles + sonde) : sepsis d’origine urinaire possible, et vérifier aussi glycémie et SpO₂', q: 2, v: {}, fb: 'Interpréter, c’est relier les données et chercher aussi les causes à ne pas rater.', suite: 'appel' },
            { t: 'Donner du paracétamol et réévaluer dans 4 h', q: 0, v: { FC: 124, PAS: 88, PAD: 48 }, fb: 'La fièvre baisse, mais le sepsis progresse.', suite: 'comp_sepsis' },
            { t: 'Changer la poche et passer à autre chose', q: 0, v: { FC: 124, PAS: 88, PAD: 48 }, fb: 'Un détail traité, la situation grave ratée.', suite: 'comp_sepsis' }
          ] },
        comp_sepsis: { heure: '10 h 00', v: { FC: 130, PAS: 82, PAD: 44, FR: 28, GCS: 12 }, texte: '⚠️ Complication : Mme M. a des marbrures et ne répond plus que par des sons.', s: 'SSC+NEWS', indice: 'Choc septique probable : antibiotiques dans l’heure, appel immédiat.',
          choix: [
            { t: 'Appel d’urgence en SBAR, préparer ce que le médecin prescrit (hémocultures, antibiotiques, remplissage)', q: 2, v: { PAS: 92, PAD: 52 }, fb: 'Rattrapage : traitement débuté, mais tardivement.', suite: 'apres_tard' },
            { t: 'Continuer la surveillance', q: 0, v: {}, fb: 'Le choc s’aggrave.', suite: 'fin_mauvaise' }
          ] },
        appel: { heure: '07 h 55', texte: 'Tu appelles le médecin. Il est en réunion et répond : « Je passe à 11 h. »', s: 'SBAR+NEWS', indice: 'Données objectives + demande claire + escalade si besoin.',
          choix: [
            { t: 'Répéter calmement le NEWS2 très élevé et la suspicion de sepsis, et demander qu’il vienne maintenant ; sinon suivre la procédure d’escalade du service', q: 2, v: {}, fb: 'Savoir insister avec des données objectives fait partie du jugement clinique.', suite: 'apres' },
            { t: 'Accepter et attendre 11 h', q: 0, v: { FC: 124, PAS: 88, PAD: 48 }, fb: '3 heures de retard pour un sepsis probable : dangereux.', suite: 'comp_sepsis' },
            { t: 'Démarrer toi-même des antibiotiques trouvés dans l’armoire', q: 0, v: {}, fb: 'Jamais sans prescription.', suite: 'comp_sepsis' }
          ] },
        apres: { heure: '08 h 30', v: { FC: 100, PAS: 108, PAD: 62, FR: 20, T: 38.2, GCS: 14 }, texte: 'Le médecin est venu, a prescrit hémocultures, ECBU et antibiotiques. Qu’est-ce qui t’attend maintenant ?', s: 'SSC+TAN', indice: 'Répondre, c’est aussi suivre l’effet du traitement.',
          choix: [
            { t: 'Réévaluer régulièrement (NEWS2, conscience, diurèse), vérifier l’effet du traitement et tracer', q: 2, v: { FC: 94, GCS: 15 }, fb: 'Le suivi de l’effet fait partie de la réponse.', suite: 'reflex' },
            { t: 'Surveiller seulement la température', q: 1, v: {}, fb: 'La surveillance doit être globale.', suite: 'reflex' },
            { t: 'Considérer que c’est réglé', q: 0, v: { FC: 108 }, fb: 'Un sepsis peut s’aggraver dans les heures qui suivent.', suite: 'reflex' }
          ] },
        apres_tard: { heure: '11 h 00', v: { FC: 112, PAS: 96, PAD: 54 }, texte: 'Mme M. est traitée, mais a passé du temps en choc. Que surveilles-tu ?', s: 'SSC+NEWS', indice: 'Les organes qui souffrent en premier.',
          choix: [
            { t: 'Surveillance rapprochée : NEWS2, conscience, diurèse, et signaler toute dégradation', q: 2, v: {}, fb: 'La suite dépendra de la réponse au traitement.', suite: 'fin_moyenne' },
            { t: 'Repasser en fin de journée', q: 0, v: {}, fb: 'Elle reste instable.', suite: 'fin_mauvaise' }
          ] },
        reflex: { heure: '14 h 00', texte: 'En fin de journée, ta référente te demande : « Qu’est-ce qui t’a mise sur la piste ce matin ? »', s: 'TAN+GIBBS', indice: 'Remarquer, interpréter, répondre… puis réfléchir.',
          choix: [
            { t: 'Expliquer ton raisonnement et ce que tu ferais plus vite la prochaine fois', q: 2, v: {}, fb: 'La phase « réfléchir » construit l’intuition clinique.', suite: 'fin_bonne' },
            { t: '« C’est l’aide-soignante qui a tout vu »', q: 1, v: {}, fb: 'Elle a remarqué, tu as interprété et agi : les deux comptent.', suite: 'fin_bonne' },
            { t: '« J’ai eu de la chance »', q: 0, v: {}, fb: 'C’est un raisonnement à rendre explicite.', suite: 'fin_moyenne' }
          ] },
        fin_bonne: { fin: true, issue: 'bonne', titre: 'Sepsis repéré tôt', texte: 'Mme M. a été traitée rapidement et s’améliore. La remarque de l’aide-soignante a été la clé.' },
        fin_moyenne: { fin: true, issue: 'moyenne', titre: 'Sepsis traité avec retard', texte: 'Mme M. est traitée, mais le retard a aggravé son état. Rejoue : une confusion nouvelle = urgence.' },
        fin_mauvaise: { fin: true, issue: 'mauvaise', titre: 'Choc septique non reconnu', texte: 'Mme M. a évolué vers le choc septique. Rejoue : ne jamais attribuer une confusion nouvelle « à l’âge ».' }
      }
    },
    {
      id: 'jug-erreur', titre: 'L’erreur de 9 h', difficulte: 2,
      varier: { FC: 5, PAS: 8, SpO2: 1, FR: 2, T: 0.2 },
      intro: 'Il est 10 h. En préparant les médicaments de midi, tu te rends compte que tu as donné à 9 h à M. Jean C. le comprimé prévu pour son voisin de chambre.',
      retenir: 'Après une erreur : la sécurité du patient d’abord (évaluer, prévenir), puis la transparence (signaler, déclarer selon la procédure, informer le patient selon l’organisation), puis apprendre (analyse sans culpabilisation, actions pour éviter la récidive).',
      sbar: ['M. C., 74 ans, chambre 8 : il a reçu par erreur à 9 h un comprimé destiné à son voisin (antihypertenseur)', 'Hospitalisé pour une pneumonie, pas de traitement antihypertenseur habituel', 'Actuellement PA un peu plus basse que d’habitude, pas de malaise, conscient et orienté', 'Je demande votre avis sur la surveillance à mettre en place'],
      noeuds: {
        debut: { heure: '10 h 00', patient: 'M. C., 74 ans — pneumonie', v: { FC: 72, PAS: 108, PAD: 64, SpO2: 96, FR: 18, T: 37.6, GCS: 15 }, texte: 'Tu as un coup de chaud : M. C. a pris un antihypertenseur qui ne lui était pas destiné. Quelle est ta première action ?', s: 'MED+RAIS', indice: 'La sécurité du patient d’abord.',
          choix: [
            { t: 'Aller voir M. C. : paramètres, état de conscience, et prévenir immédiatement ton infirmière référente', q: 2, v: {}, fb: 'On évalue et on alerte.', suite: 'medecin' },
            { t: 'Ne rien dire et surveiller discrètement', q: 0, v: { PAS: 98, PAD: 58 }, fb: 'Cacher une erreur prive le patient d’une prise en charge adaptée.', suite: 'comp_cache' },
            { t: 'Donner le bon comprimé à M. C. pour compenser', q: 0, v: { PAS: 96, PAD: 56 }, fb: 'Jamais sans avis : risque d’une deuxième erreur.', suite: 'comp_cache' }
          ] },
        comp_cache: { heure: '11 h 30', v: { FC: 64, PAS: 88, PAD: 50, GCS: 15 }, texte: '⚠️ Complication : M. C. a un malaise en se levant pour aller aux toilettes. Sa PA est basse.', s: 'MED+RAIS', indice: 'Il est encore temps d’être transparente.',
          choix: [
            { t: 'Le recoucher, prévenir immédiatement en expliquant l’erreur, et suivre les consignes', q: 2, v: { PAS: 98, PAD: 56 }, fb: 'Rattrapage : la transparence permet une prise en charge adaptée.', suite: 'medecin' },
            { t: 'Dire que c’est sa pneumonie', q: 0, v: {}, fb: 'L’équipe cherche une mauvaise piste.', suite: 'fin_mauvaise' }
          ] },
        medecin: { heure: '10 h 10', texte: 'Ta référente appelle le médecin avec toi. Il prescrit une surveillance de la PA toutes les heures. Ensuite ?', s: 'MED+LEGAL', indice: 'Surveiller, tracer, déclarer.',
          choix: [
            { t: 'Réaliser la surveillance, tracer, et faire la déclaration d’incident selon la procédure', q: 2, v: {}, fb: 'La déclaration sert à améliorer le système, pas à punir.', suite: ['voisin', 'evt_cadre'] },
            { t: 'Demander à quelqu’un d’autre de le déclarer à ta place', q: 1, v: {}, fb: 'Tu es la mieux placée pour décrire ce qui s’est passé.', suite: 'voisin' },
            { t: 'Surveiller sans rien écrire', q: 0, v: {}, fb: 'La traçabilité protège le patient et toi.', suite: 'voisin' }
          ] },
        evt_cadre: { evenement: true, heure: '10 h 30', texte: 'Imprévu : l’infirmière en chef passe et te demande, l’air sérieux, ce qui s’est passé.', s: 'MED', indice: 'Les faits, sans te cacher ni te flageller.',
          choix: [
            { t: 'Lui expliquer les faits calmement et ce qui a été mis en place', q: 2, v: {}, fb: 'La culture de sécurité repose sur la transparence.', suite: 'voisin' },
            { t: 'Minimiser : « ce n’est rien »', q: 0, v: {}, fb: 'Minimiser empêche d’apprendre de l’erreur.', suite: 'voisin' }
          ] },
        voisin: { heure: '10 h 40', patient: 'M. F., voisin de chambre', v: { FC: 88, PAS: 168, PAD: 94, SpO2: 97, FR: 16, T: 36.9, GCS: 15 }, texte: 'Et le voisin, M. F. ? Il n’a pas reçu son antihypertenseur. Sa PA est élevée.', s: 'MED', indice: 'Une erreur concerne souvent deux patients.',
          choix: [
            { t: 'Le signaler aussi au médecin pour décider de la conduite à tenir', q: 2, v: { PAS: 152, PAD: 86 }, fb: 'Celui qui a reçu et celui qui n’a pas reçu sont concernés.', suite: 'cause' },
            { t: 'Lui donner son comprimé maintenant sans rien demander', q: 1, v: {}, fb: 'L’horaire et la dose se valident avec le médecin.', suite: 'cause' },
            { t: 'L’oublier, il n’a rien pris de travers', q: 0, v: { PAS: 178, PAD: 98 }, fb: 'Il a manqué son traitement.', suite: 'cause' }
          ] },
        cause: { heure: '13 h 00', texte: 'Avec ta référente, vous cherchez comment l’erreur s’est produite. Les deux piluliers étaient côte à côte, tu as été interrompue 3 fois.', s: 'MED+RAIS', indice: 'On cherche les failles, pas un coupable.',
          choix: [
            { t: 'Analyser les causes (interruptions, rangement, identification du patient au lit) et proposer des actions concrètes', q: 2, v: {}, fb: 'Vérifier l’identité au lit, limiter les interruptions pendant la préparation.', suite: 'patient' },
            { t: 'Conclure que tu es nulle', q: 1, v: {}, fb: 'La culpabilité n’empêche pas la récidive ; l’analyse, si.', suite: 'patient' },
            { t: 'Accuser les collègues qui t’ont interrompue', q: 0, v: {}, fb: 'Chercher un coupable n’améliore pas la sécurité.', suite: 'patient' }
          ] },
        patient: { heure: '15 h 00', v: { FC: 70, PAS: 118, PAD: 70 }, texte: 'M. C. va bien. Il te demande : « Il s’est passé quelque chose ce matin ? Vous aviez l’air inquiète. »', s: 'MED+LEGAL', indice: 'Transparence, en accord avec l’équipe.',
          choix: [
            { t: 'Être honnête, en accord avec l’équipe et selon l’organisation du service : expliquer, rassurer sur la surveillance, s’excuser', q: 2, v: {}, fb: 'La transparence fait partie de la relation de confiance.', suite: 'fin_bonne' },
            { t: 'Changer de sujet', q: 1, v: {}, fb: 'Il pose une question directe : il mérite une réponse.', suite: 'fin_moyenne' },
            { t: 'Mentir : « Non, rien du tout »', q: 0, v: {}, fb: 'Mentir abîme la confiance.', suite: 'fin_moyenne' }
          ] },
        fin_bonne: { fin: true, issue: 'bonne', titre: 'Erreur bien gérée', texte: 'Les deux patients vont bien, l’erreur est déclarée et analysée, et M. C. a confiance en l’équipe.' },
        fin_moyenne: { fin: true, issue: 'moyenne', titre: 'Patients sains et saufs, mais…', texte: 'Les patients vont bien, mais la transparence ou l’analyse ont manqué.' },
        fin_mauvaise: { fin: true, issue: 'mauvaise', titre: 'Erreur cachée', texte: 'L’erreur cachée a conduit à une mauvaise prise en charge. Rejoue : signaler protège le patient… et toi.' }
      }
    },
    {
      id: 'jug-chute', titre: 'Chute à 2 h du matin', difficulte: 2,
      varier: { FC: 5, PAS: 8, SpO2: 1, FR: 2, T: 0.2 },
      intro: 'Nuit en médecine interne. Il est 2 h. Tu entends un bruit sourd dans la chambre 6 : M. André V., 79 ans, diabétique sous insuline, sous anticoagulant, est au sol.',
      retenir: 'Après une chute : ne pas relever tout de suite, évaluer (conscience, douleur, déformation, saignement), chercher la cause (hypoglycémie, malaise, hypotension…), surveillance neurologique si anticoagulant ou choc à la tête, prévenir le médecin, déclarer et réévaluer le risque de chute.',
      sbar: ['M. V., 79 ans, chambre 6 : chute avec choc à la tête, retrouvé au sol', 'Diabétique sous insuline, sous anticoagulant, hospitalisé pour décompensation cardiaque', 'Hypoglycémie corrigée selon le protocole, Glasgow 15, hématome frontal, pas de déformation', 'Je vous demande de venir l’examiner : sous anticoagulant avec choc à la tête'],
      noeuds: {
        debut: { heure: '02 h 00', patient: 'M. V., 79 ans — médecine interne', v: { FC: 98, PAS: 124, PAD: 70, SpO2: 96, FR: 18, T: 36.6, GCS: 14 }, texte: 'M. V. est assis au sol, un peu confus, une bosse au front. Que fais-tu ?', s: 'NICEF', indice: 'Évaluer avant de relever.',
          choix: [
            { t: 'Ne pas le relever tout de suite : appeler de l’aide, évaluer conscience, douleur, déformation d’un membre, saignement', q: 2, v: {}, fb: 'Relever un patient avec une fracture peut aggraver la lésion.', suite: 'gly' },
            { t: 'Lui demander de se relever seul', q: 1, v: { FC: 104 }, fb: 'Il est confus et peut-être blessé.', suite: 'gly' },
            { t: 'Le relever seule immédiatement et le recoucher', q: 0, v: { FC: 112 }, fb: 'Risque d’aggraver une fracture et de te blesser.', suite: 'comp_hanche' }
          ] },
        comp_hanche: { heure: '02 h 05', v: { FC: 118, PAS: 132, PAD: 76 }, texte: '⚠️ Complication : en le relevant, il hurle de douleur à la hanche droite ; sa jambe semble raccourcie et tournée vers l’extérieur.', s: 'NICEF', indice: 'Fracture probable : immobiliser et appeler.',
          choix: [
            { t: 'Le réinstaller avec aide sans mobiliser la jambe, antalgie selon prescription, prévenir le médecin', q: 2, v: { FC: 104 }, fb: 'Rattrapage : la fracture est prise en charge, mais la mobilisation a été douloureuse.', suite: 'gly' },
            { t: 'Le faire marcher pour voir', q: 0, v: {}, fb: 'Aggravation de la fracture.', suite: 'fin_mauvaise' }
          ] },
        gly: { heure: '02 h 08', texte: 'Il est en sueur et tremble. Quel examen rapide fais-tu ?', s: 'ADA', indice: 'Diabétique sous insuline + sueurs + confusion.',
          choix: [
            { t: 'Une glycémie capillaire immédiate', q: 2, v: {}, fb: 'Glycémie à 52 mg/dL : hypoglycémie de niveau 2 (< 54 mg/dL), probable cause de la chute.', suite: ['resucre', 'evt_voisin'] },
            { t: 'Une prise de sang au labo', q: 1, v: {}, fb: 'Trop lent : la glycémie capillaire répond en 30 secondes.', suite: 'resucre' },
            { t: 'Rien, il a glissé', q: 0, v: { GCS: 13 }, fb: 'Toujours chercher la cause d’une chute.', suite: 'comp_hypo' }
          ] },
        comp_hypo: { heure: '02 h 30', v: { FC: 112, GCS: 12 }, texte: '⚠️ Complication : M. V. devient de moins en moins réactif.', s: 'ADA', indice: 'La cause n’a pas été cherchée…',
          choix: [
            { t: 'Glycémie capillaire immédiate, protocole d’hypoglycémie (voie adaptée s’il ne peut plus avaler) et appel', q: 2, v: { GCS: 15 }, fb: 'Rattrapage : l’hypoglycémie est corrigée.', suite: 'neuro' },
            { t: 'Le laisser dormir', q: 0, v: { GCS: 9 }, fb: 'Une hypoglycémie profonde menace le cerveau.', suite: 'fin_mauvaise' }
          ] },
        evt_voisin: { evenement: true, heure: '02 h 10', texte: 'Imprévu : le voisin de chambre, réveillé, demande ce qui se passe et s’inquiète.', s: 'RAIS', indice: 'Une phrase rassurante, puis ton patient.',
          choix: [
            { t: 'Le rassurer en une phrase, sans détail médical, et continuer ta prise en charge', q: 2, v: {}, fb: 'Secret professionnel et priorité au patient.', suite: 'resucre' },
            { t: 'Lui expliquer en détail la situation de M. V.', q: 0, v: {}, fb: 'Secret professionnel.', suite: 'resucre' }
          ] },
        resucre: { heure: '02 h 12', v: { GCS: 15 }, texte: 'Il est conscient et peut avaler. Comment corriges-tu l’hypoglycémie ?', s: 'ADA', indice: 'La règle des 15.',
          choix: [
            { t: 'Selon le protocole : environ 15 g de sucre rapide par la bouche, contrôle à 15 minutes, à répéter si besoin, puis collation', q: 2, v: { FC: 90 }, fb: 'Règle des 15 g / 15 minutes (ADA) ; le protocole du service prime.', suite: 'neuro' },
            { t: 'Lui faire manger un repas complet tout de suite', q: 1, v: {}, fb: 'Sucre rapide d’abord, collation ensuite.', suite: 'neuro' },
            { t: 'Attendre le petit-déjeuner', q: 0, v: { GCS: 13 }, fb: 'L’hypoglycémie doit être corrigée immédiatement.', suite: 'comp_hypo' }
          ] },
        neuro: { heure: '02 h 30', v: { FC: 86, PAS: 128, PAD: 72 }, texte: 'Glycémie de contrôle correcte. Il est réinstallé. Il a un hématome au front et prend un anticoagulant.', s: 'NICEF+GCS', indice: 'Anticoagulant + choc à la tête…',
          choix: [
            { t: 'Prévenir le médecin et mettre en place une surveillance neurologique (Glasgow, pupilles) selon le protocole', q: 2, v: {}, fb: 'Risque de saignement intracrânien retardé.', suite: 'prev' },
            { t: 'Il va bien, on se revoit au matin', q: 1, v: {}, fb: 'Le risque de saignement retardé impose une surveillance.', suite: 'comp_hsd' },
            { t: 'Lui donner un somnifère pour qu’il se rendorme', q: 0, v: {}, fb: 'Gêne la surveillance neurologique et augmente le risque de chute.', suite: 'comp_hsd' }
          ] },
        comp_hsd: { heure: '06 h 00', v: { FC: 70, PAS: 158, PAD: 84, GCS: 13 }, texte: '⚠️ Complication : au matin, M. V. est somnolent et confus.', s: 'NICEF+GCS', indice: 'Anticoagulant + chute + nouvelle confusion.',
          choix: [
            { t: 'Évaluation neuro complète et appel immédiat du médecin (hématome intracrânien ?)', q: 2, v: {}, fb: 'Rattrapage : une imagerie est réalisée en urgence.', suite: 'fin_moyenne' },
            { t: 'Le laisser dormir', q: 0, v: { GCS: 10 }, fb: 'Le saignement progresse.', suite: 'fin_mauvaise' }
          ] },
        prev: { heure: '03 h 00', texte: 'Que mets-tu en place pour éviter une nouvelle chute cette nuit ?', s: 'NICEF', indice: 'Environnement + cause.',
          choix: [
            { t: 'Lit bas, sonnette à portée, veilleuse, chaussures adaptées, passages réguliers, et signaler l’insuline/le repas du soir au médecin', q: 2, v: {}, fb: 'On agit sur l’environnement et sur la cause.', suite: 'decl' },
            { t: 'Rien de particulier', q: 1, v: {}, fb: 'Une chute est un facteur de risque majeur de nouvelle chute.', suite: 'decl' },
            { t: 'Mettre les quatre barrières et l’attacher', q: 0, v: {}, fb: 'Barrières et contentions augmentent le risque de chute grave et l’agitation.', suite: 'decl' }
          ] },
        decl: { heure: '05 h 00', texte: 'Avant la fin de ta nuit…', s: 'NICEF+MED', indice: 'Écrire, déclarer, transmettre.',
          choix: [
            { t: 'Tracer la chute, l’évaluation et la surveillance, déclarer l’incident et transmettre à l’équipe de jour', q: 2, v: {}, fb: 'La déclaration aide à prévenir les chutes dans le service.', suite: 'fin_bonne' },
            { t: 'En parler oralement seulement', q: 1, v: {}, fb: 'L’oral ne suffit pas.', suite: 'fin_moyenne' },
            { t: 'Ne rien écrire puisqu’il va bien', q: 0, v: {}, fb: 'L’équipe de jour doit savoir.', suite: 'fin_moyenne' }
          ] },
        fin_bonne: { fin: true, issue: 'bonne', titre: 'Chute bien prise en charge', texte: 'La cause (hypoglycémie) a été traitée, la surveillance neuro mise en place et la prévention renforcée.' },
        fin_moyenne: { fin: true, issue: 'moyenne', titre: 'Chute gérée, avec des manques', texte: 'M. V. va mieux, mais la surveillance ou la traçabilité ont été incomplètes.' },
        fin_mauvaise: { fin: true, issue: 'mauvaise', titre: 'Complication grave après la chute', texte: 'Fracture aggravée, hypoglycémie profonde ou saignement passé inaperçu. Rejoue : évaluer, chercher la cause, surveiller.' }
      }
    }
  ],
  situations: [
    { patient: 'Médecine — Mme A., 80 ans', v: { FC: 96, PAS: 132, PAD: 76, SpO2: 92, FR: 26, T: 37.2, GCS: 15 }, texte: 'Mme A. « va bien » selon elle, mais sa FR est à 26 alors qu’elle était à 16 hier.', s: 'NEWS', stage: 'Compte la FR pendant une vraie minute : c’est le paramètre le plus souvent oublié.',
      choix: [{ t: 'Calculer le NEWS2 complet (FR ≥ 25 = 3 points) et demander un avis médical urgent', q: 2, fb: 'Un seul paramètre à 3 déclenche une réévaluation urgente.' }, { t: 'Elle dit aller bien, donc ce n’est rien', q: 0, fb: 'La FR est souvent le premier signe de dégradation.' }, { t: 'Recompter demain', q: 0, fb: 'Trop tard si elle se dégrade.' }] },
    { patient: 'Chirurgie — M. B., 68 ans', texte: 'Le médecin prescrit par téléphone : « Donne-lui 10 unités d’insuline rapide. »', s: 'SBAR+MED', stage: 'Pour une prescription orale : répète-la (read-back) et note-la, selon la procédure.',
      choix: [{ t: 'Répéter la prescription à voix haute (molécule, dose, voie), la noter et la faire signer selon la procédure', q: 2, fb: 'Le read-back évite les erreurs d’écoute (« 10 » ou « 1,0 » ? « unités » ?).' }, { t: 'L’exécuter directement', q: 0, fb: 'Risque d’erreur non détectée.' }, { t: 'Refuser toute prescription orale', q: 1, fb: 'En urgence, elle peut être acceptée selon la procédure : on la sécurise.' }] },
    { patient: 'Gériatrie — Mme C., 91 ans', texte: 'Mme C. refuse sa toilette et dit : « Laissez-moi tranquille aujourd’hui. »', s: 'LEGAL+RAIS', stage: 'Le refus d’un soin se respecte, se comprend, se négocie et se trace.',
      choix: [{ t: 'Chercher à comprendre (douleur, fatigue, pudeur ?), proposer une alternative ou un autre moment, et tracer', q: 2, fb: 'Le patient a le droit de refuser un soin. On cherche la raison et une solution acceptable.' }, { t: 'Faire la toilette quand même', q: 0, fb: 'Forcer un soin non urgent n’est pas respectueux de ses droits.' }, { t: 'Ne plus jamais lui proposer', q: 0, fb: 'Un refus un jour n’est pas un refus définitif.' }] },
    { patient: 'Médecine — M. D., 72 ans', v: { FC: 118, PAS: 88, PAD: 50, SpO2: 94, FR: 24, T: 38.9, GCS: 14 }, texte: 'Fièvre, PA basse, confusion nouvelle. Le médecin passe dans 2 heures.', s: 'SSC+NEWS', stage: 'Sepsis probable = antibiotiques dans l’heure : ne laisse pas « attendre la visite ».',
      choix: [{ t: 'Appeler maintenant (NEWS2 élevé, suspicion de sepsis) et préparer les hémocultures selon prescription', q: 2, fb: 'NEWS2 élevé + suspicion d’infection : sepsis à dépister et traiter vite.' }, { t: 'Attendre la visite', q: 0, fb: '2 heures de retard peuvent être graves.' }, { t: 'Donner du paracétamol', q: 0, fb: 'Ça masque la fièvre sans traiter.' }] },
    { patient: 'Chirurgie — Mme E., 45 ans', texte: 'La pompe à morphine est réglée sur un débit 10 fois supérieur à la prescription.', s: 'MED', stage: 'Double vérification des médicaments à haut risque : à chaque changement de seringue ou de débit.',
      choix: [{ t: 'Arrêter la pompe, évaluer la patiente (conscience, FR, SpO₂) et prévenir immédiatement', q: 2, fb: 'Surdosage en opioïde : risque de dépression respiratoire. Sécurité d’abord.' }, { t: 'Corriger le débit sans rien dire', q: 0, fb: 'La patiente a peut-être déjà reçu trop : elle doit être évaluée et l’incident déclaré.' }, { t: 'Attendre de voir si elle s’endort', q: 0, fb: 'Danger.' }] },
    { patient: 'Bloc / SSPI — M. F., 60 ans', v: { FC: 64, PAS: 108, PAD: 62, SpO2: 91, FR: 7, T: 36.2, GCS: 12 }, texte: 'En SSPI, M. F. est très somnolent sous morphinique et respire 7 fois par minute.', s: 'RAIS', stage: 'Fréquence respiratoire et niveau de sédation : les deux à surveiller sous opioïdes.',
      choix: [{ t: 'Le stimuler, O₂, appeler l’anesthésiste', q: 2, fb: 'Dépression respiratoire probable.' }, { t: 'Le laisser dormir', q: 0, fb: 'FR à 7 = danger.' }, { t: 'Lui redonner un antalgique', q: 0, fb: 'Cela aggrave la dépression respiratoire.' }] },
    { patient: 'Neuro — Mme G., 54 ans', v: { FC: 62, PAS: 172, PAD: 88, SpO2: 96, FR: 12, T: 37.0, GCS: 11 }, texte: 'Glasgow passé de 14 à 11, FC 62, PA 172/88.', s: 'NEWS+RAIS', stage: 'Glasgow détaillé + pupilles à chaque contrôle.',
      choix: [{ t: 'Urgence : appeler immédiatement, vérifier les pupilles, rester auprès d’elle', q: 2, fb: 'Baisse de conscience + HTA + FC qui baisse : hypertension intracrânienne possible.' }, { t: 'Lui donner un antihypertenseur', q: 0, fb: 'Pas sans avis médical : l’HTA peut être un mécanisme de compensation.' }, { t: 'Réévaluer dans 2 h', q: 0, fb: 'Trop tard.' }] },
    { patient: 'Réa — M. H., 66 ans', v: { FC: 126, PAS: 84, PAD: 48, SpO2: 93, FR: 28, T: 38.7, GCS: 14 }, texte: 'Lactates à 4,8 mmol/L, PAM 60 malgré le remplissage.', s: 'SSC', stage: 'PAM = (PAS + 2 × PAD) / 3 : sais-la calculer de tête.',
      choix: [{ t: 'Appeler immédiatement : critères de choc septique (vasopresseur probable)', q: 2, fb: 'Hypotension malgré remplissage + lactate > 2 mmol/L.' }, { t: 'Continuer à surveiller', q: 0, fb: 'Le choc s’aggrave.' }, { t: 'Refaire les lactates dans 6 h', q: 0, fb: 'Trop tard.' }] },
    { patient: 'Médecine — Mme I., 77 ans', texte: 'Sa fille te dit : « Maman ne mange plus rien depuis 3 jours et dort tout le temps. » Ce n’est pas noté dans le dossier.', s: 'TAN+RAIS', stage: 'La famille connaît le patient « habituel » : écoute-la.',
      choix: [{ t: 'Prendre l’information au sérieux, évaluer la patiente (conscience, hydratation, glycémie) et la transmettre', q: 2, fb: 'Remarquer, c’est aussi écouter les proches : c’est une donnée subjective précieuse.' }, { t: 'Répondre que les personnes âgées mangent peu', q: 0, fb: 'Biais : un changement récent doit être exploré.' }, { t: 'Lui dire d’en parler au médecin elle-même', q: 1, fb: 'C’est à toi de faire remonter l’information.' }] },
    { patient: 'Chirurgie — M. J., 70 ans', v: { FC: 92, PAS: 148, PAD: 84, SpO2: 97, FR: 18, T: 37.0, GCS: 15 }, texte: 'Opéré il y a 8 h, il n’a pas uriné, il est agité et se plaint du bas-ventre.', s: 'RAU+RAIS', stage: 'Agitation chez une personne âgée opérée : pense au globe vésical.',
      choix: [{ t: 'Rechercher un globe vésical (palpation, bladder scan) et appliquer le protocole', q: 2, fb: 'La rétention urinaire est une cause classique d’agitation post-opératoire.' }, { t: 'Lui donner un calmant', q: 0, fb: 'On masque la cause.' }, { t: 'Le faire boire', q: 0, fb: 'La vessie est déjà pleine.' }] },
    { patient: 'Médecine — Mme K., 62 ans, BPCO', v: { FC: 96, PAS: 136, PAD: 80, SpO2: 89, FR: 20, T: 37.1, GCS: 15 }, texte: 'Le médecin a prescrit une cible de SpO₂ de 88-92 % (BPCO hypercapnique). Une collègue veut monter l’O₂ pour atteindre 98 %.', s: 'NEWS', stage: 'La cible de saturation est une prescription : connais-la pour chaque patient sous O₂.',
      choix: [{ t: 'Rappeler la cible prescrite (88-92 %) : SpO₂ 89 % est dans la cible', q: 2, fb: 'Trop d’oxygène peut aggraver l’hypercapnie chez certains BPCO. Le NEWS2 utilise alors l’échelle SpO₂ 2.' }, { t: 'La laisser monter l’O₂', q: 0, fb: 'Risque d’hypercapnie.' }, { t: 'Retirer l’oxygène', q: 0, fb: 'Elle risquerait de passer sous la cible.' }] },
    { patient: 'Unité — transmission', texte: 'Ta collègue te transmet : « Lit 4, RAS. » Le patient est arrivé hier après une chute, sous anticoagulant.', s: 'SBAR+RAIS', stage: 'Une transmission ciblée contient le problème, les actions et les résultats.',
      choix: [{ t: 'Demander les précisions utiles : évaluation neuro, consignes de surveillance, dernier contrôle', q: 2, fb: '« RAS » n’est pas une transmission : il manque les éléments de surveillance d’un patient à risque.' }, { t: 'Accepter « RAS »', q: 0, fb: 'Risque d’oublier une surveillance importante.' }, { t: 'Relire tout le dossier depuis l’admission', q: 1, fb: 'Utile si tu as le temps, mais demande d’abord à ta collègue.' }] },
    { patient: 'Médecine — M. Q., 77 ans', v: { FC: 112, PAS: 96, PAD: 56, SpO2: 92, FR: 24, T: 38.7, GCS: 14 }, texte: 'Ta collègue a noté « patient un peu fatigué ». Tu calcules un NEWS2 élevé.', s: 'NEWS', stage: 'Un score d’alerte transforme une impression en donnée objective.',
      choix: [{ t: 'Réponse adaptée au score : avis médical urgent en SBAR et surveillance rapprochée', q: 2, fb: 'Le NEWS2 objective la gravité.' }, { t: 'Le laisser se reposer', q: 0, fb: 'La fatigue cache une dégradation.' }, { t: 'Refaire le score demain', q: 0, fb: 'Trop tard.' }] },
    { patient: 'Chirurgie — Mme R., 60 ans', texte: 'Tu prépares ses médicaments quand une collègue t’interrompt pour la troisième fois.', s: 'MED', stage: 'Signale que tu prépares des médicaments (gilet, zone calme) selon l’organisation du service.',
      choix: [{ t: 'Lui demander d’attendre la fin de ta préparation, puis reprendre ta vérification depuis le début', q: 2, fb: 'Les interruptions favorisent les erreurs.' }, { t: 'Continuer en parlant avec elle', q: 0, fb: 'Risque d’erreur.' }, { t: 'Laisser tomber la préparation', q: 1, fb: 'Il vaut mieux finir calmement.' }] },
    { patient: 'Gériatrie — M. S., 88 ans', texte: 'M. S. refuse de manger depuis 2 jours. L’équipe dit : « Il est vieux, c’est normal. »', s: 'RAIS+TAN', stage: 'Un changement de comportement se cherche, il ne s’explique pas « par l’âge ».',
      choix: [{ t: 'Chercher les causes (douleur buccale, déglutition, humeur, infection, médicaments) et transmettre', q: 2, fb: 'Biais d’ancrage évité : on explore.' }, { t: 'Accepter, c’est l’âge', q: 0, fb: 'Biais d’ancrage.' }, { t: 'Le forcer à manger', q: 0, fb: 'Non respectueux et dangereux.' }] },
    { patient: 'Médecine — Mme T., 69 ans', v: { FC: 104, PAS: 148, PAD: 86, SpO2: 88, FR: 24, T: 37.2, GCS: 15 }, texte: 'Mme T., BPCO, a une cible de SpO₂ prescrite à 88-92 %. Elle est essoufflée et inquiète, SpO₂ 88 %.', s: 'NEWS', stage: 'Connais la cible de saturation prescrite pour chaque patient sous O₂.',
      choix: [{ t: 'Évaluer complètement (FR, effort respiratoire, conscience) et prévenir si elle se dégrade, en respectant la cible prescrite', q: 2, fb: 'La SpO₂ est dans la cible, mais l’essoufflement se surveille.' }, { t: 'Mettre 15 L/min d’O₂', q: 0, fb: 'Risque d’hypercapnie chez cette patiente.' }, { t: 'Ne rien faire, la SpO₂ est dans la cible', q: 1, fb: 'La cible est atteinte, mais l’état clinique compte aussi.' }] },
    { patient: 'Neuro — M. U., 50 ans', v: { FC: 66, PAS: 168, PAD: 86, SpO2: 96, FR: 12, T: 37.0, GCS: 12 }, texte: 'M. U., traumatisé crânien, est plus somnolent qu’il y a 2 heures, sa PA monte et sa FC baisse.', s: 'NEWS+RAIS', stage: 'Compare toujours au Glasgow précédent.',
      choix: [{ t: 'Évaluer les pupilles, appeler immédiatement le médecin, rester auprès de lui', q: 2, fb: 'Baisse de conscience + HTA + FC qui baisse : hypertension intracrânienne possible.' }, { t: 'Lui donner un antihypertenseur', q: 0, fb: 'Pas sans avis médical.' }, { t: 'Le laisser dormir', q: 0, fb: 'Somnolence nouvelle = alerte.' }] },
    { patient: 'Bloc / SSPI — Mme V., 54 ans', v: { FC: 124, PAS: 86, PAD: 50, SpO2: 95, FR: 22, T: 36.3, GCS: 15 }, texte: 'Pansement abdominal qui se teinte rapidement, tachycardie, PA en baisse.', s: 'RAIS', stage: 'Note l’aspect du pansement à chaque contrôle.',
      choix: [{ t: 'Appel immédiat du chirurgien en SBAR (hémorragie ?) et surveillance rapprochée', q: 2, fb: 'C de l’ABCDE.' }, { t: 'Renforcer le pansement et attendre', q: 1, fb: 'L’appel est prioritaire.' }, { t: 'Donner un antalgique', q: 0, fb: 'Ce n’est pas la priorité.' }] },
    { patient: 'Réa — M. W., 63 ans', v: { FC: 128, PAS: 82, PAD: 46, SpO2: 92, FR: 28, T: 38.9, GCS: 14 }, texte: 'Sepsis probable : les antibiotiques prescrits ne sont pas encore administrés 50 minutes après la prescription.', s: 'SSC', stage: 'Pour un sepsis probable : antibiotiques dans l’heure.',
      choix: [{ t: 'Tout mettre en œuvre pour les administrer immédiatement (relancer la pharmacie, stock d’urgence) et prévenir le médecin du retard', q: 2, fb: 'Chaque heure compte dans le sepsis.' }, { t: 'Attendre la tournée de la pharmacie', q: 0, fb: 'Retard dangereux.' }, { t: 'Noter le retard pour la relève', q: 1, fb: 'Tracer, oui, mais agir d’abord.' }] },
    { patient: 'Unité — fin de service', texte: 'Tu as oublié de noter l’administration d’un antalgique donné à 10 h. Il est 14 h.', s: 'MED', stage: 'Ce qui n’est pas écrit n’a pas été fait : risque de double administration.',
      choix: [{ t: 'Le tracer maintenant avec l’heure réelle d’administration et prévenir l’équipe', q: 2, fb: 'Évite une double administration par l’équipe suivante.' }, { t: 'Ne rien noter, c’est trop tard', q: 0, fb: 'Risque de surdosage.' }, { t: 'Le noter à 14 h', q: 0, fb: 'L’heure doit être exacte.' }] }
  ],
  prio: [
    { titre: 'La garde de la mort (version express)', intro: 'Tu reçois 5 patients de services différents. Classe-les.', s: 'NEWS+RAIS',
      patients: [['M. L. ronfle, SpO₂ 84 %, ne répond pas', 'A : voies aériennes menacées.'], ['Mme M. : PA 82/48, FC 128, marbrures', 'C : choc.'], ['M. N. : diabétique, sueurs, confus', 'D : hypoglycémie probable, vite corrigeable.'], ['Mme O. : douleur 7/10 après son opération', 'Douleur à soulager rapidement.'], ['M. P. : sortant, attend son ordonnance', 'Administratif.']] },
    { titre: 'Les résultats de labo arrivent', intro: 'Le laboratoire te transmet 4 résultats en même temps.', s: 'RAIS+ADA',
      patients: [['Kaliémie à 6,9 mmol/L chez un patient au scope', 'Risque de trouble du rythme grave : priorité absolue.'], ['Glycémie à 45 mg/dL chez une patiente sous insuline', 'Hypoglycémie à corriger immédiatement.'], ['Hémoglobine à 8,9 g/dL, stable par rapport à hier', 'À transmettre, sans urgence immédiate.'], ['Cholestérol élevé', 'Information non urgente.']] },
    { titre: 'Début de stage : 4 tâches', intro: 'Il est 7 h. Tout le monde a besoin de toi.', s: 'RAIS',
      patients: [['Un patient a une nouvelle douleur thoracique', 'Menace vitale possible : évaluation immédiate et alerte.'], ['Antibiotique prévu à 7 h pour un patient septique', 'Heure fixe importante : sans retard.'], ['Toilette d’un patient autonome', 'Peut être planifiée plus tard.'], ['Commander le matériel de la semaine', 'Logistique, en dernier.']] },
    { titre: 'Les sonnettes de la nuit', intro: 'Quatre sonnettes en même temps en médecine.', s: 'RAIS+NEWS+ADA',
      patients: [['M. A. ne peut plus parler et porte les mains à sa gorge', 'A : obstruction des voies aériennes.'], ['Mme B. diabétique, sueurs, confuse', 'Hypoglycémie probable : à corriger vite.'], ['M. C. a mal (6/10) à son genou opéré', 'Douleur à soulager rapidement.'], ['Mme D. veut changer de chaîne TV', 'Confort, en dernier.']] }
  ],
  mots: [
    ['PRIORISATION', 'Décider qui voir en premier', 'Menace vitale d’abord, puis aigu avant chronique.'],
    ['REFLEXIVITE', 'Capacité à analyser sa propre pratique', 'C’est la 4e étape du modèle de Tanner.'],
    ['TRANSMISSION', 'Passage d’informations d’un soignant à l’autre', 'Structurée en SBAR ou DAR.'],
    ['ANCRAGE', 'Biais qui consiste à rester bloqué sur la première hypothèse', '« C’est l’âge… » alors que c’est un sepsis.'],
    ['HENDERSON', 'Auteure des 14 besoins fondamentaux', 'Modèle souvent utilisé pour le recueil de données.'],
    ['SURVEILLANCE', 'Observation régulière et ciblée de l’état du patient', 'Elle permet de remarquer un changement.'],
    ['CONFUSION', 'Trouble aigu de l’orientation qui vaut 3 points au NEWS2', 'Toujours en chercher la cause.'],
    ['ESCALADE', 'Faire monter l’alerte quand la réponse ne vient pas', 'Une procédure du service le prévoit souvent.'],
    ['HYPOGLYCEMIE', 'Glycémie trop basse, niveau 2 sous 54 mg/dL', 'Règle des 15 g / 15 minutes chez le patient conscient.'],
    ['OBJECTIF', 'Résultat attendu chez le patient, SMART', 'Le sujet est toujours le patient.'],
    ['INTERPRETER', 'Donner du sens aux données recueillies', '2e étape du modèle de Tanner.'],
    ['DECLARATION', 'Signalement d’un incident pour améliorer la sécurité', 'Elle sert à apprendre, pas à punir.'],
    ['READBACK', 'Répéter à voix haute une prescription orale pour la confirmer', 'Évite les erreurs d’écoute.'],
    ['INTUITION', 'Reconnaissance rapide d’une situation déjà vécue, selon Tanner', 'Elle se construit avec l’expérience et se vérifie par une évaluation.'],
    ['TRACABILITE', 'Écrire ce qui a été fait, quand et par qui', 'Ce qui n’est pas écrit n’a pas été fait.']
  ],
  ordre: [
    { titre: 'Après une chute', etapes: ['Ne pas relever tout de suite, appeler de l’aide', 'Évaluer conscience, douleur, déformation, saignement', 'Rechercher une cause (glycémie, PA, malaise…)', 'Relever en sécurité si aucune lésion grave', 'Prévenir le médecin et surveiller (neuro si anticoagulant/choc à la tête)', 'Tracer, déclarer et réévaluer le risque de chute'], pourquoi: 'Relever trop vite peut aggraver une fracture ; chercher la cause évite la récidive.', s: 'NICEF' },
    { titre: 'Hypoglycémie chez un patient conscient', etapes: ['Reconnaître les signes (sueurs, tremblements, confusion)', 'Mesurer la glycémie capillaire', 'Donner environ 15 g de sucre rapide selon le protocole', 'Recontrôler après 15 minutes', 'Répéter si toujours basse, puis collation', 'Prévenir le médecin et tracer'], pourquoi: 'Règle des 15 g / 15 minutes (ADA) ; le protocole du service prime.', s: 'ADA' }
  ],
  tri: [
    { titre: 'Remarquer, interpréter, répondre ou réfléchir ?', cats: ['Remarquer', 'Interpréter', 'Répondre', 'Réfléchir'], items: [['Voir qu’un patient est plus pâle que ce matin', 0], ['Relier fièvre, confusion et urines troubles', 1], ['Appeler le médecin en SBAR', 2], ['Repenser sa journée le soir', 3], ['Compter la FR pendant une minute', 0], ['Hiérarchiser les données', 1], ['Rassurer le patient calmement', 2], ['Se fixer un objectif d’amélioration', 3]] }
  ],
  associe: [
    { titre: 'Situation → premier réflexe', s: 'RAIS+NEWS+ADA', paires: [['Confusion nouvelle', 'Chercher la cause'], ['Sueurs chez un diabétique', 'Glycémie capillaire'], ['FR à 28', 'NEWS2 et appel'], ['Erreur médicamenteuse', 'Évaluer, prévenir, déclarer'], ['Chute sous anticoagulant', 'Surveillance neuro'], ['Prescription orale', 'Read-back']] }
  ],
  erreur: [
    { titre: 'La nuit de l’étudiante', scene: 'Tu relis la nuit d’une autre étudiante. Repère les erreurs de jugement.', s: 'NICEF+ADA+MED', items: [['Patient retrouvé au sol, relevé immédiatement seule', true, 'On évalue d’abord, et on se fait aider.'], ['Glycémie capillaire faite après la chute d’un diabétique', false], ['Hypoglycémie corrigée puis pas de contrôle', true, 'On recontrôle à 15 minutes.'], ['Somnifère donné après un choc à la tête sous anticoagulant', true, 'Il gêne la surveillance neurologique.'], ['Chute tracée et déclarée', false]] }
  ]
};
