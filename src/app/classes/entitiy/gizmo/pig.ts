import {Gizmo, SpeechBubble, SpeechBubbleType} from "./gizmo";
import {GameComponent} from "../../../components/game/game.component";
import {delay} from "rxjs";
import {Position} from "../position";
import {GameAudio} from "../../audio/audio";

export class Pig extends Gizmo {

  private currentBubble: number = 0;
  protected shouldSpeak: boolean = false;

  constructor(position: Position) {
    super('../../../assets/sprites/pig/animation/idle.png', position,  {
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
    }, 11);

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
      GameAudio.getAudio('pig:grunt').play();
    }
  }

  onCollide(context: CanvasRenderingContext2D, delta: number): void {
    if(this.shouldSpeak) return;
    this.speechBubbles[this.currentBubble].show(context, delta);
  }


}

export class KingPig extends Gizmo {


  constructor(position: Position) {
    super('../../../assets/sprites/pig/animation/king/idle.png', position, {
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
      GameAudio.getAudio('pig:grunt').play();
    }
  }




}
