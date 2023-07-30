import Button from '@/components/elements/button';
import MyPopover from '@/components/elements/popover';
import { GetCommentsReturn } from '@/data/comment/use-comments';
import { useRemoveLinkComment } from '@/data/comment/use-remove-comment';
import { useProfile } from '@/store/profile.store';
import { arrayToSingle } from '@/utils/array-to-single';
import { Popover } from '@headlessui/react';
import { PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import UpdateCommentForm from './update-comment-form';

interface CommentItemProps {
  comment: GetCommentsReturn['data'][0];
  linkId: number;
  isPreview?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, linkId, isPreview = false }) => {
  const profile = useProfile()[0];
  const [updateComment, setUpdateComment] = useState(false);

  const removeComment = useRemoveLinkComment(linkId);

  const canRemoveComment = useMemo(
    () => profile && (profile.role === 'admin' || profile.id === comment.userId),
    [profile, comment.userId]
  );

  const canUpdateComment = useMemo(() => profile && profile.id === comment.userId, [profile, comment.userId]);

  const commentUser = arrayToSingle(comment.user);

  return (
    <li className="group rounded-button border border-gray-400/30 p-5">
      <div className="mb-3 flex min-h-[18px] items-start justify-between space-x-3">
        <div className="flex text-[10px]">
          {commentUser && <h3 className="font-bold">{commentUser.username}</h3>}

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
              {updateComment ? <XMarkIcon className="w-[18px]" /> : <PencilSquareIcon className="w-[18px]" />}
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
