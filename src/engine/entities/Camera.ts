import { Vec2 } from '../math/matrix';

export class Camera {
  private position: Vec2;
  private zoom: number;
  private clientWidth: number;
  private clientHeight: number;
  private devicePixelRatio: number;

  constructor(
    clientWidth: number,
    clientHeight: number,
    devicePixelRatio: number
  ) {
    this.position = Vec2.create(0, 0);
    this.zoom = 1;
    this.clientWidth = clientWidth;
    this.clientHeight = clientHeight;
    this.devicePixelRatio = devicePixelRatio;
  }

  public pan(delta: Vec2) {
    this.position = Vec2.add(
      this.position,
      Vec2.mulScalar(delta, 1 / this.zoom)
    );
  }

  private round(num: number) {
    return Math.round(num * 100) / 100;
  }

  public zoomIn() {
    this.zoom = this.round(this.zoom * 1.1);
  }

  public zoomOut() {
    this.zoom = this.round(this.zoom / 1.1);
  }

  public getZoom() {
    return this.zoom;
  }

  public setZoom(newZoom: number) {
    this.zoom = this.round(newZoom);
  }

  public viewportToWorld(viewportCoords: Vec2) {
    const px = viewportCoords.x * this.devicePixelRatio;
    const py = viewportCoords.y * this.devicePixelRatio;

    // Origin is at the center of the viewport
    const translatedX = px - (this.clientWidth * this.devicePixelRatio) / 2;
    const translatedY = py - (this.clientHeight * this.devicePixelRatio) / 2;

    const scaledX = translatedX / this.zoom;
    const scaledY = translatedY / this.zoom;

    const worldX = scaledX - this.position.x;
    const worldY = scaledY - this.position.y;

    return { x: worldX, y: worldY };
  }

  worldToViewport(worldCoords: Vec2): Vec2 {
    const translatedX = worldCoords.x + this.position.x;
    const translatedY = worldCoords.y + this.position.y;

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
    ctx.translate(this.position.x, this.position.y);
  }
}
