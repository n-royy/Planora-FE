import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsApi } from '../api/tagAPI';
import { CreateTagInput } from '../types/tag.types';

const TAGS_QUERY_KEY = ['tags'];

export const useTags = () => {
  const queryClient = useQueryClient();

  const tagsQuery = useQuery({
    queryKey: TAGS_QUERY_KEY,
    queryFn: tagsApi.getTags,
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateTagInput) => tagsApi.createTag(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateTagInput> }) =>
      tagsApi.updateTag(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tagsApi.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return {
    tags: tagsQuery.data || [],
    isLoading: tagsQuery.isLoading,
    createTag: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateTag: updateMutation.mutate,
    deleteTag: deleteMutation.mutate,
  };
};
