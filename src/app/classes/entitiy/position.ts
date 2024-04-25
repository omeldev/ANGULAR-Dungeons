export class Position {

  /**
   * Create a new position
   * @param x position on the x-axis
   * @param y position on the y-axis
   */
  constructor(
    private x: number,
    private y: number
  ) {
  }

  /**
   * Set the x position
   * @param x position on the x-axis
   */
  public setX(x: number): void {
    this.x = x;
  }

  /**
   * Set the y position
   * @param y position on the y-axis
   */
  public setY(y: number): void {
    this.y = y;
  }

  /**
   * Get the x position
   * @returns {number} of the x-axis
   */
  public getX(): number {
    return this.x;
  }

  /**
   * Get the y position
   * @returns {number} of the y-axis
   */
  public getY(): number {
    return this.y;
  }

  /**
   * Calculate the distance between two positions
   * Formula: d=√((x2 – x1)² + (y2 – y1)²)
   * @param position
   */
  public distanceTo(position: Position): number {
    return Math.sqrt((position.getX() - this.getX()) ** 2 + (position.getY() - this.getY()) ** 2);
  }


}
