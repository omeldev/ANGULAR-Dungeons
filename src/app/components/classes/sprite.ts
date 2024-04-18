export class Sprite {
  private imageSrc: string;
  private readonly image: HTMLImageElement;
  private isDirty: boolean;

  constructor(imageSrc: string) {
    this.image = new Image();
    this.imageSrc = imageSrc;
    this.image.src = this.imageSrc;
    this.isDirty = true;

  }

  public getImageSrc(): string {
    return this.imageSrc;
  }

  public setImageSrc(imageSrc: string): void {
    this.imageSrc = imageSrc;
    this.image.src = this.imageSrc;
    this.isDirty = true;
  }

  public getImage(): HTMLImageElement {
    return this.image;
  }
}
