import { Popover } from '@headlessui/react';
import { PencilAltIcon, TrashIcon, XIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import Button from '@components/elements/button';
import MyPopover from '@components/elements/popover';

import { useAuth } from '@api/auth/useAuth';

import { useLinksQueryKey } from '@hooks/link/use-links-query-key';
import { useRemoveLinkComment } from '@hooks/link/use-remove-link-comment';

import { Comment } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';

import { Document } from '@utils/shared-types';

import UpdateCommentForm from './update-comment-form';

interface CommentItemProps {
  comment: Document<Comment>;
  link: Document<Link>;
  isPreview?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, link, isPreview = false }) => {
  const { user } = useAuth();
  const linksQueryKey = useLinksQueryKey(user?.id as string);
  const [updateComment, setUpdateComment] = useState(false);

  const removeComment = useRemoveLinkComment(link, linksQueryKey);

  const canRemoveComment = useMemo(
    () => user && (user.isAdmin || user.id === comment.postedBy.id),
    [user]
  );

  const canUpdateComment = useMemo(() => user && user.id === comment.postedBy.id, [user]);

  return (
    <li className="group p-5 border border-gray-400/30 rounded-button">
      <div className="mb-3 flex justify-between items-start space-x-3 min-h-[18px]">
        <div className="flex text-[10px]">
          <h3 className="font-poppins-bold">{comment.postedBy.displayName}</h3>

          <p className="text-gray-400">
            <span className="mx-2">-</span>
            {format(comment.createdAt, 'MMMM d yyyy')}
          </p>
        </div>
        <div className="space-x-1 group-hover:flex flex lg:hidden">
          {canUpdateComment && !isPreview && (
            <button
              className="hover:text-secondary"
              onClick={() => setUpdateComment((prevUpdateComment) => !prevUpdateComment)}
            >
              {updateComment ? (
                <XIcon className="w-[18px]" />
              ) : (
                <PencilAltIcon className="w-[18px]" />
              )}
            </button>
          )}
          {canRemoveComment && !isPreview && (
            <MyPopover buttonItem={<TrashIcon className="w-[18px] hover:text-secondary" />}>
              <div className="flex space-x-4">
                <Popover.Button as={Button} text="Cancel" theme="gray" />
                <Button
                  theme="danger"
                  text="Remove"
                  type="button"
                  onClick={() => {
                    removeComment.mutate(comment);
                  }}
                />
              </div>
            </MyPopover>
          )}
        </div>
      </div>

      {updateComment ? (
        <UpdateCommentForm
          commentToUpdate={comment}
          link={link}
          closeUpdate={() => setUpdateComment(false)}
        />
      ) : (
        <ReactMarkdown linkTarget="_blank" className="prose prose-sm">
          {comment.text}
        </ReactMarkdown>
      )}
    </li>
  );
};

export default CommentItem;
