/* Scénarios supplémentaires — Étage 3, Neurochirurgie / projet LAT. Créé par Gauthier Doumont
 * Format : voir data/scenarios-rea.js */
window.SCENARIOS = window.SCENARIOS || {};
window.SCENARIOS.neuro = {
  tirage: 5,
  escape: [
    { titre: 'Le Glasgow maximal', texte: 'Quel est le score de Glasgow maximal ? Le chiffre à trouver est le chiffre des unités.', type: 'code', reponses: ['15', '5'], chiffre: '5', indice: 'Y4 + V5 + M6.', explication: '15 → 5.' },
    { titre: 'La crise', texte: 'Au bout de combien de minutes une crise convulsive est-elle considérée comme un état de mal (définition opérationnelle) ?', type: 'qcm', choix: ['1', '5', '30', '60'], b: 1, chiffre: '5', indice: 'Moins de 10.', explication: '5 minutes → 5.' },
    { titre: 'Le LCR', texte: 'Production de LCR chez l’adulte : environ combien de mL par heure ? Le chiffre à trouver est le chiffre des dizaines.', type: 'code', reponses: ['20', '2'], chiffre: '2', indice: 'Environ 500 mL par jour.', explication: '≈ 20 mL/h → 2.' },
    { titre: 'La mobilisation de la DVE', texte: 'Remets dans l’ordre. Chiffre : le nombre d’étapes.', type: 'ordre', etapes: ['Clamper', 'Mobiliser', 'Remettre le zéro au tragus', 'Déclamper'], chiffre: '4', indice: 'On ferme avant de bouger.', explication: '4 étapes → 4.' },
    { titre: 'Le GCS-P', texte: 'GCS 9, aucune pupille réactive. GCS-P ?', type: 'qcm', choix: ['9', '8', '7', '11'], b: 2, chiffre: '7', indice: 'Aucune pupille réactive = 2 points retirés.', explication: '9 − 2 = 7.' },
    { titre: 'La triade', texte: 'Combien de signes compte la triade de Cushing ?', type: 'code', reponses: ['3', 'trois'], chiffre: '3', indice: 'Une triade…', explication: 'HTA, bradycardie, respiration irrégulière → 3.' }
  ],
  sources: {
    ADA: 'American Diabetes Association — Standards of Care 2025, section 6 (hypoglycémie / hyperglycémie) 🟢',
    RAU: 'Rétention urinaire post-opératoire : protocoles locaux (seuils de sondage variables) 🟠'
  },
  gardes: [
    {
      id: 'neuro-crise', titre: 'Nuit après une craniotomie', difficulte: 3,
      varier: { FC: 5, PAS: 8, SpO2: 1, FR: 2, T: 0.2 },
      intro: 'Il est 23 h. Mme Nadia R., 52 ans, a été opérée ce matin d’un méningiome frontal (craniotomie). Elle est sous dexaméthasone et lévétiracétam.',
      retenir: 'Après une craniotomie : surveillance neuro rapprochée et comparée, crise = protéger, chronométrer, appeler, PLS après. Toute baisse du Glasgow ou nouvelle anisocorie = urgence (hématome ?). Sous corticoïdes : glycémie.',
      sbar: ['Mme R., 52 ans, chambre 4 : crise convulsive généralisée de 2 minutes, puis somnolence', 'J0 d’une craniotomie pour méningiome, sous dexaméthasone et lévétiracétam', 'Actuellement Glasgow 13 (Y3 V4 M6), pupilles égales et réactives, glycémie élevée', 'Je demande que vous veniez l’évaluer et que l’on discute de la suite du traitement et de la glycémie'],
      noeuds: {
        debut: { heure: '23 h 00', patient: 'Mme R., 52 ans — craniotomie J0', v: { FC: 76, PAS: 138, PAD: 78, SpO2: 97, FR: 14, T: 37.2, GCS: 15 }, texte: 'Tour de 23 h : Mme R. est orientée, pupilles égales. Elle a mal à la tête (5/10) et des nausées.', s: 'NEURO', indice: 'Une évaluation de référence détaillée servira de comparaison.',
          choix: [
            { t: 'Noter l’évaluation complète (Glasgow détaillé, pupilles, motricité), évaluer douleur et nausées, informer selon prescription', q: 2, v: {}, fb: 'La référence détaillée permet de repérer le moindre changement ensuite.', suite: ['crise', 'evt_voisine'] },
            { t: 'Noter seulement « Glasgow 15 »', q: 1, v: {}, fb: 'Le total seul ne permet pas de suivre chaque composante ni les pupilles.', suite: 'crise' },
            { t: 'La laisser dormir sans évaluation jusqu’au matin', q: 0, v: {}, fb: 'Le jour de l’intervention, la surveillance neuro est rapprochée.', suite: 'crise' }
          ] },
        evt_voisine: { evenement: true, heure: '00 h 30', texte: 'Imprévu : la voisine de chambre de Mme R. sonne : elle n’arrive pas à dormir et demande un somnifère.', s: 'LAT', indice: 'Un médicament, ça se prescrit.',
          choix: [
            { t: 'L’écouter, proposer des mesures de confort et vérifier s’il existe une prescription, sinon en parler à l’infirmière', q: 2, v: {}, fb: 'Pas de médicament sans prescription.', suite: 'crise' },
            { t: 'Lui donner un somnifère trouvé dans l’armoire', q: 0, v: {}, fb: 'Jamais sans prescription.', suite: 'crise' }
          ] },
        crise: { heure: '01 h 10', v: { FC: 124, PAS: 168, PAD: 92, SpO2: 88, FR: 6, GCS: 3 }, texte: 'Sa voisine sonne : Mme R. a des mouvements saccadés des 4 membres, elle ne répond pas.', s: 'NEURO', indice: 'Chronométrer, protéger, appeler.',
          choix: [
            { t: 'Noter l’heure, protéger (barrières, tête), ne rien mettre dans la bouche, appeler à l’aide, O₂ dès que possible', q: 2, v: { SpO2: 92 }, fb: 'Conduite infirmière correcte. > 5 minutes = état de mal.', suite: 'post' },
            { t: 'Lui tenir fermement les bras pour arrêter les mouvements', q: 0, v: { SpO2: 86 }, fb: 'Contenir une crise expose à des blessures.', suite: 'comp_crise' },
            { t: 'Lui mettre une canule dans la bouche pendant la crise', q: 0, v: { SpO2: 84 }, fb: 'Risque de blessure dentaire et de fausse route.', suite: 'comp_crise' }
          ] },
        comp_crise: { heure: '01 h 16', v: { FC: 130, SpO2: 84, GCS: 3 }, texte: '⚠️ Complication : la crise dure depuis plus de 5 minutes et elle s’est mordu la langue.', s: 'NEURO', indice: '> 5 minutes : comment s’appelle cette situation ?',
          choix: [
            { t: 'Appel d’urgence (état de mal), O₂, la protéger sans la contenir, préparer le traitement selon protocole', q: 2, v: { SpO2: 90 }, fb: 'Rattrapage : l’état de mal est traité en urgence.', suite: 'post' },
            { t: 'Attendre que ça s’arrête seul', q: 0, v: { SpO2: 80 }, fb: 'Après 5 minutes, une crise s’arrête rarement seule.', suite: 'fin_mauvaise' }
          ] },
        post: { heure: '01 h 20', v: { FC: 108, PAS: 150, PAD: 84, SpO2: 92, FR: 18, GCS: 9 }, texte: 'La crise s’arrête. Mme R. est somnolente, respire bruyamment, salive abondante.', s: 'NEURO', indice: 'Phase post-critique : voies aériennes.',
          choix: [
            { t: 'Position latérale de sécurité, aspiration buccale si besoin, O₂, surveillance du Glasgow et des pupilles', q: 2, v: { SpO2: 96 }, fb: 'On protège les voies aériennes.', suite: 'gly' },
            { t: 'La faire boire pour qu’elle se réveille', q: 0, v: { SpO2: 88 }, fb: 'Risque de fausse route.', suite: 'gly' },
            { t: 'La laisser sur le dos et partir', q: 0, v: { SpO2: 89 }, fb: 'Risque d’inhalation.', suite: 'gly' }
          ] },
        gly: { heure: '01 h 30', v: { FC: 96, PAS: 142, PAD: 80, FR: 16, GCS: 13 }, texte: 'Elle se réveille progressivement (Y3 V4 M6). Quel paramètre simple vérifies-tu, en plus des pupilles ?', s: 'NEURO+ADA', indice: 'Crise + corticoïdes…',
          choix: [
            { t: 'La glycémie capillaire', q: 2, v: {}, fb: 'Une hypoglycémie peut provoquer une crise, et la dexaméthasone fait monter la glycémie : ici elle est élevée, à signaler.', suite: 'appel' },
            { t: 'La température uniquement', q: 1, v: {}, fb: 'La glycémie est un réflexe devant toute crise.', suite: 'appel' },
            { t: 'Rien, elle se réveille', q: 0, v: {}, fb: 'On cherche toujours une cause réversible.', suite: 'appel' }
          ] },
        appel: { heure: '01 h 35', texte: 'Tu appelles le neurochirurgien de garde. Comment ?', s: 'SBAR', indice: 'S, B, A, R.',
          choix: [
            { t: 'En SBAR : crise de 2 min, J0 craniotomie, Glasgow 13 avec pupilles égales, glycémie élevée ; je demande une évaluation', q: 2, v: {}, fb: 'Message structuré = décision rapide.', suite: 'aniso' },
            { t: '« Elle a fait une crise, passez quand vous voulez »', q: 1, v: {}, fb: 'Il manque l’évaluation et une demande claire.', suite: 'aniso' },
            { t: 'Attendre le matin car elle va mieux', q: 0, v: {}, fb: 'Une crise après craniotomie se signale immédiatement.', suite: 'aniso_tard' }
          ] },
        aniso: { heure: '02 h 30', v: { FC: 58, PAS: 176, PAD: 84, FR: 10, GCS: 10 }, texte: 'Au contrôle suivant : Glasgow 10, pupille droite plus large et paresseuse, FC lente, PA élevée.', s: 'NEURO+GCSP', indice: 'HTA + bradycardie + baisse de conscience…',
          choix: [
            { t: 'Urgence : rappeler immédiatement le neurochirurgien, rester auprès d’elle, tête à 30° dans l’axe', q: 2, v: {}, fb: 'Hypertension intracrânienne grave (hématome ?) : le médecin organise une imagerie en urgence.', suite: 'fin_bonne' },
            { t: 'Refaire un contrôle dans 1 heure', q: 0, v: { GCS: 8 }, fb: 'Ce tableau impose une action immédiate.', suite: 'aniso_tard' },
            { t: 'Donner un antihypertenseur', q: 0, v: { PAS: 130, PAD: 70, GCS: 8 }, fb: 'L’HTA maintient la perfusion cérébrale : on ne la traite pas sans avis.', suite: 'aniso_tard' }
          ] },
        aniso_tard: { heure: '03 h 30', v: { FC: 52, PAS: 182, PAD: 88, FR: 8, GCS: 7 }, texte: '⚠️ Complication : Mme R. ne répond plus qu’à la douleur, les deux pupilles réagissent mal.', s: 'NEURO+GCSP', indice: 'Urgence absolue.',
          choix: [
            { t: 'Appel d’urgence, protéger les voies aériennes, rester avec elle', q: 2, v: {}, fb: 'Rattrapage tardif : la reprise chirurgicale est organisée en urgence.', suite: 'fin_moyenne' },
            { t: 'Attendre la relève', q: 0, v: {}, fb: 'L’engagement progresse.', suite: 'fin_mauvaise' }
          ] },
        fin_bonne: { fin: true, issue: 'bonne', titre: 'Hématome repéré à temps', texte: 'Le scanner montre un hématome : Mme R. est réopérée rapidement. Ta surveillance a fait la différence.' },
        fin_moyenne: { fin: true, issue: 'moyenne', titre: 'Réopérée en urgence, avec retard', texte: 'Mme R. est réopérée, mais le retard a aggravé la situation. Le pronostic est incertain.' },
        fin_mauvaise: { fin: true, issue: 'mauvaise', titre: 'Dégradation fatale non reconnue', texte: 'La crise prolongée ou l’hypertension intracrânienne n’ont pas été traitées à temps. Rejoue : chronomètre, compare, appelle.' }
      }
    },
    {
      id: 'neuro-rachis', titre: 'Les jambes lourdes de M. Paul', difficulte: 2,
      varier: { FC: 5, PAS: 8, SpO2: 1, FR: 2, T: 0.2 },
      intro: 'Il est 20 h. M. Paul D., 63 ans, a été opéré ce matin d’une arthrodèse lombaire (L4-L5). Il porte un drain.',
      retenir: 'Après chirurgie du rachis : comparer la motricité et la sensibilité au pré-opératoire, surveiller miction et sensibilité du périnée, le drain et le pansement. Un nouveau déficit = urgence (hématome compressif).',
      sbar: ['M. D., 63 ans, chambre 11 : faiblesse nouvelle des deux jambes et engourdissement du périnée', 'J0 d’une arthrodèse L4-L5, drain peu productif, sous anticoagulant préventif', 'Je suspecte un hématome compressif : force diminuée aux deux jambes alors qu’elle était normale à 20 h', 'Je demande votre évaluation immédiate'],
      noeuds: {
        debut: { heure: '20 h 00', patient: 'M. D., 63 ans — arthrodèse lombaire J0', v: { FC: 84, PAS: 132, PAD: 76, SpO2: 96, FR: 16, T: 37.4, GCS: 15 }, texte: 'M. D. a mal (6/10). Force et sensibilité des jambes normales. Il n’a pas uriné depuis le retour du bloc (6 h).', s: 'NEURO+RAU', indice: 'Douleur, miction et examen neuro de référence.',
          choix: [
            { t: 'Évaluer la douleur et le globe vésical (bladder scan selon protocole), noter l’examen neuro complet comme référence', q: 2, v: { FC: 80 }, fb: 'Les trois piliers de la surveillance post-rachis.', suite: 'mobil' },
            { t: 'Attendre qu’il urine spontanément', q: 1, v: { FC: 88 }, fb: 'Après 6 h sans miction, on vérifie.', suite: 'mobil' },
            { t: 'Lui demander de se lever seul pour aller aux toilettes', q: 0, v: { FC: 96 }, fb: 'Le lever se fait selon protocole, avec aide.', suite: 'comp_chute' }
          ] },
        comp_chute: { heure: '20 h 10', v: { FC: 108, PAS: 146, PAD: 84 }, texte: '⚠️ Complication : en se levant seul, M. D. a fait un malaise et s’est assis brutalement au sol.', s: 'NEURO', indice: 'Ne pas le relever tout de suite.',
          choix: [
            { t: 'Ne pas le relever seule, appeler de l’aide, évaluer douleur, motricité, pansement, et prévenir le médecin', q: 2, v: { FC: 92 }, fb: 'Rattrapage : l’évaluation est faite avant de le recoucher en bloc.', suite: 'mobil' },
            { t: 'Le relever seule rapidement', q: 0, v: {}, fb: 'Risque pour sa colonne opérée et pour toi.', suite: 'fin_mauvaise' }
          ] },
        mobil: { heure: '20 h 30', texte: 'Il doit être tourné sur le côté pour un soin.', s: 'NEURO', indice: 'Épaules et bassin ensemble.',
          choix: [
            { t: 'Mobilisation en bloc, à deux, en surveillant le drain', q: 2, v: {}, fb: 'Pas de torsion de la colonne opérée, pas d’arrachement du drain.', suite: ['deficit', 'evt_tel'] },
            { t: 'Tourner d’abord les jambes puis les épaules', q: 1, v: {}, fb: 'Cela crée une torsion.', suite: 'deficit' },
            { t: 'Lui demander de se tourner seul en tirant sur la barrière', q: 0, v: {}, fb: 'Torsion du tronc à éviter.', suite: 'deficit' }
          ] },
        evt_tel: { evenement: true, heure: '21 h 00', texte: 'Imprévu : le labo appelle avec un résultat d’un autre patient : natrémie basse.', s: 'NEURO', indice: 'Un résultat anormal se transmet.',
          choix: [
            { t: 'Noter, répéter le résultat (read-back) et le transmettre à l’infirmière/au médecin', q: 2, v: {}, fb: 'Un résultat critique se transmet sans délai.', suite: 'deficit' },
            { t: 'Le noter sur un bout de papier pour plus tard', q: 0, v: {}, fb: 'Risque d’oubli et de retard.', suite: 'deficit' }
          ] },
        deficit: { heure: '22 h 00', v: { FC: 96, PAS: 146, PAD: 82 }, texte: 'Il te dit : « Mes jambes sont lourdes et je ne sens plus bien mes fesses. » La force est nettement diminuée aux deux jambes.', s: 'NEURO', indice: 'Déficit nouveau + anesthésie en selle.',
          choix: [
            { t: 'Comparer à l’examen de 20 h, prévenir immédiatement le neurochirurgien : suspicion d’hématome compressif', q: 2, v: {}, fb: 'Urgence chirurgicale : chaque heure compte pour la récupération.', suite: 'drain' },
            { t: 'Lui donner un antalgique et revoir dans 2 h', q: 0, v: {}, fb: 'Retarder peut entraîner un déficit définitif.', suite: 'comp_deficit' },
            { t: 'Le rassurer, c’est l’anesthésie', q: 0, v: {}, fb: 'Il avait une force normale à 20 h : le déficit est nouveau.', suite: 'comp_deficit' }
          ] },
        comp_deficit: { heure: '00 h 00', v: { FC: 102 }, texte: '⚠️ Complication : M. D. ne bouge presque plus les jambes et n’a pas uriné.', s: 'NEURO', indice: 'C’est encore une urgence.',
          choix: [
            { t: 'Appel immédiat du neurochirurgien', q: 2, v: {}, fb: 'Rattrapage tardif : il est opéré en urgence, mais la récupération sera incertaine.', suite: 'fin_moyenne' },
            { t: 'Attendre la visite du matin', q: 0, v: {}, fb: 'Déficit définitif.', suite: 'fin_mauvaise' }
          ] },
        drain: { heure: '22 h 05', texte: 'En attendant le médecin, tu regardes le drain : il n’a presque rien donné depuis le bloc.', s: 'NEURO', indice: 'Un drain qui ne coule pas peut être bouché.',
          choix: [
            { t: 'Vérifier qu’il n’est ni coudé ni clampé et transmettre cette information au médecin', q: 2, v: {}, fb: 'Un drain bouché peut laisser le sang s’accumuler contre les nerfs.', suite: 'fin_bonne' },
            { t: 'Rien, c’est bon signe qu’il ne coule pas', q: 1, v: {}, fb: 'Pas forcément : il peut être bouché.', suite: 'fin_moyenne' },
            { t: 'Tirer sur le drain pour le déboucher', q: 0, v: {}, fb: 'Jamais : risque de le déplacer.', suite: 'fin_moyenne' }
          ] },
        fin_bonne: { fin: true, issue: 'bonne', titre: 'Compression levée à temps', texte: 'L’imagerie confirme un hématome : M. D. est réopéré rapidement et récupère sa force.' },
        fin_moyenne: { fin: true, issue: 'moyenne', titre: 'Réopéré avec retard', texte: 'M. D. est réopéré, mais avec du retard : la récupération sera plus longue et incertaine.' },
        fin_mauvaise: { fin: true, issue: 'mauvaise', titre: 'Déficit définitif', texte: 'La compression n’a pas été levée à temps. Rejoue : tout nouveau déficit après chirurgie du rachis est une urgence.' }
      }
    },
    {
      id: 'neuro-lat', titre: 'LAT : tu coordonnes la matinée', difficulte: 2,
      varier: { FC: 5, PAS: 8, SpO2: 1, FR: 2, T: 0.2 },
      intro: 'Il est 7 h. Aujourd’hui, dans l’unité LAT, tu es l’étudiante coordinatrice : tu répartis le travail entre 4 étudiants pour 16 patients, avec l’infirmière superviseure en appui.',
      retenir: 'Coordonner, c’est prioriser les patients à risque, répartir selon les compétences, déléguer avec des consignes claires, vérifier, communiquer en SBAR et savoir demander de l’aide.',
      sbar: ['Je vous appelle pour M. U., chambre 3 : nouvelle désorientation et Glasgow passé de 15 à 13', 'J2 d’une évacuation d’hématome sous-dural chronique, sous antiagrégant à l’admission', 'Pupilles égales, pas de déficit moteur, glycémie normale ; le drain a été retiré hier', 'Je demande que vous veniez l’examiner et que l’on discute d’une imagerie'],
      noeuds: {
        debut: { heure: '07 h 00', patient: 'Unité LAT — 16 patients', v: { FC: 80, PAS: 128, PAD: 74, SpO2: 97, FR: 16, T: 36.9, GCS: 15 }, texte: 'Comment répartis-tu les patients entre les 4 étudiants ?', s: 'LAT', indice: 'Équité de charge et compétences.',
          choix: [
            { t: 'Selon la charge en soins et la complexité, en confiant les patients instables aux plus expérimentés et en gardant du temps pour coordonner', q: 2, v: {}, fb: 'Une répartition équilibrée sécurise la journée.', suite: 'deleg' },
            { t: '4 patients chacun dans l’ordre des chambres', q: 1, v: {}, fb: 'Simple mais pas équilibré.', suite: 'deleg' },
            { t: 'Tu prends tous les patients graves pour toi', q: 0, v: {}, fb: 'Tu n’aurais plus de temps pour coordonner.', suite: 'comp_deborde' }
          ] },
        comp_deborde: { heure: '08 h 30', texte: '⚠️ Complication : tu es débordée, deux patients n’ont pas eu leurs paramètres de 8 h et personne n’a coordonné.', s: 'LAT', indice: 'Redistribuer et demander de l’aide.',
          choix: [
            { t: 'Redistribuer les patients, demander l’aide de l’infirmière superviseure et prioriser les paramètres en retard', q: 2, v: {}, fb: 'Rattrapage : l’organisation est corrigée.', suite: 'deleg' },
            { t: 'Continuer seule sans rien dire', q: 0, v: {}, fb: 'Les retards s’accumulent, un patient se dégrade sans être vu.', suite: 'fin_mauvaise' }
          ] },
        deleg: { heure: '07 h 30', texte: 'Tu demandes à Léa de faire les paramètres des chambres 1 à 4. Comment formules-tu ta demande ?', s: 'LAT+LEGAL', indice: 'Quoi, qui, quand, et quand alerter.',
          choix: [
            { t: '« Prends PA, FC, T°, Glasgow et pupilles des chambres 1 à 4 avant 8 h, et préviens-moi tout de suite si un Glasgow baisse ou si une PA sort des limites prescrites. »', q: 2, v: {}, fb: 'Délégation claire, avec critères d’alerte.', suite: ['imprevu', 'evt_medecin'] },
            { t: '« Tu peux faire les paramètres ? »', q: 1, v: {}, fb: 'Trop vague.', suite: 'imprevu' },
            { t: 'Ne rien demander et tout faire toi-même', q: 0, v: {}, fb: 'Impossible avec 16 patients.', suite: 'comp_deleg' }
          ] },
        comp_deleg: { heure: '08 h 30', texte: '⚠️ Complication : à 8 h 30, les paramètres de la moitié des patients ne sont pas faits ; Léa attend sans consigne.', s: 'LAT+LEGAL', indice: 'Déléguer clairement, c’est gagner du temps.',
          choix: [
            { t: 'Donner à Léa une consigne précise (patients, paramètres, délai, critères d’alerte) et vérifier ensuite', q: 2, v: {}, fb: 'Rattrapage : la délégation est enfin claire.', suite: 'imprevu' },
            { t: 'Continuer seule', q: 0, v: {}, fb: 'Un patient se dégrade sans être vu.', suite: 'fin_mauvaise' }
          ] },
        evt_medecin: { evenement: true, heure: '08 h 00', texte: 'Imprévu : le neurochirurgien passe plus tôt que prévu et veut faire la visite maintenant.', s: 'LAT+SBAR', indice: 'Être prête, c’est avoir ses points clés.',
          choix: [
            { t: 'L’accompagner avec ta liste des points importants par patient, et demander à un étudiant de poursuivre les paramètres', q: 2, v: {}, fb: 'Visite efficace, soins qui continuent.', suite: 'imprevu' },
            { t: 'Lui demander de revenir plus tard', q: 1, v: {}, fb: 'La visite est importante pour les décisions de la journée.', suite: 'imprevu' }
          ] },
        imprevu: { heure: '08 h 15', patient: 'M. U., 81 ans — HSD chronique J2', v: { FC: 88, PAS: 152, PAD: 86, GCS: 13 }, texte: 'Léa te prévient : M. U. (chambre 3) est désorienté, Glasgow 13 alors qu’il était à 15 hier.', s: 'GCS+NEURO', indice: 'Après une évacuation d’HSD, une baisse du Glasgow peut signer…',
          choix: [
            { t: 'Aller l’évaluer immédiatement (Glasgow, pupilles, motricité, glycémie) puis prévenir le médecin en SBAR', q: 2, v: {}, fb: 'Une récidive d’hématome doit être recherchée vite.', suite: 'famille' },
            { t: 'Lui dire de surveiller et de te tenir au courant', q: 1, v: { GCS: 12 }, fb: 'Une dégradation neurologique nécessite ton évaluation et un appel.', suite: 'comp_hsd' },
            { t: 'Attendre la visite de 10 h', q: 0, v: { GCS: 11 }, fb: '2 heures de retard peuvent aggraver une récidive.', suite: 'comp_hsd' }
          ] },
        comp_hsd: { heure: '09 h 30', v: { FC: 82, PAS: 160, PAD: 88, GCS: 11 }, texte: '⚠️ Complication : M. U. est maintenant somnolent et ne bouge plus bien le bras droit.', s: 'GCS+NEURO', indice: 'Déficit nouveau + baisse de conscience.',
          choix: [
            { t: 'Appel immédiat du médecin en SBAR, surveillance neuro rapprochée', q: 2, v: {}, fb: 'Rattrapage : imagerie en urgence, récidive confirmée et prise en charge.', suite: 'famille' },
            { t: 'Attendre encore la visite', q: 0, v: { GCS: 9 }, fb: 'La récidive progresse.', suite: 'fin_mauvaise' }
          ] },
        famille: { heure: '11 h 30', texte: 'La fille d’un patient s’énerve au poste de soins : « Personne ne me dit rien sur mon père ! »', s: 'LAT', indice: 'Écouter, puis orienter.',
          choix: [
            { t: 'L’accueillir au calme, écouter, donner ce qui relève de ton rôle et organiser un contact avec le médecin', q: 2, v: {}, fb: 'L’écoute désamorce souvent la colère.', suite: 'aide' },
            { t: 'Lui répondre qu’elle doit attendre comme tout le monde', q: 1, v: {}, fb: 'Cela renforce le sentiment d’abandon.', suite: 'aide' },
            { t: 'Lui lire le dossier médical', q: 0, v: {}, fb: 'Secret professionnel : l’accès au dossier suit des règles précises.', suite: 'aide' }
          ] },
        aide: { heure: '12 h 30', texte: 'Tu te sens débordée : deux sorties, une entrée et un pansement complexe en même temps.', s: 'LAT', indice: 'Demander de l’aide est une compétence.',
          choix: [
            { t: 'Prioriser, redistribuer une tâche et demander l’aide de l’infirmière superviseure', q: 2, v: {}, fb: 'Savoir demander de l’aide à temps.', suite: 'fin_bonne' },
            { t: 'Ne rien dire et accélérer', q: 1, v: {}, fb: 'La précipitation augmente le risque d’erreur.', suite: 'fin_moyenne' },
            { t: 'Reporter l’entrée au lendemain', q: 0, v: {}, fb: 'Ce n’est pas ta décision.', suite: 'fin_moyenne' }
          ] },
        fin_bonne: { fin: true, issue: 'bonne', titre: 'Matinée bien coordonnée', texte: 'L’unité a tourné en sécurité : priorités claires, délégation précise, dégradation repérée à temps.' },
        fin_moyenne: { fin: true, issue: 'moyenne', titre: 'Matinée tendue', texte: 'Les patients vont bien, mais l’organisation a été fragile. Rejoue pour mieux déléguer et demander de l’aide.' },
        fin_mauvaise: { fin: true, issue: 'mauvaise', titre: 'Dégradation passée inaperçue', texte: 'Un patient s’est dégradé sans être vu à temps. Rejoue : organisation, délégation, évaluation rapide.' }
      }
    }
  ],
  situations: [
    { patient: 'M. A., 60 ans — DVE', v: { FC: 78, PAS: 134, PAD: 74, SpO2: 97, FR: 16, T: 37.0, GCS: 15 }, texte: 'Le kiné arrive pour lever M. A., porteur d’une DVE.', s: 'DVE', stage: 'Rappelle aux autres intervenants la règle de la DVE avant toute mobilisation.',
      choix: [{ t: 'Clamper la DVE selon le protocole avant le lever, puis remettre le zéro au tragus et déclamper selon prescription', q: 2, fb: 'Sans clampage, le changement de hauteur provoque un drainage brutal.' }, { t: 'Laisser faire le kiné sans rien toucher', q: 0, fb: 'Risque de surdrainage.' }, { t: 'Retirer la DVE pour la séance', q: 0, fb: 'Jamais : c’est un acte médical.' }] },
    { patient: 'Mme B., 47 ans — HSA J2, DVE', v: { FC: 84, PAS: 138, PAD: 76, SpO2: 97, FR: 16, T: 37.3, GCS: 15 }, texte: 'Le LCR de la DVE, clair ce matin, devient franchement rosé puis rouge.', s: 'DVE+AHA', stage: 'Note l’aspect du LCR à chaque contrôle : c’est un signe d’évolution.',
      choix: [{ t: 'Prévenir immédiatement le médecin et surveiller l’état neuro', q: 2, fb: 'Un LCR qui devient sanglant peut signaler un nouveau saignement.' }, { t: 'Changer la poche', q: 0, fb: 'Le problème n’est pas la poche.' }, { t: 'Noter et attendre le prochain contrôle', q: 0, fb: 'Un resaignement est une urgence.' }] },
    { patient: 'M. C., 55 ans — chirurgie hypophysaire J1', v: { FC: 98, PAS: 118, PAD: 70, SpO2: 98, FR: 16, T: 37.1, GCS: 15 }, texte: 'Diurèse de 350 puis 400 mL/h, urines très claires. Il réclame sans arrêt à boire.', s: 'NEURO', stage: 'Après chirurgie hypophysaire : bilan entrées/sorties et diurèse horaire.',
      choix: [{ t: 'Prévenir le médecin (suspicion de diabète insipide), bilan entrées/sorties précis', q: 2, fb: 'Polyurie diluée + soif après chirurgie de l’hypophyse : manque d’ADH.' }, { t: 'Lui retirer l’eau pour qu’il urine moins', q: 0, fb: 'Il se déshydraterait gravement.' }, { t: 'C’est normal, il boit beaucoup', q: 0, fb: 'C’est l’inverse : il boit parce qu’il perd trop d’eau.' }] },
    { patient: 'Mme D., 39 ans — chirurgie transsphénoïdale J1', texte: 'Elle te dit qu’elle a le nez bouché et veut se moucher fort. Un liquide clair coule de son nez quand elle se penche.', s: 'NEURO', stage: 'Rappelle les consignes avant même qu’elle ne demande.',
      choix: [{ t: 'Lui demander de ne pas se moucher et prévenir le médecin (fuite de LCR possible)', q: 2, fb: 'Écoulement clair au penché : fuite de LCR possible, risque de méningite.' }, { t: 'Lui donner des mouchoirs', q: 0, fb: 'Se moucher augmente la fuite.' }, { t: 'Lui proposer un spray nasal', q: 0, fb: 'Pas sans prescription.' }] },
    { patient: 'M. E., 70 ans — arthrodèse cervicale antérieure, J0', v: { FC: 104, PAS: 148, PAD: 84, SpO2: 92, FR: 24, T: 37.0, GCS: 15 }, texte: 'Son cou gonfle sous le pansement, il a du mal à avaler et sa respiration devient bruyante.', s: 'NEURO', stage: 'Après chirurgie cervicale antérieure : surveiller la circonférence du cou, la déglutition et la respiration.',
      choix: [{ t: 'Appel immédiat (urgence vitale), rester avec lui, position semi-assise, O₂', q: 2, fb: 'Hématome cervical compressif : il peut obstruer la trachée.' }, { t: 'Lui proposer de l’eau froide', q: 0, fb: 'Risque de fausse route et retard.' }, { t: 'Refaire le pansement plus serré', q: 0, fb: 'Comprimer le cou aggrave l’obstruction.' }] },
    { patient: 'Mme F., 58 ans — sous dexaméthasone', v: { FC: 88, PAS: 136, PAD: 78, SpO2: 97, FR: 16, T: 36.8, GCS: 15 }, texte: 'Glycémie capillaire à 286 mg/dL chez une patiente non diabétique traitée par dexaméthasone.', s: 'NEURO+ADA', stage: 'Sous corticoïdes : glycémies selon prescription, même chez les non-diabétiques.',
      choix: [{ t: 'Transmettre au médecin pour adapter la prise en charge', q: 2, fb: 'Les corticoïdes provoquent souvent une hyperglycémie, qui peut nécessiter un traitement.' }, { t: 'Lui supprimer son repas', q: 0, fb: 'Ce n’est pas une décision infirmière isolée.' }, { t: 'Arrêter la dexaméthasone', q: 0, fb: 'Jamais sans avis médical.' }] },
    { patient: 'M. G., 66 ans — HSA J8', v: { FC: 82, PAS: 142, PAD: 80, SpO2: 97, FR: 17, T: 37.4, GCS: 14 }, texte: 'M. G. a du mal à trouver ses mots et sa main droite lâche son gobelet. Il allait bien à 8 h.', s: 'AHA+NCS', stage: 'Entre J3-J4 et J14 après une HSA, tout nouveau déficit est un vasospasme jusqu’à preuve du contraire.',
      choix: [{ t: 'Alerter immédiatement : suspicion de vasospasme', q: 2, fb: 'Une prise en charge rapide peut éviter un infarctus cérébral.' }, { t: 'Il est fatigué, le laisser se reposer', q: 0, fb: 'Un déficit nouveau n’est jamais de la fatigue.' }, { t: 'Lui faire faire des exercices de la main', q: 0, fb: 'Retard dangereux.' }] },
    { patient: 'Mme H., 73 ans — HSD chronique', v: { FC: 74, PAS: 130, PAD: 72, SpO2: 96, FR: 16, T: 36.9, GCS: 15 }, texte: 'Mme H., opérée hier, veut se lever seule la nuit pour aller aux toilettes. Elle est sous anticoagulant à l’arrêt temporaire.', s: 'NEURO', stage: 'La prévention des chutes est cruciale : une chute peut provoquer une récidive.',
      choix: [{ t: 'Prévenir les chutes : sonnette à portée, lit bas, éclairage, accompagnement au lever', q: 2, fb: 'Les chutes sont la cause classique de l’HSD : on ne veut pas de récidive.' }, { t: 'L’attacher au lit', q: 0, fb: 'La contention augmente l’agitation et le risque de blessure.' }, { t: 'La laisser se lever seule', q: 1, fb: 'Elle a besoin d’aide au moins les premières fois.' }] },
    { patient: 'M. I., 50 ans — HTIC surveillée', v: { FC: 70, PAS: 140, PAD: 80, SpO2: 97, FR: 16, T: 38.6, GCS: 14 }, texte: 'M. I., en surveillance pour HTIC, a 38,6 °C. Il est constipé et force beaucoup aux toilettes.', s: 'NEURO', stage: 'Fièvre et efforts de poussée augmentent la PIC : signale-les.',
      choix: [{ t: 'Signaler la fièvre et la constipation au médecin (traitement selon prescription) et éviter les efforts', q: 2, fb: 'La fièvre et la manœuvre de Valsalva augmentent la pression intracrânienne.' }, { t: 'Lui conseiller de pousser fort pour en finir', q: 0, fb: 'C’est justement à éviter.' }, { t: 'Rien, ce n’est pas neurologique', q: 0, fb: 'Tout ce qui augmente la PIC compte.' }] },
    { patient: 'Mme J., 45 ans — hernie discale opérée', v: { FC: 78, PAS: 126, PAD: 72, SpO2: 98, FR: 15, T: 37.0, GCS: 15 }, texte: 'Mme J. a mal à la tête quand elle se lève, beaucoup moins couchée. Le pansement est mouillé d’un liquide clair.', s: 'NEURO', stage: 'Céphalées posturales + écoulement clair = pense « brèche durale ».',
      choix: [{ t: 'La recoucher, prévenir le médecin (brèche durale ?), surveiller le pansement', q: 2, fb: 'La fuite de LCR fait baisser la pression en position debout.' }, { t: 'Changer le pansement et la faire marcher', q: 0, fb: 'On aggrave la fuite.' }, { t: 'Lui donner un antalgique et ne rien dire', q: 0, fb: 'La cause doit être signalée.' }] },
    { patient: 'M. K., 68 ans — post-AVC, en neuro', texte: 'C’est l’heure du repas. M. K. a une voix mouillée et tousse en buvant son café.', s: 'NEURO', stage: 'Le dépistage des troubles de déglutition se fait AVANT la première prise orale.',
      choix: [{ t: 'Arrêter la prise orale, l’installer assis et signaler (dépistage des troubles de déglutition)', q: 2, fb: 'Voix mouillée et toux en buvant = fausse route.' }, { t: 'Lui donner de l’eau pour faire passer', q: 0, fb: 'Les liquides fins passent encore plus facilement de travers.' }, { t: 'Continuer plus lentement', q: 1, fb: 'Il faut d’abord une évaluation.' }] },
    { patient: 'Mme L., 62 ans — nimodipine', v: { FC: 76, PAS: 94, PAD: 54, SpO2: 97, FR: 16, T: 37.0, GCS: 15 }, texte: 'L’heure de la nimodipine approche. La PA de Mme L. est à 94/54, plus basse que d’habitude.', s: 'AHA+CBIP', stage: 'Connais la consigne de la prescription en cas d’hypotension avant d’administrer.',
      choix: [{ t: 'Vérifier la consigne de la prescription et demander l’avis médical avant d’administrer', q: 2, fb: 'La nimodipine peut faire baisser la PA ; une hypotension après HSA favorise l’ischémie. Le médecin adapte.' }, { t: 'Administrer comme prévu', q: 0, fb: 'Risque d’hypotension plus marquée.' }, { t: 'Ne pas administrer et ne rien dire', q: 0, fb: 'Supprimer une dose sans avis est aussi une erreur.' }] },
    { patient: 'M. M., 34 ans — traumatisé crânien', v: { FC: 72, PAS: 136, PAD: 78, SpO2: 97, FR: 16, T: 37.0, GCS: 14 }, texte: 'Pour faire sa toilette, une collègue veut mettre M. M. à plat et lui tourner la tête sur le côté pendant 20 minutes.', s: 'NEURO', stage: 'Regroupe les soins, mais en gardant la tête à 30° et dans l’axe autant que possible.',
      choix: [{ t: 'Proposer de garder la tête dans l’axe et la position la plus courte possible à plat, selon la tolérance et le protocole', q: 2, fb: 'Tête tournée et position à plat gênent le retour veineux et augmentent la PIC.' }, { t: 'La laisser faire', q: 0, fb: 'Risque d’augmentation de la PIC.' }, { t: 'Annuler la toilette', q: 1, fb: 'L’hygiène reste nécessaire : on l’adapte.' }] },
    { patient: 'M. N., 59 ans — craniotomie J1', v: { FC: 104, PAS: 128, PAD: 74, SpO2: 96, FR: 18, T: 38.9, GCS: 14 }, texte: 'Fièvre, raideur de nuque et céphalées intenses le lendemain d’une craniotomie.', s: 'NEURO', stage: 'Toute fièvre après chirurgie intracrânienne se signale.',
      choix: [{ t: 'Prévenir immédiatement le médecin (méningite possible) et surveiller l’état neuro', q: 2, fb: 'Fièvre + raideur de nuque : infection du système nerveux à évoquer.' }, { t: 'Donner du paracétamol et attendre', q: 0, fb: 'Masquer la fièvre retarde le diagnostic.' }, { t: 'Lui conseiller de dormir', q: 0, fb: 'Retard de prise en charge.' }] },
    { patient: 'Mme O., 72 ans — sous morphinique', v: { FC: 62, PAS: 112, PAD: 64, SpO2: 91, FR: 8, T: 36.8, GCS: 12 }, texte: 'Mme O. est très somnolente, ses pupilles sont en myosis serré et elle respire lentement.', s: 'NEURO', stage: 'Sous opioïdes : surveiller sédation et fréquence respiratoire.',
      choix: [{ t: 'La stimuler, O₂, prévenir immédiatement (surdosage en opioïdes ?)', q: 2, fb: 'Myosis + somnolence + FR basse sous morphinique : dépression respiratoire.' }, { t: 'La laisser dormir', q: 0, fb: 'Danger de dépression respiratoire.' }, { t: 'Lui redonner un antalgique', q: 0, fb: 'Aggravation.' }] },
    { patient: 'M. P., 66 ans — HSA J5, DVE', v: { FC: 76, PAS: 136, PAD: 74, SpO2: 97, FR: 16, T: 37.2, GCS: 15 }, texte: 'M. P. tousse violemment et vomit. Sa DVE est ouverte.', s: 'DVE', stage: 'Connais la consigne du protocole pour la DVE pendant la toux et les vomissements.',
      choix: [{ t: 'Clamper temporairement selon le protocole, sécuriser les voies aériennes, puis remettre à niveau et déclamper', q: 2, fb: 'Toux et vomissements modifient brutalement les pressions.' }, { t: 'Baisser la poche', q: 0, fb: 'Risque de surdrainage.' }, { t: 'Ne rien faire', q: 1, fb: 'Le protocole prévoit souvent un clampage temporaire.' }] },
    { patient: 'Mme Q., 48 ans — tumeur cérébrale', v: { FC: 84, PAS: 132, PAD: 76, SpO2: 98, FR: 16, T: 36.9, GCS: 15 }, texte: 'Mme Q. te demande si elle peut arrêter seule sa dexaméthasone parce qu’elle dort mal.', s: 'NEURO+CBIP', stage: 'Un traitement ne s’arrête jamais sans avis médical.',
      choix: [{ t: 'Lui expliquer qu’on ne l’arrête pas seule et transmettre sa plainte au médecin (adaptation possible)', q: 2, fb: 'Les corticoïdes ne s’arrêtent pas brutalement sans avis.' }, { t: 'Lui dire d’arrêter', q: 0, fb: 'Risque d’œdème et d’effet rebond.' }, { t: 'Ignorer sa plainte', q: 0, fb: 'Les troubles du sommeil sont un effet à signaler.' }] },
    { patient: 'M. R., 77 ans — post-op rachis', v: { FC: 88, PAS: 142, PAD: 80, SpO2: 96, FR: 18, T: 37.0, GCS: 15 }, texte: 'Un collègue veut asseoir M. R. au fauteuil en le tirant par les bras, le lendemain d’une arthrodèse.', s: 'NEURO', stage: 'Le lever après chirurgie du rachis suit le protocole (souvent le passage sur le côté).',
      choix: [{ t: 'Proposer la technique prévue : passage sur le côté en bloc, puis assis, avec aide et selon le protocole', q: 2, fb: 'On évite torsion et traction sur la colonne opérée.' }, { t: 'Le laisser faire', q: 0, fb: 'Torsion et douleur, risque pour le montage.' }, { t: 'Refuser tout lever', q: 1, fb: 'Le lever est prescrit : on l’adapte.' }] },
    { patient: 'Mme S., 55 ans — chirurgie cervicale', v: { FC: 86, PAS: 134, PAD: 76, SpO2: 97, FR: 16, T: 36.8, GCS: 15 }, texte: 'Mme S. a la voix rauque depuis son réveil, sans gêne respiratoire ni gonflement du cou.', s: 'NEURO', stage: 'Note et transmets toute modification de la voix.',
      choix: [{ t: 'Le noter, surveiller voix, déglutition et respiration, et le transmettre au médecin', q: 2, fb: 'Une dysphonie peut traduire une atteinte du nerf laryngé récurrent.' }, { t: 'Appeler la réanimation en urgence', q: 1, fb: 'Sans gêne respiratoire, c’est à signaler sans urgence vitale.' }, { t: 'Ne rien dire', q: 0, fb: 'Information importante pour la suite.' }] },
    { patient: 'Unité LAT — 14 h', texte: 'Un étudiant te dit qu’il a oublié de noter les paramètres de 12 h de deux patients, mais qu’il « s’en souvient ».', s: 'LAT+SBAR', stage: 'La traçabilité est une obligation : ce qui n’est pas écrit n’a pas été fait.',
      choix: [{ t: 'Lui demander de les noter maintenant avec l’heure réelle de mesure, et de reprendre les paramètres si un doute existe', q: 2, fb: 'On trace honnêtement, sans inventer de valeurs.' }, { t: 'Lui dire d’inventer des valeurs normales', q: 0, fb: 'Falsifier un dossier est une faute grave.' }, { t: 'Ne rien noter', q: 0, fb: 'Les équipes suivantes n’auront pas l’information.' }] }
  ],
  prio: [
    { titre: 'Début de service en neurochirurgie', intro: 'Tu reçois 4 patients à 7 h. Qui vois-tu en premier ?', s: 'NEURO+GCS',
      patients: [['M. N. : Glasgow passé de 15 à 12 pendant la nuit, pupille gauche plus large', 'Dégradation neurologique + anisocorie : urgence absolue.'], ['Mme O. : opérée du rachis hier, nouveau fourmillement des deux jambes', 'Suspicion de compression : urgence.'], ['M. P. : douleur 6/10 à l’incision de sa craniotomie', 'Douleur à soulager rapidement, mais stable.'], ['Mme Q. : sortie prévue ce midi', 'Organisation, en dernier.']] },
    { titre: 'Les sonnettes du soir', intro: 'Quatre sonnettes retentissent en même temps.', s: 'NEURO+DVE',
      patients: [['Chambre 2 : patient en crise convulsive', 'Menace vitale immédiate (voies aériennes).'], ['Chambre 5 : la poche de DVE est tombée au sol', 'Risque de surdrainage rapide : à clamper/remettre à niveau tout de suite.'], ['Chambre 7 : patient opéré du rachis qui n’a pas uriné depuis 8 h', 'Globe possible : à voir rapidement.'], ['Chambre 9 : patiente qui demande une couverture', 'Confort, en dernier.']] },
    { titre: 'Unité LAT : 11 h', intro: 'Tu es coordinatrice. Quatre demandes arrivent.', s: 'LAT',
      patients: [['Un étudiant t’informe d’une SpO₂ à 86 % chez un patient', 'B : à évaluer immédiatement.'], ['Le labo appelle pour une natrémie à 126 mmol/L (patient HSA)', 'Résultat critique à transmettre au médecin rapidement.'], ['Une entrée arrive des urgences', 'À accueillir, mais après les situations instables.'], ['Le service de diététique demande les régimes de demain', 'Administratif, en dernier.']] },
    { titre: 'Tour de 6 h en neurochirurgie', intro: 'Tu fais le tour de 6 h. Qui vois-tu en premier ?', s: 'NEURO+GCS',
      patients: [['Mme T. : crise convulsive en cours depuis 3 minutes', 'Menace vitale immédiate.'], ['M. U. : Glasgow passé de 15 à 13 depuis minuit', 'Dégradation neurologique à évaluer et signaler.'], ['Mme V. : fièvre à 38,5 °C après craniotomie, consciente', 'À signaler rapidement (infection ?).'], ['M. W. : demande son petit-déjeuner', 'Confort, en dernier.']] }
  ],
  mots: [
    ['TRAGUS', 'Repère externe du trou de Monro, zéro de la DVE', 'La hauteur de la DVE se mesure à partir de ce cartilage.'],
    ['CUSHING', 'Nom de la triade HTA + bradycardie + respiration irrégulière', 'Signe tardif d’engagement : urgence.'],
    ['VASOSPASME', 'Contraction des artères cérébrales après une HSA', 'Surtout entre J3-J4 et J14.'],
    ['NIMODIPINE', 'Médicament qui prévient l’ischémie retardée après HSA', 'Surveiller la PA.'],
    ['MYDRIASE', 'Pupille dilatée', 'Unilatérale et aréactive : signe d’engagement.'],
    ['ANISOCORIE', 'Pupilles de tailles différentes', 'Un signe d’alerte chez un patient qui se dégrade.'],
    ['LAMINECTOMIE', 'Retrait d’une partie de la vertèbre pour libérer les nerfs', 'Surveiller la motricité des jambes après.'],
    ['ARTHRODESE', 'Fusion de deux vertèbres', 'Mobilisation en bloc après l’intervention.'],
    ['HYDROCEPHALIE', 'Accumulation de LCR dans les ventricules', 'Une DVE peut être posée pour la drainer.'],
    ['CRANIOTOMIE', 'Ouverture chirurgicale du crâne', 'Surveillance neuro rapprochée en post-opératoire.'],
    ['APHASIE', 'Trouble du langage', 'Nouvelle aphasie après HSA : penser au vasospasme.'],
    ['DELEGATION', 'Confier une tâche à quelqu’un en gardant la responsabilité du suivi', 'Compétence clé du projet LAT.'],
    ['DYSARTHRIE', 'Trouble de l’articulation de la parole', 'À distinguer de l’aphasie (trouble du langage).'],
    ['MENINGITE', 'Infection des méninges : fièvre, raideur de nuque', 'Complication possible après chirurgie intracrânienne ou DVE.'],
    ['OSMOTHERAPIE', 'Traitement qui attire l’eau hors du cerveau pour diminuer l’œdème', 'Sur prescription : surveiller diurèse et natrémie.']
  ],
  glasgow: [
    { desc: 'M. S. a les yeux ouverts spontanément. Il dit « maison… voiture… » sans faire de phrase. Il serre la main sur demande.', y: 4, v: 3, m: 6, pourquoi: 'Y4, V3 (mots inappropriés), M6 → 13.' },
    { desc: 'Mme T. ouvre les yeux à la pression. Elle ne parle pas mais gémit. À la pression du trapèze, elle porte la main vers ton bras.', y: 2, v: 2, m: 5, pourquoi: 'Y2, V2 (sons), M5 (localise) → 9.' },
    { desc: 'M. U. ouvre les yeux quand tu l’appelles. Il sait qu’il est à l’hôpital mais se trompe d’année et de mois. Il lève le bras sur demande.', y: 3, v: 4, m: 6, pourquoi: 'Y3, V4 (confus), M6 → 13.' },
    { desc: 'Mme V. a les yeux fermés et n’ouvre pas les yeux à la pression. Aucun son. À la pression, ses bras se fléchissent rapidement, sans localiser.', y: 1, v: 1, m: 4, pourquoi: 'Y1, V1, M4 (flexion normale/retrait) → 6.' },
    { desc: 'M. W. ouvre les yeux à la voix. Il répond correctement à tes questions. Il ne bouge pas le bras droit, mais lève le gauche sur demande.', y: 3, v: 5, m: 6, pourquoi: 'On note la MEILLEURE réponse motrice (M6 à gauche) → 14. Le déficit droit se note à part : c’est une information majeure.' }
  ],
  ordre: [
    { titre: 'Examen neurologique infirmier', etapes: ['Observer le patient (éveil spontané ?)', 'Évaluer l’ouverture des yeux (Y)', 'Évaluer la réponse verbale (V)', 'Évaluer la réponse motrice (M)', 'Examiner les pupilles (taille, symétrie, réactivité)', 'Tester la force des 4 membres et comparer à l’évaluation précédente'], pourquoi: 'Une méthode toujours identique rend les évaluations comparables.', s: 'GCS+NEURO' }
  ],
  tri: [
    { titre: 'Urgence ou surveillance ?', cats: ['Alerter immédiatement', 'Surveiller et transmettre'], items: [['Glasgow qui perd 2 points', 0], ['Nouvelle anisocorie', 0], ['Douleur de cicatrice à 4/10 calmée par l’antalgique', 1], ['Anesthésie en selle après chirurgie lombaire', 0], ['Pansement de craniotomie propre et sec', 1], ['Polyurie à 400 mL/h après chirurgie hypophysaire', 0], ['Légère fatigue en fin de journée, examen neuro inchangé', 1]] }
  ],
  associe: [
    { titre: 'Neuro : chirurgie et surveillance', s: 'NEURO', paires: [['Craniotomie', 'Glasgow et pupilles'], ['Arthrodèse lombaire', 'Motricité des jambes'], ['Chirurgie cervicale antérieure', 'Gonflement du cou'], ['Transsphénoïdale', 'Ne pas se moucher'], ['Dexaméthasone', 'Glycémie'], ['HSA', 'Vasospasme']] }
  ],
  erreur: [
    { titre: 'Unité LAT, 9 h', scene: 'Tu relis les transmissions de tes collègues étudiants. Repère les erreurs.', s: 'GCS+NEURO+LAT', items: [['« Glasgow 11 » sans le détail Y/V/M', true, 'On note les 3 composantes séparément.'], ['« Pupilles égales et réactives à 8 h »', false], ['« Patient opéré du rachis, a uriné à 7 h »', false], ['« Patient post-craniotomie un peu somnolent, je laisse dormir » sans évaluation', true, 'Une somnolence nouvelle doit être évaluée (Glasgow).'], ['« DVE clampée pour la toilette à 7 h » (il est 9 h, toujours clampée)', true, 'Une DVE se déclampe après la mobilisation, selon prescription.']] }
  ]
};
