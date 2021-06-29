import { AnnotationIcon, FireIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';
import React from 'react';

import { Document } from '@libs/types';

import { Link } from '@data-types/link.type';

import { getDomain } from '@utils/format-string';

import Tag from './elements/tag';

interface LinkItemProps {
  link: Document<Link>;
}

const LinkItem: React.FC<LinkItemProps> = ({ link }) => {
  return (
    <li className="p-[30px] rounded-link-card bg-gray-100">
      <div className="mb-5">
        <h3 className="font-poppins-bold text-[13px] mb-1">
          Posted by {link.postedBy.displayName}
        </h3>
        <p className="text-[10px]">{format(link.createdAt, 'MMMM d yyyy')}</p>
      </div>
      <a href={link.url} rel="noreferrer" target="_blank" className="mb-5 with-ring block group">
        <h2 className="text-3xl mb-2 font-poppins-bold group-hover:text-secondary">
          {link.description}
        </h2>
        <p className="text-xs group-hover:underline">On {getDomain(link.url)}</p>
      </a>
      <ul className="mb-5 flex flex-wrap gap-[10px] gap-y-3">
        {link.categories.map((tag) => (
          <Tag key={`${link.id}-${tag}`} text={tag} isColored />
        ))}
      </ul>
      <div className="flex">
        <div className="flex items-center mr-5">
          <FireIcon className="mr-[6px] w-6" />
          <span className="font-poppins-bold text-[11px]">This is fire !</span>
        </div>
        <div className="flex items-center">
          <AnnotationIcon className="mr-[6px] w-6" />
          <span className="font-poppins-bold text-[11px]">Add comment</span>
        </div>
      </div>
    </li>
  );
};

export default LinkItem;
