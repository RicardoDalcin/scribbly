import type { Vec2 } from "./math/matrix";

export type EditorMode =
  | "select"
  | "rectangle"
  | "diamond"
  | "ellipse"
  | "arrow"
  | "line"
  | "draw"
  | "text";

export type MouseEventData = {
  button: "left" | "middle" | "right";
  viewportPosition: Vec2;
  worldPosition: Vec2;
  movement: Vec2;
  modifiers: {
    ctrlKey: boolean;
    shiftKey: boolean;
  };
};
