'use client';
import { useEffect, useState } from 'react';
import { ref, onChildAdded, push, set, get } from "firebase/database";
import { realtimedb } from '@/Firebase/firebaseConfig';
import { useMyContext } from '@/context/ContextProvider';
import ChatMessages from '@/components/chatSystemComponents/ChatMessages';
import ChatInput from '@/components/chatSystemComponents/ChatInput';

interface PrivateChatProps {
  otherUserId: string;
}

interface Message {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

const PrivateChat: React.FC<PrivateChatProps> = ({ otherUserId }) => {
  const { user: currentUser } = useMyContext();
  console.log("Current user from context:", currentUser);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("useEffect triggered. Current user:", currentUser);
    
    if (!currentUser || !currentUser._id) {
      console.log("Current user is not available or doesn't have _id");
      setError("Current user is not available. Please make sure you're logged in.");
      return;
    }

    console.log("Generating chat ID for users:", currentUser._id, otherUserId);
    const newChatId = [currentUser._id, otherUserId].sort().join("_");
    console.log("Generated chat ID:", newChatId);
    setChatId(newChatId);

    const chatRef = ref(realtimedb, `chats/${newChatId}`);
    console.log("Chat reference:", chatRef.toString());

    // Fetch existing messages
    get(chatRef).then((snapshot) => {
      if (snapshot.exists()) {
        const chatData = snapshot.val();
        console.log("Fetched chat data:", chatData);
        const messagesArray = Object.values(chatData.messages || {}) as Message[];
        setMessages(messagesArray.sort((a, b) => a.timestamp - b.timestamp));
      } else {
        console.log("No existing messages found");
      }
    }).catch((error) => {
      console.error("Error fetching existing messages:", error);
      setError("Failed to fetch messages. Please try again later.");
    });

    // Listen for new messages
    const messagesRef = ref(realtimedb, `chats/${newChatId}/messages`);
    const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
      const newMessage = snapshot.val() as Message;
      if (newMessage) {
        console.log("New message received:", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage].sort((a, b) => a.timestamp - b.timestamp));
      }
    });

    return () => {
      console.log("Unsubscribing from messages listener");
      unsubscribe();
    };
  }, [currentUser, otherUserId]);

  const handleSendMessage = async (messageText: string) => {
    console.log("Attempting to send message. Chat ID:", chatId, "Current user:", currentUser);
    
    if (!chatId || !currentUser || !currentUser._id) {
      console.log("Unable to send message. Missing chat ID or current user data");
      setError("Unable to send message. Please make sure you're logged in.");
      return;
    }

    const messageRef = ref(realtimedb, `chats/${chatId}/messages`);

    try {
      const newMessage: Message = {
        senderId: currentUser._id,
        senderName: currentUser.firstName || 'Unknown User',
        text: messageText,
        timestamp: Date.now(),
      };

      const newMessageRef = push(messageRef);
      await set(newMessageRef, newMessage);

      console.log('Message sent successfully:', newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      setError("Failed to send message. Please try again.");
    }
  };

  console.log("Rendering PrivateChat. Current user:", currentUser, "Error:", error);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!currentUser || !currentUser._id) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat with User {otherUserId}</h1>
      <ChatMessages messages={messages} currentUserId={currentUser._id} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default PrivateChat;