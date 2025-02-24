import { type Game } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Star, Clock } from "lucide-react";
import { Link } from "wouter";
import { GameInfo } from "./game-info";
import { motion } from "framer-motion";

interface GameListProps {
  games: Game[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export function GameList({ games }: GameListProps) {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {games.map((game) => (
        <motion.div key={game.id} variants={item}>
          <Card className="group hover:shadow-lg transition-all">
            <CardHeader className="relative">
              <div className="absolute top-4 right-4">
                <GameInfo game={game} />
              </div>
              <CardTitle className="flex items-center justify-between pr-8">
                <motion.div whileHover={{ scale: 1.05 }}>
                  {game.name}
                </motion.div>
                {game.isCustom && (
                  <Badge variant="secondary">Custom</Badge>
                )}
              </CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <motion.div 
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    <span>{game.minPlayers}-{game.maxPlayers} players</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Trophy className="h-4 w-4 mr-1" />
                    <span>{game.highestWins ? "Highest wins" : "Lowest wins"}</span>
                  </motion.div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span>Difficulty: Medium</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>~30 mins</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/game/${game.id}`}>
                <Button className="w-full group-hover:scale-105 transition-transform">
                  Start Game
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}