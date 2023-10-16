type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T];

export function objectEntries<T extends { [key: string]: unknown }>(t: T): Entries<T>[] {
  return Object.entries(t) as Entries<T>[];
}
