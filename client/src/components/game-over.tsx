import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Share2, Trophy } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import type { Game, Player } from "@shared/schema";

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

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

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
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 pt-20"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Game Over
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-center mb-8"
          >
            {winner.name} Wins!
          </motion.div>
          <div className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="flex justify-between items-center"
              >
                <span>{player.name}</span>
                <span className="font-bold">{player.total} points</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={onPlayAgain} variant="default">
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