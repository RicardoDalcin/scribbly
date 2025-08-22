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
    this.position = Vec2.add(this.position, delta);
  }

  public zoomIn() {
    this.zoom *= 1.1;
  }

  public zoomOut() {
    this.zoom /= 1.1;
  }

  public getWorldPosition(position: Vec2) {
    throw new Error('Method not implemented.');
  }
}
