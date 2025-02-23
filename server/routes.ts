import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema, insertGameSessionSchema, insertScoreSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Games
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

  // Game Sessions
  app.post("/api/sessions", async (req, res) => {
    const parsed = insertGameSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid session data" });
    }
    const game = await storage.getGame(parsed.data.gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    const session = await storage.createGameSession({
      ...parsed.data,
      maxPlayers: game.maxPlayers,
      currentPlayers: 1,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
    res.status(201).json(session);
  });

  app.post("/api/sessions/:id/join", async (req, res) => {
    const session = await storage.getGameSession(Number(req.params.id));
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    if (session.isComplete) {
      return res.status(400).json({ message: "Game already completed" });
    }
    if (session.currentPlayers >= session.maxPlayers) {
      return res.status(400).json({ message: "Game is full" });
    }
    if (new Date(session.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Session expired" });
    }
    
    const updatedSession = await storage.updateSessionPlayers(Number(req.params.id), session.currentPlayers + 1);
    res.json(updatedSession);
  });

  app.get("/api/sessions/:id", async (req, res) => {
    const session = await storage.getGameSession(Number(req.params.id));
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  });


  app.get("/api/users/:id/history", async (req, res) => {
    const history = await storage.getUserGameHistory(Number(req.params.id));
    res.json(history);
  });


  app.post("/api/sessions/:id/complete", async (req, res) => {
    try {
      const session = await storage.completeGameSession(Number(req.params.id));
      res.json(session);
    } catch (error) {
      res.status(404).json({ message: "Session not found" });
    }
  });

  // Scores
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
