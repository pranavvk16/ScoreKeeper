import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trophy,
  ChevronRight,
  ChevronLeft,
  Star,
  Crown,
  Undo2,
  Redo2,
  Plus,
  Minus,
  RotateCcw,
  TrendingUp,
  Info,
  HelpCircle,
  Target,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { type Game } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Player {
  id: number;
  name: string;
  scores: number[];
  total: number;
}

interface ScoreAction {
  playerId: number;
  score: number;
  round: number;
  type: "regular" | "penalty" | "bonus";
}

interface ScoreBoardProps {
  game: Game;
  players: Player[];
  onScoreSubmit: (playerId: number, score: number) => void;
  onEndGame: () => void;
  onResetGame?: () => void;
  scoreLimit?: number;
}

const funFacts = [
  "Did you know? The world's longest board game marathon lasted 61 hours and 2 minutes! 🎲",
  "Pro tip: Winners usually don't gloat... much 😏",
  "Remember: It's just a game... said no competitive player ever! 🏆",
  "Warning: Intense gaming sessions ahead! Snacks recommended 🍿",
  "Plot twist: The real winner is friendship... just kidding, crush them! 😈",
];

const gameGuides = {
  Poker: "https://www.wikihow.com/Play-Poker",
  Chess: "https://www.wikihow.com/Play-Chess",
  Monopoly: "https://www.wikihow.com/Play-Monopoly",
};

// Create a dynamic form schema based on players
const createRoundFormSchema = (players: Player[], scoreLimit?: number) => {
  const playerScores = players.reduce(
    (acc, player) => {
      acc[`player_${player.id}`] = z
        .number()
        .min(-1000, "Score too low!")
        .max(scoreLimit || 1000, `Score cannot exceed ${scoreLimit || 1000}`);
      return acc;
    },
    {} as Record<string, z.ZodNumber>,
  );

  return z.object(playerScores);
};

