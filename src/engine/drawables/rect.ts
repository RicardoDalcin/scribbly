import type { Vec2 } from '../math/matrix';
import { DrawableTypes } from '.';
import type { RoughCanvas } from 'roughjs/bin/canvas';

export class Rect {
  type = 'rect';

  position: Vec2;
  width: number;
  height: number;

  style: {
    stroke: string | null;
    background: string | null;
    fillStyle: DrawableTypes.FillStyle;
    strokeWidth: DrawableTypes.StrokeWidth;
    sloppiness: DrawableTypes.Sloppiness;
    edges: DrawableTypes.Edges;
    opacity: number;
  };

  seed: number = Math.random() * 1000;

  constructor(position: Vec2, width: number, height: number) {
    this.position = position;
    this.width = width;
    this.height = height;

    this.style = {
      stroke: 'black',
      background: null,
      fillStyle: DrawableTypes.FillStyle.Hachure,
      strokeWidth: DrawableTypes.StrokeWidth.Medium,
      sloppiness: DrawableTypes.Sloppiness.Medium,
      edges: DrawableTypes.Edges.Right,
      opacity: 1,
    };
  }

  public draw(roughCanvas: RoughCanvas) {
    const drawable = roughCanvas.rectangle(
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      {
        fill: this.style.background ?? 'transparent',
        fillStyle: this.style.fillStyle,
        stroke: this.style.stroke ?? 'transparent',
        strokeWidth: DrawableTypes.StrokeWidthValues[this.style.strokeWidth],
        seed: this.seed,
      }
    );

    roughCanvas.draw(drawable);
  }
}
