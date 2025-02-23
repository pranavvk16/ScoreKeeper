
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { type User } from "@shared/schema";
import { Trophy, Medal, Award, Crown, Star, TrendingUp } from "lucide-react";

const RankIcon = ({ rank }: { rank: number }) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-700" />;
    default:
      return <span className="h-6 w-6 flex items-center justify-center font-bold">{rank}</span>;
  }
};

export default function Leaderboard() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"]
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const sortedUsers = users?.sort((a, b) => {
    const aWinRate = a.gamesPlayed > 0 ? (a.gamesWon / a.gamesPlayed) : 0;
    const bWinRate = b.gamesPlayed > 0 ? (b.gamesWon / b.gamesPlayed) : 0;
    return bWinRate - aWinRate;
  }) || [];

  return (
    <div className="container mx-auto px-4 pt-20">
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold mb-8 flex items-center gap-2"
      >
        <Crown className="h-8 w-8 text-yellow-500" />
        Leaderboard
      </motion.h1>

      <Card>
        <CardHeader>
          <CardTitle>Top Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedUsers.map((user, index) => {
              const winRate = user.gamesPlayed > 0 
                ? (user.gamesWon / user.gamesPlayed) * 100 
                : 0;

              return (
                <motion.div 
                  key={user.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer">
                        <div className="flex-shrink-0">
                          <RankIcon rank={index + 1} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {user.username}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.gamesWon} wins out of {user.gamesPlayed} games
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {winRate.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Win Rate
                          </div>
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">Player Stats</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 rounded-lg bg-muted">
                            <div className="text-sm text-muted-foreground">Games</div>
                            <div className="font-medium">{user.gamesPlayed}</div>
                          </div>
                          <div className="p-2 rounded-lg bg-muted">
                            <div className="text-sm text-muted-foreground">Wins</div>
                            <div className="font-medium">{user.gamesWon}</div>
                          </div>
                        </div>
                        <div className="pt-2">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm">Performance Trend</span>
                          </div>
                          <div className="h-2 bg-muted mt-2 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ width: `${winRate}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </motion.div>
              );
            })}

            {sortedUsers.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No players yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
