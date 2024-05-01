import {Position} from "../../entitiy/position";
import {GameComponent} from "../../../components/game/game.component";
import {Scale} from "../../entitiy/scale";

type Heart = 'full' | 'half' | 'empty';

export class Healthbar {
  private fullHeart: HTMLImageElement;
  private halfHeart: HTMLImageElement;
  private emptyHeart: HTMLImageElement;
  position: Position;
  private Scale: Scale = new Scale(1);

  constructor(position: Position) {
    this.position = position;
    this.fullHeart = new Image();
    this.halfHeart = new Image();
    this.emptyHeart = new Image();
    this.fullHeart.src = '../../../assets/sprites/player/heart/fullHeart.png';
    this.halfHeart.src = '../../../assets/sprites/player/heart/halfHeart.png';
    this.emptyHeart.src = '../../../assets/sprites/player/heart/emptyHeart.png';

    this.fullHeart.onload = () => {
      this.fullHeart.width = this.fullHeart.width * this.Scale.getScale();
      this.fullHeart.height = this.fullHeart.height * this.Scale.getScale();
    }
    this.halfHeart.onload = () => {
      this.halfHeart.width = this.halfHeart.width * this.Scale.getScale();
      this.halfHeart.height = this.halfHeart.height * this.Scale.getScale();
    }

    this.emptyHeart.onload = () => {
      this.emptyHeart.width = this.emptyHeart.width * this.Scale.getScale();
      this.emptyHeart.height = this.emptyHeart.height * this.Scale.getScale();
    }
  }

  public calculateHealth(entityHealth: number, entityMaxHealth: number): Heart[] {
    if (entityHealth > entityMaxHealth) throw new Error("invalid health");
    const heartValue = 10;
    const full = Math.floor(entityHealth / heartValue)
    const half: boolean = entityHealth % heartValue >= heartValue / 2;

    const hearts: Heart[] = new Array<Heart>(Math.ceil(entityMaxHealth / heartValue)).fill('empty');
    if (entityHealth < 0) return hearts;
    let counter = 0;
    for (counter; counter < full; counter++) hearts[counter] = 'full'
    if (half) hearts[counter] = 'half';

    return hearts;
  }

  public draw(context: CanvasRenderingContext2D, offset: number, health: number, maxHealth: number): void {
    const hearts = this.calculateHealth(health, maxHealth);

    hearts.forEach((heart, index) => {
      if (heart === 'full') context.drawImage(this.fullHeart, this.position.getX() + index * offset, this.position.getY(), this.fullHeart.width, this.fullHeart.height);
      else if (heart === 'half') context.drawImage(this.halfHeart, this.position.getX() + index * offset, this.position.getY(), this.halfHeart.width, this.halfHeart.height);
      else context.drawImage(this.emptyHeart, this.position.getX() + index * offset, this.position.getY(), this.emptyHeart.width, this.emptyHeart.height);
    });

  }
}
