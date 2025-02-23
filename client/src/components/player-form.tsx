import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface PlayerFormProps {
  minPlayers: number;
  maxPlayers: number;
  onStart: (players: string[]) => void;
}

export function PlayerForm({ minPlayers, maxPlayers, onStart }: PlayerFormProps) {
  const [players, setPlayers] = useState<string[]>([""]);
  const { toast } = useToast();

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
    if (validPlayers.length < minPlayers) {
      toast({
        title: "Not enough players",
        description: `At least ${minPlayers} players are required.`,
        variant: "destructive"
      });
      return;
    }
    if (new Set(validPlayers).size !== validPlayers.length) {
      toast({
        title: "Duplicate names",
        description: "Each player must have a unique name.",
        variant: "destructive"
      });
      return;
    }
    onStart(validPlayers);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Add Players
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence initial={false}>
          {players.map((player, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex space-x-2"
            >
              <Input
                placeholder={`Player ${index + 1}`}
                value={player}
                onChange={(e) => updatePlayer(index, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removePlayer(index)}
                disabled={players.length <= 1}
                className="shrink-0"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
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
          className="bg-primary hover:bg-primary/90"
        >
          Start Game
        </Button>
      </CardFooter>
    </Card>
  );
}