import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { storage } from "./storage";
import { insertGameSchema, insertGameSessionSchema, insertScoreSchema } from "@shared/schema";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
const openai = new OpenAI({ 
  baseURL: endpoint,
  apiKey: token 
});

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

  // Card Analysis
  app.post("/api/analyze-cards", async (req, res) => {
    try {
      const { image, joker } = req.body;

      if (!image || !joker) {
        return res.status(400).json({ message: "Missing image or joker value" });
      }

      // Remove the data:image/jpeg;base64, prefix if present
      const base64Image = image.split(',')[1] || image;

      const response = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this playing card image. The cards shown are playing cards from a standard deck. Identify each card and calculate the total score. The joker card value is ${joker}. Return the result as JSON with format: {"cards": ["A♠", "K♥", etc], "total": number}`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        temperature: 0.7,
        top_p: 1.0,
        max_tokens: 1000,
        model: "gpt-4o-mini",
        response_format: { type: "json_object" }
      });

      // Parse and validate the response
      const result = JSON.parse(response.choices[0].message.content);
      if (!result.total || !Array.isArray(result.cards)) {
        throw new Error("Invalid AI response format");
      }

      res.json({ 
        score: result.total,
        cards: result.cards
      });

    } catch (error) {
      console.error("Card analysis error:", error);
      res.status(500).json({ 
        message: "Failed to analyze cards",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}