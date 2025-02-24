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
  "Poker": {
    wikihow: "https://www.wikihow.com/Play-Poker",
    youtube: [
      "https://www.youtube.com/watch?v=GAoR9ji8D6A",
      "https://www.youtube.com/watch?v=UE7wGTC8S_c"
    ],
    additionalResources: [
      {
        title: "Poker Strategy Guide",
        url: "https://www.pokernews.com/strategy/",
        description: "Comprehensive poker strategy articles and tips"
      },
      {
        title: "Official Poker Rules",
        url: "https://www.pokerstars.com/poker/games/rules/",
        description: "Official poker hand rankings and game rules"
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
  "Scrabble": {
    wikihow: "https://www.wikihow.com/Play-Scrabble",
    youtube: [
      "https://www.youtube.com/watch?v=GEk9JqhY7Pc",
      "https://www.youtube.com/watch?v=YE3WdlK-Dn8"
    ],
    additionalResources: [
      {
        title: "Scrabble Word Finder",
        url: "https://scrabble.merriam.com/",
        description: "Official Scrabble dictionary and word finder"
      },
      {
        title: "Scrabble Tips",
        url: "https://www.scrabblepages.com/scrabble/tips/",
        description: "Strategy guides and tips for better play"
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
  },
  "Bowling": {
    wikihow: "https://www.wikihow.com/Bowl",
    youtube: [
      "https://www.youtube.com/watch?v=QZ23LKBLbvw",
      "https://www.youtube.com/watch?v=7PCA1Th6UqY"
    ],
    additionalResources: [
      {
        title: "Bowling Tips",
        url: "https://www.bowl.com/Tips/",
        description: "Tips and techniques from professional bowlers"
      }
    ]
  },
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
        description: "Comprehensive darts rules and scoring"
      }
    ]
  },
  "Bridge": {
    wikihow: "https://www.wikihow.com/Play-Bridge",
    youtube: [
      "https://www.youtube.com/watch?v=UxNwj_UCB9c",
      "https://www.youtube.com/watch?v=nB0ImYBY5Y4"
    ],
    additionalResources: [
      {
        title: "Learn Bridge Online",
        url: "https://www.acbl.org/learn/",
        description: "American Contract Bridge League learning resources"
      }
    ]
  },
  "Golf": {
    wikihow: "https://www.wikihow.com/Play-Golf-Card-Game",
    youtube: [
      "https://www.youtube.com/watch?v=OxhZ7jEkI7Q",
      "https://www.youtube.com/watch?v=M3_8QvJ3Xkc"
    ],
    additionalResources: [
      {
        title: "Golf Card Game Rules",
        url: "https://bicyclecards.com/how-to-play/golf/",
        description: "Official Bicycle Cards golf rules"
      }
    ]
  }
};
