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

  public play(): void {
    const clone = this.audio.cloneNode(true) as HTMLAudioElement; // Create a clone of the audio element
    clone.play().then();
    clone.addEventListener("ended", function() {
      clone.remove();
    });
  }


}


export function initializeSounds() {
  new GameAudio('background', '../../../assets/sound/background/Dungeon%20Explorer.mp3', true);
  new GameAudio('pig:grunt', '../../../assets/sound/game/pig/grunt.mp3', false);

  new GameAudio('coin:collect', '../../../assets/sound/game/coin/collect.mp3', false);
  new GameAudio('shine:collect', '../../../assets/sound/game/shine/collect.mp3', false);

  new GameAudio('door:open', '../../../assets/sound/game/door/open.mp3', false);
  new GameAudio('key:collect', '../../../assets/sound/game/key/collect.mp3', false);
}
