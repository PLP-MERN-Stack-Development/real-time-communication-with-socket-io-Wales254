import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageSquare } from 'lucide-react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default function ChatApp() {
  // ===== State =====
  const [socket, setSocket] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [rooms, setRooms] = useState(['general', 'random', 'tech']);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [messages, setMessages] = useState({});
  const [inputMessage, setInputMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [privateChats, setPrivateChats] = useState({});
  const [currentPrivateChat, setCurrentPrivateChat] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentRoom, currentPrivateChat]);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  // ===== Authentication =====
  const handleLogin = async () => {
    if (!username.trim()) return;
    setCurrentUser({ username });
    setIsAuthenticated(true);
    initializeSocket(username);
  };

  // ===== Socket Initialization =====
  const initializeSocket = (username) => {
    const newSocket = io(SOCKET_URL, { auth: { username } });
    setSocket(newSocket);

    newSocket.on('connect', () => console.log('Connected to server'));

    newSocket.on('new_message', handleIncomingMessage);
    newSocket.on('private_message', handlePrivateMessage);
    newSocket.on('user_typing', handleUserTyping);
    newSocket.on('disconnect', () => console.log('Disconnected from server'));
  };

  // ===== Socket Handlers =====
  const handleIncomingMessage = (message) => {
    setMessages((prev) => ({
      ...prev,
      [message.roomId]: [...(prev[message.roomId] || []), message],
    }));
    scrollToBottom();
  };

  const handlePrivateMessage = (message) => {
    const chatKey = message.sender;
    setPrivateChats((prev) => ({
      ...prev,
      [chatKey]: [...(prev[chatKey] || []), message],
    }));
    scrollToBottom();
  };

  const handleUserTyping = ({ room, user, typing }) => {
    setTypingUsers((prev) => ({ ...prev, [room + '_' + user]: typing ? user : null }));
    setTimeout(() => {
      setTypingUsers((prev) => {
        const updated = { ...prev };
        delete updated[room + '_' + user];
        return updated;
      });
    }, 3000);
  };

  // ===== Messaging =====
  const sendMessage = () => {
    if (!inputMessage.trim() || !socket) return;

    const payload = { message: inputMessage.trim() };
    if (currentPrivateChat) payload.to = currentPrivateChat;
    else payload.room = currentRoom;

    const event = currentPrivateChat ? 'privateMessage' : 'sendMessage';
    socket.emit(event, payload);
    setInputMessage('');
  };

  const handleTyping = (value) => {
    setInputMessage(value);
    if (!socket || currentPrivateChat) return;

    socket.emit('typing', { room: currentRoom, typing: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { room: currentRoom, typing: false });
    }, 2000);
  };

  const switchRoom = (room) => {
    setCurrentRoom(room);
    setCurrentPrivateChat(null);
  };

  const startPrivateChat = (user) => {
    setCurrentPrivateChat(user);
    setCurrentRoom(null);
  };

  const getCurrentMessages = () =>
    currentPrivateChat ? privateChats[currentPrivateChat] || [] : messages[currentRoom] || [];

  const typingIndicator = () => {
    if (currentPrivateChat) return null;
    const typing = Object.entries(typingUsers)
      .filter(([key, val]) => key.startsWith(currentRoom + '_') && val)
      .map(([_, val]) => val);
    if (!typing.length) return null;
    return typing.join(', ') + ' is typing...';
  };

  // ===== UI =====
  if (!isAuthenticated)
    return <LoginScreen username={username} setUsername={setUsername} handleLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        rooms={rooms}
        switchRoom={switchRoom}
        currentRoom={currentRoom}
        onlineUsers={onlineUsers}
        startPrivateChat={startPrivateChat}
      />
      <ChatWindow
        messages={getCurrentMessages()}
        inputMessage={inputMessage}
        handleTyping={handleTyping}
        handleKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        sendMessage={sendMessage}
        messagesEndRef={messagesEndRef}
        typingIndicator={typingIndicator()}
      />
    </div>
  );
}

// ===== Sidebar =====
const Sidebar = ({ rooms, switchRoom, currentRoom, onlineUsers, startPrivateChat }) => (
  <div className="w-64 bg-indigo-200 p-4 flex flex-col">
    <h2 className="font-bold mb-4 text-lg">Rooms</h2>
    {rooms.map((room) => (
      <button
        key={room}
        onClick={() => switchRoom(room)}
        className={`mb-2 p-2 rounded ${
          currentRoom === room ? 'bg-indigo-500 text-white' : 'bg-indigo-400'
        }`}
      >
        {room}
      </button>
    ))}
    <h2 className="font-bold mt-6 mb-2 text-lg">Online Users</h2>
    {onlineUsers.length === 0 && <p>No users online</p>}
    {onlineUsers.map((user) => (
      <button
        key={user.username}
        onClick={() => startPrivateChat(user.username)}
        className="mb-2 p-2 bg-indigo-400 rounded w-full text-left"
      >
        {user.username}
      </button>
    ))}
  </div>
);

// ===== Chat Window =====
const ChatWindow = ({ messages, inputMessage, handleTyping, handleKeyPress, sendMessage, messagesEndRef, typingIndicator }) => (
  <div className="flex-1 flex flex-col p-4 bg-white">
    <div className="flex-1 overflow-y-auto mb-4">
      {messages.length === 0 && <p className="text-gray-400">No messages yet</p>}
      {messages.map((msg) => (
        <div key={msg.id} className="mb-2">
          <strong>{msg.user || msg.from}:</strong> {msg.text}
          {msg.timestamp && <span className="text-gray-400 text-xs ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>}
        </div>
      ))}
      {typingIndicator && <p className="text-gray-500 italic">{typingIndicator}</p>}
      <div ref={messagesEndRef}></div>
    </div>
    <div className="flex">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => handleTyping(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 border rounded p-2 mr-2"
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} className="bg-indigo-500 text-white px-4 rounded">
        Send
      </button>
    </div>
  </div>
);

// ===== Login Screen =====
const LoginScreen = ({ username, setUsername, handleLogin }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black flex items-center justify-center p-4">
    <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <MessageSquare className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white">Chat App</h1>
        <p className="text-indigo-200 mt-2">Connect. Chat. Share moments.</p>
      </div>
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Enter your username..."
          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <button
          onClick={handleLogin}
          className="w-full mt-5 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-lg"
        >
          Join Chat
        </button>
      </div>
    </div>
  </div>
);
