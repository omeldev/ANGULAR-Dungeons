import {Hitbox} from "../../collision/hitbox";
import {Direction, Gizmo} from "../gizmo/gizmo";
import {Position} from "../position";
import {Player} from "../player/player";

export type Animation = {
  [key: string]: {
    frameRate: number;
    frameBuffer: number;
    loop: boolean;
    imageSrc: string;
    onComplete?: () => void;
  }
}

export abstract class Enemie extends Gizmo {
  public isAttacking: boolean = false;
  public attackCooldown: number = 0;
  private attackBox: Hitbox;

  constructor(attackBox: Hitbox, spriteSrc: string, position: Position, animations: Animation, frameRate: number = 6, hitbox: Hitbox = new Hitbox(position, 20, 20)) {
    super(spriteSrc, position, animations, frameRate, hitbox);
    this.attackBox = attackBox;
  }

  public getAttackBox(): Hitbox {
    return this.attackBox;
  }


  public override updateHitbox(offsetX: number, offsetY: number) {
    super.updateHitbox(offsetX, offsetY);
    if (this.lastDirection === Direction.LEFT) {
      this.attackBox.getPosition().setX(this.getPosition().getX() + this.attackBox.getWidth() + 5);
    } else {
      this.attackBox.getPosition().setX(this.getPosition().getX() + 140);
    }
    this.attackBox.getPosition().setY(this.getPosition().getY() + offsetY);

  }

  public override drawSprite(context: CanvasRenderingContext2D, delta: number) {
    super.drawSprite(context, delta);
  }


  onCollide(context: CanvasRenderingContext2D, delta: number): void {
  }

  onSwitch(context: CanvasRenderingContext2D, delta: number): void {
  }

  abstract attackBoxCollide(player: Player): void;

  public override collidesWithPlayer(player: Player): boolean {
    if (this.attackBox.collidesWith(player.getHitbox())) {
      if (this.isAttacking) this.attackBoxCollide(player);
    }
    return super.collidesWithPlayer(player);
  }
}
