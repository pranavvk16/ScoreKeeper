import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, ChevronRight, ChevronLeft, Star, Crown, Undo2, Redo2, Plus, Minus, RotateCcw, TrendingUp, Filter, Eye, EyeOff } from "lucide-react";
import { type Game } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface Player {
  id: number;
  name: string;
  scores: number[];
  total: number;
}

interface ScoreBoardProps {
  game: Game;
  players: Player[];
  onScoreSubmit: (scores: { playerId: number; score: number }[]) => void;
  onEndGame: () => void;
  onResetGame?: () => void;
}

const roundScoreSchema = z.object({
  scores: z.array(z.object({
    playerId: z.number(),
    score: z.string().refine(val => !isNaN(Number(val)) && val.trim() !== '', {
      message: "Score is required and must be a number"
    })
  }))
});

type RoundScoreForm = z.infer<typeof roundScoreSchema>;

export function ScoreBoard({ game, players, onScoreSubmit, onEndGame, onResetGame }: ScoreBoardProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [scoreLimit, setScoreLimit] = useState<number | null>(null);
  const [showRunningTotal, setShowRunningTotal] = useState(true);
  const [showScoreLimitDialog, setShowScoreLimitDialog] = useState(true);
  const [showEndGamePrompt, setShowEndGamePrompt] = useState(false);
  const [notification, setNotification] = useState('');
  const { toast } = useToast();

  const form = useForm<RoundScoreForm>({
    resolver: zodResolver(roundScoreSchema),
    defaultValues: {
      scores: players.map(player => ({
        playerId: player.id,
        score: ''
      }))
    }
  });

  const sortedPlayers = [...players].sort((a, b) =>
    game.highestWins ? b.total - a.total : a.total - b.total
  );

  const handleScoreLimitSubmit = (limit: number) => {
    setScoreLimit(limit);
    setShowScoreLimitDialog(false);
  };

  const handleRoundSubmit = (data: RoundScoreForm) => {
    const roundScores = data.scores.map(score => ({
      playerId: score.playerId,
      score: Number(score.score)
    }));

    onScoreSubmit(roundScores);
    setCurrentRound(prev => prev + 1);
    form.reset({
      scores: players.map(player => ({
        playerId: player.id,
        score: ''
      }))
    });

    // Show round completion animation
    setNotification(`Round ${currentRound + 1} Complete!`);
    setTimeout(() => setNotification(''), 2000);

    // Check score limit
    if (scoreLimit) {
      const playerOverLimit = players.find(p => p.total >= scoreLimit);
      if (playerOverLimit) {
        setShowEndGamePrompt(true);
      }
    }
  };

  return (
    <>
      <Dialog open={showScoreLimitDialog} onOpenChange={setShowScoreLimitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Score Limit (Optional)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="number"
              placeholder="Enter score limit"
              onChange={(e) => handleScoreLimitSubmit(Number(e.target.value))}
            />
            <Button onClick={() => setShowScoreLimitDialog(false)}>
              Skip
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEndGamePrompt} onOpenChange={setShowEndGamePrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Score Limit Reached</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>A player has reached the score limit. Would you like to end the game?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndGamePrompt(false)}>
              Continue Playing
            </Button>
            <Button onClick={onEndGame}>
              End Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              <span>Round {currentRound + 1}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRunningTotal(!showRunningTotal)}
              >
                {showRunningTotal ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showRunningTotal ? "Hide Total" : "Show Total"}
              </Button>
              <Button
                variant="destructive"
                onClick={onEndGame}
                size="sm"
              >
                End Game
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRoundSubmit)} className="space-y-4">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg ${
                    index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                    index === 1 ? 'bg-gray-100 dark:bg-gray-800/50' :
                    index === 2 ? 'bg-amber-100 dark:bg-amber-900/20' :
                    'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-8 flex justify-center">
                      {index === 0 ? <Crown className="h-6 w-6 text-yellow-500" /> :
                       index === 1 ? <Star className="h-6 w-6 text-gray-400" /> :
                       index === 2 ? <Star className="h-6 w-6 text-amber-700" /> :
                       <span className="text-lg font-bold">{index + 1}</span>}
                    </div>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      {showRunningTotal && (
                        <div className="text-sm text-muted-foreground">
                          Total: {player.total}
                        </div>
                      )}
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name={`scores.${index}.score`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Score"
                            className="w-24"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <div className="flex justify-center pt-4">
                <Button type="submit" size="lg">
                  Conclude Round
                </Button>
              </div>
            </form>
          </Form>

          {notification && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Alert className="bg-primary text-primary-foreground animate-in slide-in-from-top-1/2 fade-in">
                <AlertDescription className="text-lg font-semibold">
                  {notification}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t pt-4">
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
            <div>Round: {currentRound + 1}</div>
            <div className="text-center">
              {scoreLimit ? `Score Limit: ${scoreLimit}` : 'No Score Limit'}
            </div>
            <div className="text-right">
              {game.highestWins ? "Highest Wins" : "Lowest Wins"}
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}