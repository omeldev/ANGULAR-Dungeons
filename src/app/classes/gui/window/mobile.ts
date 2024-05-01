import {Button} from "../button/button";

export class Mobile {
  private static buttons: Button[];
  public buttons: Button[] = [];

  constructor(buttons: Button[]) {

    this.buttons = buttons;
    Mobile.buttons = buttons;



  }

  static checkButtons(clientX: number, clientY: number) {
    for (let button of this.buttons) {
      if (button.isClicked(clientX, clientY)) {
        button.onClick();
        return;
      }
    }
  }

  static releaseButtons(clientX: number, clientY: number) {
    for (let button of this.buttons) {
      if (button.isClicked(clientX, clientY)) {
        button.onRelease();
        return;

      }
    }
  }

  public draw(context: CanvasRenderingContext2D) {

    for (let button of this.buttons) {
      button.draw(context);
    }

  }
}
