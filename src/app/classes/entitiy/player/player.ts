import {Position} from "../position";
import {Velocity} from "../velocity";
import {Sprite} from "../sprite";
import {GameComponent} from "../../../components/game/game.component";
import {PlayerSide, Side} from "../sides";
import {CollisionBlock} from "../../collision/CollisionBlock";
import {isKeyPressed} from "../../../listener/keystroke";
import {Coin} from "../../coin/coin";

export class Player extends Sprite {
  private readonly sprite: Sprite;
  private readonly velocity: Velocity;
  private collectedCoins: number = 0;

  private sides: { top: PlayerSide, bottom: PlayerSide, left: PlayerSide, right: PlayerSide };

  private MAX_SPEED = 350;
  private ACCELERATION = 400;
  private JUMP_STRENGTH = 600;
  private GRAVITY: number = 1200;

  /**
   * Create a new player
   * @param sprite {Sprite} of the player
   */
  constructor(sprite: Sprite) {
    super(sprite.getImage().src, sprite.getPosition());
    this.sprite = sprite;
    this.sprite.getScale().setScale(1.5);
    this.velocity = new Velocity(0, 0);

    /**
     * Initialize the sides
     * @type {{top: PlayerSide; right: PlayerSide; bottom: PlayerSide; left: PlayerSide}}
     */
    this.sides = {
      top: new PlayerSide(Side.TOP, this.getPosition()),
      right: new PlayerSide(Side.RIGHT, new Position(this.getPosition().getX() + this.getSprite().getWidth(), this.getPosition().getY())),
      bottom: new PlayerSide(Side.BOTTOM, new Position(this.getPosition().getX(), this.getPosition().getY() + this.getSprite().getHeight())),
      left: new PlayerSide(Side.LEFT, new Position(this.getPosition().getX(), this.getPosition().getY()))
    };


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
   * Get the Sprite of the player
   * @returns {Sprite} of the player
   */
  public getSprite(): Sprite {
    return this.sprite;
  }

  /**
   * Get the Velocity of the player
   * @returns {Velocity} of the player
   */
  public getVelocity(): Velocity {
    return this.velocity;
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
    if (!isKeyPressed('a') && !isKeyPressed('d')) this.velocity.setX(0);


    /**
     * Check if a | d is pressed, then apply acceleration
     */
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


    /**
     * Update the position on the X-axis
     * Formula: X = X + Vx * Δ
     * Delta (Δ) = time since the last frame
     */
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
     * 1. Check for horizontal collisions
     * 2. Apply gravity
     * 3. Check for vertical collisions
     */
    this.checkHorizontalCollisions();
    this.applyGravity(delta);
    this.checkVerticalCollisions();


    /**
     * Check if the player is on the ground and if the jump key is pressed
     * If so, apply the jump strength
     */
    if (isKeyPressed('w') && this.getVelocity().getY() === 0) {
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
    this.velocity.setY(this.getVelocity().getY() + this.GRAVITY * delta);
    this.getPosition().setY(this.getPosition().getY() + this.getVelocity().getY() * delta);

    /**
     * Check if the player is below the canvas
     * If so, set the velocity to 0 and set the player to the spawn point
     */
    if (this.getBottomSide().getPosition().getY() >= GameComponent.canvasHeight) {
      this.velocity.setY(0);
      this.setPosition(GameComponent.getCurrentLevel().getSpawnPoint());
    }

    const coins = GameComponent.getCurrentLevel().getCoins();
    for(let i = 0; i < coins.length; i++) {
      if(this.checkForCoinCollision(coins[i])) {
        GameComponent.getCurrentLevel().getCoins().splice(i, 1);
        this.collectedCoins++;
        GameComponent.nextCoin(this.collectedCoins);
        console.log(this.collectedCoins, 'Collected Coins');
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

  /**
   * Check for collision with a block
   * @param block {CollisionBlock} to check for collision
   */
  public checkForCollision(block: CollisionBlock): boolean {
    return this.getPosition().getX() <= block.getPosition().getX() + block.getWidth() &&
      this.getPosition().getX() + this.getSprite().getWidth() >= block.getPosition().getX() &&
      this.getPosition().getY() + this.getSprite().getHeight() >= block.getPosition().getY() &&
      this.getPosition().getY() <= block.getPosition().getY() + block.getHeight();
  }

  public checkForCoinCollision(coin: Coin): boolean {
    return this.getPosition().getX() < coin.getPosition().getX() + coin.getWidth() &&
      this.getPosition().getX() + this.getSprite().getWidth() > coin.getPosition().getX() &&
      this.getPosition().getY() < coin.getPosition().getY() + coin.getHeight() &&
      this.getPosition().getY() + this.getSprite().getHeight() > coin.getPosition().getY();
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


  /**
   * Draw the player
   * @param context {CanvasRenderingContext2D} of the canvas
   */
  public draw(context: CanvasRenderingContext2D): void {

    if (!GameComponent.productionMode) {
    }

    this.getSprite().drawSprite(context);
  }

  /**
   * Draw a box around the player to visualize the collision box
   * @param context
   */
  public drawSpriteBox(context: CanvasRenderingContext2D): void {
    context.fillStyle = "rgba(240, 52, 52, 0.3)";
    context.fillRect(this.getPosition().getX(), this.getPosition().getY(), this.getSprite().getWidth(), this.getSprite().getHeight());
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

