import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const Prism = ({ protein = 0.5, carbs = 0.5, fat = 0.5 }) => {
  const mesh = useRef();
  const outerMesh = useRef();

  // Distortion increases with macro fill
  const distort = 0.25 + protein * 0.45;

  // Color smoothly interpolates from sage (low) to gold (high)
  const baseColor = new THREE.Color().lerpColors(
    new THREE.Color('#6B8C6B'),  // sage
    new THREE.Color('#B8924A'),  // gold
    carbs
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.25;
    mesh.current.rotation.x = Math.sin(t * 0.15) * 0.3;
    outerMesh.current.rotation.y = -t * 0.12;
    outerMesh.current.rotation.z = t * 0.08;
  });

  return (
    <Float speed={1.5} floatIntensity={0.6} rotationIntensity={0}>
      <group>
        {/* Inner glowing core */}
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1.3, 4]} />
          <MeshDistortMaterial
            color={baseColor}
            distort={distort}
            speed={2}
            roughness={0.15}
            metalness={0.6}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* Outer wireframe shell */}
        <mesh ref={outerMesh}>
          <icosahedronGeometry args={[1.85, 1]} />
          <meshBasicMaterial
            color="#B8924A"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Inner point light that pulses */}
        <pointLight color={baseColor} intensity={2 + fat * 3} distance={5} />
      </group>
    </Float>
  );
};

export default function VitalityPrism({ data = {} }) {
  const p = Math.min(1, (data.protein || 30) / 100);
  const c = Math.min(1, (data.carbs   || 30) / 100);
  const f = Math.min(1, (data.fat     || 30) / 100);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 360, cursor: 'grab', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-5, -3, -5]} intensity={0.8} color="#B8924A" />
        <pointLight position={[0, 4, 0]} intensity={1} color="#6B8C6B" distance={8} />
        <Environment preset="city" />
        <Prism protein={p} carbs={c} fat={f} />
      </Canvas>

      {/* Labels */}
      <div style={{
        position: 'absolute', bottom: 20, left: 0, right: 0,
        textAlign: 'center', pointerEvents: 'none'
      }}>
        <div style={{ fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>
          Neural Wellness Core
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--ink-60)' }}>
          {Math.round(p * 100)}% Vitality Synthesised
        </div>
      </div>
    </div>
  );
}
