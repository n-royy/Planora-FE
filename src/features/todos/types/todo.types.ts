export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt: string;
  updatedAt: string;
  userId: string;
  order?: number;
  tagIds?: string[]; // Add tags
  dueDate?: string; // Add due date
  assignedUserIds?: string[]; // Add collaborative users
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority: TodoPriority;
  tagIds?: string[];
  dueDate?: string;
  assignedUserIds?: string[];
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: TodoPriority;
  tagIds?: string[];
  dueDate?: string;
  assignedUserIds?: string[];
}

export interface TodoFilters {
  searchQuery?: string;
  status?: 'all' | 'active' | 'completed';
  sortField?: 'createdAt' | 'title' | 'priority' | 'dueDate';
  sortOrder?: 'asc' | 'desc';
  tagIds?: string[];
  assignedToMe?: boolean;
}
