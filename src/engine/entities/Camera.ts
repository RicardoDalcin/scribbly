import { Vec2 } from '../math/matrix';

export class Camera {
  private readonly MIN_ZOOM = 0.1;
  private readonly MAX_ZOOM = 30;
  private readonly ZOOM_STEP = 0.1;

  private position: Vec2;
  private zoom: number;
  private clientWidth: number;
  private clientHeight: number;
  private devicePixelRatio: number;

  private requestRedraw: () => void;

  constructor(
    clientWidth: number,
    clientHeight: number,
    devicePixelRatio: number,
    requestRedraw: () => void
  ) {
    this.position = Vec2.create(0, 0);
    this.zoom = 1;
    this.clientWidth = clientWidth;
    this.clientHeight = clientHeight;
    this.devicePixelRatio = devicePixelRatio;
    this.requestRedraw = requestRedraw;
  }

  public pan(delta: Vec2) {
    this.position = Vec2.add(this.position, this.viewportToWorldDelta(delta));
    this.requestRedraw();
  }

  public viewportToWorldDelta(viewportDelta: Vec2) {
    return Vec2.mulScalar(viewportDelta, 1 / this.zoom);
  }

  private round(num: number) {
    return Math.round(num * 100) / 100;
  }

  public zoomAt(pivot: Vec2, deltaY: number) {
    const oldZoom = this.zoom;

    const sign = Math.sign(deltaY);
    const MAX_STEP = this.ZOOM_STEP * 100; // e.g. if ZOOM_STEP = 0.01 → MAX_STEP = 1
    const absDelta = Math.abs(deltaY);

    const delta = absDelta > MAX_STEP ? MAX_STEP * sign : deltaY;

    let newZoom = oldZoom - delta / 100;

    newZoom +=
      Math.log10(Math.max(1, oldZoom)) * -sign * Math.min(1, absDelta / 20);

    newZoom = Math.max(0.1, Math.min(10, newZoom));

    this.position = {
      x: pivot.x - (pivot.x - this.position.x) * (oldZoom / newZoom),
      y: pivot.y - (pivot.y - this.position.y) * (oldZoom / newZoom),
    };

    this.zoom = newZoom;
    this.requestRedraw();
  }

  public getZoom() {
    return this.zoom;
  }

  public setZoom(newZoom: number) {
    this.zoom = this.round(newZoom);
    this.requestRedraw();
  }

  public viewportToWorld(viewportCoords: Vec2): Vec2 {
    const px = viewportCoords.x * this.devicePixelRatio;
    const py = viewportCoords.y * this.devicePixelRatio;

    const translatedX = px - (this.clientWidth * this.devicePixelRatio) / 2;
    const translatedY = py - (this.clientHeight * this.devicePixelRatio) / 2;

    const scaledX = translatedX / this.zoom;
    const scaledY = translatedY / this.zoom;

    const worldX = scaledX + this.position.x;
    const worldY = scaledY + this.position.y;

    return { x: worldX, y: worldY };
  }

  public worldToViewport(worldCoords: Vec2): Vec2 {
    const translatedX = worldCoords.x - this.position.x;
    const translatedY = worldCoords.y - this.position.y;

    const scaledX = translatedX * this.zoom;
    const scaledY = translatedY * this.zoom;

    const px = scaledX + (this.clientWidth * this.devicePixelRatio) / 2;
    const py = scaledY + (this.clientHeight * this.devicePixelRatio) / 2;

    const viewportX = px / this.devicePixelRatio;
    const viewportY = py / this.devicePixelRatio;

    return { x: viewportX, y: viewportY };
  }

  public adjustRender(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(this.devicePixelRatio, this.devicePixelRatio);

    // Position origin at the center of the viewport
    ctx.translate(this.clientWidth / 2, this.clientHeight / 2);

    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.position.x, -this.position.y);
  }
}
