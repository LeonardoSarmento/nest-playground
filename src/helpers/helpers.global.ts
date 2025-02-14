export class Helpers {
  static isMatching<T>(objA: T, objB: Partial<T>): boolean {
    const keys = Object.keys(objB) as (keyof T)[];

    if (keys.length === 0) return false;

    return keys.every((key) => {
      const valueA = objA[key];
      const valueB = objB[key];

      return typeof valueA === 'number' ? valueA == valueB : valueA === valueB;
    });
  }
}
