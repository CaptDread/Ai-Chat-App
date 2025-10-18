"use client"
import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [isRotated, setIsRotated] = useState(false); 
  const { messages, sendMessage, isLoading, error, clearChat } = useChat();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    await sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  const handleWindowSize = (e) => {
    e.preventDefault();
    setIsRotated(!isRotated);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-700 rounded-lg shadow-lg h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {/* <div>
          <h2 className="text-2xl font-bold text-gray-800">DeepSeek AI Chat</h2>
          <p className="text-gray-600 text-sm">Powered by OpenRouter</p>
        </div> */}
      </div>

      {/* Messages Container */}
      <div className={`overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg bg-gray-600 transition-all duration-400 ease-in-out ${isRotated ? 'h-full' : "h-4/6"}`}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">🤖</div>
            <p>Welcome! Start a conversation with Z-AI.</p>
            <p className="text-xl sm:text-sm mt-2">Ask anything - the model is completely free!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-100 border border-blue-200 ml-8'
                  : message.role === 'error'
                  ? 'bg-red-100 border border-red-200'
                  : 'bg-green-100 border border-green-200 mr-8'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-xs text-gray-500">
                  {message.role === 'user' 
                    ? 'You' 
                    : message.role === 'error'
                    ? 'Error'
                    : 'Z~Ai'
                  }
                </div>
                {message.timestamp && (
                  <div className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                )}
              </div>
              <div className="text-gray-700 whitespace-pre-wrap text-xl sm:text-sm">
                {message.content}
              </div>
              {message.model && message.role === 'assistant' && (
                <div className="text-xs text-gray-500 mt-2">
                  Model: {message.model}
                </div>
              )}
            </div>
          ))
        )}

        {/* Toggle Expansion/Shrink*/}
        {(
          <div className={`absolute justify-self-end transition-all duration-400 ease-in-out ${isRotated ? 'bottom-40' : 'bottom-80 sm:bottom-60'}`}>
            <button
            onClick={handleWindowSize}
            className="px-2 py-1 justify-self-center self-center bg-gray-500 opacity-20 text-white rounded-lg text-sm hover:opacity-50 transition-opacity flex flex-col justify-center"
            >
            <p className={`expand_btn-top-arrow transition-transform duration-300 ease-in-out ${isRotated ? 'rotate-180' : ''}`}>🡤</p>
            <p className={`expand_btn-top-arrow transition-transform duration-300 ease-in-out ${isRotated ? 'rotate-180' : ''}`}>🡦</p>
            </button>
          </div>
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

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className={`gap-6 grid grid-cols-6 transition-all duration-200 ease-in-out ${isRotated ? 'h-0 opacity-0' : 'h-1/4 opacity-100'}`}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
          className={`text-wrap flex-1 p-3 border border-gray-300 rounded-lg col-span-5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-100 text-xl sm:text-sm transition-all duration-200 ease-in-out ${isRotated ? 'h-0' : 'h-full'}`}
          disabled={isLoading}
          rows={3}
        />
        <div className={`flex flex-col justify-between w-3/4 transition-all duration-200 ease-in-out ${isRotated ? 'h-0' : 'h-full'}`}>
            <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="min-w-full h-1/3 p-3 justify-self-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors self-center justify-self-center"
            >
            {isLoading ? (
                <div className="flex items-center self-center justify-self-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin self-center justify-self-center"></div>
                </div>
            ) : (
                'Send'
            )}
            </button>
            <button
            onClick={clearChat}
            className="min-w-full h-fit p-3 justify-self-center self-center bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
            Clear Chat
            </button>
        </div>
      </form>

      {/* Footer Info */}
      <div className="mt-4 text-center text-xs text-gray-100">
        <p>Using z-ai/glm-4.5-air:fre via OpenRouter</p>
      </div>
    </div>
  );
}