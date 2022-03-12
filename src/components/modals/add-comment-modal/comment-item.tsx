import { useRemoveLinkComment } from '@api/comment/use-remove-comment';
import Button from '@components/elements/button';
import MyPopover from '@components/elements/popover';
import { Popover } from '@headlessui/react';
import { PencilAltIcon, TrashIcon, XIcon } from '@heroicons/react/outline';
import { Comment } from '@models/comment';
import { useProfile } from '@store/profile.store';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import UpdateCommentForm from './update-comment-form';

interface CommentItemProps {
  comment: Comment;
  linkId: number;
  isPreview?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, linkId, isPreview = false }) => {
  const [profile] = useProfile();
  const [updateComment, setUpdateComment] = useState(false);

  const removeComment = useRemoveLinkComment(linkId);

  const canRemoveComment = useMemo(
    () => profile && (profile.role === 'admin' || profile.id === comment.userId),
    [profile, comment.userId]
  );

  const canUpdateComment = useMemo(() => profile && profile.id === comment.userId, [profile, comment.userId]);

  return (
    <li className="group rounded-button border border-gray-400/30 p-5">
      <div className="mb-3 flex min-h-[18px] items-start justify-between space-x-3">
        <div className="flex text-[10px]">
          {comment.user && <h3 className="font-poppins-bold">{comment.user.username}</h3>}

          <p className="text-gray-400">
            <span className="mx-2">-</span>
            {format(new Date(comment.createdAt), 'MMMM d yyyy')}
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
                  loading={removeComment.isLoading}
                  type="button"
                  onClick={() => {
                    removeComment.mutate(comment.id);
                  }}
                />
              </div>
            </MyPopover>
          )}
        </div>
      </div>

      {updateComment ? (
        <UpdateCommentForm commentToUpdate={comment} linkId={linkId} closeUpdate={() => setUpdateComment(false)} />
      ) : (
        <ReactMarkdown linkTarget="_blank" className="prose prose-sm">
          {comment.text}
        </ReactMarkdown>
      )}
    </li>
  );
};

export default CommentItem;
