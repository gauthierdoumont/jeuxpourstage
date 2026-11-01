/* Scénarios supplémentaires — Étage 2, Bloc opératoire. Créé par Gauthier Doumont
 * Format : voir data/scenarios-rea.js */
window.SCENARIOS = window.SCENARIOS || {};
window.SCENARIOS.bloc = {
  sources: {
    RCUK: 'Resuscitation Council UK — Emergency treatment of anaphylaxis (2021, mise à jour 2025) 🟢',
    EMHG: 'European Malignant Hyperthermia Group — reconnaissance et prise en charge d’une crise (Br J Anaesth 2010) ; disponibilité du dantrolène (BJA 2020) 🟢',
    RAU: 'Rétention urinaire post-opératoire : protocoles locaux (seuils de sondage variables, souvent 300 à 800 mL) 🟠'
  },
  gardes: [
    {
      id: 'bloc-anaph', titre: 'Choc anaphylactique en salle 1', difficulte: 3,
      intro: 'Il est 8 h 20. M. Karim S., 45 ans, est installé pour une cure de hernie inguinale. L’anesthésiste vient d’injecter l’antibioprophylaxie et les produits d’induction.',
      retenir: 'Anaphylaxie au bloc : reconnaître vite (peau, respiration, PA), alerter, arrêter le produit suspect, adrénaline intramusculaire précoce selon protocole (l’IV est réservée aux équipes expérimentées), O₂, remplissage, noter les heures et les produits, prélèvements selon protocole pour l’enquête allergologique.',
      sbar: ['M. S., 45 ans, salle 1 : choc anaphylactique quelques minutes après l’induction', 'Cure de hernie programmée, aucun antécédent d’allergie connu, antibiotique et curare injectés à 8 h 18', 'PA remontée à 112/68 après adrénaline et remplissage, bronchospasme levé, éruption en régression', 'Je recommande une surveillance rapprochée en SSPI ou soins intensifs et une consultation d’allergologie'],
      noeuds: {
        debut: { heure: '08 h 22', patient: 'M. S., 45 ans — hernie inguinale', v: { FC: 128, PAS: 78, PAD: 42, SpO2: 91, FR: 14, T: 36.6, GCS: 3 }, texte: 'Quelques minutes après l’induction, tu vois des plaques rouges sur le thorax. La PA chute à 78/42 et l’anesthésiste signale que le patient est difficile à ventiler.', s: 'RCUK',
          choix: [
            { t: 'Dire tout haut ce que tu vois (« éruption + chute de PA ») et aider l’anesthésiste qui suspecte une anaphylaxie : appel à l’aide', q: 2, fb: 'Peau + atteinte respiratoire + hypotension brutale après injection : anaphylaxie jusqu’à preuve du contraire. On partage l’information immédiatement.', suite: 'stop' },
            { t: 'Penser à une simple réaction cutanée et continuer l’installation', q: 0, fb: 'L’éruption n’est jamais isolée ici : il y a aussi hypotension et bronchospasme.', suite: 'stop' },
            { t: 'Préparer la peau pour que le chirurgien commence vite', q: 0, fb: 'La priorité est la vie du patient, l’intervention est reportée.', suite: 'stop' }
          ] },
        stop: { heure: '08 h 23', texte: 'L’anesthésiste annonce : « Anaphylaxie ! ». Que fais-tu en tant que circulante ?', s: 'RCUK',
          choix: [
            { t: 'Arrêter la perfusion d’antibiotique en cours, apporter le chariot/kit d’anaphylaxie et préparer ce que l’anesthésiste prescrit (adrénaline, remplissage)', q: 2, fb: 'On supprime l’exposition au produit suspect et on prépare le traitement de première ligne : l’adrénaline.', suite: 'adre' },
            { t: 'Quitter la salle pour aller chercher un médecin', q: 0, fb: 'Le médecin est là : on appelle des renforts sans laisser l’équipe seule.', suite: 'adre' },
            { t: 'Donner un antihistaminique en premier', q: 0, fb: 'Les antihistaminiques ne traitent ni le choc ni le bronchospasme : l’adrénaline est le traitement de première ligne.', suite: 'adre' }
          ] },
        adre: { heure: '08 h 25', v: { FC: 118, PAS: 92, PAD: 54, SpO2: 94 }, texte: 'L’adrénaline a été administrée selon le protocole, le remplissage est lancé. La PA remonte un peu. Que fais-tu ensuite ?', s: 'RCUK',
          choix: [
            { t: 'Noter précisément les heures, les produits injectés avant la réaction et les traitements donnés', q: 2, fb: 'Cette traçabilité est indispensable pour l’enquête allergologique : il faudra identifier le produit responsable.', suite: 'surv' },
            { t: 'Jeter les seringues vides pour faire de la place', q: 0, fb: 'Les seringues et ampoules utilisées aident à identifier le produit en cause : on les garde selon le protocole.', suite: 'surv' },
            { t: 'Rien, l’anesthésiste s’en souviendra', q: 1, fb: 'Dans l’urgence, personne ne retient tout : il faut une trace écrite.', suite: 'surv' }
          ] },
        surv: { heure: '08 h 35', v: { FC: 104, PAS: 108, PAD: 64, SpO2: 97 }, texte: 'La situation se stabilise. Le chirurgien demande s’il peut commencer.', s: 'RCUK',
          choix: [
            { t: 'Rappeler que la décision revient à l’équipe (anesthésiste et chirurgien) et que la surveillance reste prioritaire : risque de réaction prolongée ou biphasique', q: 2, fb: 'Après une anaphylaxie, le patient reste à risque de récidive : la surveillance prime. L’intervention programmée est souvent reportée.', suite: 'fam' },
            { t: 'Dire oui, la PA est remontée', q: 0, fb: 'Une stabilisation récente ne veut pas dire que le danger est passé.', suite: 'fam' },
            { t: 'Ne rien dire', q: 1, fb: 'Ton avis compte : la sécurité est l’affaire de toute l’équipe.', suite: 'fam' }
          ] },
        fam: { heure: '09 h 30', texte: 'M. S. est transféré en surveillance. Plus tard, que faut-il organiser pour lui ?', s: 'RCUK',
          choix: [
            { t: 'L’information du patient, la déclaration selon la procédure et l’orientation vers une consultation d’allergologie (selon le médecin)', q: 2, fb: 'Sans bilan allergologique, il risque la même réaction lors d’une prochaine anesthésie.', suite: 'fin' },
            { t: 'Rien, c’était un accident isolé', q: 0, fb: 'Le risque se reproduit si le produit n’est pas identifié.', suite: 'fin' },
            { t: 'Lui conseiller d’éviter tous les antibiotiques à vie', q: 1, fb: 'Seul le bilan allergologique peut dire quel produit éviter.', suite: 'fin' }
          ] },
        fin: { fin: true, texte: 'L’anesthésiste te demande de préparer la transmission vers l’unité de surveillance.' }
      }
    },
    {
      id: 'bloc-hm', titre: 'Le CO₂ qui monte', difficulte: 3,
      intro: 'Il est 10 h 40. Lucas T., 19 ans, est opéré d’une épaule sous anesthésie générale par gaz halogéné. Tout se passe bien depuis 30 minutes.',
      retenir: 'Hyperthermie maligne : penser à une hausse inexpliquée de l’EtCO₂, une tachycardie, une rigidité. La fièvre est souvent tardive. Alerter, arrêter le gaz halogéné, apporter le dantrolène et le matériel de refroidissement, chacun dans son rôle.',
      sbar: ['Lucas T., 19 ans, salle 3 : suspicion d’hyperthermie maligne pendant une chirurgie d’épaule', 'Anesthésie générale par gaz halogéné, aucun antécédent connu', 'EtCO₂ en hausse inexpliquée, tachycardie, rigidité, température 38,9 °C en hausse ; dantrolène administré', 'Je demande un transfert en soins intensifs et l’orientation de la famille vers un centre de référence'],
      noeuds: {
        debut: { heure: '10 h 40', patient: 'Lucas T., 19 ans — épaule', v: { FC: 104, PAS: 132, PAD: 74, SpO2: 98, FR: 12, T: 37.2, GCS: 3 }, texte: 'L’anesthésiste remarque que le CO₂ expiré (EtCO₂) augmente sans explication malgré une ventilation correcte. La FC monte.', s: 'EMHG',
          choix: [
            { t: 'Rester attentive, aider l’anesthésiste et signaler tout autre signe (rigidité, sueurs, chaleur)', q: 2, fb: 'Une hausse inexpliquée de l’EtCO₂ est souvent le premier signe d’hyperthermie maligne : chaque observation compte.', suite: 'rigide' },
            { t: 'Considérer que c’est normal pendant une chirurgie', q: 0, fb: 'Une hausse inexpliquée de l’EtCO₂ ne doit jamais être banalisée.', suite: 'rigide' },
            { t: 'Aller en pause, ce n’est pas ton domaine', q: 0, fb: 'La circulante est indispensable en cas d’urgence.', suite: 'rigide' }
          ] },
        rigide: { heure: '10 h 45', v: { FC: 132, PAS: 140, PAD: 78, T: 38.1 }, texte: 'Le chirurgien signale des muscles très raides. La température monte à 38,1 °C. L’anesthésiste annonce : « Suspicion d’hyperthermie maligne ! »', s: 'EMHG',
          choix: [
            { t: 'Appeler des renforts et apporter immédiatement le kit d’hyperthermie maligne (dantrolène) et le matériel de refroidissement', q: 2, fb: 'Le dantrolène est le seul traitement spécifique : il doit être disponible là où l’on utilise des halogénés, et sa préparation demande des bras.', suite: 'gaz' },
            { t: 'Donner du paracétamol', q: 0, fb: 'La fièvre vient d’un emballement musculaire : le paracétamol n’agit pas sur la cause.', suite: 'gaz' },
            { t: 'Attendre de voir si la température continue à monter', q: 0, fb: 'La survie dépend de la rapidité de reconnaissance et de traitement.', suite: 'gaz' }
          ] },
        gaz: { heure: '10 h 47', texte: 'L’anesthésiste arrête le gaz halogéné. Pourquoi est-ce essentiel ?', s: 'EMHG',
          choix: [
            { t: 'Parce que les halogénés (et la succinylcholine) déclenchent la crise chez les personnes prédisposées', q: 2, fb: 'Supprimer le déclencheur est la première étape, avant le dantrolène.', suite: 'dantro' },
            { t: 'Parce que le gaz est trop cher', q: 0, fb: 'Non : c’est le déclencheur de la crise.', suite: 'dantro' },
            { t: 'Pour réveiller le patient tout de suite', q: 1, fb: 'L’anesthésie est maintenue autrement ; le but est d’arrêter le déclencheur.', suite: 'dantro' }
          ] },
        dantro: { heure: '10 h 50', v: { FC: 138, T: 38.9 }, texte: 'On te demande d’aider à préparer le dantrolène (dose calculée par l’anesthésiste selon le poids).', s: 'EMHG+CBIP',
          choix: [
            { t: 'Préparer selon les instructions du kit et de l’anesthésiste, avec double vérification ; plusieurs flacons sont nécessaires, demander de l’aide', q: 2, fb: 'La reconstitution est longue : c’est un travail d’équipe. Dose et préparation selon le protocole et le CBIP.', suite: 'froid' },
            { t: 'Calculer toi-même une dose au hasard pour gagner du temps', q: 0, fb: 'Jamais : la dose est prescrite et vérifiée.', suite: 'froid' },
            { t: 'Laisser l’anesthésiste tout faire seul', q: 1, fb: 'Il a besoin d’aide : la préparation demande plusieurs personnes.', suite: 'froid' }
          ] },
        froid: { heure: '11 h 05', v: { FC: 112, PAS: 124, PAD: 70, T: 38.4 }, texte: 'Le dantrolène est administré. Quelles autres mesures peux-tu aider à mettre en place ?', s: 'EMHG',
          choix: [
            { t: 'Refroidissement (poches de glace, liquides froids selon prescription), surveillance de la température, de la diurèse et des prélèvements demandés', q: 2, fb: 'On traite l’hyperthermie et on surveille les complications (atteinte musculaire, troubles du potassium, reins).', suite: 'fin' },
            { t: 'Couvrir le patient avec la couverture chauffante', q: 0, fb: 'Au contraire : il faut le refroidir.', suite: 'fin' },
            { t: 'Ranger la salle', q: 0, fb: 'Le patient reste instable : la surveillance prime.', suite: 'fin' }
          ] },
        fin: { fin: true, texte: '11 h 30 : Lucas est stabilisé, un transfert en soins intensifs est organisé.' }
      }
    },
    {
      id: 'bloc-sspi', titre: 'SSPI : quatre réveils en même temps', difficulte: 2,
      intro: 'Il est 11 h. En salle de réveil, tu surveilles avec ton infirmière 4 patients arrivés en 20 minutes.',
      retenir: 'En SSPI : voies aériennes et respiration d’abord, puis circulation (saignement), puis douleur, nausées, température et miction. Le score d’Aldrete ne mesure ni la douleur ni les nausées.',
      sbar: ['Mme W., 67 ans, prothèse de genou : saignement important au pansement avec PA 92/54', 'Anesthésie générale, sous anticoagulant préventif, redon déjà productif', 'Je suspecte une hémorragie post-opératoire', 'Je demande que le chirurgien vienne l’examiner maintenant'],
      noeuds: {
        debut: { heure: '11 h 00', patient: '4 patients en SSPI', v: { FC: 88, PAS: 128, PAD: 72, SpO2: 88, FR: 8, T: 36.1, GCS: 13 }, texte: 'M. V., opéré du ventre, ronfle bruyamment, sa SpO₂ descend à 88 %. Mme W. (genou) se plaint de son pansement. Mme X. vomit. M. Y. (rachianesthésie) demande à uriner.', s: 'PERIOP',
          choix: [
            { t: 'M. V. d’abord : libérer les voies aériennes (subluxation de la mâchoire), O₂, stimuler et alerter l’anesthésiste', q: 2, fb: 'A avant tout : ronflement + désaturation = obstruction des voies aériennes supérieures.', suite: 'mme_w' },
            { t: 'Mme X. d’abord, elle vomit', q: 1, fb: 'Les vomissements sont à gérer vite (risque d’inhalation), mais une obstruction avec désaturation est plus urgente. Une collègue peut l’aider à se tourner sur le côté.', suite: 'mme_w' },
            { t: 'Accompagner M. Y. aux toilettes', q: 0, fb: 'Après une rachianesthésie, il ne peut pas se lever seul, et ce n’est pas la priorité.', suite: 'mme_w' }
          ] },
        mme_w: { heure: '11 h 08', patient: 'Mme W., 67 ans — prothèse de genou', v: { FC: 118, PAS: 92, PAD: 54, SpO2: 96, FR: 20, T: 36.2, GCS: 15 }, texte: 'M. V. respire mieux. Le pansement de Mme W. est saturé de sang et le redon s’est rempli vite. FC 118, PA 92/54.', s: 'PERIOP',
          choix: [
            { t: 'Prévenir immédiatement l’anesthésiste/le chirurgien (SBAR), surveiller PA/FC rapprochées et ne pas refaire le pansement seule', q: 2, fb: 'Tachycardie + hypotension + saignement = hémorragie possible : c’est une urgence médicale.', suite: 'nvpo' },
            { t: 'Renforcer le pansement et attendre', q: 1, fb: 'Renforcer peut aider temporairement, mais l’alerte est prioritaire.', suite: 'nvpo' },
            { t: 'Donner un antalgique car elle a mal', q: 0, fb: 'La douleur compte, mais l’hémorragie possible passe d’abord.', suite: 'nvpo' }
          ] },
        nvpo: { heure: '11 h 20', patient: 'Mme X., 34 ans — cholécystectomie', v: { FC: 92, PAS: 118, PAD: 70, SpO2: 97, FR: 16, T: 36.4, GCS: 15 }, texte: 'Mme X., non-fumeuse, connue pour le mal des transports, vomit pour la deuxième fois.', s: 'APFEL',
          choix: [
            { t: 'La positionner sur le côté ou assise, aspirer si besoin, prévenir l’anesthésiste pour un antiémétique selon prescription', q: 2, fb: 'Femme, non-fumeuse, mal des transports, opioïdes : score d’Apfel élevé. On protège les voies aériennes et on traite selon prescription.', suite: 'globe' },
            { t: 'Lui donner à boire pour rincer', q: 0, fb: 'Boire augmente les nausées et le risque de fausse route.', suite: 'globe' },
            { t: 'Lui dire que c’est normal et attendre', q: 1, fb: 'Les NVPO sont fréquentes, mais elles se traitent : inconfort, risque d’inhalation, saignement.', suite: 'globe' }
          ] },
        globe: { heure: '11 h 40', patient: 'M. Y., 71 ans — rachianesthésie', v: { FC: 84, PAS: 146, PAD: 82, SpO2: 97, FR: 16, T: 36.0, GCS: 15 }, texte: 'M. Y. n’arrive pas à uriner, il a mal au bas-ventre. Le bladder scan montre un volume important.', s: 'RAU',
          choix: [
            { t: 'Signaler la rétention et appliquer le protocole du service (sondage évacuateur selon le seuil prévu)', q: 2, fb: 'La rachianesthésie favorise la rétention. Le seuil de sondage varie selon les protocoles : on suit celui de l’hôpital.', suite: 'temp' },
            { t: 'Lui donner beaucoup à boire', q: 0, fb: 'La vessie est déjà pleine : boire aggrave l’inconfort.', suite: 'temp' },
            { t: 'Le faire lever pour aller aux toilettes', q: 0, fb: 'Après une rachianesthésie, le lever se fait seulement quand le bloc moteur a disparu, selon protocole : risque de chute.', suite: 'temp' }
          ] },
        temp: { heure: '12 h 00', v: { T: 35.6 }, texte: 'Avant le transfert, tu remarques que M. Y. a 35,6 °C et frissonne. Son Aldrete est à 9.', s: 'NICEH+ALD',
          choix: [
            { t: 'Le réchauffer (air pulsé) et attendre ≥ 36 °C avant le transfert', q: 2, fb: 'NICE : pas de transfert si la température est < 36 °C. Le score d’Aldrete ne suffit pas à lui seul.', suite: 'fin' },
            { t: 'Le transférer, son Aldrete est bon', q: 0, fb: 'L’Aldrete ne prend pas en compte la température.', suite: 'fin' },
            { t: 'Lui donner une couverture et le transférer', q: 1, fb: 'Une couverture simple ne suffit pas : réchauffement actif recommandé.', suite: 'fin' }
          ] },
        fin: { fin: true, texte: '12 h 15 : le calme revient. Le chirurgien arrive pour Mme W. et te demande de lui résumer la situation.' }
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
      choix: [{ t: 'Le stimuler, O₂ et appeler l’anesthésiste (dépression respiratoire liée aux opioïdes ?)', q: 2, fb: 'FR basse + somnolence sous opioïdes : risque de dépression respiratoire.' }, { t: 'Le laisser dormir, il est fatigué', q: 0, fb: 'Une FR à 8 est anormale.' }, { t: 'Lui redonner un antalgique', q: 0, fb: 'Cela aggraverait la dépression respiratoire.' }] }
  ],
  prio: [
    { titre: 'La SSPI déborde', intro: 'Quatre patients, une seule paire de mains (la tienne) pendant 2 minutes.', s: 'PERIOP',
      patients: [['M. E. ronfle, tirage, SpO₂ 87 %', 'A : obstruction des voies aériennes.'], ['Mme F. : PA 85/50, FC 122, pansement abdominal qui se teinte', 'C : hémorragie possible.'], ['M. G. : douleur 8/10', 'Douleur intense à traiter vite, mais pas de menace vitale immédiate.'], ['Mme H. : demande quand elle pourra manger', 'Information de confort, en dernier.']] },
    { titre: 'Avant l’induction', intro: 'Tu prépares la salle 2. Quatre points à régler.', s: 'OMS',
      patients: [['Le patient dit être allergique à la pénicilline, non noté dans le dossier', 'L’antibioprophylaxie est imminente : à signaler en premier.'], ['Le site opératoire n’est pas marqué', 'Doit être réglé avant l’induction (check-list).'], ['La couverture à air pulsé n’est pas encore branchée', 'Important pour prévenir l’hypothermie, à faire rapidement.'], ['La poubelle de la salle est pleine', 'Logistique, en dernier.']] }
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
    ['PLEXUS', 'Réseau de nerfs de l’épaule, abîmé si le bras dépasse 90° d’abduction', 'Le patient endormi ne peut pas signaler l’étirement.']
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
