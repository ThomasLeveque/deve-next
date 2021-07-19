import { format } from 'date-fns';
import React from 'react';

import Separator from '@components/elements/separator';

import { Comment } from '@data-types/comment.type';

import { Document } from '@utils/shared-types';

interface CommentItemProps {
  comment: Document<Comment>;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <li className="first:mt-8">
      <Separator className="my-5" />
      <div className="mb-2 flex items-top justify-between">
        <h3 className="text-[11px] font-poppins-bold">Posted by {comment.postedBy.displayName}</h3>
        <p className="text-[10px] text-gray-400">{format(comment.createdAt, 'MMMM d yyyy')}</p>
      </div>
      <h4 className="text-sm">{comment.text}</h4>
    </li>
  );
};

export default CommentItem;
