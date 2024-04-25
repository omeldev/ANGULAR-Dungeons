import {Position} from "./position";
import {Scale} from "./scale";

export class Sprite {
  private readonly position: Position;
  private readonly image: HTMLImageElement;
  private readonly imageSrc: string;

  private width: number = 0;
  private height: number = 0;

  private scale: Scale;

  constructor(imageSrc: string, position?: Position) {
    this.position = position ? position : new Position(0, 0);
    this.image = new Image();
    this.imageSrc = imageSrc;

    this.image.onload = () => {
      this.width = this.image.width;
      this.height = this.image.height;
    }
    this.image.src = this.imageSrc;
    this.scale = new Scale(1);
  }

  public getImage(): HTMLImageElement {
    return this.image;
  }

  public getPosition(): Position {
    return this.position;
  }

  public setPosition(position: Position): void {
    this.getPosition().setY(position.getY());
    this.getPosition().setX(position.getX());
  }

  public setScale(scale: Scale): void {
    this.scale = scale;
    this.height = this.image.height * this.scale.getScale();
    this.width = this.image.width * this.scale.getScale();
  }

  public getWidth(): number {
    return (this.width * this.getScale().getScale());
  }

  public getHeight(): number {
    return this.height * this.getScale().getScale();
  }

  public getScale(): Scale {
    return this.scale;
  }

  public drawSprite(context: CanvasRenderingContext2D): void {
      context.drawImage(this.image, this.position.getX(), this.position.getY(), this.getWidth(), this.getHeight());
  }

}
