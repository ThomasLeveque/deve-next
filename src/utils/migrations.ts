import { getCategories } from '@hooks/category/use-categories';

import { TagInput } from '@models/tag';

import { supabase } from './init-supabase';

type Migration = {
  id: string;
};

const getMigration = async (id: string) => {
  const resp = await supabase.from<Migration>('migrations').select('*').eq('id', id).single();
  return resp.data;
};

const createMigration = async (id: string) => {
  return supabase.from<Migration>('migrations').insert({ id: id });
};

const tagsMigrations = async () => {
  const MIGRATIONS_ID = 'tags-migration';
  const migrationAlreadyExists = await getMigration(MIGRATIONS_ID);

  if (migrationAlreadyExists) {
    return;
  }

  const categories = await getCategories();

  if (categories && categories.length > 0) {
    await supabase
      .from<TagInput[]>('tags')
      .insert(categories.map((category) => ({ name: category.name })));

    return createMigration(MIGRATIONS_ID);
  }
};

const commentsMigrations = async () => {
  const MIGRATIONS_ID = 'comments-migration';
  const migrationAlreadyExists = await getMigration(MIGRATIONS_ID);

  if (migrationAlreadyExists) {
    return;
  }
  return createMigration(MIGRATIONS_ID);
};

const linksMigrations = async () => {
  const MIGRATIONS_ID = 'links-migration';
  const migrationAlreadyExists = await getMigration(MIGRATIONS_ID);

  if (migrationAlreadyExists) {
    return;
  }
  return createMigration(MIGRATIONS_ID);
};

const votesMigrations = async () => {
  const MIGRATIONS_ID = 'votes-migration';
  const migrationAlreadyExists = await getMigration(MIGRATIONS_ID);

  if (migrationAlreadyExists) {
    return;
  }
  return createMigration(MIGRATIONS_ID);
};

export const runMigrations = async (): Promise<void> => {
  console.log('RUN MIGRATIONS');

  await tagsMigrations();
};
