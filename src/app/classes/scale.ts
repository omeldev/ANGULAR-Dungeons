export class Scale {
  private scale: number;

  constructor(scale: number) {
    this.scale = scale;
  }

  public setScale(scale: number): void {
    this.scale = scale;
  }

  public getScale(): number {
    return this.scale;
  }
}
