export type validArrayValue = any[] | null | undefined;

export function shallowEqualArrays(
  arrA: validArrayValue,
  arrB: validArrayValue,
): boolean {
  if (arrA === arrB) {
    return true;
  }

  if (!arrA || !arrB) {
    return false;
  }

  const len = arrA.length;

  if (arrB.length !== len) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }

  return true;
}

export type validObjectValue = Record<string, any> | null | undefined;

export function shallowEqualObjects(
  objA: validObjectValue,
  objB: validObjectValue,
): boolean {
  if (objA === objB) {
    return true;
  }

  if (!objA || !objB) {
    return false;
  }

  const aKeys = Object.keys(objA);
  const bKeys = Object.keys(objB);
  const len = aKeys.length;

  if (bKeys.length !== len) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    const key = aKeys[i];

    if (
      objA[key] !== objB[key] ||
      !Object.prototype.hasOwnProperty.call(objB, key)
    ) {
      return false;
    }
  }

  return true;
}

type Comparable = Record<string, any> | any[] | null | undefined;

export function shallowEqual(a: Comparable, b: Comparable): boolean {
  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);

  if (aIsArr !== bIsArr) {
    return false;
  }

  if (aIsArr && bIsArr) {
    return shallowEqualArrays(a, b);
  }

  return shallowEqualObjects(a, b);
}