export function ScoreBoard({
  game,
  players,
  onScoreSubmit,
  onEndGame,
  onResetGame,
  scoreLimit,
}: ScoreBoardProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<ScoreAction[]>([]);
  const [undoHistory, setUndoHistory] = useState<ScoreAction[]>([]);
  const [scoreType, setScoreType] = useState<"regular" | "penalty" | "bonus">(
    "regular",
  );
  const [notification, setNotification] = useState("");
  const [lastRound, setLastRound] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [currentFunFact, setCurrentFunFact] = useState(funFacts[0]);

  // Create form schema for the current round
  const roundFormSchema = createRoundFormSchema(players, scoreLimit);

  const form = useForm({
    resolver: zodResolver(roundFormSchema),
    defaultValues: players.reduce(
      (acc, player) => {
        acc[`player_${player.id}`] = 0;
        return acc;
      },
      {} as Record<string, number>,
    ),
  });

  useEffect(() => {
    const maxRoundInScores = Math.max(
      ...players.map((p) => p.scores.length),
      0,
    );
    setLastRound(maxRoundInScores);

    const interval = setInterval(() => {
      setCurrentFunFact((prev) => {
        const nextIndex = (funFacts.indexOf(prev) + 1) % funFacts.length;
        return funFacts[nextIndex];
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [players]);

  const sortedPlayers = [...players].sort((a, b) =>
    game.highestWins ? b.total - a.total : a.total - b.total,
  );

  const winPrediction = useMemo(() => {
    if (players.length < 2 || !players[0].scores.length) return null;

    const predictions = players.map((player) => {
      const recentScores = player.scores.slice(-3);
      const trend =
        recentScores.length > 1
          ? recentScores.reduce((a, b) => b - a) / recentScores.length
          : 0;

      return {
        name: player.name,
        total: player.total,
        trend,
        winChance: player.total * 0.7 + trend * 0.3,
      };
    });

    return predictions.sort((a, b) => b.winChance - a.winChance)[0];
  }, [players]);

  const playerStats = useMemo(() => {
    return players.map((player) => ({
      id: player.id,
      name: player.name,
      avgScore: player.scores.length
        ? (
            player.scores.reduce((a, b) => a + b, 0) / player.scores.length
          ).toFixed(1)
        : "0",
      highestScore: player.scores.length ? Math.max(...player.scores) : 0,
      lowestScore: player.scores.length ? Math.min(...player.scores) : 0,
      trend:
        player.scores.length > 1
          ? player.scores[player.scores.length - 1] >
            player.scores[player.scores.length - 2]
            ? "up"
            : "down"
          : "neutral",
      consistency:
        player.scores.length > 1
          ? Math.abs(
              1 -
                (Math.max(...player.scores) - Math.min(...player.scores)) /
                  player.total,
            ) * 100
          : 100,
    }));
  }, [players]);

  const concludeRound = (formData: Record<string, number>) => {
    const newScores: ScoreAction[] = [];

    Object.entries(formData).forEach(([key, score]) => {
      const playerId = parseInt(key.split("_")[1]);
      const finalScore = scoreType === "penalty" ? -Math.abs(score) : score;

      newScores.push({
        playerId,
        score: finalScore,
        round: currentRound,
        type: scoreType,
      });

      onScoreSubmit(playerId, finalScore);
    });

    setScoreHistory((prev) => [...prev, ...newScores]);
    setUndoHistory([]);
    form.reset();

    // Fun messages based on scores
    const highestScore = Math.max(...Object.values(formData));
    if (highestScore > 50) {
      setNotification("Someone's on fire! 🔥");
    } else if (highestScore === 0) {
      setNotification("A round of zeros? Tough crowd! 🎲");
    }

    setCurrentRound((prev) => prev + 1);
    showRoundWinner(currentRound);
  };

  const handleUndo = () => {
    if (scoreHistory.length === 0) return;

    const lastAction = scoreHistory[scoreHistory.length - 1];
    setScoreHistory((prev) => prev.slice(0, -1));
    setUndoHistory((prev) => [...prev, lastAction]);

    onScoreSubmit(lastAction.playerId, -lastAction.score);
  };

  const handleRedo = () => {
    if (undoHistory.length === 0) return;

    const lastUndo = undoHistory[undoHistory.length - 1];
    setUndoHistory((prev) => prev.slice(0, -1));
    setScoreHistory((prev) => [...prev, lastUndo]);

    onScoreSubmit(lastUndo.playerId, lastUndo.score);
  };

  const handleResetGame = () => {
    if (onResetGame) {
      setCurrentRound(0);
      setScoreHistory([]);
      setUndoHistory([]);
      setNotification("");
      form.reset();
      onResetGame();
    }
  };

  const showRoundWinner = (round: number) => {
    const winner = sortedPlayers[0].name;
    setNotification(`Round ${round + 1} Winner: ${winner}! 🏆`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span>Round {currentRound + 1}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleResetGame}
              title="Reset game"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="View Statistics">
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Player Statistics</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {playerStats.map((stat) => (
                      <div key={stat.id} className="p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-medium">{stat.name}</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          <div>Average Score: {stat.avgScore}</div>
                          <div>Highest Score: {stat.highestScore}</div>
                          <div>Lowest Score: {stat.lowestScore}</div>
                          <div>Trend: {stat.trend}</div>
                          <div>Consistency: {stat.consistency.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <Button
              variant="destructive"
              onClick={onEndGame}
              className="bg-red-500 hover:bg-red-600"
              size="sm"
            >
              End Game
            </Button>
          </div>
          {gameGuides[game.name] && (
            <a
              href={gameGuides[game.name]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <HelpCircle className="h-4 w-4" />
              How to Play
            </a>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-primary/5 rounded-lg text-sm flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          {currentFunFact}
        </div>

        {winPrediction && (
          <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-yellow-600" />
            <span>
              Current favorite to win: <strong>{winPrediction.name}</strong>
              {winPrediction.trend > 0 ? " 📈" : " 📉"}
            </span>
          </div>
        )}

        {scoreLimit && (
          <div className="mb-4 p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span>Score limit: {scoreLimit} points per round</span>
          </div>
        )}

        <div className="mb-4 flex flex-wrap justify-center gap-2">
          <Button
            variant={scoreType === "regular" ? "default" : "outline"}
            onClick={() => setScoreType("regular")}
            className="w-24 text-sm"
          >
            Regular
          </Button>
          <Button
            variant={scoreType === "penalty" ? "default" : "outline"}
            onClick={() => setScoreType("penalty")}
            className="w-24 text-sm"
          >
            <Minus className="h-4 w-4 mr-1" />
            Penalty
          </Button>
          <Button
            variant={scoreType === "bonus" ? "default" : "outline"}
            onClick={() => setScoreType("bonus")}
            className="w-24 text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Bonus
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(concludeRound)} className="space-y-4">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 rounded-lg transition-colors ${
                index === 0
                  ? "bg-yellow-100 dark:bg-yellow-900/20"
                  : index === 1
                    ? "bg-gray-100 dark:bg-gray-800/50"
                    : index === 2
                      ? "bg-amber-100 dark:bg-amber-900/20"
                      : "bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="w-8 flex justify-center">
                  {index === 0 ? (
                    <Crown className="h-6 w-6 text-yellow-500" />
                  ) : index === 1 ? (
                    <Star className="h-6 w-6 text-gray-400" />
                  ) : index === 2 ? (
                    <Star className="h-6 w-6 text-amber-700" />
                  ) : (
                    <span className="text-lg font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{player.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Previous: {player.scores.slice(0, currentRound).join(", ")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Score"
                    {...form.register(`player_${player.id}`, {
                      valueAsNumber: true,
                    })}
                    className={`w-20 sm:w-24 ${
                      scoreType === "penalty"
                        ? "border-red-500"
                        : scoreType === "bonus"
                          ? "border-green-500"
                          : ""
                    }`}
                  />
                </div>
                <div className="text-right">
                  <div className="font-bold">{player.total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              Conclude Round
            </Button>
          </div>
        </form>

        {notification && (
          <div className="text-center mt-4 p-2 bg-primary/10 rounded-lg animate-bounce">
            {notification}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 sm:pt-6">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div>Round: {currentRound + 1}</div>
          <div className="text-center hidden sm:block">
            Total Rounds: {lastRound}
          </div>
          <div className="text-right col-span-1 sm:col-span-1">
            {game.highestWins ? "Highest Wins" : "Lowest Wins"}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
