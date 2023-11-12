'use client';

import { linkSchema } from '@/components/modals/LinkModals/schemas';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { destructiveToast } from '@/components/ui/use-toast';
import { FetchProfileReturn } from '@/lib/queries/fetch-profile';
import { formatError } from '@/utils/format-string';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { X } from 'lucide-react';

import { Combobox, parseComboboxValues, parseValue } from '@/components/Combobox';
import { TagListWrapper } from '@/components/TagListWrapper';
import { AddTagBtn } from '@/components/modals/LinkModals/AddTagBtn';
import { RemoveTagBtn } from '@/components/modals/LinkModals/RemoveTagBtn';
import { Badge } from '@/components/ui/badge';
import { addLinkAction } from '@/lib/actions/add-link.action';
import { updateLinkAction } from '@/lib/actions/update-link.action';
import { useAction } from '@/lib/actions/use-action';
import { FetchLinksReturn } from '@/lib/queries/fetch-links';
import { FetchTagsReturn } from '@/lib/queries/fetch-tags';
import { z } from 'zod';

type LinkFormData = z.infer<typeof linkSchema>;

interface AddLinkFormProps {
  closeModal: () => void;
  profile: NonNullable<FetchProfileReturn>;
  linkToUpdate?: FetchLinksReturn[0];
  tags: FetchTagsReturn;
}

export function LinkForm({ closeModal, profile, linkToUpdate, tags }: AddLinkFormProps) {
  const [addLinkLoading, triggerAddLinkAction] = useAction(addLinkAction, {
    onSuccess() {
      closeModal();
    },
    onError(error) {
      destructiveToast({ description: formatError(error) });
    },
  });

  const [updateLinkLoading, triggerUpdateLinkAction] = useAction(updateLinkAction, {
    onSuccess() {
      closeModal();
    },
    onError(error) {
      destructiveToast({ description: formatError(error) });
    },
  });

  const isLoading = addLinkLoading || updateLinkLoading;

  const form = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      url: linkToUpdate?.url ?? '',
      title: linkToUpdate?.description ?? '',
      tags: linkToUpdate ? linkToUpdate.tags.map((tag) => tag.id) : [],
    },
  });

  const selectedTags = tags?.filter((tag) => form.watch('tags').includes(tag.id)) ?? [];

  const handleSubmit = form.handleSubmit(async (formData: LinkFormData) => {
    if (linkToUpdate) {
      triggerUpdateLinkAction(
        linkToUpdate.id,
        {
          url: formData.url,
          description: formData.title,
          updatedAt: new Date().toISOString(),
        },
        selectedTags
      );
    } else {
      triggerAddLinkAction(
        {
          url: formData.url,
          description: formData.title,
          userId: profile.id,
        },
        selectedTags
      );
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="URL of your link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="A title for your link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (min 1, max 4)</FormLabel>
              {selectedTags.length > 0 && (
                <TagListWrapper>
                  {selectedTags.map((selectedTag) => (
                    <li key={selectedTag.id}>
                      <Badge>
                        {selectedTag.name}
                        <X
                          className="ml-1 cursor-pointer"
                          size={16}
                          onClick={() => field.onChange(parseComboboxValues(selectedTag.id, field.value))}
                        />
                      </Badge>
                    </li>
                  ))}
                </TagListWrapper>
              )}
              <FormControl>
                <Combobox
                  options={tags?.map((tag) => ({ value: tag.id, label: tag.name })) ?? []}
                  values={field.value}
                  onChange={field.onChange}
                  placeholder={'Search for a tag...'}
                >
                  {{
                    itemAction: (itemValue) => {
                      const tag = tags?.find((tag) => tag.id === parseValue(itemValue));
                      const tagLinksCount = tag?.links.length ?? 0;
                      const canBeRemove = tagLinksCount === 0 && profile.role === 'admin';
                      return (
                        <>
                          ({tagLinksCount})
                          {canBeRemove && tag && (
                            <RemoveTagBtn
                              tag={tag}
                              onSuccess={(id) => {
                                field.onChange(parseComboboxValues(id, field.value));
                              }}
                            />
                          )}
                        </>
                      );
                    },
                    empty: (search) => (
                      <div className="space-x-2">
                        <span>not Tags found</span>
                        {search && (
                          <AddTagBtn
                            value={search}
                            onSuccess={(id) => {
                              field.onChange(parseComboboxValues(id, field.value));
                            }}
                          />
                        )}
                      </div>
                    ),
                    trigger: ' Select tags...',
                  }}
                </Combobox>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" isLoading={isLoading}>
            {linkToUpdate ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
