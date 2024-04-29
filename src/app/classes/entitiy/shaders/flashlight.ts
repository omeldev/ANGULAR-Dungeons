import {Player} from "../player/player";
import {GameComponent} from "../../../components/game/game.component";

export class Flashlight {

  public isActive: boolean = false;

  public cooldown: number = 0;

  public updateCooldown(delta: number): void {
    if(this.cooldown > 0) {
      this.cooldown -= delta;
    }
  }

  public draw(context: CanvasRenderingContext2D, player: Player, delta: number): void {
    this.updateCooldown(delta)
    const offsetX = 80;
    const offsetY = 50;
    const gradient = context.createRadialGradient(
      player.getPosition().getX() + offsetX, player.getPosition().getY() + offsetY, 0,
      player.getPosition().getX() + offsetX, player.getPosition().getY() + offsetY, 100
    );
    if (this.isActive) {
      gradient.addColorStop(0, 'rgba(0,0,0,0)'); // Transparent center
    }
    gradient.addColorStop(1, 'rgba(0,0,0,0.7)'); // Opaque edges

    context.fillStyle = gradient;
    context.fillRect(0, 0, GameComponent.canvasWidth, GameComponent.canvasHeight);
  }


  public toggle(cooldown: number = 1): void {
    this.isActive = !this.isActive;
    this.cooldown = cooldown;
  }


}
