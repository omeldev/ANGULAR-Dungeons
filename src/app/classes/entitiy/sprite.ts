import {Position} from "./position";
import {Scale} from "./scale";

export class Sprite {
  private imageSrc: string;
  private readonly image: HTMLImageElement;
  private dirty: boolean;
  private position: Position;
  private isBackground: boolean;

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
    this.dirty = true;
    this.isBackground = true;

    this.scale = new Scale(1);


  }

  public getImageSrc(): string {
    return this.imageSrc;
  }

  public setImageSrc(imageSrc: string): void {
    this.imageSrc = imageSrc;
    this.image.src = this.imageSrc;
    this.dirty = true;
  }

  public getImage(): HTMLImageElement {
    return this.image;
  }

  public getPosition(): Position {
    return this.position;
  }

  public setPosition(position: Position): void {
    this.position = position;
    this.dirty = true;
  }

  public setScale(scale: Scale): void {
    this.scale = scale;
    this.height = this.image.height * this.scale.getScale();
    this.width = this.image.width * this.scale.getScale();
    this.dirty = true;
  }

  public setX(x: number): void {
    this.position.setX(x);
    this.dirty = true;
  }

  public setY(y: number): void {
    this.position.setY(y);
    this.dirty = true;
  }

  public getX(): number {
    return this.position.getX();
  }

  public getY(): number {
    return this.position.getY();
  }

  public getWidth(): number {
    return (this.width * this.getScale().getScale());
  }

  public getHeight(): number {
    return this.height * this.getScale().getScale();
  }

  public isDirty(): boolean {
    return this.dirty;
  }

  public setWidth(width: number): void {
    this.width = width;
    this.dirty = true;
  }

  public setHeight(height: number): void {
    this.height = height;
    this.dirty = true;
  }

  public setIsBackground(isBackground: boolean): void {
    this.isBackground = isBackground;
  }

  public getIsBackground(): boolean {
    return this.isBackground;
  }


  public getScale(): Scale {
    return this.scale;
  }

  public draw(context: CanvasRenderingContext2D): void {
    if (this.isBackground) {
      context.drawImage(this.image, this.position.getX(), this.position.getY(), this.getWidth(), this.getHeight());
      return;
    }

    if (this.isDirty()) {
      context.drawImage(this.image, this.position.getX(), this.position.getY(), this.getWidth(), this.getHeight());
      this.setDirty(false);
    }
  }

  public update(context: CanvasRenderingContext2D, position: Position) {
    this.setPosition(position);
    this.draw(context);
  }

  private setDirty(b: boolean) {
    this.dirty = b;
  }
}
