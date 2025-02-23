import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { type Game, type GameSession, type Score } from "@shared/schema";
import { PlayerForm } from "@/components/player-form";
import { ScoreBoard } from "@/components/score-board";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getGameRules } from "@/lib/games";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { GameOver } from "@/components/game-over";

interface Player {
  id: number;
  name: string;
  scores: number[];
  total: number;
}

export default function GamePage() {
  const [, params] = useRoute("/game/:id");
  const [, setLocation] = useLocation();
  const gameId = Number(params?.id);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [gameSession, setGameSession] = useState<GameSession>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [showGameOver, setShowGameOver] = useState(false);

  const { data: game, isLoading } = useQuery<Game>({ 
    queryKey: [`/api/games/${gameId}`]
  });

  const createSessionMutation = useMutation({
    mutationFn: async (playerNames: string[]) => {
      const response = await apiRequest("POST", "/api/sessions", {
        gameId
      });
      return response.json();
    },
    onSuccess: (sessionData, playerNames) => {
      setGameSession(sessionData);
      setPlayers(playerNames.map((name, index) => ({
        id: index + 1,
        name,
        scores: [],
        total: 0
      })));
      toast({
        title: "Game started!",
        description: "You can now start adding scores.",
      });
    }
  });

  const addScoreMutation = useMutation({
    mutationFn: async ({ playerId, score }: { playerId: number; score: number }) => {
      if (!gameSession) throw new Error("No active session");
      return apiRequest("POST", "/api/scores", {
        sessionId: gameSession.id,
        playerId,
        score,
        round: players.find(p => p.id === playerId)?.scores.length || 0
      });
    },
    onSuccess: (_, { playerId, score }) => {
      setPlayers(current => 
        current.map(player => {
          if (player.id === playerId) {
            const newScores = [...player.scores, score];
            return {
              ...player,
              scores: newScores,
              total: newScores.reduce((a, b) => a + b, 0)
            };
          }
          return player;
        })
      );
      toast({
        title: "Score added",
        description: "The score has been recorded successfully.",
      });
    }
  });

  const endGameMutation = useMutation({
    mutationFn: async () => {
      if (!gameSession) throw new Error("No active session");
      await apiRequest("POST", `/api/sessions/${gameSession.id}/complete`);
    },
    onSuccess: () => {
      setShowGameOver(true);
      toast({
        title: "Game completed!",
        description: "Check out the final scores!",
      });
    }
  });

  const handlePlayAgain = () => {
    setGameSession(undefined);
    setPlayers([]);
    setShowGameOver(false);
  };

  if (isLoading || !game) {
    return (
      <div className="container mx-auto px-4 pt-20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const rules = getGameRules(game);

  return (
    <div className="container mx-auto px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{game.name}</CardTitle>
            <CardDescription>{rules.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Scoring:</strong> {rules.scoringInfo}</p>
              <p><strong>Win Condition:</strong> {rules.winCondition}</p>
              <p><strong>Players:</strong> {game.minPlayers}-{game.maxPlayers} players</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence mode="wait">
        {!gameSession ? (
          <motion.div
            key="player-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PlayerManager
              gameId={game.id}
              onSelectPlayer={(player) => {
                const selectedPlayers = players || [];
                if (selectedPlayers.length < game.maxPlayers) {
                  setPlayers([...selectedPlayers, player]);
                }
              }}
            />
            {players && players.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Selected Players ({players.length}/{game.maxPlayers})</h3>
                <div className="flex gap-2 flex-wrap">
                  {players.map((player) => (
                    <div key={player.id} className="flex items-center gap-2 bg-accent p-2 rounded">
                      {player.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => setPlayers(players.filter(p => p.id !== player.id))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  className="mt-4 w-full"
                  disabled={players.length < game.minPlayers}
                  onClick={() => createSessionMutation.mutate(players)}
                >
                  Start Game
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="score-board"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ScoreBoard
              game={game}
              players={players}
              onScoreSubmit={(playerId, score) => 
                addScoreMutation.mutate({ playerId, score })}
              onEndGame={() => endGameMutation.mutate()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showGameOver && game && (
        <GameOver 
          game={game}
          players={players}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}