export class PlayerSide {
  private readonly side: Side;
  private position: number;

  constructor(side: Side, position: number) {
    this.side = side;
    this.position = position;
  }

  public getSide(): Side {
    return this.side;
  }

  public getPosition(): number {
    return this.position;
  }

  public setPosition(position: number): void {
    this.position = position;
  }


}

export enum Side {
  TOP = 'TOP',
  RIGHT = 'RIGHT',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT'
}
