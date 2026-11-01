/* Scénarios supplémentaires — Étage 1, Soins intensifs. Créé par Gauthier Doumont
 * Format : window.SCENARIOS.rea = { sources, gardes, situations, prio, mots, ordre, tri, associe, erreur }
 * Les gardes ont un `id` stable (sert à mémoriser le record) : ne pas le changer. */
window.SCENARIOS = window.SCENARIOS || {};
window.SCENARIOS.rea = {
  gds: true,
  sources: {
    ERCALS: 'ERC Guidelines 2025 — Adult ALS ; Resuscitation Council UK 2025 (adrénaline dès que possible si rythme non choquable, après le 3e choc si choquable) 🟢',
    PHYSIO: 'Physiologie / soins infirmiers de base (consensus d’enseignement) 🟠',
    RAIS: 'Raisonnement clinique et priorisation (consensus d’enseignement) 🟠',
    RAU: 'Rétention urinaire post-opératoire : protocoles locaux (seuils de sondage variables) 🟠',
    ADA: 'American Diabetes Association — Standards of Care 2025, section 6 (hypoglycémie) 🟢'
  },
  gardes: [
    {
      id: 'rea-acr', titre: 'Arrêt cardiaque au box 5', difficulte: 3,
      varier: { FC: 6, PAS: 8, SpO2: 1, FR: 2, T: 0.2 },
      intro: 'Il est 4 h 10. M. Hugo F., 72 ans, admis pour infarctus, est au box 5. Tu entends l’alarme du scope en passant dans le couloir.',
      retenir: 'Arrêt cardiaque : reconnaître (pas de réponse, pas de respiration normale), appeler, masser tout de suite, défibriller sans délai si rythme choquable, limiter les interruptions, chercher les 4H-4T. L’adrénaline se donne après le 3e choc si le rythme est choquable, dès que possible s’il ne l’est pas (ERC 2025).',
      sbar: ['M. F., 72 ans, box 5 : arrêt cardiaque en fibrillation ventriculaire, récupération d’une activité circulatoire après plusieurs chocs', 'Admis pour infarctus, kaliémie élevée sur la prise de sang de minuit', 'Actuellement pouls présent, PA basse, non réveillé, sous O₂', 'Je demande votre évaluation immédiate pour la suite de la prise en charge post-réanimation et la correction du potassium'],
      noeuds: {
        debut: { heure: '04 h 10', patient: 'M. F., 72 ans — infarctus', v: { FC: 0, PAS: null, PAD: null, SpO2: null, FR: 0, T: 36.8, GCS: 3 }, texte: 'Le scope montre un tracé chaotique. M. F. ne répond pas quand tu l’appelles et le secoues doucement. Il ne respire pas normalement.', s: 'ERC', indice: 'Pas de réponse + pas de respiration normale : chaque seconde compte.',
          choix: [
            { t: 'Crier à l’aide / déclencher l’alarme de réanimation et commencer immédiatement les compressions thoraciques', q: 2, v: {}, fb: 'Pas de réponse + pas de respiration normale = arrêt cardiaque. Chaque minute sans massage diminue les chances de survie.', suite: 'defib' },
            { t: 'Chercher le pouls pendant 1 minute pour être sûre', q: 0, v: {}, fb: 'La recherche du pouls ne doit pas dépasser 10 secondes : elle retarde le massage et elle est peu fiable.', suite: 'comp_retard' },
            { t: 'Aller chercher le médecin au bureau', q: 0, v: {}, fb: 'On ne laisse pas un patient en arrêt seul : on appelle (alarme, sonnette, téléphone) et on masse.', suite: 'comp_retard' }
          ] },
        comp_retard: { heure: '04 h 12', texte: '⚠️ Complication : deux minutes se sont écoulées sans massage. Le tracé est toujours chaotique, M. F. est gris.', s: 'ERC', indice: 'Il n’est jamais trop tard pour commencer le massage.',
          choix: [
            { t: 'Débuter immédiatement les compressions et faire déclencher l’alarme par la première personne qui arrive', q: 2, v: {}, fb: 'Rattrapage : on masse tout de suite. Le retard a diminué les chances, mais le massage reste vital.', suite: 'defib' },
            { t: 'Continuer à chercher le pouls', q: 0, v: {}, fb: 'Sans massage, le cerveau n’est plus oxygéné.', suite: 'fin_mauvaise' }
          ] },
        defib: { heure: '04 h 13', texte: 'Une collègue arrive avec le défibrillateur. Le rythme est une fibrillation ventriculaire.', s: 'ERC', indice: 'La FV est-elle choquable ?',
          choix: [
            { t: 'Coller les électrodes en continuant le massage, puis choc dès que possible en sécurité (« Tout le monde s’écarte, oxygène écarté »)', q: 2, v: {}, fb: 'La FV est un rythme choquable : la défibrillation précoce est le traitement qui sauve.', suite: 'apres' },
            { t: 'Attendre l’arrivée du médecin pour défibriller', q: 0, v: {}, fb: 'Chaque minute de retard de défibrillation réduit la survie. Le protocole précise qui délivre le choc, mais on prépare tout immédiatement.', suite: 'comp_choc' },
            { t: 'Arrêter le massage pendant qu’on cherche les électrodes', q: 1, v: {}, fb: 'Les interruptions doivent être minimales : on prépare le défibrillateur pendant que quelqu’un masse.', suite: 'apres' }
          ] },
        comp_choc: { heure: '04 h 16', texte: '⚠️ Complication : la FV persiste depuis plusieurs minutes, toujours pas de choc délivré.', s: 'ERC', indice: 'Le défibrillateur est là : qu’attend-on ?',
          choix: [
            { t: 'Choquer dès que possible selon le protocole du service (DSA ou personne habilitée) en continuant le massage entre-temps', q: 2, v: {}, fb: 'Rattrapage : le choc est délivré. Le délai a réduit les chances, mais la réanimation continue.', suite: 'apres' },
            { t: 'Arrêter la réanimation en attendant le médecin', q: 0, v: {}, fb: 'On n’arrête jamais une réanimation de sa propre initiative.', suite: 'fin_mauvaise' }
          ] },
        apres: { heure: '04 h 17', texte: 'Après le choc, que fait l’équipe ?', s: 'ERC+ERCALS', indice: 'Juste après un choc, le cœur pompe rarement efficacement.',
          choix: [
            { t: 'Reprendre immédiatement les compressions pour 2 minutes avant de réanalyser le rythme', q: 2, v: {}, fb: 'On reprend le massage sans vérifier le pouls : 2 minutes, puis analyse.', suite: ['relais', 'evt_box'] },
            { t: 'Vérifier le pouls pendant 30 secondes', q: 0, v: {}, fb: 'Cela crée une longue pause sans circulation.', suite: 'relais' },
            { t: 'Donner tout de suite l’adrénaline avant de reprendre le massage', q: 1, v: {}, fb: 'En rythme choquable, l’adrénaline est donnée après le 3e choc (ERC 2025), et jamais au prix d’une pause de massage.', suite: 'relais' }
          ] },
        evt_box: { evenement: true, heure: '04 h 18', texte: 'Imprévu : l’alarme du box 6 sonne en même temps (« pousse-seringue vide »). Tu es en train de masser.', s: 'ERC', indice: 'Peut-on quitter un massage cardiaque ?',
          choix: [
            { t: 'Continuer le massage et demander à une collègue qui arrive d’aller voir le box 6', q: 2, v: {}, fb: 'Le massage ne s’interrompt pas : on délègue l’autre alarme.', suite: 'relais' },
            { t: 'Aller vite au box 6 et revenir', q: 0, v: {}, fb: 'Une interruption de massage fait chuter la perfusion cérébrale et coronaire en quelques secondes.', suite: 'relais' },
            { t: 'Ignorer l’alarme du box 6', q: 1, v: {}, fb: 'Le massage d’abord, oui, mais quelqu’un doit aller voir : on délègue.', suite: 'relais' }
          ] },
        relais: { heure: '04 h 19', texte: 'Tu masses depuis 2 minutes. Tu sens que tes compressions deviennent moins profondes.', s: 'ERC', indice: 'La fatigue arrive vite : comment garder un massage de qualité ?',
          choix: [
            { t: 'Demander un relais au moment de l’analyse du rythme (toutes les 2 minutes)', q: 2, v: {}, fb: 'Le relais au moment de l’analyse limite les interruptions et garde un massage efficace.', suite: 'causes' },
            { t: 'Continuer coûte que coûte sans rien dire', q: 1, v: {}, fb: 'Des compressions trop superficielles font chuter la perfusion.', suite: 'causes' },
            { t: 'Ralentir à 60 compressions par minute pour tenir', q: 0, v: {}, fb: 'La fréquence doit rester entre 100 et 120/min, profondeur 5-6 cm.', suite: 'causes' }
          ] },
        causes: { heure: '04 h 22', texte: 'Le médecin demande : « Quelles causes réversibles chercher ? » Tu sais que la kaliémie de minuit était élevée.', s: 'ERC', indice: 'Pense aux 4H et 4T… et au résultat de minuit.',
          choix: [
            { t: 'Signaler tout de suite l’hyperkaliémie (un des 4H) et apporter le dossier', q: 2, v: {}, fb: 'Les 4H-4T sont la clé : l’hyperkaliémie se traite spécifiquement.', suite: 'rosc' },
            { t: 'Ne rien dire, ce n’est pas ton rôle', q: 0, v: {}, fb: 'Toute l’équipe participe à la recherche des causes. Ta donnée peut changer le traitement.', suite: 'comp_causes' },
            { t: 'Proposer de refaire une prise de sang dans 1 heure', q: 1, v: {}, fb: 'Un contrôle est utile, mais l’information disponible maintenant doit être transmise.', suite: 'rosc' }
          ] },
        comp_causes: { heure: '04 h 28', texte: '⚠️ Complication : après plusieurs chocs, la FV récidive. Le médecin cherche une cause.', s: 'ERC', indice: 'Une information que tu connais pourrait tout changer.',
          choix: [
            { t: 'Signaler enfin la kaliémie élevée de minuit', q: 2, v: {}, fb: 'Rattrapage : le potassium est corrigé et l’activité circulatoire revient, mais plus tard.', suite: 'rosc_tard' },
            { t: 'Continuer à se taire', q: 0, v: {}, fb: 'La cause n’est pas traitée : la réanimation échoue.', suite: 'fin_mauvaise' }
          ] },
        rosc: { heure: '04 h 26', v: { FC: 108, PAS: 96, PAD: 58, SpO2: 94, FR: 14, GCS: 3 }, texte: 'Après le 3e choc, une activité circulatoire revient (pouls palpable, PA mesurable). Que fais-tu ?', s: 'ERC', indice: 'La phase post-réanimation reste très instable.',
          choix: [
            { t: 'Réévaluation ABCDE, surveillance continue, préparer la suite avec l’équipe et tracer les heures (chocs, médicaments)', q: 2, v: { FC: 100, PAS: 104, PAD: 62 }, fb: 'Surveillance continue, recherche de la cause et traçabilité précise.', suite: 'fin_bonne' },
            { t: 'Appeler la famille avant de surveiller le patient', q: 1, v: {}, fb: 'La famille doit être prévenue (par le médecin, selon l’organisation), mais la surveillance passe d’abord.', suite: 'fin_moyenne' },
            { t: 'Ranger le chariot, c’est terminé', q: 0, v: { FC: 0, PAS: null, PAD: null, SpO2: null, FR: 0 }, fb: 'Le patient peut refaire un arrêt à tout moment.', suite: 'comp_recidive' }
          ] },
        comp_recidive: { heure: '04 h 30', v: { FC: 0, PAS: null, PAD: null, SpO2: null, FR: 0 }, texte: '⚠️ Complication : en rangeant, tu entends l’alarme : M. F. refait un arrêt cardiaque.', s: 'ERC', indice: 'Même réflexe qu’au début : appeler et masser.',
          choix: [
            { t: 'Alarme de réanimation et compressions immédiates', q: 2, v: { FC: 112, PAS: 88, PAD: 52, SpO2: 92, FR: 14 }, fb: 'Rattrapage : le pouls revient après une nouvelle réanimation.', suite: 'fin_moyenne' },
            { t: 'Attendre de voir si le rythme revient seul', q: 0, v: {}, fb: 'Sans massage, il n’y a pas de circulation.', suite: 'fin_mauvaise' }
          ] },
        rosc_tard: { heure: '04 h 40', v: { FC: 116, PAS: 86, PAD: 50, SpO2: 92, FR: 14, GCS: 3 }, texte: 'L’activité circulatoire est revenue, après une réanimation plus longue. Que fais-tu ?', s: 'ERC', indice: 'Même chose qu’après tout retour de pouls.',
          choix: [
            { t: 'ABCDE, surveillance continue et traçabilité', q: 2, v: { PAS: 94, PAD: 56 }, fb: 'Bonne réaction : le pronostic dépendra de la durée de l’arrêt.', suite: 'fin_moyenne' },
            { t: 'Quitter le box pour souffler', q: 0, v: { PAS: 78, PAD: 44 }, fb: 'Le patient reste extrêmement instable.', suite: 'fin_mauvaise' }
          ] },
        fin_bonne: { fin: true, issue: 'bonne', titre: 'Réanimation réussie', texte: '04 h 40 : M. F. est stabilisé. Massage immédiat, choc précoce et cause trouvée : tu as fait la différence.' },
        fin_moyenne: { fin: true, issue: 'moyenne', titre: 'Pouls revenu, pronostic incertain', texte: 'M. F. a récupéré une activité circulatoire, mais la réanimation a été plus longue ou moins bien suivie. Son pronostic neurologique est incertain.' },
        fin_mauvaise: { fin: true, issue: 'mauvaise', titre: 'Réanimation sans succès', texte: 'Malgré les efforts de l’équipe, M. F. n’a pas récupéré. Rejoue : où le temps s’est-il perdu ?' }
      }
    },
    {
      id: 'rea-ventile', titre: 'Le patient ventilé qui désature', difficulte: 2,
      varier: { FC: 6, PAS: 8, SpO2: 1, FR: 2, T: 0.2 },
      intro: 'Il est 13 h. Mme Odile B., 61 ans, intubée et ventilée pour une pneumonie grave, est sous sédation légère. Son ventilateur se met à sonner.',
      retenir: 'Patient ventilé qui se dégrade : regarder le patient avant la machine, penser DOPE (Déplacement, Obstruction, Pneumothorax, Équipement), ventiler au ballon avec O₂ si doute sur la machine, appeler tôt.',
      sbar: ['Mme B., 61 ans, box 2 : désaturation brutale avec alarme de pression haute', 'Intubée depuis 3 jours pour pneumonie grave, sédation légère', 'La sonde était obstruée par un bouchon de sécrétions ; saturation remontée après sa levée', 'Je souhaite que vous la réévaluiez et que l’on discute de l’humidification et de la fréquence des soins'],
      noeuds: {
        debut: { heure: '13 h 00', patient: 'Mme B., 61 ans — pneumonie, ventilée', v: { FC: 118, PAS: 148, PAD: 82, SpO2: 85, FR: 30, T: 38.1, GCS: 0, GCSlabel: 'RASS' }, texte: 'Alarme « pression haute ». La saturation baisse. Que fais-tu en premier ?', s: 'PHYSIO', indice: 'Patient d’abord, machine ensuite.',
          choix: [
            { t: 'Regarder la patiente : thorax, couleur, sonde, circuit, et appeler ton infirmière', q: 2, v: {}, fb: 'On évalue le patient avant la machine. Un regard suffit souvent à trouver la cause.', suite: 'dope' },
            { t: 'Couper l’alarme pour réfléchir au calme', q: 0, v: { SpO2: 80, FC: 126 }, fb: 'Couper une alarme sans traiter la cause est dangereux.', suite: 'comp_hypox' },
            { t: 'Augmenter la sédation car elle lutte', q: 0, v: { SpO2: 80, FC: 126 }, fb: 'Sédater sans chercher la cause masque le problème.', suite: 'comp_hypox' }
          ] },
        comp_hypox: { heure: '13 h 04', v: { SpO2: 76, FC: 134, PAS: 160, PAD: 90 }, texte: '⚠️ Complication : la saturation s’effondre, la patiente devient cyanosée.', s: 'PHYSIO', indice: 'Si la machine ne ventile pas efficacement, il existe un moyen de ventiler à la main.',
          choix: [
            { t: 'Déconnecter et ventiler au ballon avec 100 % d’O₂, appel urgent de l’équipe médicale', q: 2, v: { SpO2: 84, FC: 124 }, fb: 'Rattrapage : la ventilation manuelle gagne du temps pendant que l’équipe arrive.', suite: 'bouchon' },
            { t: 'Attendre que la saturation remonte seule', q: 0, v: { SpO2: 68, FC: 52 }, fb: 'Une hypoxie profonde mène à la bradycardie puis à l’arrêt.', suite: 'fin_mauvaise' }
          ] },
        dope: { heure: '13 h 02', v: { SpO2: 82 }, texte: 'Le circuit est bien branché, le repère de la sonde n’a pas bougé. On entend des gargouillis, le ventilateur peine à insuffler.', s: 'PHYSIO', indice: 'DOPE : Déplacement, Obstruction, Pneumothorax, Équipement. Laquelle colle aux gargouillis ?',
          choix: [
            { t: 'Penser à une obstruction : aspiration endotrachéale selon protocole (préoxygénation, passage court)', q: 2, v: {}, fb: 'Gargouillis + pression haute = obstruction par les sécrétions probable.', suite: 'bouchon' },
            { t: 'Dégonfler le ballonnet', q: 0, v: { SpO2: 78 }, fb: 'Cela provoquerait une fuite et des inhalations, sans lever l’obstruction.', suite: 'comp_hypox' },
            { t: 'Attendre la radio de thorax', q: 1, v: { SpO2: 80 }, fb: 'La radio prend du temps ; la patiente désature maintenant.', suite: 'bouchon' }
          ] },
        bouchon: { heure: '13 h 05', v: { SpO2: 78, FC: 128 }, texte: 'La sonde d’aspiration bute : elle ne passe pas. La saturation continue de chuter.', s: 'PHYSIO', indice: 'La sonde est probablement bouchée : qui peut la changer ou la déboucher ?',
          choix: [
            { t: 'Ventiler au ballon avec 100 % d’O₂ pendant que l’équipe médicale est appelée en urgence', q: 2, v: { SpO2: 88, FC: 116 }, fb: 'Le médecin décidera (lavage, changement de sonde). En attendant, on oxygène.', suite: 'apres' },
            { t: 'Forcer la sonde d’aspiration', q: 0, v: { SpO2: 74, FC: 136 }, fb: 'Forcer peut léser la trachée sans résoudre le bouchon.', suite: 'comp_hypox2' },
            { t: 'Augmenter la FiO₂ et attendre', q: 1, v: { SpO2: 79 }, fb: 'Plus d’oxygène n’aide pas si l’air ne passe pas.', suite: 'apres' }
          ] },
        comp_hypox2: { heure: '13 h 08', v: { SpO2: 70, FC: 58, PAS: 110, PAD: 60 }, texte: '⚠️ Complication : saignement dans la sonde, la FC commence à ralentir.', s: 'PHYSIO+ERC', indice: 'Bradycardie + hypoxie : c’est l’urgence absolue.',
          choix: [
            { t: 'Appel d’urgence, ventilation manuelle à 100 % d’O₂, chariot d’urgence prêt', q: 2, v: { SpO2: 82, FC: 98 }, fb: 'Rattrapage in extremis : l’équipe change la sonde.', suite: 'apres_tard' },
            { t: 'Continuer à aspirer', q: 0, v: { SpO2: 60, FC: 40 }, fb: 'L’hypoxie mène à l’arrêt cardiaque.', suite: 'fin_mauvaise' }
          ] },
        apres: { heure: '13 h 15', v: { SpO2: 95, FC: 104, PAS: 132, PAD: 74 }, texte: 'Le médecin lève le bouchon (sécrétions épaisses). La saturation remonte. Que surveilles-tu ensuite ?', s: 'IHI+PHYSIO', indice: 'Comment éviter que le bouchon revienne ?',
          choix: [
            { t: 'Pression du ballonnet, repère de la sonde, aspect des sécrétions, humidification, tête à 30-45°, SpO₂ et courbes', q: 2, v: { FC: 96 }, fb: 'On prévient la récidive et on applique le bundle PAVM.', suite: ['famille', 'evt_alarme'] },
            { t: 'Aspirer systématiquement toutes les 30 minutes', q: 1, v: {}, fb: 'On aspire sur indication : les aspirations répétées irritent et font désaturer.', suite: 'famille' },
            { t: 'Rien, le problème est réglé', q: 0, v: { SpO2: 90 }, fb: 'Les bouchons récidivent si l’humidification et les soins ne sont pas adaptés.', suite: 'apres_tard' }
          ] },
        evt_alarme: { evenement: true, heure: '13 h 30', texte: 'Imprévu : un kiné passe et propose de faire la séance de Mme B. tout de suite, tête du lit à plat.', s: 'IHI', indice: 'Mobiliser, oui. Mais que dit le bundle PAVM sur la tête du lit ?',
          choix: [
            { t: 'Accepter la séance en se coordonnant (surveillance de la sonde et de la SpO₂) et remettre la tête à 30-45° après', q: 2, v: {}, fb: 'La mobilisation précoce fait partie du bundle ; la tête se remet à 30-45° après le soin.', suite: 'famille' },
            { t: 'Refuser toute mobilisation pendant 24 h', q: 1, v: {}, fb: 'Mobiliser est bénéfique ; on adapte selon la tolérance.', suite: 'famille' },
            { t: 'Laisser la tête à plat le reste de la journée', q: 0, v: { SpO2: 92 }, fb: 'À plat, les micro-inhalations augmentent.', suite: 'apres_tard' }
          ] },
        apres_tard: { heure: '14 h 30', v: { SpO2: 91, FC: 108, T: 38.4 }, texte: 'Mme B. a été instable. Le médecin te demande ce qu’il faut renforcer.', s: 'IHI', indice: 'Pense aux mesures du bundle de prévention des PAVM.',
          choix: [
            { t: 'Humidification, aspirations sur indication, tête à 30-45°, soins de bouche, surveillance du ballonnet', q: 2, v: { SpO2: 94 }, fb: 'Rattrapage : les mesures de prévention sont remises en place.', suite: 'fin_moyenne' },
            { t: 'Rien de spécial', q: 0, v: { SpO2: 88 }, fb: 'Les complications vont se répéter.', suite: 'fin_mauvaise' }
          ] },
        famille: { heure: '14 h 00', texte: 'Le mari de Mme B. arrive, très inquiet : « Elle a failli mourir ? Personne ne m’a appelé ! »', s: 'PADIS', indice: 'Le F du bundle ABCDEF.',
          choix: [
            { t: 'L’accueillir, écouter, expliquer simplement ce que tu peux, et organiser un entretien avec le médecin', q: 2, v: {}, fb: 'La famille fait partie du soin. L’information médicale relève du médecin, l’accueil est infirmier.', suite: 'fin_bonne' },
            { t: 'Lui donner tous les détails médicaux toi-même', q: 1, v: {}, fb: 'L’information médicale (pronostic, traitements) se donne par le médecin.', suite: 'fin_moyenne' },
            { t: 'Lui dire que ce n’est pas le moment et refermer la porte', q: 0, v: {}, fb: 'L’angoisse non accueillie devient souvent conflit et méfiance.', suite: 'fin_moyenne' }
          ] },
        fin_bonne: { fin: true, issue: 'bonne', titre: 'Bouchon levé, famille rassurée', texte: '15 h : Mme B. est stable, la prévention est en place et son mari a pu parler au médecin.' },
        fin_moyenne: { fin: true, issue: 'moyenne', titre: 'Stable, mais fragile', texte: '15 h : Mme B. est stable, mais la journée a été chaotique (épisodes de désaturation ou famille mal accueillie). Rejoue pour faire mieux.' },
        fin_mauvaise: { fin: true, issue: 'mauvaise', titre: 'Arrêt hypoxique', texte: 'L’hypoxie s’est prolongée jusqu’à l’arrêt cardiaque. L’équipe réanime Mme B. Rejoue : patient d’abord, DOPE, ballon.' }
      }
    },
    {
      id: 'rea-delirium', titre: 'L’agitation de 3 h du matin', difficulte: 2,
      varier: { FC: 6, PAS: 8, SpO2: 1, FR: 2, T: 0.2 },
      intro: 'Il est 3 h. M. Pierre L., 79 ans, extubé hier après une chirurgie abdominale, est seul dans son box. Tu l’entends crier.',
      retenir: 'Agitation en réa : sécurité d’abord, puis chercher les causes (douleur, hypoxie, glycémie, globe vésical, sevrage), dépister le délirium (CAM-ICU), privilégier les mesures non médicamenteuses et appeler le médecin. La contention n’est jamais un réflexe.',
      sbar: ['M. L., 79 ans, box 6 : agitation nocturne, RASS positif, CAM-ICU positive', 'J2 d’une chirurgie abdominale, extubé hier, sous antalgiques', 'Douleur importante et globe vésical que j’ai signalés ; saturation et glycémie correctes', 'Je demande une réévaluation de l’antalgie et de la prise en charge du délirium'],
      noeuds: {
        debut: { heure: '03 h 00', patient: 'M. L., 79 ans — post-op J2', v: { FC: 112, PAS: 162, PAD: 88, SpO2: 93, FR: 24, T: 37.4, GCS: 2, GCSlabel: 'RASS' }, texte: 'M. L. tire sur sa perfusion et essaie d’enjamber la barrière. Il ne sait pas où il est.', s: 'PADIS', indice: 'Sécurité d’abord, sans affrontement.',
          choix: [
            { t: 'Sécuriser (rester près de lui, lit bas, voix calme, se présenter) et appeler de l’aide', q: 2, v: { FC: 106 }, fb: 'Une voix calme et des repères apaisent souvent mieux qu’une contrainte.', suite: 'causes' },
            { t: 'Attacher immédiatement ses poignets', q: 0, v: { FC: 124, PAS: 176, PAD: 94, GCS: 3 }, fb: 'La contention n’est jamais un réflexe : elle aggrave souvent l’agitation et le délirium, et nécessite une prescription selon la procédure.', suite: 'comp_agit' },
            { t: 'Lui dire fermement de se calmer et repartir', q: 0, v: { FC: 120 }, fb: 'Il est confus : il ne peut pas « se calmer » sur ordre, et le risque de chute est majeur.', suite: 'comp_agit' }
          ] },
        comp_agit: { heure: '03 h 10', v: { FC: 126, PAS: 178, PAD: 96, SpO2: 91, GCS: 3 }, texte: '⚠️ Complication : M. L. a arraché sa voie veineuse et a failli tomber. Il hurle.', s: 'PADIS', indice: 'Reprends depuis le début : sécurité, aide, puis causes.',
          choix: [
            { t: 'Appeler de l’aide, sécuriser sans contrainte, comprimer le point de ponction, puis chercher les causes', q: 2, v: { FC: 114 }, fb: 'Rattrapage : la situation est reprise en main, mais il faudra reposer une voie.', suite: 'causes' },
            { t: 'Le laisser se calmer seul', q: 0, v: { FC: 130 }, fb: 'Il chute et se blesse.', suite: 'fin_mauvaise' }
          ] },
        causes: { heure: '03 h 15', texte: 'Il est un peu plus calme avec quelqu’un à côté. Que cherches-tu ?', s: 'PADIS', indice: 'L’agitation a souvent une cause somatique simple.',
          choix: [
            { t: 'Les causes : douleur (échelle adaptée), SpO₂, glycémie, globe vésical, fièvre, médicaments', q: 2, v: {}, fb: '« Analgésie d’abord » : une douleur mal soulagée est une cause fréquente.', suite: ['globe', 'evt_voisin'] },
            { t: 'Demander directement un sédatif', q: 1, v: {}, fb: 'Un sédatif peut être nécessaire, mais sans chercher la cause, on risque de masquer une douleur ou une rétention.', suite: 'globe' },
            { t: 'Rien, c’est la démence de l’âge', q: 0, v: { FC: 120 }, fb: 'Biais d’ancrage : un délirium est aigu et a des causes à chercher.', suite: 'comp_agit2' }
          ] },
        comp_agit2: { heure: '03 h 40', v: { FC: 124, PAS: 172, PAD: 92 }, texte: '⚠️ Complication : l’agitation redouble. Il se tient le ventre en gémissant.', s: 'PADIS', indice: 'Il se tient le ventre…',
          choix: [
            { t: 'Évaluer la douleur et le bas-ventre (globe ?), puis appeler le médecin', q: 2, v: { FC: 116 }, fb: 'Rattrapage : tu cherches enfin une cause somatique.', suite: 'globe' },
            { t: 'Lui mettre une contention abdominale', q: 0, v: { FC: 130 }, fb: 'La cause reste non traitée.', suite: 'fin_mauvaise' }
          ] },
        evt_voisin: { evenement: true, heure: '03 h 20', texte: 'Imprévu : la patiente du box 7 sonne, elle a soif et veut boire.', s: 'RAIS', indice: 'Qui est le plus instable des deux ?',
          choix: [
            { t: 'Lui dire que tu arrives dans quelques minutes, ou demander à une collègue, et rester auprès de M. L.', q: 2, v: {}, fb: 'Prioriser : la demande de confort attend quelques minutes, le patient agité non.', suite: 'globe' },
            { t: 'Laisser M. L. seul pour aller la servir', q: 1, v: { FC: 118 }, fb: 'Risque de chute pour M. L. pendant ton absence.', suite: 'globe' }
          ] },
        globe: { heure: '03 h 30', v: { SpO2: 95 }, texte: 'Douleur estimée à 7/10. Glycémie normale. Tu trouves un globe vésical important au bladder scan.', s: 'PADIS+RAU', indice: 'Deux causes trouvées : à qui les signaler ?',
          choix: [
            { t: 'Signaler au médecin la douleur et le globe, et préparer un sondage évacuateur selon prescription/protocole', q: 2, v: { FC: 100, PAS: 148, PAD: 82 }, fb: 'Douleur et rétention sont deux causes classiques d’agitation chez la personne âgée opérée.', suite: 'cam' },
            { t: 'Lui donner à boire pour qu’il urine', q: 0, v: { FC: 118 }, fb: 'Boire n’aide pas une vessie déjà pleine.', suite: 'comp_globe' },
            { t: 'Noter et attendre le matin', q: 1, v: {}, fb: 'La douleur et la rétention entretiennent l’agitation toute la nuit.', suite: 'cam' }
          ] },
        comp_globe: { heure: '04 h 00', v: { FC: 122, PAS: 170, PAD: 92 }, texte: '⚠️ Complication : il boit, puis s’agite encore plus en se tenant le bas-ventre, très douloureux.', s: 'PADIS+RAU', indice: 'La vessie est déjà pleine : que faut-il pour la vider ?',
          choix: [
            { t: 'Prévenir le médecin pour le globe et la douleur, sondage évacuateur selon protocole', q: 2, v: { FC: 104, PAS: 150, PAD: 84 }, fb: 'Rattrapage : la vessie est vidée, l’agitation diminue.', suite: 'cam' },
            { t: 'Attendre le matin', q: 0, v: { FC: 128 }, fb: 'La douleur et l’agitation s’aggravent : il chute en essayant de se lever.', suite: 'fin_mauvaise' }
          ] },
        cam: { heure: '04 h 00', v: { FC: 96, PAS: 144, PAD: 80, FR: 18, GCS: 1 }, texte: 'Il est plus calme. Il reste inattentif et sa pensée est désorganisée.', s: 'PADIS', indice: 'Quel outil dépiste le délirium en réa ?',
          choix: [
            { t: 'Réaliser la CAM-ICU et transmettre le résultat', q: 2, v: {}, fb: 'Début aigu + inattention + pensée désorganisée/RASS ≠ 0 : CAM-ICU positive = délirium.', suite: 'nonmed' },
            { t: 'Considérer qu’il va bien puisqu’il est calme', q: 1, v: {}, fb: 'Calme ne veut pas dire sans délirium : la forme hypoactive est fréquente.', suite: 'nonmed' },
            { t: 'Ne rien noter', q: 0, v: {}, fb: 'Sans trace, l’équipe de jour ne pourra pas suivre l’évolution.', suite: 'nonmed' }
          ] },
        nonmed: { heure: '06 h 30', texte: 'Le jour se lève. Quelles mesures mets-tu en place pour la journée ?', s: 'PADIS', indice: 'Redonner des repères au cerveau.',
          choix: [
            { t: 'Lunettes et appareil auditif, horloge et calendrier, lumière le jour, mobilisation, famille encouragée à venir', q: 2, v: { FC: 88 }, fb: 'Mesures non médicamenteuses du bundle ABCDEF, qui réduisent le délirium.', suite: 'fin_bonne' },
            { t: 'Limiter les visites pour ne pas l’agiter', q: 1, v: {}, fb: 'La présence de proches rassure et réoriente.', suite: 'fin_moyenne' },
            { t: 'Volets fermés toute la journée pour qu’il dorme', q: 0, v: { FC: 104 }, fb: 'L’inversion jour-nuit entretient le délirium.', suite: 'fin_moyenne' }
          ] },
        fin_bonne: { fin: true, issue: 'bonne', titre: 'Nuit apaisée', texte: '07 h : M. L. est calme, sa douleur est soulagée, sa vessie vidée, et un plan anti-délirium est en place.' },
        fin_moyenne: { fin: true, issue: 'moyenne', titre: 'Calme, mais délirium persistant', texte: '07 h : M. L. est plus calme, mais les mesures pour la journée sont incomplètes : le délirium risque de durer.' },
        fin_mauvaise: { fin: true, issue: 'mauvaise', titre: 'Chute nocturne', texte: 'M. L. est tombé et s’est blessé. Rejoue : sécurité, aide, puis causes (douleur, globe…).' }
      }
    }
  ],
  situations: [
    { patient: 'Mme A., 58 ans — sepsis', v: { FC: 104, PAS: 112, PAD: 64, SpO2: 79, FR: 18, T: 37.9, GCS: 15 }, texte: 'Le scope affiche SpO₂ 79 %. Mme A. te parle normalement, elle est rose, sa FR est à 18. Le capteur est accroché à un doigt froid.', s: 'PHYSIO', stage: 'Toujours confronter le chiffre au patient : un capteur mal placé ou un doigt froid donne de fausses valeurs.',
      choix: [{ t: 'Regarder la patiente, repositionner le capteur (autre doigt, lobe d’oreille) et revérifier', q: 2, fb: 'La clinique est rassurante : il s’agit probablement d’un artéfact. On vérifie avant de traiter.' }, { t: 'Monter l’O₂ à 15 L/min', q: 1, fb: 'Pas dangereux immédiatement, mais on traite un chiffre sans l’avoir vérifié.' }, { t: 'Déclencher l’alarme de réanimation', q: 0, fb: 'Elle parle, elle respire normalement : ce n’est pas un arrêt.' }] },
    { patient: 'M. T., 66 ans — noradrénaline en périphérique', v: { FC: 96, PAS: 118, PAD: 66, SpO2: 96, FR: 18, T: 37.2, GCS: 15 }, texte: 'Le point de ponction de la voie périphérique où passe la noradrénaline est blanc, froid et gonflé.', s: 'SSC+CBIP', stage: 'Surveille le point de ponction des amines périphériques très régulièrement (protocole du service).',
      choix: [{ t: 'Arrêter la perfusion sur cette voie, prévenir immédiatement (une autre voie est nécessaire) et suivre le protocole d’extravasation', q: 2, fb: 'Extravasation de vasopresseur : risque de nécrose cutanée. Le relais sur une autre voie se fait vite car la PA dépend de la noradrénaline.' }, { t: 'Masser la zone et continuer', q: 0, fb: 'On aggrave la diffusion du produit dans les tissus.' }, { t: 'Surveiller et en parler à la relève', q: 0, fb: 'Chaque minute compte pour limiter la nécrose.' }] },
    { patient: 'Mme C., 70 ans — ventilée', v: { FC: 92, PAS: 124, PAD: 70, SpO2: 97, FR: 16, T: 37.0, GCS: -4, GCSlabel: 'RASS' }, texte: 'L’objectif de sédation prescrit est RASS 0 à −1. Mme C. est à RASS −4 depuis ce matin.', s: 'PADIS', stage: 'Note le RASS régulièrement et compare-le à la cible prescrite.',
      choix: [{ t: 'Signaler l’écart au médecin pour réévaluer la sédation', q: 2, fb: 'Une sédation trop profonde prolonge la ventilation et augmente délirium et PAVM.' }, { t: 'Augmenter la sédation pour qu’elle soit confortable', q: 0, fb: 'Elle est déjà beaucoup trop sédatée par rapport à la cible.' }, { t: 'Ne rien faire, elle est calme', q: 0, fb: 'La cible n’est pas respectée : c’est une donnée à transmettre.' }] },
    { patient: 'M. D., 55 ans — extubé depuis 1 h', v: { FC: 108, PAS: 140, PAD: 82, SpO2: 91, FR: 28, T: 37.3, GCS: 15 }, texte: 'Une heure après l’extubation, M. D. a une voix rauque, un bruit aigu à l’inspiration (stridor) et il tire sur les muscles du cou.', s: 'ERC', stage: 'Après une extubation, surveille la voix, la respiration, le tirage et la SpO₂ de près.',
      choix: [{ t: 'Rester avec lui, O₂, position assise et appel immédiat du médecin', q: 2, fb: 'Stridor + tirage = obstruction des voies aériennes supérieures (œdème laryngé possible) : urgence.' }, { t: 'Lui proposer une boisson chaude pour sa voix', q: 0, fb: 'Risque de fausse route et retard de prise en charge d’une obstruction.' }, { t: 'Reprendre les paramètres dans 1 h', q: 0, fb: 'Le stridor peut évoluer très vite vers une obstruction complète.' }] },
    { patient: 'Mme E., 63 ans — diabétique, insuline IV', v: { FC: 102, PAS: 130, PAD: 76, SpO2: 97, FR: 18, T: 36.7, GCS: 14 }, texte: 'Mme E., sous insuline IV continue, est en sueur et un peu confuse. Glycémie capillaire : 48 mg/dL.', s: 'ADA', stage: 'Connais le protocole d’hypoglycémie du service : il précise le resucrage et l’adaptation de l’insuline.',
      choix: [{ t: 'Appliquer immédiatement le protocole d’hypoglycémie (arrêt/adaptation de l’insuline selon protocole, resucrage) et prévenir le médecin', q: 2, fb: 'Glycémie < 54 mg/dL = hypoglycémie de niveau 2 (ADA). Le resucrage est immédiat et on recontrôle 15 minutes plus tard.' }, { t: 'Augmenter l’insuline car elle transpire', q: 0, fb: 'Danger : cela aggraverait l’hypoglycémie.' }, { t: 'Recontrôler dans 1 heure', q: 0, fb: 'L’hypoglycémie doit être corrigée tout de suite : le cerveau manque de glucose.' }] },
    { patient: 'M. F., 49 ans — sonde urinaire', v: { FC: 98, PAS: 118, PAD: 68, SpO2: 96, FR: 18, T: 37.5, GCS: 15 }, texte: 'Diurèse de 8 mL puis 10 mL sur les deux dernières heures (80 kg). La veille, il urinait 70 mL/h.', s: 'KDIGO', stage: 'Une diurèse qui chute brutalement : pense « tuyau » (sonde) avant « rein ».',
      choix: [{ t: 'Vérifier la sonde (coudure, caillot, poche), palper le bas-ventre, puis prévenir le médecin', q: 2, fb: 'Une sonde bouchée imite une anurie. Si la sonde est perméable, l’oligurie (< 0,5 mL/kg/h) doit être signalée.' }, { t: 'Le faire boire davantage', q: 1, fb: 'Il faut d’abord comprendre la cause.' }, { t: 'Attendre le bilan de 6 h', q: 0, fb: 'Une oligurie brutale est un signe d’alerte (perfusion rénale ?).' }] },
    { patient: 'Mme G., 74 ans — K⁺ à 6,8', v: { FC: 58, PAS: 128, PAD: 70, SpO2: 96, FR: 16, T: 36.9, GCS: 15 }, texte: 'Le labo appelle : kaliémie à 6,8 mmol/L. Sur le scope, les ondes T sont amples et pointues.', s: 'ERC', stage: 'Un résultat critique se transmet immédiatement, avec lecture à voix haute (read-back).',
      choix: [{ t: 'Prévenir immédiatement le médecin, laisser le scope et préparer le matériel selon ses instructions', q: 2, fb: 'Hyperkaliémie avec signes ECG = urgence : risque de trouble du rythme grave.' }, { t: 'Attendre le contrôle sanguin prévu à 6 h', q: 0, fb: 'Avec des signes ECG, l’hyperkaliémie ne peut pas attendre : risque de trouble du rythme grave.' }, { t: 'Noter le résultat dans le dossier', q: 0, fb: 'Noter ne suffit pas : c’est un résultat critique à transmettre tout de suite.' }] },
    { patient: 'M. H., 68 ans — ligne artérielle', v: { FC: 84, PAS: 78, PAD: 60, SpO2: 97, FR: 16, T: 36.8, GCS: 15 }, texte: 'La PA artérielle affiche 78/60 avec une courbe arrondie, « molle ». M. H. est conscient, coloré, ses extrémités sont chaudes.', s: 'PHYSIO', stage: 'Avant de toucher aux amines, vérifie la ligne et compare avec un brassard.',
      choix: [{ t: 'Vérifier la ligne (bulles, coudure, poche de pression), refaire le zéro et comparer au brassard', q: 2, fb: 'Courbe amortie + clinique rassurante = problème technique probable.' }, { t: 'Augmenter la noradrénaline', q: 0, fb: 'Traiter un chiffre faux peut provoquer une vraie hypertension.' }, { t: 'Appeler la réanimation en urgence', q: 1, fb: 'Prévenir n’est jamais grave, mais une vérification de 30 secondes s’impose d’abord.' }] },
    { patient: 'Mme I., 59 ans — cathéter central J6', v: { FC: 112, PAS: 108, PAD: 60, SpO2: 95, FR: 22, T: 39.2, GCS: 15 }, texte: 'Pic fébrile à 39,2 °C avec frissons. Le point d’insertion du cathéter central est rouge et sensible.', s: 'SSC', stage: 'Pansement de cathéter : surveillance quotidienne du point d’insertion et date de réfection.',
      choix: [{ t: 'Prévenir le médecin (suspicion d’infection sur cathéter, sepsis ?) et préparer les hémocultures selon prescription', q: 2, fb: 'Fièvre + point d’insertion inflammatoire : l’infection liée au cathéter doit être évoquée, avec dépistage du sepsis.' }, { t: 'Donner du paracétamol et ne rien dire', q: 0, fb: 'La fièvre baisse, mais l’infection progresse.' }, { t: 'Retirer toi-même le cathéter central', q: 0, fb: 'Le retrait d’un cathéter central se fait sur prescription, avec des précautions précises.' }] },
    { patient: 'M. J., 47 ans — décubitus ventral', v: { FC: 96, PAS: 120, PAD: 70, SpO2: 92, FR: 26, T: 37.6, GCS: 3, GCSlabel: 'RASS' }, texte: 'L’équipe doit retourner M. J. en décubitus dorsal après sa séance de ventral. Tu es la 5e personne disponible.', s: 'PROSEVA+EPUAP', stage: 'Lors d’un retournement, une seule personne commande : celle qui tient la tête et la sonde.',
      choix: [{ t: 'Prendre la place assignée, attendre le décompte de la personne à la tête (qui sécurise la sonde) et vérifier tubulures et points d’appui', q: 2, fb: 'Le retournement est un moment à haut risque d’extubation et d’arrachement de cathéters : coordination stricte.' }, { t: 'Tourner le patient dès que tu es prête', q: 0, fb: 'Sans coordination, la sonde peut se déplacer.' }, { t: 'Débrancher le ventilateur pour aller plus vite', q: 0, fb: 'Jamais : le patient serait sans ventilation.' }] },
    { patient: 'Famille de M. K.', texte: 'La fille de M. K. pleure à l’entrée du box : « Je n’ose pas entrer, il y a trop de machines. »', s: 'PADIS', stage: 'Présente le box : chaque machine, ce qu’elle fait, ce que les alarmes veulent dire.',
      choix: [{ t: 'L’accompagner, expliquer simplement les appareils et l’inviter à parler et toucher la main de son père', q: 2, fb: 'La famille rassure le patient et l’aide à se réorienter (F du bundle ABCDEF).' }, { t: 'Lui dire de revenir quand il ira mieux', q: 0, fb: 'Exclure la famille augmente l’angoisse de tous.' }, { t: 'Lui donner une brochure et retourner travailler', q: 1, fb: 'Une brochure aide, mais un accueil humain est irremplaçable.' }] },
    { patient: 'M. L., 52 ans — post-op cardiaque', v: { FC: 132, PAS: 82, PAD: 56, SpO2: 93, FR: 26, T: 36.6, GCS: 15 }, texte: 'Les drains thoraciques ont donné 250 mL de sang rouge en 1 heure. FC 132, PA 82/56.', s: 'PHYSIO', stage: 'Après chirurgie cardiaque : surveiller la quantité ET l’aspect des drains toutes les heures (selon protocole).',
      choix: [{ t: 'Appel immédiat du médecin : saignement actif avec signes de choc', q: 2, fb: 'Tachycardie + hypotension + saignement important = choc hémorragique (ou tamponnade si les drains se bouchent).' }, { t: 'Traire les drains et noter', q: 1, fb: 'La gestion des drains se fait selon protocole, mais l’appel est la priorité.' }, { t: 'Attendre l’heure suivante pour confirmer', q: 0, fb: 'Une heure de saignement non traité peut être fatale.' }] },
    { patient: 'Mme M., 81 ans — patiente non communicante', v: { FC: 108, PAS: 158, PAD: 86, SpO2: 96, FR: 22, T: 37.0, GCS: 1, GCSlabel: 'RASS' }, texte: 'Mme M., intubée, grimace, se raidit lors de la mobilisation et désynchronise le ventilateur.', s: 'PADIS', stage: 'Évalue la douleur avant ET après les soins douloureux, avec la même échelle.',
      choix: [{ t: 'Évaluer la douleur avec la BPS ou la CPOT et transmettre le score pour une antalgie adaptée', q: 2, fb: 'Grimace, raideur, désynchronisation sont des items des échelles comportementales de douleur.' }, { t: 'Augmenter la sédation', q: 0, fb: '« Analgésie d’abord » : sédater ne soulage pas la douleur.' }, { t: 'Rien, elle ne peut pas avoir mal, elle est sédatée', q: 0, fb: 'Faux : un patient sédaté peut avoir mal.' }] },
    { patient: 'M. N., 60 ans — ventilé, J4', texte: 'Pendant la toilette, tu remarques que la tête du lit est à plat et que la bouche de M. N. est sèche et sale.', s: 'IHI', stage: 'Après chaque soin : remets la tête du lit à 30-45° avant de quitter la chambre.',
      choix: [{ t: 'Remonter la tête du lit à 30-45° et faire les soins de bouche selon le protocole', q: 2, fb: 'Deux éléments du bundle de prévention des PAVM.' }, { t: 'Laisser à plat, c’est plus confortable', q: 0, fb: 'À plat, les micro-inhalations augmentent.' }, { t: 'Le noter pour l’équipe suivante', q: 1, fb: 'Mieux vaut corriger tout de suite.' }] },
    { patient: 'M. O., 64 ans — ventilé', v: { FC: 124, PAS: 84, PAD: 48, SpO2: 86, FR: 26, T: 37.1, GCS: -3, GCSlabel: 'RASS' }, texte: 'Alarme de pression haute. Le thorax ne se soulève plus que d’un côté et la PA baisse.', s: 'PHYSIO+ERC', stage: 'DOPE : D comme déplacement, O comme obstruction, P comme pneumothorax, E comme équipement.',
      choix: [{ t: 'Appel d’urgence du médecin (pneumothorax sous tension possible), O₂ 100 %, rester auprès du patient', q: 2, fb: 'Asymétrie thoracique + hypotension chez un ventilé : pneumothorax sous tension jusqu’à preuve du contraire.' }, { t: 'Aspirer pendant 1 minute', q: 0, fb: 'L’aspiration ne règle pas un pneumothorax et aggrave l’hypoxie.' }, { t: 'Augmenter la sédation', q: 0, fb: 'La cause est mécanique, pas l’agitation.' }] },
    { patient: 'Mme P., 72 ans — post-op', v: { FC: 76, PAS: 132, PAD: 74, SpO2: 96, FR: 16, T: 36.8, GCS: 15 }, texte: 'Mme P. est stable, mais tu remarques une rougeur persistante au talon qui ne blanchit pas à la pression.', s: 'EPUAP', stage: 'Inspecte les points d’appui à chaque soin de nursing.',
      choix: [{ t: 'Signaler, décharger complètement le talon et adapter la prévention (support, changements de position) selon protocole', q: 2, fb: 'Rougeur qui ne blanchit pas = escarre de stade 1 : on décharge immédiatement.' }, { t: 'Masser vigoureusement la zone', q: 0, fb: 'Le massage abîme davantage les tissus fragilisés.' }, { t: 'Attendre de voir si ça s’ouvre', q: 0, fb: 'On prévient avant l’ouverture.' }] },
    { patient: 'M. Q., 69 ans — arrêt en cours', v: { FC: 0, PAS: null, PAD: null, SpO2: null, FR: 0, T: 36.5, GCS: 3 }, texte: 'Réanimation en cours. Le rythme analysé est une asystolie. On te demande ce qui est indiqué.', s: 'ERCALS+ERC', stage: 'Connais l’emplacement du chariot d’urgence et son contenu dans ton service.',
      choix: [{ t: 'Poursuivre les compressions, adrénaline dès que possible selon l’algorithme, rechercher les 4H-4T', q: 2, fb: 'Rythme non choquable : pas de choc, adrénaline dès que possible (ERC 2025).' }, { t: 'Choquer immédiatement', q: 0, fb: 'L’asystolie n’est pas un rythme choquable.' }, { t: 'Arrêter la réanimation', q: 0, fb: 'La décision d’arrêt revient au médecin responsable, selon le contexte.' }] },
    { patient: 'Mme R., 66 ans — sepsis', v: { FC: 104, PAS: 112, PAD: 64, SpO2: 95, FR: 22, T: 38.5, GCS: 15 }, texte: 'Les antibiotiques sont prescrits à 14 h. À 14 h 45, la pharmacie n’a pas encore livré.', s: 'SSC', stage: 'Pour un sepsis probable, l’heure de la 1re dose d’antibiotique est un indicateur de qualité.',
      choix: [{ t: 'Relancer la pharmacie, chercher une alternative selon la procédure (stock d’urgence) et prévenir le médecin du retard', q: 2, fb: 'Objectif : antibiotiques dans l’heure si sepsis probable.' }, { t: 'Attendre la livraison', q: 0, fb: 'Chaque heure de retard aggrave le pronostic.' }, { t: 'Le noter pour la relève', q: 1, fb: 'Tracer, oui, mais il faut surtout agir.' }] },
    { patient: 'M. S., 55 ans — sédaté', v: { FC: 62, PAS: 104, PAD: 60, SpO2: 97, FR: 12, T: 36.6, GCS: -5, GCSlabel: 'RASS' }, texte: 'M. S. ne réagit ni à la voix ni à la stimulation physique (RASS −5). La cible prescrite est −1.', s: 'PADIS', stage: 'Une sédation trop profonde se signale : elle prolonge la ventilation.',
      choix: [{ t: 'Signaler l’écart au médecin et proposer une réévaluation de la sédation', q: 2, fb: 'Sédation excessive : plus de jours de ventilation, de PAVM et de délirium.' }, { t: 'Augmenter la sédation par précaution', q: 0, fb: 'Il est déjà bien trop sédaté.' }, { t: 'Ne rien faire, il est confortable', q: 0, fb: 'La cible n’est pas respectée.' }] },
    { patient: 'Mme T., 81 ans — réa médicale', v: { FC: 98, PAS: 128, PAD: 72, SpO2: 95, FR: 20, T: 37.0, GCS: 14 }, texte: 'Mme T. est somnolente la journée et éveillée la nuit, les volets restent fermés et ses lunettes sont dans le tiroir.', s: 'PADIS', stage: 'Le rythme jour-nuit et les aides sensorielles font partie des soins.',
      choix: [{ t: 'Rétablir le rythme jour-nuit (lumière le jour, calme la nuit), lui remettre ses lunettes, réorienter et dépister un délirium', q: 2, fb: 'Mesures non médicamenteuses du bundle ABCDEF.' }, { t: 'Demander un somnifère', q: 1, fb: 'Les mesures non médicamenteuses passent d’abord ; un médicament se discute avec le médecin.' }, { t: 'Garder les volets fermés pour qu’elle dorme', q: 0, fb: 'L’inversion jour-nuit entretient le délirium.' }] },
    { patient: 'M. U., 58 ans — ligne artérielle', v: { FC: 88, PAS: 126, PAD: 70, SpO2: 97, FR: 16, T: 36.9, GCS: 15 }, texte: 'Une collègue veut injecter un antibiotique dans le robinet de la ligne artérielle « car la voie veineuse est bouchée ».', s: 'PHYSIO', stage: 'Les lignes artérielles sont étiquetées : vérifie toujours la ligne avant d’injecter.',
      choix: [{ t: 'L’arrêter : on n’injecte jamais de médicament dans une ligne artérielle ; il faut une voie veineuse', q: 2, fb: 'Risque d’ischémie ou de nécrose de la main.' }, { t: 'La laisser faire si c’est lent', q: 0, fb: 'La vitesse ne change rien au risque.' }, { t: 'Injecter dans la poche de pressurisation', q: 0, fb: 'Même risque : le liquide va dans l’artère.' }] }
  ],
  prio: [
    { titre: '4 alarmes en même temps', intro: 'Tu es seule dans le couloir des soins intensifs pendant 2 minutes. Quatre choses arrivent en même temps.', s: 'ERC+IHI',
      patients: [['Box 1 : patient ventilé, alarme « volume bas », SpO₂ 85 % et qui baisse', 'Problème de ventilation (B) chez un patient dépendant de la machine : débranchement ou fuite possible. Menace vitale immédiate.'], ['Box 3 : PAM à 62 sous noradrénaline, seringue vide dans 5 minutes', 'Circulation (C) : sans relais, la PA va s’effondrer. Préparer le relais tout de suite après le box 1.'], ['Box 4 : pousse-seringue d’antibiotique qui sonne « fin de perfusion »', 'À gérer rapidement, mais sans menace vitale immédiate.'], ['Téléphone : la famille du box 2 demande des nouvelles', 'Important humainement : on rappelle dès que la situation est sûre.']] },
    { titre: 'Début de garde : qui vois-tu en premier ?', intro: 'Transmissions terminées. 4 patients t’ont été confiés.', s: 'NEWS+SSC',
      patients: [['M. O., FR 30, marbrures, lactates 4,5, PAM 60', 'Signes de choc : priorité absolue (C).'], ['Mme P., extubée il y a 2 h, voix normale, SpO₂ 95 %', 'À surveiller de près (risque après extubation), mais stable.'], ['M. Q., hémodynamique stable, glycémie de contrôle prévue dans 30 min', 'Soin programmé, sans urgence.'], ['Mme R., sortante vers l’unité de chirurgie, dossier à préparer', 'Tâche administrative : en dernier.']] },
    { titre: 'Les résultats du labo', intro: 'Le laboratoire t’appelle avec 4 résultats pour tes patients.', s: 'ERC+ADA+S3',
      patients: [['Kaliémie très élevée avec ondes T pointues au scope', 'Risque de trouble du rythme grave : immédiat.'], ['Glycémie à 45 mg/dL chez un patient sous insuline IV', 'Hypoglycémie à corriger tout de suite (protocole).'], ['Lactates en hausse chez un patient sous noradrénaline', 'Signe d’hypoperfusion : à transmettre rapidement.'], ['Hémoglobine stable par rapport à hier', 'À noter, sans urgence.']] },
    { titre: 'Arrivée d’un patient critique', intro: 'Un patient arrive des urgences. Dans quel ordre fais-tu les choses ?', s: 'ERC',
      patients: [['Vérifier les voies aériennes et la respiration (A-B)', 'Ce qui tue le plus vite en premier.'], ['Brancher le monitorage et évaluer la circulation (C)', 'PA, FC, perfusion.'], ['Évaluer la conscience et la glycémie (D)', 'Puis le reste de l’examen (E).'], ['Ranger ses effets personnels et compléter l’inventaire', 'Important mais en dernier.']] }
  ],
  mots: [
    ['LACTATE', 'Déchet de la cellule qui manque d’oxygène, dosé dans le sang en cas de choc', 'Un lactate > 2 mmol/L fait partie de la définition du choc septique (Sepsis-3).'],
    ['DELIRIUM', 'Trouble aigu et fluctuant de l’attention et de la conscience, dépisté par la CAM-ICU', 'Il peut être agité ou… très calme (hypoactif).'],
    ['TAMPONNADE', 'Sang autour du cœur qui l’empêche de se remplir (un des 4T)', 'Choc obstructif : turgescence jugulaire, hypotension, bruits du cœur assourdis.'],
    ['BALLONNET', 'Il se gonfle à 20-30 cmH₂O pour rendre la sonde d’intubation étanche', 'Trop bas : inhalations ; trop haut : lésions de la trachée.'],
    ['MARBRURES', 'Taches violacées sur les genoux, signe d’hypoperfusion', 'La peau est sacrifiée pour protéger les organes vitaux.'],
    ['OLIGURIE', 'Diurèse inférieure à 0,5 mL/kg/h', 'Souvent le reflet d’une mauvaise perfusion rénale.'],
    ['SEPSIS', 'Dysfonction d’organe causée par une réponse dérégulée à une infection', 'Antibiotiques dans l’heure si probable (SSC 2026).'],
    ['ASYSTOLIE', 'Rythme plat, non choquable', 'On masse, adrénaline dès que possible, et on cherche les causes réversibles.'],
    ['NORADRENALINE', 'Vasopresseur de référence du choc septique', 'Voie dédiée, jamais de bolus sur la ligne.'],
    ['HYPERKALIEMIE', 'Trop de potassium dans le sang, avec des ondes T pointues', 'Un des « H » des causes réversibles d’arrêt.'],
    ['VASOPRESSEUR', 'Médicament qui resserre les vaisseaux pour remonter la PA', 'La SSC 2026 suggère de pouvoir le débuter en périphérique.'],
    ['CAPTEUR', 'Il se place à l’axe phlébostatique pour mesurer la pression artérielle', 'Mal placé, il fausse toutes les valeurs.'],
    ['ASYSTOLIE', 'Ligne plate sur le scope : rythme non choquable', 'Massage, adrénaline dès que possible, causes réversibles.'],
    ['EXTRAVASATION', 'Le produit perfusé passe hors de la veine, dans les tissus', 'Avec la noradrénaline : risque de nécrose.'],
    ['DECUBITUS', 'Position couchée ; « ventral » dans le SDRA sévère', 'Attention aux escarres du visage.']
  ],
  ordre: [
    { titre: 'Reconnaître et débuter une réanimation', etapes: ['Vérifier la sécurité et la réponse du patient', 'Appeler à l’aide / déclencher l’alarme', 'Vérifier la respiration (10 secondes maximum)', 'Débuter les compressions 30:2 (ou continues si voies aériennes sécurisées selon protocole)', 'Coller les électrodes du défibrillateur dès qu’il arrive', 'Analyser le rythme et choquer si rythme choquable'], pourquoi: 'Massage et défibrillation précoces sont les deux gestes qui sauvent.', s: 'ERC' }
  ],
  tri: [
    { titre: 'Choquable ou non ?', cats: ['Choquable', 'Non choquable'], items: [['Fibrillation ventriculaire', 0], ['Asystolie', 1], ['Tachycardie ventriculaire sans pouls', 0], ['Activité électrique sans pouls', 1, 'Activité électrique organisée mais pas de pouls : on masse et on cherche la cause.'], ['Rythme plat avec quelques ondes P', 1]] },
    { titre: 'Bundle PAVM : oui ou non ?', cats: ['Fait partie de la prévention', 'Ne fait pas partie'], items: [['Tête du lit 30-45°', 0], ['Sédation légère, évaluée chaque jour', 0], ['Changement quotidien systématique du circuit', 1, 'Seulement s’il est souillé ou défectueux.'], ['Soins de bouche', 0], ['Aspiration systématique toutes les heures', 1, 'Seulement sur indication.'], ['Mobilisation précoce', 0]] }
  ],
  associe: [
    { titre: '4H et 4T', s: 'ERC', paires: [['Hypoxie', 'Oxygéner, ventiler'], ['Hypovolémie', 'Remplir, arrêter le saignement'], ['Pneumothorax sous tension', 'Exsufflation / drainage'], ['Tamponnade', 'Drainage péricardique'], ['Thrombose pulmonaire', 'Thrombolyse'], ['Hyperkaliémie', 'Correction du potassium']] }
  ],
  erreur: [
    { titre: 'Réanimation au box 2', scene: 'Un arrêt cardiaque est en cours. Repère ce qui ne va pas.', s: 'ERC', items: [['Les compressions sont faites à 80/min', true, 'Il faut 100 à 120/min.'], ['On change de masseur toutes les 2 minutes', false], ['On arrête le massage 40 secondes pour chercher une voie veineuse', true, 'Les interruptions doivent être minimales.'], ['Le patient est sur un plan dur', false], ['Personne ne note l’heure des chocs et des médicaments', true, 'La traçabilité guide la suite de la réanimation.'], ['L’oxygène est écarté au moment du choc', false]] }
  ]
};
