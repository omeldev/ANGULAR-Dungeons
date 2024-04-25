import {Position} from "../entitiy/position";
import {Sprite} from "../entitiy/sprite";
import {Player} from "../entitiy/player/player";

export class Door extends Sprite {
  private isFinalDoor: boolean;
  private destination: Door;
  constructor(position: Position, isFinalDoor?: boolean, destination?: Door) {
    super('../../../assets/sprites/door/door.png', position);
    this.isFinalDoor = false;
    this.destination = this;
  }

  public getIsFinalDoor(): boolean {
    return this.isFinalDoor;
  }

  public setIsFinalDoor(isFinalDoor: boolean): void {
    this.isFinalDoor = isFinalDoor;
  }

  public getDestination(): Door {
    return this.destination;
  }

  public setDestination(destination: Door): void {
    this.destination = destination;
  }


  /**
   * Check if the player collides with the door
   * @param player
   */
  public checkCollision(player: Player): boolean {
    return this.getPosition().getX() < player.getPosition().getX() + player.getSprite().getWidth() &&
      this.getPosition().getX() + this.getWidth() > player.getPosition().getX() &&
      this.getPosition().getY() < player.getPosition().getY() + player.getSprite().getHeight() &&
      this.getPosition().getY() + this.getHeight() > player.getPosition().getY();

  }

}
