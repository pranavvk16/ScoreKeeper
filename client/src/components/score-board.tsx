import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Star, Crown, Eye, EyeOff, Sparkles, Flame, Target, ArrowUp, ArrowDown, Medal, PartyPopper, Rocket, TrendingUp } from "lucide-react";
import { type Game } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  const [scoreLimit, setScoreLimit] = useState<number | null>(500); // Default score limit
  const [showRunningTotal, setShowRunningTotal] = useState(true);
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

  // Calculate player statistics and trends
  const playerStats = useMemo(() => {
    return players.map(player => {
      const scores = player.scores;
      const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const trend = scores.length > 1 ? 
        scores[scores.length - 1] > scores[scores.length - 2] ? 'up' : 'down' 
        : 'neutral';
      const consistency = scores.length > 1 ? 
        Math.abs(Math.max(...scores) - Math.min(...scores)) < avgScore * 0.2 
        : false;
      const hotStreak = scores.length >= 3 && 
        scores.slice(-3).every((score, i) => i === 0 || score > scores[scores.length - i - 2]);

      return {
        ...player,
        avgScore: avgScore.toFixed(1),
        trend,
        consistency,
        hotStreak,
        improvement: trend === 'up' ? 
          ((scores[scores.length - 1] - scores[scores.length - 2]) / scores[scores.length - 2] * 100).toFixed(1) + '%'
          : '0%'
      };
    });
  }, [players]);

  // Game insights
  const gameInsights = useMemo(() => {
    const avgRoundScores = players[0]?.scores.map((_, roundIndex) => 
      players.reduce((sum, p) => sum + (p.scores[roundIndex] || 0), 0) / players.length
    );

    const gameProgress = (currentRound + 1) / Math.max(10, Math.ceil(scoreLimit! / 100));
    const isCloseGame = sortedPlayers.length > 1 && 
      Math.abs(sortedPlayers[0].total - sortedPlayers[1].total) < avgRoundScores[avgRoundScores.length - 1];

    return {
      avgRoundScore: avgRoundScores.length ? avgRoundScores[avgRoundScores.length - 1].toFixed(1) : '0',
      gameProgress: Math.min(gameProgress * 100, 100),
      isCloseGame,
      predictedWinner: sortedPlayers[0]?.name,
      excitement: isCloseGame ? 'High' : 'Moderate'
    };
  }, [players, currentRound, scoreLimit, sortedPlayers]);

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

    // Check score limit and show animation
    const highestScore = Math.max(...players.map(p => p.total));
    if (scoreLimit && highestScore >= scoreLimit) {
      toast({
        title: "🎯 Score Limit Reached!",
        description: `A player has reached the score limit of ${scoreLimit}. Would you like to end the game?`,
        action: (
          <div className="flex gap-2">
            <Button onClick={onEndGame} variant="default">End Game</Button>
            <Button onClick={() => toast({ description: "Continuing the game!" })} variant="outline">Continue</Button>
          </div>
        ),
      });
    }

    // Show round completion animation
    setNotification(`🎉 Round ${currentRound + 1} Complete!`);
    setTimeout(() => setNotification(''), 2000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="relative">
        <div className="absolute top-4 right-4 space-x-2">
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
        <CardTitle className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span>Round {currentRound + 1}</span>
            {gameInsights.isCloseGame && <Flame className="h-5 w-5 text-orange-500" title="Close game!" />}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
              <Target className="h-4 w-4 text-primary" />
              <span>Score Limit: {scoreLimit || 'None'}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Avg Score: {gameInsights.avgRoundScore}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
              <Rocket className="h-4 w-4 text-blue-500" />
              <span>Progress: {gameInsights.gameProgress.toFixed(0)}%</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRoundSubmit)} className="space-y-4">
            {sortedPlayers.map((player, index) => {
              const playerStat = playerStats.find(p => p.id === player.id)!;
              return (
                <div
                  key={player.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg transition-all hover:scale-[1.01] ${
                    index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20 shadow-lg' :
                    index === 1 ? 'bg-gray-100 dark:bg-gray-800/50' :
                    index === 2 ? 'bg-amber-100 dark:bg-amber-900/20' :
                    'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-8 flex justify-center">
                      {index === 0 ? <Crown className="h-6 w-6 text-yellow-500 animate-bounce" /> :
                       index === 1 ? <Medal className="h-6 w-6 text-gray-400" /> :
                       index === 2 ? <Medal className="h-6 w-6 text-amber-700" /> :
                       <span className="text-lg font-bold">{index + 1}</span>}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {player.name}
                        {playerStat.hotStreak && <Flame className="h-4 w-4 text-orange-500" title="Hot streak!" />}
                        {playerStat.consistency && <Sparkles className="h-4 w-4 text-blue-500" title="Consistent player" />}
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <span>Avg: {playerStat.avgScore}</span>
                          {playerStat.trend === 'up' ? 
                            <ArrowUp className="h-3 w-3 text-green-500" /> : 
                            <ArrowDown className="h-3 w-3 text-red-500" />
                          }
                          {playerStat.trend === 'up' && <span className="text-green-500">+{playerStat.improvement}</span>}
                        </div>
                        <div className="text-muted-foreground flex gap-1">
                          Rounds: {player.scores.join(", ")}
                        </div>
                      </div>
                    </div>
                    {showRunningTotal && (
                      <div className="text-right text-lg font-bold">
                        {player.total}
                      </div>
                    )}
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
                <PartyPopper className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
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
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground mb-2">
            <div>Round: {currentRound + 1}</div>
            <div className="text-center">
              {gameInsights.excitement === 'High' ? '🔥 Close Game!' : '🎮 Game On!'}
            </div>
            <div className="text-right">
              {game.highestWins ? "Highest Wins" : "Lowest Wins"}
            </div>
          </div>
          {gameInsights.isCloseGame && (
            <div className="text-center text-xs text-muted-foreground mt-2 animate-pulse">
              Anyone could win this game! Keep playing! 🎮
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}