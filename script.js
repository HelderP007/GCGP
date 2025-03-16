document.addEventListener("DOMContentLoaded", function () {
  let playerName = "";
  let totalTime; // sera défini selon le niveau choisi
  let score = 0;
  let timeRemaining = 0;
  let timerInterval;
  let remainingQuestions = [];
  let currentLevel = ""; // "beginner", "intermediate", "advanced"
  let previousScreenId = ""; // Pour revenir à l'écran précédent (fin du quiz)

  // Capture du contenu initial du conteneur quiz pour pouvoir le réinitialiser
  const originalQuizHTML = document.getElementById("quizContainer").innerHTML;

  /* --- QUESTIONS POUR LE NIVEAU DÉBUTANT --- */
  const beginnerQuestions = [
    {
      question:
        "Pourquoi ajoute-t-on un produit chimique dans l’eau avant de la filtrer ?",
      answers: [
        "Pour tuer les microbes",
        "Pour regrouper les impuretés",
        "Pour changer la couleur de l'eau"
      ],
      correctAnswer: "Pour regrouper les impuretés",
      explanations: {
        "Pour tuer les microbes":
          "La coagulation ne tue pas les microbes, elle regroupe les impuretés.",
        "Pour changer la couleur de l'eau":
          "Le traitement de l'eau ne vise pas à modifier sa couleur."
      }
    },
    {
      question:
        "Pourquoi laisse-t-on l’eau reposer après la coagulation et la floculation ?",
      answers: [
        "Pour que les impuretés lourdes tombent au fond",
        "Pour refroidir l’eau",
        "Pour que l’eau absorbe plus d’oxygène"
      ],
      correctAnswer: "Pour que les impuretés lourdes tombent au fond",
      explanations: {
        "Pour refroidir l’eau":
          "La température de l’eau n’est pas affectée par cette étape.",
        "Pour que l’eau absorbe plus d’oxygène":
          "L’oxygène n’a pas d’impact sur la décantation."
      }
    },
    {
      question:
        "Quel est le rôle principal de la filtration après la décantation ?",
      answers: [
        "Éliminer les plus petites impuretés restantes",
        "Désinfecter l’eau",
        "Ajouter des minéraux"
      ],
      correctAnswer: "Éliminer les plus petites impuretés restantes",
      explanations: {
        "Désinfecter l’eau":
          "La filtration ne désinfecte pas l’eau, elle retient les impuretés solides.",
        "Ajouter des minéraux":
          "La filtration n'ajoute pas de minéraux, elle sert uniquement à éliminer les impuretés."
      }
    },
    {
      question:
        "Pourquoi l’eau doit-elle être désinfectée après la filtration ?",
      answers: [
        "Pour améliorer son goût",
        "Pour tuer les microbes encore présents",
        "Pour rendre l’eau plus claire"
      ],
      correctAnswer: "Pour tuer les microbes encore présents",
      explanations: {
        "Pour améliorer son goût":
          "La désinfection ne modifie pas le goût de l'eau, mais élimine les microbes.",
        "Pour rendre l’eau plus claire":
          "La clarté de l’eau est obtenue par la filtration."
      }
    },
    {
      question:
        "Pourquoi faut-il surveiller la quantité de chlore ajoutée à l’eau ?",
      answers: [
        "Parce que trop de chlore peut être nocif",
        "Parce que le chlore rend l’eau gazeuse",
        "Parce que le chlore donne un goût sucré"
      ],
      correctAnswer: "Parce que trop de chlore peut être nocif",
      explanations: {
        "Parce que le chlore rend l’eau gazeuse":
          "Le chlore ne rend pas l’eau gazeuse.",
        "Parce que le chlore donne un goût sucré":
          "Le chlore peut altérer le goût, mais pas le rendre sucré."
      }
    },
    {
      question: "Pourquoi l’eau potable doit-elle avoir un pH équilibré ?",
      answers: [
        "Pour éviter la corrosion des tuyaux",
        "Pour lui donner un meilleur goût",
        "Pour la rendre plus claire"
      ],
      correctAnswer: "Pour éviter la corrosion des tuyaux",
      explanations: {
        "Pour lui donner un meilleur goût":
          "Le pH influence la corrosion, pas directement le goût.",
        "Pour la rendre plus claire":
          "La clarté dépend surtout de la filtration."
      }
    },
    {
      question: "Pourquoi mélange-t-on l’eau pendant son traitement ?",
      answers: [
        "Pour bien répartir les produits chimiques",
        "Pour ajouter de l’oxygène",
        "Pour refroidir l’eau"
      ],
      correctAnswer: "Pour bien répartir les produits chimiques",
      explanations: {
        "Pour ajouter de l’oxygène": "L’oxygène est ajouté par aération.",
        "Pour refroidir l’eau": "Le mélange n’a pas d’effet sur la température."
      }
    }
  ];

  /* --- QUESTIONS POUR LE NIVEAU INTERMÉDIAIRE --- */
  const intermediateQuestions = [
    {
      question:
        "Comment le pH influence-t-il l’efficacité du traitement de l’eau ?",
      answers: [
        "Il ne change rien",
        "Il aide les produits chimiques à bien fonctionner",
        "Il donne du goût à l’eau"
      ],
      correctAnswer: "Il aide les produits chimiques à bien fonctionner",
      explanations: {
        "Il ne change rien":
          "Le pH conditionne les réactions chimiques nécessaires.",
        "Il donne du goût à l’eau":
          "Le goût est influencé par d'autres facteurs."
      }
    },
    {
      question:
        "Pourquoi un pH optimal est-il crucial pour la coagulation-floculation ?",
      answers: [
        "Il permet d’ajuster la charge des particules",
        "Il accélère la décantation",
        "Il améliore la couleur de l’eau"
      ],
      correctAnswer: "Il permet d’ajuster la charge des particules",
      explanations: {
        "Il accélère la décantation":
          "La décantation dépend de la formation des flocs.",
        "Il améliore la couleur de l’eau":
          "Le pH n’affecte pas directement la couleur."
      }
    },
    {
      question:
        "Quelle est la différence entre sédimentation primaire et secondaire ?",
      answers: [
        "La primaire élimine les matières en suspension et la secondaire traite les boues activées",
        "Elles sont identiques",
        "La secondaire précède la primaire"
      ],
      correctAnswer:
        "La primaire élimine les matières en suspension et la secondaire traite les boues activées",
      explanations: {
        "Elles sont identiques": "Elles remplissent des fonctions différentes.",
        "La secondaire précède la primaire":
          "La sédimentation primaire se fait avant la secondaire."
      }
    },
    {
      question:
        "Quels sont les principaux types de décanteurs utilisés dans le traitement de l’eau ?",
      answers: [
        "Décanteurs circulaires et lamellaires",
        "Filtres à sable et à charbon",
        "Tours aérateurs"
      ],
      correctAnswer: "Décanteurs circulaires et lamellaires",
      explanations: {
        "Filtres à sable et à charbon":
          "Ce sont des systèmes de filtration, non de décantation.",
        "Tours aérateurs": "Ils servent à l’oxygénation, pas à la décantation."
      }
    },
    {
      question:
        "Comment le pH influence-t-il l’efficacité du traitement de l’eau ?",
      type: "multiple",
      answers: [
        "Il ne change rien",
        "Il aide les produits chimiques à bien fonctionner",
        "Il donne du goût à l’eau"
      ],
      correctAnswer: "Il aide les produits chimiques à bien fonctionner",
      explanations: {
        "Il ne change rien":
          "Le pH conditionne les réactions chimiques nécessaires.",
        "Il donne du goût à l’eau":
          "Le goût est influencé par d'autres facteurs, pas uniquement le pH."
      }
    },
    // Q5
    {
      question:
        "Pourquoi un pH optimal est-il crucial pour la coagulation-floculation ?",
      type: "multiple",
      answers: [
        "Il permet d’ajuster la charge des particules",
        "Il accélère la décantation",
        "Il améliore la couleur de l’eau"
      ],
      correctAnswer: "Il permet d’ajuster la charge des particules",
      explanations: {
        "Il accélère la décantation":
          "La décantation dépend principalement de la formation des flocs.",
        "Il améliore la couleur de l’eau":
          "Le pH n’affecte pas directement la couleur."
      }
    },
    // Q6
    {
      question:
        "Quelle est la différence entre sédimentation primaire et secondaire ?",
      type: "multiple",
      answers: [
        "La primaire élimine les matières en suspension et la secondaire traite les boues activées",
        "Elles sont identiques",
        "La secondaire précède la primaire"
      ],
      correctAnswer:
        "La primaire élimine les matières en suspension et la secondaire traite les boues activées",
      explanations: {
        "Elles sont identiques":
          "Elles remplissent des fonctions différentes dans le traitement.",
        "La secondaire précède la primaire":
          "La sédimentation primaire se fait avant la secondaire."
      }
    },
    // Q7
    {
      question:
        "Quels sont les principaux types de décanteurs utilisés dans le traitement de l’eau ?",
      type: "multiple",
      answers: [
        "Décanteurs circulaires et lamellaires",
        "Filtres à sable et à charbon",
        "Tours aérateurs"
      ],
      correctAnswer: "Décanteurs circulaires et lamellaires",
      explanations: {
        "Filtres à sable et à charbon":
          "Ce sont des systèmes de filtration, non de décantation.",
        "Tours aérateurs": "Ils servent à l’oxygénation, pas à la décantation."
      }
    },
    // Q10
    {
      question:
        "Pourquoi un débit trop élevé dans un bassin de décantation peut-il nuire à son efficacité ?",
      type: "multiple",
      answers: [
        "Les flocs n’ont pas le temps de se déposer",
        "L’eau s’évapore trop vite",
        "Cela augmente la formation de boue"
      ],
      correctAnswer: "Les flocs n’ont pas le temps de se déposer",
      explanations: {
        "L’eau s’évapore trop vite":
          "L’évaporation dépend surtout de la température.",
        "Cela augmente la formation de boue":
          "Le débit élevé perturbe surtout la sédimentation, pas la formation de boue."
      }
    },
    // Q11
    {
      question:
        "Pourquoi un lavage à contre-courant est-il nécessaire dans un filtre à sable ?",
      type: "multiple",
      answers: [
        "Pour éliminer les impuretés accumulées",
        "Pour désinfecter le filtre",
        "Pour ralentir la filtration"
      ],
      correctAnswer: "Pour éliminer les impuretés accumulées",
      explanations: {
        "Pour désinfecter le filtre":
          "Le lavage retire les impuretés, il ne désinfecte pas.",
        "Pour ralentir la filtration":
          "Un filtre encrassé ralentit la filtration naturellement."
      }
    },
    // Q12
    {
      question:
        "Quelle est la différence entre désinfection chimique et physique ?",
      type: "multiple",
      answers: [
        "La chimique utilise des produits et la physique, des procédés sans produits",
        "Elles sont identiques",
        "La désinfection physique est toujours plus rapide"
      ],
      correctAnswer:
        "La chimique utilise des produits et la physique, des procédés sans produits",
      explanations: {
        "Elles sont identiques":
          "Ce sont deux approches différentes pour éliminer les micro-organismes.",
        "La désinfection physique est toujours plus rapide":
          "La rapidité dépend du procédé utilisé."
      }
    },
    // Q13
    {
      question:
        "Pourquoi utilise-t-on du chlore sous forme d’hypochlorite de sodium dans certaines installations ?",
      type: "multiple",
      answers: [
        "Parce que c'est plus stable et facile à stocker",
        "Parce que c'est moins coûteux",
        "Parce qu'il élimine mieux les métaux lourds"
      ],
      correctAnswer: "Parce que c'est plus stable et facile à stocker",
      explanations: {
        "Parce que c'est moins coûteux":
          "Le coût varie selon l'usage et les conditions de stockage.",
        "Parce qu'il élimine mieux les métaux lourds":
          "Le chlore désinfecte, mais ne retire pas les métaux lourds."
      }
    },
    // Q14
    {
      question:
        "Pourquoi faut-il surveiller la dureté de l’eau lors du traitement ?",
      type: "multiple",
      answers: [
        "Pour éviter la formation de dépôts de calcaire",
        "Pour améliorer son goût",
        "Pour limiter la formation de chlore"
      ],
      correctAnswer: "Pour éviter la formation de dépôts de calcaire",
      explanations: {
        "Pour améliorer son goût":
          "La dureté n’influence pas directement le goût.",
        "Pour limiter la formation de chlore":
          "La formation de chlore n'est pas liée à la dureté."
      }
    },
    // Q16
    {
      type: "multiple",
      question:
        "Quels sont les facteurs influençant l’efficacité de la coagulation ?",
      answers: [
        "Le pH et la température",
        "La vitesse de décantation",
        "La couleur de l’eau"
      ],
      correctAnswer: "Le pH et la température",
      explanations: {
        "La vitesse de décantation":
          "C'est lié à la sédimentation, pas directement à la coagulation.",
        "La couleur de l’eau":
          "La couleur n'est pas un facteur influençant l'efficacité de la coagulation."
      }
    },
    // Q19
    {
      question: "Quel est l’effet du pH sur l’efficacité de la chloration ?",
      answers: [
        "Un pH trop élevé réduit l’efficacité du chlore",
        "Un pH trop bas annule complètement le chlore",
        "Le pH n’a aucun effet sur la chloration"
      ],
      correctAnswer: "Un pH trop élevé réduit l’efficacité du chlore",
      explanations: {
        "Un pH trop bas annule complètement le chlore":
          "Un pH bas peut affecter l’efficacité, mais il ne l'annule pas entièrement.",
        "Le pH n’a aucun effet sur la chloration":
          "Le pH influence la forme active du chlore."
      }
    },
    // Q20
    {
      question:
        "Pourquoi faut-il surveiller la quantité de chlore ajoutée à l’eau ?",
      answers: [
        "Parce qu’un excès peut produire des sous-produits nocifs",
        "Parce que cela rend l’eau gazeuse",
        "Parce que le chlore rend l’eau sucrée"
      ],
      correctAnswer: "Parce qu’un excès peut produire des sous-produits nocifs",
      explanations: {
        "Parce que cela rend l’eau gazeuse":
          "Le chlore n’entraîne pas la formation de gaz.",
        "Parce que le chlore rend l’eau sucrée":
          "Le chlore ne modifie pas le goût sucré de l’eau."
      }
    },
    // Q21
    {
      question: "Pourquoi mélange-t-on l’eau pendant son traitement ?",
      answers: [
        "Pour bien répartir les produits chimiques",
        "Pour ajouter de l’oxygène",
        "Pour refroidir l’eau"
      ],
      correctAnswer: "Pour bien répartir les produits chimiques",
      explanations: {
        "Pour ajouter de l’oxygène":
          "L'oxygène est ajouté par aération, pas par mélange.",
        "Pour refroidir l’eau":
          "Le mélange n’affecte pas la température de l’eau."
      }
    },
    // Q22
    {
      question: "Pourquoi l’eau potable doit-elle avoir un pH équilibré ?",
      answers: [
        "Pour éviter la corrosion des tuyaux",
        "Pour améliorer son goût",
        "Pour la rendre plus claire"
      ],
      correctAnswer: "Pour éviter la corrosion des tuyaux",
      explanations: {
        "Pour améliorer son goût":
          "Le pH influe sur la corrosion, pas directement sur le goût.",
        "Pour la rendre plus claire":
          "La clarté dépend surtout de la filtration."
      }
    },
    // Q23
    {
      question:
        "Quels sont les désinfectants les plus couramment utilisés pour traiter l’eau potable ?",
      answers: [
        "Le chlore et les UV",
        "Le sel et le vinaigre",
        "L’oxygène et l’ozone"
      ],
      correctAnswer: "Le chlore et les UV",
      explanations: {
        "Le sel et le vinaigre":
          "Ces produits ne désinfectent pas l’eau potable.",
        "L’oxygène et l’ozone":
          "L’ozone est un désinfectant, mais l’oxygène seul ne l’est pas."
      }
    },
    // Q25
    {
      question:
        "Pourquoi faut-il faire attention à la quantité de chlore utilisée ?",
      answers: [
        "Pour éviter des sous-produits nocifs",
        "Pour rendre l’eau plus colorée",
        "Pour augmenter la turbidité"
      ],
      correctAnswer: "Pour éviter des sous-produits nocifs",
      explanations: {
        "Pour rendre l’eau plus colorée":
          "Le chlore ne change pas la couleur de l’eau.",
        "Pour augmenter la turbidité": "Le chlore ne cause pas de turbidité."
      }
    },
    // Q28
    {
      question:
        "Quel est le rôle principal de la filtration après la décantation ?",
      answers: [
        "Éliminer les plus petites impuretés restantes",
        "Désinfecter l’eau",
        "Ajouter des minéraux"
      ],
      correctAnswer: "Éliminer les plus petites impuretés restantes",
      explanations: {
        "Désinfecter l’eau":
          "La désinfection intervient après, via le chlore ou les UV.",
        "Ajouter des minéraux": "La filtration n’ajoute pas de minéraux."
      }
    },
    // Q44
    {
      question:
        "Quels sont les risques d'une utilisation excessive de chlore ?",
      answers: [
        "Formation de sous-produits toxiques",
        "Amélioration de la désinfection",
        "Augmentation de la turbidité"
      ],
      correctAnswer: "Formation de sous-produits toxiques",
      explanations: {
        "Amélioration de la désinfection":
          "Un excès de chlore ne rend pas la désinfection meilleure.",
        "Augmentation de la turbidité":
          "Le chlore n'augmente pas la turbidité de l'eau."
      }
    },
    // Q45
    {
      question:
        "Quelle est la différence entre la sédimentation et la décantation ?",
      answers: [
        "La sédimentation repose sur la gravité, la décantation est une étape accélérée",
        "Elles sont identiques",
        "La décantation est un type de filtration"
      ],
      correctAnswer:
        "La sédimentation repose sur la gravité, la décantation est une étape accélérée",
      explanations: {
        "Elles sont identiques":
          "Elles diffèrent par leur méthode et leur durée.",
        "La décantation est un type de filtration":
          "La décantation est distincte de la filtration."
      }
    },
    // Q46
    {
      question:
        "Pourquoi doit-on vérifier le pH de l’eau avant et après son traitement ?",
      answers: [
        "Pour s'assurer que le traitement a été efficace",
        "Pour contrôler la température de l’eau",
        "Pour mesurer la turbidité de l’eau"
      ],
      correctAnswer: "Pour s'assurer que le traitement a été efficace",
      explanations: {
        "Pour contrôler la température de l’eau":
          "Le pH n'influence pas directement la température.",
        "Pour mesurer la turbidité de l’eau":
          "La turbidité est une donnée distincte du pH."
      }
    },
    // Q53
    {
      question:
        "Quels produits chimiques utilise-t-on pour ajuster le pH de l’eau ?",
      answers: [
        "Des acides et des bases",
        "Du sel et du sucre",
        "Des métaux lourds"
      ],
      correctAnswer: "Des acides et des bases",
      explanations: {
        "Du sel et du sucre": "Ces produits n'ajustent pas le pH de l’eau.",
        "Des métaux lourds": "Ils n'ont aucun rôle dans l'ajustement du pH."
      }
    },
    // Q55
    {
      question:
        "Pourquoi un pH mal ajusté peut-il provoquer la corrosion des canalisations ?",
      answers: [
        "Un pH trop acide attaque le métal",
        "Un pH trop élevé fait fondre le métal",
        "Le pH n'influence pas la corrosion"
      ],
      correctAnswer: "Un pH trop acide attaque le métal",
      explanations: {
        "Un pH trop élevé fait fondre le métal":
          "Un pH élevé ne fait pas fondre le métal.",
        "Le pH n'influence pas la corrosion":
          "Le pH joue un rôle important dans la corrosion."
      }
    },
    // Q56
    {
      question:
        "Quel est le pH recommandé pour l’eau potable distribuée aux consommateurs ?",
      answers: ["Entre 6,5 et 8,5", "Entre 4 et 5", "Entre 9 et 11"],
      correctAnswer: "Entre 6,5 et 8,5",
      explanations: {
        "Entre 4 et 5": "Ce pH est trop acide pour l'eau potable.",
        "Entre 9 et 11":
          "Ce pH est trop basique et peut provoquer des problèmes de goût et de corrosion."
      }
    },
    // Q65
    {
      question:
        "Pourquoi faut-il bien doser les produits chimiques utilisés pour traiter l’eau ?",
      answers: [
        "Pour éviter la pollution et garantir l’efficacité du traitement",
        "Parce que les produits sont très coûteux",
        "Parce que le dosage n’a pas d’impact"
      ],
      correctAnswer:
        "Pour éviter la pollution et garantir l’efficacité du traitement",
      explanations: {
        "Parce que les produits sont très coûteux":
          "Le coût est un facteur, mais l’efficacité et la sécurité sont primordiales.",
        "Parce que le dosage n’a pas d’impact":
          "Un mauvais dosage affecte fortement la qualité du traitement."
      }
    },
    // Q77
    {
      question:
        "Comment la température influence-t-elle l’efficacité des traitements physico-chimiques ?",
      answers: [
        "Une température plus élevée accélère les réactions chimiques",
        "La température n’a aucun effet",
        "Une température plus élevée ralentit les réactions"
      ],
      correctAnswer:
        "Une température plus élevée accélère les réactions chimiques",
      explanations: {
        "La température n’a aucun effet":
          "La température modifie l'énergie des molécules et la vitesse des réactions.",
        "Une température plus élevée ralentit les réactions":
          "En général, la chaleur accélère les réactions chimiques."
      }
    },
    // Q86
    {
      question:
        "Quels sont les avantages et les inconvénients de l’ozonation pour désinfecter l’eau ?",
      answers: [
        "Elle est très efficace mais coûteuse",
        "Elle est bon marché mais inefficace",
        "Elle est simple mais produit beaucoup de sous-produits"
      ],
      correctAnswer: "Elle est très efficace mais coûteuse",
      explanations: {
        "Elle est bon marché mais inefficace":
          "L’ozonation est reconnue pour son efficacité.",
        "Elle est simple mais produit beaucoup de sous-produits":
          "L’ozonation ne produit généralement pas de sous-produits nocifs."
      }
    },
    // Q94
    {
      question:
        "Pourquoi la présence de contaminants dans l’eau brute influence-t-elle le dosage des réactifs ?",
      answers: [
        "Parce qu’un niveau élevé de contaminants nécessite plus de réactifs",
        "Parce que les contaminants n’ont aucun impact",
        "Parce que moins de contaminants augmentent le dosage"
      ],
      correctAnswer:
        "Parce qu’un niveau élevé de contaminants nécessite plus de réactifs",
      explanations: {
        "Parce que les contaminants n’ont aucun impact":
          "Les contaminants influencent directement le dosage nécessaire.",
        "Parce que moins de contaminants augmentent le dosage":
          "Moins de contaminants nécessitent généralement moins de réactifs."
      }
    },
    // Q104
    {
      question:
        "Comment la qualité de l’eau brute affecte-t-elle le processus de coagulation ?",
      answers: [
        "Une eau très chargée en impuretés nécessite un dosage plus important",
        "La qualité de l’eau brute n'affecte pas la coagulation",
        "Une eau claire nécessite plus de coagulant"
      ],
      correctAnswer:
        "Une eau très chargée en impuretés nécessite un dosage plus important",
      explanations: {
        "La qualité de l’eau brute n'affecte pas la coagulation":
          "La présence d'impuretés conditionne le dosage du coagulant.",
        "Une eau claire nécessite plus de coagulant":
          "C'est l'inverse : une eau claire demande moins de coagulant."
      }
    },
    // Q105
    {
      question:
        "Quels sont les critères de choix d’un filtre à sable pour le traitement de l’eau ?",
      answers: [
        "La granulométrie et la capacité de rétention",
        "La couleur du sable et sa provenance",
        "La vitesse d’écoulement uniquement"
      ],
      correctAnswer: "La granulométrie et la capacité de rétention",
      explanations: {
        "La couleur du sable et sa provenance":
          "Ces critères n’influencent pas directement l’efficacité de filtration.",
        "La vitesse d’écoulement uniquement":
          "La vitesse est importante, mais la granulométrie est essentielle pour retenir les particules."
      }
    },
    // Q110
    {
      question:
        "Pourquoi la maintenance régulière des équipements de traitement de l’eau est-elle essentielle ?",
      answers: [
        "Pour garantir une efficacité optimale et éviter les pannes",
        "Pour améliorer le goût de l’eau",
        "Parce que cela est imposé par la loi uniquement"
      ],
      correctAnswer:
        "Pour garantir une efficacité optimale et éviter les pannes",
      explanations: {
        "Pour améliorer le goût de l’eau":
          "La maintenance assure la performance, pas directement le goût.",
        "Parce que cela est imposé par la loi uniquement":
          "Les obligations légales existent, mais l’efficacité est la raison principale."
      }
    }
  ];

  /* --- QUESTIONS POUR LE NIVEAU AVANCÉ (confirmé) --- */
  const advancedQuestionsConfirmed = [
    {
      type: "justification",
      question:
        "Pourquoi l’ozonation est-elle parfois préférée à la chloration pour la désinfection de l’eau ?",
      answers: [
        "Elle est plus rapide",
        "Elle ne laisse pas de résidus chimiques",
        "Elle est plus économique"
      ],
      correctAnswer: "Elle ne laisse pas de résidus chimiques",
      explanationRequired: true
    },
    {
      type: "multiple",
      question: "Quels sont les avantages de la filtration sur charbon actif ?",
      answers: [
        "Élimination des composés organiques",
        "Réduction des odeurs et du goût",
        "Augmentation du pH de l’eau",
        "Adsorption des pesticides et solvants"
      ],
      correctAnswers: [
        "Élimination des composés organiques",
        "Réduction des odeurs et du goût",
        "Adsorption des pesticides et solvants"
      ]
    },
    {
      type: "penalty",
      question: "Quel est l’effet d’un sous-dosage en coagulant ?",
      answers: [
        "Formation excessive de boues",
        "Eau trouble après traitement",
        "Réduction de la turbidité"
      ],
      correctAnswer: "Eau trouble après traitement",
      penalty: -1
    },
    {
      type: "matching",
      question: "Associez les traitements et leur fonction",
      pairs: [
        { term: "Coagulation", match: "Neutralisation des charges" },
        { term: "Filtration", match: "Retient les particules" },
        { term: "Désinfection", match: "Élimine les bactéries" }
      ]
    },
    {
      type: "scenario",
      question:
        "Une station d’épuration détecte une turbidité excessive après la filtration. Que faites-vous ?",
      answers: [
        { text: "Augmenter la dose de coagulant", correct: false, penalty: -2 },
        {
          text: "Vérifier les filtres et les nettoyer",
          correct: true,
          bonus: 3
        },
        { text: "Ajouter plus de chlore", correct: false, penalty: -2 },
        { text: "Réduire le temps de décantation", correct: false, penalty: -2 }
      ]
    },
    {
      question:
        "Un traitement d'eau dans une station montre une turbidité anormalement élevée après la filtration. Quelle est la cause la plus probable et la meilleure action corrective ?",
      answers: [
        "Les filtres sont saturés ➝ Effectuer un lavage à contre-courant",
        "Le pH est trop bas ➝ Ajouter de la soude",
        "L'agitation est insuffisante ➝ Augmenter la vitesse de mélange"
      ],
      correctAnswer:
        "Les filtres sont saturés ➝ Effectuer un lavage à contre-courant",
      explanations: {
        "Le pH est trop bas ➝ Ajouter de la soude":
          "Un pH bas n'entraîne pas directement une turbidité élevée après filtration.",
        "L'agitation est insuffisante ➝ Augmenter la vitesse de mélange":
          "L'agitation affecte la coagulation, mais pas directement la filtration."
      }
    },
    {
      question:
        "Le bassin de décantation d’une usine de traitement affiche un dépôt de boues plus important que d’habitude. Quelle est la meilleure solution ?",
      answers: [
        "Augmenter le dosage des coagulants pour former des flocs plus gros",
        "Diminuer le débit d'eau traversant le bassin pour optimiser la sédimentation",
        "Augmenter la vitesse d'agitation pour briser les flocs"
      ],
      correctAnswer:
        "Diminuer le débit d'eau traversant le bassin pour optimiser la sédimentation",
      explanations: {
        "Augmenter le dosage des coagulants pour former des flocs plus gros":
          "Un surdosage peut entraîner une formation excessive de boues et des flocs trop denses.",
        "Augmenter la vitesse d'agitation pour briser les flocs":
          "Une agitation excessive détruit les flocs et diminue l'efficacité de la décantation."
      }
    },
    {
      question:
        "Après une désinfection au chlore, une analyse montre la présence de sous-produits de chloration au-dessus des normes autorisées. Quelle action prendre en premier ?",
      answers: [
        "Réduire la dose de chlore appliquée",
        "Augmenter la durée du contact avec le chlore",
        "Filtrer l'eau avec du charbon actif pour éliminer ces sous-produits"
      ],
      correctAnswer:
        "Filtrer l'eau avec du charbon actif pour éliminer ces sous-produits",
      explanations: {
        "Réduire la dose de chlore appliquée":
          "Une réduction brutale de la dose de chlore pourrait compromettre la désinfection.",
        "Augmenter la durée du contact avec le chlore":
          "Un temps de contact plus long risque d'augmenter encore la formation de sous-produits indésirables."
      }
    },
    {
      question:
        "Un réseau de distribution d’eau potable enregistre une baisse soudaine de pression. Quelles sont les causes possibles et l'action correcte ?",
      answers: [
        "Fuite sur le réseau ➝ Vérifier les conduites et localiser la fuite",
        "Excès de chlore ➝ Réduire la dose",
        "Trop de filtration ➝ Réduire la fréquence des lavages de filtres"
      ],
      correctAnswer:
        "Fuite sur le réseau ➝ Vérifier les conduites et localiser la fuite",
      explanations: {
        "Excès de chlore ➝ Réduire la dose":
          "Un excès de chlore ne cause pas une baisse de pression.",
        "Trop de filtration ➝ Réduire la fréquence des lavages de filtres":
          "Les filtres influencent le débit, mais pas une chute brutale de pression dans le réseau."
      }
    },
    {
      type: "matching",
      question:
        "Associez chaque paramètre clé à son impact sur le traitement de l'eau.",
      pairs: [
        {
          term: "pH trop bas",
          match: "Réduction de l'efficacité des coagulants"
        },
        {
          term: "Turbidité élevée",
          match: "Augmentation de la consommation de coagulants"
        },
        {
          term: "Température basse",
          match: "Ralentissement des réactions chimiques"
        },
        {
          term: "Surdosage de chlore",
          match: "Formation de sous-produits toxiques"
        }
      ]
    },
    {
      type: "matching",
      question:
        "Associez les problèmes rencontrés avec leur solution appropriée.",
      pairs: [
        {
          term: "Eau trouble après filtration",
          match: "Laver les filtres ou les remplacer"
        },
        {
          term: "Présence de chlore résiduel insuffisante",
          match: "Augmenter la dose de chlore"
        },
        {
          term: "pH trop élevé après traitement",
          match: "Ajout de CO2 ou d’acide"
        },
        {
          term: "Excès de boues dans le décanteur",
          match: "Diminuer le débit pour optimiser la sédimentation"
        }
      ]
    },
    {
      type: "matching",
      question: "Associez chaque désinfectant avec son avantage principal.",
      pairs: [
        { term: "Chlore", match: "Désinfection efficace et résiduelle" },
        { term: "Ozone", match: "Pas de sous-produits nocifs" },
        { term: "UV", match: "Désinfection rapide sans produits chimiques" },
        {
          term: "Chloramine",
          match: "Désinfection prolongée sans goût prononcé"
        }
      ]
    },
    {
      question:
        "Un opérateur oublie d'ajuster le pH avant la coagulation. Quelle sera la conséquence principale ?",
      answers: [
        "Les flocs ne se formeront pas correctement (-2 pts)",
        "L'eau deviendra plus acide (+0 pt)",
        "Aucune conséquence, le pH n'a pas d'effet (-3 pts)"
      ],
      correctAnswer: "Les flocs ne se formeront pas correctement (-2 pts)",
      scoreImpact: {
        "Les flocs ne se formeront pas correctement (-2 pts)": -2,
        "L'eau deviendra plus acide (+0 pt)": 0,
        "Aucune conséquence, le pH n'a pas d'effet (-3 pts)": -3
      }
    },
    {
      question:
        "Le dosage du chlore est soudainement doublé dans une usine. Quel est le principal risque ?",
      answers: [
        "Augmentation des sous-produits nocifs (-2 pts)",
        "L'eau sera plus propre (+0 pt)",
        "Le pH diminuera trop (-1 pt)"
      ],
      correctAnswer: "Augmentation des sous-produits nocifs (-2 pts)",
      scoreImpact: {
        "Augmentation des sous-produits nocifs": -2,
        "L'eau sera plus propre": 0,
        "Le pH diminuera trop": -1
      }
    }
  ];

  // Fonction pour affecter le tableau de questions en fonction du niveau choisi
  function setQuestionsForLevel(level) {
    if (level === "beginner") {
      remainingQuestions = beginnerQuestions.slice();
    } else if (level === "intermediate") {
      remainingQuestions = intermediateQuestions.slice();
    } else if (level === "advanced") {
      remainingQuestions = advancedQuestionsConfirmed.slice();
    }
  }

  // Fonction de navigation entre écrans
  function showScreen(screenId) {
    const screens = [
      "startScreen",
      "nameScreen",
      "levelSelectionScreen",
      "summaryScreen",
      "quizContainer",
      "leaderboard",
      "creditsScreen"
    ];
    screens.forEach((id) => {
      document.getElementById(id).style.display = "none";
    });
    document.getElementById(screenId).style.display = "block";
  }

  // Passage à l'écran de saisie du nom
  function goToNameScreen() {
    showScreen("nameScreen");
  }

  // Écran initial
  showScreen("startScreen");

  // Événements sur les boutons d'écran
  document.getElementById("startButton").addEventListener("click", function () {
    goToNameScreen();
  });

  document
    .getElementById("confirmNameButton")
    .addEventListener("click", function () {
      const nameInput = document.getElementById("playerName");
      if (nameInput.value.trim() === "") {
        alert("Veuillez entrer un nom !");
      } else {
        playerName = nameInput.value.trim();
        document.getElementById(
          "levelSelectionTitle"
        ).textContent = `Merci de jouer ${playerName} ! Choisissez votre niveau`;
        showScreen("levelSelectionScreen");
      }
    });

  document
    .getElementById("summaryButton")
    .addEventListener("click", function () {
      showScreen("summaryScreen");
    });

  document
    .getElementById("globalLeaderboardButton")
    .addEventListener("click", function () {
      loadGlobalLeaderboardLocal();
    });

  document
    .getElementById("creditsButton")
    .addEventListener("click", function () {
      showCredits();
    });

  // Mise à jour des crédits
  let creditsScreen = document.getElementById("creditsScreen");
  creditsScreen.innerHTML = `
    <h2>Crédits</h2>
    <p>Développé par Hélder Parruque &amp; Bastien Marguet.</p>
    <p>Tous droits réservés IUT LYON1© 2025.</p>
    <p>Ce quiz est encore en phase de développement. Si vous avez d'autres suggestions, n'hésitez pas à nous écrire via <a href="mailto:bastien.marguet@univ-lyon1.fr">bastien.marguet@univ-lyon1.fr</a> ou <a href="mailto:helderparruque007@gmail.com">helderparruque007@gmail.com</a>. Pour ceux qui préfèrent rester anonymes, vous pouvez également utiliser ce lien pour partager votre avis en toute confidentialité : <a href="https://forms.office.com/r/mnYxnDngqE" target="_blank">Partager votre avis</a>. Merci !</p>
    <button id="backFromCredits">Retour</button>
  `;
  document
    .getElementById("backFromCredits")
    .addEventListener("click", function () {
      creditsScreen.style.display = "none";
      document.getElementById("levelSelectionScreen").style.display = "block";
    });

  document
    .getElementById("closeSummaryButton")
    .addEventListener("click", function () {
      showScreen("levelSelectionScreen");
    });

  // Gestion de l'affichage du sommaire (déplier/replier)
  ["details1", "details2", "details3"].forEach((id) => {
    document
      .getElementById(id)
      .parentElement.addEventListener("click", function () {
        const details = document.getElementById(id);
        details.style.display =
          details.style.display === "none" || details.style.display === ""
            ? "block"
            : "none";
      });
  });
  document
    .querySelectorAll("#details1 li, #details2 li, #details3 li")
    .forEach(function (detailItem) {
      detailItem.addEventListener("click", function (event) {
        let explanation = this.querySelector(".explanation");
        if (explanation) {
          explanation.style.display =
            explanation.style.display === "none" ||
            explanation.style.display === ""
              ? "block"
              : "none";
        }
        event.stopPropagation();
      });
    });

  // Fonction utilitaire pour randomiser un tableau
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Fonction pour formater le temps en mm:ss
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes + ":" + (secs < 10 ? "0" + secs : secs);
  }

  // Mise à jour du timer
  function updateTimer() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const secondsDisplay = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById(
      "timeRemaining"
    ).textContent = `${minutes}:${secondsDisplay}`;
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      endQuiz("Temps écoulé ! Votre score final est : " + score);
    } else {
      timeRemaining--;
    }
  }

  // Démarrage du timer
  function startTimer() {
    timeRemaining = totalTime;
    document.getElementById("timeRemaining").textContent = formatTime(
      totalTime
    );
    timerInterval = setInterval(updateTimer, 1000);
  }

  // Vérification des réponses pour les questions ouvertes et avec justification
  function checkOpenAnswer(userAnswer, expectedAnswer) {
    const userResponse = userAnswer.toLowerCase().trim();
    const correctResponse = expectedAnswer.toLowerCase().trim();
    if (userResponse === correctResponse) {
      return { result: "correct", message: "✅ Bonne réponse !" };
    }
    const importantWords = correctResponse.split(" ");
    let matchCount = 0;
    importantWords.forEach((word) => {
      if (userResponse.includes(word)) {
        matchCount++;
      }
    });
    const matchPercentage = (matchCount / importantWords.length) * 100;
    if (matchPercentage >= 15) {
      return {
        result: "partial",
        message:
          "⚠ Réponse partiellement correcte. Réponse attendue : " +
          expectedAnswer
      };
    } else {
      return {
        result: "incorrect",
        message: "❌ Mauvaise réponse. Réponse correcte : " + expectedAnswer
      };
    }
  }

  // Chargement d'une question aléatoire
  function loadRandomQuestion() {
    const quizQuestionDiv = document.getElementById("quizQuestion");
    quizQuestionDiv.innerHTML = "";
    if (remainingQuestions.length === 0) {
      endQuiz(`Quiz terminé, ${playerName} ! Votre score final est : ${score}`);
      return;
    }
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    const currentQuestion = remainingQuestions.splice(randomIndex, 1)[0];
    const questionEl = document.createElement("p");
    questionEl.textContent = currentQuestion.question;
    quizQuestionDiv.appendChild(questionEl);

    // Traitement selon le type de question
    if (currentQuestion.type === "open") {
      // Question ouverte simple
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Tapez votre réponse ici...";
      quizQuestionDiv.appendChild(input);
      const submitBtn = document.createElement("button");
      submitBtn.textContent = "Valider";
      quizQuestionDiv.appendChild(submitBtn);
      submitBtn.addEventListener("click", function () {
        submitBtn.disabled = true;
        const userAnswer = input.value;
        const result = checkOpenAnswer(
          userAnswer,
          currentQuestion.expectedAnswer
        );
        const resultEl = document.createElement("p");
        resultEl.textContent = result.message;
        quizQuestionDiv.appendChild(resultEl);
        if (result.result === "correct") {
          setTimeout(loadRandomQuestion, 1000);
        }
      });
      return;
    } else if (currentQuestion.type === "justification") {
      // Question avec justification
      const form = document.createElement("form");
      currentQuestion.answers.forEach((answer) => {
        const label = document.createElement("label");
        label.style.display = "block";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "justification";
        radio.value = answer;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(" " + answer));
        form.appendChild(label);
      });
      quizQuestionDiv.appendChild(form);
      const justificationInput = document.createElement("textarea");
      justificationInput.placeholder = "Expliquez votre réponse...";
      justificationInput.rows = 3;
      justificationInput.style.width = "80%";
      quizQuestionDiv.appendChild(justificationInput);
      const submitBtn = document.createElement("button");
      submitBtn.textContent = "Valider";
      quizQuestionDiv.appendChild(submitBtn);
      submitBtn.addEventListener("click", function () {
        submitBtn.disabled = true;
        const selected = form.querySelector(
          "input[name='justification']:checked"
        );
        if (!selected) {
          alert("Veuillez sélectionner une réponse.");
          submitBtn.disabled = false;
          return;
        }
        if (
          currentQuestion.explanationRequired &&
          justificationInput.value.trim() === ""
        ) {
          alert("Veuillez fournir une justification.");
          submitBtn.disabled = false;
          return;
        }
        const resultEl = document.createElement("p");
        if (selected.value === currentQuestion.correctAnswer) {
          resultEl.textContent = "✅ Bonne réponse !";
          score += 2; // +2 points pour une bonne réponse avec justification
          document.getElementById("scoreValue").textContent = score;
          quizQuestionDiv.appendChild(resultEl);
          setTimeout(loadRandomQuestion, 1000);
        } else {
          resultEl.textContent =
            "❌ Mauvaise réponse. La bonne réponse était : " +
            currentQuestion.correctAnswer;
          quizQuestionDiv.appendChild(resultEl);
        }
      });
      return;
    } else if (currentQuestion.type === "multiple") {
      // Question à réponses multiples
      const form = document.createElement("form");
      currentQuestion.answers.forEach((answer) => {
        const label = document.createElement("label");
        label.style.display = "block";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = answer;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + answer));
        form.appendChild(label);
      });
      quizQuestionDiv.appendChild(form);
      const submitBtn = document.createElement("button");
      submitBtn.textContent = "Valider";
      quizQuestionDiv.appendChild(submitBtn);
      submitBtn.addEventListener("click", function () {
        submitBtn.disabled = true;
        const checked = Array.from(
          form.querySelectorAll("input[type='checkbox']")
        )
          .filter((checkbox) => checkbox.checked)
          .map((checkbox) => checkbox.value);
        const correct = currentQuestion.correctAnswers.sort().join(",");
        const userAns = checked.sort().join(",");
        const resultEl = document.createElement("p");
        if (userAns === correct) {
          resultEl.textContent = "✅ Bonne réponse !";
          score += 2; // +2 points
          document.getElementById("scoreValue").textContent = score;
          quizQuestionDiv.appendChild(resultEl);
          setTimeout(loadRandomQuestion, 1000);
        } else {
          resultEl.textContent = "❌ Réponse incorrecte.";
          quizQuestionDiv.appendChild(resultEl);
        }
      });
      return;
    } else if (currentQuestion.type === "penalty") {
      // Question avec pénalité
      currentQuestion.answers.forEach((answer) => {
        const btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("answer-button");
        btn.addEventListener("click", function () {
          const buttons = quizQuestionDiv.querySelectorAll("button");
          buttons.forEach((b) => (b.disabled = true));
          const resultEl = document.createElement("p");
          if (answer === currentQuestion.correctAnswer) {
            btn.style.backgroundColor = "green";
            score += 2; // +2 points
            resultEl.textContent = "✅ Bonne réponse !";
          } else {
            btn.style.backgroundColor = "red";
            buttons.forEach((button) => {
              if (button.textContent === currentQuestion.correctAnswer) {
                button.style.backgroundColor = "green";
              }
            });
            resultEl.textContent =
              "❌ Mauvaise réponse. La bonne réponse était : " +
              currentQuestion.correctAnswer;
            score += currentQuestion.penalty;
          }
          document.getElementById("scoreValue").textContent = score;
          quizQuestionDiv.appendChild(resultEl);
          setTimeout(loadRandomQuestion, 1000);
        });
        quizQuestionDiv.appendChild(btn);
      });
      return;
    } else if (currentQuestion.type === "matching") {
      // Question d'association
      const table = document.createElement("table");
      table.classList.add("match-table");
      const tbody = document.createElement("tbody");
      table.appendChild(tbody);
      const pairMatches = currentQuestion.pairs.map((pair) => pair.match);
      const shuffledMatches = shuffle(pairMatches.slice());
      currentQuestion.pairs.forEach((pair) => {
        const tr = document.createElement("tr");
        tr.classList.add("match-row");
        const tdTerm = document.createElement("td");
        tdTerm.textContent = pair.term;
        tdTerm.classList.add("match-term");
        const tdSelect = document.createElement("td");
        tdSelect.classList.add("match-select-cell");
        const select = document.createElement("select");
        select.classList.add("match-select");
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Choisissez...";
        defaultOption.value = "";
        select.appendChild(defaultOption);
        shuffledMatches.forEach((matchOption) => {
          const option = document.createElement("option");
          option.value = matchOption;
          option.textContent = matchOption;
          select.appendChild(option);
        });
        tdSelect.appendChild(select);
        tr.appendChild(tdTerm);
        tr.appendChild(tdSelect);
        tbody.appendChild(tr);
      });
      quizQuestionDiv.appendChild(table);
      const validateBtn = document.createElement("button");
      validateBtn.textContent = "Valider";
      quizQuestionDiv.appendChild(validateBtn);
      validateBtn.addEventListener("click", function () {
        let allCorrect = true;
        let feedbackText = "";
        const selects = table.querySelectorAll("select");
        currentQuestion.pairs.forEach((pair, index) => {
          const selectedValue = selects[index].value;
          if (selectedValue !== pair.match) {
            allCorrect = false;
            feedbackText += `Pour "${pair.term}", la bonne réponse est "${pair.match}".\n`;
          }
        });
        const resultEl = document.createElement("p");
        if (allCorrect) {
          resultEl.textContent = "✅ Bonne réponse !";
          quizQuestionDiv.appendChild(resultEl);
          setTimeout(loadRandomQuestion, 1000);
        } else {
          resultEl.textContent =
            "❌ Certaines réponses sont incorrectes :\n" + feedbackText;
          quizQuestionDiv.appendChild(resultEl);
        }
      });
      return;
    } else if (currentQuestion.type === "scenario") {
      // Question scénario
      currentQuestion.answers.forEach((answerObj) => {
        const btn = document.createElement("button");
        btn.textContent = answerObj.text;
        btn.classList.add("answer-button");
        btn.addEventListener("click", function () {
          const buttons = quizQuestionDiv.querySelectorAll("button");
          buttons.forEach((b) => (b.disabled = true));
          const resultEl = document.createElement("p");
          if (answerObj.correct) {
            btn.style.backgroundColor = "green";
            score += answerObj.bonus; // bonus de +3 points
            resultEl.textContent = "✅ Bonne réponse !";
          } else {
            btn.style.backgroundColor = "red";
            resultEl.textContent = "❌ Mauvaise réponse.";
            score += answerObj.penalty; // pénalité de -2 points
          }
          document.getElementById("scoreValue").textContent = score;
          quizQuestionDiv.appendChild(resultEl);
          setTimeout(loadRandomQuestion, 1000);
        });
        quizQuestionDiv.appendChild(btn);
      });
      return;
    } else {
      // Par défaut : traitement des questions à choix multiples classiques
      let answers = currentQuestion.answers.slice();
      answers = shuffle(answers);
      answers.forEach((answer) => {
        const btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("answer-button");
        btn.addEventListener("click", function () {
          const buttons = quizQuestionDiv.querySelectorAll("button");
          buttons.forEach((b) => (b.disabled = true));
          if (answer === currentQuestion.correctAnswer) {
            btn.style.backgroundColor = "green";
            score++;
            document.getElementById("scoreValue").textContent = score;
            setTimeout(loadRandomQuestion, 1000);
          } else {
            btn.style.backgroundColor = "red";
            buttons.forEach((button) => {
              if (button.textContent === currentQuestion.correctAnswer) {
                button.style.backgroundColor = "green";
              }
            });
            const explanationEl = document.createElement("p");
            explanationEl.style.fontStyle = "italic";
            explanationEl.style.fontSize = "14px";
            explanationEl.style.color = "#666";
            if (
              currentQuestion.explanations &&
              currentQuestion.explanations[answer]
            ) {
              explanationEl.textContent =
                "Explication : " + currentQuestion.explanations[answer];
            } else {
              explanationEl.textContent = "Explication non disponible.";
            }
            quizQuestionDiv.appendChild(explanationEl);
          }
        });
        quizQuestionDiv.appendChild(btn);
      });
    }
  }

  // Fin du quiz
  function endQuiz(message) {
    clearInterval(timerInterval);
    const timeTaken = totalTime - timeRemaining;
    const minutesTaken = Math.floor(timeTaken / 60);
    const secondsTaken = timeTaken % 60;
    const quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = `<h2>${message}</h2>
      <p>Temps pris : ${minutesTaken} minutes et ${secondsTaken} secondes</p>`;
    submitScoreLocal(playerName, score, timeTaken, currentLevel);
    previousScreenId = "quizContainer";
    const leaderboardButton = document.createElement("button");
    leaderboardButton.textContent = "Voir Leaderboard Niveau";
    leaderboardButton.addEventListener("click", function () {
      loadLeaderboardLocal();
    });
    quizContainer.appendChild(leaderboardButton);
    const menuButton = document.createElement("button");
    menuButton.textContent = "Retour au menu";
    menuButton.addEventListener("click", function () {
      showScreen("levelSelectionScreen");
      resetQuizContainer();
    });
    quizContainer.appendChild(menuButton);
  }

  // Réinitialiser le conteneur du quiz
  function resetQuizContainer() {
    const quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = originalQuizHTML;
    document
      .getElementById("skipButton")
      .addEventListener("click", function () {
        loadRandomQuestion();
      });
  }

  // Soumettre le score dans le stockage local
  function submitScoreLocal(name, score, timeTaken, level) {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push({
      name: name,
      score: score,
      time: timeTaken,
      level: level,
      date: new Date().toISOString()
    });
    localStorage.setItem("scores", JSON.stringify(scores));
  }

  // Charger le leaderboard pour le niveau courant (filtré)
  function loadLeaderboardLocal() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores = scores.filter((record) => record.level === currentLevel);
    if (scores.length === 0) {
      document.getElementById(
        "leaderboard"
      ).innerHTML = `<h2>Leaderboard (${currentLevel})</h2><p>Aucun score enregistré pour ce niveau.</p>`;
      const backButton = document.createElement("button");
      backButton.textContent = "Retour";
      backButton.addEventListener("click", function () {
        showScreen(previousScreenId);
      });
      document.getElementById("leaderboard").appendChild(backButton);
      showScreen("leaderboard");
      return;
    }
    scores.sort((a, b) => b.score - a.score);
    let leaderboardHTML = `<h2>Leaderboard (${currentLevel})</h2>`;
    leaderboardHTML += '<table border="1" style="width:100%; margin: 0 auto;">';
    leaderboardHTML +=
      "<tr><th>Nom</th><th>Score</th><th>Temps</th><th>Date</th></tr>";
    scores.forEach((record) => {
      leaderboardHTML += `<tr>
        <td>${record.name}</td>
        <td>${record.score}</td>
        <td>${formatTime(record.time)}</td>
        <td>${new Date(record.date).toLocaleString()}</td>
      </tr>`;
    });
    leaderboardHTML += "</table>";
    document.getElementById("leaderboard").innerHTML = leaderboardHTML;
    const clearButton = document.createElement("button");
    clearButton.textContent = "Effacer Leaderboard";
    clearButton.addEventListener("click", function () {
      clearLeaderboard();
    });
    document.getElementById("leaderboard").appendChild(clearButton);
    const backButton = document.createElement("button");
    backButton.textContent = "Retour";
    backButton.addEventListener("click", function () {
      showScreen(previousScreenId);
    });
    document.getElementById("leaderboard").appendChild(backButton);
    showScreen("leaderboard");
  }

  // Charger le leaderboard global (tous niveaux)
  function loadGlobalLeaderboardLocal() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    if (scores.length === 0) {
      document.getElementById("leaderboard").innerHTML =
        "<h2>Leaderboard Global</h2><p>Aucun score enregistré.</p>";
      const backButton = document.createElement("button");
      backButton.textContent = "Retour";
      backButton.addEventListener("click", function () {
        showScreen("levelSelectionScreen");
      });
      document.getElementById("leaderboard").appendChild(backButton);
      showScreen("leaderboard");
      return;
    }
    scores.sort((a, b) => b.score - a.score);
    let leaderboardHTML = "<h2>Leaderboard Global</h2>";
    leaderboardHTML += '<table border="1" style="width:100%; margin: 0 auto;">';
    leaderboardHTML +=
      "<tr><th>Nom</th><th>Score</th><th>Temps</th><th>Niveau</th><th>Date</th></tr>";
    scores.forEach((record) => {
      leaderboardHTML += `<tr>
        <td>${record.name}</td>
        <td>${record.score}</td>
        <td>${formatTime(record.time)}</td>
        <td>${record.level}</td>
        <td>${new Date(record.date).toLocaleString()}</td>
      </tr>`;
    });
    leaderboardHTML += "</table>";
    document.getElementById("leaderboard").innerHTML = leaderboardHTML;
    const clearButton = document.createElement("button");
    clearButton.textContent = "Effacer Leaderboard Global";
    clearButton.addEventListener("click", function () {
      const confirmation = confirm(
        "Voulez-vous vraiment effacer l'intégralité des scores ? Cette action est irréversible."
      );
      if (confirmation) {
        localStorage.removeItem("scores");
        alert("Tous les scores ont été effacés !");
        loadGlobalLeaderboardLocal();
      }
    });
    document.getElementById("leaderboard").appendChild(clearButton);
    const backButton = document.createElement("button");
    backButton.textContent = "Retour";
    backButton.addEventListener("click", function () {
      showScreen("levelSelectionScreen");
    });
    document.getElementById("leaderboard").appendChild(backButton);
    showScreen("leaderboard");
  }

  // Effacer le leaderboard pour le niveau courant
  function clearLeaderboard() {
    const confirmation = confirm(
      "Voulez-vous vraiment effacer le leaderboard pour le niveau '" +
        currentLevel +
        "' ? Cette action est irréversible."
    );
    if (confirmation) {
      let scores = JSON.parse(localStorage.getItem("scores")) || [];
      scores = scores.filter((record) => record.level !== currentLevel);
      localStorage.setItem("scores", JSON.stringify(scores));
      alert(
        "Les scores pour le niveau '" + currentLevel + "' ont été effacés !"
      );
      loadLeaderboardLocal();
    }
  }

  // Afficher l'écran Credits
  function showCredits() {
    const creditsScreen = document.getElementById("creditsScreen");
    creditsScreen.innerHTML = `<h2>Crédits</h2>
      <p>Développé par Hélder Parruque &amp; Bastien Marguet.</p>
      <p>Tous droits réservés IUT LYON1© 2025.</p>
      <p>Ce quiz est encore en phase de développement. Si vous avez d'autres suggestions, n'hésitez pas à nous écrire via <a href="mailto:bastien.marguet@univ-lyon1.fr">bastien.marguet@univ-lyon1.fr</a> ou <a href="mailto:helderparruque007@gmail.com">helderparruque007@gmail.com</a>. Pour ceux qui préfèrent rester anonymes, vous pouvez également utiliser ce lien pour partager votre avis en toute confidentialité : <a href="https://forms.office.com/r/mnYxnDngqE" target="_blank">Partager votre avis</a>. Merci !</p>`;
    const backButton = document.createElement("button");
    backButton.textContent = "Retour";
    backButton.addEventListener("click", function () {
      showScreen("levelSelectionScreen");
    });
    creditsScreen.appendChild(backButton);
    showScreen("creditsScreen");
  }

  // Démarrer le quiz en fonction du niveau choisi
  function startQuiz(level) {
    currentLevel = level;
    score = 0;
    document.getElementById("scoreValue").textContent = score;
    // Définir le temps total selon le niveau choisi
    if (level === "beginner") {
      totalTime = 12 * 60;
    } else if (level === "intermediate") {
      totalTime = 8 * 60;
    } else if (level === "advanced") {
      totalTime = 6 * 60;
    }
    timeRemaining = totalTime;
    document.getElementById("timeRemaining").textContent = formatTime(
      totalTime
    );
    setQuestionsForLevel(level);
    resetQuizContainer();
    startTimer();
    loadRandomQuestion();
    showScreen("quizContainer");
    document
      .getElementById("skipButton")
      .addEventListener("click", function () {
        loadRandomQuestion();
      });
  }

  // Événements sur les boutons de sélection de niveau
  document
    .getElementById("beginnerButton")
    .addEventListener("click", function () {
      startQuiz("beginner");
    });
  document
    .getElementById("intermediateButton")
    .addEventListener("click", function () {
      startQuiz("intermediate");
    });
  document
    .getElementById("advancedButton")
    .addEventListener("click", function () {
      startQuiz("advanced");
    });
  document.getElementById("skipButton").addEventListener("click", function () {
    loadRandomQuestion();
  });
});