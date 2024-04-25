import {Sprite} from "../entitiy/sprite";
import {Position} from "../entitiy/position";

export class Coin extends Sprite {
  /**
   * Create a new Coin
   * @param position {Position} of the Coin
   */
  constructor(position: Position) {
    super('../../assets/sprites/coin/coin.png', position);
  }

}
