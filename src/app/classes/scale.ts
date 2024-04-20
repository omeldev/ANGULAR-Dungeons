export class Scale {


  constructor(private scale: number) {

  }

  public setScale(scale: number): void {
    this.scale = scale;
  }

  public getScale(): number {
    return this.scale;
  }
}
