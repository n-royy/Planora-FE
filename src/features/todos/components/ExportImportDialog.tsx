import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Tabs,
  Tab,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  FileDownload,
  FileUpload,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { Button } from '@/design-system';
import { useTodos } from '../hooks/useTodos';
import { useTags } from '../../../features/tags/hooks/useTags';
import { exportImportService, ImportResult } from '../../../services/export/ExportImportService';

interface ExportImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ExportImportDialog: React.FC<ExportImportDialogProps> = ({
  open,
  onClose,
}) => {
  const { todos } = useTodos();
  const { tags } = useTags();
  const [activeTab, setActiveTab] = useState(0);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);

  const handleExport = () => {
    if (exportFormat === 'json') {
      exportImportService.exportJSON(todos, tags);
    } else {
      exportImportService.exportCSV(todos, tags);
    }
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      // Read and parse file
      const data = await exportImportService.importFromJSON(file);

      // Validate data
      const result = exportImportService.validateImportData(data);
      setImportResult(result);

      if (result.success) {
        // Merge or replace data
        const merged = exportImportService.mergeData(
          todos,
          data.todos,
          tags,
          data.tags,
          importMode
        );

        // Save to localStorage (mock API)
        localStorage.setItem('mock_todos', JSON.stringify(merged.todos));
        localStorage.setItem('mock_tags', JSON.stringify(merged.tags));

        // Reload page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setImportResult({
        success: false,
        todosImported: 0,
        tagsImported: 0,
        errors: [(error as Error).message],
      });
    } finally {
      setImporting(false);
    }

    // Reset file input
    event.target.value = '';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export / Import Todos</DialogTitle>
      <DialogContent>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab icon={<FileDownload />} label="Export" />
          <Tab icon={<FileUpload />} label="Import" />
        </Tabs>

        {/* Export Tab */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Export all your todos and tags to a file. You can choose between JSON
              (recommended for backup) or CSV (for spreadsheets).
            </Typography>

            <FormControl component="fieldset">
              <FormLabel component="legend">Export Format</FormLabel>
              <RadioGroup
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
              >
                <FormControlLabel
                  value="json"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2">JSON</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Complete backup with all data (recommended)
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="csv"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2">CSV</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Spreadsheet format (Excel, Google Sheets)
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>{todos.length}</strong> todos and{' '}
                <strong>{tags.length}</strong> tags will be exported.
              </Typography>
            </Alert>
          </Box>
        )}

        {/* Import Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Import todos from a JSON file exported earlier. You can choose to merge
              with existing data or replace everything.
            </Typography>

            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Import Mode</FormLabel>
              <RadioGroup
                value={importMode}
                onChange={(e) => setImportMode(e.target.value as 'merge' | 'replace')}
              >
                <FormControlLabel
                  value="merge"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2">Merge</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Combine with existing todos (recommended)
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="replace"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2">Replace</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Delete all existing data and replace with import
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<FileUpload />}
              disabled={importing}
            >
              {importing ? 'Importing...' : 'Choose JSON File'}
              <input
                type="file"
                accept=".json"
                hidden
                onChange={handleImportFile}
              />
            </Button>

            {importResult && (
              <Box mt={2}>
                {importResult.success ? (
                  <Alert severity="success">
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Import Successful!
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${importResult.todosImported} todos imported`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${importResult.tagsImported} tags imported`}
                        />
                      </ListItem>
                    </List>
                    <Typography variant="caption">
                      Page will reload in 2 seconds...
                    </Typography>
                  </Alert>
                ) : (
                  <Alert severity="error">
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Import Failed
                    </Typography>
                    <List dense>
                      {importResult.errors.map((error, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <ErrorIcon color="error" />
                          </ListItemIcon>
                          <ListItemText primary={error} />
                        </ListItem>
                      ))}
                    </List>
                  </Alert>
                )}
              </Box>
            )}

            {importMode === 'replace' && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Warning: Replace mode will delete all your current todos and tags!
                </Typography>
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {activeTab === 0 && (
          <Button
            onClick={handleExport}
            variant="contained"
            startIcon={<FileDownload />}
          >
            Export {exportFormat.toUpperCase()}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
