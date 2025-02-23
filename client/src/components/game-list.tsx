
import { type Game } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Star, Clock } from "lucide-react";
import { Link } from "wouter";
import { GameInfo } from "./game-info";

interface GameListProps {
  games: Game[];
}

export function GameList({ games }: GameListProps) {
  const [sessionId, setSessionId] = useState("");
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [, setLocation] = useLocation();

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId.trim()) {
      setLocation(`/game/${sessionId}`);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Games</h2>
        <Button onClick={() => setShowJoinDialog(true)}>
          Join Game
        </Button>
      </div>

      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Game</DialogTitle>
            <DialogDescription>
              Enter the session ID to join an ongoing game
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleJoinGame}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionId">Session ID</Label>
                <Input
                  id="sessionId"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Enter session ID"
                />
              </div>
              <Button type="submit" className="w-full">
                Join Game
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <Card key={game.id} className="group hover:shadow-lg transition-all">
          <CardHeader className="relative">
            <div className="absolute top-4 right-4">
              <GameInfo game={game} />
            </div>
            <CardTitle className="flex items-center justify-between pr-8">
              {game.name}
              {game.isCustom && (
                <Badge variant="secondary">Custom</Badge>
              )}
            </CardTitle>
            <CardDescription>{game.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{game.minPlayers}-{game.maxPlayers} players</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-1" />
                  <span>{game.highestWins ? "Highest wins" : "Lowest wins"}</span>
                </div>
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
              <Button className="w-full">
                Start Game
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
