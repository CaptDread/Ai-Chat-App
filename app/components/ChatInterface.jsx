'use client';
import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import Sidebar from './Sidebar';


export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [isRotated, setIsRotated] = useState(false);
  const messagesEndRef = useRef(null);
  
  const {
    messages,
    sendMessage,
    isLoading,
    error,
    chats,
    currentChatId,
    newChat,
    loadChat,
    deleteChat,
    clearAllChats,
  } = useChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    let inputText = input;
    setInput('');
    await sendMessage(inputText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleWindowSize = () => {
    setIsRotated(!isRotated);
    // Add your existing window resize logic here
  };

  return (
    <div className="h-screen fixed flex bg-gray-800">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={newChat}
        onLoadChat={loadChat}
        onDeleteChat={deleteChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className={`border-b border-gray-200 p-4 bg-gray-800 flex justify-between items-center transition-all duration-300 ease-in-out text-base sm:text-2xl ${isRotated ? 'h-4' : 'h-16'}`}>
          <h1 className={`text-xl font-semibold text-gray-300 font-michroma`}>
            {currentChatId ? 'Chat With Z-Ai' : 'New Chat'}
          </h1>
          <div className="flex items-center gap-4">
            {chats.length > 0 && (
              <button
                onClick={clearAllChats}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Messages Container */}
        <div className={`flex-1 overflow-y-auto p-4 bg-gray-500 transition-all duration-400 ease-in-out ${isRotated ? 'h-full' : 'h-72'}`}>
          {messages.length === 0 ? (
            <div className="text-center text-gray-200 py-8 font-michroma">
              <div className="text-2xl sm:text-4xl mb-2">🤖</div>
              <p>Start a new conversation with Z-AI!</p>
              <p className="text-sm mt-2">Type your first message below.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-100 ml-8'
                    : message.role === 'error'
                    ? 'bg-red-100'
                    : `bg-purple-200 mr-8 border-2 animated-border font-michroma`
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-xs sm:text-sm text-gray-400">
                    {message.role === 'user' 
                      ? 'You' 
                      : message.role === 'error'
                      ? 'Error'
                      : 'AI Assistant'
                    }
                  </div>
                  {message.timestamp && (
                    <div className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  )}
                </div>
                
                <div className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base">
                  {message.content}
                </div>
                
                {/* Copy Button - Only show for AI messages */}
                {message.role === 'assistant' && (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(message.content);
                          // You could add a temporary "Copied!" state here if needed
                        } catch (err) {
                          console.error('Failed to copy: ', err);
                        }
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      title="Copy to clipboard"
                    >
                      <span>📋</span>
                      <span>Copy</span>
                    </button>
                  </div>
                )}
                
                {message.model && message.role === 'assistant' && (
                  <div className="text-xs text-gray-500 mt-2">
                    Model: {message.model}
                  </div>
                )}
              </div>
            ))
          )}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="ml-2">AI is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Your existing expand/shrink button */}
        <div className='relative'>
          <button
            onClick={handleWindowSize}
            className="absolute right-5 justify-self-end self-end px-2 py-1 bg-gray-600 opacity-20 rounded-lg text-base text-gray-300 hover:opacity-50 transition-opacity flex flex-col justify-center"
          >
            <p className={`expand_btn-top-arrow transition-transform duration-500 ease-in-out ${isRotated ? 'rotate-180' : '-rotate-45'}`}>&#11014;</p>
            <p className={`expand_btn-top-arrow transition-transform duration-500 ease-in-out ${isRotated ? 'rotate-180' : '-rotate-45'}`}>&#11015;</p>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Input Area */}
        <div className={`border-t border-gray-200 px-4 bg-gray-800 transition-all duration-300 ease-in-out ${isRotated ? 'h-0 opacity-0 py-0' : 'py-4 h-32 opacity-100'}`}>
          <div className="gap-2 grid grid-cols-7">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
              className={`flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-200 ease-in-out col-span-5 text-base sm:text-sm ${isRotated ? 'h-0' : 'h-24'}`}
              disabled={isLoading}
              rows={3}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              onClick={handleSendMessage}
              className={`px-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors self-end font-michroma w-fit text-sm sm:text-base ${isRotated ? 'py-0' : 'py-3'}`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-2 text-center text-xs text-gray-500 bg-gray-800 border-t">
          <p>Using z-ai/glm-4.5-air via OpenRouter • Free tier</p>
        </div>
      </div>
    </div>
  );
}