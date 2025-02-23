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

  async createGameSession(session: InsertGameSession): Promise<GameSession> {
    const id = this.currentIds.sessions++;
    const newSession: GameSession = { ...session, id };
    this.sessions.set(id, newSession);
    return newSession;
  }

  async getGameSession(id: number): Promise<GameSession | undefined> {
    return this.sessions.get(id);
  }

  async completeGameSession(id: number): Promise<GameSession> {
    const session = await this.getGameSession(id);
    if (!session) throw new Error("Session not found");
    
    const completedSession: GameSession = {
      ...session,
      endTime: new Date(),
      isComplete: true
    };
    this.sessions.set(id, completedSession);
    return completedSession;
  }

  async addScore(score: InsertScore): Promise<Score> {
    const id = this.currentIds.scores++;
    const newScore: Score = { ...score, id };
    this.scores.set(id, newScore);
    return newScore;
  }

  async getSessionScores(sessionId: number): Promise<Score[]> {
    return Array.from(this.scores.values()).filter(
      score => score.sessionId === sessionId
    );
  }

  async getPlayerScores(playerId: number): Promise<Score[]> {
    return Array.from(this.scores.values()).filter(
      score => score.playerId === playerId
    );
  }
}

export const storage = new MemStorage();
  async getUserGameHistory(userId: number) {
    const sessions = await db.query.gameSessions.findMany({
      with: {
        game: true,
        scores: {
          where: (scores, { eq }) => eq(scores.playerId, userId)
        }
      },
      orderBy: (sessions, { desc }) => [desc(sessions.startTime)]
    });
    return sessions;
  }
import { type GameCategory, type Game } from "@shared/schema";

const initialCategories: Omit<GameCategory, "id">[] = [
  {
    name: "Board Games",
    description: "Classic board games"
  },
  {
    name: "Card Games",
    description: "Traditional and modern card games"
  }
];

const initialGames: Omit<Game, "id">[] = [
  {
    name: "Monopoly",
    description: "Classic property trading game",
    categoryId: 1,
    minPlayers: 2,
    maxPlayers: 6,
    highestWins: true
  },
  {
    name: "Carrom",
    description: "Strike and pocket game",
    categoryId: 1,
    minPlayers: 2,
    maxPlayers: 4,
    highestWins: true
  },
  {
    name: "Rummy",
    description: "Card matching game",
    categoryId: 2,
    minPlayers: 2,
    maxPlayers: 6,
    highestWins: true
  }
];

export class MemStorage {
  private categories = new Map<number, GameCategory>();
  private games = new Map<number, Game>();
  private sessions = new Map<number, GameSession>();
  private players = new Map<number, SessionPlayer>();
  private scores = new Map<number, Score>();
  
  private currentIds = {
    categories: 1,
    games: 1,
    sessions: 1,
    players: 1,
    scores: 1
  };

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    initialCategories.forEach(category => {
      const id = this.currentIds.categories++;
      this.categories.set(id, { ...category, id });
    });

    initialGames.forEach(game => {
      const id = this.currentIds.games++;
      this.games.set(id, { ...game, id });
    });
  }

  async getCategories(): Promise<GameCategory[]> {
    return Array.from(this.categories.values());
  }

  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async createSession(gameId: number): Promise<GameSession> {
    const id = this.currentIds.sessions++;
    const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const session: GameSession = {
      id,
      gameId,
      sessionCode,
      startTime: new Date(),
      isComplete: false
    };
    
    this.sessions.set(id, session);
    return session;
  }

  async joinSession(sessionCode: string, playerName: string): Promise<SessionPlayer> {
    const session = Array.from(this.sessions.values())
      .find(s => s.sessionCode === sessionCode);
    
    if (!session) throw new Error("Session not found");
    
    const id = this.currentIds.players++;
    const player: SessionPlayer = {
      id,
      sessionId: session.id,
      playerName,
      joinTime: new Date()
    };
    
    this.players.set(id, player);
    return player;
  }
}
