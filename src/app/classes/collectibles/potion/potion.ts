import {Sprite} from "../../entitiy/sprite";
import {Position} from "../../entitiy/position";

export class Potion extends Sprite {


  private swapBuffer = 2 + Math.random();
  private swapCounter = 0;
  private swap = false;

  constructor(position: Position, imageSource: string) {
    super(imageSource, position);
    this.position.setY(this.position.getY() + 10);
  }

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

export class HealthPotion extends Potion {

  constructor(position: Position) {
    super(position, '../../assets/sprites/potion/healthPotion.png');
  }

}
