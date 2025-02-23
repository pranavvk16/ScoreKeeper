import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { type User } from "@shared/schema";
import { Trophy, Medal, Award } from "lucide-react";

const RankIcon = ({ rank }: { rank: number }) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-700" />;
    default:
      return <span className="h-6 w-6 flex items-center justify-center font-bold">
        {rank}
      </span>;
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
      <h1 className="text-4xl font-bold mb-8">Leaderboard</h1>

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
                <div 
                  key={user.id}
                  className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50"
                >
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
