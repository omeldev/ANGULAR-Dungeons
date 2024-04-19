import {Position} from "./position";
import {Velocity} from "./velocity";
import {Sprite} from "./sprite";
import {GameComponent} from "../game/game.component";
import {PlayerSide, Side} from "./sides";

export class Player {
  private readonly sprite: Sprite;
  private position: Position;
  private velocity: Velocity;

  private width = 100;
  private height = 100;

  private sides: PlayerSide[];

  constructor(position: Position, sprite: Sprite) {
    this.sprite = sprite;
    this.position = position;
    this.velocity = new Velocity(0, 0);
    this.sides = [
      new PlayerSide(Side.TOP, this.position.getY()),
      new PlayerSide(Side.RIGHT, this.position.getX() + this.width),
      new PlayerSide(Side.BOTTOM, this.position.getY() + this.height),
      new PlayerSide(Side.LEFT, this.position.getX())
    ];
  }

  public getBottomSide(): PlayerSide {
    return this.sides.find(side => side.getSide() === Side.BOTTOM)!;
  }

  public getTopSide(): PlayerSide {
    return this.sides.find(side => side.getSide() === Side.TOP)!;
  }

  public getRightSide(): PlayerSide {
    return this.sides.find(side => side.getSide() === Side.RIGHT)!;
  }

  public getLeftSide(): PlayerSide {
    return this.sides.find(side => side.getSide() === Side.LEFT)!;
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

    if (this.getBottomSide().getPosition() >= GameComponent.canvasHeight) {
      this.getVelocity().setY(0);
    } else this.getVelocity().setY(this.getVelocity().getY() + 0.05);

    this.move();
    this.draw(context);

    this.getBottomSide().setPosition(this.getPosition().getY() + this.getHeight());


  }


}