import type { Drawable } from '../drawables';
import { Vec2 } from '../math/matrix';
import type { MouseEventData } from '../types';
import type { EngineCallbacks, Tool } from './types';

export class SelectionTool implements Tool {
  public readonly id = 'selection';

  private readonly BOUNDING_BOX_PADDING = 6;

  private callbacks: EngineCallbacks;
  private mouseDownData: MouseEventData | null = null;
  private selectedObject: Drawable | null = null;

  constructor(callbacks: EngineCallbacks) {
    this.callbacks = callbacks;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (!this.selectedObject) {
      return;
    }

    const bounds = this.selectedObject.getBounds();
    ctx.strokeStyle = '#4f39f6';
    ctx.strokeRect(
      bounds.x - this.BOUNDING_BOX_PADDING,
      bounds.y - this.BOUNDING_BOX_PADDING,
      bounds.width + this.BOUNDING_BOX_PADDING * 2,
      bounds.height + this.BOUNDING_BOX_PADDING * 2
    );
  }

  public onMouseDown(data: MouseEventData) {
    if (data.button !== 'left') {
      return;
    }

    this.mouseDownData = data;

    this.selectedObject =
      this.callbacks.getObjects().find((object) => {
        const bounds = object.getBounds();
        if (
          data.worldPosition.x >= bounds.x &&
          data.worldPosition.x <= bounds.x + bounds.width &&
          data.worldPosition.y >= bounds.y &&
          data.worldPosition.y <= bounds.y + bounds.height
        ) {
          return true;
        }

        return false;
      }) ?? null;

    this.callbacks.onSelectObject(this.selectedObject);
    this.callbacks.requestRedraw();
    return;
  }

  public onMouseMove(data: MouseEventData) {
    if (this.mouseDownData === null) {
      return;
    }

    if (this.selectedObject) {
      this.selectedObject.position = Vec2.add(
        this.selectedObject.position,
        data.worldMovement
      );
      this.callbacks.requestRedraw();
      return;
    }
  }

  public onMouseUp(data: MouseEventData) {
    if (data.button !== this.mouseDownData?.button) {
      return;
    }
  }
}
