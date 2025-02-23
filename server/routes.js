
const { createServer } = require('http');
const { storage } = require('./storage');
const { insertGameSchema, insertGameSessionSchema, insertScoreSchema } = require('../shared/schema');

async function registerRoutes(app) {
  app.get("/api/games", async (_req, res) => {
    const games = await storage.getGames();
    res.json(games);
  });

  app.get("/api/games/:id", async (req, res) => {
    const game = await storage.getGame(Number(req.params.id));
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game);
  });

  app.post("/api/games", async (req, res) => {
    const parsed = insertGameSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid game data" });
    }
    const game = await storage.createGame(parsed.data);
    res.status(201).json(game);
  });

  app.post("/api/sessions", async (req, res) => {
    const parsed = insertGameSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid session data" });
    }
    const session = await storage.createGameSession(parsed.data);
    res.status(201).json(session);
  });

  app.get("/api/sessions/:id", async (req, res) => {
    const session = await storage.getGameSession(Number(req.params.id));
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  });

  app.post("/api/sessions/:id/complete", async (req, res) => {
    try {
      const session = await storage.completeGameSession(Number(req.params.id));
      res.json(session);
    } catch (error) {
      res.status(404).json({ message: "Session not found" });
    }
  });

  app.post("/api/scores", async (req, res) => {
    const parsed = insertScoreSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid score data" });
    }
    const score = await storage.addScore(parsed.data);
    res.status(201).json(score);
  });

  app.get("/api/sessions/:id/scores", async (req, res) => {
    const scores = await storage.getSessionScores(Number(req.params.id));
    res.json(scores);
  });

  app.get("/api/players/:id/scores", async (req, res) => {
    const scores = await storage.getPlayerScores(Number(req.params.id));
    res.json(scores);
  });

  const httpServer = createServer(app);
  return httpServer;
}

module.exports = { registerRoutes };
