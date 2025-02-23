import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";

interface PlayerFormProps {
  minPlayers: number;
  maxPlayers: number;
  onStart: (players: string[]) => void;
}

export function PlayerForm({ minPlayers, maxPlayers, onStart }: PlayerFormProps) {
  const [players, setPlayers] = useState<string[]>([""]);

  const addPlayer = () => {
    if (players.length < maxPlayers) {
      setPlayers([...players, ""]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 1) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const handleStart = () => {
    const validPlayers = players.filter(name => name.trim() !== "");
    if (validPlayers.length >= minPlayers && validPlayers.length <= maxPlayers) {
      onStart(validPlayers);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add Players</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {players.map((player, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              placeholder={`Player ${index + 1}`}
              value={player}
              onChange={(e) => updatePlayer(index, e.target.value)}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => removePlayer(index)}
              disabled={players.length <= 1}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={addPlayer}
          disabled={players.length >= maxPlayers}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Player
        </Button>
        <Button 
          onClick={handleStart}
          disabled={players.filter(p => p.trim()).length < minPlayers}
        >
          Start Game
        </Button>
      </CardFooter>
    </Card>
  );
}
