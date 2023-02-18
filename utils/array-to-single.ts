export function arrayToSingle<T>(value: T | T[] | null | undefined) {
  if (!Array.isArray(value)) {
    return value;
  }
  return null;
}
