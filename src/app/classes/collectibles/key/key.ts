import {Position} from "../../entitiy/position";
import {Collectible} from "../collectible";
import {Gizmo} from "../../entitiy/gizmo/gizmo";
import {Player} from "../../entitiy/player/player";
import {GameComponent} from "../../../components/game/game.component";
import {GameAudio} from "../../audio/audio";

export class Key extends Collectible {

  constructor(position: Position) {
    super('../../assets/sprites/key/key.png', position, 1, 1);
    this.position.setY(this.position.getY() - 10);
  }

  onCollideWithEntity(entity: Gizmo, context: CanvasRenderingContext2D, delta: number): void {
  }

  onCollideWithPlayer(player: Player, context: CanvasRenderingContext2D, delta: number): void {

    const keys = GameComponent.getCurrentLevel().getKey();
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === this) {


        GameComponent.getCurrentLevel().getKey().splice(i, 1);
        GameAudio.getAudio('key:collect').play();
        player.collectedKeys++;
        break;
      }
    }


  }


}
