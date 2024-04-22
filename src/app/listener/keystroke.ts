export class GameKey {
  private readonly key: string;
  private pressed: boolean;

  constructor(key: string, pressed: boolean) {
    this.key = key;
    this.pressed = pressed;

  }

  public getKey(): string {
    return this.key;
  }

  public isPressed(): boolean {
    return this.pressed;
  }

  public setPressed(pressed: boolean): void {
    this.pressed = pressed;
  }


}

export const KEYS: GameKey[] = [
  new GameKey('w', false),
  new GameKey(' ', false),
  new GameKey('a', false),
  new GameKey('d', false),
];

export function setKeyPressed(key: string, pressed: boolean): void {
  const gameKey = KEYS.find(gameKey => gameKey.getKey() === key);
  gameKey!.setPressed(pressed);
}

export function isKeyPressed(key: string): boolean {
  const gameKey = KEYS.find(gameKey => gameKey.getKey() === key);
  return gameKey!.isPressed();
}

export function registerKeystrokes(): void {

  window.addEventListener('keydown', (event) => {
    const key = event.key;


    if (event.code === 'Space') {
      setKeyPressed('w', true);
      return;
    }

    switch (key) {
      case 'w':
        setKeyPressed('w', true);
        break;
      case 'a':
        setKeyPressed('a', true);
        break;
      case 'd':
        setKeyPressed('d', true);
        break;

      default:
        break;
    }
  });

  window.addEventListener('keyup', (event) => {
    const key = event.key;

    if (event.code === 'Space') {
      setKeyPressed('w', false);
      return;
    }

    switch (key) {
      case 'w':
        setKeyPressed('w', false);
        break;
      case 'a':
        setKeyPressed('a', false);
        break;
      case 'd':
        setKeyPressed('d', false);
        break;

      default:
        break;
    }
  });

}


