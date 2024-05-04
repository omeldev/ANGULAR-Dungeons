import {Position} from "../position";
import {Velocity} from "../velocity";
import {Sprite} from "../sprite";
import {GameComponent} from "../../../components/game/game.component";
import {CollisionBlock} from "../../level/collision/CollisionBlock";
import {isKeyPressed} from "../../../listener/keystroke";
import {Coin} from "../../collectibles/coin/coin";
import {Hitbox} from "../../level/collision/hitbox";
import {Key} from "../../collectibles/key/key";
import {Shine} from "../../collectibles/shines/shine";
import {GameAudio} from "../../audio/audio";
import {HealthPotion} from "../../collectibles/potion/potion";
import {Healthbar} from "../../gui/bar/healthbar";
import {Ladder} from "../../level/collision/ladderblock";

export class Player extends Sprite {
  public lastDirection: string = 'right';
  public preventInput = false;
  public isAttacking = false;
  public attackCooldown = 0;
  public collectedKeys: number = 0;
  public collectedShines: number = 0;
  public isOnLadder = false;
  public health: number = 100;
  public healthbar: Healthbar = new Healthbar(new Position(0, 200));
  public maxHealth: number = 100;
  public attackBox: Hitbox;
  protected MAX_SPEED = 350;
  protected ACCELERATION = 500;
  protected JUMP_STRENGTH = 450;
  protected GRAVITY: number = 350;
  protected MAX_GRAVITY: number = 500;
  private readonly velocity: Velocity;
  private readonly hitbox: Hitbox;
  collectedCoins: number = 0;
  private collisionDone = new Set<Hitbox>;
  isReceivingDamage: boolean = false;
  isOnGround: boolean = false;

  /**
   * Create a new player
   * @param spriteSrc
   * @param animations
   */
  constructor() {
    super('../../../assets/sprites/player/animation/idle.png', new Position(356, 250), () => {
    }, 11, {
      idleRight: {
        frameRate: 11,
        frameBuffer: 4,
        loop: true,
        imageSrc: '../../../assets/sprites/player/animation/idle.png'
      },
      idleLeft: {
        frameRate: 11,
        frameBuffer: 4,
        loop: true,
        imageSrc: '../../../assets/sprites/player/animation/idleLeft.png'

      },
      runRight: {
        frameRate: 8,
        frameBuffer: 4,
        loop: true,
        imageSrc: '../../../assets/sprites/player/animation/runRight.png'

      },
      runLeft: {
        frameRate: 8,
        frameBuffer: 4,
        loop: true,
        imageSrc: '../../../assets/sprites/player/animation/runLeft.png'

      },
      enterDoor: {
        frameRate: 8,
        frameBuffer: 12,
        loop: false,
        imageSrc: '../../../assets/sprites/player/animation/enterDoor.png',
        onComplete: () => {
          GameComponent.levelChange();
          GameComponent.player.preventInput = false;
        }
      },
      leaveDoor: {
        frameRate: 8,
        frameBuffer: 12,
        loop: false,
        imageSrc: '../../../assets/sprites/player/animation/leaveDoor.png',
        onComplete: () => {
          GameComponent.player.preventInput = false;
        }
      },
      attackRight: {
        frameRate: 3,
        frameBuffer: 12,
        loop: false,
        imageSrc: '../../../assets/sprites/player/animation/attackRight.png',
        onComplete: () => {
          GameComponent.player.isAttacking = false;
          this.onAttackDone();
        }
      },
      attackLeft: {
        frameRate: 3,
        frameBuffer: 12,
        loop: false,
        imageSrc: '../../../assets/sprites/player/animation/attackLeft.png',
        onComplete: () => {
          GameComponent.player.isAttacking = false;
          this.onAttackDone();
        }
      },
      hitRight: {
        frameRate: 2,
        frameBuffer: 14,
        loop: false,
        imageSrc: '../../../assets/sprites/player/animation/hitRight.png',
        onComplete: () => {
          GameComponent.player.isReceivingDamage = false;

        }
      },
      hitLeft: {
        frameRate: 2,
        frameBuffer: 14,
        loop: false,
        imageSrc: '../../../assets/sprites/player/animation/hitLeft.png',
        onComplete: () => {
          GameComponent.player.isReceivingDamage = false;

        }
      },
      fallRight: {
        frameRate: 1,
        frameBuffer: 1,
        loop: false,
        imageSrc: '../../../assets/sprites/player/animation/fallRight.png'
      },
      fallLeft: {
        frameRate: 1,
        frameBuffer: 1,
        loop: false,
        imageSrc: '../../../assets/sprites/player/animation/fallLeft.png'
      },

    });
    this.getScale().setScale(1.0);
    this.velocity = new Velocity(0, 0);
    this.hitbox = new Hitbox(this.getPosition(), 30, 54);
    this.attackBox = new Hitbox(this.getPosition(), 50, 70);


  }

  public getHitbox(): Hitbox {
    return this.hitbox;
  }

