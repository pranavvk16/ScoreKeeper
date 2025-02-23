
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ReactConfetti from "react-confetti";
import { Trophy, Share } from "lucide-react";
import { type Game, type Player } from "@shared/schema";

interface GameOverProps {
  game: Game;
  players: Player[];
  onPlayAgain: () => void;
}

export function GameOver({ game, players, onPlayAgain }: GameOverProps) {
  const [, setLocation] = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);
  const sortedPlayers = [...players].sort((a, b) => 
    game.highestWins ? b.total - a.total : a.total - b.total
  );

  const winner = sortedPlayers[0];

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const shareScore = async () => {
    const text = `I just finished a game of ${game.name}!\n` +
      `Winner: ${winner.name} with ${winner.total} points\n` +
      `Play now at ${window.location.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: `${game.name} Score`, text });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      {showConfetti && <ReactConfetti />}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Game Over!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-center"
              >
                {winner.name} Wins!
              </motion.div>
              <div className="space-y-2">
                {sortedPlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex justify-between items-center p-3 rounded-lg bg-muted"
                  >
                    <span>{player.name}</span>
                    <span className="font-bold">{player.total} points</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={shareScore}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={() => setLocation("/")}>
              New Game
            </Button>
            <Button onClick={onPlayAgain}>
              Play Again
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
