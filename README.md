# Game Score Tracker

A comprehensive multiplayer game tracking platform focused on round-based games like Darts and Carrom. Keep track of scores, view statistics, and manage game sessions with ease.

## Features

- 🎮 Support for multiple classic games (Poker, UNO, Scrabble, etc.)
- 📊 Real-time score tracking and statistics
- 🏆 Interactive game sessions with live updates
- 📱 Mobile-responsive design
- 📚 Comprehensive game guides and tutorials
- 🎯 Custom scoring systems for each game
- 📈 Player performance tracking

## Tech Stack

- **Frontend**: React + TypeScript
- **UI Components**: Shadcn UI
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Animations**: Framer Motion
- **Backend**: Express.js
- **Storage**: In-memory (MemStorage)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 8 or higher

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Usage Guide

### Starting a Game

1. Select a game from the home page
2. Enter player names
3. Start tracking scores
4. View real-time updates and statistics

### Viewing Game History

1. Navigate to the Profile page
2. View past games and scores
3. Check performance statistics

### Learning Games

1. Click the info icon on any game card
2. Access tutorials and resources
3. Watch recommended videos
4. Read game rules and strategies

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and helpers
│   │   └── hooks/         # Custom React hooks
├── server/
│   ├── storage.ts         # Data storage implementation
│   └── routes.ts          # API routes
└── shared/
    └── schema.ts          # Shared type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Testing

Run the test suite:

```bash
npm test
```

## License

MIT License
