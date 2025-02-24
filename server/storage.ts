import { 
  type User, type InsertUser,
  type Game, type InsertGame,
  type GameSession, type InsertGameSession,
  type Score, type InsertScore,
  users, games, gameSessions, scores
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(userId: number, won: boolean): Promise<User>;
  getUserGameHistory(userId: number): Promise<any[]>;

  // Game operations
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;

  // Session operations
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  getGameSession(id: number): Promise<GameSession | undefined>;
  completeGameSession(id: number): Promise<GameSession>;

  // Score operations
  addScore(score: InsertScore): Promise<Score>;
  getSessionScores(sessionId: number): Promise<Score[]>;
  getPlayerScores(playerId: number): Promise<Score[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserStats(userId: number, won: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        gamesPlayed: (u) => (u.gamesPlayed || 0) + 1,
        gamesWon: (u) => won ? (u.gamesWon || 0) + 1 : u.gamesWon || 0,
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserGameHistory(userId: number): Promise<any[]> {
    const sessions = await db.query.gameSessions.findMany({
      with: {
        game: true,
        scores: {
          where: eq(scores.playerId, userId)
        }
      },
      orderBy: desc(gameSessions.startTime)
    });
    return sessions;
  }

  async getGames(): Promise<Game[]> {
    return db.select().from(games);
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }

  async createGame(game: InsertGame): Promise<Game> {
    const [newGame] = await db.insert(games).values(game).returning();
    return newGame;
  }

  async createGameSession(session: InsertGameSession): Promise<GameSession> {
    const [newSession] = await db
      .insert(gameSessions)
      .values({
        ...session,
        startTime: new Date(),
        isComplete: false
      })
      .returning();
    return newSession;
  }

  async getGameSession(id: number): Promise<GameSession | undefined> {
    const [session] = await db
      .select()
      .from(gameSessions)
      .where(eq(gameSessions.id, id));
    return session;
  }

  async completeGameSession(id: number): Promise<GameSession> {
    const [session] = await db
      .update(gameSessions)
      .set({
        endTime: new Date(),
        isComplete: true
      })
      .where(eq(gameSessions.id, id))
      .returning();
    return session;
  }

  async addScore(score: InsertScore): Promise<Score> {
    const [newScore] = await db.insert(scores).values(score).returning();
    return newScore;
  }

  async getSessionScores(sessionId: number): Promise<Score[]> {
    return db
      .select()
      .from(scores)
      .where(eq(scores.sessionId, sessionId));
  }

  async getPlayerScores(playerId: number): Promise<Score[]> {
    return db
      .select()
      .from(scores)
      .where(eq(scores.playerId, playerId));
  }
}

export const storage = new DatabaseStorage();