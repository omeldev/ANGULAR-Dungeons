import {Sprite} from "../sprite";
import {Position} from "../position";

export class Princess extends Sprite{

  constructor(position: Position) {
    super('../../../assets/sprites/princess/princess.png', position, () => {}, 5);
    this.frameBuffer = 8;

    this.getScale().setScale(3)
  }

}
