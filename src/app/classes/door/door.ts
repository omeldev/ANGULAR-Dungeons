import {Position} from "../entitiy/position";
import {Sprite} from "../entitiy/sprite";
import {Player} from "../entitiy/player/player";

export class Door extends Sprite {
  private isFinalDoor: boolean;
  private destination: Door;

  /**
   * Create a new Door
   * @param position {Position} of the Door
   * @param isFinalDoor {boolean} true if the Door is the final Door
   * @param destination {Door} of the Door
   */
  constructor(position: Position, isFinalDoor?: boolean, destination?: Door) {
    super('../../../assets/sprites/door/door.png', position);
    this.isFinalDoor = false;
    this.destination = this;
  }


  /**
   * Get if the door is the final door
   * @returns {boolean} true if the door is the final door
   */
  public getIsFinalDoor(): boolean {
    return this.isFinalDoor;
  }

  /**
   * Set if the door is the final door
   * @param isFinalDoor
   */
  public setIsFinalDoor(isFinalDoor: boolean): void {
    this.isFinalDoor = isFinalDoor;
  }

  /**
   * Get the destination of the door
   * @returns {Door} destination of the door
   */
  public getDestination(): Door {
    return this.destination;
  }

  /**
   * Set the destination of the door
   * @deprecated Use only with Shallow Copy
   * @param destination {Door} of the door
   */

  public setDestination(destination: Door): void {
    this.destination = destination;
  }


  /**
   * Check if the player collides with the door
   * @param player
   * @returns {boolean} true if the player collides with the door
   */
  public checkCollision(player: Player): boolean {
    return this.getPosition().getX() < player.getPosition().getX() + player.getSprite().getWidth() &&
      this.getPosition().getX() + this.getWidth() > player.getPosition().getX() &&
      this.getPosition().getY() < player.getPosition().getY() + player.getSprite().getHeight() &&
      this.getPosition().getY() + this.getHeight() > player.getPosition().getY();

  }

}
