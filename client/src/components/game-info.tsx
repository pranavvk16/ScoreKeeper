
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { type Game } from "@shared/schema";

interface GameResourceLink {
  title: string;
  url: string;
  type: 'article' | 'video' | 'tutorial';
}

const gameResources: Record<string, GameResourceLink[]> = {
  "Poker": [
    { title: "Basic Poker Rules", url: "https://www.pokernews.com/poker-rules/", type: 'article' },
    { title: "Poker Hand Rankings", url: "https://www.pokerstars.com/poker/games/rules/hand-rankings/", type: 'article' },
    { title: "Essential Poker Strategy", url: "https://www.pokernews.com/strategy/", type: 'tutorial' }
  ],
  "Bridge": [
    { title: "Bridge Basics", url: "https://www.acbl.org/learn/", type: 'article' },
    { title: "Bridge Bidding Guide", url: "https://www.bridgebum.com/bridge_basics.php", type: 'tutorial' },
    { title: "Bridge Game Rules", url: "https://bicyclecards.com/how-to-play/bridge/", type: 'article' }
  ],
  "Golf": [
    { title: "Golf Card Game Rules", url: "https://bicyclecards.com/how-to-play/golf/", type: 'article' },
    { title: "Golf Strategy Tips", url: "https://www.pagat.com/draw/golf.html", type: 'tutorial' }
  ],
  "Darts": [
    { title: "Darts Rules", url: "https://www.dartbase.com/rules.htm", type: 'article' },
    { title: "Darts Scoring Guide", url: "https://www.darting.com/Darts-Rules/", type: 'tutorial' },
    { title: "Basic Techniques", url: "https://www.dartscorner.co.uk/guides", type: 'article' }
  ]
};

interface GameInfoProps {
  game: Game;
}

export function GameInfo({ game }: GameInfoProps) {
  const resources = gameResources[game.name] || [];
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{game.name} - Game Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{game.description}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Rules & Restrictions</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Players: {game.minPlayers} - {game.maxPlayers} players required</li>
              <li>Scoring: {game.highestWins ? "Highest score wins" : "Lowest score wins"}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Learning Resources</h3>
            <div className="grid gap-2">
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{resource.title}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {resource.type}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
