import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GetLinksReturn } from '@/data/link/get-links';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import UpdateLinkForm from './UpdateLinkForm';

type UpdateLinkModalProps = {
  linkToUpdate: GetLinksReturn['data'][0];
};

function UpdateLinkModal({ linkToUpdate }: UpdateLinkModalProps) {
  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Pencil size={16} />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Update ${linkToUpdate.description}`}</DialogTitle>
        </DialogHeader>
        <UpdateLinkForm closeModal={closeModal} linkToUpdate={linkToUpdate} />
      </DialogContent>
    </Dialog>
  );
}

export default UpdateLinkModal;
