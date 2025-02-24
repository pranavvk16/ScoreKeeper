import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, ChevronRight, ChevronLeft, Star, Crown, Eye, EyeOff, History, TrendingUp, Award, Zap, Target, Smile, Frown, PartyPopper, Medal } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const getScoreMessage = (score: number, highestWins: boolean) => {
  if (score === 0) return { icon: <Target className="h-5 w-5" />, message: "Perfect zero! Was that intentional? 🎯" };
  if (highestWins) {
    if (score > 50) return { icon: <PartyPopper className="h-5 w-5" />, message: "Wow! Someone's showing off! 🎉" };
    if (score < 10) return { icon: <Frown className="h-5 w-5" />, message: "Better luck next time! 😅" };
    return { icon: <Smile className="h-5 w-5" />, message: "Not bad, keep pushing! 💪" };
  } else {
    if (score < 5) return { icon: <Medal className="h-5 w-5" />, message: "Now that's efficiency! 🏆" };
    if (score > 30) return { icon: <Zap className="h-5 w-5" />, message: "Ouch! That's gonna leave a mark! ⚡" };
    return { icon: <Smile className="h-5 w-5" />, message: "Steady as she goes! 🎯" };
  }
};

export function ScoreBoard({ game, players, onScoreSubmit, onEndGame, onResetGame }: ScoreBoardProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [scoreLimit, setScoreLimit] = useState<number | null>(null);
  const [showRunningTotal, setShowRunningTotal] = useState(true);
  const [showScoreLimitDialog, setShowScoreLimitDialog] = useState(true);
  const [showEndGamePrompt, setShowEndGamePrompt] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
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

  const playerStats = useMemo(() => {
    return players.map(player => {
      const scores = player.scores;
      const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const trend = scores.length > 1 ? 
        scores[scores.length - 1] > scores[scores.length - 2] ? 'improving' : 'declining' 
        : 'neutral';
      const consistency = scores.length > 1 ? 
        Math.sqrt(scores.reduce((acc, score) => acc + Math.pow(score - avg, 2), 0) / scores.length)
        : 0;

      const roundProgress = scores.map((score, idx) => {
        const prevScore = idx > 0 ? scores[idx - 1] : score;
        return {
          round: idx + 1,
          score,
          change: idx > 0 ? ((score - prevScore) / prevScore) * 100 : 0
        };
      });

      return {
        id: player.id,
        name: player.name,
        avgScore: avg.toFixed(1),
        highestScore: scores.length ? Math.max(...scores) : 0,
        lowestScore: scores.length ? Math.min(...scores) : 0,
        trend,
        consistency: consistency.toFixed(1),
        roundsPlayed: scores.length,
        bestRound: scores.length ? scores.indexOf(Math.max(...scores)) + 1 : 0,
        worstRound: scores.length ? scores.indexOf(Math.min(...scores)) + 1 : 0,
        roundProgress,
        recentPerformance: scores.slice(-3),
        improvementRate: trend === 'improving' ? 
          ((scores[scores.length - 1] - scores[scores.length - 2]) / scores[scores.length - 2] * 100).toFixed(1) + '%' : 
          trend === 'declining' ? 
          ((scores[scores.length - 2] - scores[scores.length - 1]) / scores[scores.length - 2] * 100).toFixed(1) + '%' : 
          '0%'
      };
    });
  }, [players]);

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

    // Show fun round completion message
    const highestScore = Math.max(...roundScores.map(s => s.score));
    const lowestScore = Math.min(...roundScores.map(s => s.score));
    const { message } = getScoreMessage(
      game.highestWins ? highestScore : lowestScore,
      game.highestWins
    );
    setNotification(`Round ${currentRound + 1} Complete! ${message}`);
    setTimeout(() => setNotification(''), 2000);

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

      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Game History & Insights</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="history">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">Round History</TabsTrigger>
              <TabsTrigger value="insights">Player Insights</TabsTrigger>
            </TabsList>
            <TabsContent value="history" className="mt-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {players[0].scores.map((_, roundIndex) => (
                    <div key={roundIndex} className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-medium mb-2">Round {roundIndex + 1}</h3>
                      <div className="space-y-2">
                        {players.map(player => {
                          const score = player.scores[roundIndex];
                          const { icon, message } = getScoreMessage(score, game.highestWins);
                          return (
                            <div key={player.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {icon}
                                <span>{player.name}</span>
                              </div>
                              <div className="font-medium">{score}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="insights" className="mt-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {playerStats.map(stat => (
                    <div key={stat.id} className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-medium flex items-center gap-2">
                        {stat.name}
                        <TrendingUp className={`h-4 w-4 ${
                          stat.trend === 'improving' ? 'text-green-500' :
                          stat.trend === 'declining' ? 'text-red-500' :
                          'text-yellow-500'
                        }`} />
                      </h3>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4 text-primary" />
                          <span>Avg: {stat.avgScore}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span>Consistency: {stat.consistency}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>Best: Round {stat.bestRound}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Frown className="h-4 w-4 text-red-500" />
                          <span>Worst: Round {stat.worstRound}</span>
                        </div>
                        <div className="col-span-2">
                          <div className="text-xs text-muted-foreground mt-2">Recent Performance:</div>
                          <div className="flex items-center gap-2 mt-1">
                            {stat.recentPerformance.map((score, idx) => (
                              <div
                                key={idx}
                                className={`px-2 py-1 rounded ${
                                  idx === stat.recentPerformance.length - 1 ?
                                    'bg-primary text-primary-foreground' :
                                    'bg-muted'
                                }`}
                              >
                                {score}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-xs text-muted-foreground">Improvement Rate:</div>
                          <div className={`font-medium ${
                            stat.trend === 'improving' ? 'text-green-500' :
                            stat.trend === 'declining' ? 'text-red-500' :
                            'text-yellow-500'
                          }`}>
                            {stat.improvementRate}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
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
                variant="outline"
                size="sm"
                onClick={() => setShowHistoryDialog(true)}
              >
                <History className="h-4 w-4 mr-2" />
                History
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
              {sortedPlayers.map((player, index) => {
                const stats = playerStats.find(s => s.id === player.id);
                return (
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
                        <div className="font-medium flex items-center gap-2">
                          {player.name}
                          {stats?.trend === 'improving' && <TrendingUp className="h-4 w-4 text-green-500" />}
                        </div>
                        {showRunningTotal && (
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span>Total: {player.total}</span>
                            <span className="text-xs">
                              (Avg: {stats?.avgScore})
                            </span>
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
                );
              })}
              <div className="flex justify-center pt-4">
                <Button type="submit" size="lg" className="relative overflow-hidden group">
                  <span className="relative z-10">Conclude Round</span>
                  <div className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform" />
                </Button>
              </div>
            </form>
          </Form>

          {notification && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Alert className="bg-primary text-primary-foreground animate-in slide-in-from-top-1/2 fade-in">
                <AlertDescription className="text-lg font-semibold flex items-center gap-2">
                  <PartyPopper className="h-5 w-5" />
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