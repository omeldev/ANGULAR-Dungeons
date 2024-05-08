import {Position} from "../../entitiy/position";
import {Scale} from "../../entitiy/scale";

export class Hitbox {
  private position: Position;
  private width: number;
  private height: number;

  constructor(position: Position, width: number, height: number, scale: Scale = new Scale(1)) {
    this.position = new Position(position.getX(), position.getY());
    this.width = width;
    this.height = height;
  }

  public getPosition(): Position {
    return this.position;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public setPosition(position: Position): void {
    this.position.setY(position.getY());
    this.position.setX(position.getX());
  }

  public setWidth(width: number): void {
    this.width = width;
  }

  public setHeight(height: number): void {
    this.height = height;
  }

  public draw(context: CanvasRenderingContext2D): void {
    //green
    context.fillStyle = "rgba(0, 255, 0, 0.5)";
    context.fillRect(this.position.getX(), this.position.getY(), this.width, this.height);
  }

  public collidesWith(hitbox: Hitbox): boolean {
    return this.position.getX() <= hitbox.getPosition().getX() + hitbox.getWidth() &&
      this.position.getX() + this.width >= hitbox.getPosition().getX() &&
      this.position.getY() + this.height >= hitbox.getPosition().getY() &&
      this.position.getY() <= hitbox.getPosition().getY() + hitbox.getHeight();
  }


}
