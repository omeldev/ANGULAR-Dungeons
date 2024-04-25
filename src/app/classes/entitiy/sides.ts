import {Position} from "./position";

export class PlayerSide {
  private readonly side: Side;
  private position: Position;

  /**
   * Create a new side
   * @param side {Side} side of an Object
   * @param position {Position} position of the side
   */
  constructor(side: Side, position: Position) {
    this.side = side;
    this.position = position;
  }

  /**
   * Get the side
   * @returns {Side} of an Object
   */
  public getSide(): Side {
    return this.side;
  }

  /**
   * Get the position
   * @returns {Position} of the side
   */
  public getPosition(): Position {
    return this.position;
  }

  /**
   * Set the position
   * @param position {Position} of the side
   */
  public setPosition(position: Position): void {
    this.getPosition().setY(position.getY());
    this.getPosition().setX(position.getX());
  }


}

/**
 * Enum for the side of an Object
 * TOP = top side
 * RIGHT = right side
 * BOTTOM = bottom side
 * LEFT = left side
 */
export enum Side {
  TOP = 'TOP',
  RIGHT = 'RIGHT',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT'
}
