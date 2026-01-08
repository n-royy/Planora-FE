import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { mockWebSocketService } from '../../../services/websocket/MockWebSocketService';
import { WebSocketMessage } from '../../../services/websocket/WebSocketService';
import { useAuthStore } from '../../../features/auth/stores/authStore';
import { Todo } from '../types/todo.types';

const USE_MOCK_WEBSOCKET = true;
const wsService = USE_MOCK_WEBSOCKET ? mockWebSocketService : null;

export const useWebSocket = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Connect to WebSocket
  useEffect(() => {
    if (!user || !wsService) return;

    wsService.connect(user.id).catch((error) => {
      console.error('Failed to connect to WebSocket:', error);
    });

    return () => {
      wsService.disconnect();
    };
  }, [user]);

  // Subscribe to TODO_CREATED events
  useEffect(() => {
    if (!wsService) return;

    const unsubscribe = wsService.on<Todo>(
      'TODO_CREATED',
      (message: WebSocketMessage<Todo>) => {
        console.log('🆕 New todo created:', message.payload);
        
        // Invalidate todos query to refetch
        queryClient.invalidateQueries({ queryKey: ['todos'] });
      }
    );

    return unsubscribe;
  }, [queryClient]);

  // Subscribe to TODO_UPDATED events
  useEffect(() => {
    if (!wsService) return;

    const unsubscribe = wsService.on<Todo>(
      'TODO_UPDATED',
      (message: WebSocketMessage<Todo>) => {
        console.log('✏️ Todo updated:', message.payload);
        queryClient.invalidateQueries({ queryKey: ['todos'] });
      }
    );

    return unsubscribe;
  }, [queryClient]);

  // Subscribe to TODO_DELETED events
  useEffect(() => {
    if (!wsService) return;

    const unsubscribe = wsService.on<{ id: string }>(
      'TODO_DELETED',
      (message: WebSocketMessage<{ id: string }>) => {
        console.log('🗑️ Todo deleted:', message.payload.id);
        queryClient.invalidateQueries({ queryKey: ['todos'] });
      }
    );

    return unsubscribe;
  }, [queryClient]);

  // Subscribe to TODO_TOGGLED events
  useEffect(() => {
    if (!wsService) return;

    const unsubscribe = wsService.on<Todo>(
      'TODO_TOGGLED',
      (message: WebSocketMessage<Todo>) => {
        console.log('✓ Todo toggled:', message.payload);
        queryClient.invalidateQueries({ queryKey: ['todos'] });
      }
    );

    return unsubscribe;
  }, [queryClient]);

  // Subscribe to TODOS_REORDERED events
  useEffect(() => {
    if (!wsService) return;

    const unsubscribe = wsService.on<Todo[]>(
      'TODOS_REORDERED',
      (message: WebSocketMessage<Todo[]>) => {
        console.log('🔄 Todos reordered', message);
        queryClient.invalidateQueries({ queryKey: ['todos'] });
      }
    );

    return unsubscribe;
  }, [queryClient]);

  // Function to broadcast events
  const broadcast = useCallback(
    (type: WebSocketMessage['type'], payload: unknown) => {
      if (!wsService || !user) return;

      const message: WebSocketMessage = {
        type,
        payload,
        userId: user.id,
        timestamp: new Date().toISOString(),
      };

      wsService.send(message);
    },
    [user]
  );

  return {
    broadcast,
    isConnected: wsService?.getConnectionStatus() || false,
  };
};
