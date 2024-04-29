import {Gizmo, SpeechBubble, SpeechBubbleType} from "./gizmo";
import {GameComponent} from "../../../components/game/game.component";

export class Pig extends Gizmo {
  protected speechBubbles: SpeechBubble[];

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

    if (this.collidesWithPlayer(GameComponent.getPlayer())) {
      this.speechBubbles[1].show(context, delta);
    }


  }


}

export class KingPig extends Pig {


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


  public override update(context: CanvasRenderingContext2D, delta: number) {
    super.update(context, delta);

    for (const bubble of this.speechBubbles) {
      bubble.getPosition().setY(this.getPosition().getY() - 10);
      bubble.getPosition().setX(this.getPosition().getX());
    }

    if (this.collidesWithPlayer(GameComponent.getPlayer())) {
      this.speechBubbles[0].show(context, delta);
    }


  }


}
