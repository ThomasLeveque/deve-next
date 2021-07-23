import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

import { getUser } from '@hooks/auth/db';
import { dbKeys as categoryDbKey } from '@hooks/category/db-keys';
import { dbKeys as linkDbKey } from '@hooks/link/db-keys';

import { dataToDocument } from '@utils/format-document';
import { formatLink } from '@utils/format-link';
import { isValidUrl } from '@utils/format-string';
import { auth, db } from '@utils/init-firebase';
import { Document } from '@utils/shared-types';

import { Category } from './../../data-types/categorie.type';

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
    const { email, password, url, title, tags } = req.body as addLinkHandlerReqBody;

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
    const { user: authUser } = await auth.signInWithEmailAndPassword(email, password);
    if (!authUser) {
      throw new Error('User not found');
    }

    // Get the authenticated user from the db
    const user = await getUser(authUser.uid);

    // Get all categories that match the given tags
    const promiseCategories = tags.map(async (tag) => {
      const snapshot = await db.collection(categoryDbKey.categories).where('name', '==', tag).get();
      const category = snapshot.docs[0];
      if (category === undefined) {
        throw new Error(`The tag ${tag} does not exist`);
      }

      return dataToDocument<Category>(snapshot.docs[0]);
    });
    const categories: Document<Category>[] = await Promise.all(promiseCategories);

    const batch = db.batch();

    // Update every used category count
    categories.forEach((category) => {
      if (category.id === undefined) {
        throw new Error(`The tag ${category.name} does not exist`);
      }
      const categoryRef = db.doc(categoryDbKey.category(category.id));
      const categoryToUpdate: Partial<Category> = { count: category.count + 1 };
      batch.update(categoryRef, categoryToUpdate);
    });

    // Add the new link
    const link = formatLink({ url, title, tags }, user);
    const linkRef = db.collection(linkDbKey.links).doc();
    batch.set(linkRef, link);

    await batch.commit();

    return res.status(201).json({ message: 'link has been created', data: link });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export default addLinkHandler;
