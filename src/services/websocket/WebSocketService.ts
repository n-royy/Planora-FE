export type WebSocketEventType =
  | 'TODO_CREATED'
  | 'TODO_UPDATED'
  | 'TODO_DELETED'
  | 'TODO_TOGGLED'
  | 'TODOS_REORDERED';

export interface WebSocketMessage<T = unknown> {
  type: WebSocketEventType;
  payload: T;
  userId: string;
  timestamp: string;
}

type EventCallback<T = unknown> = (message: WebSocketMessage<T>) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private callbacks: Map<WebSocketEventType, Set<EventCallback>> = new Map();
  private isConnected = false;

  constructor(url: string) {
    this.url = url;
  }

  connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`${this.url}?userId=${userId}`);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔌 WebSocket disconnected');
          this.isConnected = false;
          this.attemptReconnect(userId);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect(userId: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.connect(userId).catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, this.reconnectInterval);
  }

  private handleMessage(message: WebSocketMessage): void {
    const callbacks = this.callbacks.get(message.type);
    if (callbacks) {
      callbacks.forEach((callback) => callback(message));
    }
  }

  on<T = unknown>(type: WebSocketEventType, callback: EventCallback<T>): () => void {
    if (!this.callbacks.has(type)) {
      this.callbacks.set(type, new Set());
    }
    
    this.callbacks.get(type)!.add(callback as EventCallback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.callbacks.get(type);
      if (callbacks) {
        callbacks.delete(callback as EventCallback);
      }
    };
  }

  send(message: WebSocketMessage): void {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
export const websocketService = new WebSocketService(WS_URL);
