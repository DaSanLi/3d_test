/**
 * HtmlAnimated - Componente HTML-in-Canvas con interactividad en tiempo real
 */
import { useEffect, useRef, useCallback } from 'react';
import { setupHtmlInCanvas, isHtmlInCanvasSupported, forceCanvasUpdate } from '../components/canvasRenderer';

export const HtmlAnimated = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Función para actualizar el canvas cuando hay cambios en el contenido
    const updateCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const content = contentRef.current;

        if (canvas && content) {
            forceCanvasUpdate(canvas, content);
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Establecer layoutsubtree programáticamente
        canvas.setAttribute('layoutsubtree', '');

        // Verificar soporte de API
        if (!isHtmlInCanvasSupported()) {
            console.warn('⚠️ API no soportada. Habilita: chrome://flags/#canvas-draw-element');
        }

        // Buscar el contenido
        const content = canvas.querySelector('#content') as HTMLElement;
        if (content) {
            const cleanup = setupHtmlInCanvas(canvas, content);
            return cleanup ?? undefined;
        }
    }, []);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name');
        console.log('Formulario enviado:', name);
        // Actualizar canvas después del submit
        updateCanvas();
    };

    return (
        <section 
        style={{
            width:'100%', height:'100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <canvas
                ref={canvasRef}
                width={600}
                height={450}
                style={{
                    display: 'block',
                    width: '100%',
                    maxWidth: '800px',
                    height: 'auto',
                    border: '2px solid #00e5b9',
                    borderRadius: '8px',
                    backgroundColor: '#07070d',
                }}
            >
                <div
                    ref={contentRef}
                    id="content"
                    style={{
                        padding: '40px',
                        background: 'linear-gradient(135deg, #6c41f0 0%, #d52e66 45%, #ff5926 70%, #00e5b9 100%)',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        width: '100%',
                        height: '100%',
                        gap: '50px'
                    }}
                >
                    <h1 style={{ margin: '0 0 30px 0', color: 'white', fontSize: '42px', padding: '10px' }}>
                        🎨 Renderizado Nativo
                    </h1>

                    <p style={{ color: '#f0f0f0', marginBottom: '30px' }}>
                        Escribe en el input y observa el canvas en tiempo real
                    </p>

                    {/* Formulario interactivo */}
                    <form
                        onSubmit={handleFormSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                            maxWidth: '400px',
                        }}
                    >
                        <input
                            name="name"
                            type="text"
                            placeholder="Tu nombre..."
                            onInput={updateCanvas}
                            style={{
                                padding: '14px 18px',
                                fontSize: '20px',
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                border: '3px solid #00e5b9',
                                borderRadius: '10px',
                                color: '#1a1a1a',
                                outline: 'none',
                            }}
                        />
                        <button
                            type="submit"
                            onClick={updateCanvas}
                            style={{
                                padding: '16px 36px',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                backgroundColor: '#00e5b9',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#1a1a1a',
                                marginTop: '10px',
                            }}
                        >
                            ✅ Enviar
                        </button>
                    </form>
                </div>
            </canvas>
        </section>
    );
};

export default HtmlAnimated;