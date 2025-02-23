
import { useState } from "react";
import { useLocation } from "wouter";
import { type Game } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface GameListProps {
  games: Game[];
}

export function GameList({ games }: GameListProps) {
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [, navigate] = useLocation();

  const handleStartGame = (gameId: number) => {
    navigate(`/game/${gameId}`);
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId.trim()) {
      navigate(`/game/session/${sessionId}`);
      setShowJoinDialog(false);
    }
  };

  const { data: activeSessions } = useQuery({
    queryKey: ["/api/sessions/active"],
    refetchInterval: 5000
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Games</h2>
        <div className="space-x-2">
          <Button onClick={() => setShowJoinDialog(true)}>
            Join Game
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Active Sessions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeSessions?.map((session) => (
            <Card key={session.id} className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Session #{session.id}</span>
                  <Badge variant={session.currentPlayers >= session.maxPlayers ? "destructive" : "default"}>
                    {session.currentPlayers}/{session.maxPlayers} Players
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardFooter>
                <Button 
                  className="w-full"
                  disabled={session.currentPlayers >= session.maxPlayers}
                  onClick={() => handleJoinGame(session.id)}
                >
                  Join Session
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games?.map((game) => (
          <Card key={game.id} className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => handleStartGame(game.id)}>
            <CardHeader>
              <CardTitle>{game.name}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Game</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleJoinGame} className="space-y-4">
            <Input
              placeholder="Enter session ID"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
            />
            <Button type="submit">Join</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
