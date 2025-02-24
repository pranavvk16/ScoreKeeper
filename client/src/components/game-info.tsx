import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, BookOpen, Youtube, Link as LinkIcon } from "lucide-react";
import { type Game } from "@shared/schema";
import { gameResources } from "@/lib/game-resources";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GameInfoProps {
  game: Game;
}

export function GameInfo({ game }: GameInfoProps) {
  const resources = gameResources[game.name];

  if (!resources) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{game.name} - Game Information</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{game.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Game Rules</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Players: {game.minPlayers} - {game.maxPlayers} players required</li>
                  <li>Scoring: {game.highestWins ? "Highest score wins" : "Lowest score wins"}</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tutorials">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5" />
                    Written Tutorials
                  </h3>
                  <a
                    href={resources.wikihow}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="font-medium">WikiHow Tutorial</div>
                    <div className="text-sm text-muted-foreground">
                      Step-by-step guide to playing {game.name}
                    </div>
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <Youtube className="h-5 w-5" />
                    Video Tutorials
                  </h3>
                  <div className="space-y-3">
                    {resources.youtube.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="font-medium">Video Tutorial {index + 1}</div>
                        <div className="text-sm text-muted-foreground">
                          Watch and learn {game.name} basics and strategies
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="resources">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <LinkIcon className="h-5 w-5" />
                  Additional Resources
                </h3>
                <div className="grid gap-3">
                  {resources.additionalResources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="font-medium">{resource.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {resource.description}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}