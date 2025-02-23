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
  },
  "Scrabble": {
    name: "Scrabble",
    description: "Word building board game",
    scoringInfo: "Letter tiles have different point values. Double/triple letter/word scores multiply points",
    winCondition: "Highest total score after all tiles are used wins"
  },
  "Yahtzee": {
    name: "Yahtzee",
    description: "Dice rolling and scoring game",
    scoringInfo: "Score combinations like pairs, straights, and full houses. Yahtzee = 50 points",
    winCondition: "Highest total score after all categories are filled wins"
  },
  "Hearts": {
    name: "Hearts",
    description: "Classic Hearts card game",
    scoringInfo: "Hearts = 1 point, Queen of Spades = 13 points",
    winCondition: "Lowest score at the end of the game wins"
  },
  "Rummy": {
    name: "Rummy",
    description: "Card matching and set collection",
    scoringInfo: "Face cards = 10 points, Aces = 11 points, Number cards = face value",
    winCondition: "First player to reach 500 points wins"
  },
  "Bowling": {
    name: "Bowling",
    description: "Ten-pin bowling scoring",
    scoringInfo: "Strike = 10 + next 2 rolls, Spare = 10 + next roll, Open frame = pins knocked down",
    winCondition: "Highest score after 10 frames wins"
  },
  "Darts": {
    name: "Darts",
    description: "Classic darts scoring",
    scoringInfo: "Start with 501, subtract each throw. Doubles and triples count",
    winCondition: "First to exactly zero wins"
  },
  "Bridge": {
    name: "Bridge",
    description: "Contract bridge scoring",
    scoringInfo: "Tricks above 6 score points. Bonuses for game and slam contracts",
    winCondition: "Team with most points after rubber wins"
  },
  "Golf": {
    name: "Golf",
    description: "Golf card game scoring",
    scoringInfo: "Face cards = 10, Aces = 1, Number cards = face value",
    winCondition: "Lowest total score after 9 rounds wins"
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