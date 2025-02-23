import { useState } from "react";
import { type Game } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Info } from "lucide-react";
import { Link } from "wouter";
import { GameInfo } from "./game-info";

interface GameListProps {
  games: Game[];
}

export function GameList({ games }: GameListProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle>{game.name}</CardTitle>
                <div className="flex gap-2">
                  {game.isCustom && (
                    <Badge variant="secondary">Custom</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedGame(game);
                    }}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <Link href={`/game/${game.id}`}>
              <a className="block">
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{game.minPlayers}-{game.maxPlayers} players</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-1" />
                      <span>{game.highestWins ? "Highest wins" : "Lowest wins"}</span>
                    </div>
                  </div>
                </CardContent>
              </a>
            </Link>
          </Card>
        ))}
      </div>

      {selectedGame && (
        <GameInfo
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </>
  );
}