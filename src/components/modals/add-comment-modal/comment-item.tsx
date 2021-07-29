import { TrashIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

import { useAuth } from '@hooks/auth/useAuth';
import { useLinksQueryKey } from '@hooks/link/use-links-query-key';
import { useRemoveLinkComment } from '@hooks/link/use-remove-link-comment';

import { Comment } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';

import { Document } from '@utils/shared-types';

interface CommentItemProps {
  comment: Document<Comment>;
  link: Document<Link>;
  isPreview?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, link, isPreview = false }) => {
  const { user } = useAuth();
  const linksQueryKey = useLinksQueryKey(user?.id as string);

  const removeComment = useRemoveLinkComment(link, linksQueryKey);

  const canRemoveComment = useMemo(
    () => user && (user.isAdmin || user.id === comment.postedBy.id),
    [user]
  );

  return (
    <li className="group p-5 border border-gray-400/30 rounded-button">
      <div className="mb-2 flex justify-between items-start space-x-3 min-h-[18px]">
        <div className="flex text-[10px]">
          <h3 className="font-poppins-bold">{comment.postedBy.displayName}</h3>

          <p className="text-gray-400">
            <span className="mx-2">-</span>
            {format(comment.createdAt, 'MMMM d yyyy')}
          </p>
        </div>
        {canRemoveComment && !isPreview && (
          <button
            className="hover:text-secondary group-hover:block hidden"
            onClick={() => removeComment.mutate(comment)}
          >
            <TrashIcon className="w-[18px]" />
          </button>
        )}
      </div>

      <ReactMarkdown linkTarget="_blank" className="prose prose-sm">
        {comment.text}
      </ReactMarkdown>
    </li>
  );
};

export default CommentItem;
