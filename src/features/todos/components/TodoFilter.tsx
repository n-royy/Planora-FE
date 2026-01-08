import React from 'react';
import {
  Box,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import { FilterList, Sort } from '@mui/icons-material';
import { useTodoStore, TodoStatus, SortField } from '../stores/todoStore';

export const TodoFilters: React.FC = () => {
  const {
    searchQuery,
    status,
    sortField,
    sortOrder,
    setSearchQuery,
    setStatus,
    setSortField,
    setSortOrder,
    resetFilters,
  } = useTodoStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (
    _: React.MouseEvent<HTMLElement>,
    newStatus: TodoStatus | null
  ) => {
    if (newStatus) {
      setStatus(newStatus);
    }
  };

  const handleSortFieldChange = (e: { target: { value: string } }) => {
    setSortField(e.target.value as SortField);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
        <TextField
          placeholder="Search todos..."
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
          sx={{ minWidth: 250 }}
        />

        <ToggleButtonGroup
          value={status}
          exclusive
          onChange={handleStatusChange}
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="active">Active</ToggleButton>
          <ToggleButton value="completed">Completed</ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortField}
            label="Sort By"
            onChange={handleSortFieldChange}
          >
            <MenuItem value="createdAt">Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
          </Select>
        </FormControl>

        <IconButton onClick={toggleSortOrder} size="small">
          <Sort
            sx={{
              transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s',
            }}
          />
        </IconButton>

        <IconButton onClick={resetFilters} size="small" title="Reset filters">
          <FilterList />
        </IconButton>
      </Box>
    </Box>
  );
};
