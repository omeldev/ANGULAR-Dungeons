export class Scale {
  private readonly scale: number;

  constructor(scale: number) {
    this.scale = scale;
  }

  public getScale(): number {
    return this.scale;
  }
}
