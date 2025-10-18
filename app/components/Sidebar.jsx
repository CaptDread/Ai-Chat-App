import { useState } from 'react';

export default function Sidebar({ 
  chats, 
  currentChatId, 
  onNewChat, 
  onLoadChat, 
  onDeleteChat 
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className={`bg-gray-600 border-r border-gray-200 transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-64'
    } h-full flex flex-col`}>
      
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-gray-200 transition-colors text-2xl"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? '=' : 'x'}
          </button>
        </div>
        
        {!isCollapsed && (
          <button
            onClick={onNewChat}
            className="w-full mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <span>+</span>
            <span>New Chat</span>
          </button>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {!isCollapsed && chats.length === 0 && (
          <div className="text-center text-gray-500 text-sm p-4">
            No chats yet. Start a new conversation!
          </div>
        )}
        
        {!isCollapsed && chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
              currentChatId === chat.id
                ? 'text-gray-500 animated-border'
                : 'bg-gray-600 hover:bg-gray-400'
            }`}
            onClick={() => onLoadChat(chat.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {chat.title}
                </div>
                <div className={`text-xs mt-1 ${
                  currentChatId === chat.id ? 'text-blue-300' : 'text-gray-500'
                }`}>
                  {new Date(chat.lastUpdated).toLocaleDateString()}
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className={`ml-2 p-1 rounded text-xs ${
                  currentChatId === chat.id
                    ? 'hover:bg-blue-600'
                    : 'hover:bg-gray-300'
                }`}
                title="Delete chat"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            {chats.length} chat{chats.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}