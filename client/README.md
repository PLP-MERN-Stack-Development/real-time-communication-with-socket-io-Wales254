# Real-Time Chat Application with Socket.io

A fully-featured real-time chat application built with React, Node.js, Express, and Socket.io. Features include multiple chat rooms, private messaging, typing indicators, message reactions, and real-time notifications.

## 🚀 Features Implemented

### Core Chat Functionality
- ✅ **User Authentication**: JWT-based authentication system
- ✅ **Global Chat Rooms**: Three predefined rooms (General, Random, Tech Talk)
- ✅ **Real-time Messaging**: Instant message delivery and receipt
- ✅ **Online/Offline Status**: Live user presence tracking
- ✅ **Typing Indicators**: Shows when users are composing messages

### Advanced Features
- ✅ **Private Messaging**: Direct messages between users
- ✅ **Multiple Chat Rooms**: Users can join/leave different channels
- ✅ **Message Reactions**: React to messages with emojis (👍, ❤️, 😂)
- ✅ **Read Receipts**: Track message delivery status
- ✅ **Message Search**: Search through conversation history
- ✅ **Unread Message Count**: Badge indicators for unread messages

### Real-Time Notifications
- ✅ **In-App Notifications**: Toast notifications for new messages
- ✅ **Browser Notifications**: Native OS notifications (requires permission)
- ✅ **Sound Alerts**: Audio notification for new messages
- ✅ **User Join/Leave Notifications**: Alerts when users enter/exit rooms
- ✅ **Unread Badges**: Visual indicators for unread messages

### Performance & UX
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile
- ✅ **Auto-scroll**: Automatically scrolls to latest messages
- ✅ **Reconnection Logic**: Handles connection drops gracefully
- ✅ **Message Pagination**: Loads last 50 messages per room
- ✅ **Optimized Socket.io**: Uses rooms and namespaces efficiently
- ✅ **Delivery Acknowledgment**: Confirms message delivery

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🛠️ Setup Instructions

### Server Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```env
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
CLIENT_URL=http://localhost:5173
```

4. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

### Client Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create Vite configuration file (`vite.config.js`):
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

4. Create Tailwind CSS configuration (`tailwind.config.js`):
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

5. Create `postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

6. Create `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

7. Create `src/main.jsx`:
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

8. Create `index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Chat App - Real-time Communication</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

9. Start the development server:
```bash
npm run dev
```

The client will start on `http://localhost:5173`

## 📱 Usage Guide

### Getting Started

1. Open `http://localhost:5173` in your browser
2. Enter a username to join the chat
3. You'll be automatically connected to the "General" room

### Using Chat Rooms

- Click on room names in the sidebar to switch between rooms
- Three default rooms are available: General, Random, and Tech Talk
- Unread message counts appear as badges next to room names

### Private Messaging

1. Click "Online Users" in the sidebar to expand the user list
2. Click on any online user (except yourself) to start a private chat
3. Private messages are end-to-end between you and the selected user

### Message Features

- **Send Messages**: Type in the input box and press Enter or click Send
- **Reactions**: Click emoji buttons below others' messages (👍, ❤️, 😂)
- **Search**: Use the search bar to filter messages by content or username
- **Typing Indicator**: Shows when other users are typing

### Notifications

- **In-App**: Toast notifications appear in the top-right corner
- **Browser**: Enable browser notifications when prompted for OS-level alerts
- **Sound**: Audio plays for new messages (can be muted by browser settings)

## 🏗️ Architecture

### Server Architecture

```
server/
├── index.js          # Main server file with Socket.io configuration
└── package.json      # Server dependencies
```

**Key Components:**
- Express server for HTTP endpoints
- Socket.io server for WebSocket connections
- JWT authentication middleware
- In-memory data stores (users, messages, rooms, private messages)

### Client Architecture

