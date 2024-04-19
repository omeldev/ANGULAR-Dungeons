import {Position} from "./position";
import {Velocity} from "./velocity";
import {Sprite} from "./sprite";
import {GameComponent} from "../game/game.component";

export class Player {
  private readonly sprite: Sprite;
  private position: Position;
  private velocity: Velocity;

  private width = 100;
  private height = 100;

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

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public setWidth(width: number): void {
    this.width = width;
  }

  public setHeight(height: number): void {
    this.height = height;
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

  public draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = 'black';
    context.fillRect(this.getPosition().getX(), this.getPosition().getY(), this.getWidth(), this.getHeight());
  }

  public update(context: CanvasRenderingContext2D): void {

    this.move();

    this.getVelocity().setY(1);
    
    if (this.getPosition().getY() + this.getHeight() >= GameComponent.canvasHeight) {
      this.getVelocity().setY(0);
    }

    this.draw(context);


  }


}
