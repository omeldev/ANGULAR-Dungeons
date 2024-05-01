import {Position} from "../../entitiy/position";
import {Scale} from "../../entitiy/scale";

export class Button {

  public onClick: () => void;
  public onRelease: () => void;
  private image: HTMLImageElement;
  private width: number = 0;
  private height: number = 0;
  private loaded: boolean = false;
  private position: Position;
  public scale: Scale;

  constructor(imageSrc: string, position: Position, scale: Scale = new Scale(1), onClick: () => void, onRelease: () => void = () => {}) {
    this.onClick = onClick;
    this.onRelease = onRelease;
    this.image = new Image();
    this.image.src = imageSrc;
    this.image.onload = () => {
      this.loaded = true;
      this.width = this.image.width * scale.getScale();
      this.height = this.image.height * scale.getScale();
    }

    this.position = position;
    this.scale = scale;
  }

  public draw(context: CanvasRenderingContext2D) {
    if (!this.loaded) return;
    context.drawImage(this.image, this.position.getX(), this.position.getY(), this.width, this.height);
    //Draw a box around the button
    context.strokeStyle = "red";
    context.strokeRect(this.position.getX(), this.position.getY(), this.width, this.height);

  }

  public isClicked(x: number, y: number): boolean {

    if (x >= this.position.getX() && x <= this.position.getX() + this.width) {
      if (y >= this.position.getY() && y <= this.position.getY() + this.height) {
        console.log("Button Clicked")
        return true;
      }
    }
    return false;
  }
}
