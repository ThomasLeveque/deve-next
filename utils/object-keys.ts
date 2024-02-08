export function objectKeys<Obj extends { [key: string]: unknown }>(obj: Obj): (keyof Obj)[] {
  return Object.keys(obj) as (keyof Obj)[];
}
