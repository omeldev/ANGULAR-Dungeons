import {Position} from "../position";
import {Velocity} from "../velocity";
import {Sprite} from "../sprite";
import {GameComponent} from "../../../components/game/game.component";
import {PlayerSide, Side} from "../sides";
import {CollisionBlock} from "../../collision/CollisionBlock";
import {isKeyPressed} from "../../../listener/keystroke";
import {Coin} from "../../coin/coin";
import {Hitbox} from "../../collision/hitbox";
import {Key} from "../../collectibles/key/key";
import {Shine} from "../../collectibles/shines/shine";
import {Ladder} from "../../collision/ladderblock";

export class Player extends Sprite {
  private readonly velocity: Velocity;
  private readonly hitbox: Hitbox;
  private collectedCoins: number = 0;

  private sides: { top: PlayerSide, bottom: PlayerSide, left: PlayerSide, right: PlayerSide };

  protected MAX_SPEED = 350;
  protected ACCELERATION = 400;
  protected JUMP_STRENGTH = 600;
  protected GRAVITY: number = 1200;
  public lastDirection: string = 'right';
  public preventInput = false;
  public isAttacking = false;
  public collectedKeys: number = 0;
  collectedShines: number = 0;

  /**
   * Create a new player
   * @param spriteSrc
   * @param animations
   */
  constructor(spriteSrc: string, animations: any) {
    super(spriteSrc, new Position(356, 250), () => {
    }, 11, animations);
    this.getScale().setScale(1.0);
    this.velocity = new Velocity(0, 0);
    this.hitbox = new Hitbox(this.getPosition(), 30, 54);
    /**
     * Initialize the sides
     * @type {{top: PlayerSide; right: PlayerSide; bottom: PlayerSide; left: PlayerSide}}
     */
    this.sides = {
      top: new PlayerSide(Side.TOP, this.getPosition()),
      right: new PlayerSide(Side.RIGHT, new Position(this.getPosition().getX() + this.getWidth(), this.getPosition().getY())),
      bottom: new PlayerSide(Side.BOTTOM, new Position(this.getPosition().getX(), this.getPosition().getY() + this.getHeight())),
      left: new PlayerSide(Side.LEFT, new Position(this.getPosition().getX(), this.getPosition().getY()))
    };


  }

  public getHitbox(): Hitbox {
    return this.hitbox;
  }

  /**
   * Get the Bottom side of the player
   * @returns {PlayerSide} bottom side of the player
   */
  public getBottomSide(): PlayerSide {
    return this.sides.bottom;
  }

  /**
   * Get the Top side of the player
   * @returns {PlayerSide} top side of the player
   */
  public getTopSide(): PlayerSide {
    return this.sides.top;
  }

  /**
   * Get the Right side of the player
   * @returns {PlayerSide} right side of the player
   */
  public getRightSide(): PlayerSide {
    return this.sides.right;
  }

  /**
   * Get the Left side of the player
   * @returns {PlayerSide} left side of the player
   */
  public getLeftSide(): PlayerSide {
    return this.sides.left;
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
    if (this.isAttacking && this.animations['attack'].frameRate - 1 === this.animations['attack'].currentFrame) {
      this.isAttacking = false;

    }
    if (isKeyPressed('space') && !this.isAttacking) {

      //this.isAttacking = true;
      //this.switchSprite('attack');
      console.log('Attack')
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
     * Update the sides
     */
    this.getBottomSide().getPosition().setY(this.getPosition().getY() + this.getHeight());
    this.getRightSide().getPosition().setX(this.getPosition().getX() + this.getWidth());
    this.getLeftSide().getPosition().setX(this.getPosition().getX());
    this.getTopSide().getPosition().setY(this.getPosition().getY());


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

  protected updateHitbox(offsetX: number, offsetY: number): void {

    this.hitbox.getPosition().setX(this.getPosition().getX() + offsetX);
    this.hitbox.getPosition().setY(this.getPosition().getY() + offsetY);


  }

  public isOnLadder = false;

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
        this.getPosition().setY(this.getPosition().getY() + this.getVelocity().getY() * delta);        this.getVelocity().setX(0);

      } else {
        this.isOnLadder = false;
      }
    }



