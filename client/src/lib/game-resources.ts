interface GameResource {
  wikihow: string;
  youtube: string[];
  additionalResources: Array<{
    title: string;
    url: string;
    description: string;
  }>;
}

export const gameResources: Record<string, GameResource> = {
  "Darts": {
    wikihow: "https://www.wikihow.com/Play-Darts",
    youtube: [
      "https://www.youtube.com/watch?v=yooXCn8vX_U",
      "https://www.youtube.com/watch?v=p1yJOkPmRhk"
    ],
    additionalResources: [
      {
        title: "Official Darts Rules",
        url: "https://www.dartboard.com/pages/darts-rules",
        description: "Complete guide to dart scoring and rules"
      },
      {
        title: "Darts Scoring Guide",
        url: "https://www.darting.com/Darts-Rules/",
        description: "Learn how to keep score in darts"
      }
    ]
  },
  "Carrom": {
    wikihow: "https://www.wikihow.com/Play-Carrom",
    youtube: [
      "https://www.youtube.com/watch?v=LhFrJxI6Umo",
      "https://www.youtube.com/watch?v=vEtQHLDAfNg"
    ],
    additionalResources: [
      {
        title: "Official Carrom Rules",
        url: "https://www.icf.org.in/rules-regulations",
        description: "International Carrom Federation official rules"
      },
      {
        title: "Carrom Techniques",
        url: "https://www.carrom.org/techniques",
        description: "Advanced techniques and strategies"
      }
    ]
  },
  "UNO": {
    wikihow: "https://www.wikihow.com/Play-UNO",
    youtube: [
      "https://www.youtube.com/watch?v=sWoSZmHcwvY",
      "https://www.youtube.com/watch?v=DD0eXEXRDMs"
    ],
    additionalResources: [
      {
        title: "Official UNO Rules",
        url: "https://www.mattel.com/en-us/uno",
        description: "Official rules from Mattel"
      }
    ]
  },
  "Yahtzee": {
    wikihow: "https://www.wikihow.com/Play-Yahtzee",
    youtube: [
      "https://www.youtube.com/watch?v=AYehM4mLu_k",
      "https://www.youtube.com/watch?v=H4DV-tQh_G8"
    ],
    additionalResources: [
      {
        title: "Yahtzee Strategy Guide",
        url: "https://www.ultraboardgames.com/yahtzee/strategy.php",
        description: "Tips and strategies for maximizing your score"
      }
    ]
  },
  "Hearts": {
    wikihow: "https://www.wikihow.com/Play-Hearts",
    youtube: [
      "https://www.youtube.com/watch?v=KDX0BZUv0WY",
      "https://www.youtube.com/watch?v=RN7ZFXZgsYE"
    ],
    additionalResources: [
      {
        title: "Hearts Strategy",
        url: "https://www.pagat.com/reverse/hearts.html",
        description: "Detailed rules and strategy guide"
      }
    ]
  },
  "Rummy": {
    wikihow: "https://www.wikihow.com/Play-Rummy",
    youtube: [
      "https://www.youtube.com/watch?v=CpMa7VLerYU",
      "https://www.youtube.com/watch?v=0u8heErDg9U"
    ],
    additionalResources: [
      {
        title: "Rummy Rules",
        url: "https://bicyclecards.com/how-to-play/rummy-rum/",
        description: "Official Bicycle Cards rummy rules"
      }
    ]
  }
};