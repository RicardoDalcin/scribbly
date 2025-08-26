import type { Drawable } from "../drawables";
import type { Vec2 } from "../math/matrix";

export interface Tool<Id extends string = string> {
  id: Id;
}

export type EngineCallbacks = {
  onCreateObject: (object: Drawable) => void;
  requestRedraw: () => void;
  cameraPan: (delta: Vec2) => void;
};
