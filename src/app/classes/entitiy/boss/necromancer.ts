import {Gizmo} from "../gizmo/gizmo";
import {Position} from "../position";
import {isKeyPressed} from "../../../listener/keystroke";

export class Necromancer extends Gizmo {

  public currentNecromancer = 1;
  public maxNecromancer = 7;
  public switchCooldown = 0;

  constructor(position: Position) {
    super('../../../assets/sprites/necromancer/necromancer1.png', position, {
      necromancer1: {
        frameRate: 8,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/necromancer/necromancer1.png'
      },
      necromancer2: {
        frameRate: 8,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/necromancer/necromancer2.png'
      },
      necromancer3: {
        frameRate: 13,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/necromancer/necromancer3.png'
      },
      necromancer4: {
        frameRate: 13,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/necromancer/necromancer4.png'
      },
      necromancer5: {
        frameRate: 17,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/necromancer/necromancer5.png'
      },
      necromancer6: {
        frameRate: 5,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/necromancer/necromancer6.png'
      },
      necromancer7: {
        frameRate: 9,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/necromancer/necromancer7.png'
      },
    }, 8);
  }

  onCollide(context: CanvasRenderingContext2D, delta: number): void {
  }

  onSwitch(context: CanvasRenderingContext2D, delta: number): void {
  }

  public override update(context: CanvasRenderingContext2D, delta: number) {
    if (this.switchCooldown != 0) {
      this.switchCooldown -= delta;
    }
    if (this.switchCooldown < 0) {
      this.switchCooldown = 0;
    }
    if (isKeyPressed('w') && this.switchCooldown <= 0) {
      this.switchCooldown = 2;

      this.switchSprite('necromancer' + this.currentNecromancer);
      console.log('necromancer' + this.currentNecromancer);
      this.currentNecromancer++;
      if (this.currentNecromancer == this.maxNecromancer) {
        this.currentNecromancer = 1;
      }
    }
  }


}
