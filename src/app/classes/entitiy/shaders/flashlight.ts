import {Position} from "../position";
import {Player} from "../player/player";
import {GameComponent} from "../../../components/game/game.component";

export class Flashlight {

  public draw(context: CanvasRenderingContext2D, player: Player): void {
    const offsetX = 80;
    const offsetY = 50;
    const gradient = context.createRadialGradient(
       player.getPosition().getX() + offsetX,  player.getPosition().getY() + offsetY, 0,
      player.getPosition().getX() + offsetX,  player.getPosition().getY() + offsetY, 100
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)'); // Transparent center
    gradient.addColorStop(1, 'rgba(0,0,0,0.7)'); // Opaque edges

    context.fillStyle = gradient;
    context.fillRect(0, 0, GameComponent.canvasWidth, GameComponent.canvasHeight);
  }



}
