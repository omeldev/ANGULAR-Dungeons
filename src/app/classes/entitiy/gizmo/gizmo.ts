import {Sprite} from "../sprite";
import {Hitbox} from "../../collision/hitbox";
import {Position} from "../position";
import {Velocity} from "../velocity";
import {CollisionBlock} from "../../collision/CollisionBlock";
import {GameComponent} from "../../../components/game/game.component";
import {Player} from "../player/player";

export abstract class Gizmo extends Sprite {
  public isFlying: boolean = false;
  protected speechBubbles: SpeechBubble[];

  private readonly SPEED = 100;
  private readonly JUMP_STRENGTH = 10;

  private readonly GRAVITY = 250;
  private readonly hitbox;
  private readonly velocity = new Velocity(0, 0);
  private pausedMovement = true;
  private lastDirection: Direction = Direction.RIGHT;


  private collide = {
    left: false,
    right: false,
    top: false,
    bottom: false
  }

  constructor(spriteSrc: string, position: Position, animations: any, frameRate: number = 6) {
    super(spriteSrc, position, () => {
      this.setWidth(this.getImage().width / frameRate);
      this.setHeight(this.getImage().height);

      this.getHitbox().setWidth(this.getWidth() - 13);
      this.getHitbox().setHeight(this.getHeight() - 5);
    }, frameRate, animations);
    this.hitbox = new Hitbox(this.getPosition(), this.getWidth(), this.getHeight());

    this.speechBubbles = [
      new SpeechBubble(SpeechBubbleType.SHOUT, this.getPosition(), 3, 8),
      new SpeechBubble(SpeechBubbleType.HELLO, this.getPosition(), 3, 8),
      new SpeechBubble(SpeechBubbleType.HI, this.getPosition(), 3, 8),
    ];
  }

  public collidesWithPlayer(player: Player): boolean {
    return this.hitbox.getPosition().getX() <= player.getHitbox().getPosition().getX() + player.getHitbox().getWidth() &&
      this.hitbox.getPosition().getX() + this.hitbox.getWidth() >= player.getHitbox().getPosition().getX() &&
      this.hitbox.getPosition().getY() + this.hitbox.getHeight() >= player.getHitbox().getPosition().getY() &&
      this.hitbox.getPosition().getY() <= player.getHitbox().getPosition().getY() + player.getHitbox().getHeight();
  }

  public switchSprite(name: string) {
    if (this.image === this.animations[name].image) return;
    this.currentFrame = 0;

    this.image = this.animations[name].image;
    this.frameRate = this.animations[name].frameRate;
    this.frameBuffer = this.animations[name].frameBuffer;
    this.loop = this.animations[name].loop;

    this.currentAnimation = this.animations[name];
    this.currentAnimation.isActive = false;
  }

  public pause: number = 0;
  public pauseBuffer = 3;

  public abstract onSwitch(context: CanvasRenderingContext2D, delta: number): void;
  public abstract onCollide(context: CanvasRenderingContext2D, delta: number): void;

  public update(context: CanvasRenderingContext2D, delta: number): void {

    if (this.pause >= this.pauseBuffer) {
      this.onSwitch(context, delta);
      this.pause = 0;
      this.pausedMovement = !this.pausedMovement;
      this.collide.left = false;
      this.collide.right = false;
      this.pauseBuffer = Math.random() * 3 + 1;
      const switchDirection = (Math.random() < 0.5);
      if (switchDirection) {
        this.lastDirection = this.lastDirection === Direction.LEFT ? Direction.RIGHT : Direction.LEFT;
        this.collide.left = false;
        this.collide.right = false;
      }
    } else {
      this.pause += delta;
    }

    this.updateHitbox(8, 4);
    this.checkHorizontalCollisions();
    this.applyGravity(delta);
    this.updateHitbox(8, 4);
    this.checkVerticalCollisions();

    if(this.collidesWithPlayer(GameComponent.getPlayer())) {
      this.onCollide(context, delta);
    }

    for (const bubble of this.speechBubbles) {
      bubble.getPosition().setY(this.getPosition().getY() - 10);
      bubble.getPosition().setX(this.getPosition().getX());
    }

    this.moveAi(context, delta);



  }

  private moveAi(context: CanvasRenderingContext2D, delta: number) {
    if (!this.pausedMovement) {

      if (!this.collide.left && !this.collide.right) {
        if (this.lastDirection === Direction.LEFT) {
          this.move(Direction.LEFT, delta);
          this.switchSprite('runLeft');
        } else if (this.lastDirection === Direction.RIGHT) {
          this.move(Direction.RIGHT, delta);
          this.switchSprite('runRight');
        }
      }
      if (this.collide.left) {
        this.move(Direction.RIGHT, delta);
        this.switchSprite('runRight');
      } else if (this.collide.right) {
        this.move(Direction.LEFT, delta);
        this.switchSprite('runLeft');
      }

    } else {
      this.switchSprite('idle');
    }
  }


