import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, Award, Users, Star, TrendingUp, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  achievements?: Array<{
    id: string;
    name: string;
    description: string;
    earned: boolean;
    progress: number;
  }>;
  performanceTrend?: {
    trend: "up" | "down" | "stable";
    percentage: number;
  };
}

interface StatsDisplayProps {
  stats: Stats;
}

const achievementsList = [
  {
    id: "first_win",
    name: "First Victory",
    description: "Win your first game",
    target: 1
  },
  {
    id: "win_streak",
    name: "Winning Streak",
    description: "Win 3 games in a row",
    target: 3
  },
  {
    id: "veteran",
    name: "Veteran Player",
    description: "Play 50 games",
    target: 50
  }
];

export function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Games Played</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
              {stats.performanceTrend && (
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className={`h-4 w-4 mr-1 ${
                    stats.performanceTrend.trend === "up" ? "text-green-500" :
                    stats.performanceTrend.trend === "down" ? "text-red-500" :
                    "text-yellow-500"
                  }`} />
                  <span>{stats.performanceTrend.percentage}% more than last week</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Games Won</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.gamesWon}</div>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 mr-1 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Next milestone: {Math.ceil((stats.gamesWon + 1) / 10) * 10} wins
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.winRate.toFixed(1)}%
              </div>
              <Progress value={stats.winRate} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {stats.achievements && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {achievementsList.map((achievement) => {
                  const userAchievement = stats.achievements?.find(a => a.id === achievement.id);
                  return (
                    <div key={achievement.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">{achievement.name}</div>
                        <div className="text-sm text-muted-foreground">{achievement.description}</div>
                      </div>
                      {userAchievement?.earned ? (
                        <Star className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {userAchievement?.progress || 0}/{achievement.target}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}