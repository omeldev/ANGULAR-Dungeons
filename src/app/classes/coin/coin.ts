import {Sprite} from "../entitiy/sprite";
import {Position} from "../entitiy/position";

export class Coin extends Sprite {
  /**
   * Create a new Coin
   * @param position {Position} of the Coin
   */
  constructor(position: Position) {
    super('../../assets/sprites/coin/coin.png', position, () => {
    }, 14);

    this.frameBuffer = 3;
    this.loop = true;
    this.autoPlay = true;

    this.getPosition().setY(this.getPosition().getY() + 32);
    this.getPosition().setX(this.getPosition().getX() + 32);
  }


}
