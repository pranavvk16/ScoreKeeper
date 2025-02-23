import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { PlusCircle, MinusCircle } from "lucide-react";

interface PlayerFormProps {
  minPlayers: number;
  maxPlayers: number;
  onStart: (players: string[]) => void;
}

export function PlayerForm({ minPlayers, maxPlayers, onStart }: PlayerFormProps) {
  const [players, setPlayers] = useState([{ name: "", id: 1 }]);

  const addPlayer = () => {
    if (players.length < maxPlayers) {
      setPlayers([...players, { name: "", id: players.length + 1 }]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > minPlayers) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const playerNames = players.map(p => p.name);
    if (playerNames.every(name => name.trim())) {
      onStart(playerNames);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player, index) => (
          <Card key={player.id} className="p-4 relative group">
            {players.length > minPlayers && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removePlayer(index)}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${player.name || `player${index}`}`} 
                />
                <AvatarFallback>{(player.name?.[0] || "P").toUpperCase()}</AvatarFallback>
              </Avatar>
              <Input
                placeholder={`Player ${index + 1} name`}
                value={player.name}
                onChange={(e) => updatePlayer(index, e.target.value)}
                className="flex-1"
              />
            </div>
          </Card>
        ))}

        {players.length < maxPlayers && (
          <Button
            type="button"
            variant="outline"
            className="h-[76px]"
            onClick={addPlayer}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Player
          </Button>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={players.some(p => !p.name.trim())}
      >
        Start Game
      </Button>
    </form>
  );
}