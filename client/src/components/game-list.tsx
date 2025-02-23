import { useState } from "react";
import { useLocation } from "wouter";
import { type Game } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        {games?.map((game) => (
          <Card key={game.id} className="group hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>{game.name}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}