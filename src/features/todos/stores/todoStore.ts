import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type TodoStatus = 'all' | 'active' | 'completed';
export type SortField = 'createdAt' | 'title' | 'priority' | 'dueDate';
export type SortOrder = 'asc' | 'desc';

interface TodoFilterState {
  searchQuery: string;
  status: TodoStatus;
  sortField: SortField;
  sortOrder: SortOrder;
  setSearchQuery: (query: string) => void;
  setStatus: (status: TodoStatus) => void;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  resetFilters: () => void;
  resetSort: () => void; // Add reset sort method
}

const initialState = {
  searchQuery: '',
  status: 'all' as TodoStatus,
  sortField: 'createdAt' as SortField,
  sortOrder: 'desc' as SortOrder,
};

export const useTodoStore = create<TodoFilterState>()(
  devtools(
    (set) => ({
      ...initialState,

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setStatus: (status) => set({ status }),

      setSortField: (sortField) => set({ sortField }),

      setSortOrder: (sortOrder) => set({ sortOrder }),

      resetFilters: () => set(initialState),

      resetSort: () => set({ 
        sortField: 'createdAt', 
        sortOrder: 'desc' 
      }),
    }),
    { name: 'TodoStore' }
  )
);
