'use client';

import { linkSchema } from '@/components/modals/LinkModals/schemas';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAddLink } from '@/data/link/use-add-link';
import { FetchProfileReturn } from '@/lib/supabase/queries/fetch-profile';
import { formatError, stringToSlug } from '@/utils/format-string';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { TrashIcon, X } from 'lucide-react';

import { Combobox, parseComboboxValues, parseValue } from '@/components/Combobox';
import { TagListWrapper } from '@/components/TagListWrapper';
import SpinnerIcon from '@/components/icons/SpinnerIcon';
import { Badge } from '@/components/ui/badge';
import { useUpdateLink } from '@/data/link/use-update-link';
import { useAddTag } from '@/data/tag/use-add-tag';
import { useRemoveTag } from '@/data/tag/use-remove-tag';
import { FetchLinksReturn } from '@/lib/supabase/queries/fetch-links';
import { FetchTagsReturn } from '@/lib/supabase/queries/fetch-tags';
import { z } from 'zod';

type LinkFormData = z.infer<typeof linkSchema>;

interface AddLinkFormProps {
  closeModal: () => void;
  profile: NonNullable<FetchProfileReturn>;
  linkToUpdate?: FetchLinksReturn[0];
  tags: FetchTagsReturn;
}

export function LinkForm({ closeModal, profile, linkToUpdate, tags }: AddLinkFormProps) {
  const addLink = useAddLink();
  const updateLink = useUpdateLink();

  const { destructiveToast } = useToast();

  const addTag = useAddTag();
  const removeTag = useRemoveTag();

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
    try {
      if (linkToUpdate) {
        await updateLink.mutateAsync({
          linkId: linkToUpdate.id,
          linkToUpdate: {
            url: formData.url,
            description: formData.title,
            updatedAt: new Date().toISOString(),
          },
          tags: selectedTags,
        });
      } else {
        await addLink.mutateAsync({
          linkToAdd: {
            url: formData.url,
            description: formData.title,
            userId: profile.id,
          },
          tags: selectedTags,
        });
      }

      // Do not setLoading(false) because addLink will unmount this component (Modal).
      closeModal();
    } catch (err) {
      destructiveToast({ description: formatError(err as Error) });
      console.error(err);
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
                          {canBeRemove && (
                            <>
                              {removeTag.isPending ? (
                                <SpinnerIcon size={16} />
                              ) : (
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    if (tag) {
                                      removeTag.mutate(tag.id, {
                                        onSuccess(id) {
                                          field.onChange(parseComboboxValues(id, field.value));
                                        },
                                      });
                                    }
                                  }}
                                  className="ml-auto"
                                >
                                  <TrashIcon size={16} />
                                </button>
                              )}
                            </>
                          )}
                        </>
                      );
                    },
                    empty: (search) => (
                      <div className="space-x-2">
                        <span>not Tags found</span>
                        {search && (
                          <Button
                            isLoading={addTag.isPending}
                            onClick={() => {
                              addTag.mutate(
                                {
                                  name: search,
                                  slug: stringToSlug(search),
                                },
                                {
                                  onSuccess(data) {
                                    field.onChange(parseComboboxValues(data.id, field.value));
                                  },
                                  onError(error) {
                                    destructiveToast({
                                      description: formatError(error as Error),
                                    });
                                  },
                                }
                              );
                            }}
                            size="sm"
                          >
                            Create <span className="mx-1 font-bold">{search}</span>tag
                          </Button>
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
          <Button type="submit" isLoading={addLink.isPending}>
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
