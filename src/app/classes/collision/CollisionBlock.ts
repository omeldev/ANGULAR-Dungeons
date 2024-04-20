import {Position} from "../position";

export class CollisionBlock {
  private position: Position;
  private width: number = 64;
  private height: number = 64;

  constructor(position: Position, width?: number, height?: number) {
    this.position = position;
    if (width) {
      this.width = width;
    }
    if (height) {
      this.height = height;
    }
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = "rgba(240, 52, 52, 0.3)";
    context.fillRect(this.position.getX(), this.position.getY(), this.width, this.height);
  }
}