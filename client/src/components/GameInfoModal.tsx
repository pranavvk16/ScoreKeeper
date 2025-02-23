
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Game } from '@shared/schema';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';

const gameResources = {
  'Poker': {
    rules: [
      'Each player is dealt 2 cards face down',
      'Five community cards are dealt face up',
      'Players make best 5-card hand using any combination',
      'Multiple betting rounds occur during play'
    ],
    strategy: [
      'Position is crucial - play tighter in early position',
      'Pay attention to pot odds and implied odds',
      'Observe opponent tendencies and patterns',
      'Manage your bankroll effectively'
    ],
    videos: [
      'Basic Poker Rules - https://replit.com/@games/poker-tutorial',
      'Advanced Strategy - https://replit.com/@games/poker-pro-tips'
    ]
  }
  // Add resources for other games here
};

interface GameInfoModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
}

export function GameInfoModal({ game, isOpen, onClose }: GameInfoModalProps) {
  const resources = gameResources[game.name as keyof typeof gameResources];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <Canvas className="absolute inset-0 -z-10">
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <Stars radius={100} depth={50} count={5000} factor={4} />
        </Canvas>
        
        <DialogHeader>
          <DialogTitle className="text-2xl">{game.name} Guide</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <section>
            <h3 className="text-xl font-semibold mb-2">Basic Rules</h3>
            <ul className="list-disc pl-6 space-y-2">
              {resources?.rules.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">Strategy Tips</h3>
            <ul className="list-disc pl-6 space-y-2">
              {resources?.strategy.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">Video Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              {resources?.videos.map((video, i) => (
                <li key={i}>{video}</li>
              ))}
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
