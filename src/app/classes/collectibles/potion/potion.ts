import {Sprite} from "../../entitiy/sprite";
import {Position} from "../../entitiy/position";
import {Collectible} from "../collectible";
import {Gizmo} from "../../entitiy/gizmo/gizmo";
import {Player} from "../../entitiy/player/player";
import {GameComponent} from "../../../components/game/game.component";
import {GameAudio} from "../../audio/audio";

export class Potion extends Collectible {


  constructor(imageSource: string, position: Position, frameRate: number, frameBuffer: number) {
    super(imageSource, position, frameRate, frameBuffer);
    this.position.setY(this.position.getY() + 10);
  }

  onCollideWithEntity(entity: Gizmo, context: CanvasRenderingContext2D, delta: number): void {
  }

  onCollideWithPlayer(player: Player, context: CanvasRenderingContext2D, delta: number): void {
  }



}

export class HealthPotion extends Potion {

  private healAmount : number;

  constructor(position: Position, healAmount: number = 25 ) {
    super('../../assets/sprites/potion/healthPotion.png', position, 1, 1);
    this.healAmount = healAmount;
  }

  public override onCollideWithPlayer(player: Player, context: CanvasRenderingContext2D, delta: number): void {

    const healthPotions = GameComponent.getCurrentLevel().getHealthPotions();
    for (let i = 0; i < healthPotions.length; i++) {
      if (healthPotions[i] === this) {
        if (player.health === player.maxHealth) return;
        GameComponent.getCurrentLevel().getHealthPotions().splice(i, 1);

        if (player.health + this.healAmount > player.maxHealth) {

          player.health = player.maxHealth;


        } else {
          player.health += this.healAmount;

        }


        GameAudio.getAudio('shine:collect').play();

        break;
      }
    }
  }

}
