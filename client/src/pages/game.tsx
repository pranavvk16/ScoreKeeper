import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type Game, type GameSession, type Score } from "@shared/schema";
import { PlayerForm } from "@/components/player-form";
import { ScoreBoard } from "@/components/score-board";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getGameRules } from "@/lib/games";
import { apiRequest } from "@/lib/queryClient";

interface Player {
  id: number;
  name: string;
  scores: number[];
  total: number;
}

export default function GamePage() {
  const [, params] = useRoute("/game/:id");
  const gameId = Number(params?.id);

  const [gameSession, setGameSession] = useState<GameSession>();
  const [players, setPlayers] = useState<Player[]>([]);

  const { data: game, isLoading } = useQuery<Game>({ 
    queryKey: [`/api/games/${gameId}`]
  });

  const startSession = async (playerNames: string[]) => {
    const session = await apiRequest("POST", "/api/sessions", {
      gameId,
      startTime: new Date().toISOString(),
      endTime: null,
      isComplete: false
    });
    const sessionData = await session.json();
    setGameSession(sessionData);
    setPlayers(playerNames.map((name, index) => ({
      id: index + 1,
      name,
      scores: [],
      total: 0
    })));
  };

  const addScore = async (playerId: number, score: number) => {
    if (!gameSession) return;

    await apiRequest("POST", "/api/scores", {
      sessionId: gameSession.id,
      playerId,
      score,
      round: players.find(p => p.id === playerId)?.scores.length || 0
    });

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
  };

  const endGame = async () => {
    if (!gameSession) return;
    await apiRequest("POST", `/api/sessions/${gameSession.id}/complete`);
    // Reset game state or redirect
    window.location.href = "/";
  };

  if (isLoading || !game) {
    return <div>Loading...</div>;
  }

  const rules = getGameRules(game);

  return (
    <div className="container mx-auto px-4 pt-20">
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

      {!gameSession ? (
        <PlayerForm
          minPlayers={game.minPlayers}
          maxPlayers={game.maxPlayers}
          onStart={startSession}
        />
      ) : (
        <ScoreBoard
          game={game}
          players={players}
          onScoreSubmit={addScore}
          onEndGame={endGame}
        />
      )}
    </div>
  );
}