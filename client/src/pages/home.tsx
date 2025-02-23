import { useQuery } from "@tanstack/react-query";
import { GameList } from "@/components/game-list";
import { type Game } from "@shared/schema";

export default function Home() {
  const { data: games, isLoading } = useQuery<Game[]>({ 
    queryKey: ["/api/games"]
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-4xl font-bold mb-8">Available Games</h1>
      {games && <GameList games={games} />}
    </div>
  );
}
