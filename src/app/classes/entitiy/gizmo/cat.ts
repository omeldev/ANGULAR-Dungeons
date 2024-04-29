import {Sprite} from "../sprite";
import {Position} from "../position";

export class Cat extends Sprite {

  constructor(position: Position) {
    super('../../../assets/sprites/cat/black/blackCat.png', position, () => {
    }, 15);
    this.frameBuffer = 16;
    this.loop = true;
    this.autoPlay = true;
  }
}

