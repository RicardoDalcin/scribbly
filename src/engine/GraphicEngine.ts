import type { Tool } from './types';
import rough from 'roughjs';

export class GraphicEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private container: HTMLElement;

  private tool: Tool = 'select';

  private _destroy = () => {};

  constructor(canvas: HTMLCanvasElement, container: HTMLElement) {
    this.canvas = canvas;
    this.container = container;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas context is not available');
    }

    this.ctx = ctx;

    this.resize();
    const unsubscribe = this.setupEvents();

    this._destroy = () => {
      unsubscribe();
    };

    const rc = rough.canvas(canvas);
    rc.rectangle(10, 10, 200, 200, {
      fill: 'blue',
    });
  }

  public changeTool(newTool: Tool) {
    this.tool = newTool;
  }

  public destroy() {
    this._destroy();
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

  private setupEvents() {
    const onResize = () => {
      this.resize();
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }
}
