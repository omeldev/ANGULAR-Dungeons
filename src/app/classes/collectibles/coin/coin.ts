import {Sprite} from "../../entitiy/sprite";
import {Position} from "../../entitiy/position";
import {Collectible} from "../collectible";
import {Gizmo} from "../../entitiy/gizmo/gizmo";
import {Player} from "../../entitiy/player/player";
import {GameComponent} from "../../../components/game/game.component";
import {GameAudio} from "../../audio/audio";

export class Coin extends Collectible {
  /**
   * Create a new Coin
   * @param position {Position} of the Coin
   */
  constructor(position: Position) {
    super('../../assets/sprites/coin/coin.png', position, 14, 3);

    this.swapBuffer = 0;


    this.getPosition().setY(this.getPosition().getY() + 32);
    this.getPosition().setX(this.getPosition().getX() + 32);
  }

  onCollideWithEntity(entity: Gizmo, context: CanvasRenderingContext2D, delta: number): void {
  }

  onCollideWithPlayer(player: Player, context: CanvasRenderingContext2D, delta: number): void {


    const coins = GameComponent.getCurrentLevel().getCoins();
    for (let i = 0; i < coins.length; i++) {
      if (coins[i] === this) {
        player.collectedCoins++;
        GameComponent.getCurrentLevel().getCoins().splice(i, 1);
        GameAudio.getAudio('coin:collect').play();
        break;
      }
    }


  }


}
