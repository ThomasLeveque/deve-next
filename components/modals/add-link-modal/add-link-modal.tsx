'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import AddLinkForm from './add-link-form';

function AddLinkModal() {
  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new link</DialogTitle>
        </DialogHeader>
        <AddLinkForm closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}

export default AddLinkModal;
