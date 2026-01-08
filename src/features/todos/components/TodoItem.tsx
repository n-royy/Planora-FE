import React from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  Typography,
  Chip,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Todo, TodoPriority } from '../types/todo.types';
import { format } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  onToggle: (data: { id: string; completed: boolean }) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const priorityColors: Record<TodoPriority, 'error' | 'warning' | 'default'> = {
  high: 'error',
  medium: 'warning',
  low: 'default',
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const handleToggle = () => {
    onToggle({id: todo.id, completed: !todo.completed});
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(todo.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(todo);
  };

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <Box display="flex" gap={1}>
          <IconButton edge="end" onClick={handleEdit} size="small">
            <Edit fontSize="small" />
          </IconButton>
          <IconButton edge="end" onClick={handleDelete} size="small">
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      }
    >
      <ListItemButton onClick={handleToggle} dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={todo.completed}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                sx={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? 'text.secondary' : 'text.primary',
                }}
              >
                {todo.title}
              </Typography>
              <Chip
                label={todo.priority}
                size="small"
                color={priorityColors[todo.priority]}
              />
            </Box>
          }
          secondary={
            <Box>
              {todo.description && (
                <Typography variant="body2" color="text.secondary">
                  {todo.description}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                {format(new Date(todo.createdAt), 'MMM dd, yyyy')}
              </Typography>
            </Box>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};
