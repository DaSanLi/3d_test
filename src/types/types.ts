/**
 * Tipos para HTML-in-Canvas API experimental
 */

// Evento paint
export interface PaintEvent extends Event {
    readonly changedElements: ReadonlyArray<Element>;
}

// Extensiones globales mínimas (evitar duplicados)
declare global {
    // CanvasRenderingContext2D
    interface CanvasRenderingContext2D {
        drawElementImage(element: Element, x: number, y: number): DOMMatrix;
    }
}

export {};