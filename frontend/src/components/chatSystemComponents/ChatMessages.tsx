import React from 'react';

interface Message {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, currentUserId }) => {
  return (
    <div className="mb-4">
      {messages.map((msg, index) => (
        <div key={index} className={`p-2 my-2 rounded ${msg.senderId === currentUserId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
          <strong>{msg.senderName}:</strong> {msg.text}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
