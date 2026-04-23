/**
 * Tipos extendidos para HTML-in-Canvas API experimental
 * Extiende los tipos de React para incluir la API no estándar
 */

import type { ReactNode } from 'react';

declare global {
  interface HTMLCanvasElement {
    // Atributo layoutSubtree
    layoutSubtree?: boolean;
    
    // Evento paint
    onpaint?: (event: PaintEvent) => void;
    requestPaint?: () => void;
    
    // Métodos de captura
    captureElementImage?: (element: Element) => ElementImage;
    getElementTransform?: (element: Element | ElementImage, drawTransform: DOMMatrix) => DOMMatrix;
  }

  interface PaintEvent extends Event {
    changedElements: Element[];
  }

  interface ElementImage {
    readonly width: number;
    readonly height: number;
    close: () => void;
  }

  interface CanvasRenderingContext2D {
    // Método principal de dibujo
    drawElementImage(
      element: Element | ElementImage,
      dx: number,
      dy: number,
      dw?: number,
      dh?: number
    ): DOMMatrix;
    
    drawElementImage(
      element: Element | ElementImage,
      sx: number,
      sy: number,
      sw: number,
      sh: number,
      dx: number,
      dy: number,
      dw?: number,
      dh?: number
    ): DOMMatrix;
    
    // WebGL equivalent
    texElementImage2D?: (
      target: number,
      level: number,
      internalformat: number,
      format: number,
      type: number,
      element: Element | ElementImage
    ) => void;
  }

  interface WebGLRenderingContext {
    texElementImage2D: (
      target: number,
      level: number,
      internalformat: number,
      format: number,
      type: number,
      element: Element | ElementImage
    ) => void;
    
    texElementImage2D: (
      target: number,
      level: number,
      internalformat: number,
      width: number,
      height: number,
      format: number,
      type: number,
      element: Element | ElementImage
    ) => void;
  }
}

declare module 'react' {
    // Extendemos la base de los atributos de Canvas
    interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
        layoutsubtree?: string | boolean;
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            canvas: React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
        }
    }
}

export interface PaintEvent extends Event {
    readonly changedElements: ReadonlyArray<Element>;
}

// Extendemos la interfaz global de forma limpia
declare global {
    interface HTMLCanvasElement {
        layoutsubtree: boolean;
        onpaint: ((ev: PaintEvent) => void) | undefined;
    }

    interface CanvasRenderingContext2D {
        drawElementImage(element: Element, x: number, y: number): void;
    }
}

export {};