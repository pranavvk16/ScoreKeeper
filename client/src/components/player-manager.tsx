
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, X } from "lucide-react";
import { type Player } from "@shared/schema";

interface PlayerManagerProps {
  onSelectPlayer: (player: Player) => void;
  gameId: number;
}

export function PlayerManager({ onSelectPlayer, gameId }: PlayerManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: "", nickname: "", photoUrl: "" });

  const { data: players, refetch } = useQuery<Player[]>({
    queryKey: ["/api/players"]
  });

  const addPlayerMutation = useMutation({
    mutationFn: async (player: Partial<Player>) => {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(player)
      });
      return res.json();
    },
    onSuccess: () => {
      refetch();
      setShowAddForm(false);
      setNewPlayer({ name: "", nickname: "", photoUrl: "" });
    }
  });

  const handleAddPlayer = () => {
    addPlayerMutation.mutate({
      name: newPlayer.name,
      nickname: newPlayer.nickname || null,
      photoUrl: newPlayer.photoUrl || null,
      isTemporary: false
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Players</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? "Cancel" : "Add Player"}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Input
              placeholder="Name"
              value={newPlayer.name}
              onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            />
            <Input
              placeholder="Nickname (optional)"
              value={newPlayer.nickname}
              onChange={(e) => setNewPlayer({ ...newPlayer, nickname: e.target.value })}
            />
            <Input
              placeholder="Photo URL (optional)"
              value={newPlayer.photoUrl}
              onChange={(e) => setNewPlayer({ ...newPlayer, photoUrl: e.target.value })}
            />
            <Button 
              onClick={handleAddPlayer}
              disabled={!newPlayer.name.trim()}
              className="w-full"
            >
              Save Player
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players?.map((player) => (
          <Card 
            key={player.id}
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => onSelectPlayer(player)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={player.photoUrl || undefined} />
                <AvatarFallback>
                  {player.nickname?.[0] || player.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{player.name}</p>
                {player.nickname && (
                  <p className="text-sm text-muted-foreground">
                    {player.nickname}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