    if(!this.isOnLadder) {

      this.velocity.setY(this.getVelocity().getY() + this.GRAVITY * delta);
      this.getPosition().setY(this.getPosition().getY() + this.getVelocity().getY() * delta);

    }
    /**
     * Check if the player is below the canvas
     * If so, set the velocity to 0 and set the player to the spawn point
     */
    if (this.getBottomSide().getPosition().getY() >= GameComponent.canvasHeight) {
      this.velocity.setY(0);
      this.setPosition(GameComponent.getCurrentLevel().getSpawnPoint());
    }

    const keys = GameComponent.getCurrentLevel().getKey();
    for(let i = 0; i < keys.length; i++){
      if(this.checkForKeyCollision(keys[i])){
        GameComponent.getCurrentLevel().getKey().splice(i, 1);
          const audio = new Audio('../../../assets/sound/game/key/pickupKey.mp3');
          audio.volume = GameComponent.volume;
          audio.play().then();
        this.collectedKeys++;
        break;
      }
    }

    const coins = GameComponent.getCurrentLevel().getCoins();
    for (let i = 0; i < coins.length; i++) {
      if (this.checkForCoinCollision(coins[i])) {
        this.collectedCoins++;
        GameComponent.nextCoin(this.collectedCoins);
        console.log(this.collectedCoins, 'Collected Coins');
        GameComponent.getCurrentLevel().getCoins().splice(i, 1);

        setTimeout(() => {

          const audio = new Audio('../../../assets/sound/game/coin/coin-pickup.mp3');
          audio.volume = GameComponent.volume;
          audio.play().then();
        }, 20);
        break;
      }
    }

    const shines = GameComponent.getCurrentLevel().getShines();
    for (let i = 0; i < shines.length; i++) {
      if (this.checkForCoinCollision(shines[i])) {
        GameComponent.getCurrentLevel().getShines().splice(i, 1);

        this.collectedShines++;


          const audio = new Audio('../../../assets/sound/game/shine/collect.mp3');
          audio.volume = GameComponent.volume;
          audio.playbackRate = 4;

          audio.play().then();

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

  public checkForLadderCollision(ladder: Ladder): boolean {
    return this.hitbox.getPosition().getX() < ladder.getPosition().getX() + ladder.getWidth() &&
      this.hitbox.getPosition().getX() + this.hitbox.getWidth() > ladder.getPosition().getX() &&
      this.hitbox.getPosition().getY() < ladder.getPosition().getY() + ladder.getHeight() &&
      this.hitbox.getPosition().getY() + this.hitbox.getHeight() > ladder.getPosition().getY();

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
   * Draw the player
   * @param context {CanvasRenderingContext2D} of the canvas
   */
  public draw(context: CanvasRenderingContext2D): void {

    if (!GameComponent.productionMode) {
    }

    this.drawSprite(context);

    console.log(this.getWidth())
    context.fillStyle = 'rgba(240, 52, 52, 0.3)';
    context.fillRect(this.getPosition().getX(), this.getPosition().getY(), this.getWidth(), this.getHeight());
  }

  /**
   * Draw a box around the player to visualize the collision box
   * @param context
   */
  public drawSpriteBox(context: CanvasRenderingContext2D): void {
    context.fillStyle = "rgba(240, 52, 52, 0.3)";
    context.fillRect(this.getPosition().getX(), this.getPosition().getY(), this.getWidth(), this.getHeight());
  }

  public drawHitbox(context: CanvasRenderingContext2D): void {
    this.hitbox.draw(context);
  }

  /**
   * Update the player
   * @param context {CanvasRenderingContext2D} of the canvas
   * @param delta {number} time since the last frame
   */
  public update(context: CanvasRenderingContext2D, delta: number): void {
    this.move(delta);
  }


}

