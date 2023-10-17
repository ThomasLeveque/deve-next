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
import { useRemoveLink } from '@/data/link/use-remove-link';
import { formatError } from '@/utils/format-string';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

type RemoveLinkModalProps = {
  linkIdToRemove: number;
};

function RemoveLinkModal({ linkIdToRemove }: RemoveLinkModalProps) {
  const removeLink = useRemoveLink();
  const [open, setOpen] = useState(false);

  async function handleRemoveLink() {
    try {
      await removeLink.mutateAsync(linkIdToRemove);
      setOpen(false);
    } catch (err) {
      toast.error(formatError(err as Error));
    }
  }

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
            isLoading={removeLink.isPending}
            onClick={handleRemoveLink}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RemoveLinkModal;
