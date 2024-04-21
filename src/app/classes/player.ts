import {Position} from "./position";
import {Velocity} from "./velocity";
import {Sprite} from "./sprite";
import {GameComponent} from "../components/game/game.component";
import {PlayerSide, Side} from "./sides";
import {level1} from "../levels/levels";
import {CollisionBlock} from "./collision/CollisionBlock";
import {isKeyPressed} from "../listener/keystroke";
import {Level} from "./level";

export class Player {
  private readonly sprite: Sprite;
  private position: Position;
  private velocity: Velocity;

  private sides: { top: PlayerSide, bottom: PlayerSide, left: PlayerSide, right: PlayerSide };

  private MAX_SPEED = 3;
  private JUMP_STRENGTH = 2.8;
  private GRAVITY: number = 0.05;
  private currentLevel: Level;

  constructor(position: Position, sprite: Sprite) {
    this.sprite = sprite;
    this.sprite.getScale().setScale(2);

    this.position = position;
    this.velocity = new Velocity(0, 0);
    this.sides = {
      top: new PlayerSide(Side.TOP, this.position),
      right: new PlayerSide(Side.RIGHT, new Position(this.position.getX() + this.getWidth(), this.position.getY())),
      bottom: new PlayerSide(Side.BOTTOM, new Position(this.position.getX(), this.position.getY() + this.getHeight())),
      left: new PlayerSide(Side.LEFT, new Position(this.position.getX(), this.position.getY()))
    };

    this.currentLevel = level1;

  }


  public getCurrentLevel(): Level {
    return this.currentLevel;
  }

  public setCurrentLevel(level: Level): void {
    this.currentLevel = level;
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


    if (isKeyPressed('w')) {
      if (this.getVelocity().getY() === 0) {
        this.getVelocity().setY(-this.JUMP_STRENGTH);
      }
    }

    this.velocity.setX(0);
    if(isKeyPressed('a')) {
      this.velocity.setX(-this.MAX_SPEED);
    }

    if(isKeyPressed('d')) {
      this.velocity.setX(this.MAX_SPEED);
    }


    this.position.setX(this.position.getX() + this.velocity.getX());
    this.getBottomSide().getPosition().setY(this.getPosition().getY() + this.getHeight());
    this.getRightSide().getPosition().setX(this.getPosition().getX() + this.getWidth());
    this.getLeftSide().getPosition().setX(this.getPosition().getX());
    this.getTopSide().getPosition().setY(this.getPosition().getY());


    //Gravity

    this.checkHorizontalCollisions();
    this.applyGravity();
    this.checkVerticalCollisions();



    if(this.isOnGround()) {
      this.velocity.setY(0);
      this.position.setY(GameComponent.canvasHeight - this.getHeight());
    }

  }

  public applyGravity(): void {
    this.velocity.setY(this.getVelocity().getY() + this.GRAVITY);
    this.position.setY(this.getPosition().getY() + this.getVelocity().getY());

  }

  public checkVerticalCollisions() {
    for (let i = 0; i < this.getCurrentLevel().getCollisionBlocks().length; i++) {
      const block = this.getCurrentLevel().getCollisionBlocks()[i];
      if (!this.checkForCollision(block)) continue;
      const offset = 0.01;

      if (this.getVelocity().getY() < 0) {
        this.position.setY(block.getPosition().getY() + block.getHeight() + offset);
        break;
      }

      if (this.getVelocity().getY() > 0) {
        this.velocity.setY(0);
        this.position.setY(block.getPosition().getY() - this.getHeight() - offset);
        break;
      }

    }

  }

  public checkForCollision(block: CollisionBlock): boolean {
    return this.getPosition().getX() <= block.getPosition().getX() + block.getWidth() &&
      this.getPosition().getX() + this.getWidth() >= block.getPosition().getX() &&
      this.getPosition().getY() + this.getHeight() >= block.getPosition().getY() &&
      this.getPosition().getY() <= block.getPosition().getY() + block.getHeight();
  }

  public checkHorizontalCollisions() {

    for (let i = 0; i < this.getCurrentLevel().getCollisionBlocks().length; i++) {

      const block = this.getCurrentLevel().getCollisionBlocks()[i];
      if (!this.checkForCollision(block)) continue;

      console.log("collision detected");
      const offset = 0.01;
      if (this.getVelocity().getX() < 0) {
        this.velocity.setX(0);
        this.position.setX(block.getPosition().getX() + block.getWidth() + offset);
        break;
      }

      if (this.getVelocity().getX() > 0) {
        this.velocity.setX(0);
        this.position.setX(block.getPosition().getX() - this.getWidth() - offset);
        break;
      }

    }

  }

  public draw(context: CanvasRenderingContext2D): void {
    this.sprite.update(context, this.position);
    this.drawHitbox(context);
  }

  public drawHitbox(context: CanvasRenderingContext2D): void {
    context.fillStyle = "rgba(240, 52, 52, 0.3)";
    context.fillRect(this.position.getX(), this.position.getY(), this.getWidth(), this.getHeight());
  }

  public update(context: CanvasRenderingContext2D): void {
    this.draw(context);
    this.move();
  }


}
