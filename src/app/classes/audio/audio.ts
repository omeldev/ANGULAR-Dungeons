import {GameComponent} from "../../components/game/game.component";

export class GameAudio {


  static map: Map<string, GameAudio> = new Map<string, GameAudio>();

  private audio: HTMLAudioElement;

  constructor(name: string, audioSrc: string, loop: boolean, volume: number = GameComponent.volume) {
    this.audio = new Audio(audioSrc);
    this.audio.loop = loop;
    this.audio.volume = volume;

    GameAudio.map.set(name, this);
  }

  public static getAudio(name: string): GameAudio {
    return GameAudio.map.get(name)!;
  }


  public getAudio(): HTMLAudioElement {
    return this.audio;
  }

  public play(onEnded?: () => void): void {
    const clone = this.audio.cloneNode(true) as HTMLAudioElement; // Create a clone of the audio element
    clone.volume = GameComponent.volume;
    clone.play().then();
    clone.addEventListener("ended", function () {
      onEnded?.();
      clone.remove();
    });
  }

}

export class AudioPlayer {
  private gameAudioNames: string[];
  private currentIndex: number = 0;

  constructor(gameAudioNames: string[]) {
    this.gameAudioNames = gameAudioNames;
  }

  public playNext(): void {
    GameAudio.getAudio(this.gameAudioNames[this.currentIndex]).play(() => {
      this.currentIndex++;
      if (this.currentIndex < this.gameAudioNames.length) {
        this.playNext();
      } else {
        this.currentIndex = 0;
        this.playNext()
      }
    });
  }


}


export function initializeSounds() {
  new GameAudio('background', '../../../assets/sound/background/Dungeon%20Explorer.mp3', false);
  new GameAudio('background2', '../../../assets/sound/background/The%20Quest%20for%20Freedom.mp3', false);
  new GameAudio('background3', '../../../assets/sound/background/Quest%20for%20Society.mp3', false);
  new GameAudio('background4', '../../../assets/sound/background/Quest%20for%20the%20Treasure.mp3', false);

  new GameAudio('player:attack', '../../../assets/sound/game/player/attack.mp3', false);
  new GameAudio('pig:grunt', '../../../assets/sound/game/pig/grunt.mp3', false);

  new GameAudio('coin:collect', '../../../assets/sound/game/coin/collect.mp3', false);
  new GameAudio('shine:collect', '../../../assets/sound/game/shine/collect.mp3', false);

  new GameAudio('door:open', '../../../assets/sound/game/door/open.mp3', false);
  new GameAudio('key:collect', '../../../assets/sound/game/key/collect.mp3', false);
}
