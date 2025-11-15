export abstract class ValueObject<T> {
  protected abstract getEqualityComponents(): any[];

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (!(vo instanceof ValueObject)) {
      return false;
    }

    const thisComponents = this.getEqualityComponents();
    const otherComponents = vo.getEqualityComponents();

    if (thisComponents.length !== otherComponents.length) {
      return false;
    }

    return thisComponents.every((component, index) => {
      return this.deepEquals(component, otherComponents[index]);
    });
  }

  private deepEquals(a: any, b: any): boolean {
    if (a === b) {
      return true;
    }

    if (a === null || a === undefined || b === null || b === undefined) {
      return a === b;
    }

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }

    if (typeof a !== 'object' || typeof b !== 'object') {
      return a === b;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every(key => this.deepEquals(a[key], b[key]));
  }
}
