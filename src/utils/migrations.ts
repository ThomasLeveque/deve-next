import { Link as FirebaseLink } from '@data-types/link.type';
import { Comment } from '@models/comment';
import { Link } from '@models/link';
import { Tag } from '@models/tag';
import { Vote } from '@models/vote';
import { collection, DocumentSnapshot, getDocs, orderBy, query, QueryDocumentSnapshot } from 'firebase/firestore/lite';
import { Category } from './../data-types/categorie.type';
import { Comment as FirebaseComment } from './../data-types/comment.type';
import { db } from './init-firebase';
import { supabase } from './init-supabase';
import { Document } from './shared-types';

// FIREBASE UTILS //

export const dataToDocument = <Data>(doc: QueryDocumentSnapshot | DocumentSnapshot): Document<Data> => ({
  id: doc.id,
  exists: doc.exists(),
  ...(doc.data() as Data),
});

export const getCategories = async () => {
  const categoriesRef = collection(db, 'categories');
  const q = query(categoriesRef, orderBy('count', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => dataToDocument<Category>(doc));
};

export const getFirebaseLinkComments = async (linkId: string) => {
  const commentsRef = collection(db, `links/${linkId}/comments`);
  const q = query(commentsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => dataToDocument<FirebaseComment>(doc));
};

export const getFirebaseLinks = async () => {
  const LinksRef = collection(db, 'links');
  const q = query(LinksRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => dataToDocument<FirebaseLink>(doc));
};

// SUPABASE UTILS //

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
      await supabase.from<Tag>('tags').insert(categories.map((category) => ({ name: category.name })));

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
            const foundCategory = tags.find((tag) => tag.name.toLowerCase() === category.toLowerCase());

            if (foundCategory) {
              return true;
            } else {
              console.log(`Category ${category} not found`);
            }
          })
          .map((category) => {
            const usedSupabaseTag = tags.find((tag) => tag.name.toLowerCase() === category.toLowerCase());
            return usedSupabaseTag as Tag;
          });

        const resp = await supabase
          .from<Link>('links')
          .insert({
            url: firebaseLink.url,
            description: firebaseLink.description,
            userId: userId,
            votesCount: firebaseLink.voteCount,
            commentsCount: firebaseLink.commentCount,
            createdAt: new Date(firebaseLink.createdAt),
            updatedAt: new Date(firebaseLink.updatedAt),
          })
          .single();

        if (resp.data) {
          const newLink = resp.data as Link;

          // links tags many to many relation
          await supabase
            .from<{ linkId: number; tagId: number }>('links_tags')
            .insert(linkSupabaseTags.map((supabaseTag) => ({ linkId: newLink.id, tagId: supabaseTag.id })));

          // link comments one to many relation
          if (firebaseLink.id) {
            const firebaseLinkComments = await getFirebaseLinkComments(firebaseLink.id);

            if (firebaseLinkComments) {
              const supabaseLinkComments: Partial<Comment>[] = firebaseLinkComments.map((firebaseLinkComment) => ({
                userId: userId,
                linkId: newLink.id,
                text: firebaseLinkComment.text,
                createdAt: new Date(firebaseLinkComment.createdAt),
                updatedAt: new Date(firebaseLinkComment.updatedAt),
              }));

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
  if (process.env.NODE_ENV === 'development') {
    await tagsMigrations();
    await linksMigrations(userId);
  }
};
