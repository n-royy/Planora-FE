import React, { useState, useRef, useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Fab,
  Chip,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableTodoItem } from './DraggableTodoItems';
import { TodoForm } from './TodoForm';
import { TodoFilters } from './TodoFilter';
import { Modal } from '@/design-system';
import { useTodos } from '../hooks/useTodos';
import { useWebSocket } from '../hooks/useWebSocket';
import { useReminders } from '../hooks/useReminders';
import { useTodoStore } from '../stores/todoStore';
import { Todo, CreateTodoInput } from '../types/todo.types';

export const TodoList: React.FC = () => {
  const {
    todos,
    isLoading,
    error,
    createTodo,
    isCreating,
    updateTodo,
    deleteTodo,
    toggleTodo,
    reorderTodos,
  } = useTodos();

  const { broadcast, isConnected } = useWebSocket();
  const { resetSort } = useTodoStore();
  useReminders(todos);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [draggedTodos, setDraggedTodos] = useState<Todo[] | null>(null);
  const isDraggingRef = useRef(false);

  // Display either dragged todos (while dragging) or server todos
  const displayTodos = useMemo(() => {
    return draggedTodos ?? todos;
  }, [draggedTodos, todos]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    isDraggingRef.current = true;
    // Store current todos when drag starts
    setDraggedTodos(displayTodos);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      isDraggingRef.current = false;
      setDraggedTodos(null);
      return;
    }

    const oldIndex = displayTodos.findIndex((todo) => todo.id === active.id);
    const newIndex = displayTodos.findIndex((todo) => todo.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      isDraggingRef.current = false;
      setDraggedTodos(null);
      return;
    }

    const reordered = arrayMove(displayTodos, oldIndex, newIndex);
    
    // Update dragged state for immediate UI feedback
    setDraggedTodos(reordered);

    // Reset sort to default when manually reordering
    resetSort();

    // Save to backend
    reorderTodos(reordered, {
      onSuccess: (updated) => {
        console.log('✅ Todos reordered successfully');
        // Clear dragged state - will show server data
        isDraggingRef.current = false;
        setDraggedTodos(null);
        // Broadcast WebSocket event
        broadcast('TODOS_REORDERED', updated);
      },
      onError: (error) => {
        console.error('❌ Failed to reorder todos:', error);
        // Revert to server data on error
        isDraggingRef.current = false;
        setDraggedTodos(null);
      },
    });
  };

  const handleOpenModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const handleSubmit = (data: CreateTodoInput) => {
    if (editingTodo) {
      updateTodo(
        { id: editingTodo.id, input: data },
        {
          onSuccess: (updated) => {
            broadcast('TODO_UPDATED', updated);
          },
        }
      );
    } else {
      createTodo(data, {
        onSuccess: (created) => {
          broadcast('TODO_CREATED', created);
        },
      });
    }
    handleCloseModal();
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTodo(id, {
      onSuccess: () => {
        broadcast('TODO_DELETED', { id });
      },
    });
  };

  const handleToggle = (id: string, completed: boolean) => {
    toggleTodo(
      { id, completed },
      {
        onSuccess: (toggled) => {
          broadcast('TODO_TOGGLED', toggled);
        },
      }
    );
  };

  if (error) {
    return (
      <Alert severity="error">
        Error loading todos: {(error as Error).message}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h4">My Todos</Typography>
          <Chip
            label={isConnected ? '🟢 Live' : '🔴 Offline'}
            size="small"
            color={isConnected ? 'success' : 'default'}
          />
        </Box>
      </Box>

      <TodoFilters />

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : displayTodos.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">
            No todos found. Create your first one!
          </Typography>
        </Box>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={displayTodos.map((todo) => todo.id)}
            strategy={verticalListSortingStrategy}
          >
            <Box>
              {displayTodos.map((todo) => (
                <DraggableTodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </Box>
          </SortableContext>
        </DndContext>
      )}

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpenModal}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Add />
      </Fab>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingTodo ? 'Edit Todo' : 'Create Todo'}
        size="md"
      >
        <TodoForm
          onSubmit={handleSubmit}
          isLoading={isCreating}
          defaultValues={editingTodo || undefined}
          onCancel={handleCloseModal}
        />
      </Modal>
    </Box>
  );
};
