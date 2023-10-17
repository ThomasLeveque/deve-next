import { Button } from '@/components/ui/Button';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { GetCommentsReturn } from '@/data/comment/use-comments';
import { useRemoveLinkComment } from '@/data/comment/use-remove-comment';
import { arrayToSingle } from '@/lib/utils';
import { useProfile } from '@/store/profile.store';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon, XIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import UpdateCommentForm from './UpdateCommentForm';

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
    <li className="rounded-button group border border-gray-400/30 p-5">
      <div className="mb-3 flex min-h-[18px] items-start justify-between space-x-3">
        <div className="flex text-[10px]">
          {commentUser && <h3 className="font-bold">{commentUser.username}</h3>}

          <p className="text-gray-400">
            <span className="mx-2">-</span>
            {format(new Date(comment.createdAt), 'MMMM d yyyy')}
          </p>
        </div>
        <div className="flex space-x-2 group-hover:flex lg:hidden">
          {canUpdateComment && !isPreview && (
            <button onClick={() => setUpdateComment((prevUpdateComment) => !prevUpdateComment)}>
              {updateComment ? <XIcon size={16} /> : <PencilIcon size={16} />}
            </button>
          )}
          {canRemoveComment && !isPreview && (
            <Popover>
              <PopoverTrigger>
                <TrashIcon size={16} />
              </PopoverTrigger>
              <PopoverContent className="flex w-60 space-x-4 p-2">
                <PopoverClose asChild>
                  <Button className="w-full" variant="link">
                    Cancel
                  </Button>
                </PopoverClose>
                <Button className="w-full" variant="destructive" isLoading={removeComment.isLoading} type="button">
                  Remove
                </Button>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {updateComment ? (
        <UpdateCommentForm commentToUpdate={comment} linkId={linkId} closeUpdate={() => setUpdateComment(false)} />
      ) : (
        <ReactMarkdown linkTarget="_blank" className="prose-sm prose">
          {comment.text}
        </ReactMarkdown>
      )}
    </li>
  );
};

export default CommentItem;
