import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  Paper,
  Stack,
} from '@mui/material';
import { Delete, Edit, DragIndicator, CalendarToday } from '@mui/icons-material';
import { Todo, TodoPriority } from '../types/todo.types';
import { format, isPast, isToday } from 'date-fns';
import { useTags } from '../../tags/hooks/useTags';

interface DraggableTodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const priorityColors: Record<TodoPriority, 'error' | 'warning' | 'default'> = {
  high: 'error',
  medium: 'warning',
  low: 'default',
};

export const DraggableTodoItem: React.FC<DraggableTodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const { tags } = useTags();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleToggle = () => {
    onToggle(todo.id, !todo.completed);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(todo.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(todo);
  };

  const getDueDateColor = () => {
    if (!todo.dueDate) return undefined;
    const dueDate = new Date(todo.dueDate);
    if (isPast(dueDate) && !isToday(dueDate)) return 'error';
    if (isToday(dueDate)) return 'warning';
    return 'default';
  };

  const todoTags = tags.filter((t) => todo.tagIds?.includes(t.id));

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={isDragging ? 8 : 1}
      sx={{
        mb: 1,
        cursor: isDragging ? 'grabbing' : 'default',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
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
        {/* Drag Handle */}
        <IconButton
          {...attributes}
          {...listeners}
          sx={{
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing',
            },
          }}
        >
          <DragIndicator />
        </IconButton>

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
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
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
                {todo.dueDate && (
                  <Chip
                    icon={<CalendarToday fontSize="small" />}
                    label={format(new Date(todo.dueDate), 'MMM dd')}
                    size="small"
                    color={getDueDateColor()}
                  />
                )}
              </Box>
            }
            secondary={
              <Box>
                {todo.description && (
                  <Typography variant="body2" color="text.secondary">
                    {todo.description}
                  </Typography>
                )}
                
                {/* Tags */}
                {todoTags.length > 0 && (
                  <Stack direction="row" spacing={0.5} mt={0.5}>
                    {todoTags.map((tag) => (
                      <Chip
                        key={tag.id}
                        label={tag.name}
                        size="small"
                        sx={{
                          backgroundColor: tag.color,
                          color: '#fff',
                          height: 20,
                          fontSize: '0.7rem',
                        }}
                      />
                    ))}
                  </Stack>
                )}

                <Typography variant="caption" color="text.secondary">
                  {format(new Date(todo.createdAt), 'MMM dd, yyyy')}
                </Typography>
              </Box>
            }
          />
        </ListItemButton>
      </ListItem>
    </Paper>
  );
};
