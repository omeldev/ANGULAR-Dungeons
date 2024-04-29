import {Sprite} from "../../entitiy/sprite";
import {Position} from "../../entitiy/position";
import {Flashlight} from "../../entitiy/shaders/flashlight";

export class Shine extends Sprite {

  private flashLight: Flashlight;

  private swapBuffer = 0.5;
  private swapCounter = 0;

  private swap = false;


  constructor(position: Position) {
    super('../../../assets/sprites/shine/idle.png', position, () => {}, 8);

    this.frameBuffer = 5;
    this.loop = true;
    this.autoPlay = true;

    this.getPosition().setY(this.getPosition().getY() + 32);
    this.getPosition().setX(this.getPosition().getX() + 32);

    this.flashLight = new Flashlight();
    this.flashLight.drawDarkness = false;
    this.flashLight.isActive = true;


  }

  public override drawSprite(context: CanvasRenderingContext2D, delta?: number) {
    super.drawSprite(context, delta);


    if (this.swapCounter > this.swapBuffer) {
      this.swapCounter = 0;
      this.swap = !this.swap;
    } else {
      this.swapCounter += delta!;
      if (this.swap) {
        this.getPosition().setY(this.getPosition().getY() - 30 * delta!);
      } else {
        this.getPosition().setY(this.getPosition().getY() + 30 * delta!);
      }
    }

  }

}
