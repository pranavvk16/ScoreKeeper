import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Share2, Home, RotateCcw } from "lucide-react";
import { type Game } from "@shared/schema";
import { useLocation } from "wouter";
import { Trophy3D } from "./Trophy3D";

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
      <Card className="w-full max-w-2xl bg-gradient-to-b from-background to-background/80 backdrop-blur-lg border-2">
        <CardHeader className="text-center">
          <CardTitle className="flex flex-col items-center gap-4">
            <div className="w-full h-[300px] relative">
              <Trophy3D />
            </div>
            <div className="space-y-1">
              <motion.h2 
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Game Over!
              </motion.h2>
              <motion.p 
                className="text-muted-foreground"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {game.name}
              </motion.p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <motion.div 
              className="text-center space-y-2"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold">Winner</h3>
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                {winner.name}
              </div>
              <div className="text-muted-foreground">
                Score: {winner.total}
              </div>
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold">Final Rankings</h3>
              {sortedPlayers.map((player, index) => (
                <motion.div 
                  key={player.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm hover:from-muted/60 hover:to-muted/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {index === 0 ? <Trophy className="h-6 w-6 text-yellow-500" /> :
                       index === 1 ? <Medal className="h-6 w-6 text-gray-400" /> :
                       index === 2 ? <Medal className="h-6 w-6 text-amber-700" /> :
                       <span className="font-bold">{index + 1}</span>}
                    </div>
                    <span className="font-medium">{player.name}</span>
                  </div>
                  <div className="font-bold text-xl">{player.total}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button 
            onClick={() => setLocation("/")} 
            variant="outline"
            className="backdrop-blur-sm hover:bg-background/80"
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button 
            onClick={onPlayAgain} 
            variant="outline"
            className="backdrop-blur-sm hover:bg-background/80"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Play Again
          </Button>
          <Button 
            onClick={shareScore} 
            className="bg-primary hover:bg-primary/90"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Score
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}