import { useState } from "react";
import { Card, CardContent, CardHeader, IconButton, Button, TextField, Typography, Box, Paper, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Alert, LinearProgress } from "@mui/material";
import { EmojiEvents, ChevronLeft, ChevronRight, Star, EmojiEventsOutlined, Add, VisibilityOff, Visibility } from "@mui/icons-material";
import { type Game } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Player {
  id: number;
  name: string;
  scores: number[];
  total: number;
}

interface ScoreBoardProps {
  game: Game;
  players: Player[];
  onScoreSubmit: (scores: { playerId: number; score: number }[]) => void;
  onEndGame: () => void;
  onResetGame?: () => void;
}

const roundScoreSchema = z.object({
  scores: z.array(z.object({
    playerId: z.number(),
    score: z.string().refine(val => !isNaN(Number(val)) && val.trim() !== '', {
      message: "Score is required and must be a number"
    })
  }))
});

type RoundScoreForm = z.infer<typeof roundScoreSchema>;

export function ScoreBoard({ game, players, onScoreSubmit, onEndGame, onResetGame }: ScoreBoardProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [scoreLimit, setScoreLimit] = useState<number | null>(null);
  const [showRunningTotal, setShowRunningTotal] = useState(true);
  const [showScoreLimitDialog, setShowScoreLimitDialog] = useState(true);
  const [showEndGamePrompt, setShowEndGamePrompt] = useState(false);
  const [notification, setNotification] = useState('');

  const form = useForm<RoundScoreForm>({
    resolver: zodResolver(roundScoreSchema),
    defaultValues: {
      scores: players.map(player => ({
        playerId: player.id,
        score: ''
      }))
    }
  });

  const sortedPlayers = [...players].sort((a, b) =>
    game.highestWins ? b.total - a.total : a.total - b.total
  );

  const handleScoreLimitSubmit = (limit: number) => {
    setScoreLimit(limit);
    setShowScoreLimitDialog(false);
  };

  const handleRoundSubmit = (data: RoundScoreForm) => {
    const roundScores = data.scores.map(score => ({
      playerId: score.playerId,
      score: Number(score.score)
    }));

    onScoreSubmit(roundScores);
    setCurrentRound(prev => prev + 1);
    form.reset({
      scores: players.map(player => ({
        playerId: player.id,
        score: ''
      }))
    });

    setNotification(`Round ${currentRound + 1} Complete!`);
    setTimeout(() => setNotification(''), 2000);

    if (scoreLimit) {
      const playerOverLimit = players.find(p => p.total >= scoreLimit);
      if (playerOverLimit) {
        setShowEndGamePrompt(true);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 'xl', mx: 'auto', p: 2 }}>
      <Dialog open={showScoreLimitDialog} onClose={() => setShowScoreLimitDialog(false)}>
        <DialogTitle>Set Score Limit (Optional)</DialogTitle>
        <DialogContent>
          <TextField
            type="number"
            label="Score Limit"
            fullWidth
            margin="normal"
            onChange={(e) => handleScoreLimitSubmit(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowScoreLimitDialog(false)}>Skip</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEndGamePrompt} onClose={() => setShowEndGamePrompt(false)}>
        <DialogTitle>Score Limit Reached</DialogTitle>
        <DialogContent>
          <Typography>A player has reached the score limit. Would you like to end the game?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEndGamePrompt(false)}>Continue Playing</Button>
          <Button variant="contained" onClick={onEndGame} color="primary">End Game</Button>
        </DialogActions>
      </Dialog>

      <Card elevation={2}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmojiEvents color="primary" />
                <Typography variant="h6">Round {currentRound + 1}</Typography>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={showRunningTotal ? <VisibilityOff /> : <Visibility />}
                  onClick={() => setShowRunningTotal(!showRunningTotal)}
                >
                  {showRunningTotal ? "Hide Total" : "Show Total"}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={onEndGame}
                >
                  End Game
                </Button>
              </Stack>
            </Box>
          }
        />

        <CardContent>
          <form onSubmit={form.handleSubmit(handleRoundSubmit)}>
            <Stack spacing={2}>
              {sortedPlayers.map((player, index) => (
                <Paper
                  key={player.id}
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor: index === 0 ? 'warning.light' :
                             index === 1 ? 'grey.100' :
                             index === 2 ? 'warning.100' : 'background.default'
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'start', sm: 'center' }, gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 1 }}>
                      <Box sx={{ width: 40, display: 'flex', justifyContent: 'center' }}>
                        {index === 0 ? <EmojiEvents sx={{ color: 'warning.dark' }} /> :
                         index === 1 ? <Star sx={{ color: 'grey.500' }} /> :
                         index === 2 ? <EmojiEventsOutlined sx={{ color: 'warning.main' }} /> :
                         <Typography variant="body1" fontWeight="bold">{index + 1}</Typography>}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1">{player.name}</Typography>
                        {showRunningTotal && (
                          <Typography variant="caption" color="text.secondary">
                            Total: {player.total}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <TextField
                      {...form.register(`scores.${index}.score`)}
                      type="number"
                      label="Score"
                      size="small"
                      error={!!form.formState.errors.scores?.[index]?.score}
                      helperText={form.formState.errors.scores?.[index]?.score?.message}
                      sx={{ width: { xs: '100%', sm: 120 } }}
                    />
                  </Box>
                </Paper>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                <Button type="submit" variant="contained" size="large">
                  Conclude Round
                </Button>
              </Box>
            </Stack>
          </form>

          {notification && (
            <Alert
              severity="success"
              sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1500,
              }}
            >
              {notification}
            </Alert>
          )}
        </CardContent>

        <Box sx={{ borderTop: 1, borderColor: 'divider', p: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' }, gap: 1 }}>
            <Typography variant="body2" color="text.secondary">Round: {currentRound + 1}</Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {scoreLimit ? `Score Limit: ${scoreLimit}` : 'No Score Limit'}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="right">
              {game.highestWins ? "Highest Wins" : "Lowest Wins"}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}