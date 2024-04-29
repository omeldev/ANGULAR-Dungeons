import {Player} from "../player/player";
import {GameComponent} from "../../../components/game/game.component";
import {Position} from "../position";

export class Flashlight {

  public drawDarkness = true;

  public isActive: boolean = false;

  public cooldown: number = 0;

  public updateCooldown(delta: number): void {
    if(this.cooldown > 0) {
      this.cooldown -= delta;
    }
  }

  public shaderCanvas = document.createElement('canvas');
  public draw(context: CanvasRenderingContext2D, position: Position, delta: number, radius: number = 100): void {
    this.updateCooldown(delta)


    this.shaderCanvas.width = GameComponent.canvasWidth;
    this.shaderCanvas.height = GameComponent.canvasHeight;

    const shaderContext = this.shaderCanvas.getContext('2d')!;

    shaderContext.fillStyle = 'rgba(0,0,0,0.5)';
    shaderContext.fillRect(0, 0, GameComponent.canvasWidth, GameComponent.canvasHeight);

    if(this.isActive){

      shaderContext.globalCompositeOperation = 'destination-out';
      shaderContext.beginPath();
      shaderContext.arc(position.getX() + 80, position.getY() + 50, radius, 0, 2 * Math.PI);
      shaderContext.fill();
      shaderContext.closePath();
      shaderContext.globalCompositeOperation = 'source-over';

    }

    for(let shine of GameComponent.getCurrentLevel().getShines()) {
      shaderContext.globalCompositeOperation = 'destination-out';
      shaderContext.beginPath();
      shaderContext.arc(shine.getPosition().getX() + 20, shine.getPosition().getY(), 100, 0, 2 * Math.PI);
      shaderContext.fill();
      shaderContext.closePath();
      shaderContext.globalCompositeOperation = 'source-over';
    }

    context.drawImage(this.shaderCanvas, 0, 0);





  }


  public toggle(cooldown: number = 1): void {
    this.isActive = !this.isActive;
    this.cooldown = cooldown;
  }


}
