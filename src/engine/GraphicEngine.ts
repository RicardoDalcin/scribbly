import type { RoughCanvas } from 'roughjs/bin/canvas';
import { Camera } from './entities/Camera';
import { Vec2 } from './math/matrix';
import type { EditorMode } from './types';
import rough from 'roughjs';
import type { Drawable } from './drawables';
import { Rect } from './drawables/rect';

type EngineCallbacks = {
  onChangeEditorMode: (newEditorMode: EditorMode) => void;
  onChangeIsDragging: (isDragging: boolean) => void;
  onChangeZoom: (newZoom: number) => void;
  onChangeSelectedObject: (newSelectedObject: Drawable | null) => void;
};

export class GraphicEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private container: HTMLElement;
  private roughCanvas: RoughCanvas;

  private callbacks: EngineCallbacks;

  private _isDragging = false;
  private mouseDown: {
    button: 'left' | 'middle' | 'right';
    position: Vec2;
  } | null = null;
  private _editorMode: EditorMode = 'select';

  private needsRedraw = false;
  private isRedrawRunning = false;

  private createdObject: Drawable | null = null;

  private camera: Camera;

  private objects = new Map<string, Drawable>();

  private _destroy = () => {};

  constructor(
    canvas: HTMLCanvasElement,
    container: HTMLElement,
    callbacks: EngineCallbacks
  ) {
    this.canvas = canvas;
    this.container = container;
    this.callbacks = callbacks;
    const ctx = canvas.getContext('2d', { alpha: false });

    if (!ctx) {
      throw new Error('Canvas context is not available');
    }

    this.ctx = ctx;

    this.resize();
    this.camera = new Camera(
      this.canvas.width,
      this.canvas.height,
      window.devicePixelRatio,
      () => {
        this.requestRedraw();
      }
    );
    const unsubscribe = this.setupEvents();

    this._destroy = () => {
      unsubscribe();
    };

    this.roughCanvas = rough.canvas(canvas);
    this.requestRedraw();
  }

  private _draw() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.camera.adjustRender(this.ctx);
    this.objects.forEach((object) => {
      return object.draw(this.roughCanvas);
    });
    this.ctx.restore();
  }

  private requestRedraw() {
    this.needsRedraw = true;
    if (!this.isRedrawRunning) {
      this.isRedrawRunning = true;
      requestAnimationFrame(() => {
        this.loop();
      });
    }
  }

  private loop() {
    if (this.needsRedraw) {
      this._draw();
      this.needsRedraw = false;
    }

    if (this.needsRedraw) {
      requestAnimationFrame(() => {
        this.loop();
      });
      return;
    }

    this.isRedrawRunning = false;
  }

  private get isDragging() {
    return this._isDragging;
  }

  private set isDragging(value: boolean) {
    this._isDragging = value;
    this.callbacks.onChangeIsDragging(value);
  }

  private get editorMode() {
    return this._editorMode;
  }

  private set editorMode(value: EditorMode) {
    this._editorMode = value;
    this.callbacks.onChangeEditorMode(value);
  }

  public zoomAt(at: Vec2, deltaY: number) {
    this.camera.zoomAt(at, deltaY);
    this.callbacks.onChangeZoom(this.camera.getZoom());
  }

  public setZoom(newZoom: number) {
    this.camera.setZoom(newZoom);
    this.callbacks.onChangeZoom(newZoom);
  }

  public pan(delta: Vec2) {
    this.camera.pan(delta);
  }

  public changeEditorMode(newMode: EditorMode) {
    this.editorMode = newMode;
  }

  public changeObjectStyle(
    objectId: string,
    newStyle: Partial<Drawable['style']>
  ) {
    const object = this.objects.get(objectId);

    if (!object) {
      return;
    }

    object.style = { ...object.style, ...newStyle };
    this.callbacks.onChangeSelectedObject(object);
    this.requestRedraw();
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

    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.canvas.width = width * window.devicePixelRatio;
    this.canvas.height = height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  private getKeyboardEvent(e: KeyboardEvent) {
    const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMacOS ? e.metaKey : e.ctrlKey;
    const shiftKey = e.shiftKey;
    const key = e.key;

    return {
      key,
      modifiers: {
        ctrlKey,
        shiftKey,
      },
    };
  }

  private getMouseEvent(e: MouseEvent) {
    const BUTTON_TYPES = ['left', 'middle', 'right'] as const;
    const button = BUTTON_TYPES[e.button];
    const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMacOS ? e.metaKey : e.ctrlKey;
    const shiftKey = e.shiftKey;

    const x = e.clientX - this.canvas.offsetLeft;
    const y = e.clientY - this.canvas.offsetTop;
    const position = Vec2.create(x, y);
    const movement = Vec2.create(e.movementX, e.movementY);

    return {
      button,
      position,
      movement,
      modifiers: {
        ctrlKey,
        shiftKey,
      },
    };
  }

  private getWheelEvent(e: WheelEvent) {
    const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMacOS ? e.metaKey : e.ctrlKey;
    const shiftKey = e.shiftKey;

    const x = e.clientX - this.canvas.offsetLeft;
    const y = e.clientY - this.canvas.offsetTop;
    const position = Vec2.create(x, y);

    return {
      deltaY: e.deltaY,
      position,
      modifiers: {
        ctrlKey,
        shiftKey,
      },
    };
  }

  private onKeyDown(event: KeyboardEvent) {
    const options = this.getKeyboardEvent(event);

    if (this.mouseDown) {
      return;
    }

    if (options.key === ' ' && !options.modifiers.ctrlKey) {
      event.preventDefault();
      this.isDragging = true;
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    const options = this.getKeyboardEvent(event);

    if (options.key === ' ') {
      event.preventDefault();
      this.isDragging = false;
    }
  }

  private onMouseDown(e: MouseEvent) {
    const options = this.getMouseEvent(e);

    this.mouseDown = { button: options.button, position: options.position };

    if (options.button === 'right') {
      return;
    }

    if (options.button === 'middle') {
      return;
    }
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.mouseDown) {
      return;
    }

    const options = this.getMouseEvent(e);

    if (this.mouseDown.button === 'right') {
      return;
    }

    if (this.mouseDown.button === 'middle') {
      return;
    }

    if (this.isDragging) {
      this.camera.pan(Vec2.mulScalar(options.movement, -1));
      return;
    }

    if (this.editorMode === 'rectangle') {
      const position = this.camera.viewportToWorld(options.position);
      const distance = Vec2.distance(position, this.mouseDown.position);

      if (!this.createdObject) {
        if (distance < 10) {
          return;
        }

        // this.makeRectangle();
      }
    }
  }

  private onMouseUp(e: MouseEvent) {
    const options = this.getMouseEvent(e);

    if (options.button !== this.mouseDown?.button) {
      return;
    }

    this.mouseDown = null;

    if (options.button === 'right') {
      return;
    }

    if (options.button === 'middle') {
      return;
    }

    if (this.isDragging) {
      return;
    }

    const position = this.camera.viewportToWorld(options.position);

    const newId = this.uid();
    const object = new Rect(newId, Vec2.create(position.x, position.y), 50, 50);
    this.objects.set(newId, object);
    this.callbacks.onChangeSelectedObject(object);
    this.requestRedraw();
  }

  private onWheel(e: WheelEvent) {
    const options = this.getWheelEvent(e);

    if (options.modifiers.ctrlKey) {
      e.preventDefault();

      const position = this.camera.viewportToWorld(options.position);
      this.zoomAt(position, options.deltaY);
    }
  }

  private setupEvents() {
    const onResize = () => {
      this.resize();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      this.onKeyDown(e);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      this.onKeyUp(e);
    };

    const onMouseDown = (e: MouseEvent) => {
      this.onMouseDown(e);
    };

    const onMouseMove = (e: MouseEvent) => {
      this.onMouseMove(e);
    };

    const onMouseUp = (e: MouseEvent) => {
      this.onMouseUp(e);
    };

    const onWheel = (e: WheelEvent) => {
      this.onWheel(e);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('wheel', onWheel, { passive: false });
    this.canvas.addEventListener('mousedown', onMouseDown);
    this.canvas.addEventListener('mousemove', onMouseMove);
    this.canvas.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('wheel', onWheel);
      this.canvas.removeEventListener('mousedown', onMouseDown);
      this.canvas.removeEventListener('mousemove', onMouseMove);
      this.canvas.removeEventListener('mouseup', onMouseUp);
    };
  }
}
