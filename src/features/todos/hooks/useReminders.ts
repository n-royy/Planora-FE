import { useEffect } from 'react';
import { reminderService } from '../../../services/reminder/ReminderService';
import { Todo } from '../types/todo.types';

export const useReminders = (todos: Todo[]) => {
  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Start reminder service
    reminderService.start(todos);

    return () => {
      reminderService.stop();
    };
  }, [todos]);
};
