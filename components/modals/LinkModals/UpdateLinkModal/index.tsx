import { LinkForm } from '@/components/modals/LinkModals/LinkForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FetchLinksReturn } from '@/lib/supabase/queries/fetch-links';
import { FetchProfileReturn } from '@/lib/supabase/queries/fetch-profile';
import { FetchTagsReturn } from '@/lib/supabase/queries/fetch-tags';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

type UpdateLinkModalProps = {
  linkToUpdate: FetchLinksReturn[0];
  profile: NonNullable<FetchProfileReturn>;
  tags: FetchTagsReturn;
};

function UpdateLinkModal({ linkToUpdate, profile, tags }: UpdateLinkModalProps) {
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
        <LinkForm profile={profile} closeModal={closeModal} linkToUpdate={linkToUpdate} tags={tags} />
      </DialogContent>
    </Dialog>
  );
}

export default UpdateLinkModal;
