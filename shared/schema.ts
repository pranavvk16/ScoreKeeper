
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameCategories = pgTable("game_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull(),
  maxPlayers: integer("max_players").notNull(),
  minPlayers: integer("min_players").notNull(),
  highestWins: boolean("highest_wins").notNull(),
});

export const gameSessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull(),
  sessionCode: text("session_code").notNull().unique(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  isComplete: boolean("is_complete").default(false),
});

export const sessionPlayers = pgTable("session_players", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  playerName: text("player_name").notNull(),
  joinTime: timestamp("join_time").defaultNow().notNull(),
});

export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  playerId: integer("player_id").notNull(),
  score: integer("score").notNull(),
  round: integer("round").notNull(),
});

export const insertGameCategorySchema = createInsertSchema(gameCategories);
export const insertGameSchema = createInsertSchema(games);
export const insertGameSessionSchema = createInsertSchema(gameSessions);
export const insertSessionPlayerSchema = createInsertSchema(sessionPlayers);
export const insertScoreSchema = createInsertSchema(scores);

export type GameCategory = typeof gameCategories.$inferSelect;
export type Game = typeof games.$inferSelect;
export type GameSession = typeof gameSessions.$inferSelect;
export type SessionPlayer = typeof sessionPlayers.$inferSelect;
export type Score = typeof scores.$inferSelect;
