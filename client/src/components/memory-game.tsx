import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Timer, Sparkles, RotateCcw } from "lucide-react";

interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ["🎮", "🎲", "🎯", "🎪", "🎨", "🎭", "🎪", "🎯"];

export function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem("memoryGameBestScore");
    return saved ? JSON.parse(saved) : { moves: Infinity, time: Infinity };
  });

  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      const interval = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameCompleted]);

  const initializeGame = () => {
    const shuffledEmojis = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledEmojis);
    setFlippedCards([]);
    setMoves(0);
    setTimer(0);
    setGameStarted(false);
    setGameCompleted(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (!gameStarted) setGameStarted(true);
    if (flippedCards.length === 2 || cards[id].isMatched || flippedCards.includes(id)) return;

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(m => m + 1);
      const [firstId, secondId] = newFlippedCards;
      
      if (cards[firstId].emoji === cards[secondId].emoji) {
        setCards(cards.map(card =>
          card.id === firstId || card.id === secondId
            ? { ...card, isMatched: true }
            : card
        ));
        setFlippedCards([]);

        // Check if game is completed
        if (cards.filter(card => !card.isMatched).length === 2) {
          setGameCompleted(true);
          if (moves < bestScore.moves || timer < bestScore.time) {
            const newBestScore = { moves, time: timer };
            setBestScore(newBestScore);
            localStorage.setItem("memoryGameBestScore", JSON.stringify(newBestScore));
          }
        }
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Memory Game</h2>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              <span>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span>Moves: {moves}</span>
            </div>
          </div>
        </div>
        <Button onClick={initializeGame} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <AnimatePresence>
          {cards.map(card => (
            <motion.div
              key={card.id}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="aspect-square"
            >
              <Card
                className={`w-full h-full flex items-center justify-center text-4xl cursor-pointer transition-all duration-300 ${
                  card.isFlipped || card.isMatched || flippedCards.includes(card.id)
                    ? "bg-primary/10"
                    : "bg-muted"
                }`}
                onClick={() => handleCardClick(card.id)}
              >
                {(card.isFlipped || card.isMatched || flippedCards.includes(card.id))
                  ? card.emoji
                  : "?"}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {gameCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-primary/10 rounded-lg text-center"
        >
          <Sparkles className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
          <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
          <p className="text-muted-foreground">
            You completed the game in {moves} moves and {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}!
          </p>
          {(moves === bestScore.moves || timer === bestScore.time) && (
            <p className="text-sm text-primary mt-2">New Best Score! 🎉</p>
          )}
        </motion.div>
      )}
    </div>
  );
}
