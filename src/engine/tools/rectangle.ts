import { Rect } from "../drawables/rect";
import { Vec2 } from "../math/matrix";
import type { MouseEventData } from "../types";
import type { EngineCallbacks, Tool } from "./types";

export class RectangleTool implements Tool {
  public readonly id = "rectangle";

  private callbacks: EngineCallbacks;
  private mouseDownData: MouseEventData | null = null;
  private createdObject: Rect | null = null;

  private readonly MIN_SIZE_FOR_CREATION = 10;

  constructor(callbacks: EngineCallbacks) {
    this.callbacks = callbacks;
  }

  public onMouseDown(data: MouseEventData) {
    if (data.button !== "left") {
      return;
    }

    this.mouseDownData = data;
    return;
  }

  public onMouseMove(data: MouseEventData) {
    if (this.mouseDownData === null) {
      return;
    }

    const viewportDistance = Vec2.distance(
      data.viewportPosition,
      this.mouseDownData.viewportPosition
    );
    const width = Math.abs(
      this.mouseDownData.worldPosition.x - data.worldPosition.x
    );
    const height = Math.abs(
      this.mouseDownData.worldPosition.y - data.worldPosition.y
    );

    if (!this.createdObject) {
      if (viewportDistance < this.MIN_SIZE_FOR_CREATION) {
        return;
      }

      this.createdObject = this.makeShape(data.worldPosition, width, height);
      this.callbacks.requestRedraw();
      return;
    }

    this.createdObject.width = width;
    this.createdObject.height = height;
    this.callbacks.requestRedraw();
  }

  public onMouseUp(data: MouseEventData) {
    if (data.button !== this.mouseDownData?.button) {
      return;
    }

    this.mouseDownData = null;
    this.createdObject = null;
  }

  private uid() {
    return Math.random().toString(36).substring(2, 15);
  }

  private makeShape(position: Vec2, width: number, height: number) {
    const newId = this.uid();
    const object = new Rect(newId, position, width, height);
    this.callbacks.onCreateObject(object);
    return object;
  }
}
