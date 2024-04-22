import {Position} from "./position";

export class PlayerSide {
  private readonly side: Side;
  private position: Position;

  constructor(side: Side, position: Position) {
    this.side = side;
    this.position = position;
  }

  public getSide(): Side {
    return this.side;
  }

  public getPosition(): Position {
    return this.position;
  }

  public setPosition(position: Position): void {
    this.position = position;
  }


}

export enum Side {
  TOP = 'TOP',
  RIGHT = 'RIGHT',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT'
}
