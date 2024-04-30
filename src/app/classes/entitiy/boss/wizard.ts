import {Direction} from "../gizmo/gizmo";
import {Position} from "../position";
import {Enemie} from "./enemie";
import {Hitbox} from "../../collision/hitbox";
import {Player} from "../player/player";

const animationDefaults = {
  frameRate: 8,
  frameBuffer: 8,
  loop: true
}

export class Wizard extends Enemie {

  private collisionDone = new Set<Hitbox>;

  constructor(position: Position) {
    super(new Hitbox(position, 50, 50),'../../../assets/sprites/wizard/idleRight.png', position, {
      idle: {
        ...animationDefaults,
        imageSrc: '../../../assets/sprites/wizard/idleRight.png'
      },
      attack1Right: {
        ...animationDefaults,
        imageSrc: '../../../assets/sprites/wizard/attack1Right.png',
        onComplete: () => {
          this.attackDone();
          console.log('done')
        }
      },
      attack1Left: {
        ...animationDefaults,
        imageSrc: '../../../assets/sprites/wizard/attack1Left.png',
        onComplete: () => {
          this.attackDone();
          console.log('done')
        }
      },

      attack2Right: {
        ...animationDefaults,
        imageSrc: '../../../assets/sprites/wizard/attack2Right.png',
        onComplete: () => {
          this.attackDone();
          console.log('done')
        }
      },
      attack2Left: {
        ...animationDefaults,
        imageSrc: '../../../assets/sprites/wizard/attack2Left.png',
        onComplete: () => {
          this.attackDone();
          console.log('done')
        }
      },
      death: {
        ...animationDefaults,
        frameRate: 7,
        imageSrc: '../../../assets/sprites/wizard/death.png'

      },
      runRight: {
        ...animationDefaults,
        imageSrc: '../../../assets/sprites/wizard/runRight.png'
      },
      runLeft: {
        ...animationDefaults,
        imageSrc: '../../../assets/sprites/wizard/runLeft.png'
      },
      jumpRight: {
        ...animationDefaults,
        frameRate: 2,
        imageSrc: '../../../assets/sprites/wizard/jumpRight.png'
      },
      hitRight: {
        ...animationDefaults,
        frameRate: 3,
        imageSrc: '../../../assets/sprites/wizard/hitRight.png'
      },
      fallRight: {
        ...animationDefaults,
        frameRate: 2,
        imageSrc: '../../../assets/sprites/wizard/fallRight.png'
      }

    }, 8);
    this.getHitbox().setWidth(30);
    this.getHitbox().setHeight(50);
  }


  public override updateHitbox(offsetX: number, offsetY: number): void {
    super.updateHitbox(offsetX + 100, offsetY + 115);
  }

  public attack(): void {
    if(this.lastDirection === Direction.RIGHT) {
      this.switchSprite('attack1Right');
    }else {
      this.switchSprite('attack1Left');
    }
  }


  private attackDone() {
    this.isAttacking = false;
    this.collisionDone.clear();
  }

  public override moveAi(context: CanvasRenderingContext2D, delta: number): void {


    if(this.isAttacking) {
      this.attack();
      return;
    }

    if(Math.random() < 0.001 && !this.isAttacking) {
      this.isAttacking = true;
      return;
    }


    super.moveAi(context, delta);
  }

  public override drawSprite(context: CanvasRenderingContext2D, delta: number): void {
    super.drawSprite(context, delta);
  }

  attackBoxCollide(player: Player): void {
    if (this.collisionDone.has(player.getHitbox())) return;
    this.collisionDone.add(player.getHitbox());
    player.health -= 20;
    console.log(player.health);
  }


}
