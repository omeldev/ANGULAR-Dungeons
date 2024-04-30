import {Gizmo} from "./gizmo";
import {Position} from "../position";

export class Bat extends Gizmo {

  constructor(position: Position) {
    super('../../../assets/sprites/bat/idleRight.png', position, {
      idleLeft: {
        frameRate: 8,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/bat/idleLeft.png'
      },
      idleRight: {
        frameRate: 8,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/bat/idleRight.png'
      },
      runLeft: {
        frameRate: 6,
        frameBuffer: 4,
        loop: true,
        imageSrc: '../../../assets/sprites/bat/runLeft.png'
      },
      runRight: {
        frameRate: 6,
        frameBuffer: 4,
        loop: true,
        imageSrc: '../../../assets/sprites/bat/runRight.png'
      }
    }, 8);

    this.isFlying = true;


  }

  onCollide(context: CanvasRenderingContext2D, delta: number): void {
    this.speechBubbles[0].show(context, delta);
  }

  onSwitch(context: CanvasRenderingContext2D, delta: number): void {
    /*
    if(Math.random() < 0.10) {
      const audio = new Audio('../../../assets/sound/game/bat/bat.mp3');
      audio.volume = GameComponent.volume;
      audio.play().then();
    }

     */
  }

  public override update(context: CanvasRenderingContext2D, delta: number) {
    super.update(context, delta);
  }


}
