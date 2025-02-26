import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameInfo } from '../components/game-info';

describe('Game Info Component', () => {
  const mockGame = {
    id: 1,
    name: 'Poker',
    description: 'Texas Hold\'em poker scoring',
    minPlayers: 2,
    maxPlayers: 10,
    highestWins: true,
    isCustom: false
  };

  it('should display game information', () => {
    render(<GameInfo game={mockGame} />);
    const infoButton = screen.getByRole('button');
    fireEvent.click(infoButton);
    
    expect(screen.getByText('Poker - Game Information')).toBeInTheDocument();
    expect(screen.getByText('Texas Hold\'em poker scoring')).toBeInTheDocument();
  });

  it('should show tutorials and resources', () => {
    render(<GameInfo game={mockGame} />);
    const infoButton = screen.getByRole('button');
    fireEvent.click(infoButton);

    const tutorialsTab = screen.getByText('Tutorials');
    fireEvent.click(tutorialsTab);
    
    expect(screen.getByText('Written Tutorials')).toBeInTheDocument();
    expect(screen.getByText('Video Tutorials')).toBeInTheDocument();
  });
});
