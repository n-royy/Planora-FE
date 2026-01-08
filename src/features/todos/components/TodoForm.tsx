import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { Button } from '@/design-system';
import { CreateTodoInput } from '../types/todo.types';
import { TagManager } from '../../tags/components/TagManager';
import { DueDatePicker } from './DueDatePicker';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  priority: z.enum(['low', 'medium', 'high']),
  tagIds: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
  assignedUserIds: z.array(z.string()).optional(),
});

interface TodoFormProps {
  onSubmit: (data: CreateTodoInput) => void;
  isLoading?: boolean;
  defaultValues?: Partial<CreateTodoInput>;
  onCancel?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  isLoading,
  defaultValues,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      priority: defaultValues?.priority || 'medium',
      tagIds: defaultValues?.tagIds || [],
      dueDate: defaultValues?.dueDate || undefined,
      assignedUserIds: defaultValues?.assignedUserIds || [],
    },
  });

  const tagIds = watch('tagIds') || [];

  const handleFormSubmit = (data: CreateTodoInput) => {
    onSubmit(data);
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Title"
            fullWidth
            margin="normal"
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        )}
      />

      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal" error={!!errors.priority}>
            <InputLabel>Priority</InputLabel>
            <Select {...field} label="Priority">
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
            {errors.priority && (
              <FormHelperText>{errors.priority.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      <Box my={2}>
        <TagManager
          selectedTagIds={tagIds}
          onChange={(newTagIds) => setValue('tagIds', newTagIds)}
        />
      </Box>

      <Box my={2}>
        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <DueDatePicker
              value={field.value}
              onChange={field.onChange}
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message}
            />
          )}
        />
      </Box>

      <Box display="flex" gap={2} mt={3}>
        <Button type="submit" variant="contained" loading={isLoading} fullWidth>
          Submit
        </Button>
        {onCancel && (
          <Button onClick={onCancel} variant="outlined" fullWidth>
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
};
