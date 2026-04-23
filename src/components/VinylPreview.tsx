/**
 * VinylPreview - Panel HTML interactivo para personalización del vinilo
 * Con formulario que envía el texto al modelo 3D
 */

import { useState, useCallback } from 'react';

interface VinylConfig {
  text: string;
  textColor: string;
  backgroundColor: string;
  fontSize: number;
}

interface VinylPreviewProps {
  config: VinylConfig;
  onConfigChange?: (config: Partial<VinylConfig>) => void;
}

const COLOR_PALETTE = [
  '#FFFFFF', '#000000', '#FF6B35', '#00FF94', '#3B82F6',
  '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4',
];

export function VinylPreview({ config, onConfigChange }: VinylPreviewProps) {
  // Estado local para el input del formulario
  const [inputText, setInputText] = useState(config.text);

  // Handler para cambio en el input (solo actualiza estado local)
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  }, []);

  // Handler al enviar el formulario
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Enviar el texto al estado global — esto disparará la actualización del 3D
    onConfigChange?.({ text: inputText || ' ' });
    console.log('Formulario enviado, texto actualizado:', inputText);
  }, [inputText, onConfigChange]);

  const handleColorSelect = (color: string) => {
    onConfigChange?.({ textColor: color });
  };

  const handleBgColorSelect = (color: string) => {
    onConfigChange?.({ backgroundColor: color });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onConfigChange?.({ fontSize: Number(e.target.value) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Preview actual del texto */}
      <div
        style={{
          fontSize: `${config.fontSize}px`,
          color: config.textColor,
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '20px',
          backgroundColor: config.backgroundColor,
          borderRadius: '12px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}
      >
        {config.text || ' '}
      </div>

      {/* Formulario interactivo */}
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', fontSize: '12px', opacity: 0.7, marginBottom: '8px' }}>
          Escribe tu texto personalizado
        </label>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Ej: Mi Viaje 2026"
          maxLength={20}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #333',
            borderRadius: '8px',
            backgroundColor: '#1a1a1a',
            color: '#fff',
            marginBottom: '12px',
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: '#00FF94',
            border: 'none',
            borderRadius: '8px',
            color: '#1a1a1a',
            cursor: 'pointer',
          }}
        >
          ✨ Actualizar Modelo 3D
        </button>
      </form>

      {/* Selector de tamaño de fuente */}
      <div>
        <label style={{ display: 'block', fontSize: '12px', opacity: 0.7, marginBottom: '8px' }}>
          Tamaño: {config.fontSize}px
        </label>
        <input
          type="range"
          min={16}
          max={64}
          value={config.fontSize}
          onChange={handleFontSizeChange}
          style={{ width: '100%' }}
        />
      </div>

      {/* Selector de color de texto */}
      <div>
        <label style={{ display: 'block', fontSize: '12px', opacity: 0.7, marginBottom: '8px' }}>
          Color del texto
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorSelect(color)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: color,
                border: config.textColor === color ? '3px solid #00FF94' : '2px solid #333',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>

      {/* Selector de color de fondo */}
      <div>
        <label style={{ display: 'block', fontSize: '12px', opacity: 0.7, marginBottom: '8px' }}>
          Color del fondo
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {COLOR_PALETTE.map((color) => (
            <button
              key={`bg-${color}`}
              type="button"
              onClick={() => handleBgColorSelect(color)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: color,
                border: config.backgroundColor === color ? '3px solid #00FF94' : '2px solid #333',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export type { VinylConfig };
export default VinylPreview;