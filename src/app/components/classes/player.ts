import {Position} from "./position";
import {Velocity} from "./velocity";
import {Sprite} from "./sprite";
import {GameComponent} from "../game/game.component";
import {PlayerSide, Side} from "./sides";
import {isKeyPressed} from "../listener/keystroke";

export class Player {
  private readonly sprite: Sprite;
  private position: Position;
  private velocity: Velocity;

  private width = 100;
  private height = 100;

  private sides: PlayerSide[];

  private MAX_SPEED = 5;

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

  public isOnGround(): boolean {
    return this.getBottomSide().getPosition() >= GameComponent.canvasHeight;
  }

  public move(): void {
    this.position.setX(this.position.getX() + this.velocity.getX());
    this.position.setY(this.position.getY() + this.velocity.getY());


    if (isKeyPressed('w') && this.getBottomSide().getPosition() >= GameComponent.canvasHeight) {
      this.getVelocity().setY(-3);
    }
    if ((!isKeyPressed('a') || !isKeyPressed('d')) && this.isOnGround()) {
      this.getVelocity().setX(0);
    } else {
      if (this.getVelocity().getX() !== 0) {
        this.getVelocity().setX(this.getVelocity().getX() + (Math.sign(this.getVelocity().getX()) == -1 ? 0.01 : -0.01));
      }
    }


    //TODO Acceleration
    if (isKeyPressed('a')) {
      //if(this.getVelocity().getX() <= this.MAX_SPEED * -1) this.getVelocity().setX(this.MAX_SPEED * -1);

      this.getVelocity().setX(this.MAX_SPEED * -1);
    }

    if (isKeyPressed('d')) {
      //if(this.getVelocity().getX() >= this.MAX_SPEED) this.getVelocity().setX(this.MAX_SPEED);
      this.getVelocity().setX(this.MAX_SPEED);
    }


    if (this.getBottomSide().getPosition() >= GameComponent.canvasHeight && !isKeyPressed('w')) {
      this.getVelocity().setY(0);
    } else this.getVelocity().setY(this.getVelocity().getY() + 0.05);


    console.log(this.position.getX(), this.position.getY());
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = 'black';
    context.fillRect(this.getPosition().getX(), this.getPosition().getY(), this.getWidth(), this.getHeight());
  }

  public update(context: CanvasRenderingContext2D): void {

    this.move();
    this.draw(context);

    this.getBottomSide().setPosition(this.getPosition().getY() + this.getHeight());


  }


}