```
client/
├── src/
│   ├── App.jsx       # Main React component
│   ├── main.jsx      # React entry point
│   └── index.css     # Tailwind CSS imports
├── index.html        # HTML template
├── package.json      # Client dependencies
├── vite.config.js    # Vite configuration
├── tailwind.config.js # Tailwind configuration
└── postcss.config.js  # PostCSS configuration
```

## 🔧 Technical Details

### Socket.io Events

**Client → Server:**
- `send_message`: Send message to room
- `send_private_message`: Send private message to user
- `typing_start`: Notify typing started
- `typing_stop`: Notify typing stopped
- `join_room`: Join a chat room
- `leave_room`: Leave a chat room
- `add_reaction`: Add reaction to message
- `mark_as_read`: Mark message as read
- `get_private_messages`: Fetch private message history

**Server → Client:**
- `initial_data`: Initial rooms and users data
- `new_message`: New message in room
- `private_message`: New private message received
- `private_message_sent`: Confirmation of sent private message
- `user_status`: User online/offline status change
- `user_typing`: Typing indicator update
- `message_reaction`: New reaction added to message
- `message_read`: Message read receipt
- `user_joined_room`: User joined a room
- `user_left_room`: User left a room

### Data Structures

**Message Object:**
```javascript
{
  id: string,
  roomId: string,
  userId: string,
  username: string,
  message: string,
  timestamp: ISO string,
  reactions: [{ userId, username, reaction }]
}
```

**User Object:**
```javascript
{
  id: string,
  username: string,
  socketId: string,
  online: boolean,
  lastSeen: Date
}
```

## 🚀 Deployment

### Deploy Server (Render/Railway/Heroku)

1. Push your code to GitHub
2. Connect your repository to your deployment platform
3. Set environment variables:
   - `PORT`: Automatically set by platform
   - `JWT_SECRET`: Your secure secret key
   - `CLIENT_URL`: Your deployed client URL
4. Deploy the server directory

### Deploy Client (Vercel/Netlify)

1. Build the client:
```bash
cd client
npm run build
```

2. Deploy the `dist` folder to your platform
3. Update the `SOCKET_URL` in `App.jsx` to point to your deployed server

**Important:** Update CORS settings on the server to allow your deployed client domain.

## 🔒 Security Considerations

- JWT tokens expire after 7 days
- CORS is configured to allow specific origins
- Socket.io connections require valid JWT tokens
- In production, use HTTPS/WSS for encrypted connections
- Store JWT_SECRET in environment variables, never in code
- Implement rate limiting for production use
- Add input validation and sanitization

## 🐛 Troubleshooting

### Connection Issues

**Problem:** Client can't connect to server

**Solutions:**
- Verify server is running on the correct port
- Check CORS configuration matches client URL
- Ensure firewall isn't blocking WebSocket connections
- Check browser console for error messages

### Messages Not Appearing

**Problem:** Messages sent but not showing

**Solutions:**
- Check browser console for Socket.io errors
- Verify JWT token is valid
- Ensure user joined the correct room
- Check server logs for errors

### Notification Issues

**Problem:** Browser notifications not working

**Solutions:**
- Allow notifications in browser settings
- Check if Notification.permission is 'granted'
- Test with in-app notifications first
- Some browsers require HTTPS for notifications

## 📝 Future Enhancements

- [ ] Message editing and deletion
- [ ] File and image upload support
- [ ] Voice and video calling
- [ ] User profiles with avatars
- [ ] Message threading
- [ ] Group chat creation
- [ ] End-to-end encryption
- [ ] Message persistence with database
- [ ] User authentication with OAuth
- [ ] Admin moderation tools
- [ ] Custom emoji reactions
- [ ] Message formatting (bold, italic, code)
- [ ] Link previews
- [ ] GIF integration

## 📄 License

This project is created for educational purposes as part of Week 5 assignment.

## 👥 Contributing

This is an assignment project. For questions or issues, please contact your instructor.

## 🙏 Acknowledgments

- Socket.io documentation and examples
- React and Vite communities
- Tailwind CSS for styling utilities
- Lucide React for beautiful icons