import { CanvasScene } from '../components/CanvasScene';
import { useState } from "react";
import type { VinylConfig } from '../components/VinylPreview';

const defaultConfig: VinylConfig = {
    text: 'Mi Viaje 2026',
    textColor: '#FFFFFF',
    backgroundColor: '#1E1E1E',
    fontSize: 32,
};

export const Index = () => {
    const [config, setConfig] = useState<VinylConfig>(defaultConfig);

    // Función para actualizar configuración desde el panel 3D
    const handleConfigChange = (newConfig: Partial<VinylConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    return (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0a0a0a' }}>
            <header style={{ position: 'absolute', top: 20, left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(90deg, #00e5b9, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    🎨 Configurador de Vinilos 3D
                </h1>
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#8a8aa0' }}>
                    Panel de configuración integrado en la escena 3D →
                </p>
            </header>

            <div style={{ width: '100%', height: '100%', paddingTop: '80px' }}>
                <CanvasScene config={config} onConfigChange={handleConfigChange} />
            </div>

            <footer style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', textAlign: 'center', fontSize: '11px', color: '#555' }}>
                ⚠️ HTML-in-Canvas requiere: <code style={{ color: '#00e5b9' }}>chrome://flags/#canvas-draw-element</code>
            </footer>
        </div>
    );
};

export default Index;