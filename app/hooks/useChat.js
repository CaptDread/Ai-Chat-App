import { useState, useCallback, useEffect, useRef } from 'react';

export function useChat() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Track if we're loading a chat to prevent auto-save during load
  const isLoadingChat = useRef(false);

  // Convert timestamp strings to Date objects when loading from localStorage
  const parseMessagesWithDates = (messages) => {
    return messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
    }));
  };

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('ai-chat-app-chats');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        // Convert all timestamp strings to Date objects
        const chatsWithDates = parsedChats.map(chat => ({
          ...chat,
          messages: parseMessagesWithDates(chat.messages),
          lastUpdated: new Date(chat.lastUpdated)
        }));
        
        setChats(chatsWithDates);
        
        // If there are chats, load the first one
        if (chatsWithDates.length > 0 && !currentChatId) {
          setCurrentChatId(chatsWithDates[0].id);
          setMessages(chatsWithDates[0].messages);
        }
      } catch (error) {
        console.error('Error parsing chats from localStorage:', error);
        // If there's an error, clear corrupted data
        localStorage.removeItem('ai-chat-app-chats');
      }
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ai-chat-app-chats', JSON.stringify(chats));
  }, [chats]);

  // Save current chat to chats array
  const saveCurrentChat = useCallback((newMessages = null) => {
    const messagesToSave = newMessages || messages;
    if (messagesToSave.length === 0) return null;

    const firstUserMessage = messagesToSave.find(msg => msg.role === 'user');
    const chatTitle = firstUserMessage 
      ? (firstUserMessage.content?.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '')) 
      : 'New Chat';
    
    const chat = {
      id: currentChatId || Date.now().toString(),
      title: chatTitle,
      messages: messagesToSave,
      lastUpdated: new Date().toISOString()
    };

    setChats(prev => {
      // Remove existing chat with same ID if it exists
      const filtered = prev.filter(c => c.id !== chat.id);
      return [chat, ...filtered].slice(0, 20); // Keep last 20 chats
    });

    return chat.id;
  }, [messages, currentChatId]);

  const sendMessage = useCallback(async (message) => {
    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage = { role: 'user', content: message, timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          history: updatedMessages
            .filter(msg => msg.role !== 'error')
            .map(({ role, content }) => ({ role, content }))
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
      ].slice(-20);
      
      setConversationHistory(newHistory);

      // SAVE THE CHAT IMMEDIATELY AFTER AI RESPONSE
      if (!currentChatId) {
        const newChatId = saveCurrentChat(finalMessages);
        setCurrentChatId(newChatId);
      } else {
        saveCurrentChat(finalMessages);
      }
      
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
      const errorMessages = [...updatedMessages, errorMessage];
      setMessages(errorMessages);
      
      // Also save chat when there's an error
      if (!currentChatId) {
        const newChatId = saveCurrentChat(errorMessages);
        setCurrentChatId(newChatId);
      } else {
        saveCurrentChat(errorMessages);
      }
      
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentChatId, saveCurrentChat, conversationHistory]);

  const newChat = useCallback(() => {
    // Save current chat before starting new one only if it has messages
    if (messages.length > 0) {
      saveCurrentChat();
    }
    
    setCurrentChatId(null);
    setMessages([]);
    setError(null);
  }, [messages, saveCurrentChat]);

  const loadChat = useCallback((chatId) => {
    // Set loading flag to prevent auto-save
    isLoadingChat.current = true;
    
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
      setError(null);
    }
    
    // Clear loading flag after a short delay to ensure the setMessages has completed
    setTimeout(() => {
      isLoadingChat.current = false;
    }, 100);
  }, [chats]);

  const deleteChat = useCallback((chatId) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  }, [currentChatId]);

  const clearAllChats = useCallback(() => {
    setChats([]);
    setCurrentChatId(null);
    setMessages([]);
    setError(null);
    localStorage.removeItem('ai-chat-app-chats');
  }, []);

  return {
    // Current chat state
    messages,
    sendMessage,
    isLoading,
    error,
    
    // Chat management
    chats,
    currentChatId,
    newChat,
    loadChat,
    deleteChat,
    clearAllChats,
  };
}