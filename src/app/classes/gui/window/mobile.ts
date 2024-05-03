import {Button} from "../button/button";
import {Position} from "../../entitiy/position";
import {Scale} from "../../entitiy/scale";
import {setKeyPressed} from "../../../listener/keystroke";

export class Mobile {
  private static buttons: Button[];
  private static mobileScreen: Mobile;
  public buttons: Button[] = [];

  private constructor() {

    this.buttons = [
      new Button('../../../assets/gui/mobile/left.png', new Position(0, 300), new Scale(0.25), () => {
        setKeyPressed('a', true);
      }, () => {
        setKeyPressed('a', false);
      }),
      new Button('../../../assets/gui/mobile/right.png', new Position(100, 300), new Scale(0.25), () => {
        setKeyPressed('d', true);
      }, () => {
        setKeyPressed('d', false);
      }),
      new Button('../../../assets/gui/mobile/up.png', new Position(50, 250), new Scale(0.25), () => {
        setKeyPressed('w', true);
      }, () => {
        setKeyPressed('w', false)
      }),
      new Button('../../../assets/gui/mobile/down.png', new Position(100, 0), new Scale(0.25), () => {

      }),
    ];
    Mobile.buttons = this.buttons;

    Mobile.mobileScreen = this;


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

  public static getScreen() {
    if (this.mobileScreen == null) return new Mobile();
    return this.mobileScreen;

  }

  public draw(context: CanvasRenderingContext2D) {

    for (let button of this.buttons) {
      button.draw(context);
    }

  }
}
