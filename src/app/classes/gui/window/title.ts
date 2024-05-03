import {Button} from "../button/button";
import {Position} from "../../entitiy/position";
import {Scale} from "../../entitiy/scale";
import {GameComponent} from "../../../components/game/game.component";

export class TitleScreen {
  private static buttons: Button[];
  private static titleScreen: TitleScreen;
  public buttons: Button[] = [];

  private constructor() {

    this.buttons =
      [
        new Button('../../../assets/gui/buttons/play.png', new Position(100, 100), new Scale(0.25), () => {
          GameComponent.isTitleScreen = false;
          GameComponent.player.preventInput = false;
        }),
        new Button('../../../assets/gui/mobile/down.png', new Position(100, 200), new Scale(0.25), () => {
         if(GameComponent.volume - 0.1 <= 0.0){
            GameComponent.volume = 0.0;
            return;
         }

         console.log("BEfore"+ GameComponent.volume);
          GameComponent.volume -= 0.1;
          console.log("AFTER" + GameComponent.volume);
        }),
        new Button('../../../assets/gui/mobile/up.png', new Position(100, 250), new Scale(0.25), () => {
         if(GameComponent.volume + 0.1 >= 1.0){
            GameComponent.volume = 1.0;
            return;

         }
          GameComponent.volume += 0.1;
         console.log(GameComponent.volume);
        }),
      ];
    TitleScreen.buttons = this.buttons;

    TitleScreen.titleScreen = this;


  }

  static checkButtons(clientX: number, clientY: number) {
    for (let button of this.buttons) {
      if (button.isClicked(clientX, clientY)) {
        button.onClick();
        return;
      }
    }
  }

  public static getScreen(): TitleScreen {
    if (this.titleScreen == null) this.titleScreen = new TitleScreen();
    return this.titleScreen;
  }

  public draw(context: CanvasRenderingContext2D) {

    context.fillStyle = "black";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    context.fillStyle = "white";
    context.font = "30px Arial";
    context.fillText("Welcome to Dungeons the Game!", context.canvas.width / 2.5, 100);

    context.fillText("A, W, D for Moving", context.canvas.width / 2.5, 130);
    context.fillText("F turn Flashlight on", context.canvas.width / 2.5, 160);
    context.fillText("Space to attack", context.canvas.width / 2.5, 190);

    for (let button of this.buttons) {
      button.draw(context);
    }
  }
}
