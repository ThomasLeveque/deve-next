import { Tag } from '@models/tag';
import { stringToSlug } from './format-string';
import { supabase } from './init-supabase';

// const migrationExemple = async () => {
//   try {
//     const MIGRATIONS_ID = '';
//     const migrationAlreadyExists = await getMigration(MIGRATIONS_ID);
//
//     if (!migrationAlreadyExists) {
//       return;
//     }
//
//     console.log('RUN XXXX MIGRATIONS');
//
//     // MIGRATION CODE HERE
//     return createMigration(MIGRATIONS_ID);
//   } catch (err) {
//     console.error('xxxxMigrations ERROR:', err);
//   }
// };

type Migration = {
  id: string;
};

const getMigration = async (id: string) => {
  const resp = await supabase.from<Migration>('migrations').select('*').eq('id', id).single();

  if (resp.error) {
    throw new Error(resp.error.message);
  }

  return resp.data;
};

const createMigration = async (id: string) => {
  console.log(`Migration ${id} created`);
  return supabase.from<Migration>('migrations').insert({ id: id });
};

const tagSlugMigration = async () => {
  try {
    const MIGRATIONS_ID = 'tag-slug-migration';
    const migrationAlreadyExists = await getMigration(MIGRATIONS_ID);

    if (migrationAlreadyExists) {
      return;
    }
    console.log('RUN TAG SLUG MIGRATIONS');

    const response = await supabase.from<Tag>('tags').select('*');
    const tags = response.data;

    if (tags) {
      for (const tag of tags) {
        const slug = stringToSlug(tag.name);

        await supabase.from('tags').update({ slug }).eq('id', tag.id);
      }

      return createMigration(MIGRATIONS_ID);
    }
  } catch (err) {
    console.error('tagSlugMigrations ERROR:', err);
  }
};

export const runMigrations = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    await tagSlugMigration();
  }
};
