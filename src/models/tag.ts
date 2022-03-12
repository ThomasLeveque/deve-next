import { Link } from './link';

export interface Tag {
  id: number;
  name: string;
  links?: Link[];
  createdAt: string;
  updatedAt: string;
}
