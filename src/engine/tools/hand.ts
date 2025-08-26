import { Vec2 } from "../math/matrix";
import type { MouseEventData } from "../types";
import type { EngineCallbacks, Tool } from "./types";

export class HandTool implements Tool {
  public readonly id = "hand";

  private callbacks: EngineCallbacks;
  private mouseDownData: MouseEventData | null = null;

  constructor(callbacks: EngineCallbacks) {
    this.callbacks = callbacks;
  }

  public onMouseDown(data: MouseEventData) {
    if (data.button === "right") {
      return;
    }

    this.mouseDownData = data;
    return;
  }

  public onMouseMove(data: MouseEventData) {
    if (this.mouseDownData === null) {
      return;
    }

    this.callbacks.cameraPan(Vec2.mulScalar(data.movement, -1));
  }

  public onMouseUp(data: MouseEventData) {
    if (data.button !== this.mouseDownData?.button) {
      return;
    }

    this.mouseDownData = null;
  }
}