  protected updateHitbox(offsetX: number, offsetY: number): void {

    this.hitbox.getPosition().setX(this.getPosition().getX() + offsetX);
    this.hitbox.getPosition().setY(this.getPosition().getY() + offsetY);



  }

  public applyGravity(delta: number): void {
    if(!this.isFlying) {
      this.velocity.setY(this.velocity.getY() + this.GRAVITY * delta);
      this.position.setY(this.position.getY() + this.velocity.getY() * delta);
    }

    if(this.position.getY() > GameComponent.canvasHeight){
      this.setPosition(GameComponent.getCurrentLevel().getSpawnPoint())
    }
  }


  public getHitbox() {
    return this.hitbox;
  }

  public checkForCollision(block: CollisionBlock): boolean {
    return this.hitbox.getPosition().getX() <= block.getPosition().getX() + block.getWidth() &&
      this.hitbox.getPosition().getX() + this.hitbox.getWidth() >= block.getPosition().getX() &&
      this.hitbox.getPosition().getY() + this.hitbox.getHeight() >= block.getPosition().getY() &&
      this.hitbox.getPosition().getY() <= block.getPosition().getY() + block.getHeight();
  }

  public checkHorizontalCollisions() {

    for (let i = 0; i < GameComponent.getCurrentLevel().getCollisionBlocks().length; i++) {

      const block = GameComponent.getCurrentLevel().getCollisionBlocks()[i];
      if (!this.checkForCollision(block)) continue;

      /**
       * Offset to prevent the player from getting stuck in the block
       */
      const collisionOffset = 0.01;
      if (this.velocity.getX() < -0) {
        this.velocity.setX(0);
        const offset = this.hitbox.getPosition().getX() - this.getPosition().getX();
        this.getPosition().setX(block.getPosition().getX() + block.getWidth() - offset + collisionOffset);
        this.collide.left = true;
        this.collide.right = false;
        break;
      }

      if (this.velocity.getX() > 0) {
        this.velocity.setX(0);
        const offset = this.hitbox.getPosition().getX() - this.getPosition().getX() + this.hitbox.getWidth();
        this.getPosition().setX(block.getPosition().getX() - offset - collisionOffset);
        this.collide.right = true;
        this.collide.left = false;
        break;
      }

    }

  }

  public checkVerticalCollisions() {
    for (let i = 0; i < GameComponent.getCurrentLevel().getCollisionBlocks().length; i++) {
      const block = GameComponent.getCurrentLevel().getCollisionBlocks()[i];
      if (!this.checkForCollision(block)) continue;

      /**
       * Offset to prevent the player from getting stuck in the block
       */
      const collisionOffset = 0.01;


      if (this.velocity.getY() < 0) {
        const offset = this.hitbox.getPosition().getY() - this.getPosition().getY();
        this.getPosition().setY(block.getPosition().getY() + block.getHeight() - offset + collisionOffset);
        break;
      }

      if (this.velocity.getY() > 0) {
        this.velocity.setY(0);
        const offset = this.hitbox.getPosition().getY() - this.getPosition().getY() + this.hitbox.getHeight();
        this.getPosition().setY(block.getPosition().getY() - offset - collisionOffset);
        break;
      }

    }

  }

  public move(direction: Direction, delta: number): void {
    this.getPosition().setX(this.getPosition().getX() + this.velocity.getX() * delta);
    this.lastDirection = direction;

    switch (direction) {
      case Direction.LEFT:
        this.velocity.setX(-this.SPEED);
        break;
      case Direction.RIGHT:
        this.velocity.setX(this.SPEED);
        break;
      case Direction.UP:
        this.velocity.setY(-this.JUMP_STRENGTH);
        break;
    }

  }

}

export class SpeechBubble extends Sprite {

    constructor(bubbleType: SpeechBubbleType, position: Position, frameRate: number, frameBuffer: number) {
      super(bubbleType.toString(), new Position(position.getX(), position.getY()), () => {}, frameRate);
      this.frameBuffer = frameBuffer;
      this.loop = true;
      this.autoPlay = true;

      this.getScale().setScale(1.5)


    }

    public show(context: CanvasRenderingContext2D, delta: number): void {

      context.save();
      this.drawSprite(context, delta);
      context.restore();
    }


}

export enum SpeechBubbleType {
  SHOUT = '../../../assets/sprites/messagebox/!!!In.png',
  HELLO = '../../../assets/sprites/messagebox/hello.png',
  HI = '../../../assets/sprites/messagebox/hi.png',
}

export enum Direction {
  LEFT = -1,
  RIGHT = 1,
  UP = 2
}
