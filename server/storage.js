
class MemStorage {
  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.sessions = new Map();
    this.scores = new Map();
    this.currentIds = { users: 1, games: 1, sessions: 1, scores: 1 };
    this.initializeDefaultGames();
  }

  initializeDefaultGames() {
    const defaultGames = [
      {
        name: "Poker",
        description: "Texas Hold'em poker scoring",
        maxPlayers: 10,
        minPlayers: 2,
        highestWins: true,
        isCustom: false
      },
      // Add other default games here...
    ];

    defaultGames.forEach(game => this.createGame(game));
  }

  async getUser(id) {
    return this.users.get(id);
  }

  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser) {
    const id = this.currentIds.users++;
    const user = { 
      ...insertUser, 
      id,
      gamesPlayed: 0,
      gamesWon: 0
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStats(userId, won) {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = {
      ...user,
      gamesPlayed: user.gamesPlayed + 1,
      gamesWon: user.gamesWon + (won ? 1 : 0)
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getGames() {
    return Array.from(this.games.values());
  }

  async getGame(id) {
    return this.games.get(id);
  }

  async createGame(game) {
    const id = this.currentIds.games++;
    const newGame = { ...game, id };
    this.games.set(id, newGame);
    return newGame;
  }

  async createGameSession(session) {
    const id = this.currentIds.sessions++;
    const newSession = { ...session, id };
    this.sessions.set(id, newSession);
    return newSession;
  }

  async getGameSession(id) {
    return this.sessions.get(id);
  }

  async completeGameSession(id) {
    const session = await this.getGameSession(id);
    if (!session) throw new Error("Session not found");
    
    const completedSession = {
      ...session,
      endTime: new Date(),
      isComplete: true
    };
    this.sessions.set(id, completedSession);
    return completedSession;
  }

  async addScore(score) {
    const id = this.currentIds.scores++;
    const newScore = { ...score, id };
    this.scores.set(id, newScore);
    return newScore;
  }

  async getSessionScores(sessionId) {
    return Array.from(this.scores.values()).filter(
      score => score.sessionId === sessionId
    );
  }

  async getPlayerScores(playerId) {
    return Array.from(this.scores.values()).filter(
      score => score.playerId === playerId
    );
  }
}

const storage = new MemStorage();
module.exports = { storage };
