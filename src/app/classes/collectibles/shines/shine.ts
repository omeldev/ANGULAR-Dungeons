import {Position} from "../../entitiy/position";
import {Collectible} from "../collectible";
import {Gizmo} from "../../entitiy/gizmo/gizmo";
import {Player} from "../../entitiy/player/player";
import {GameComponent} from "../../../components/game/game.component";
import {GameAudio} from "../../audio/audio";

export class Shine extends Collectible {


  constructor(position: Position) {
    super('../../../assets/sprites/shine/idle.png', position, 8, 5);

    this.getPosition().setY(this.getPosition().getY() + 32);
    this.getPosition().setX(this.getPosition().getX() + 32);


  }

  onCollideWithEntity(entity: Gizmo, context: CanvasRenderingContext2D, delta: number): void {
  }

  onCollideWithPlayer(player: Player, context: CanvasRenderingContext2D, delta: number): void {
    const shines = GameComponent.getCurrentLevel().getShines();
    for (let i = 0; i < shines.length; i++) {
      if (shines[i] === this) {
        GameComponent.getCurrentLevel().getShines().splice(i, 1);
        player.collectedShines++
        GameAudio.getAudio('shine:collect').play();

        break;
      }
    }


  }


}
