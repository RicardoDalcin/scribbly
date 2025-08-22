export class Vec2 {
  x: number;
  y: number;

  private constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static create(x: number, y: number) {
    return new Vec2(x, y);
  }

  static add(a: Vec2, b: Vec2) {
    return new Vec2(a.x + b.x, a.y + b.y);
  }

  static sub(a: Vec2, b: Vec2) {
    return new Vec2(a.x - b.x, a.y - b.y);
  }

  static mulScalar(a: Vec2, scalar: number) {
    return new Vec2(a.x * scalar, a.y * scalar);
  }
}
