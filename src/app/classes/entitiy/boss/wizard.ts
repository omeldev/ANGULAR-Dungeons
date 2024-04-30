import {Gizmo} from "../gizmo/gizmo";
import {Position} from "../position";

export class Wizard extends Gizmo {

  constructor(position: Position) {
    super('../../../assets/sprites/wizard/idleRight.png', position, {
      idle: {
        frameRate: 8,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/wizard/idleRight.png'
      },
      attack1Right: {
        frameRate: 8,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/wizard/attack1Right.png'
      },
      attack2Right: {
        frameRate: 8,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/wizard/attack2Right.png'
      },
      death: {
        frameRate: 7,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/wizard/death.png'

      },
      runRight: {
        frameRate: 8,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/wizard/runRight.png'
      },
      runLeft: {
        frameRate: 8,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/wizard/runLeft.png'
      },
      jumpRight: {
        frameRate: 2,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/wizard/jumpRight.png'
      },
      hitRight: {
        frameRate: 3,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/wizard/hitRight.png'
      },
      fallRight: {
        frameRate: 2,
        frameBuffer: 8,
        loop: true,
        imageSrc: '../../../assets/sprites/wizard/fallRight.png'
      }

    }, 8);
    this.getHitbox().setWidth(30);
    this.getHitbox().setHeight(50);
  }

  onCollide(context: CanvasRenderingContext2D, delta: number): void {
  }

  onSwitch(context: CanvasRenderingContext2D, delta: number): void {
  }


  public override updateHitbox(): void {
    this.hitbox.getPosition().setX(this.getPosition().getX() + 105);
    this.hitbox.getPosition().setY(this.getPosition().getY() + 117);
  }


}
