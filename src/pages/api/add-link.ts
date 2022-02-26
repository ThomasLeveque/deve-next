import { getUser } from '@api/auth/db';
import { dbKeys as categoryDbKey } from '@api/category/db-keys';
import { dbKeys as linkDbKey } from '@api/link/db-keys';
import { Category } from '@data-types/categorie.type';
import { dataToDocument } from '@utils/format-document';
import { formatLink } from '@utils/format-link';
import { isValidUrl } from '@utils/format-string';
import { auth, db } from '@utils/init-firebase';
import { Document } from '@utils/shared-types';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore/lite';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

interface addLinkHandlerReqBody {
  email: string;
  password: string;
  url: string;
  title: string;
  tags: string[];
}

const addLinkHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check for POST method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Only the method POST is allowed`);
  }

  try {
    const { email, password, url, title, tags } = JSON.parse(req.body) as addLinkHandlerReqBody;

    // Handle fields errors
    if (!email) {
      throw new Error('Email field is required');
    }

    if (!password) {
      throw new Error('Password field is required');
    }

    if (!url) {
      throw new Error('Url field is required');
    }

    if (!isValidUrl(url)) {
      throw new Error('Url must be a valid url');
    }

    if (!title) {
      throw new Error('Title field is required');
    }

    if (!tags || tags.length === 0) {
      throw new Error('At least 1 tag is required');
    }

    if (tags.length > 4) {
      throw new Error('No more than 4 tags allowed');
    }

    // Authenticate the user
    const { user: authUser } = await signInWithEmailAndPassword(auth, email, password);
    if (!authUser) {
      throw new Error('User not found');
    }

    // Get the authenticated user from the db
    const user = await getUser(authUser.uid);

    // Get all categories that match the given tags
    const promiseCategories = tags.map(async (tag) => {
      const q = query(collection(db, categoryDbKey.categories), where('name', '==', tag));
      const snapshot = await getDocs(q);
      const category = snapshot.docs[0];
      if (category === undefined) {
        throw new Error(`The tag ${tag} does not exist`);
      }

      return dataToDocument<Category>(category);
    });
    const categories: Document<Category>[] = await Promise.all(promiseCategories);

    const batch = writeBatch(db);

    // Update every used category count
    categories.forEach((category) => {
      if (category.id === undefined) {
        throw new Error('One of the tags cannot be found');
      }
      const categoryRef = doc(db, categoryDbKey.category(category.id));
      const categoryToUpdate: Partial<Category> = { count: category.count + 1 };
      batch.update(categoryRef, categoryToUpdate);
    });

    // Add the new link
    const link = formatLink({ url, title, tags }, user);
    const linkRef = doc(collection(db, linkDbKey.links));
    batch.set(linkRef, link);

    await batch.commit();

    return res.status(201).json({ message: 'link has been created', data: link });
  } catch (err) {
    const error = err as Error;
    return res.status(400).json({ message: error.message ?? `${error}` });
  }
};

export default addLinkHandler;
