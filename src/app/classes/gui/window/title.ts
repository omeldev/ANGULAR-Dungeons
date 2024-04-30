import {Position} from "../../entitiy/position";
import {Button} from "../button/button";
import {GameComponent} from "../../../components/game/game.component";

export class TitleScreen {
 // private readonly image: HTMLImageElement;
  public width: number = 0;
  public height: number = 0;
  private loaded: boolean = false;
  public buttons: Button[] = [];
  private static buttons: Button[];
  constructor(buttons: Button[]) {
    /*
    this.image = new Image();
    this.image.src = "assets/title.png";
    this.image.onload = () => {
      this.loaded = true;
      this.width = this.image.width;
      this.height = this.image.height;
    }

     */

    this.buttons = buttons;
    TitleScreen.buttons = buttons;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

  }

  public draw(context: CanvasRenderingContext2D) {

    //context.drawImage(this.image, 0, 0, this.width, this.height);
    context.fillStyle = "black";
    context.fillRect(0, 0, this.width, this.height);

    context.fillStyle = "white";
    context.font = "30px Arial";
    context.fillText("Welcome to Dungeons the Game!", this.width / 2.5, 100);

    context.fillText("A, W, D for Moving", this.width / 2.5, 130);
    context.fillText("F turn Flashlight on", this.width / 2.5, 160);



    for(let button of this.buttons) {
      button.draw(context);
    }

    TitleScreen.checkButtons(0, 0);
  }

  static checkButtons(clientX: number, clientY: number) {
    for(let button of this.buttons) {
      if(button.isClicked(clientX, clientY)) {
        button.onClick();
      }
    }
  }
}
