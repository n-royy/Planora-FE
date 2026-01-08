import { Todo } from '../../features/todos/types/todo.types';
import { isToday, isTomorrow, parseISO, differenceInHours } from 'date-fns';

class ReminderService {
  private checkInterval: NodeJS.Timeout | null = null;
  private notifiedTodos: Set<string> = new Set();

  start(todos: Todo[]): void {
    // Check for reminders every minute
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.checkReminders(todos);
    }, 60000); // 1 minute

    // Check immediately on start
    this.checkReminders(todos);
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private checkReminders(todos: Todo[]): void {
    const now = new Date();

    todos.forEach((todo) => {
      if (todo.completed || !todo.dueDate) return;

      const dueDate = parseISO(todo.dueDate);
      const hoursUntilDue = differenceInHours(dueDate, now);

      // Notify if due today and not already notified
      if (isToday(dueDate) && !this.notifiedTodos.has(todo.id)) {
        this.sendNotification(todo, 'due today');
        this.notifiedTodos.add(todo.id);
      }

      // Notify if due tomorrow and not already notified
      if (isTomorrow(dueDate) && !this.notifiedTodos.has(`${todo.id}-tomorrow`)) {
        this.sendNotification(todo, 'due tomorrow');
        this.notifiedTodos.add(`${todo.id}-tomorrow`);
      }

      // Notify if due in 1 hour
      if (hoursUntilDue === 1 && !this.notifiedTodos.has(`${todo.id}-1h`)) {
        this.sendNotification(todo, 'due in 1 hour');
        this.notifiedTodos.add(`${todo.id}-1h`);
      }
    });
  }

  private sendNotification(todo: Todo, timing: string): void {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    // Request permission if needed
    if (Notification.permission === 'granted') {
      this.showNotification(todo, timing);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          this.showNotification(todo, timing);
        }
      });
    }
  }

  private showNotification(todo: Todo, timing: string): void {
    const notification = new Notification('Todo Reminder', {
      body: `"${todo.title}" is ${timing}`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: todo.id,
    });

    // Close notification after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  clearNotified(todoId: string): void {
    this.notifiedTodos.delete(todoId);
    this.notifiedTodos.delete(`${todoId}-tomorrow`);
    this.notifiedTodos.delete(`${todoId}-1h`);
  }
}

export const reminderService = new ReminderService();
