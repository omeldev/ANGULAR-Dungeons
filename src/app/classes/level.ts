import {CollisionBlock} from "./collision/CollisionBlock";
import {Position} from "./position";
import {Sprite} from "./sprite";

export class Level {
  private collisions: number[];
  private background: Sprite;
  private collisionBlocks: CollisionBlock[] = [];

  constructor(background: Sprite, collisions: number[]) {
    this.collisions = collisions;
    this.background = background;
    this.background.setIsBackground(true);

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
    for (let i = 0; i < this.collisions.length; i += 16) {
      rows.push(this.collisions.slice(i, 16 + i));
    }

    return rows;
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

}
