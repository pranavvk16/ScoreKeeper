
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
  const { data: games, isLoading } = useQuery<Game[]>({ 
    queryKey: ['/api/games']
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-900 dark:text-indigo-100">
          Choose Your Game
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games?.map((game) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <GameCard3D
                game={game}
                onViewInfo={() => setSelectedGame(game)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <GameInfoModal
        game={selectedGame}
        isOpen={!!selectedGame}
        onClose={() => setSelectedGame(null)}
      />
    </div>
  );
}
