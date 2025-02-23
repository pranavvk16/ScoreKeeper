import { useQuery } from "@tanstack/react-query";
import { StatsDisplay } from "@/components/stats-display";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { type User, type Score } from "@shared/schema";
import { CalendarDays } from "lucide-react";

export default function Profile() {
  const { data: scores, isLoading: loadingScores } = useQuery<Score[]>({
    queryKey: ["/api/players/1/scores"] // Assuming logged in user has ID 1 for demo
  });

  const { data: user, isLoading: loadingUser } = useQuery<User>({
    queryKey: ["/api/users/1"] // Assuming logged in user has ID 1 for demo
  });

  if (loadingScores || loadingUser) {
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
    gamesPlayed: user.gamesPlayed,
    gamesWon: user.gamesWon,
    winRate: user.gamesPlayed > 0 
      ? (user.gamesWon / user.gamesPlayed) * 100 
      : 0
  };

  const recentGames = scores?.slice(0, 5) || [];

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-4xl font-bold mb-8">Player Profile</h1>
      
      <div className="space-y-8">
        <StatsDisplay stats={stats} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5" />
              <span>Recent Games</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentGames.length > 0 ? (
              <div className="space-y-4">
                {recentGames.map((score) => (
                  <div 
                    key={score.id} 
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <div className="font-medium">Game #{score.sessionId}</div>
                      <div className="text-sm text-muted-foreground">
                        Round {score.round + 1}
                      </div>
                    </div>
                    <div className="text-xl font-bold">{score.score}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No games played yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
