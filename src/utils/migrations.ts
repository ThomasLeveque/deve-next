import { getCategories } from '@hooks/category/use-categories';
import { getFirebaseLinkComments } from '@hooks/link/use-link-comments';
import { getFirebaseLinks } from '@hooks/link/use-links';

import { Comment } from '@models/comment';
import { Link } from '@models/link';
import { Tag } from '@models/tag';
import { Vote } from '@models/vote';

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

const linksMigrations = async (userId: string) => {
  try {
    const MIGRATIONS_ID = 'links-migration';
    const migrationAlreadyExists = await getMigration(MIGRATIONS_ID);

    if (migrationAlreadyExists) {
      return;
    }

    console.log('RUN LINKS MIGRATIONS');

    const tags = await getSupabaseTags();
    const firebaseLinks = await getFirebaseLinks();

    if (firebaseLinks && tags) {
      const linksPromise = firebaseLinks.map(async (firebaseLink) => {
        const linkSupabaseTags = firebaseLink.categories
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
            url: firebaseLink.url,
            description: firebaseLink.description,
            userId: userId,
          })
          .single();

        if (resp.data) {
          const newLink = resp.data as Link;

          // links tags many to many relation
          await supabase
            .from<{ linkId: number; tagId: number }>('links_tags')
            .insert(
              linkSupabaseTags.map((supabaseTag) => ({ linkId: newLink.id, tagId: supabaseTag.id }))
            );

          // link comments one to many relation
          if (firebaseLink.id) {
            const firebaseLinkComments = await getFirebaseLinkComments(firebaseLink.id);

            if (firebaseLinkComments) {
              const supabaseLinkComments: Partial<Comment>[] = firebaseLinkComments.map(
                (firebaseLinkComment) => ({
                  userId: userId,
                  linkId: newLink.id,
                  text: firebaseLinkComment.text,
                })
              );

              await supabase.from<Comment>('comments').insert(supabaseLinkComments);
            }
          }

          // link votes one to many relation
          if (firebaseLink.voteCount > 0) {
            await supabase.from<Vote>('votes').insert({
              linkId: newLink.id,
              userId: userId,
            });
          }
        }
      });

      await Promise.all(linksPromise);
      await createMigration(MIGRATIONS_ID);
    }
  } catch (err) {
    console.error('linksMigrations ERROR:', err);
  }
};

export const runMigrations = async (userId: string): Promise<void> => {
  await tagsMigrations();
  await linksMigrations(userId);
};
