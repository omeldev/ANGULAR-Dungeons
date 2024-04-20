import {Sprite} from "./sprite";

export class Animation {
  private sprites: Sprite[];

  constructor(sprites: Sprite[]) {
    this.sprites = sprites;
  }

  public getSprites(): Sprite[] {
    return this.sprites;
  }

  public setSprites(sprites: Sprite[]): void {
    this.sprites = sprites;
  }


  public getSprite(index: number): Sprite {
    if (index < 0) return this.sprites[0];
    if (index >= this.sprites.length) return this.sprites[this.sprites.length - 1];
    return this.sprites[index];
  }

  public play(context: CanvasRenderingContext2D): void {
    let index = 0;
    const interval = setInterval(() => {
      if (index < this.sprites.length) {

        this.draw(context, index);
        index++;

      } else {
        clearInterval(interval);
      }
    }, 1000 / 60);

  }


  private draw(context: CanvasRenderingContext2D, spriteIndex: number): void {
    const sprite = this.getSprite(spriteIndex);
    sprite.draw(context);
  }

}
