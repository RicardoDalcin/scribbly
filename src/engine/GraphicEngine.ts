import type { RoughCanvas } from "roughjs/bin/canvas";
import { Camera } from "./entities/Camera";
import { Vec2 } from "./math/matrix";
import type { EditorMode } from "./types";
import rough from "roughjs";
import type { Drawable } from "./drawables";
import { Rect } from "./drawables/rect";

export class GraphicEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private container: HTMLElement;
  private roughCanvas: RoughCanvas;

  private isMouseDown = false;
  private mouseDownPosition: Vec2 | null = null;
  private editorMode: EditorMode = "select";
  private camera: Camera;

  private objects = new Map<string, Drawable>();

  private _destroy = () => {};

  constructor(canvas: HTMLCanvasElement, container: HTMLElement) {
    this.canvas = canvas;
    this.container = container;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas context is not available");
    }

    this.ctx = ctx;

    this.resize();
    this.camera = new Camera(
      this.canvas.width,
      this.canvas.height,
      window.devicePixelRatio
    );
    const unsubscribe = this.setupEvents();

    this._destroy = () => {
      unsubscribe();
    };

    this.roughCanvas = rough.canvas(canvas);
    this.draw();
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.objects.forEach((object) => {
      return object.draw(this.roughCanvas);
    });
  }

  public zoomIn() {
    this.camera.zoomIn();
  }

  public zoomOut() {
    this.camera.zoomOut();
  }

  public pan(delta: Vec2) {
    this.camera.pan(delta);
  }

  public changeEditorMode(newMode: EditorMode) {
    this.editorMode = newMode;
  }

  public destroy() {
    this._destroy();
  }

  private uid() {
    return Math.random().toString(36).substring(2, 15);
  }

  private resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";
    this.canvas.width = width * window.devicePixelRatio;
    this.canvas.height = height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  private getMouseEvent(e: MouseEvent) {
    const BUTTON_TYPES = ["left", "middle", "right"] as const;
    const button = BUTTON_TYPES[e.button];
    const isMacOS = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const ctrlKey = isMacOS ? e.metaKey : e.ctrlKey;
    const shiftKey = e.shiftKey;

    const x = e.clientX - this.canvas.offsetLeft;
    const y = e.clientY - this.canvas.offsetTop;
    const position = Vec2.create(x, y);

    return {
      button,
      position,
      modifiers: {
        ctrlKey,
        shiftKey,
      },
    };
  }

  private onMouseDown(e: MouseEvent) {
    const options = this.getMouseEvent(e);

    if (options.button === "right") {
      return;
    }

    if (options.button === "middle") {
      return;
    }

    this.isMouseDown = true;
    this.mouseDownPosition = options.position;
  }

  private onMouseMove(e: MouseEvent) {}

  private onMouseUp(e: MouseEvent) {
    const options = this.getMouseEvent(e);

    if (options.button === "right") {
      return;
    }

    if (options.button === "middle") {
      return;
    }

    // const position = this.camera.getWorldPosition(options.position);
    this.objects.set(
      this.uid(),
      new Rect(Vec2.create(options.position.x, options.position.y), 50, 50)
    );
    this.draw();
  }

  private setupEvents() {
    const onResize = () => {
      this.resize();
    };

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      this.onMouseDown(e);
    };

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      this.onMouseMove(e);
    };

    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      this.onMouseUp(e);
    };

    window.addEventListener("resize", onResize);
    this.canvas.addEventListener("mousedown", onMouseDown);
    this.canvas.addEventListener("mousemove", onMouseMove);
    this.canvas.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("resize", onResize);
      this.canvas.removeEventListener("mousedown", onMouseDown);
      this.canvas.removeEventListener("mousemove", onMouseMove);
      this.canvas.removeEventListener("mouseup", onMouseUp);
    };
  }
}
