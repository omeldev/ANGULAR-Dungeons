import {Gizmo, SpeechBubble, SpeechBubbleType} from "./gizmo";
import {GameComponent} from "../../../components/game/game.component";
import {delay} from "rxjs";

export class Pig extends Gizmo {
  protected speechBubbles: SpeechBubble[];

  private currentBubble: number = 0;
  private shouldSpeak: boolean = false;

  constructor(spriteSrc?: string, animations?: any, frameRate?: number) {
    super(spriteSrc || '../../../assets/sprites/pig/animation/idle.png', animations || {
      idle: {
        frameRate: 11,
        frameBuffer: 4,
        loop: true,
        imageSrc: '../../../assets/sprites/pig/animation/idle.png'
      },
      runLeft: {
        frameRate: 6,
        frameBuffer: 4,
        loop: true,
        imageSrc: '../../../assets/sprites/pig/animation/runLeft.png'
      },
      runRight: {
        frameRate: 6,
        frameBuffer: 4,
        loop: true,
        imageSrc: '../../../assets/sprites/pig/animation/runRight.png'
      }
    }, frameRate || 11);

    this.speechBubbles = [
      new SpeechBubble(SpeechBubbleType.SHOUT, this.getPosition(), 3, 8),
      new SpeechBubble(SpeechBubbleType.HELLO, this.getPosition(), 3, 8),
    ];


  }

  public override update(context: CanvasRenderingContext2D, delta: number) {
    super.update(context, delta);

    for (const bubble of this.speechBubbles) {
      bubble.getPosition().setY(this.getPosition().getY() - 10);
      bubble.getPosition().setX(this.getPosition().getX());
    }

    if(this.shouldSpeak) {
      this.speechBubbles[this.currentBubble].show(context, delta);
      return;
    }


  }

  onSwitch(context: CanvasRenderingContext2D, delta: number): void {
    if(this.currentBubble === 0) {
      this.currentBubble = 1;
    }else {
      this.currentBubble = 0;
    }

    this.shouldSpeak = Math.random() < 0.10;
  }

  onCollide(context: CanvasRenderingContext2D, delta: number): void {
  }


}

export class KingPig extends Gizmo {


  constructor() {
    super('../../../assets/sprites/pig/animation/king/idle.png', {
      idle: {
        frameRate: 12,
        frameBuffer: 6,
        loop: true,
        imageSrc: '../../../assets/sprites/pig/animation/king/idle.png'
      },
      runLeft: {
        frameRate: 6,
        frameBuffer: 4,
        loop: true,
        imageSrc: '../../../assets/sprites/pig/animation/king/runLeft.png'
      },
      runRight: {
        frameRate: 6,
        frameBuffer: 4,
        loop: true,
        imageSrc: '../../../assets/sprites/pig/animation/king/runRight.png'
      }
    }, 12);


  }

  onCollide(context: CanvasRenderingContext2D, delta: number): void {
  }

  onSwitch(context: CanvasRenderingContext2D, delta: number): void {
  }




}
