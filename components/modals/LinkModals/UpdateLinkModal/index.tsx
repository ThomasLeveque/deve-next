import { LinkForm } from '@/components/modals/LinkModals/LinkForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GetLinksReturn } from '@/data/link/get-links';
import { FetchProfileReturn } from '@/lib/supabase/queries/fetch-profile';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

type UpdateLinkModalProps = {
  linkToUpdate: GetLinksReturn['data'][0];
  profile: NonNullable<FetchProfileReturn>;
};

function UpdateLinkModal({ linkToUpdate, profile }: UpdateLinkModalProps) {
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
        <LinkForm profile={profile} closeModal={closeModal} linkToUpdate={linkToUpdate} />
      </DialogContent>
    </Dialog>
  );
}

export default UpdateLinkModal;
