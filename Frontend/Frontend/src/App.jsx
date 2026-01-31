import React, { useState, useRef, useEffect } from 'react'
import { io } from "socket.io-client"
import './App.css'

function timeNow() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function App() {
  const [socket, setSocket] = useState(null)
  const [conversation, setConversation] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Welcome! to the chat. Ask me anything.',
      time: timeNow()
    }
  ])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const endRef = useRef(null)

  // Auto scroll on new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  // Socket connection
  useEffect(() => {
    const socketInstance = io("http://localhost:3000")
    setSocket(socketInstance)

    socketInstance.on('ai-message-response', (data) => {
      const botMessage = {
        id: Date.now(),
        sender: 'bot',
        text: data.response, // ✅ FIXED HERE
        time: timeNow()
      }

      setConversation(prev => [...prev, botMessage])
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const sendMessage = () => {
    const message = input.trim()
    if (!message || !socket) return

    setConversation(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: message,
        time: timeNow()
      }
    ])

    socket.emit('ai-message', message)
    setInput('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="app">
      <header className="app-header">Chat</header>

      <main className="chat-card">
        <section className="messages">
          {conversation.map((m) => (
            <div key={m.id} className={`message ${m.sender}`}>
              <div className="bubble">
                <div className="text">{m.text}</div>
                <div className="meta">{m.time}</div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </section>

        <form
          className="composer"
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
        >
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="send-button"
            type="submit"
            disabled={!input.trim()}
          >
            ➤
          </button>
        </form>
      </main>
    </div>
  )
}

export default App
