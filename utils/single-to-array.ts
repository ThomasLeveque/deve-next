export function singleToArray<T>(value: T | T[] | null | undefined) {
  if (Array.isArray(value)) {
    return value;
  }
  return [];
}
