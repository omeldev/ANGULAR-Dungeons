import {CollisionBlock} from "../collision/CollisionBlock";
import {Position} from "../entitiy/position";
import {Sprite} from "../entitiy/sprite";
import {Door} from "../door/door";

export class Level {
  private collisions: number[];
  private background: Sprite;
  private collisionBlocks: CollisionBlock[] = [];
  private spawnPoint: Position = new Position(0, 0);
  private finalDoor: Door;


  constructor(background: Sprite, collisions: number[], finalDoor?: Door) {
    this.collisions = collisions;
    this.background = background;
    this.background.setIsBackground(true);
    this.finalDoor = finalDoor ? finalDoor : new Door(new Position(13 * 64, 64 + 16), true, new Door(new Position(0, 0), true));

    this.getCollisionsMap().forEach((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === 292) {
          const block = new CollisionBlock(new Position(x * 64, y * 64));
          this.collisionBlocks.push(block);
          console.log("collision block added")
          console.log(block.getPosition().getX(), block.getPosition().getY())
        }
      })
    });

  }

  public getCollisionsMap(): number[][] {
    const rows: number[][] = [];

    const chunkSize = this.getBackground().getWidth() / 64;
    for (let i = 0; i < this.collisions.length; i += 16) {
      rows.push(this.collisions.slice(i, 16 + i));
    }

    return rows;
  }

  public getSpawnPoint(): Position {
    return this.spawnPoint;
  }

  public setSpawnPoint(spawnPoint: Position): void {
    this.spawnPoint = spawnPoint;
  }



  public draw(context: CanvasRenderingContext2D): void {
    this.background.draw(context);
  }

  public drawCollisionBlocks(context: CanvasRenderingContext2D): void {

    this.collisionBlocks.forEach(block => block.draw(context!));
  }

  public getCollisionBlocks(): CollisionBlock[] {
    return this.collisionBlocks;
  }

  public getBackground(): Sprite {
    return this.background;
  }

  public getFinalDoor(): Door {
    return this.finalDoor;
  }

}
