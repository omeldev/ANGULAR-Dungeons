import {Position} from "./position";
import {Velocity} from "./velocity";
import {Sprite} from "./sprite";

export class Player {
  private readonly sprite: Sprite;
  private position: Position;
  private velocity: Velocity;

  constructor(position: Position, sprite: Sprite) {
    this.sprite = sprite;
    this.position = position;
    this.velocity = new Velocity(0, 0);
  }

  public getSprite(): Sprite {
    return this.sprite;
  }

  public getPosition(): Position {
    return this.position;
  }

  public getVelocity(): Velocity {
    return this.velocity;
  }

  public setPosition(position: Position): void {
    this.position = position;
  }

  public setVelocity(velocity: Velocity): void {
    this.velocity = velocity;
  }

  public move(): void {
    this.position.setX(this.position.getX() + this.velocity.getX());
    this.position.setY(this.position.getY() + this.velocity.getY());
  }

  public draw(): void {

  }

  public update(): void {
    this.move();
    this.draw()
  }



}
