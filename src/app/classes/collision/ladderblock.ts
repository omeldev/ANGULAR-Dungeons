import {Position} from "../entitiy/position";
import {Player} from "../entitiy/player/player";

export class Ladder {

  private readonly position: Position;
  private readonly width: number = 63;
  private readonly height: number = 63;

  /**
   * Create a new CollisionBlock
   * @param position {Position} of the CollisionBlock
   * @param width {number} of the CollisionBlock
   * @param height {number} of the CollisionBlock
   */
  constructor(position: Position, width?: number, height?: number) {
    this.position = position;
    if (width) {
      this.width = width;
    }
    if (height) {
      this.height = height;
    }
  }

  /**
   * Get the position of the CollisionBlock
   * @returns {Position} of the CollisionBlock
   */
  public getPosition(): Position {
    return this.position;
  }

  /**
   * Draw the boundaries of the CollisionBlock
   * For debugging purposes
   * @param context
   */
  public drawBoundaries(context: CanvasRenderingContext2D): void {
    context.fillStyle = "rgba(240, 52, 52, 0.3)";
    context.fillRect(this.position.getX(), this.position.getY(), this.width, this.height);
  }

  /**
   * Get the width of the CollisionBlock
   * @returns {number} width of the CollisionBlock
   */
  public getWidth(): number {
    return this.width;
  }

  /**
   * Get the height of the CollisionBlock
   * @returns {number} height of the CollisionBlock
   */
  public getHeight(): number {
    return this.height;

  }

  public checkCollision(player: Player): boolean {
    return player.getHitbox().getPosition().getX() + player.getHitbox().getWidth() <= this.getPosition().getX() + this.getWidth() &&
      player.getHitbox().getPosition().getX() >= this.getPosition().getX() &&
      player.getHitbox().getPosition().getY() + player.getHitbox().getHeight() >= this.getPosition().getY() &&
      player.getHitbox().getPosition().getY() <= this.getPosition().getY() + this.getHeight();

  }

}
