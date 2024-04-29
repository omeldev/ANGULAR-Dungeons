import {Sprite} from "../../entitiy/sprite";
import {Position} from "../../entitiy/position";

export class Key extends Sprite {

  constructor(position: Position) {
    super('../../assets/sprites/key/key.png', position);
    this.position.setY(this.position.getY() - 10);
  }


  private swapBuffer = 0.5;
  private swapCounter = 0;

  private swap = false;

  override drawSprite(context: CanvasRenderingContext2D, delta?: number) {
    super.drawSprite(context, delta);


    if (this.swapCounter > this.swapBuffer) {
      this.swapCounter = 0;
      this.swap = !this.swap;
    } else {
      this.swapCounter += delta!;
      if (this.swap) {
        this.getPosition().setY(this.getPosition().getY() - 10 * delta!);
      } else {
        this.getPosition().setY(this.getPosition().getY() + 10 * delta!);
      }
    }

  }


}
