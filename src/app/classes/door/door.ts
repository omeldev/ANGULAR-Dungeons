import {Position} from "../entitiy/position";
import {Sprite} from "../entitiy/sprite";
import {Player} from "../entitiy/player/player";

export class Door {
  private position: Position;
  private isFinalDoor: boolean;
  private destination: Door;
  private sprite: Sprite;

  constructor(position: Position, isFinalDoor?: boolean, destination?: Door) {
    this.position = position;
    this.isFinalDoor = false;
    this.destination = this;
    this.sprite = new Sprite('../../../assets/sprites/door/door.png', position);
  }

  public getPosition(): Position {
    return this.position;
  }

  public setPosition(position: Position): void {
    this.position = position;
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

  public draw(context: CanvasRenderingContext2D): void {
    this.sprite.drawSprite(context);
  }

  public checkCollision(player: Player): boolean {
    return this.sprite.getPosition().getX() < player.getPosition().getX() + player.getSprite().getWidth() &&
      this.sprite.getPosition().getX() + this.sprite.getWidth() > player.getPosition().getX() &&
      this.sprite.getPosition().getY() < player.getPosition().getY() + player.getSprite().getHeight() &&
      this.sprite.getPosition().getY() + this.sprite.getHeight() > player.getPosition().getY();

  }

}
