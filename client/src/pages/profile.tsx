import { useQuery } from "@tanstack/react-query";
import { StatsDisplay } from "@/components/stats-display";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type User, type Score, type Game, type GameSession } from "@shared/schema";
import { CalendarDays, Trophy, Users, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GameHistory extends GameSession {
  game: Game;
  scores: Score[];
}

export default function Profile() {
  const { data: gameHistory, isLoading: loadingHistory } = useQuery<GameHistory[]>({
    queryKey: ["/api/users/1/history"]
  });

  const { data: user, isLoading: loadingUser } = useQuery<User>({
    queryKey: ["/api/users/1"]
  });

  if (loadingHistory || loadingUser) {
    return (
      <div className="container mx-auto px-4 pt-20">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const stats = {
    gamesPlayed: user.gamesPlayed || 0,
    gamesWon: user.gamesWon || 0,
    winRate: user.gamesPlayed ? ((user.gamesWon || 0) / user.gamesPlayed) * 100 : 0
  };

  return (
    <div className="container mx-auto px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`} />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold">{user.username}</h1>
            <p className="text-muted-foreground">Member since {new Date(user.createdAt || '').getFullYear()}</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-8">
        <StatsDisplay stats={stats} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              <span>Game History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {gameHistory?.map((history) => (
                <motion.div
                  key={history.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-muted/50 transform transition-all hover:scale-[1.02]">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-primary" />
                          {history.game.name}
                        </CardTitle>
                        <span className="text-sm text-muted-foreground">
                          {new Date(history.startTime).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {history.scores.map((score) => (
                            <div 
                              key={score.id}
                              className={cn(
                                "p-3 rounded-lg transition-colors",
                                score.playerId === user.id ? "bg-primary/10" : "bg-muted"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=player${score.playerId}`} />
                                  <AvatarFallback>P{score.playerId}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">Player {score.playerId}</span>
                              </div>
                              <div className="text-2xl font-bold mt-2">{score.score}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}