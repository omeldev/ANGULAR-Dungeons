export class Velocity {

  /**
   * Create a new Velocity
   * @param x {number} x velocity
   * @param y {number} y velocity
   */
  constructor(private x: number, private y: number) {
  }

  /**
   * Set the x velocity
   * @param x {number} x velocity
   */
  public setX(x: number): void {
    this.x = x;
  }

  /**
   * Set the y velocity
   * @param y {number} y velocity
   */
  public setY(y: number): void {
    this.y = y;
  }

  /**
   * Get the x velocity
   * @returns {number} x velocity
   */
  public getX(): number {
    return this.x;
  }

  /**
   * Get the y velocity
   * @returns {number} y velocity
   */
  public getY(): number {
    return this.y;
  }

  /**
   * Check if the x velocity is negative
   * @returns {boolean} true if the x velocity is negative
   */
  public isNegativeX(): boolean {
    return this.x < 0;
  }

  /**
   * Check if the y velocity is negative
   * @returns {boolean} true if the y velocity is negative
   */
  public isNegativeY(): boolean {
    return this.y < 0;
  }
}
