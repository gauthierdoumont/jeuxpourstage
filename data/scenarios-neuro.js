/* Scénarios supplémentaires — Étage 3, Neurochirurgie / projet LAT. Créé par Gauthier Doumont
 * Format : voir data/scenarios-rea.js */
window.SCENARIOS = window.SCENARIOS || {};
window.SCENARIOS.neuro = {
  sources: {
    ADA: 'American Diabetes Association — Standards of Care 2025, section 6 (hypoglycémie / hyperglycémie) 🟢',
    RAU: 'Rétention urinaire post-opératoire : protocoles locaux (seuils de sondage variables) 🟠'
  },
  gardes: [
    {
      id: 'neuro-crise', titre: 'Nuit après une craniotomie', difficulte: 3,
      intro: 'Il est 23 h. Mme Nadia R., 52 ans, a été opérée ce matin d’un méningiome frontal (craniotomie). Elle est sous dexaméthasone et lévétiracétam.',
      retenir: 'Après une craniotomie : surveillance neuro rapprochée et comparée, crise = protéger, chronométrer, appeler, PLS après. Toute baisse du Glasgow ou nouvelle anisocorie = urgence (hématome ?). Sous corticoïdes : glycémie.',
      sbar: ['Mme R., 52 ans, chambre 4 : crise convulsive généralisée de 2 minutes à 1 h 10, puis somnolence', 'J0 d’une craniotomie pour méningiome, sous dexaméthasone et lévétiracétam', 'Actuellement Glasgow 13 (Y3 V4 M6), pupilles égales et réactives, glycémie 212 mg/dL', 'Je demande que vous veniez l’évaluer et que l’on discute de la suite du traitement et de la glycémie'],
      noeuds: {
        debut: { heure: '23 h 00', patient: 'Mme R., 52 ans — craniotomie J0', v: { FC: 76, PAS: 138, PAD: 78, SpO2: 97, FR: 14, T: 37.2, GCS: 15 }, texte: 'Tour de 23 h : Mme R. est orientée, Y4 V5 M6, pupilles égales. Elle a mal à la tête (5/10) et des nausées.', s: 'NEURO',
          choix: [
            { t: 'Noter l’évaluation complète (Glasgow détaillé, pupilles, motricité), évaluer la douleur et les nausées, informer selon prescription', q: 2, fb: 'Une évaluation de référence détaillée permet de repérer le moindre changement ensuite.', suite: 'crise' },
            { t: 'La laisser dormir sans évaluation jusqu’au matin', q: 0, fb: 'Le jour de l’intervention, la surveillance neuro est rapprochée selon protocole.', suite: 'crise' },
            { t: 'Noter seulement « Glasgow 15 »', q: 1, fb: 'Le total seul ne permet pas de suivre l’évolution de chaque composante ni des pupilles.', suite: 'crise' }
          ] },
        crise: { heure: '01 h 10', v: { FC: 124, PAS: 168, PAD: 92, SpO2: 88, FR: 6, GCS: 3 }, texte: 'Sa voisine sonne : Mme R. a des mouvements saccadés des 4 membres, elle ne répond pas.', s: 'NEURO',
          choix: [
            { t: 'Noter l’heure, protéger (barrières, tête), ne rien mettre dans la bouche, appeler à l’aide, O₂ dès que possible', q: 2, fb: 'Chronométrer, protéger, appeler : c’est la conduite infirmière. > 5 minutes = état de mal.', suite: 'post' },
            { t: 'Lui tenir fermement les bras pour arrêter les mouvements', q: 0, fb: 'Contenir une crise expose à des blessures (luxations, fractures).', suite: 'post' },
            { t: 'Lui mettre une canule dans la bouche pendant la crise', q: 0, fb: 'Jamais pendant la crise : risque de blessure dentaire et de fausse route.', suite: 'post' }
          ] },
        post: { heure: '01 h 12', v: { FC: 108, PAS: 150, PAD: 84, SpO2: 92, FR: 18, GCS: 9 }, texte: 'La crise s’arrête après 2 minutes. Mme R. est somnolente, respire bruyamment, salive abondante.', s: 'NEURO',
          choix: [
            { t: 'Position latérale de sécurité, aspiration buccale si besoin, O₂, surveillance du Glasgow et des pupilles', q: 2, fb: 'En phase post-critique, on protège les voies aériennes et on surveille la reprise de conscience.', suite: 'gly' },
            { t: 'La laisser sur le dos et partir', q: 0, fb: 'Risque d’inhalation et de nouvelle crise non vue.', suite: 'gly' },
            { t: 'La faire boire pour qu’elle se réveille', q: 0, fb: 'Somnolente : risque de fausse route.', suite: 'gly' }
          ] },
        gly: { heure: '01 h 20', v: { FC: 96, PAS: 142, PAD: 80, SpO2: 96, FR: 16, GCS: 13 }, texte: 'Elle se réveille progressivement (Y3 V4 M6). Quel paramètre simple vérifies-tu, en plus des pupilles ?', s: 'NEURO+ADA',
          choix: [
            { t: 'La glycémie capillaire (crise + corticoïdes)', q: 2, fb: 'Une hypoglycémie peut provoquer une crise, et la dexaméthasone fait monter la glycémie : ici 212 mg/dL, à signaler.', suite: 'appel' },
            { t: 'La température uniquement', q: 1, fb: 'Utile, mais la glycémie est un réflexe devant toute crise ou trouble de conscience.', suite: 'appel' },
            { t: 'Rien, elle se réveille', q: 0, fb: 'On cherche toujours une cause réversible.', suite: 'appel' }
          ] },
        appel: { heure: '01 h 25', texte: 'Tu appelles le neurochirurgien de garde. Comment ?', s: 'SBAR',
          choix: [
            { t: 'En SBAR : crise de 2 min, J0 craniotomie, Glasgow 13 avec pupilles égales, glycémie 212 ; je demande une évaluation', q: 2, fb: 'Un message structuré permet au médecin de décider vite (imagerie ? traitement ?).', suite: 'aniso' },
            { t: '« Elle a fait une crise, vous pouvez passer quand vous voulez »', q: 1, fb: 'Il manque l’évaluation et une demande claire.', suite: 'aniso' },
            { t: 'Attendre le matin car elle va mieux', q: 0, fb: 'Une crise après craniotomie doit être signalée immédiatement.', suite: 'aniso' }
          ] },
        aniso: { heure: '02 h 30', v: { FC: 58, PAS: 176, PAD: 84, FR: 10, GCS: 10 }, texte: 'Au contrôle suivant : Glasgow 10, pupille droite plus large et paresseuse, FC 58, PA 176/84.', s: 'NEURO+GCSP',
          choix: [
            { t: 'Urgence : rappeler immédiatement le neurochirurgien, rester auprès d’elle, tête à 30° dans l’axe', q: 2, fb: 'Baisse du Glasgow + anisocorie + HTA/bradycardie = hypertension intracrânienne grave (hématome post-opératoire ?).', suite: 'fin' },
            { t: 'Refaire un contrôle dans 1 heure', q: 0, fb: 'Ce tableau impose une action immédiate.', suite: 'fin' },
            { t: 'Donner un antihypertenseur pour faire baisser la PA', q: 0, fb: 'L’HTA est ici une réaction pour maintenir la perfusion cérébrale : on ne la traite pas sans avis médical.', suite: 'fin' }
          ] },
        fin: { fin: true, texte: 'Le neurochirurgien arrive et organise un scanner en urgence. Il te demande de lui résumer la nuit.' }
      }
    },
    {
      id: 'neuro-rachis', titre: 'Les jambes lourdes de M. Paul', difficulte: 2,
      intro: 'Il est 20 h. M. Paul D., 63 ans, a été opéré ce matin d’une arthrodèse lombaire (L4-L5). Il porte un drain.',
      retenir: 'Après chirurgie du rachis : comparer la motricité et la sensibilité au pré-opératoire, surveiller miction et sensibilité du périnée, le drain et le pansement. Un nouveau déficit = urgence (hématome compressif).',
      sbar: ['M. D., 63 ans, chambre 11 : faiblesse nouvelle des deux jambes depuis 30 minutes et engourdissement du périnée', 'J0 d’une arthrodèse L4-L5, drain peu productif, sous anticoagulant préventif', 'Je suspecte un hématome compressif : force à 3/5 aux deux jambes alors qu’il était à 5/5 à 18 h', 'Je demande votre évaluation immédiate'],
      noeuds: {
        debut: { heure: '20 h 00', patient: 'M. D., 63 ans — arthrodèse lombaire J0', v: { FC: 84, PAS: 132, PAD: 76, SpO2: 96, FR: 16, T: 37.4, GCS: 15 }, texte: 'M. D. a mal (6/10). Force des jambes 5/5, sensibilité normale. Il n’a pas uriné depuis le retour du bloc (6 h).', s: 'NEURO+RAU',
          choix: [
            { t: 'Évaluer la douleur et le globe vésical (bladder scan selon protocole), noter l’examen neuro complet comme référence', q: 2, fb: 'Douleur, miction et examen neuro de référence : trois piliers de la surveillance post-rachis.', suite: 'mobil' },
            { t: 'Lui demander de se lever pour aller aux toilettes', q: 0, fb: 'Le lever se fait selon protocole et prescription, avec aide.', suite: 'mobil' },
            { t: 'Attendre qu’il urine spontanément', q: 1, fb: 'Après 6 h sans miction et avec une douleur abdominale possible, on vérifie.', suite: 'mobil' }
          ] },
        mobil: { heure: '20 h 30', texte: 'Il doit être tourné sur le côté pour un soin.', s: 'NEURO',
          choix: [
            { t: 'Mobilisation en bloc (épaules et bassin ensemble), à deux, en surveillant le drain', q: 2, fb: 'On évite toute torsion de la colonne opérée et l’arrachement du drain.', suite: 'deficit' },
            { t: 'Lui demander de se tourner seul en tirant sur la barrière', q: 0, fb: 'La torsion du tronc est à éviter après une arthrodèse.', suite: 'deficit' },
            { t: 'Tourner d’abord les jambes puis les épaules', q: 0, fb: 'Cela crée une torsion de la colonne.', suite: 'deficit' }
          ] },
        deficit: { heure: '22 h 00', v: { FC: 96, PAS: 146, PAD: 82 }, texte: 'Il te dit : « Mes jambes sont lourdes et je ne sens plus bien mes fesses. » Force 3/5 aux deux jambes.', s: 'NEURO',
          choix: [
            { t: 'Comparer à l’examen de 20 h, prévenir immédiatement le neurochirurgien : suspicion d’hématome compressif', q: 2, fb: 'Nouveau déficit bilatéral + anesthésie en selle = urgence chirurgicale : chaque heure compte pour la récupération.', suite: 'drain' },
            { t: 'Le rassurer, c’est l’anesthésie', q: 0, fb: 'Il avait 5/5 à 20 h : le déficit est nouveau.', suite: 'drain' },
            { t: 'Lui donner un antalgique et revoir dans 2 h', q: 0, fb: 'Retarder peut entraîner un déficit définitif.', suite: 'drain' }
          ] },
        drain: { heure: '22 h 05', texte: 'En attendant le médecin, tu regardes le drain : il n’a presque rien donné depuis le bloc.', s: 'NEURO',
          choix: [
            { t: 'Vérifier qu’il n’est pas coudé ou clampé et transmettre cette information au médecin', q: 2, fb: 'Un drain bouché peut laisser le sang s’accumuler au contact des nerfs.', suite: 'fin' },
            { t: 'Tirer sur le drain pour le déboucher', q: 0, fb: 'Jamais : risque de le déplacer ou de l’arracher.', suite: 'fin' },
            { t: 'Rien, c’est bon signe qu’il ne coule pas', q: 0, fb: 'Pas forcément : il peut être bouché.', suite: 'fin' }
          ] },
        fin: { fin: true, texte: '22 h 15 : le neurochirurgien arrive et organise une imagerie en urgence. Il te demande ta transmission.' }
      }
    },
    {
      id: 'neuro-lat', titre: 'LAT : tu coordonnes la matinée', difficulte: 2,
      intro: 'Il est 7 h. Aujourd’hui, dans l’unité LAT, tu es l’étudiante coordinatrice : tu répartis le travail entre 4 étudiants pour 16 patients, avec l’infirmière superviseure en appui.',
      retenir: 'Coordonner, c’est prioriser les patients à risque, répartir selon les compétences, déléguer avec des consignes claires, vérifier, communiquer en SBAR et savoir demander de l’aide.',
      sbar: ['Je vous appelle pour M. U., chambre 3 : nouvelle désorientation et Glasgow passé de 15 à 13', 'J2 d’une évacuation d’hématome sous-dural chronique, sous antiagrégant à l’admission', 'Pupilles égales, pas de déficit moteur, glycémie normale ; le drain a été retiré hier', 'Je demande que vous veniez l’examiner et que l’on discute d’une imagerie'],
      noeuds: {
        debut: { heure: '07 h 00', patient: 'Unité LAT — 16 patients', v: { FC: 80, PAS: 128, PAD: 74, SpO2: 97, FR: 16, T: 36.9, GCS: 15 }, texte: 'Comment répartis-tu les patients entre les 4 étudiants ?', s: 'LAT',
          choix: [
            { t: 'Selon la charge en soins et la complexité, en confiant les patients instables aux plus expérimentés et en gardant du temps pour coordonner', q: 2, fb: 'Une répartition équilibrée (pas juste « 4 patients chacun ») sécurise la journée.', suite: 'deleg' },
            { t: '4 patients chacun dans l’ordre des chambres', q: 1, fb: 'Simple mais injuste : un étudiant peut se retrouver avec tous les patients lourds.', suite: 'deleg' },
            { t: 'Tu prends tous les patients graves pour toi', q: 0, fb: 'Tu n’aurais plus de temps pour coordonner, et les autres n’apprennent pas.', suite: 'deleg' }
          ] },
        deleg: { heure: '07 h 30', texte: 'Tu demandes à Léa de faire les paramètres des chambres 1 à 4. Comment formules-tu ta demande ?', s: 'LAT+LEGAL',
          choix: [
            { t: '« Prends PA, FC, T°, Glasgow et pupilles des chambres 1 à 4 avant 8 h, et préviens-moi tout de suite si un Glasgow baisse ou si une PA dépasse les limites prescrites. »', q: 2, fb: 'Une délégation claire : quoi, qui, quand, et ce qui doit déclencher une alerte.', suite: 'imprevu' },
            { t: '« Tu peux faire les paramètres ? »', q: 1, fb: 'Trop vague : quels patients, quels paramètres, pour quand, que faire si c’est anormal ?', suite: 'imprevu' },
            { t: 'Ne rien demander et tout faire toi-même', q: 0, fb: 'Impossible avec 16 patients : déléguer est une compétence.', suite: 'imprevu' }
          ] },
        imprevu: { heure: '08 h 15', patient: 'M. U., 81 ans — HSD chronique J2', v: { FC: 88, PAS: 152, PAD: 86, GCS: 13 }, texte: 'Léa te prévient : M. U. (chambre 3) est désorienté, Glasgow 13 alors qu’il était à 15 hier.', s: 'GCS+NEURO',
          choix: [
            { t: 'Aller l’évaluer immédiatement (Glasgow, pupilles, motricité, glycémie) puis prévenir le médecin en SBAR', q: 2, fb: 'Une baisse du Glasgow après évacuation d’un HSD peut signer une récidive : évaluation et appel rapides.', suite: 'visite' },
            { t: 'Lui dire de surveiller et de te tenir au courant', q: 0, fb: 'Une dégradation neurologique nécessite une évaluation par la coordinatrice et un appel.', suite: 'visite' },
            { t: 'Attendre la visite du médecin à 10 h', q: 0, fb: '2 heures de retard peuvent aggraver une récidive d’hématome.', suite: 'visite' }
          ] },
        visite: { heure: '10 h 00', texte: 'Visite médicale. Le médecin te demande les points importants de chaque patient. Comment t’y prends-tu ?', s: 'SBAR+LAT',
          choix: [
            { t: 'Une liste préparée : problèmes du jour, résultats à voir, questions précises pour chaque patient', q: 2, fb: 'Une visite préparée est plus courte et rien n’est oublié.', suite: 'famille' },
            { t: 'Raconter la nuit de chaque patient en détail', q: 1, fb: 'Trop long : le médecin a besoin des points clés.', suite: 'famille' },
            { t: 'Laisser chaque étudiant improviser', q: 0, fb: 'Risque d’oublis : la coordinatrice synthétise.', suite: 'famille' }
          ] },
        famille: { heure: '11 h 30', texte: 'La fille d’un patient s’énerve au poste de soins : « Personne ne me dit rien sur mon père ! »', s: 'LAT',
          choix: [
            { t: 'L’accueillir au calme, écouter, donner ce qui relève de ton rôle et organiser un contact avec le médecin', q: 2, fb: 'L’écoute désamorce souvent la colère ; les informations médicales relèvent du médecin.', suite: 'aide' },
            { t: 'Lui répondre qu’elle doit attendre comme tout le monde', q: 0, fb: 'Cela renforce le sentiment d’abandon.', suite: 'aide' },
            { t: 'Lui lire le dossier médical', q: 0, fb: 'Secret professionnel : l’accès au dossier suit des règles précises.', suite: 'aide' }
          ] },
        aide: { heure: '12 h 30', texte: 'Tu te sens débordée : deux sorties, une entrée et un pansement complexe en même temps.', s: 'LAT',
          choix: [
            { t: 'Prioriser, redistribuer une tâche et demander l’aide de l’infirmière superviseure', q: 2, fb: 'Savoir demander de l’aide à temps est une compétence de sécurité.', suite: 'fin' },
            { t: 'Ne rien dire et accélérer', q: 0, fb: 'La précipitation augmente le risque d’erreur.', suite: 'fin' },
            { t: 'Reporter l’entrée au lendemain', q: 0, fb: 'Ce n’est pas ta décision et le patient attend un lit.', suite: 'fin' }
          ] },
        fin: { fin: true, texte: '14 h : relève. L’infirmière superviseure te demande de refaire l’appel que tu as passé pour M. U.' }
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
      choix: [{ t: 'Proposer de garder la tête dans l’axe et la position la plus courte possible à plat, selon la tolérance et le protocole', q: 2, fb: 'Tête tournée et position à plat gênent le retour veineux et augmentent la PIC.' }, { t: 'La laisser faire', q: 0, fb: 'Risque d’augmentation de la PIC.' }, { t: 'Annuler la toilette', q: 1, fb: 'L’hygiène reste nécessaire : on l’adapte.' }] }
  ],
  prio: [
    { titre: 'Début de service en neurochirurgie', intro: 'Tu reçois 4 patients à 7 h. Qui vois-tu en premier ?', s: 'NEURO+GCS',
      patients: [['M. N. : Glasgow passé de 15 à 12 pendant la nuit, pupille gauche plus large', 'Dégradation neurologique + anisocorie : urgence absolue.'], ['Mme O. : opérée du rachis hier, nouveau fourmillement des deux jambes', 'Suspicion de compression : urgence.'], ['M. P. : douleur 6/10 à l’incision de sa craniotomie', 'Douleur à soulager rapidement, mais stable.'], ['Mme Q. : sortie prévue ce midi', 'Organisation, en dernier.']] },
    { titre: 'Les sonnettes du soir', intro: 'Quatre sonnettes retentissent en même temps.', s: 'NEURO+DVE',
      patients: [['Chambre 2 : patient en crise convulsive', 'Menace vitale immédiate (voies aériennes).'], ['Chambre 5 : la poche de DVE est tombée au sol', 'Risque de surdrainage rapide : à clamper/remettre à niveau tout de suite.'], ['Chambre 7 : patient opéré du rachis qui n’a pas uriné depuis 8 h', 'Globe possible : à voir rapidement.'], ['Chambre 9 : patiente qui demande une couverture', 'Confort, en dernier.']] },
    { titre: 'Unité LAT : 11 h', intro: 'Tu es coordinatrice. Quatre demandes arrivent.', s: 'LAT',
      patients: [['Un étudiant t’informe d’une SpO₂ à 86 % chez un patient', 'B : à évaluer immédiatement.'], ['Le labo appelle pour une natrémie à 126 mmol/L (patient HSA)', 'Résultat critique à transmettre au médecin rapidement.'], ['Une entrée arrive des urgences', 'À accueillir, mais après les situations instables.'], ['Le service de diététique demande les régimes de demain', 'Administratif, en dernier.']] }
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
    ['DELEGATION', 'Confier une tâche à quelqu’un en gardant la responsabilité du suivi', 'Compétence clé du projet LAT.']
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
