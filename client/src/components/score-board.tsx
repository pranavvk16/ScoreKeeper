import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, ChevronRight, ChevronLeft, Star, Crown, Undo2, Redo2, Plus, Minus } from "lucide-react";
import { type Game } from "@shared/schema";
import { Progress } from "@/components/ui/progress";

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
  type: 'regular' | 'penalty' | 'bonus';
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
  const [scoreHistory, setScoreHistory] = useState<ScoreAction[]>([]);
  const [undoHistory, setUndoHistory] = useState<ScoreAction[]>([]);
  const [scoreType, setScoreType] = useState<'regular' | 'penalty' | 'bonus'>('regular');

  const sortedPlayers = [...players].sort((a, b) => 
    game.highestWins ? b.total - a.total : a.total - b.total
  );

  const handleScoreSubmit = (playerId: number) => {
    const score = Number(newScores[playerId]);
    if (!isNaN(score)) {
      const finalScore = scoreType === 'penalty' ? -Math.abs(score) : score;
      const action: ScoreAction = {
        playerId,
        score: finalScore,
        round: currentRound,
        type: scoreType
      };

      onScoreSubmit(playerId, finalScore);
      setScoreHistory(prev => [...prev, action]);
      setUndoHistory([]); // Clear redo history on new action
      setNewScores(prev => ({ ...prev, [playerId]: "" }));

      // Check if all players have submitted scores for current round
      const allScoresSubmitted = players.every(p => 
        p.scores.length > currentRound || p.id === playerId
      );
      if (allScoresSubmitted) {
        setCurrentRound(prev => prev + 1);
      }
    }
  };

  const handleUndo = () => {
    if (scoreHistory.length === 0) return;

    const lastAction = scoreHistory[scoreHistory.length - 1];
    setScoreHistory(prev => prev.slice(0, -1));
    setUndoHistory(prev => [...prev, lastAction]);

    // Reverse the last score
    onScoreSubmit(lastAction.playerId, -lastAction.score);
  };

  const handleRedo = () => {
    if (undoHistory.length === 0) return;

    const lastUndo = undoHistory[undoHistory.length - 1];
    setUndoHistory(prev => prev.slice(0, -1));
    setScoreHistory(prev => [...prev, lastUndo]);

    // Reapply the score
    onScoreSubmit(lastUndo.playerId, lastUndo.score);
  };

  const maxRound = Math.max(...players.map(p => p.scores.length), 0);
  const canGoNext = currentRound < maxRound - 1;
  const canGoPrev = currentRound > 0;

  // Calculate progress for current round
  const playersWithScores = players.filter(p => p.scores[currentRound] !== undefined).length;
  const roundProgress = (playersWithScores / players.length) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span>Round {currentRound + 1}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleUndo}
                disabled={scoreHistory.length === 0}
                title="Undo last score"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRedo}
                disabled={undoHistory.length === 0}
                title="Redo last undone score"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentRound(r => r - 1)}
                disabled={!canGoPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="w-32">
                <Progress value={roundProgress} className="h-2" />
              </div>
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
              className="bg-red-500 hover:bg-red-600"
            >
              End Game
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-center gap-2">
          <Button
            variant={scoreType === 'regular' ? 'default' : 'outline'}
            onClick={() => setScoreType('regular')}
            className="w-24"
          >
            Regular
          </Button>
          <Button
            variant={scoreType === 'penalty' ? 'default' : 'outline'}
            onClick={() => setScoreType('penalty')}
            className="w-24"
          >
            <Minus className="h-4 w-4 mr-2" />
            Penalty
          </Button>
          <Button
            variant={scoreType === 'bonus' ? 'default' : 'outline'}
            onClick={() => setScoreType('bonus')}
            className="w-24"
          >
            <Plus className="h-4 w-4 mr-2" />
            Bonus
          </Button>
        </div>

        <div className="space-y-4">
          {sortedPlayers.map((player, index) => (
            <div 
              key={player.id} 
              className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20' : 
                index === 1 ? 'bg-gray-100 dark:bg-gray-800/50' :
                index === 2 ? 'bg-amber-100 dark:bg-amber-900/20' :
                'bg-muted/50'
              }`}
            >
              <div className="w-8 flex justify-center">
                {index === 0 ? <Crown className="h-6 w-6 text-yellow-500" /> :
                 index === 1 ? <Star className="h-6 w-6 text-gray-400" /> :
                 index === 2 ? <Star className="h-6 w-6 text-amber-700" /> :
                 <span className="text-lg font-bold">{index + 1}</span>}
              </div>
              <div className="flex-1">
                <div className="font-medium">{player.name}</div>
                <div className="text-sm text-muted-foreground">
                  Previous rounds: {player.scores.slice(0, currentRound).join(", ")}
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
                  className={`w-24 ${
                    scoreType === 'penalty' ? 'border-red-500' :
                    scoreType === 'bonus' ? 'border-green-500' : ''
                  }`}
                  disabled={player.scores.length > currentRound}
                />
                <Button
                  variant="outline"
                  onClick={() => handleScoreSubmit(player.id)}
                  disabled={player.scores.length > currentRound}
                  className={
                    scoreType === 'penalty' ? 'text-red-500 hover:text-red-600' :
                    scoreType === 'bonus' ? 'text-green-500 hover:text-green-600' : ''
                  }
                >
                  Add
                </Button>
                <div className="w-24 text-right">
                  <div className="font-bold">{player.total}</div>
                  <div className="text-xs text-muted-foreground">Total Score</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
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