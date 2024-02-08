export function objectValues<Obj extends { [key: string]: unknown }>(obj: Obj): Obj[keyof Obj][] {
  return Object.values(obj) as Obj[keyof Obj][];
}
