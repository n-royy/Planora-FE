import { Todo } from '../../features/todos/types/todo.types';
import { Tag } from '../../features/tags/types/tag.types';
import { format } from 'date-fns';

export interface ExportData {
  version: string;
  exportDate: string;
  todos: Todo[];
  tags: Tag[];
}

export interface ImportResult {
  success: boolean;
  todosImported: number;
  tagsImported: number;
  errors: string[];
}

class ExportImportService {
  private readonly VERSION = '1.0.0';

  /**
   * Export todos and tags to JSON
   */
  exportToJSON(todos: Todo[], tags: Tag[]): string {
    const data: ExportData = {
      version: this.VERSION,
      exportDate: new Date().toISOString(),
      todos,
      tags,
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Export todos to CSV
   */
  exportToCSV(todos: Todo[], tags: Tag[]): string {
    // Create tag map for quick lookup
    const tagMap = new Map(tags.map((tag) => [tag.id, tag.name]));

    // CSV Headers
    const headers = [
      'ID',
      'Title',
      'Description',
      'Priority',
      'Status',
      'Tags',
      'Due Date',
      'Created At',
      'Updated At',
    ];

    // Convert todos to CSV rows
    const rows = todos.map((todo) => {
      const todoTags = (todo.tagIds || [])
        .map((id) => tagMap.get(id))
        .filter(Boolean)
        .join('; ');

      return [
        todo.id,
        this.escapeCSV(todo.title),
        this.escapeCSV(todo.description || ''),
        todo.priority,
        todo.completed ? 'Completed' : 'Active',
        todoTags,
        todo.dueDate ? format(new Date(todo.dueDate), 'yyyy-MM-dd') : '',
        format(new Date(todo.createdAt), 'yyyy-MM-dd HH:mm:ss'),
        format(new Date(todo.updatedAt), 'yyyy-MM-dd HH:mm:ss'),
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csvContent;
  }

  /**
   * Download data as file
   */
  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export and download as JSON
   */
  exportJSON(todos: Todo[], tags: Tag[]): void {
    const content = this.exportToJSON(todos, tags);
    const filename = `todos-export-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
    this.downloadFile(content, filename, 'application/json');
  }

  /**
   * Export and download as CSV
   */
  exportCSV(todos: Todo[], tags: Tag[]): void {
    const content = this.exportToCSV(todos, tags);
    const filename = `todos-export-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.csv`;
    this.downloadFile(content, filename, 'text/csv');
  }

  /**
   * Import from JSON file
   */
  async importFromJSON(file: File): Promise<ExportData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as ExportData;

          // Validate structure
          if (!data.todos || !Array.isArray(data.todos)) {
            throw new Error('Invalid file format: missing todos array');
          }

          if (!data.tags || !Array.isArray(data.tags)) {
            throw new Error('Invalid file format: missing tags array');
          }

          resolve(data);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Validate and sanitize imported data
   */
  validateImportData(data: ExportData): ImportResult {
    const errors: string[] = [];
    let validTodos = 0;
    let validTags = 0;

    // Validate tags
    data.tags.forEach((tag, index) => {
      if (!tag.id || !tag.name || !tag.color) {
        errors.push(`Tag at index ${index} is missing required fields`);
      } else {
        validTags++;
      }
    });

    // Validate todos
    data.todos.forEach((todo, index) => {
      if (!todo.id || !todo.title) {
        errors.push(`Todo at index ${index} is missing required fields`);
      } else {
        validTodos++;
      }
    });

    return {
      success: validTodos > 0 || validTags > 0,
      todosImported: validTodos,
      tagsImported: validTags,
      errors,
    };
  }

  /**
   * Merge imported data with existing data
   */
  mergeData(
    existingTodos: Todo[],
    importedTodos: Todo[],
    existingTags: Tag[],
    importedTags: Tag[],
    mode: 'replace' | 'merge'
  ): { todos: Todo[]; tags: Tag[] } {
    if (mode === 'replace') {
      return {
        todos: importedTodos,
        tags: importedTags,
      };
    }

    // Merge mode: combine and deduplicate by ID
    const todosMap = new Map<string, Todo>();
    const tagsMap = new Map<string, Tag>();

    // Add existing data
    existingTodos.forEach((todo) => todosMap.set(todo.id, todo));
    existingTags.forEach((tag) => tagsMap.set(tag.id, tag));

    // Add/overwrite with imported data
    importedTodos.forEach((todo) => todosMap.set(todo.id, todo));
    importedTags.forEach((tag) => tagsMap.set(tag.id, tag));

    return {
      todos: Array.from(todosMap.values()),
      tags: Array.from(tagsMap.values()),
    };
  }

  /**
   * Escape CSV special characters
   */
  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}

export const exportImportService = new ExportImportService();
