import {Button} from "../button/button";

export class TitleScreen {
  private static buttons: Button[];
  // private readonly image: HTMLImageElement;
  public width: number = 0;
  public height: number = 0;
  public buttons: Button[] = [];
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  private loaded: boolean = false;

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
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.context = this.canvas.getContext("2d")!;

  }

  static checkButtons(clientX: number, clientY: number) {
    for (let button of this.buttons) {
      if (button.isClicked(clientX, clientY)) {
        button.onClick();
      }
    }
  }

  public draw() {

    //context.drawImage(this.image, 0, 0, this.width, this.height);
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.width, this.height);

    this.context.fillStyle = "white";
    this.context.font = "30px Arial";
    this.context.fillText("Welcome to Dungeons the Game!", this.width / 2.5, 100);

    this.context.fillText("A, W, D for Moving", this.width / 2.5, 130);
    this.context.fillText("F turn Flashlight on", this.width / 2.5, 160);
    this.context.fillText("Space to attack", this.width / 2.5, 190);

    for (let button of this.buttons) {
      button.draw(this.context);
    }

    TitleScreen.checkButtons(0, 0);
  }
}
