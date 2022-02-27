import { useAuth } from '@api/auth/useAuth';
import { useLinksQueryKey } from '@api/old-link/use-links-query-key';
import { useRemoveLinkComment } from '@api/old-link/use-remove-link-comment';
import Button from '@components/elements/button';
import MyPopover from '@components/elements/popover';
import { Comment } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';
import { Popover } from '@headlessui/react';
import { PencilAltIcon, TrashIcon, XIcon } from '@heroicons/react/outline';
import { Document } from '@utils/shared-types';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
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
    [user, comment.postedBy.id]
  );

  const canUpdateComment = useMemo(() => user && user.id === comment.postedBy.id, [user, comment.postedBy.id]);

  return (
    <li className="group rounded-button border border-gray-400/30 p-5">
      <div className="mb-3 flex min-h-[18px] items-start justify-between space-x-3">
        <div className="flex text-[10px]">
          <h3 className="font-poppins-bold">{comment.postedBy.displayName}</h3>

          <p className="text-gray-400">
            <span className="mx-2">-</span>
            {format(comment.createdAt, 'MMMM d yyyy')}
          </p>
        </div>
        <div className="flex space-x-1 group-hover:flex lg:hidden">
          {canUpdateComment && !isPreview && (
            <button
              className="hover:text-secondary"
              onClick={() => setUpdateComment((prevUpdateComment) => !prevUpdateComment)}
            >
              {updateComment ? <XIcon className="w-[18px]" /> : <PencilAltIcon className="w-[18px]" />}
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
        <UpdateCommentForm commentToUpdate={comment} link={link} closeUpdate={() => setUpdateComment(false)} />
      ) : (
        <ReactMarkdown linkTarget="_blank" className="prose prose-sm">
          {comment.text}
        </ReactMarkdown>
      )}
    </li>
  );
};

export default CommentItem;
