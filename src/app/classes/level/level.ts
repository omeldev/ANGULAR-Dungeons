import {CollisionBlock} from "../collision/CollisionBlock";
import {Position} from "../entitiy/position";
import {Sprite} from "../entitiy/sprite";
import {Door} from "../door/door";
import {Coin} from "../coin/coin";
import {Key} from "../collectibles/key/key";

export class Level extends Sprite {
  private collisions: number[];
  private readonly background: Sprite;
  private collisionBlocks: CollisionBlock[] = [];
  private readonly coins: Coin[] = [];
  private readonly key: Key[] = [];
  private readonly spawnPoint: Position;
  private readonly finalDoor: Door;


  /**
   * Create a new Level
   * @param background {Sprite} of the Level
   * @param spawnPoint {Position} of the Player spawn point
   * @param collisions {number[]} of the Level (Made with Tiled)
   * @param finalDoor {Door} of the Level
   * @param otherDoors {Door[]} of the Level
   * @param coins
   */
  constructor(background: Sprite, spawnPoint: Position, collisions: number[], finalDoor?: Door, coins?: number[], key?: number[]) {
    super(background.getImage().src, background.getPosition(), () => {
      this.getCollisionsMap().forEach((row, y) => {
        row.forEach((symbol, x) => {
          if (symbol === 292) {
            const block = new CollisionBlock(new Position(x * 64, y * 64));
            this.collisionBlocks.push(block);
          }
        })
      });


      if (coins) {
        this.setCoins(coins);
      }

      if (key) {
        this.setKey(key);
      }

    });
    this.collisions = collisions;
    this.background = background;
    this.finalDoor = finalDoor ? finalDoor : new Door(new Position(13 * 64, 64 + 16), true, new Door(new Position(0, 0), true));

    this.spawnPoint = spawnPoint;


    /**
     * Convert the collisions array to CollisionBlocks
     * 292 is the symbol for a collision block
     */

  }

  public setCoins(coins: number[]) {
    const rows: number[][] = [];
    const rowSize = this.getWidth() / 64;
    if (this.getWidth() % 64 !== 0) throw new Error("invalid width");


    for (let i = 0; i < coins.length; i += rowSize) {
      rows.push(coins.slice(i, rowSize + i));
    }


    rows.forEach(((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === 293) {
          const coin = new Coin(new Position(x * 64, (y + 1.5) * 64));

          this.coins.push(coin);
        }
      });
    }));

  }

  public setKey(key: number[]) {
    const rows: number[][] = [];
    const rowSize = this.getWidth() / 64;
    if (this.getWidth() % 64 !== 0) throw new Error("invalid width");


    for (let i = 0; i < key.length; i += rowSize) {
      rows.push(key.slice(i, rowSize + i));
    }


    rows.forEach(((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol) {
          const key = new Key(new Position(x * 64, (y + 0.5) * 64));
          this.key.push(key);
        }
      });
    }));

  }

  /**
   * Get the collisions of the Level
   * @returns {number[][]} of the Level
   * Transform the 1D array to a 2D array
   * TODO: Independent from the size of the Level
   */
  public getCollisionsMap(): number[][] {
    const rows: number[][] = [];

    const rowSize = this.getWidth() / 64;

    if (this.getWidth() % 64 !== 0) throw new Error("invalid width");


    for (let i = 0; i < this.collisions.length; i += rowSize) {
      rows.push(this.collisions.slice(i, rowSize + i));
    }

    return rows;
  }

  /**
   * Get the spawn point of the Level
   * @returns {Position} of the spawn point
   */
  public getSpawnPoint(): Position {
    return this.spawnPoint;
  }

  /**
   * Set the spawn point of the Level
   * @param spawnPoint {Position} of the spawn point
   */
  public setSpawnPoint(spawnPoint: Position): void {
    this.getSpawnPoint().setX(spawnPoint.getX());
    this.getSpawnPoint().setY(spawnPoint.getY());
  }

  /**
   * Draw the collision blocks. For debugging purposes
   * @param context {CanvasRenderingContext2D} of the Canvas
   */
  public drawCollisionBlocks(context: CanvasRenderingContext2D): void {
    this.collisionBlocks.forEach(block => block.drawBoundaries(context!));
  }

  /**
   * Get the collision blocks of the Level
   * @returns {CollisionBlock[]} of the Level
   */
  public getCollisionBlocks(): CollisionBlock[] {
    return this.collisionBlocks;
  }

  public getCoins(): Coin[] {
    return this.coins;
  }

  public getKey(): Key[] {
    return this.key;
  }

  public drawCoins(context: CanvasRenderingContext2D): void {
    this.coins.forEach(coin => coin.drawSprite(context));
  }

  /**
   * Get the background of the Level
   * @returns {Sprite} of the Level
   */
  public getBackground(): Sprite {
    return this.background;
  }

  /**
   * Get the final door of the Level
   * @returns {Door} of the Level
   */
  public getFinalDoor(): Door {
    return this.finalDoor;
  }

}
