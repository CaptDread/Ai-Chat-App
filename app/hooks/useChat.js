import { useState, useCallback } from 'react';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  const sendMessage = useCallback(async (message) => {
    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage = { role: 'user', content: message, timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Build conversation history for API
    const historyForApi = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          history: historyForApi
        }),
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
        model: data.model
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      
      // Update conversation history (limit to last 20 messages to avoid token limits)
      const newHistory = [
        ...conversationHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: data.response }
      ].slice(-20); // Keep last 10 exchanges (20 messages)
      
      setConversationHistory(newHistory);
      
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
  }, [messages, conversationHistory]); // Add dependencies

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationHistory([]);
    setError(null);
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    clearChat,
    conversationHistory, // Optional: expose if needed
  };
}