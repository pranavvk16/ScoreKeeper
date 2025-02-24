import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  gamesPlayed: integer("games_played").default(0),
  gamesWon: integer("games_won").default(0),
  achievements: jsonb("achievements").default([]).notNull(),
  stats: jsonb("stats").default({}).notNull(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  maxPlayers: integer("max_players").notNull(),
  minPlayers: integer("min_players").notNull(),
  highestWins: boolean("highest_wins").notNull(),
  isCustom: boolean("is_custom").default(false),
  roundBased: boolean("round_based").default(true).notNull(),
  achievements: jsonb("achievements").default([]).notNull(),
});

export const gameSessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull().references(() => games.id),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  isComplete: boolean("is_complete").default(false),
  performance: jsonb("performance").default({}).notNull(),
});

export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => gameSessions.id),
  playerId: integer("player_id").notNull().references(() => users.id),
  score: integer("score").notNull(),
  round: integer("round").notNull(),
  roundStats: jsonb("round_stats").default({}).notNull(),
});

// Define relations
export const gamesRelations = relations(games, ({ many }) => ({
  sessions: many(gameSessions),
}));

export const gameSessionsRelations = relations(gameSessions, ({ one, many }) => ({
  game: one(games, {
    fields: [gameSessions.gameId],
    references: [games.id],
  }),
  scores: many(scores),
}));

export const scoresRelations = relations(scores, ({ one }) => ({
  session: one(gameSessions, {
    fields: [scores.sessionId],
    references: [gameSessions.id],
  }),
  player: one(users, {
    fields: [scores.playerId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameSchema = createInsertSchema(games);
export const insertGameSessionSchema = createInsertSchema(gameSessions).pick({
  gameId: true,
});
export const insertScoreSchema = createInsertSchema(scores);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type InsertScore = z.infer<typeof insertScoreSchema>;

export type User = typeof users.$inferSelect;
export type Game = typeof games.$inferSelect;
export type GameSession = typeof gameSessions.$inferSelect;
export type Score = typeof scores.$inferSelect;