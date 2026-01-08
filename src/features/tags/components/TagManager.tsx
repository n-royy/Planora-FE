import React, { useState } from 'react';
import {
  Box,
  Chip,
  TextField,
  Popover,
  Typography,
  Stack,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { Button } from '@/design-system';
import { useTags } from '../hooks/useTags';
import { TAG_COLORS } from '../types/tag.types';

interface TagManagerProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

export const TagManager: React.FC<TagManagerProps> = ({
  selectedTagIds,
  onChange,
}) => {
  const { tags, createTag, deleteTag } = useTags();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(TAG_COLORS[0]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNewTagName('');
    setSelectedColor(TAG_COLORS[0]);
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;

    createTag(
      { name: newTagName.trim(), color: selectedColor },
      {
        onSuccess: (newTag) => {
          onChange([...selectedTagIds, newTag.id]);
          handleClose();
        },
      }
    );
  };

  const handleToggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const handleDeleteTag = (tagId: string) => {
    deleteTag(tagId);
    onChange(selectedTagIds.filter((id) => id !== tagId));
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {selectedTagIds.map((tagId) => {
          const tag = tags.find((t) => t.id === tagId);
          if (!tag) return null;

          return (
            <Chip
              key={tag.id}
              label={tag.name}
              onDelete={() => handleToggleTag(tag.id)}
              sx={{
                backgroundColor: tag.color,
                color: '#fff',
                '& .MuiChip-deleteIcon': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: '#fff',
                  },
                },
              }}
            />
          );
        })}
        <Chip
          icon={<Add />}
          label="Add Tag"
          onClick={handleClick}
          variant="outlined"
          component="button"
        />
      </Stack>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="subtitle2" gutterBottom>
            Select Tags
          </Typography>
          
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={2}>
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                onClick={() => handleToggleTag(tag.id)}
                onDelete={() => handleDeleteTag(tag.id)}
                deleteIcon={<Close />}
                sx={{
                  backgroundColor: selectedTagIds.includes(tag.id)
                    ? tag.color
                    : 'transparent',
                  color: selectedTagIds.includes(tag.id) ? '#fff' : 'inherit',
                  borderColor: tag.color,
                  borderWidth: 1,
                  borderStyle: 'solid',
                }}
              />
            ))}
          </Stack>

          <Typography variant="subtitle2" gutterBottom>
            Create New Tag
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateTag();
              }
            }}
            sx={{ mb: 1 }}
          />

          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap mb={1}>
            {TAG_COLORS.map((color) => (
              <Box
                key={color}
                onClick={() => setSelectedColor(color)}
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: color,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border:
                    selectedColor === color
                      ? '3px solid #000'
                      : '2px solid transparent',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              />
            ))}
          </Stack>

          <Button
            fullWidth
            size="small"
            onClick={handleCreateTag}
            disabled={!newTagName.trim()}
          >
            Create Tag
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};