  /**
   * Get the Velocity of the player
   * @returns {Velocity} of the player
   */
  public getVelocity(): Velocity {
    return this.velocity;
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

  /**
   * Move the player, apply gravity and check for collisions
   * @param delta {number} time since the last update
   */
  public move(delta: number): void {


    /**
     * X-axis = left and right
     * Y-axis = up and down
     */

    /**
     * Set the velocity to 0 on the X axis if neither a | d is pressed
     */


    if(!this.isOnGround && !this.isAttacking && !this.isReceivingDamage) {
      this.switchSprite(this.lastDirection === 'right' ? 'fallRight' : 'fallLeft')
      console.log("Should fall")
    }




    if (this.attackCooldown > 0 && this.attackCooldown != 0 && !this.isReceivingDamage) this.attackCooldown -= delta;

    if (isKeyPressed('space') && !this.isAttacking && this.attackCooldown <= 0 && !this.preventInput && !this.isReceivingDamage && this.isOnGround) {
      this.attackCooldown = 1
      this.isAttacking = true;
      if (this.lastDirection === 'right') this.switchSprite('attackRight'); else
        this.switchSprite('attackLeft');
      GameAudio.getAudio('player:attack').play();
    }


    if (!isKeyPressed('a') && !isKeyPressed('d') && !this.isReceivingDamage && this.isOnGround) {
      if (this.lastDirection === 'left') {
        if (!this.preventInput && !this.isAttacking) this.switchSprite('idleLeft')
      } else {
        if (!this.preventInput && !this.isAttacking) this.switchSprite('idleRight')
      }

      this.velocity.setX(0);
    }


    /**
     * Check if a | d is pressed, then apply acceleration
     */
    if (isKeyPressed('a') && !this.preventInput && !this.isReceivingDamage) {
      this.lastDirection = 'left';
      if (!this.preventInput && !this.isAttacking && this.isOnGround) this.switchSprite('runLeft')
      if (this.velocity.getX() > -this.MAX_SPEED) {
        this.velocity.setX(this.velocity.getX() - this.ACCELERATION * delta);
      } else this.velocity.setX(-this.MAX_SPEED);
    }

    if (isKeyPressed('d') && !this.preventInput && !this.isReceivingDamage) {
      this.lastDirection = 'right';
      if (!this.preventInput && !this.isAttacking && this.isOnGround) this.switchSprite('runRight')
      if (this.velocity.getX() < this.MAX_SPEED) {
        this.velocity.setX(this.velocity.getX() + this.ACCELERATION * delta);
      } else this.velocity.setX(this.MAX_SPEED);
    }


    /**
     * Update the position on the X-axis
     * Formula: X = X + Vx * Δ
     * Delta (Δ) = time since the last frame
     */
    this.getPosition().setX(this.getPosition().getX() + this.velocity.getX() * delta);


    /**
     * Check for collisions
     * 1. Check for horizontal collisions
     * 2. Apply gravity
     * 3. Check for vertical collisions
     */
    this.updateHitbox(67, 34);
    this.checkHorizontalCollisions();
    this.applyGravity(delta);
    this.updateHitbox(67, 34);
    this.checkVerticalCollisions();



    /**
     * Check if the player is on the ground and if the jump key is pressed
     * If so, apply the jump strength
     */
    if (isKeyPressed('w') && this.getVelocity().getY() === 0 && !this.isReceivingDamage && this.isOnGround) {
      if (!this.preventInput)
        this.getVelocity().setY(-this.JUMP_STRENGTH);
    }

    if(this.isReceivingDamage) {
      this.switchSprite(this.lastDirection === 'right' ? 'hitRight' : 'hitLeft');
      this.attackCooldown = 0
      this.isAttacking = false;
      return;
    }
  }

  /**
   * Apply gravity to the player
   * Formula Velocity Y: Vy = Vy + g * Δ
   * Formula Position Y: Y = Y + Vy * Δ
   * @param delta {number} time since the last frame
   */
  public applyGravity(delta: number): void {


    for (let ladder of GameComponent.getCurrentLevel().getLadders()) {
      //TODO: Implement when Player is standing on a ladder set the velocity to 0

      if (ladder.checkCollision(GameComponent.player) && isKeyPressed('w')) {
        this.isOnLadder = true;
        this.velocity.setY(-100);
        this.getPosition().setY(this.getPosition().getY() + this.getVelocity().getY() * delta);
        this.getVelocity().setX(0);

      } else {
        this.isOnLadder = false;
      }
    }

    if (!this.isOnLadder) {

      if(this.getVelocity().getY() < this.MAX_GRAVITY) {
        this.velocity.setY(this.velocity.getY() + this.GRAVITY * delta);

      }
      this.velocity.setY(this.getVelocity().getY() + this.GRAVITY * delta);
      this.getPosition().setY(this.getPosition().getY() + this.getVelocity().getY() * delta);

    }
    /**
     * Check if the player is below the canvas
     * If so, set the velocity to 0 and set the player to the spawn point
     */
    if (this.getPosition().getY() + this.getHeight() >= GameComponent.canvasHeight) {
      this.velocity.setY(0);
      this.setPosition(GameComponent.getCurrentLevel().getSpawnPoint());
    }

    this.isOnGround = GameComponent.getCurrentLevel().getCollisionBlocks().some(colBlock =>
      this.hitbox.getPosition().getY() + this.hitbox.getHeight() <= colBlock.getPosition().getY()
      && this.hitbox.getPosition().getY() + this.hitbox.getHeight() >= colBlock.getPosition().getY() - 1
      && this.hitbox.getPosition().getX() <= colBlock.getPosition().getX() + colBlock.getWidth()
      && this.hitbox.getPosition().getX() + this.hitbox.getWidth() >= colBlock.getPosition().getX()
    );

  }

  /**
   * Check for vertical collisions
   */
  public checkVerticalCollisions() {
    for (let i = 0; i < GameComponent.getCurrentLevel().getCollisionBlocks().length; i++) {
      const block = GameComponent.getCurrentLevel().getCollisionBlocks()[i];
      if (!this.checkForCollision(block)) {
        continue;
      }

      /**
       * Offset to prevent the player from getting stuck in the block
       */
      const collisionOffset = 0.01;
      if (this.getVelocity().getY() < 0) {
        const offset = this.hitbox.getPosition().getY() - this.getPosition().getY();
        this.getVelocity().setY(0.1)

        this.getPosition().setY(block.getPosition().getY() + block.getHeight() - offset + collisionOffset);
        break;
      }

      if (this.getVelocity().getY() > 0) {
        this.getVelocity().setY(0);
        this.isOnGround = true;
        const offset = this.hitbox.getPosition().getY() - this.getPosition().getY() + this.hitbox.getHeight();
        this.getPosition().setY(block.getPosition().getY() - offset - collisionOffset);
        break;
      }

    }

  }

  /**
   * Check for collision with a block
   * @param block {CollisionBlock} to check for collision
   */
  public checkForCollision(block: CollisionBlock): boolean {
    return this.hitbox.getPosition().getX() <= block.getPosition().getX() + block.getWidth() &&
      this.hitbox.getPosition().getX() + this.hitbox.getWidth() >= block.getPosition().getX() &&
      this.hitbox.getPosition().getY() + this.hitbox.getHeight() >= block.getPosition().getY() &&
      this.hitbox.getPosition().getY() <= block.getPosition().getY() + block.getHeight();
  }

  /**
   * Check for horizontal collisions
   */
  public checkHorizontalCollisions() {

    for (let i = 0; i < GameComponent.getCurrentLevel().getCollisionBlocks().length; i++) {

      const block = GameComponent.getCurrentLevel().getCollisionBlocks()[i];
      if (!this.checkForCollision(block)) continue;

      /**
       * Offset to prevent the player from getting stuck in the block
       */
      const collisionOffset = 0.01;
      if (this.getVelocity().getX() < -0) {
        this.getVelocity().setX(0);
        const offset = this.hitbox.getPosition().getX() - this.getPosition().getX();
        this.getPosition().setX(block.getPosition().getX() + block.getWidth() - offset + collisionOffset);
        break;
      }

      if (this.getVelocity().getX() > 0) {
        this.getVelocity().setX(0);
        const offset = this.hitbox.getPosition().getX() - this.getPosition().getX() + this.hitbox.getWidth();
        this.getPosition().setX(block.getPosition().getX() - offset - collisionOffset);
        break;
      }

    }

  }

  /**
   * Update the player
   * @param context {CanvasRenderingContext2D} of the canvas
   * @param delta {number} time since the last frame
   */
  public update(context: CanvasRenderingContext2D, delta: number): void {
    this.move(delta);
    this.healthbar.position.setX(GameComponent.player.getPosition().getX() + 30);
    this.healthbar.position.setY(GameComponent.player.getPosition().getY() + 10);

    this.healthbar.draw(context, 10, GameComponent.player.health, GameComponent.player.maxHealth);
  }

  public checkForAttackCollisions() {

    for (let wizzards of GameComponent.getCurrentLevel().getWizzards()) {
      if (this.attackBox.collidesWith(wizzards.getHitbox()) && this.isAttacking) {
        if (this.collisionDone.has(wizzards.getHitbox())) return;
        this.collisionDone.add(wizzards.getHitbox());
        wizzards.isReceivingDamage = true;
        wizzards.health -= 25;
      }
    }
  }

  protected updateHitbox(offsetX: number, offsetY: number): void {

    this.hitbox.getPosition().setX(this.getPosition().getX() + offsetX);
    this.hitbox.getPosition().setY(this.getPosition().getY() + offsetY);


    if (this.lastDirection === 'right') {
      this.attackBox.getPosition().setX(this.getPosition().getX() + 100);
    } else {
      this.attackBox.getPosition().setX(this.getPosition().getX());
    }
    this.attackBox.getPosition().setY(this.getPosition().getY() + offsetY - 10);


    this.checkForAttackCollisions();


  }

  private onAttackDone() {
    this.isAttacking = false;
    this.collisionDone.clear();
  }
}


