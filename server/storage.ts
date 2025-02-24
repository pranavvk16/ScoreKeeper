import { 
  type User, type InsertUser,
  type Game, type InsertGame,
  type GameSession, type InsertGameSession,
  type Score, type InsertScore,
  users, games, gameSessions, scores
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

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
        gamesPlayed: (u: any) => (u.gamesPlayed || 0) + 1,
        gamesWon: (u: any) => won ? (u.gamesWon || 0) + 1 : u.gamesWon || 0,
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
    // Only return round-based games
    return db.select()
      .from(games)
      .where(eq(games.roundBased, true));
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db.select()
      .from(games)
      .where(and(
        eq(games.id, id),
        eq(games.roundBased, true)
      ));
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
        isComplete: false,
        performance: {
          roundScores: [],
          trends: [],
          milestones: []
        }
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
    const session = await this.getGameSession(id);
    const scores = await this.getSessionScores(id);

    // Calculate performance metrics
    const performance = {
      roundScores: scores.map(s => ({ round: s.round, score: s.score })),
      trends: this.calculateTrends(scores),
      milestones: this.calculateMilestones(scores)
    };

    const [updatedSession] = await db
      .update(gameSessions)
      .set({
        endTime: new Date(),
        isComplete: true,
        performance
      })
      .where(eq(gameSessions.id, id))
      .returning();
    return updatedSession;
  }

  private calculateTrends(scores: Score[]) {
    const roundScores = scores.sort((a, b) => a.round - b.round);
    const trends = [];

    for (let i = 1; i < roundScores.length; i++) {
      const trend = {
        round: roundScores[i].round,
        change: roundScores[i].score - roundScores[i-1].score,
        percentage: ((roundScores[i].score - roundScores[i-1].score) / roundScores[i-1].score) * 100
      };
      trends.push(trend);
    }

    return trends;
  }

  private calculateMilestones(scores: Score[]) {
    const milestones = [];
    const maxScore = Math.max(...scores.map(s => s.score));
    const averageScore = scores.reduce((acc, s) => acc + s.score, 0) / scores.length;

    if (maxScore > averageScore * 1.5) {
      milestones.push({ type: 'exceptional_round', score: maxScore });
    }

    // Add more milestone calculations as needed
    return milestones;
  }

  async addScore(score: InsertScore): Promise<Score> {
    const [newScore] = await db.insert(scores)
      .values({
        ...score,
        roundStats: {
          timeSpent: 0, // You can add actual time tracking
          attempts: 1,
          bonuses: []
        }
      })
      .returning();
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