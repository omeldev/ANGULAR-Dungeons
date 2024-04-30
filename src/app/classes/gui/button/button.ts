import {Position} from "../../entitiy/position";

export class Button {

  public onClick: () => void;
  private image: HTMLImageElement;
  private width: number = 0;
  private height: number = 0;
  private loaded: boolean = false;
  private position: Position;

  constructor(imageSrc: string, position: Position, onClick: () => void) {
    this.onClick = onClick;
    this.image = new Image();
    this.image.src = imageSrc;
    this.image.onload = () => {
      this.loaded = true;
      this.width = this.image.width;
      this.height = this.image.height;
    }

    this.position = position;
  }

  public draw(context: CanvasRenderingContext2D) {
    if (!this.loaded) return;
    context.drawImage(this.image, this.position.getX(), this.position.getY(), this.width, this.height);

  }

  public isClicked(x: number, y: number): boolean {
    return x >= this.position.getX() && x <= this.position.getX() + this.width && y >= this.position.getY() && y <= this.position.getY() + this.height;
  }
}
