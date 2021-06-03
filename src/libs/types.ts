export type Document<Data> = Data & {
  id: string;
  exists: boolean;
};
