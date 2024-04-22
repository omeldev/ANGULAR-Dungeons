import {Sprite} from "./entitiy/sprite";

export class Animation {
  private sprites: Sprite[];
  private loop: boolean = false;

  private interval: ReturnType<typeof setInterval> | undefined = undefined;

  private speed: number = 1000 / 60;

  private context: CanvasRenderingContext2D | null = null;

  constructor(sprites: Sprite[]) {
    this.sprites = sprites;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
    if (this.interval) {
      clearInterval(this.interval);
      this.play(this.context!);
    }
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

  public getSpeed(): number {
    return this.speed;
  }

  public play(context: CanvasRenderingContext2D): void {
    this.context = context;
    let index = 0;
    this.interval = setInterval(() => {
      if (index < this.sprites.length) {

        this.draw(context, index);
        index++;

      } else {
        if (!this.loop) {
          clearInterval(this.interval);
        }
      }
    }, this.speed);

  }

  public stop(): void {
    clearInterval(this.interval!);
  }

  private draw(context: CanvasRenderingContext2D, spriteIndex: number): void {
    const sprite = this.getSprite(spriteIndex);
    sprite.draw(context);
  }

}
