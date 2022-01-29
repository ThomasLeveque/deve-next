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
  return createMigration(MIGRATIONS_ID);
};

export const runMigrations = async (): Promise<void> => {
  await tagsMigrations();
};
