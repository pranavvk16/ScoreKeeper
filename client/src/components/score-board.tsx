import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, ChevronRight, ChevronLeft } from "lucide-react";
import { type Game } from "@shared/schema";

interface Player {
  id: number;
  name: string;
  scores: number[];
  total: number;
}

interface ScoreBoardProps {
  game: Game;
  players: Player[];
  onScoreSubmit: (playerId: number, score: number) => void;
  onEndGame: () => void;
}

export function ScoreBoard({ game, players, onScoreSubmit, onEndGame }: ScoreBoardProps) {
  const [newScores, setNewScores] = useState<Record<number, string>>({});
  const [currentRound, setCurrentRound] = useState(0);

  const sortedPlayers = [...players].sort((a, b) => 
    game.highestWins ? b.total - a.total : a.total - b.total
  );

  const handleScoreSubmit = (playerId: number) => {
    const score = Number(newScores[playerId]);
    if (!isNaN(score)) {
      onScoreSubmit(playerId, score);
      setNewScores(prev => ({ ...prev, [playerId]: "" }));
    }
  };

  const maxRound = Math.max(...players.map(p => p.scores.length), 0);
  const canGoNext = currentRound < maxRound - 1;
  const canGoPrev = currentRound > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Scoreboard</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentRound(r => r - 1)}
                disabled={!canGoPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>Round {currentRound + 1}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentRound(r => r + 1)}
                disabled={!canGoNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="destructive" 
              onClick={onEndGame}
            >
              End Game
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedPlayers.map((player, index) => (
            <div key={player.id} className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                  <span className="font-medium">{player.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Round {currentRound + 1}: {player.scores[currentRound] || '-'}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Score"
                  value={newScores[player.id] || ""}
                  onChange={(e) => setNewScores(prev => ({ 
                    ...prev, 
                    [player.id]: e.target.value 
                  }))}
                  className="w-24"
                />
                <Button
                  variant="outline"
                  onClick={() => handleScoreSubmit(player.id)}
                >
                  Add
                </Button>
                <div className="w-20 text-right font-bold">
                  Total: {player.total}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full grid grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>Current Round: {currentRound + 1}</div>
          <div className="text-center">Total Rounds: {maxRound}</div>
          <div className="text-right">
            {game.highestWins ? "Highest Score Wins" : "Lowest Score Wins"}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}