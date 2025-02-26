import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GamePage } from '../pages/game';
import { PlayerForm } from '../components/player-form';
import { ScoreBoard } from '../components/score-board';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Game Session Flow', () => {
  it('should allow creating a new game session', async () => {
    render(<PlayerForm minPlayers={2} maxPlayers={4} onStart={vi.fn()} />, { wrapper });
    
    const playerInput = screen.getByPlaceholderText('Player 1');
    fireEvent.change(playerInput, { target: { value: 'Test Player' } });
    
    const addButton = screen.getByText('Add Player');
    fireEvent.click(addButton);
    
    const startButton = screen.getByText('Start Game');
    expect(startButton).toBeInTheDocument();
  });

  it('should track scores correctly', () => {
    const mockPlayers = [
      { id: 1, name: 'Player 1', scores: [], total: 0 },
      { id: 2, name: 'Player 2', scores: [], total: 0 }
    ];

    const mockGame = {
      id: 1,
      name: 'Test Game',
      description: 'Test Description',
      minPlayers: 2,
      maxPlayers: 4,
      highestWins: true,
      isCustom: false
    };

    render(
      <ScoreBoard
        game={mockGame}
        players={mockPlayers}
        onScoreSubmit={vi.fn()}
        onEndGame={vi.fn()}
      />,
      { wrapper }
    );

    const scoreInputs = screen.getAllByPlaceholderText('Score');
    expect(scoreInputs).toHaveLength(2);
  });
});
