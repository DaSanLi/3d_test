/**
 * Inicializa la sincronización entre el DOM y el Canvas
 * Versión optimizada para tiempo real sin loop infinito
 */
export const setupHtmlInCanvas = (
    canvas: HTMLCanvasElement, 
    sourceElement: HTMLElement
) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('No se pudo obtener el contexto 2D');
        return null;
    }

    // Flag para evitar dibujo concurrente
    let isDrawing = false;

    // Función de dibujo
    const draw = () => {
        if (isDrawing) return;
        isDrawing = true;

        try {
            ctx.reset();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Verificar si la API está disponible
            if ('drawElementImage' in ctx && typeof ctx.drawElementImage === 'function') {
                // Dibujar el elemento HTML en el canvas
                ctx.drawElementImage(sourceElement, 0, 0);
            } else {
                // Fallback visual cuando API no disponible
                drawFallback(ctx);
            }
        } catch (err) {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ff4444';
            ctx.font = '16px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Error: ' + (err instanceof Error ? err.message : 'Unknown'), canvas.width / 2, canvas.height / 2);
        } finally {
            isDrawing = false;
        }
    };

    // Dibujar fallback (cuando API no disponible)
    const drawFallback = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = 'rgba(7, 7, 13, 0.95)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Obtener estilos computados del elemento
        const computedStyle = window.getComputedStyle(sourceElement);
        const text = sourceElement.textContent || 'HTML-in-Canvas';
        
        ctx.fillStyle = '#00e5b9';
        ctx.font = `bold ${computedStyle.fontSize || '24px'} ${computedStyle.fontFamily || 'system-ui, sans-serif'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.fillStyle = '#8a8aa0';
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillText('API no disponible', canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText('Habilita: chrome://flags/#canvas-draw-element', canvas.width / 2, canvas.height / 2 + 45);
    };

    // Handler de paint - dibujar cuando el navegador indica que hay cambios
    canvas.onpaint = () => {
        draw();
    };

    // Primer dibujo inicial
    canvas.requestPaint?.();

    // Cleanup
    return () => {
        canvas.onpaint = undefined;
    };
};

/**
 * Forzar actualización manual
 */
export const forceCanvasUpdate = (canvas: HTMLCanvasElement, element: HTMLElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    try {
        ctx.reset();
        ctx.drawElementImage(element, 0, 0);
    } catch (err) {
        console.error('Error al forzar update:', err);
    }
};

/**
 * Verificar soporte de API
 */
export const isHtmlInCanvasSupported = (): boolean => {
    const testCanvas = document.createElement('canvas');
    const ctx = testCanvas.getContext('2d');
    return ctx !== null && 'drawElementImage' in ctx;
};