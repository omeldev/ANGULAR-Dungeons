import {GameComponent} from "../../components/game/game.component";
import {Position} from "../entitiy/position";

export class Flashlight {

  public isActive: boolean = false;

  public cooldown: number = 0;
  public shaderCanvas = document.createElement('canvas');


  public flashCount = 0;
  public flashBuffer = 0.005;
  public flashIterations = 0;

  public updateCooldown(delta: number): void {
    if (this.cooldown > 0) {
      this.cooldown -= delta;
    }
  }

  public draw(context: CanvasRenderingContext2D, delta: number): void {
    this.updateCooldown(delta)


    this.shaderCanvas.width = GameComponent.canvasWidth;
    this.shaderCanvas.height = GameComponent.canvasHeight;

    const shaderContext = this.shaderCanvas.getContext('2d')!;

    shaderContext.fillStyle = 'rgba(0,0,0,0.7)';
    shaderContext.fillRect(0, 0, GameComponent.canvasWidth, GameComponent.canvasHeight);

    let radius = 50;

      if (GameComponent.player.collectedShines >= 3) {
        this.isActive = true;
        if (this.flashIterations < 50) {
          radius = 250 + (GameComponent.player.collectedShines + 1 + this.flashIterations) * 5;

          if (this.flashCount < this.flashBuffer) {
            this.flashCount += delta;

          } else {
            this.flashCount = 0;
            this.flashIterations++;
            if (this.flashIterations >= 50) {
              this.flashIterations = 0;
              this.flashCount = 0;
              GameComponent.isFlashLightShaderOn = false;
              GameComponent.player.collectedShines = 0;

            }

        }
      }





    } else if (GameComponent.isFlashLightShaderOn) radius = 50 * (GameComponent.player.collectedShines + 1);

    if(this.isActive) {
      shaderContext.globalCompositeOperation = 'destination-out';
      shaderContext.beginPath();
      shaderContext.arc(GameComponent.getPlayer().getPosition().getX() + 80, GameComponent.getPlayer().getPosition().getY() + 50, radius, 0, 2 * Math.PI);
      shaderContext.closePath();
      shaderContext.fill();
      shaderContext.globalCompositeOperation = 'source-over';

    }

    for (let shine of GameComponent.getCurrentLevel().getShines()) {
      shaderContext.globalCompositeOperation = 'destination-out';
      shaderContext.beginPath();
      shaderContext.arc(shine.getPosition().getX() + 20, shine.getPosition().getY(), 50, 0, 2 * Math.PI);
      shaderContext.fill();
      shaderContext.closePath();
      shaderContext.globalCompositeOperation = 'source-over';
    }

    for (let key of GameComponent.getCurrentLevel().getKey()) {
      shaderContext.globalCompositeOperation = 'destination-out';
      shaderContext.beginPath();
      shaderContext.arc(key.getPosition().getX() + 15, key.getPosition().getY() + 15, 20, 0, 2 * Math.PI);
      shaderContext.fill();
      shaderContext.closePath();
      shaderContext.globalCompositeOperation = 'source-over';
    }


    if(GameComponent.isFlashLightShaderOn) context.drawImage(this.shaderCanvas, 0, 0);


  }


  public toggle(cooldown: number = 1): void {
    this.isActive = !this.isActive;
    this.cooldown = cooldown;
  }


}
