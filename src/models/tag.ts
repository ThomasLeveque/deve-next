import { Nullable } from '@utils/shared-types';
import { Link } from './link';

export interface Tag {
  id: number;
  name: string;
  slug: Nullable<string>;
  links?: Link[];
  createdAt: string;
  updatedAt: string;
}
