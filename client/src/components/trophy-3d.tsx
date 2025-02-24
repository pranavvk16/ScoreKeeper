import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stage, PresentationControls } from '@react-three/drei';
import { motion } from 'framer-motion';

function Trophy(props: any) {
  const group = useRef<any>();
  
  // Create a simple trophy geometry since we don't have a 3D model
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 2) / 4;
    group.current.position.y = Math.sin(t / 1.5) / 4;
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* Base */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 0.3, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Stem */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 2, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Cup */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.8, 0.4, 1, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Handles */}
      <mesh position={[-0.8, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.8, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function Trophy3D() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-[300px]"
    >
      <Canvas dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 8] }}>
        <PresentationControls
          global
          zoom={0.8}
          rotation={[0, -Math.PI / 4, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <Stage environment="sunset" intensity={1}>
            <Trophy scale={1.5} />
          </Stage>
        </PresentationControls>
      </Canvas>
    </motion.div>
  );
}
