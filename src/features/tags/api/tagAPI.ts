import apiClient from '../../../lib/axios';
import { Tag, CreateTagInput } from '../types/tag.types';

export const tagsApi = {
  getTags: async (): Promise<Tag[]> => {
    const { data } = await apiClient.get<Tag[]>('/tags');
    return data;
  },

  getTag: async (id: string): Promise<Tag> => {
    const { data } = await apiClient.get<Tag>(`/tags/${id}`);
    return data;
  },

  createTag: async (input: CreateTagInput): Promise<Tag> => {
    const { data } = await apiClient.post<Tag>('/tags', input);
    return data;
  },

  updateTag: async (id: string, input: Partial<CreateTagInput>): Promise<Tag> => {
    const { data } = await apiClient.patch<Tag>(`/tags/${id}`, input);
    return data;
  },

  deleteTag: async (id: string): Promise<void> => {
    await apiClient.delete(`/tags/${id}`);
  },
};
