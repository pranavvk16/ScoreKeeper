import { type Game } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users } from "lucide-react";
import { Link } from "wouter";

interface GameListProps {
  games: Game[];
}

export function GameList({ games }: GameListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <Link key={game.id} href={`/game/${game.id}`}>
          <a className="block">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {game.name}
                  {game.isCustom && (
                    <Badge variant="secondary">Custom</Badge>
                  )}
                </CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
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
            </Card>
          </a>
        </Link>
      ))}
    </div>
  );
}
