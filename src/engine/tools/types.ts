import type { Drawable } from '../drawables';
import type { Vec2 } from '../math/matrix';

export interface Tool<Id extends string = string> {
  id: Id;

  draw: (ctx: CanvasRenderingContext2D) => void;
}

export type EngineCallbacks = {
  onCreateObject: (object: Drawable) => void;
  onSelectObject: (object: Drawable | null) => void;
  requestRedraw: () => void;
  cameraPan: (delta: Vec2) => void;
  getObjects: () => Drawable[];
};
