import {Position} from "./position";
import {Scale} from "./scale";

export class Sprite {
  private readonly position: Position;
  private readonly image: HTMLImageElement;
  private readonly imageSrc: string;

  private width: number = 0;
  private height: number = 0;

  private scale: Scale;

  /**
   * Create a new Sprite
   * @param imageSrc path to the image
   * @param position {Position} of the Sprite
   * @param funcOnLoad {() => void} function to call when the image is loaded
   */
  constructor(imageSrc: string, position?: Position, funcOnLoad?: () => void) {
    this.position = position ? position : new Position(0, 0);
    this.image = new Image();
    this.imageSrc = imageSrc;

    /**
     * Set the width and height of the image
     * when the image is loaded
     */
    this.image.onload = () => {
      this.width = this.image.width;
      this.height = this.image.height;

      funcOnLoad?.();

    }


    this.image.src = this.imageSrc;
    this.scale = new Scale(1);
  }

  /**
   * Get the image Element of the Sprite
   * @returns {HTMLImageElement} of the Sprite
   */
  public getImage(): HTMLImageElement {
    return this.image;
  }

  /**
   * Get the position of the Sprite
   * @returns {Position} of the Sprite
   */
  public getPosition(): Position {
    return this.position;
  }

  /**
   * Set the position of the Sprite
   * @param position {Position} of the Sprite
   */
  public setPosition(position: Position): void {
    this.getPosition().setY(position.getY());
    this.getPosition().setX(position.getX());
  }

  /**
   * Set the scale of the Sprite
   * @param scale {Scale} of the Sprite
   */
  public setScale(scale: Scale): void {
    this.getScale().setScale(scale.getScale());
    this.height = this.image.height * this.scale.getScale();
    this.width = this.image.width * this.scale.getScale();
  }

  /**
   * Get the width of the Sprite
   * @returns {number} width
   */
  public getWidth(): number {
    return (this.width * this.getScale().getScale());
  }

  /**
   * Get the height of the Sprite
   * @returns {number} height
   */
  public getHeight(): number {
    return this.height * this.getScale().getScale();
  }

  public setWidth(width: number): void {
    this.width = width;
  }

  public setHeight(height: number): void {
    this.height = height;
  }

  /**
   * Get the scale of the Sprite
   * @returns {Scale} of the Sprite
   */
  public getScale(): Scale {
    return this.scale;
  }

  /**
   * Draw the Sprite on the canvas
   * @param context {CanvasRenderingContext2D} of the canvas
   */
  public drawSprite(context: CanvasRenderingContext2D): void {
    context.drawImage(this.image, this.position.getX(), this.position.getY(), this.getWidth(), this.getHeight());
  }

}
