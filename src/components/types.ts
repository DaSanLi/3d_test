/**
 * Types para HTML-in-Canvas + Vinilo 3D
 */

export interface VinylConfig {
  /** Texto del vinilo */
  text: string;
  /** Color del texto */
  textColor: string;
  /** Color de fondo del vinilo */
  backgroundColor: string;
  /** Tamaño de fuente */
  fontSize: number;
  /** Familia de fuente */
  fontFamily: string;
}

export interface HtmlPaintEvent extends Event {
  changedElements: Element[];
}

export interface ElementImage {
  width: number;
  height: number;
  close: () => void;
}

export type CanvasContextType = '2d' | 'webgl' | 'webgl2' | 'webgpu';

export interface SceneState {
  isLoaded: boolean;
  error: string | null;
}