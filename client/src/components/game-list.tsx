import { type Game } from "@shared/schema";
import { Card, CardContent, CardHeader, Typography, Box, Chip, Button, Grid, IconButton } from "@mui/material";
import { EmojiEvents, Group, Star, AccessTime } from "@mui/icons-material";
import { Link } from "wouter";
import { GameInfo } from "./game-info";

interface GameListProps {
  games: Game[];
}

export function GameList({ games }: GameListProps) {
  return (
    <Grid container spacing={3}>
      {games.map((game) => (
        <Grid item xs={12} sm={6} md={4} key={game.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
                  <Typography variant="h6" component="div">
                    {game.name}
                  </Typography>
                  {game.isCustom && (
                    <Chip
                      label="Custom"
                      size="small"
                      color="secondary"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
              }
              action={
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <GameInfo game={game} />
                </Box>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  {game.description}
                </Typography>
              }
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Group fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {game.minPlayers}-{game.maxPlayers} players
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiEvents fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {game.highestWins ? "Highest wins" : "Lowest wins"}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Difficulty: Medium
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      ~30 mins
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Link href={`/game/${game.id}`}>
                <Button variant="contained" fullWidth>
                  Start Game
                </Button>
              </Link>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}