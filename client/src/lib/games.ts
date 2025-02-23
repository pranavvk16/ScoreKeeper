import { type Game } from "@shared/schema";

export interface GameRules {
  name: string;
  description: string;
  scoringInfo: string;
  winCondition: string;
}

export const gameRules: Record<string, GameRules> = {
  "Poker": {
    name: "Poker",
    description: "Texas Hold'em poker scoring",
    scoringInfo: "Players accumulate chips through betting and winning hands",
    winCondition: "Player with the most chips at the end wins"
  },
  "UNO": {
    name: "UNO",
    description: "Classic UNO card game",
    scoringInfo: "Number cards = face value, Action cards = 20 points, Wild cards = 50 points",
    winCondition: "Player with the lowest total points wins"
  }
};

export function getGameRules(game: Game): GameRules {
  return gameRules[game.name] || {
    name: game.name,
    description: game.description,
    scoringInfo: "Custom scoring rules",
    winCondition: game.highestWins ? "Highest score wins" : "Lowest score wins"
  };
}
