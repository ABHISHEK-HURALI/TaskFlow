/**
 * WebSocket Service for real-time task updates
 * Handles connection, disconnection, and event handling
 */

class WebSocketService {
  constructor() {
    this.socket = null;
    this.url = 'ws://localhost:8000/ws/tasks/';
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.listeners = {};
  }

  /**
   * Connect to WebSocket
   * @param {string} token - JWT access token for authentication
   */
  connect(token) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    if (!token) {
      console.error('No token provided for WebSocket connection');
      return;
    }

    try {
      // Connect with token as query parameter
      this.socket = new WebSocket(`${this.url}?token=${token}`);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.emit('connected');
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.emit('disconnected');
        this.attemptReconnect(token);
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.emit('error', error);
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Send message through WebSocket
   * @param {Object} message - Message to send
   */
  send(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected');
    }
  }

  /**
   * Handle incoming WebSocket messages
   * @param {Object} data - Message data
   */
  handleMessage(data) {
    const { type, ...payload } = data;

    switch (type) {
      case 'connection_established':
        console.log('Connection established:', payload.message);
        this.emit('connectionEstablished', payload);
        break;

      case 'task_created':
        console.log('Task created:', payload.task);
        this.emit('taskCreated', payload.task);
        break;

      case 'task_updated':
        console.log('Task updated:', payload.task);
        this.emit('taskUpdated', payload.task);
        break;

      case 'task_deleted':
        console.log('Task deleted:', payload.task_id);
        this.emit('taskDeleted', payload.task_id);
        break;

      case 'error':
        console.error('WebSocket error:', payload.message);
        this.emit('wsError', payload);
        break;

      default:
        console.log('Unknown message type:', type, payload);
    }
  }

  /**
   * Register event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Unregister event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }
  }

  /**
   * Emit event to all listeners
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }

  /**
   * Attempt to reconnect
   * @param {string} token - JWT access token
   */
  attemptReconnect(token) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => {
        this.connect(token);
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsExceeded');
    }
  }

  /**
   * Check if WebSocket is connected
   * @returns {boolean}
   */
  isConnected() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Notify task creation
   * @param {Object} task - Task data
   */
  notifyTaskCreated(task) {
    this.send({
      action: 'task_created',
      task,
    });
  }

  /**
   * Notify task update
   * @param {Object} task - Task data
   */
  notifyTaskUpdated(task) {
    this.send({
      action: 'task_updated',
      task,
    });
  }

  /**
   * Notify task deletion
   * @param {number} taskId - Task ID
   */
  notifyTaskDeleted(taskId) {
    this.send({
      action: 'task_deleted',
      task_id: taskId,
    });
  }
}

// Export singleton instance
export default new WebSocketService();
