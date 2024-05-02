import {Position} from "../position";
import {Velocity} from "../velocity";
import {Sprite} from "../sprite";
import {GameComponent} from "../../../components/game/game.component";
import {CollisionBlock} from "../../collision/CollisionBlock";
import {isKeyPressed} from "../../../listener/keystroke";
import {Coin} from "../../coin/coin";
import {Hitbox} from "../../collision/hitbox";
import {Key} from "../../collectibles/key/key";
import {Shine} from "../../collectibles/shines/shine";
import {GameAudio} from "../../audio/audio";
import {HealthPotion} from "../../collectibles/potion/potion";
import {Healthbar} from "../../gui/bar/healthbar";

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
  protected JUMP_STRENGTH = 600;
  protected GRAVITY: number = 1200;
  private readonly velocity: Velocity;
  private readonly hitbox: Hitbox;
  private collectedCoins: number = 0;
  private collisionDone = new Set<Hitbox>;

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
          this.attackDone();
        }
      },
      attackLeft: {
        frameRate: 3,
        frameBuffer: 12,
        loop: false,
        imageSrc: '../../../assets/sprites/player/animation/attackLeft.png',
        onComplete: () => {
          GameComponent.player.isAttacking = false;
          this.attackDone();
        }
      }
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

    if (this.attackCooldown > 0 && this.attackCooldown != 0) this.attackCooldown -= delta;

    if (isKeyPressed('space') && !this.isAttacking && this.attackCooldown <= 0 && !this.preventInput) {
      this.attackCooldown = 1
      this.isAttacking = true;
      if (this.lastDirection === 'right') this.switchSprite('attackRight'); else
        this.switchSprite('attackLeft');
      GameAudio.getAudio('player:attack').play();
    }


    if (!isKeyPressed('a') && !isKeyPressed('d')) {
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
    if (isKeyPressed('a') && !this.preventInput) {
      this.lastDirection = 'left';
      if (!this.preventInput && !this.isAttacking) this.switchSprite('runLeft')
      if (this.velocity.getX() > -this.MAX_SPEED) {
        this.velocity.setX(this.velocity.getX() - this.ACCELERATION * delta);
      } else this.velocity.setX(-this.MAX_SPEED);
    }

    if (isKeyPressed('d') && !this.preventInput) {
      this.lastDirection = 'right';
      if (!this.preventInput && !this.isAttacking) this.switchSprite('runRight')
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
    if (isKeyPressed('w') && this.getVelocity().getY() === 0) {
      if (!this.preventInput)
        this.getVelocity().setY(-this.JUMP_STRENGTH);
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

    const keys = GameComponent.getCurrentLevel().getKey();
    for (let i = 0; i < keys.length; i++) {
      if (this.checkForKeyCollision(keys[i])) {
        GameComponent.getCurrentLevel().getKey().splice(i, 1);
        GameAudio.getAudio('key:collect').play();
        this.collectedKeys++;
        break;
      }
    }

    const coins = GameComponent.getCurrentLevel().getCoins();
    for (let i = 0; i < coins.length; i++) {
      if (this.checkForCoinCollision(coins[i])) {
        this.collectedCoins++;
        GameComponent.getCurrentLevel().getCoins().splice(i, 1);

        GameAudio.getAudio('coin:collect').play();
        break;
      }
    }

    const shines = GameComponent.getCurrentLevel().getShines();
    for (let i = 0; i < shines.length; i++) {
      if (this.checkForShineCollision(shines[i])) {
        GameComponent.getCurrentLevel().getShines().splice(i, 1);

        this.collectedShines++;


        GameAudio.getAudio('shine:collect').play();

        break;
      }
    }

    const healthPotions = GameComponent.getCurrentLevel().getHealthPotions();
    for (let i = 0; i < healthPotions.length; i++) {
      if (this.checkForHealthPotionCollision(healthPotions[i])) {
        if (this.health === this.maxHealth) return;
        GameComponent.getCurrentLevel().getHealthPotions().splice(i, 1);

        if (this.health + 25 > this.maxHealth) {
          this.health = this.maxHealth;
        } else {
          this.health += 25;
        }


        GameAudio.getAudio('shine:collect').play();

        break;
      }
    }

  }

  /**
   * Check for vertical collisions
   */
  public checkVerticalCollisions() {
    for (let i = 0; i < GameComponent.getCurrentLevel().getCollisionBlocks().length; i++) {
      const block = GameComponent.getCurrentLevel().getCollisionBlocks()[i];
      if (!this.checkForCollision(block)) continue;

      /**
       * Offset to prevent the player from getting stuck in the block
       */
      const collisionOffset = 0.01;


      if (this.getVelocity().getY() < 0) {
        const offset = this.hitbox.getPosition().getY() - this.getPosition().getY();
        this.getVelocity().setY(0.01)
        this.getPosition().setY(block.getPosition().getY() + block.getHeight() - offset + collisionOffset);
        break;
      }

      if (this.getVelocity().getY() > 0) {
        this.getVelocity().setY(0);
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

  public checkForCoinCollision(coin: Coin): boolean {
    return this.hitbox.getPosition().getX() < coin.getPosition().getX() + coin.getWidth() &&
      this.hitbox.getPosition().getX() + this.hitbox.getWidth() > coin.getPosition().getX() &&
      this.hitbox.getPosition().getY() < coin.getPosition().getY() + coin.getHeight() &&
      this.hitbox.getPosition().getY() + this.hitbox.getHeight() > coin.getPosition().getY();
  }

  public checkForKeyCollision(key: Key): boolean {
    return this.hitbox.getPosition().getX() < key.getPosition().getX() + key.getWidth() &&
      this.hitbox.getPosition().getX() + this.hitbox.getWidth() > key.getPosition().getX() &&
      this.hitbox.getPosition().getY() < key.getPosition().getY() + key.getHeight() &&
      this.hitbox.getPosition().getY() + this.hitbox.getHeight() > key.getPosition().getY();
  }

  public checkForShineCollision(shine: Shine): boolean {
    return this.hitbox.getPosition().getX() < shine.getPosition().getX() + shine.getWidth() &&
      this.hitbox.getPosition().getX() + this.hitbox.getWidth() > shine.getPosition().getX() &&
      this.hitbox.getPosition().getY() < shine.getPosition().getY() + shine.getHeight() &&
      this.hitbox.getPosition().getY() + this.hitbox.getHeight() > shine.getPosition().getY();
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

  private attackDone() {
    this.isAttacking = false;
    this.collisionDone.clear();
  }

  private checkForHealthPotionCollision(healthPotion: HealthPotion): boolean {
    return this.hitbox.getPosition().getX() < healthPotion.getPosition().getX() + healthPotion.getWidth() &&
      this.hitbox.getPosition().getX() + this.hitbox.getWidth() > healthPotion.getPosition().getX() &&
      this.hitbox.getPosition().getY() < healthPotion.getPosition().getY() + healthPotion.getHeight() &&
      this.hitbox.getPosition().getY() + this.hitbox.getHeight() > healthPotion.getPosition().getY();
  }
}


