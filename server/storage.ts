import { 
  type User, type InsertUser,
  type Game, type InsertGame,
  type GameSession, type InsertGameSession,
  type Score, type InsertScore
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(userId: number, won: boolean): Promise<User>;

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private sessions: Map<number, GameSession>;
  private scores: Map<number, Score>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.sessions = new Map();
    this.scores = new Map();
    this.currentIds = { users: 1, games: 1, sessions: 1, scores: 1 };

    // Add default games
    this.initializeDefaultGames();
  }

  private initializeDefaultGames() {
    const defaultGames: InsertGame[] = [
      {
        name: "Poker",
        description: "Texas Hold'em poker scoring",
        maxPlayers: 10,
        minPlayers: 2,
        highestWins: true,
        isCustom: false
      },
      {
        name: "UNO",
        description: "Classic UNO card game",
        maxPlayers: 10,
        minPlayers: 2,
        highestWins: false,
        isCustom: false
      },
      {
        name: "Scrabble",
        description: "Word building board game",
        maxPlayers: 4,
        minPlayers: 2,
        highestWins: true,
        isCustom: false
      },
      {
        name: "Yahtzee",
        description: "Dice rolling and scoring game",
        maxPlayers: 8,
        minPlayers: 1,
        highestWins: true,
        isCustom: false
      },
      {
        name: "Hearts",
        description: "Classic Hearts card game",
        maxPlayers: 4,
        minPlayers: 3,
        highestWins: false,
        isCustom: false
      },
      {
        name: "Rummy",
        description: "Card matching and set collection",
        maxPlayers: 6,
        minPlayers: 2,
        highestWins: true,
        isCustom: false
      },
      {
        name: "Bowling",
        description: "Ten-pin bowling scoring",
        maxPlayers: 8,
        minPlayers: 1,
        highestWins: true,
        isCustom: false
      },
      {
        name: "Darts",
        description: "Classic darts scoring",
        maxPlayers: 8,
        minPlayers: 1,
        highestWins: true,
        isCustom: false
      },
      {
        name: "Bridge",
        description: "Contract bridge scoring",
        maxPlayers: 4,
        minPlayers: 4,
        highestWins: true,
        isCustom: false
      },
      {
        name: "Golf",
        description: "Golf card game scoring",
        maxPlayers: 8,
        minPlayers: 2,
        highestWins: false,
        isCustom: false
      }
    ];

    defaultGames.forEach(game => this.createGame(game));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { 
      ...insertUser, 
      id,
      gamesPlayed: 0,
      gamesWon: 0
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStats(userId: number, won: boolean): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const updatedUser: User = {
      ...user,
      gamesPlayed: user.gamesPlayed + 1,
      gamesWon: user.gamesWon + (won ? 1 : 0)
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async createGame(game: InsertGame): Promise<Game> {
    const id = this.currentIds.games++;
    const newGame: Game = { ...game, id };
    this.games.set(id, newGame);
    return newGame;
  }

  async getUserGameHistory(userId: number) {
    return db.query.gameSessions.findMany({
      with: {
        game: true,
        scores: {
          where: (scores, helpers) => helpers.eq(scores.playerId, userId)
        }
      },
      orderBy: (sessions, helpers) => [helpers.desc(sessions.startTime)]
    });
  }
}

export const storage = new MemStorage();
