import {Position} from "../entitiy/position";
import {Player} from "../entitiy/player/player";

export class CollisionBlock {
  private position: Position;
  private readonly width: number = 63;
  private readonly height: number = 63;

  constructor(position: Position, width?: number, height?: number) {
    this.position = position;
    if (width) {
      this.width = width;
    }
    if (height) {
      this.height = height;
    }
  }


  public getPosition(): Position {
    return this.position;
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = "rgba(240, 52, 52, 0.3)";
    context.fillRect(this.position.getX(), this.position.getY(), this.width, this.height);
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;

  }
}
