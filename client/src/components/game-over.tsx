import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Share2, Home, RotateCcw } from "lucide-react";
import { type Game } from "@shared/schema";
import { useLocation } from "wouter";

interface Player {
  id: number;
  name: string;
  scores: number[];
  total: number;
}

interface GameOverProps {
  game: Game;
  players: Player[];
  onPlayAgain: () => void;
}

export function GameOver({ game, players, onPlayAgain }: GameOverProps) {
  const [, setLocation] = useLocation();
  const sortedPlayers = [...players].sort((a, b) => 
    game.highestWins ? b.total - a.total : a.total - b.total
  );

  const winner = sortedPlayers[0];
  const shareScore = async () => {
    const text = `I just finished a game of ${game.name}!\n` +
      `Winner: ${winner.name} with ${winner.total} points\n` +
      `Play now at ${window.location.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${game.name} Score`,
          text: text,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex flex-col items-center gap-4">
            <Trophy className="h-16 w-16 text-yellow-500" />
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">Game Over!</h2>
              <p className="text-muted-foreground">{game.name}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Winner</h3>
              <div className="text-2xl font-bold text-primary">
                {winner.name}
              </div>
              <div className="text-muted-foreground">
                Score: {winner.total}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Final Rankings</h3>
              {sortedPlayers.map((player, index) => (
                <div 
                  key={player.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {index === 0 ? <Trophy className="h-5 w-5 text-yellow-500" /> :
                       index === 1 ? <Medal className="h-5 w-5 text-gray-400" /> :
                       index === 2 ? <Medal className="h-5 w-5 text-amber-700" /> :
                       <span className="font-bold">{index + 1}</span>}
                    </div>
                    <span className="font-medium">{player.name}</span>
                  </div>
                  <div className="font-bold">{player.total}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={() => setLocation("/")} variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button onClick={onPlayAgain} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Play Again
          </Button>
          <Button onClick={shareScore} className="bg-primary">
            <Share2 className="h-4 w-4 mr-2" />
            Share Score
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
