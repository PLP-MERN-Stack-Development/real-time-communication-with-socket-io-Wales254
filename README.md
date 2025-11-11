# Real-Time Chat Application with Socket.io

## 🚀 Project Overview
This project is a **real-time chat application** built using **Node.js, Express, React, and Socket.io**. The application demonstrates **bidirectional communication** between clients and server, allowing users to send and receive messages instantly, receive notifications, and see online/offline status.  

The project includes **advanced chat features** such as private messaging, multiple chat rooms, typing indicators, file sharing, and real-time notifications.

---

## 📂 Features

### **Core Chat Functionality**
- User authentication (username-based)
- Global chat room for all users
- Display messages with sender name and timestamp
- Typing indicators when a user is composing a message
- Online/offline status for users

### **Advanced Features**
- Private messaging between users
- Multiple chat rooms or channels
- File/image sharing
- Message reactions (like, love, etc.)
- Read receipts for messages

### **Real-Time Notifications**
- Notify users of new messages
- Notify when a user joins or leaves a chat room
- Display unread message count
- Sound and browser notifications

### **Performance and UX Optimization**
- Message pagination for older messages
- Reconnection logic for handling disconnections
- Optimized Socket.io using namespaces and rooms
- Message delivery acknowledgment
- Message search functionality
- Responsive design for desktop and mobile devices

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express, Socket.io
- **Frontend:** React.js, Socket.io-client
- **Database:** (If applicable: MongoDB, PostgreSQL, etc.)
- **Deployment:** Optional - Render, Railway, Vercel, Netlify, or GitHub Pages

---

## 🧩 Project Structure
```

server/       # Node.js + Express + Socket.io backend
client/       # React.js frontend
README.md     # Project documentation

````

---

## ⚡ Setup Instructions

### **Prerequisites**
- Node.js v18+
- npm (Node package manager)

### **Clone the Repository**
```bash
git clone <https://github.com/PLP-MERN-Stack-Development/real-time-communication-with-socket-io-Wales254.git>
cd <real-time-communication-with-socket-io-Wales254.git>
````

### **Server Setup**

```bash
cd server
npm install
npm run dev
```

Server will start on `http://localhost:5000` 

### **Client Setup**

```bash
cd client
npm install
npm run dev
```

Client will start on `http://localhost:5173`

---

## 🌐 Deployment

* **Server:** Deployed on [Railway](scintillating-commitment-production.up.railway.app)
* **Client:** Deployed on [Vercel](https://socket-io-cwlw.vercel.app/)



---

## 💾 How to Use

1. Open the client app in your browser.
2. Enter a **username** to join the chat.
3. Start chatting in the **global room** or join a **private room**.
4. See **typing indicators**, **online status**, and **notifications**.
5. Share files, react to messages, or search through past messages.

---

## 📌 Notes / Recommendations

* Ensure the **server is running** before starting the client.
* For development, both **server and client** must run simultaneously.
* Optimize your **network connection** for real-time updates.
* Regularly commit changes to show progress.

---

## ✅ Submission Checklist

* [ ] Complete client and server code
* [ ] README.md with project overview, setup instructions, features, screenshots
* [ ] Optional: deployed URLs added
* [ ] Regular commits to GitHub Classroom repository

---

## 📚 References

* [Socket.io Documentation](https://socket.io/docs/)
* [React.js Documentation](https://reactjs.org/docs/getting-started.html)
* [Express.js Documentation](https://expressjs.com)
