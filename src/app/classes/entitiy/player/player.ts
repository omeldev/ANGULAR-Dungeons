import {Position} from "../position";
import {Velocity} from "../velocity";
import {Sprite} from "../sprite";
import {GameComponent} from "../../../components/game/game.component";
import {PlayerSide, Side} from "../sides";
import {CollisionBlock} from "../../collision/CollisionBlock";
import {isKeyPressed} from "../../../listener/keystroke";
import {Hitbox} from "../hitbox";

export class Player extends Sprite {
  private readonly sprite: Sprite;
  private readonly velocity: Velocity;

  private sides: { top: PlayerSide, bottom: PlayerSide, left: PlayerSide, right: PlayerSide };

  private MAX_SPEED = 350;
  private ACCELERATION = 400;
  private JUMP_STRENGTH = 600;
  private GRAVITY: number = 1200;

  constructor(sprite: Sprite) {
    super(sprite.getImage().src, sprite.getPosition());
    this.sprite = sprite;
    this.sprite.getScale().setScale(1.5);
    this.velocity = new Velocity(0, 0);

    this.sides = {
      top: new PlayerSide(Side.TOP, this.getPosition()),
      right: new PlayerSide(Side.RIGHT, new Position(this.getPosition().getX() + this.getSprite().getWidth(), this.getPosition().getY())),
      bottom: new PlayerSide(Side.BOTTOM, new Position(this.getPosition().getX(), this.getPosition().getY() + this.getSprite().getHeight())),
      left: new PlayerSide(Side.LEFT, new Position(this.getPosition().getX(), this.getPosition().getY()))
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


  public getVelocity(): Velocity {
    return this.velocity;
  }



  public move(delta: number): void {

    if (!isKeyPressed('a') && !isKeyPressed('d')) this.velocity.setX(0);
    if (isKeyPressed('a')) {
      if (this.velocity.getX() > -this.MAX_SPEED) {
        this.velocity.setX(this.velocity.getX() - this.ACCELERATION * delta);
      } else this.velocity.setX(-this.MAX_SPEED);
    }

    if (isKeyPressed('d')) {
      if (this.velocity.getX() < this.MAX_SPEED) {
        this.velocity.setX(this.velocity.getX() + this.ACCELERATION * delta);

      } else this.velocity.setX(this.MAX_SPEED);


    }


    this.getPosition().setX(this.getPosition().getX() + this.velocity.getX() * delta);
    /**
     * Update the sides
     */
    this.getBottomSide().getPosition().setY(this.getPosition().getY() + this.getSprite().getHeight());
    this.getRightSide().getPosition().setX(this.getPosition().getX() + this.getSprite().getWidth());
    this.getLeftSide().getPosition().setX(this.getPosition().getX());
    this.getTopSide().getPosition().setY(this.getPosition().getY());


    /**
     * Check for collisions
     */
    this.checkHorizontalCollisions();
    /**
     * Apply gravity
     */
    this.applyGravity(delta);
    this.checkVerticalCollisions();


    if (isKeyPressed('w') && this.getVelocity().getY() === 0) {
      this.getVelocity().setY(-this.JUMP_STRENGTH );
    }
  }

  public applyGravity(delta: number): void {
    this.velocity.setY(this.getVelocity().getY() + this.GRAVITY * delta);
    this.getPosition().setY(this.getPosition().getY() + this.getVelocity().getY() * delta);
   // this.hitbox.getPosition().setY(this.position.getY());

    if(this.getBottomSide().getPosition().getY() >= GameComponent.canvasHeight) {
      this.velocity.setY(0);
      this.setPosition(GameComponent.getCurrentLevel().getSpawnPoint());
    }

  }

  public checkVerticalCollisions() {
    for (let i = 0; i < GameComponent.getCurrentLevel().getCollisionBlocks().length; i++) {
      const block = GameComponent.getCurrentLevel().getCollisionBlocks()[i];
      if (!this.checkForCollision(block)) continue;
      const offset = 0.01;

      if (this.getVelocity().getY() < 0) {
        this.getPosition().setY(block.getPosition().getY() + block.getHeight() + offset);
        break;
      }

      if (this.getVelocity().getY() > 0) {
        this.getVelocity().setY(0);
        this.getPosition().setY(block.getPosition().getY() - this.getSprite().getHeight() - offset);
        break;
      }

    }

  }

  public checkForCollision(block: CollisionBlock): boolean {
    return this.getPosition().getX() <= block.getPosition().getX() + block.getWidth() &&
      this.getPosition().getX() + this.getSprite().getWidth() >= block.getPosition().getX() &&
      this.getPosition().getY() + this.getSprite().getHeight() >= block.getPosition().getY() &&
      this.getPosition().getY() <= block.getPosition().getY() + block.getHeight();
  }

  public checkHorizontalCollisions() {

    for (let i = 0; i < GameComponent.getCurrentLevel().getCollisionBlocks().length; i++) {

      const block = GameComponent.getCurrentLevel().getCollisionBlocks()[i];
      if (!this.checkForCollision(block)) continue;

      console.log("collision detected");
      const offset = 0.01;
      if (this.getVelocity().getX() < 0) {
        this.getVelocity().setX(0);
        this.getPosition().setX(block.getPosition().getX() + block.getWidth() + offset);
        break;
      }

      if (this.getVelocity().getX() > 0) {
        this.getVelocity().setX(0);
        this.getPosition().setX(block.getPosition().getX() - this.getSprite().getWidth() - offset);
        break;
      }

    }

  }

  public draw(context: CanvasRenderingContext2D): void {

    if (!GameComponent.productionMode) {
      this.drawSpriteBox(context);
    }

    this.getSprite().drawSprite(context);
  }

  public drawSpriteBox(context: CanvasRenderingContext2D): void {
    context.fillStyle = "rgba(240, 52, 52, 0.3)";
    context.fillRect(this.getPosition().getX(), this.getPosition().getY(), this.getSprite().getWidth(), this.getSprite().getHeight());
  }

  public update(context: CanvasRenderingContext2D, delta: number): void {
    this.move(delta);
  }


}

