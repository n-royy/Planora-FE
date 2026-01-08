import apiClient from '../../../lib/axios';
import { Todo, CreateTodoInput, UpdateTodoInput, TodoFilters } from '../types/todo.types';

export const todosApi = {
  getTodos: async (filters?: TodoFilters): Promise<Todo[]> => {
    const params = new URLSearchParams();
    
    if (filters?.searchQuery) {
      params.append('search', filters.searchQuery);
    }
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters?.sortField) {
      params.append('sortBy', filters.sortField);
    }
    if (filters?.sortOrder) {
      params.append('order', filters.sortOrder);
    }
    if (filters?.tagIds && filters.tagIds.length > 0) {
      params.append('tagIds', filters.tagIds.join(','));
    }
    if (filters?.assignedToMe) {
      params.append('assignedToMe', 'true');
    }

    const { data } = await apiClient.get<Todo[]>(`/todos?${params.toString()}`);
    
    // Transform priority to lowercase for frontend
    return data.map(todo => ({
      ...todo,
      priority: todo.priority.toLowerCase() as 'low' | 'medium' | 'high',
    }));
  },

  getTodo: async (id: string): Promise<Todo> => {
    const { data } = await apiClient.get<Todo>(`/todos/${id}`);
    return {
      ...data,
      priority: data.priority.toLowerCase() as 'low' | 'medium' | 'high',
    };
  },

  createTodo: async (input: CreateTodoInput): Promise<Todo> => {
    // Transform priority to uppercase for backend
    const backendInput = {
      ...input,
      priority: input.priority.toUpperCase(),
    };

    const { data } = await apiClient.post<Todo>('/todos', backendInput);
    return {
      ...data,
      priority: data.priority.toLowerCase() as 'low' | 'medium' | 'high',
    };
  },

  updateTodo: async (id: string, input: UpdateTodoInput): Promise<Todo> => {
    // Transform priority to uppercase for backend
    const backendInput = {
      ...input,
      priority: input.priority ? input.priority.toUpperCase() : undefined,
    };

    const { data } = await apiClient.patch<Todo>(`/todos/${id}`, backendInput);
    return {
      ...data,
      priority: data.priority.toLowerCase() as 'low' | 'medium' | 'high',
    };
  },

  deleteTodo: async (id: string): Promise<void> => {
    await apiClient.delete(`/todos/${id}`);
  },

  toggleTodo: async (id: string, completed: boolean): Promise<Todo> => {
    const { data } = await apiClient.patch<Todo>(`/todos/${id}`, { completed });
    return {
      ...data,
      priority: data.priority.toLowerCase() as 'low' | 'medium' | 'high',
    };
  },

  reorderTodos: async (todos: Todo[]): Promise<Todo[]> => {
    // Send only id and order
    const reorderData = {
      todos: todos.map((todo, index) => ({
        id: todo.id,
        order: index,
      })),
    };

    const { data } = await apiClient.post<Todo[]>('/todos/reorder', reorderData);
    return data.map(todo => ({
      ...todo,
      priority: todo.priority.toLowerCase() as 'low' | 'medium' | 'high',
    }));
  },
};
