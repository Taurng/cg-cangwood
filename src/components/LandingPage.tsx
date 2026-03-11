import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PerspectiveCamera, Text, Environment, MeshWobbleMaterial } from '@react-three/drei';
import { motion } from 'motion/react';
import * as THREE from 'three';

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[10, 3, 200, 32]} />
        <MeshDistortMaterial
          color="#5A5A40"
          speed={2}
          distort={0.4}
          radius={1}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
    </Float>
  );
}

type LandingPageProps = {
  onEnter: () => void;
  lang: 'zh' | 'en';
};

export function LandingPage({ onEnter, lang }: LandingPageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed inset-0 z-[1000] bg-brand-white overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Canvas shadows={true}>
          <PerspectiveCamera makeDefault position={[0, 0, 40]} fov={75} />
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={2} />
          <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={3} />
          <AnimatedSphere />
          <Environment preset="studio" />
        </Canvas>
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-editorial text-[12vw] md:text-[8vw] leading-none uppercase tracking-tighter mb-8 text-brand-black">
            CAMG WOOD.
          </h1>
          <p className="font-mono text-xs md:text-sm uppercase tracking-[0.5em] mb-12 text-brand-black/60">
            {lang === 'zh' ? '工藝 — 靈魂 — 永恆' : 'CRAFT — SOUL — TIMELESS'}
          </p>
          
          <motion.button
            onClick={onEnter}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative px-12 py-4 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 font-mono text-xs uppercase tracking-[0.3em] font-bold transition-colors duration-300 group-hover:text-brand-white">
              {lang === 'zh' ? '進入工作室' : 'ENTER STUDIO'}
            </span>
            <motion.div
              className="absolute inset-0 border border-brand-black"
              animate={{
                backgroundColor: isHovered ? "#0a0a0a" : "transparent",
              }}
            />
          </motion.button>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-12 right-12 flex justify-between font-mono text-[10px] uppercase tracking-widest opacity-30 pointer-events-none">
        <span>Est. 2024</span>
        <span>Kaohsiung, Taiwan</span>
      </div>
    </div>
  );
}
