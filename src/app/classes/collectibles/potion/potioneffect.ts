export class PotionEffect {

  constructor(public type: PotionEffectType, public duration: number, public amplifier: number) {

  }

  public update(context: CanvasRenderingContext2D, delta: number): void {
    this.duration--;
  }

}

export enum PotionEffectType {
  SPEED,
  JUMP,
  STRENGTH

}
