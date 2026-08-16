import { useEffect, useCallback } from 'react';
import websocketService from './websocket';

/**
 * Custom hook for managing WebSocket connections and listening to events
 * @param {string} token - JWT access token
 * @param {Object} handlers - Event handlers object with keys: taskCreated, taskUpdated, taskDeleted
 */
export const useWebSocket = (token, handlers = {}) => {
  // Connect to WebSocket on mount and token change
  useEffect(() => {
    if (token) {
      websocketService.connect(token);

      // Register event handlers if provided
      if (handlers.taskCreated) {
        websocketService.on('taskCreated', handlers.taskCreated);
      }
      if (handlers.taskUpdated) {
        websocketService.on('taskUpdated', handlers.taskUpdated);
      }
      if (handlers.taskDeleted) {
        websocketService.on('taskDeleted', handlers.taskDeleted);
      }
      if (handlers.connectionEstablished) {
        websocketService.on('connectionEstablished', handlers.connectionEstablished);
      }
      if (handlers.error) {
        websocketService.on('error', handlers.error);
      }

      return () => {
        // Cleanup: remove event listeners on unmount
        if (handlers.taskCreated) {
          websocketService.off('taskCreated', handlers.taskCreated);
        }
        if (handlers.taskUpdated) {
          websocketService.off('taskUpdated', handlers.taskUpdated);
        }
        if (handlers.taskDeleted) {
          websocketService.off('taskDeleted', handlers.taskDeleted);
        }
        if (handlers.connectionEstablished) {
          websocketService.off('connectionEstablished', handlers.connectionEstablished);
        }
        if (handlers.error) {
          websocketService.off('error', handlers.error);
        }
      };
    }
  }, [token, handlers]);

  // Return utility functions
  return {
    isConnected: useCallback(() => websocketService.isConnected(), []),
    send: useCallback((message) => websocketService.send(message), []),
    notifyTaskCreated: useCallback((task) => websocketService.notifyTaskCreated(task), []),
    notifyTaskUpdated: useCallback((task) => websocketService.notifyTaskUpdated(task), []),
    notifyTaskDeleted: useCallback((taskId) => websocketService.notifyTaskDeleted(taskId), []),
    disconnect: useCallback(() => websocketService.disconnect(), []),
  };
};

export default useWebSocket;
