import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy } from "lucide-react";
import { type Game, type Score } from "@shared/schema";

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Scoreboard</span>
          <Button onClick={onEndGame}>End Game</Button>
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
                  Rounds: {player.scores.join(", ")}
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
                  {player.total}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
