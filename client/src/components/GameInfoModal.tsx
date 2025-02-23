
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
  },
  'Bridge': {
    rules: [
      'Four players in two partnerships',
      'Each player gets 13 cards',
      'Bidding determines the contract',
      'One hand becomes dummy'
    ],
    strategy: [
      'Count your winners and losers',
      'Plan the play before first card',
      'Establish long suits early',
      'Keep communication with partner'
    ],
    videos: [
      'Bridge Basics - https://replit.com/@games/bridge-101',
      'Advanced Bridge - https://replit.com/@games/bridge-master'
    ]
  }
};

interface GameInfoModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GameInfoModal({ game, isOpen, onClose }: GameInfoModalProps) {
  if (!game) return null;
  
  const resources = gameResources[game.name as keyof typeof gameResources] || {
    rules: ['Custom game rules'],
    strategy: ['Custom game strategies'],
    videos: ['Custom game tutorials']
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gradient-to-b from-indigo-50/90 to-white/90 dark:from-indigo-950/90 dark:to-black/90">
        <div className="absolute inset-0 -z-10">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          </Canvas>
        </div>
        
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
            {game.name} Guide
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <section>
            <h3 className="text-xl font-semibold mb-2 text-indigo-800 dark:text-indigo-200">Basic Rules</h3>
            <ul className="list-disc pl-6 space-y-2">
              {resources.rules.map((rule, i) => (
                <li key={i} className="text-indigo-700 dark:text-indigo-300">{rule}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2 text-indigo-800 dark:text-indigo-200">Strategy Tips</h3>
            <ul className="list-disc pl-6 space-y-2">
              {resources.strategy.map((tip, i) => (
                <li key={i} className="text-indigo-700 dark:text-indigo-300">{tip}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2 text-indigo-800 dark:text-indigo-200">Learning Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              {resources.videos.map((video, i) => (
                <li key={i} className="text-indigo-700 dark:text-indigo-300">{video}</li>
              ))}
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
