'use client';

import { LinkForm } from '@/components/modals/LinkModals/LinkForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FetchProfileReturn } from '@/lib/supabase/queries/fetch-profile';
import { PlusIcon } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';

function AddLinkModal({ children, profile }: PropsWithChildren<{ profile: NonNullable<FetchProfileReturn> }>) {
  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new link</DialogTitle>
        </DialogHeader>
        <LinkForm closeModal={closeModal} profile={profile} />
      </DialogContent>
    </Dialog>
  );
}

function AddLinkModalTrigger() {
  return (
    <>
      <DialogTrigger asChild className="sm:hidden">
        <Button size="icon">
          <PlusIcon size={18} />
        </Button>
      </DialogTrigger>
      <DialogTrigger asChild className="hidden space-x-2 sm:inline-flex">
        <Button>
          <span>Add link</span>
          <PlusIcon size={18} />
        </Button>
      </DialogTrigger>
    </>
  );
}

export { AddLinkModal, AddLinkModalTrigger };
