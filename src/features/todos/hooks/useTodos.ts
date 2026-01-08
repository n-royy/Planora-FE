import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todosApi } from '../api/todosApi';
import { CreateTodoInput, UpdateTodoInput, TodoFilters, Todo } from '../types/todo.types';
import { useTodoStore } from '../stores/todoStore';

const TODOS_QUERY_KEY = ['todos'];

export const useTodos = () => {
  const queryClient = useQueryClient();
  const { searchQuery, status, sortField, sortOrder } = useTodoStore();

  const filters: TodoFilters = {
    searchQuery,
    status,
    sortField,
    sortOrder,
  };

  // Get todos query
  const todosQuery = useQuery({
    queryKey: [...TODOS_QUERY_KEY, filters],
    queryFn: () => todosApi.getTodos(filters),
  });

  // Create todo mutation
  const createMutation = useMutation({
    mutationFn: (input: CreateTodoInput) => todosApi.createTodo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });

  // Update todo mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) =>
      todosApi.updateTodo(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });

  // Delete todo mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => todosApi.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });

  // Toggle todo mutation
  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      todosApi.toggleTodo(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });

  // Reorder todos mutation
  const reorderMutation = useMutation({
    mutationFn: (todos: Todo[]) => todosApi.reorderTodos(todos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });

  return {
    todos: todosQuery.data || [],
    isLoading: todosQuery.isLoading,
    error: todosQuery.error,
    createTodo: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateTodo: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteTodo: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    toggleTodo: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
    reorderTodos: reorderMutation.mutate,
    isReordering: reorderMutation.isPending,
  };
};
