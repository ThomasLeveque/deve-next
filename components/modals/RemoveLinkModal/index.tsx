import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { destructiveToast } from '@/components/ui/use-toast';
import { removeLinkAction } from '@/lib/actions/remove-link.action';
import { useAction } from '@/lib/actions/use-action';
import { formatError } from '@/utils/format-string';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';

type RemoveLinkModalProps = {
  linkIdToRemove: number;
};

function RemoveLinkModal({ linkIdToRemove }: RemoveLinkModalProps) {
  const [open, setOpen] = useState(false);

  const [removeLinkLoading, triggerRemoveLinkAction] = useAction(removeLinkAction, {
    onSuccess() {
      setOpen(false);
    },
    onError(error) {
      destructiveToast({ description: formatError(error) });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <TrashIcon size={16} />
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure ?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            className="w-full"
            type="button"
            isLoading={removeLinkLoading}
            onClick={() => triggerRemoveLinkAction(linkIdToRemove)}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RemoveLinkModal;
