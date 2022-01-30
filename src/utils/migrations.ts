import { getCategories } from '@hooks/category/use-categories';
import { getFirebaseLinks } from '@hooks/link/use-links';

import { Link } from '@models/link';
import { Tag } from '@models/tag';

import { supabase } from './init-supabase';

// UTILS //

const getSupabaseTags = async () => {
  const resp = await supabase.from<Tag>('tags').select('*');
  return resp.data;
};

// UTILS END //

type Migration = {
  id: string;
};

const getMigration = async (id: string) => {
  const resp = await supabase.from<Migration>('migrations').select('*').eq('id', id).single();
  return resp.data;
};

const createMigration = async (id: string) => {
  console.log(`Migration ${id} created`);
  return supabase.from<Migration>('migrations').insert({ id: id });
};

const tagsMigrations = async () => {
  try {
    const MIGRATIONS_ID = 'tags-migration';
    const migrationAlreadyExists = await getMigration(MIGRATIONS_ID);

    if (migrationAlreadyExists) {
      return;
    }

    console.log('RUN TAGS MIGRATIONS');

    const categories = await getCategories();

    if (categories && categories.length > 0) {
      await supabase
        .from<Tag>('tags')
        .insert(categories.map((category) => ({ name: category.name })));

      return createMigration(MIGRATIONS_ID);
    }
  } catch (err) {
    console.error('tagsMigrations ERROR:', err);
  }
};

const linksMigrations = async () => {
  try {
    const MIGRATIONS_ID = 'links-migration';
    const migrationAlreadyExists = await getMigration(MIGRATIONS_ID);

    if (migrationAlreadyExists) {
      return;
    }

    console.log('RUN LINKS MIGRATIONS');

    const tags = await getSupabaseTags();
    const links = await getFirebaseLinks();

    if (links && tags) {
      const linksPromise = links.map(async (link) => {
        const linkSupabaseTags = link.categories
          .filter((category) => {
            const foundCategory = tags.find(
              (tag) => tag.name.toLowerCase() === category.toLowerCase()
            );

            if (foundCategory) {
              return true;
            } else {
              console.log(`Category ${category} not found`);
            }
          })
          .map((category) => {
            const usedSupabaseTag = tags.find(
              (tag) => tag.name.toLowerCase() === category.toLowerCase()
            );
            return usedSupabaseTag as Tag;
          });

        const resp = await supabase
          .from<Link>('links')
          .insert({
            url: link.url,
            description: link.description,
            userId: '735c71f0-2bcc-478f-94f5-5b55363b23ec',
          })
          .single();

        if (resp.data) {
          const newLink = resp.data as Link;
          return supabase
            .from<{ linkId: number; tagId: number }>('links_tags')
            .insert(
              linkSupabaseTags.map((supabaseTag) => ({ linkId: newLink.id, tagId: supabaseTag.id }))
            );
        }
      });

      await Promise.all(linksPromise);
      await createMigration(MIGRATIONS_ID);
    }
  } catch (err) {
    console.error('linksMigrations ERROR:', err);
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

const votesMigrations = async () => {
  const MIGRATIONS_ID = 'votes-migration';
  const migrationAlreadyExists = await getMigration(MIGRATIONS_ID);

  if (migrationAlreadyExists) {
    return;
  }
  return createMigration(MIGRATIONS_ID);
};

export const runMigrations = async (): Promise<void> => {
  await tagsMigrations();
  await linksMigrations();
};
