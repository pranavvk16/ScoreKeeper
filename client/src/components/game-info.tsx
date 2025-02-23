import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Game } from "@shared/schema";

interface GameInfoProps {
  game: Game;
  onClose: () => void;
}

export function GameInfo({ game, onClose }: GameInfoProps) {
  const [activeTab, setActiveTab] = useState<'rules' | 'resources'>('rules');

  // Game-specific resources
  const resources = {
    "Poker": {
      videos: [
        { title: "Poker Hand Rankings", url: "https://www.youtube.com/watch?v=GAoR9ji8D6A" },
        { title: "Basic Strategy Guide", url: "https://www.youtube.com/watch?v=u12KtPZWAY0" }
      ],
      links: [
        { title: "PokerStrategy.com", url: "https://www.pokerstrategy.com" },
        { title: "Poker Rules", url: "https://www.pokernews.com/poker-rules/" }
      ]
    },
    "UNO": {
      videos: [
        { title: "How to Play UNO", url: "https://www.youtube.com/watch?v=sWoqY6CD2ink" }
      ],
      links: [
        { title: "Official Rules", url: "https://www.mattelgames.com/en-us/cards/uno" }
      ]
    },
    // Add resources for other games...
  }[game.name] || { videos: [], links: [] };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{game.name}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Animated Logo */}
          <motion.div 
            className="h-[200px] flex items-center justify-center"
            animate={{ 
              scale: [1, 1.1, 1],
              rotateY: [0, 180, 0] 
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">{game.name[0]}</span>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 border-b">
            <Button
              variant={activeTab === 'rules' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('rules')}
            >
              Rules
            </Button>
            <Button
              variant={activeTab === 'resources' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('resources')}
            >
              Learning Resources
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {activeTab === 'rules' ? (
              <div className="prose dark:prose-invert">
                <h3>How to Play</h3>
                <p>{game.description}</p>
                <h4>Scoring</h4>
                <p>{game.highestWins ? "Highest score wins" : "Lowest score wins"}</p>
                <p>Players: {game.minPlayers}-{game.maxPlayers}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {resources.videos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Video Tutorials</h3>
                    <div className="grid gap-3">
                      {resources.videos.map((video, i) => (
                        <a
                          key={i}
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                        >
                          <Play className="h-4 w-4" />
                          <span>{video.title}</span>
                          <ExternalLink className="h-4 w-4 ml-auto" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {resources.links.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Useful Links</h3>
                    <div className="grid gap-3">
                      {resources.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>{link.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}