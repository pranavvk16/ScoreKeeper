
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Games</h2>
        <Button onClick={() => setShowJoinDialog(true)}>
          Join Game
        </Button>
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
