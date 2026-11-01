/* Scénarios supplémentaires — Étage 4, Jugement clinique (transversal). Créé par Gauthier Doumont
 * Format : voir data/scenarios-rea.js */
window.SCENARIOS = window.SCENARIOS || {};
window.SCENARIOS.jugement = {
  sources: {
    ADA: 'American Diabetes Association — Standards of Care 2025, section 6 (hypoglycémie : niveau 2 < 54 mg/dL, règle des 15 g / 15 min) 🟢',
    NICEF: 'NICE — Falls: assessment and prevention in older people (chutes à l’hôpital, vérifications après une chute) 🟢',
    RAU: 'Rétention urinaire : protocoles locaux (seuils de sondage variables) 🟠'
  },
  gds: true,
  gardes: [
    {
      id: 'jug-confusion', titre: 'La dame qui n’est « pas comme d’habitude »', difficulte: 2,
      intro: 'Stage de jugement clinique, unité de gériatrie. Il est 7 h 30. L’aide-soignante te dit : « Mme Rose M., 86 ans, n’est pas comme d’habitude ce matin. »',
      retenir: 'Une confusion nouvelle chez la personne âgée n’est jamais « l’âge » : NEWS2 (nouvelle confusion = 3 points), chercher les causes (infection, hypoglycémie, hypoxie, globe, médicaments), dépister le sepsis et appeler en SBAR.',
      sbar: ['Mme M., 86 ans, chambre 14 : nouvelle confusion depuis ce matin, NEWS2 à 11', 'Hospitalisée pour une chute il y a 4 jours, sonde urinaire posée aux urgences', 'FR 24, PA 98/56, FC 112, T° 38,6 °C, urines troubles : je suspecte un sepsis d’origine urinaire', 'Je vous demande de venir l’évaluer maintenant'],
      noeuds: {
        debut: { heure: '07 h 30', patient: 'Mme M., 86 ans — gériatrie', v: { FC: 104, PAS: 112, PAD: 62, SpO2: 95, FR: 22, T: 38.1, GCS: 14 }, texte: 'Mme M., d’habitude bavarde et orientée, ne sait plus où elle est. Que fais-tu de cette information ?', s: 'TAN+NEWS',
          choix: [
            { t: 'La prendre au sérieux : aller l’évaluer moi-même (ABCDE, paramètres complets, NEWS2)', q: 2, fb: 'Tu « remarques » grâce à quelqu’un qui connaît la patiente : c’est une donnée précieuse.', suite: 'news' },
            { t: 'C’est sûrement la démence de l’âge', q: 0, fb: 'Biais d’ancrage : une confusion NOUVELLE est un signe d’alerte.', suite: 'news' },
            { t: 'Lui dire de surveiller et de revenir si ça empire', q: 1, fb: 'L’aide-soignante a déjà repéré un changement : c’est à toi d’évaluer.', suite: 'news' }
          ] },
        news: { heure: '07 h 40', v: { FC: 112, PAS: 98, PAD: 56, FR: 24, T: 38.6 }, texte: 'FR 24, SpO₂ 95 % à l’air, PA 98/56, FC 112, T° 38,6 °C, nouvelle confusion. Que calcules-tu ?', s: 'NEWS',
          choix: [
            { t: 'Le NEWS2 : FR 2 + SpO₂ 1 + PAS 2 + FC 2 + T° 1 + confusion 3 = 11 → réponse d’urgence', q: 2, fb: 'NEWS2 ≥ 7 : réponse d’urgence. Et la SSC 2026 recommande ce type de score pour dépister le sepsis.', suite: 'causes' },
            { t: 'Rien, je préfère attendre la visite', q: 0, fb: 'Le score aurait montré qu’elle est en danger.', suite: 'causes' },
            { t: 'Seulement la température', q: 1, fb: 'La fièvre est un élément, mais c’est l’ensemble qui montre la gravité.', suite: 'causes' }
          ] },
        causes: { heure: '07 h 45', texte: 'En cherchant une cause, tu remarques que les urines de la sonde sont troubles et malodorantes.', s: 'SSC+RAIS',
          choix: [
            { t: 'Faire le lien (fièvre + confusion + urines troubles + sonde) : sepsis d’origine urinaire possible, et vérifier aussi glycémie et SpO₂', q: 2, fb: 'Tu « interprètes » : tu relies les données entre elles et tu cherches aussi les autres causes à ne pas rater.', suite: 'appel' },
            { t: 'Changer la poche et passer à autre chose', q: 0, fb: 'Tu traites un détail et rates la situation grave.', suite: 'appel' },
            { t: 'Donner du paracétamol et réévaluer dans 4 h', q: 0, fb: 'La fièvre baisse, mais le sepsis progresse.', suite: 'appel' }
          ] },
        appel: { heure: '07 h 50', texte: 'Tu appelles le médecin. Il est en réunion et répond : « Je passe à 11 h. »', s: 'SBAR+NEWS',
          choix: [
            { t: 'Répéter calmement le NEWS2 à 11 et la suspicion de sepsis, et demander qu’il vienne maintenant ; sinon suivre la procédure d’escalade du service', q: 2, fb: 'Savoir insister (avec des données objectives) fait partie du jugement clinique : c’est une question de sécurité.', suite: 'apres' },
            { t: 'Accepter et attendre 11 h', q: 0, fb: '3 heures de retard pour un sepsis probable, c’est dangereux (antibiotiques dans l’heure).', suite: 'apres' },
            { t: 'Démarrer toi-même des antibiotiques trouvés dans l’armoire', q: 0, fb: 'Jamais sans prescription.', suite: 'apres' }
          ] },
        apres: { heure: '08 h 30', v: { FC: 100, PAS: 108, PAD: 62, FR: 20, T: 38.2 }, texte: 'Le médecin est venu, a prescrit hémocultures, ECBU et antibiotiques. Qu’est-ce qui t’attend maintenant ?', s: 'SSC+TAN',
          choix: [
            { t: 'Réévaluer régulièrement (NEWS2, conscience, diurèse), vérifier l’effet du traitement et tracer', q: 2, fb: 'Répondre, c’est aussi suivre l’effet de ce qu’on a mis en place.', suite: 'reflex' },
            { t: 'Considérer que c’est réglé', q: 0, fb: 'Un sepsis peut s’aggraver dans les heures qui suivent.', suite: 'reflex' },
            { t: 'Surveiller seulement la température', q: 1, fb: 'La surveillance doit être globale.', suite: 'reflex' }
          ] },
        reflex: { heure: '14 h 00', texte: 'En fin de journée, ta référente te demande : « Qu’est-ce qui t’a mise sur la piste ce matin ? »', s: 'TAN+GIBBS',
          choix: [
            { t: 'Expliquer ton raisonnement (remarquer, interpréter, répondre) et ce que tu ferais plus vite la prochaine fois', q: 2, fb: 'C’est la phase « réfléchir » de Tanner : elle construit ton intuition clinique.', suite: 'fin' },
            { t: '« J’ai eu de la chance »', q: 0, fb: 'Ce n’est pas de la chance : c’est un raisonnement à rendre explicite.', suite: 'fin' },
            { t: '« C’est l’aide-soignante qui a tout vu »', q: 1, fb: 'Elle a remarqué, et tu as interprété et agi : les deux comptent.', suite: 'fin' }
          ] },
        fin: { fin: true, texte: 'Ta référente te demande de lui refaire l’appel de 7 h 50 en SBAR, comme si elle était le médecin.' }
      }
    },
    {
      id: 'jug-erreur', titre: 'L’erreur de 9 h', difficulte: 2,
      intro: 'Il est 10 h. En préparant les médicaments de midi, tu te rends compte que tu as donné à 9 h à M. Jean C. le comprimé prévu pour son voisin de chambre.',
      retenir: 'Après une erreur : la sécurité du patient d’abord (évaluer, prévenir), puis la transparence (signaler, déclarer selon la procédure, informer le patient selon l’organisation), puis apprendre (analyse sans culpabilisation, actions pour éviter la récidive).',
      sbar: ['M. C., 74 ans, chambre 8 : il a reçu par erreur à 9 h un comprimé destiné à son voisin (antihypertenseur)', 'Hospitalisé pour une pneumonie, PA habituelle 125/75, pas de traitement antihypertenseur', 'Actuellement PA 108/64, FC 72, pas de malaise, conscient et orienté', 'Je demande votre avis sur la surveillance à mettre en place'],
      noeuds: {
        debut: { heure: '10 h 00', patient: 'M. C., 74 ans — pneumonie', v: { FC: 72, PAS: 108, PAD: 64, SpO2: 96, FR: 18, T: 37.6, GCS: 15 }, texte: 'Tu as un coup de chaud : M. C. a pris un antihypertenseur qui ne lui était pas destiné. Quelle est ta première action ?', s: 'MED+RAIS',
          choix: [
            { t: 'Aller voir M. C. : paramètres, état de conscience, et prévenir immédiatement ton infirmière référente', q: 2, fb: 'La sécurité du patient passe d’abord : on évalue et on alerte.', suite: 'medecin' },
            { t: 'Ne rien dire et surveiller discrètement', q: 0, fb: 'Cacher une erreur prive le patient d’une prise en charge adaptée.', suite: 'medecin' },
            { t: 'Donner le bon comprimé à M. C. pour compenser', q: 0, fb: 'Jamais sans avis : on risque d’ajouter une deuxième erreur.', suite: 'medecin' }
          ] },
        medecin: { heure: '10 h 10', texte: 'Ta référente appelle le médecin avec toi. Il prescrit une surveillance de la PA toutes les heures. Ensuite ?', s: 'MED+LEGAL',
          choix: [
            { t: 'Réaliser la surveillance, tracer, et faire la déclaration d’incident selon la procédure de l’hôpital', q: 2, fb: 'La déclaration sert à améliorer le système, pas à punir.', suite: 'voisin' },
            { t: 'Surveiller sans rien écrire', q: 0, fb: 'La traçabilité protège le patient et toi.', suite: 'voisin' },
            { t: 'Demander à quelqu’un d’autre de le déclarer à ta place', q: 1, fb: 'Tu es la mieux placée pour décrire ce qui s’est passé.', suite: 'voisin' }
          ] },
        voisin: { heure: '10 h 20', patient: 'M. F., voisin de chambre', v: { FC: 88, PAS: 168, PAD: 94, SpO2: 97, FR: 16, T: 36.9, GCS: 15 }, texte: 'Et le voisin, M. F. ? Il n’a pas reçu son antihypertenseur. Sa PA est à 168/94.', s: 'MED',
          choix: [
            { t: 'Le signaler aussi au médecin pour décider de la conduite à tenir (lui aussi est concerné par l’erreur)', q: 2, fb: 'Une erreur concerne souvent deux patients : celui qui a reçu et celui qui n’a pas reçu.', suite: 'cause' },
            { t: 'Lui donner son comprimé maintenant sans rien demander', q: 1, fb: 'Probablement nécessaire, mais l’horaire et la dose se valident avec le médecin.', suite: 'cause' },
            { t: 'L’oublier, il n’a rien pris de travers', q: 0, fb: 'Il a manqué son traitement : c’est aussi une conséquence de l’erreur.', suite: 'cause' }
          ] },
        cause: { heure: '13 h 00', texte: 'Avec ta référente, vous cherchez comment l’erreur s’est produite. Les deux piluliers étaient côte à côte, tu as été interrompue 3 fois.', s: 'MED+RAIS',
          choix: [
            { t: 'Analyser les causes (interruptions, rangement, identification du patient au lit) et proposer des actions concrètes', q: 2, fb: 'On cherche les failles du système et de la pratique : vérifier l’identité au lit, limiter les interruptions pendant la préparation.', suite: 'patient' },
            { t: 'Conclure que tu es nulle', q: 0, fb: 'La culpabilité n’empêche pas la récidive ; l’analyse, si.', suite: 'patient' },
            { t: 'Accuser les collègues qui t’ont interrompue', q: 0, fb: 'Chercher un coupable n’améliore pas la sécurité.', suite: 'patient' }
          ] },
        patient: { heure: '15 h 00', v: { FC: 70, PAS: 118, PAD: 70 }, texte: 'M. C. va bien. Il te demande : « Il s’est passé quelque chose ce matin ? Vous aviez l’air inquiète. »', s: 'MED+LEGAL',
          choix: [
            { t: 'Être honnête, en accord avec l’équipe et selon l’organisation du service : expliquer, rassurer sur la surveillance, s’excuser', q: 2, fb: 'La transparence fait partie des droits du patient et de la relation de confiance.', suite: 'fin' },
            { t: 'Mentir : « Non, rien du tout »', q: 0, fb: 'Mentir abîme la confiance et n’est pas acceptable.', suite: 'fin' },
            { t: 'Changer de sujet', q: 1, fb: 'Il pose une question directe : il mérite une réponse.', suite: 'fin' }
          ] },
        fin: { fin: true, texte: 'Fin de journée. Ta référente te demande de rédiger la transmission de la situation pour l’équipe de nuit.' }
      }
    },
    {
      id: 'jug-chute', titre: 'Chute à 2 h du matin', difficulte: 2,
      intro: 'Nuit en médecine interne. Il est 2 h. Tu entends un bruit sourd dans la chambre 6 : M. André V., 79 ans, diabétique sous insuline, sous anticoagulant, est au sol.',
      retenir: 'Après une chute : ne pas relever tout de suite, évaluer (conscience, douleur, déformation, saignement), chercher la cause (hypoglycémie, malaise, hypotension…), surveillance neurologique si anticoagulant ou choc à la tête, prévenir le médecin, déclarer et réévaluer le risque de chute.',
      sbar: ['M. V., 79 ans, chambre 6 : chute à 2 h avec choc à la tête, retrouvé au sol', 'Diabétique sous insuline, sous anticoagulant, hospitalisé pour décompensation cardiaque', 'Glycémie à 52 mg/dL corrigée selon le protocole (128 après resucrage), Glasgow 15, hématome frontal, pas de déformation', 'Je vous demande de venir l’examiner : sous anticoagulant avec choc à la tête'],
      noeuds: {
        debut: { heure: '02 h 00', patient: 'M. V., 79 ans — médecine interne', v: { FC: 98, PAS: 124, PAD: 70, SpO2: 96, FR: 18, T: 36.6, GCS: 14 }, texte: 'M. V. est assis au sol, un peu confus, une bosse au front. Que fais-tu ?', s: 'NICEF',
          choix: [
            { t: 'Ne pas le relever tout de suite : appeler de l’aide, évaluer conscience, douleur, déformation d’un membre, saignement', q: 2, fb: 'Relever un patient avec une fracture (hanche, colonne) peut aggraver la lésion : on évalue d’abord.', suite: 'gly' },
            { t: 'Le relever seule immédiatement et le recoucher', q: 0, fb: 'Risque d’aggraver une fracture et de te blesser.', suite: 'gly' },
            { t: 'Lui demander de se relever seul', q: 0, fb: 'Il est confus et peut-être blessé.', suite: 'gly' }
          ] },
        gly: { heure: '02 h 03', texte: 'Il est en sueur et tremble. Quel examen rapide fais-tu ?', s: 'ADA',
          choix: [
            { t: 'Une glycémie capillaire immédiate (diabétique sous insuline, sueurs, confusion)', q: 2, fb: 'Glycémie à 52 mg/dL : hypoglycémie de niveau 2 (< 54 mg/dL), probable cause de la chute.', suite: 'resucre' },
            { t: 'Une prise de sang au labo', q: 1, fb: 'Trop lent : la glycémie capillaire donne la réponse en 30 secondes.', suite: 'resucre' },
            { t: 'Rien, il est tombé parce qu’il a glissé', q: 0, fb: 'Toujours chercher la cause d’une chute.', suite: 'resucre' }
          ] },
        resucre: { heure: '02 h 05', v: { GCS: 15 }, texte: 'Il est conscient et peut avaler. Comment corriges-tu l’hypoglycémie ?', s: 'ADA',
          choix: [
            { t: 'Selon le protocole : environ 15 g de sucre rapide par la bouche, contrôle à 15 minutes, à répéter si besoin, puis collation', q: 2, fb: 'C’est la règle des 15 g / 15 minutes (ADA) pour un patient conscient qui peut avaler. Le protocole du service prime.', suite: 'neuro' },
            { t: 'Lui faire manger un repas complet tout de suite', q: 1, fb: 'Le sucre rapide d’abord ; la collation ensuite pour éviter la récidive.', suite: 'neuro' },
            { t: 'Attendre le petit-déjeuner', q: 0, fb: 'L’hypoglycémie doit être corrigée immédiatement.', suite: 'neuro' }
          ] },
        neuro: { heure: '02 h 25', v: { FC: 86, PAS: 128, PAD: 72 }, texte: 'Glycémie de contrôle : 128 mg/dL. Il est réinstallé, sans déformation des membres. Il a un hématome au front et prend un anticoagulant.', s: 'NICEF+GCS',
          choix: [
            { t: 'Prévenir le médecin et mettre en place une surveillance neurologique (Glasgow, pupilles) selon le protocole', q: 2, fb: 'Sous anticoagulant, un choc à la tête peut provoquer un saignement intracrânien retardé (hématome sous-dural).', suite: 'prev' },
            { t: 'Il va bien, on se revoit au matin', q: 0, fb: 'Le risque de saignement retardé impose une surveillance.', suite: 'prev' },
            { t: 'Lui donner un somnifère pour qu’il se rendorme', q: 0, fb: 'Cela gênerait la surveillance neurologique et augmente le risque de chute.', suite: 'prev' }
          ] },
        prev: { heure: '03 h 00', texte: 'Que mets-tu en place pour éviter une nouvelle chute cette nuit ?', s: 'NICEF',
          choix: [
            { t: 'Lit bas, sonnette à portée, veilleuse, chaussures adaptées, passages réguliers, et signaler l’insuline/le repas du soir au médecin', q: 2, fb: 'On agit sur l’environnement et sur la cause (hypoglycémie).', suite: 'decl' },
            { t: 'Mettre les quatre barrières et l’attacher', q: 0, fb: 'Barrières et contentions augmentent le risque de chute grave (enjambement) et l’agitation.', suite: 'decl' },
            { t: 'Rien de particulier', q: 0, fb: 'Une chute est un facteur de risque majeur de nouvelle chute.', suite: 'decl' }
          ] },
        decl: { heure: '05 h 00', texte: 'Avant la fin de ta nuit…', s: 'NICEF+MED',
          choix: [
            { t: 'Tracer la chute, l’évaluation et la surveillance, déclarer l’incident selon la procédure et transmettre à l’équipe de jour', q: 2, fb: 'La déclaration permet de comprendre et de prévenir les chutes dans le service.', suite: 'fin' },
            { t: 'Ne rien écrire puisqu’il va bien', q: 0, fb: 'L’équipe de jour doit savoir qu’il est tombé et qu’il est sous surveillance.', suite: 'fin' },
            { t: 'En parler oralement seulement', q: 1, fb: 'L’oral ne suffit pas : il faut une trace écrite.', suite: 'fin' }
          ] },
        fin: { fin: true, texte: '06 h 30 : le médecin de garde passe revoir M. V. et te demande de lui résumer la nuit.' }
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
      choix: [{ t: 'Demander les précisions utiles : évaluation neuro, consignes de surveillance, dernier contrôle', q: 2, fb: '« RAS » n’est pas une transmission : il manque les éléments de surveillance d’un patient à risque.' }, { t: 'Accepter « RAS »', q: 0, fb: 'Risque d’oublier une surveillance importante.' }, { t: 'Relire tout le dossier depuis l’admission', q: 1, fb: 'Utile si tu as le temps, mais demande d’abord à ta collègue.' }] }
  ],
  prio: [
    { titre: 'La garde de la mort (version express)', intro: 'Tu reçois 5 patients de services différents. Classe-les.', s: 'NEWS+RAIS',
      patients: [['M. L. ronfle, SpO₂ 84 %, ne répond pas', 'A : voies aériennes menacées.'], ['Mme M. : PA 82/48, FC 128, marbrures', 'C : choc.'], ['M. N. : diabétique, sueurs, confus', 'D : hypoglycémie probable, vite corrigeable.'], ['Mme O. : douleur 7/10 après son opération', 'Douleur à soulager rapidement.'], ['M. P. : sortant, attend son ordonnance', 'Administratif.']] },
    { titre: 'Les résultats de labo arrivent', intro: 'Le laboratoire te transmet 4 résultats en même temps.', s: 'RAIS+ADA',
      patients: [['Kaliémie à 6,9 mmol/L chez un patient au scope', 'Risque de trouble du rythme grave : priorité absolue.'], ['Glycémie à 45 mg/dL chez une patiente sous insuline', 'Hypoglycémie à corriger immédiatement.'], ['Hémoglobine à 8,9 g/dL, stable par rapport à hier', 'À transmettre, sans urgence immédiate.'], ['Cholestérol élevé', 'Information non urgente.']] },
    { titre: 'Début de stage : 4 tâches', intro: 'Il est 7 h. Tout le monde a besoin de toi.', s: 'RAIS',
      patients: [['Un patient a une nouvelle douleur thoracique', 'Menace vitale possible : évaluation immédiate et alerte.'], ['Antibiotique prévu à 7 h pour un patient septique', 'Heure fixe importante : sans retard.'], ['Toilette d’un patient autonome', 'Peut être planifiée plus tard.'], ['Commander le matériel de la semaine', 'Logistique, en dernier.']] }
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
    ['DECLARATION', 'Signalement d’un incident pour améliorer la sécurité', 'Elle sert à apprendre, pas à punir.']
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
