import {Sprite} from "../entitiy/sprite";
import {Position} from "../entitiy/position";
import {Hitbox} from "../level/collision/hitbox";
import {GameComponent} from "../../components/game/game.component";
import {Gizmo} from "../entitiy/gizmo/gizmo";
import {Player} from "../entitiy/player/player";

export abstract class Collectible extends Sprite {

  private hitbox: Hitbox | undefined;

  private swapBuffer = 2 + Math.random();
  private swapCounter = 0;
  private swap = false;


  constructor(imageSrc: string, position: Position, frameRate: number, frameBuffer: number) {
    super(imageSrc, position, () => {
      this.hitbox = new Hitbox(position, this.getWidth(), this.getHeight());
    }, frameRate);
    this.frameBuffer = frameBuffer;
    this.loop = true;
    this.autoPlay = true;
  }

  public getHitbox(): Hitbox {
    if (!this.hitbox) {
      throw new Error('Hitbox not initialized');
    }
    return this.hitbox;
  }

  public abstract onCollideWithPlayer(player: Player, context: CanvasRenderingContext2D, delta: number): void;

  public abstract onCollideWithEntity(entity: Gizmo, context: CanvasRenderingContext2D, delta: number): void;

  public override drawSprite(context: CanvasRenderingContext2D, delta: number): void {
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


    this.updateHitbox(0, 0);


    if (this.checkCollision(GameComponent.getPlayer().getHitbox())) {
      this.onCollideWithPlayer(GameComponent.getPlayer(), context, delta);
    }
    for (let entity of GameComponent.getCurrentLevel().getEntities()) {
      if (this.checkCollision(entity.getHitbox())) {
        this.onCollideWithEntity(entity, context, delta);
      }
    }


  }

  public checkCollision(hitbox: Hitbox): boolean {
    if (!this.hitbox) {
      throw new Error('Hitbox not initialized');
    }
    return this.hitbox.getPosition().getX() <= hitbox.getPosition().getX() + hitbox.getWidth() &&
      this.hitbox.getPosition().getX() + this.hitbox.getWidth() >= hitbox.getPosition().getX() &&
      this.hitbox.getPosition().getY() + this.hitbox.getHeight() >= hitbox.getPosition().getY() &&
      this.hitbox.getPosition().getY() <= hitbox.getPosition().getY() + hitbox.getHeight();
  }

  public updateHitbox(offsetX: number, offsetY: number): void {
    if (!this.hitbox) return;
    this.hitbox.getPosition().setX(this.getPosition().getX() + offsetX);
    this.hitbox.getPosition().setY(this.getPosition().getY() + offsetY);

  }


}
