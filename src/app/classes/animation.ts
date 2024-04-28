import {Sprite} from "./entitiy/sprite";
import {Position} from "./entitiy/position";

export class AnimationSet {

  private animations: Animation[];

  constructor(animations: Animation[]) {
    this.animations = animations;
  }

  public getAnimation(key: string): Animation {
    return this.animations.find(animation => animation.getKey() === key)!;
  }

  public getAnimations(): Animation[] {
    return this.animations;
  }

}

export class Animation {

  private sprite: Sprite;
  private key: string;

  constructor(key: string, spriteSrc: string, frameRate: number, frameBuffer: number, loop: boolean, autoplay: boolean = true, onComplete?: () => void) {
    this.sprite = new Sprite(spriteSrc, new Position(0, 0), () => {
    }, frameRate, {});
    this.key = key;
  }

  public getSprite(): Sprite {
    return this.sprite;
  }

  public getKey(): string {
    return this.key;
  }

}
