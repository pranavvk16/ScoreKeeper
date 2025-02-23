
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GameCard3D } from '@/components/GameCard3D';
import { GameInfoModal } from '@/components/GameInfoModal';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { Game } from '@shared/schema';

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const { data: games } = useQuery<Game[]>({ queryKey: ['/api/games'] });

  return (
    <div className="container mx-auto px-4 pt-20 relative min-h-screen">
      <Canvas className="fixed inset-0 -z-10">
        <Stars radius={100} depth={50} count={5000} factor={4} />
      </Canvas>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-4xl font-bold text-center mb-8">Choose Your Game</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games?.map((game) => (
            <GameCard3D
              key={game.id}
              game={game}
              onViewInfo={() => setSelectedGame(game)}
            />
          ))}
        </div>
      </motion.div>

      {selectedGame && (
        <GameInfoModal
          game={selectedGame}
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
}
