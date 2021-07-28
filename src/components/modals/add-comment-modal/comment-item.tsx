import { TrashIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';
import React, { useMemo } from 'react';

import Separator from '@components/elements/separator';

import { useAuth } from '@hooks/auth/useAuth';
import { useLinksQueryKey } from '@hooks/link/use-links-query-key';
import { useRemoveLinkComment } from '@hooks/link/use-remove-link-comment';

import { Comment } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';

import { Document } from '@utils/shared-types';

interface CommentItemProps {
  comment: Document<Comment>;
  link: Document<Link>;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, link }) => {
  const { user } = useAuth();
  const linksQueryKey = useLinksQueryKey(user?.id as string);

  const removeComment = useRemoveLinkComment(link, linksQueryKey);

  const canRemoveComment = useMemo(
    () => user && (user.isAdmin || user.id === comment.postedBy.id),
    [user]
  );

  return (
    <li className="first:mt-8 group">
      <Separator className="my-5" />
      <div className="mb-2 flex justify-between items-start space-x-3 min-h-[18px]">
        <div className="flex text-[10px]">
          <h3 className="font-poppins-bold">{comment.postedBy.displayName}</h3>

          <p className="text-gray-400">
            <span className="mx-2">-</span>
            {format(comment.createdAt, 'MMMM d yyyy')}
          </p>
        </div>
        {canRemoveComment && (
          <button
            className="hover:text-secondary group-hover:block hidden"
            onClick={() => removeComment.mutate(comment)}
          >
            <TrashIcon className="w-[18px]" />
          </button>
        )}
      </div>
      <h4 className="text-sm">{comment.text}</h4>
    </li>
  );
};

export default CommentItem;
