export type ModuleResource = {
  label: string
  href: string
}

export type ModuleSection = {
  title: string
  content: string
}

export type ModuleDef = {
  id: number
  slug: string
  title: string
  description: string
  xp: number
  duration: string
  level: number
  status: "done" | "available" | "locked"
  tags: string[]
  resources: ModuleResource[]
  sections: ModuleSection[]
}

export const modules: ModuleDef[] = [
  {
    id: 1,
    slug: "culture-generale-ia",
    title: "Culture générale sur l'IA",
    description:
      "Comprends ce qu'est l'intelligence artificielle aujourd'hui, comment elle fonctionne, ce qu'elle peut faire… et surtout ses limites.",
    xp: 100,
    duration: "10 min",
    level: 1,
    status: "done",
    tags: ["Introduction", "Bases théoriques"],
    resources: [
      {
        label: "Article – IA agentique (Vie-publique)",
        href: "https://www.vie-publique.fr/en-bref/302417-ia-agentique-une-technologie-qui-suscite-des-questions",
      },
    ],
    sections: [
      {
        title: "Qu'est-ce que l'IA aujourd'hui ?",
        content:
          "L'intelligence artificielle regroupe des techniques qui permettent à des programmes de reconnaître des motifs, de prendre des décisions simples ou de générer du contenu à partir de données. Elle ne pense pas comme un humain : elle applique des calculs statistiques appris sur de très grands volumes d'exemples. Dans la vie quotidienne, cela se traduit par des systèmes de recommandation, des filtres anti-spam, des assistants vocaux ou des outils de traduction automatique.",
      },
      {
        title: "IA générative vs IA agentique",
        content:
          "L'IA générative crée des textes, des images ou des sons à partir de modèles comme les LLM. Elle est surtout réactive : elle répond à une consigne. L'IA agentique ajoute une couche d'orchestration : elle planifie des actions, choisit des outils, enchaîne plusieurs étapes pour atteindre un objectif (réserver un voyage, gérer un planning, etc.). Cela rend les systèmes plus autonomes, mais aussi plus difficiles à contrôler car les erreurs peuvent se cumuler dans une chaîne de décisions.",
      },
      {
        title: "Limites et risques",
        content:
          "Ces systèmes restent limités par leurs données et par leur définition des objectifs. Ils peuvent cumuler des erreurs à chaque étape, mal interpréter une consigne ou agir d'une manière inattendue si le cadre n'est pas clair. Comprendre ces limites est essentiel pour garder la main sur les décisions importantes : on ne délègue pas des choix éthiques, juridiques ou de sécurité à une IA sans contrôle humain.",
      },
    ],
  },
  {
    id: 2,
    slug: "toujours-verifier-ia",
    title: "Toujours vérifier l'IA",
    description:
      "Sensibilisation aux générations incorrectes : images, vidéos, textes. Apprends à douter, vérifier et croiser les informations produites par l'IA.",
    xp: 150,
    duration: "15 min",
    level: 1,
    status: "available",
    tags: ["Images", "Vidéos", "Textes"],
    resources: [
      {
        label: "Guide – Vérifier images / vidéos / audio (GIJN)",
        href: "https://gijn.org/fr/ressource/guide-journaliste-detecter-fake-contenus-audio-image-photo-montage-generes-ia-intelligence-artificielle/",
      },
    ],
    sections: [
      {
        title: "Les hallucinations de l'IA",
        content:
          "Une IA peut produire des réponses très convaincantes tout en étant complètement fausses. On parle d'hallucination lorsque le modèle invente des faits, des chiffres ou des citations au lieu d'admettre qu'il ne sait pas. Plus le texte est fluide et bien écrit, plus c'est trompeur : il faut donc apprendre à reconnaître que la forme n'est pas une garantie de vérité.",
      },
      {
        title: "Vérifier les textes",
        content:
          "Pour les textes, il faut toujours recouper l'information : chercher la même info sur des sites fiables, vérifier la date, l'auteur, et comparer plusieurs sources. Un texte bien écrit n'est pas une preuve de vérité. Un bon réflexe est de se demander : qui parle ? d'où vient cette information ? est-elle confirmée ailleurs ?",
      },
      {
        title: "Vérifier les images, vidéos et sons",
        content:
          "Pour les contenus visuels ou audio, on peut utiliser la recherche inversée d'image, analyser les métadonnées quand elles existent, et repérer des détails suspects (ombres incohérentes, mains mal dessinées, clignements d'yeux étranges, synchronisation des lèvres approximative). Les outils présentés dans le guide du GIJN donnent une bonne boîte à outils de base pour les journalistes comme pour le grand public.",
      },
    ],
  },
  {
    id: 3,
    slug: "fake-news-desinformation",
    title: "Fake news et désinformation",
    description:
      "Comprends comment l'IA peut amplifier les fake news et découvre les bons réflexes pour repérer et éviter de relayer de fausses informations.",
    xp: 150,
    duration: "15 min",
    level: 2,
    status: "available",
    tags: ["Fake news", "Esprit critique"],
    resources: [
      {
        label: "Article – Hypertrucages & deepfakes (CNIL)",
        href: "https://www.cnil.fr/fr/hypertrucage-deepfake",
      },
    ],
    sections: [
      {
        title: "Qu'est-ce qu'une fake news ?",
        content:
          "Une fake news est une information délibérément fausse ou trompeuse, créée pour manipuler, faire du clic ou nuire. L'IA permet d'en produire des milliers très rapidement, sous forme de textes, d'images ou de vidéos. Certaines sont spectaculaires, d'autres beaucoup plus banales, mais toutes cherchent à profiter d'un manque de vérification de la part des lecteurs.",
      },
      {
        title: "Deepfakes et hypertrucages",
        content:
          "Les hypertrucages utilisent l'IA pour modifier un visage, une voix ou une scène vidéo de manière très réaliste. Ils peuvent servir à faire dire ou faire des choses à une personne qu'elle n'a jamais dites ou faites, avec des conséquences graves sur la réputation ou la vie privée. La CNIL rappelle que ces usages peuvent être illégaux et lourdement sanctionnés, surtout lorsqu'ils portent atteinte à l'intimité ou servent à harceler.",
      },
      {
        title: "Les bons réflexes",
        content:
          "Avant de partager un contenu choquant, il faut faire une pause, vérifier l'origine, chercher des démentis ou des analyses de fact-checking, et se demander à qui profite cette information. Ne pas relayer à chaud est souvent la meilleure protection. On peut aussi s'appuyer sur des sites de vérification spécialisés qui expliquent comment ils ont vérifié les images ou les vidéos.",
      },
    ],
  },
  {
    id: 4,
    slug: "ia-au-travail",
    title: "IA au travail : aide ou paresse ?",
    description:
      "Réfléchis à l'utilisation de l'IA au travail : comment s'en servir comme assistant sans arrêter de réfléchir ni déléguer tout l'effort intellectuel.",
    xp: 200,
    duration: "20 min",
    level: 2,
    status: "available",
    tags: ["Travail", "Productivité"],
    resources: [
      {
        label: "Article – IA : paresse ou efficacité ?",
        href: "https://www.free-work.com/fr/tech-it/blog/billets-dhumeur/lia-nous-rend-t-elle-paresseux-ou-efficaces",
      },
      {
        label: "Vidéo – IA et travail (YouTube)",
        href: "https://www.youtube.com/watch?v=14hQ0GQupsc",
      },
    ],
    sections: [
      {
        title: "L'IA comme levier de productivité",
        content:
          "Bien utilisée, l'IA peut automatiser des tâches répétitives, aider à résumer des documents, proposer des idées ou générer des premiers jets. Cela libère du temps pour des activités à plus forte valeur ajoutée : conception, relation avec les clients, réflexion stratégique. Beaucoup d'entreprises observent déjà des gains mesurables de productivité grâce à ces outils.",
      },
      {
        title: "Le risque de paresse intellectuelle",
        content:
          "Si l'on se contente de copier-coller ce que propose l'IA sans comprendre ni relire, on perd progressivement ses réflexes d'analyse. Les décisions deviennent alors dépendantes de la machine, ce qui est dangereux pour la qualité comme pour la responsabilité. À long terme, cela peut aussi freiner l'apprentissage des nouvelles compétences dont on aura besoin sur le marché du travail.",
      },
      {
        title: "Trouver le bon équilibre",
        content:
          "L'objectif est d'utiliser l'IA comme un assistant : l'impliquer pour gagner du temps, mais garder la main sur la conception, la validation et la prise de décision. Relire, corriger, reformuler avec ses propres mots reste indispensable. Un bon indicateur : si tu es incapable d'expliquer ce que tu présentes sans l'IA, c'est que tu t'appuies trop sur elle.",
      },
    ],
  },
  {
    id: 5,
    slug: "ia-contenus-en-ligne-vie-sociale",
    title: "IA, contenus en ligne et vie sociale",
    description:
      "Posts générés avec l'IA, consanguinité des modèles, risque d'isolement social : pourquoi garder des contenus humains et des relations réelles.",
    xp: 200,
    duration: "20 min",
    level: 3,
    status: "available",
    tags: ["Réseaux sociaux", "Contenus IA", "Social"],
    resources: [
      {
        label: "Article – Consanguinité des IA (Low-tech Journal)",
        href: "https://www.lowtechjournal.fr/blog/billets/les-ia-deviennent-consanguine-et-debile-et-c-est-tant-mieux.html",
      },
      {
        label: "Article – IA-compagnons & ados (Profexpress)",
        href: "https://www.profexpress.com/intelligence-artificielle/ia-compagnons-quand-nos-ados-preferent-se-confier-a-une-machine-qua-nous/",
      },
    ],
    sections: [
      {
        title: "Internet saturé de contenus IA",
        content:
          "De plus en plus d'articles, de posts et d'images sont générés automatiquement. Si ces contenus tournent ensuite en boucle comme données d'entraînement, les modèles finissent par apprendre surtout d'autres IA plutôt que de l'expérience humaine. On parle de consanguinité des modèles, avec un risque de recyclage permanent des mêmes idées et des mêmes tournures.",
      },
      {
        title: "Risque de consanguinité des modèles",
        content:
          "Si les IA s'entraînent principalement sur des contenus produits par d'autres IA, la diversité et la qualité de l'information risquent de diminuer. On voit apparaître des textes très lisses, répétitifs, qui ajoutent peu de valeur réelle. Pour garder un web vivant, il est important que les humains continuent à produire des contenus originaux, situés et nuancés.",
      },
      {
        title: "IA-compagnons et isolement social",
        content:
          "Les chatbots émotionnels peuvent donner l'impression d'une relation amicale ou amoureuse. Mais ils ne ressentent rien et peuvent encourager un repli sur soi. Préserver des liens humains, avec leurs imperfections, reste essentiel pour la santé mentale. Les études récentes montrent que les jeunes qui passent beaucoup de temps avec des IA-compagnons ont parfois plus de mal à gérer les conflits et la complexité des vraies relations.",
      },
    ],
  },
]

