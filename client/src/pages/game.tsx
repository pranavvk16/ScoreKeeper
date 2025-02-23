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
  const [, params] = useRoute("/game/:type/:id");
  const isSession = params?.type === "session";
  const id = params?.id || "";
  const gameId = isSession ? undefined : Number(id);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [gameSession, setGameSession] = useState<GameSession>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [showGameOver, setShowGameOver] = useState(false);

  const { data: session } = useQuery({
    queryKey: [`/api/sessions/${id}`],
    enabled: isSession
  });

  const { data: game, isLoading } = useQuery<Game>({ 
    queryKey: [`/api/games/${isSession ? session?.gameId : gameId}`],
    enabled: !isSession || !!session
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
            <PlayerForm
              minPlayers={game.minPlayers}
              maxPlayers={game.maxPlayers}
              onStart={(players) => createSessionMutation.mutate(players)}
            />
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