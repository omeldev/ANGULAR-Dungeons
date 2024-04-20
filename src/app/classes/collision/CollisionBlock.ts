import {Position} from "../position";
import {Player} from "../player";

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

  public collidesWith(pl: Player) {
    const x = pl.getSprite().getX(), y = pl.getSprite().getY();
    const width = pl.getWidth(), height = pl.getHeight();
    if (x + width > this.position.getX() && x < this.position.getX() + this.width) {
      console.log("collided")

      return true;
    }
    if (y + height > this.position.getY() && y < this.position.getY() + this.height) {
      console.log("collided")
      return true;
    }
    return false;
  }

  public collidesHorizontallyWith(pl: Player) {
    if (
      pl.getPosition().getX() <=
      this.position.getX() + this.width &&
      pl.getPosition().getX() + this.width >=
      this.position.getX() &&
      pl.getPosition().getY() + this.height >=
      this.position.getY() &&
      pl.getPosition().getY() <=
      this.position.getY() + this.height
    ) {
      // collision on x axis going to the left
      pl.getVelocity().setY(0);
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
