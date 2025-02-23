
import { type Game, type GameCategory } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Clock } from "lucide-react";

interface GameListProps {
  games: Game[];
  categories: GameCategory[];
}

export function GameList({ games, categories }: GameListProps) {
  return (
    <div className="space-y-8">
      {categories.map(category => (
        <div key={category.id}>
          <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games
              .filter(game => game.categoryId === category.id)
              .map(game => (
                <Card key={game.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{game.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {game.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{game.minPlayers}-{game.maxPlayers} players</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>~30 mins</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Link href={`/game/${game.id}`}>
                      <Button className="w-full">
                        Start Game
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
