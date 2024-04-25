export class Scale {


  /**
   * Create a new scale
   * @param scale {number} size of the Scaling 1.0 = 100%
   */
  constructor(private scale: number) {
  }

  /**
   * Set the scale
   * @param scale {number} size of the Scaling e.g. 1.0 = 100%
   */
  public setScale(scale: number): void {
    this.scale = scale;
  }

  /**
   * Get the scale
   * @returns {number} size of the Scaling as double
   */

  public getScale(): number {
    return this.scale;
  }
}
