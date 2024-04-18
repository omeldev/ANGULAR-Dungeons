import {Sprite} from "./sprite";

export class Animation {
  private sprites: Sprite[];

  constructor(sprites: Sprite[]) {
    this.sprites = sprites;
  }

  public getSprites(): Sprite[] {
    return this.sprites;
  }
}
