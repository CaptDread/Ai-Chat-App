import { useState, useCallback } from 'react';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (message) => {
    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage = { role: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Add AI response
      const aiMessage = { 
        role: 'assistant', 
        content: data.response,
        timestamp: new Date(),
        model: data.model // Include model info if available
      };
      setMessages(prev => [...prev, aiMessage]);
      
      return data.response;
    } catch (err) {
      const errorMsg = err.message || 'Unknown error occurred';
      setError(errorMsg);
      
      // Add error message to chat
      const errorMessage = { 
        role: 'error', 
        content: `Error: ${errorMsg}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    clearChat,
  };
}