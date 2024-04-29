import {Gizmo, SpeechBubble, SpeechBubbleType} from "./gizmo";
import {GameComponent} from "../../../components/game/game.component";
import {delay} from "rxjs";

export class Pig extends Gizmo {

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




  }

  public override update(context: CanvasRenderingContext2D, delta: number) {
    super.update(context, delta);
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
    this.speechBubbles[this.currentBubble].show(context, delta);
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
    this.speechBubbles[0].show(context, delta);


  }

  onSwitch(context: CanvasRenderingContext2D, delta: number): void {
  }




}
