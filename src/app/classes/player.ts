import {Position} from "./position";
import {Velocity} from "./velocity";
import {Sprite} from "./sprite";
import {GameComponent} from "../components/game/game.component";
import {PlayerSide, Side} from "./sides";
import {isKeyPressed} from "../listener/keystroke";
import {level1} from "../levels/levels";
import {CollisionBlock} from "./collision/CollisionBlock";

export class Player {
  private readonly sprite: Sprite;
  private position: Position;
  private velocity: Velocity;

  private sides: { top: PlayerSide, bottom: PlayerSide, left: PlayerSide, right: PlayerSide };

  private MAX_SPEED = 3;
  private JUMP_STRENGTH = 5;

  constructor(position: Position, sprite: Sprite) {
    this.sprite = sprite;
    this.sprite.getScale().setScale(3);

    this.position = position;
    this.velocity = new Velocity(0, 0);
    this.sides = {
      top: new PlayerSide(Side.TOP, this.position),
      right: new PlayerSide(Side.RIGHT, new Position(this.position.getX() + this.getWidth(), this.position.getY())),
      bottom: new PlayerSide(Side.BOTTOM, new Position(this.position.getX(), this.position.getY() + this.getHeight())),
      left: new PlayerSide(Side.LEFT, new Position(this.position.getX(), this.position.getY()))
    };

  }

  public getBottomSide(): PlayerSide {
    return this.sides.bottom;
  }

  public getTopSide(): PlayerSide {
    return this.sides.top;
  }

  public getRightSide(): PlayerSide {
    return this.sides.right;
  }

  public getLeftSide(): PlayerSide {
    return this.sides.left;
  }

  public getSprite(): Sprite {
    return this.sprite;
  }

  public getPosition(): Position {
    return this.position;
  }

  public getWidth(): number {
    return this.sprite.getWidth();
  }

  public getHeight(): number {
    return this.sprite.getHeight()
  }

  public setWidth(width: number): void {
    this.sprite.setWidth(width);
  }

  public setHeight(height: number): void {
    this.sprite.setHeight(height);
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
    return this.getBottomSide().getPosition().getY() >= GameComponent.canvasHeight;
  }

  public move(): void {
    this.position.setX(this.position.getX() + this.velocity.getX());
    this.position.setY(this.position.getY() + this.velocity.getY());
    this.getBottomSide().getPosition().setY(this.getPosition().getY() + this.getHeight());
    this.getRightSide().getPosition().setX(this.getPosition().getX() + this.getWidth());
    this.getLeftSide().getPosition().setX(this.getPosition().getX());
    this.getTopSide().getPosition().setY(this.getPosition().getY());


    if (isKeyPressed('w') && this.isOnGround()) {
      this.getVelocity().setY(-this.JUMP_STRENGTH);
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
      this.getVelocity().setX(-this.MAX_SPEED);
    }

    if (isKeyPressed('d')) {
      //if(this.getVelocity().getX() >= this.MAX_SPEED) this.getVelocity().setX(this.MAX_SPEED);
      this.getVelocity().setX(this.MAX_SPEED);
    }

    if (this.isOnGround() && !isKeyPressed('w')) {
      this.getVelocity().setY(0);
      this.getPosition().setY(GameComponent.canvasHeight - this.getHeight());

    } else this.getVelocity().setY(this.getVelocity().getY() + 0.05);







  }


  public draw(context: CanvasRenderingContext2D): void {
    this.sprite.update(context, this.position);
  }

  public update(context: CanvasRenderingContext2D): void {

    this.move();
    this.draw(context);


  }


}
