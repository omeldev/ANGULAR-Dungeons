import {Direction} from "../gizmo/gizmo";
import {Position} from "../position";
import {Enemie} from "./enemie";
import {Hitbox} from "../../collision/hitbox";
import {Player} from "../player/player";
import {Healthbar} from "../../gui/bar/healthbar";

const animationDefaults = {
  frameRate: 8,
  frameBuffer: 8,
  loop: true
}

export class Wizard extends Enemie {

  private collisionDone = new Set<Hitbox>;
  public maxHealth: number = 100;
  public health: number = this.maxHealth;
  public healthBar: Healthbar;
  public isDead: boolean = false;

  constructor(position: Position) {
    super(new Hitbox(position, 50, 50), '../../../assets/sprites/wizard/idleRight.png', position, {
      idleRight: {
        ...animationDefaults,
        imageSrc: '../../../assets/sprites/wizard/idleRight.png'
      },
      idleLeft: {
        ...animationDefaults,
        imageSrc: '../../../assets/sprites/wizard/idleLeft.png'
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
        frameBuffer: 18,
        loop: false,
        frameRate: 7,
        imageSrc: '../../../assets/sprites/wizard/death.png',
        onComplete: () => {
          this.isDead = true;
        }

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
    this.healthBar = new Healthbar(position);
  }


  public override updateHitbox(offsetX: number, offsetY: number): void {
    super.updateHitbox(offsetX + 100, offsetY + 115);

    this.healthBar.position.setY(this.getPosition().getY() + 100);
    this.healthBar.position.setX(this.getPosition().getX() + 70);

  }

  public attack(): void {
    if (this.lastDirection === Direction.RIGHT) {
      this.switchSprite('attack1Right');
    } else {
      this.switchSprite('attack1Left');
    }
  }


  private attackDone() {
    this.isAttacking = false;
    this.collisionDone.clear();
  }


  public override moveAi(context: CanvasRenderingContext2D, delta: number): void {


    if (this.health <= 0) {
      this.switchSprite('death');
      return;
    }

    if (this.isAttacking) {
      this.attack();
      return;
    }

    if (Math.random() < 0.001 && !this.isAttacking) {
      this.isAttacking = true;
      return;
    }


    super.moveAi(context, delta);

  }


  public override drawSprite(context: CanvasRenderingContext2D, delta: number): void {
    if (this.isDead) return;
    super.drawSprite(context, delta);
    this.healthBar.draw(context, 10, this.health, this.maxHealth)
  }

  attackBoxCollide(player: Player): void {
    if (this.collisionDone.has(player.getHitbox())) return;
    this.collisionDone.add(player.getHitbox());
    player.health -= 20;
    console.log(player.health);
  }


}
