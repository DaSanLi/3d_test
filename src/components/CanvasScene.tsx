/**
 * CanvasScene - Solo dos elementos: vinilo + moneda flip (mismas dimensiones)
 */

import { useRef, useEffect, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';

interface VinylConfig {
  text: string;
  textColor: string;
  backgroundColor: string;
  fontSize: number;
}

interface CanvasSceneProps {
  config: VinylConfig;
  onConfigChange?: (config: Partial<VinylConfig>) => void;
}

const COLOR_PALETTE = [
  '#FFFFFF', '#000000', '#FF6B35', '#00FF94', '#3B82F6',
];

// Dimensiones unificadas
const W = 3;
const H = 1.8;

// Hook para generar textura
function useHtmlTexture(config: VinylConfig) {
  const [textureData, setTextureData] = useState<string | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 450;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = config.textColor;
    ctx.font = `bold ${config.fontSize * 2}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.text, canvas.width / 2, canvas.height / 2);

    setTextureData(canvas.toDataURL('image/png'));
  }, [config.text, config.textColor, config.backgroundColor, config.fontSize]);

  return textureData;
}

// Vinilo 3D
function VinylMesh({ config, textureData }: { config: VinylConfig; textureData: string | null }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!textureData) return;
    const loader = new THREE.TextureLoader();
    loader.load(textureData, (tex) => {
      if (meshRef.current) {
        const mat = meshRef.current.material as THREE.MeshStandardMaterial;
        mat.map = tex;
        mat.color = new THREE.Color('#ffffff');
        mat.needsUpdate = true;
      }
    });
  }, [textureData]);

  return (
    <mesh ref={meshRef} position={[0.8, 0, 0]}>
      <planeGeometry args={[W, H, 16, 8]} />
      <meshStandardMaterial color={config.backgroundColor} roughness={0.3} metalness={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Moneda flip con dos caras - misma размер que vinilo
function FlipCard({ config, onConfigChange }: { config: VinylConfig; onConfigChange: (c: Partial<VinylConfig>) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [flipped, setFlipped] = useState(false);
  const [input, setInput] = useState(config.text);

  // Sincronizar input con config del parent
  useEffect(() => {
    setInput(config.text);
  }, [config.text]);

  // Animación suave
  useFrame(() => {
    if (groupRef.current) {
      const targetRot = flipped ? Math.PI : 0;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot, 0.1);
    }
  });

  const toggle = useCallback(() => setFlipped(f => !f), []);

  const cs = config.textColor;
  const cb = config.backgroundColor;

  // La cara frontal siempre visible cuando no está volteada
  // La cara trasera siempre visible cuando está volteada
  const showFront = !flipped;
  const showBack = flipped;

  return (
    <group ref={groupRef} position={[0, 0, 0.9]}>
      {/* Cara frontal - Configuración */}
      <group visible={showFront}>
        <mesh rotation={[0, 0, 0]}>
          <planeGeometry args={[W, H]} />
          <meshStandardMaterial color="#1a1a1a" side={THREE.DoubleSide} />
        </mesh>
        <Html position={[0, 0, 0.02]} transform occlude={false} style={{ width: '320px', height: '190px', pointerEvents: 'auto' }}>
          <div style={{ width: '100%', height: '100%', padding: '12px', backgroundColor: '#1a1a1a', border: '2px solid #00e5b9', borderRadius: '8px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} maxLength={12}
                style={{ flex: 1, padding: '6px', fontSize: '12px', border: '1px solid #00e5b9', borderRadius: '4px', backgroundColor: '#222', color: '#fff' }} />
              <button type="button" onClick={() => onConfigChange({ text: input || ' ' })} style={{ padding: '6px 12px', backgroundColor: '#00e5b9', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Guardar</button>
            </div>
            <div style={{ padding: '8px', backgroundColor: cb, borderRadius: '4px', textAlign: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '16px', color: cs, fontWeight: 'bold', textTransform: 'uppercase' }}>{input || '?'}</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', fontSize: '10px', color: '#888' }}>
              <div>
                <div style={{ marginBottom: '2px' }}>Texto</div>
                {COLOR_PALETTE.map(c => (
                  <button key={c} type="button" onClick={() => onConfigChange({ textColor: c })}
                    style={{ width: '20px', height: '20px', borderRadius: '2px', backgroundColor: c, border: cs === c ? '3px solid #00e5b9' : '1px solid #444', marginRight: '4px', cursor: 'pointer' }} />
                ))}
              </div>
              <div>
                <div style={{ marginBottom: '2px' }}>Fondo</div>
                {COLOR_PALETTE.map(c => (
                  <button key={c} type="button" onClick={() => onConfigChange({ backgroundColor: c })}
                    style={{ width: '20px', height: '20px', borderRadius: '2px', backgroundColor: c, border: cb === c ? '3px solid #00e5b9' : '1px solid #444', marginRight: '4px', cursor: 'pointer' }} />
                ))}
              </div>
            </div>
          </div>
        </Html>
      </group>

      {/* Cara trasera - Preview */}
      <group visible={showBack} rotation={[0, Math.PI, 0]}>
        <mesh>
          <planeGeometry args={[W, H]} />
          <meshStandardMaterial color={cb} side={THREE.DoubleSide} />
        </mesh>
        <Html position={[0, 0, 0.02]} transform occlude={false} style={{ width: '320px', height: '190px', pointerEvents: 'auto' }}>
          <div style={{ width: '100%', height: '100%', padding: '12px', backgroundColor: cb, border: `3px solid ${cs}`, borderRadius: '8px', boxSizing: 'border-box', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '10px', color: cs, opacity: 0.7, marginBottom: '8px' }}>Vista Previa</div>
            <div style={{ fontSize: '24px', color: cs, fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' }}>{config.text}</div>
            <button onClick={toggle} style={{ marginTop: '12px', padding: '6px 16px', backgroundColor: cs, color: cb, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Editar</button>
          </div>
        </Html>
      </group>
    </group>
  );
}

function Loader() {
  return <mesh><boxGeometry args={[1,1,1]} /><meshStandardMaterial color="#00e5b9" wireframe /></mesh>;
}

function Camera() {
  const { camera } = useThree();
  useEffect(() => { camera.position.set(0, 0, 5); }, [camera]);
  return <OrbitControls enablePan={false} minDistance={3} maxDistance={10} />;
}

export function CanvasScene({ config, onConfigChange }: CanvasSceneProps) {
  const texture = useHtmlTexture(config);
  const handle = useCallback((c: Partial<VinylConfig>) => onConfigChange?.(c), [onConfigChange]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true }} style={{ background: '#0a0a0a' }}>
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, 5]} intensity={0.3} color="#00e5b9" />
          <FlipCard config={config} onConfigChange={handle} />
          <VinylMesh config={config} textureData={texture} />
          <Camera />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default CanvasScene;