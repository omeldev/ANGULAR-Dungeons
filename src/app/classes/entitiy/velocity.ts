export class Velocity {


  constructor(private x: number, private y: number) {

  }

  public setX(x: number): void {
    this.x = x;
  }

  public setY(y: number): void {
    this.y = y;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public isNegativeX(): boolean {
    return this.x < 0;
  }

  public isNegativeY(): boolean {
    return this.y < 0;
  }
}
