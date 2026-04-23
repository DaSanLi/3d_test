/**
 * HtmlCanvas - Componente canvas con layoutsubtree para HTML-in-Canvas
 * Versión corregida: canvas separado para captura HTML
 */

import { useRef, useEffect, useCallback } from 'react';

interface HtmlCanvasProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  onTextureReady?: (imageData: string | null) => void;
}

export function HtmlCanvas({
  children,
  width = 400,
  height = 250,
  onTextureReady,
}: HtmlCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Función para dibujar el contenido HTML en el canvas
  const drawContent = useCallback(() => {
    const canvas = canvasRef.current;
    const contentEl = contentRef.current;
    if (!canvas || !contentEl) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Obtener estilos del contenido
    const styles = window.getComputedStyle(contentEl);
    const bgColor = styles.backgroundColor || '#1E1E1E';

    // Dibujar fondo
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Renderizar el texto del contenido
    const textEl = contentEl.querySelector('span') || contentEl.querySelector('div');
    if (textEl) {
      const textStyles = window.getComputedStyle(textEl);
      ctx.fillStyle = textStyles.color || '#FFFFFF';
      ctx.font = `${textStyles.fontWeight || 'bold'} ${textStyles.fontSize || '24px'} ${textStyles.fontFamily || 'system-ui'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textEl.textContent || '', width / 2, height / 2);
    } else {
      // Fallback: dibujar children como texto
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('HTML-in-Canvas', width / 2, height / 2);
    }

    // Generar la textura
    const imageData = canvas.toDataURL('image/png');
    onTextureReady?.(imageData);
  }, [width, height, onTextureReady]);

  // Efecto para inicializar el renderizado
  useEffect(() => {
    // Pequeño delay para asegurar que React renderizó los hijos
    const timer = setTimeout(() => {
      drawContent();
    }, 50);

    return () => clearTimeout(timer);
  }, [children, drawContent]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Canvas oculto para captura - no usado por Three.js */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ display: 'none' }}
      />

      {/* Contenedorvisible del contenido */}
      <div
        ref={contentRef}
        style={{
          padding: '16px',
          backgroundColor: '#1E1E1E',
          borderRadius: '8px',
          minHeight: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #00FF94',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default HtmlCanvas;