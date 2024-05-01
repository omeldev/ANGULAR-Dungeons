import {Button} from "../button/button";

export class TitleScreen {
  private static buttons: Button[];
  public buttons: Button[] = [];

  constructor(buttons: Button[]) {

    this.buttons = buttons;
    TitleScreen.buttons = buttons;



  }

  static checkButtons(clientX: number, clientY: number) {
    for (let button of this.buttons) {
      if (button.isClicked(clientX, clientY)) {
        button.onClick();
        return;
      }
    }
  }

  public draw(context: CanvasRenderingContext2D) {

    //context.drawImage(this.image, 0, 0, this.width, this.height);
    context.fillStyle = "black";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    context.fillStyle = "white";
    context.font = "30px Arial";
    context.fillText("Welcome to Dungeons the Game!", context.canvas.width / 2.5, 100);

    context.fillText("A, W, D for Moving", context.canvas.width  / 2.5, 130);
    context.fillText("F turn Flashlight on", context.canvas.width  / 2.5, 160);
    context.fillText("Space to attack", context.canvas.width  / 2.5, 190);

    for (let button of this.buttons) {
      button.draw(context);
    }
  }
}
