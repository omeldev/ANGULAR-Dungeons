import {Position} from "./position";
import {Scale} from "./scale";

export class Sprite {
  private imageSrc: string;
  private readonly image: HTMLImageElement;
  private dirty: boolean;
  private position: Position;
  private isBackground: boolean;

  private scale: Scale;

  constructor(imageSrc: string, position: Position) {
    this.position = position;
    this.image = new Image();
    this.imageSrc = imageSrc;

    this.image.src = this.imageSrc;
    this.dirty = true;
    this.isBackground = false;

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
    return this.image.width;
  }

  public getHeight(): number {
    return this.image.height;
  }

  public isDirty(): boolean {
    return this.dirty;
  }

  public setWidth(width: number): void {
    this.image.width = width;
    this.dirty = true;
  }

  public setHeight(height: number): void {
    this.image.height = height;
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
      context.drawImage(this.image, this.position.getX(), this.position.getY(), this.image.width * this.getScale().getScale(), this.image.height * this.getScale().getScale());
      return;
    }

    if(this.isDirty()){
      context.drawImage(this.image, this.position.getX(), this.position.getY(), this.image.width * this.getScale().getScale(), this.image.height * this.getScale().getScale());
      this.setDirty(false);
    }
  }

  private setDirty(b: boolean) {
    this.dirty = b;
  }

  public update(context: CanvasRenderingContext2D, position: Position) {
    this.setPosition(position);
    this.draw(context);
  }
}
