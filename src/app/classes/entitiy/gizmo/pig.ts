import {Gizmo, SpeechBubble, SpeechBubbleType} from "./gizmo";
import {GameComponent} from "../../../components/game/game.component";
import {delay} from "rxjs";

export class Pig extends Gizmo {

  private currentBubble: number = 0;
  protected shouldSpeak: boolean = false;

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

    this.getScale().setScale(1)




  }

  public override update(context: CanvasRenderingContext2D, delta: number) {
    super.update(context, delta);
    if(this.shouldSpeak) {
      this.speechBubbles[this.currentBubble].show(context, delta);
      return;
    }

  }

  onSwitch(context: CanvasRenderingContext2D, delta: number): void {

    this.currentBubble = Math.floor(Math.random() * this.speechBubbles.length);

    this.shouldSpeak = Math.random() < 0.10;

    if(Math.random() < 0.1) {
      const audio = new Audio('../../../assets/sound/game/pig/grunt.mp3');
      audio.volume = GameComponent.volume;
      audio.play().then();
    }
  }

  onCollide(context: CanvasRenderingContext2D, delta: number): void {
    if(this.shouldSpeak) return;
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
    if(Math.random() < 0.10) {
      const audio = new Audio('../../../assets/sound/game/pig/grunt.mp3');
      audio.volume = GameComponent.volume;
      audio.play().then();
    }
  }




}
