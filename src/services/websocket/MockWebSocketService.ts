import { WebSocketEventType, WebSocketMessage } from './WebSocketService';

type EventCallback<T = unknown> = (message: WebSocketMessage<T>) => void;

/**
 * Mock WebSocket service for demo purposes
 * Simulates real-time events using localStorage events
 */
class MockWebSocketService {
  private callbacks: Map<WebSocketEventType, Set<EventCallback>> = new Map();
  private isConnected = false;
  private userId: string | null = null;
  private eventCounter = 0;

  connect(userId: string): Promise<void> {
    return new Promise((resolve) => {
      this.userId = userId;
      this.isConnected = true;
      console.log('✅ Mock WebSocket connected for user:', userId);

      // Listen to localStorage changes (simulates multi-tab sync)
      window.addEventListener('storage', this.handleStorageChange);

      resolve();
    });
  }

  private handleStorageChange = (event: StorageEvent): void => {
    // Only process websocket events
    if (event.key?.startsWith('mock_ws_')) {
      try {
        const message: WebSocketMessage = JSON.parse(event.newValue || '{}');
        // Trigger for all tabs including sender
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse storage event:', error);
      }
    }
  };

  private handleMessage(message: WebSocketMessage): void {
    console.log('📥 Mock WebSocket received:', message);
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
    if (!this.isConnected) {
      console.warn('Mock WebSocket is not connected');
      return;
    }

    // Create unique key for each event
    this.eventCounter++;
    const eventKey = `mock_ws_${Date.now()}_${this.eventCounter}`;

    // Store in localStorage to trigger storage event in all tabs
    localStorage.setItem(eventKey, JSON.stringify(message));
    
    // Clean up old events (keep only last 5)
    const allKeys = Object.keys(localStorage).filter(k => k.startsWith('mock_ws_'));
    if (allKeys.length > 5) {
      allKeys
        .sort()
        .slice(0, allKeys.length - 5)
        .forEach(k => localStorage.removeItem(k));
    }

    console.log('📤 Mock WebSocket sent:', message);
  }

  disconnect(): void {
    window.removeEventListener('storage', this.handleStorageChange);
    this.isConnected = false;
    this.userId = null;
    
    // Clean up websocket events
    Object.keys(localStorage)
      .filter(k => k.startsWith('mock_ws_'))
      .forEach(k => localStorage.removeItem(k));
    
    console.log('🔌 Mock WebSocket disconnected');
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const mockWebSocketService = new MockWebSocketService();
