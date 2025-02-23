
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Float, PerspectiveCamera } from '@react-three/drei';
import { Game } from '@shared/schema';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

function Title3D({ text }: { text: string }) {
  const meshRef = useRef<THREE.Mesh>();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Text3D
        ref={meshRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.5}
        height={0.1}
        curveSegments={12}
      >
        {text}
        <meshStandardMaterial color="#6366f1" />
      </Text3D>
    </Float>
  );
}

interface GameCardProps {
  game: Game;
  onViewInfo: () => void;
}

export function GameCard3D({ game, onViewInfo }: GameCardProps) {
  return (
    <Card className="w-full relative overflow-hidden group">
      <div className="absolute inset-0 h-32 opacity-50 group-hover:opacity-75 transition-opacity">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Title3D text={game.name} />
        </Canvas>
      </div>
      <CardHeader className="pt-36">
        <CardTitle>{game.name}</CardTitle>
        <CardDescription>{game.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Players: {game.minPlayers}-{game.maxPlayers}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onViewInfo} className="w-full">View Game Info</Button>
      </CardFooter>
    </Card>
  );
}
