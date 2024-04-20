import {CollisionBlock} from "./collision/CollisionBlock";
import {Position} from "./position";
import {Sprite} from "./sprite";

export class Level {
  private collisions: number[];
  private background: Sprite;

  constructor(background: Sprite, collisions: number[]) {
    this.collisions = collisions;
    this.background = background;
    this.background.setIsBackground(true);
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
    let colissionBlocks: CollisionBlock[] = [];

    this.getCollisionsMap().forEach((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === 292) {
          colissionBlocks.push(new CollisionBlock(new Position(x * 64, y * 64)));
        }
      })
    });

   colissionBlocks.forEach(block => block.draw(context!));
  }

}
