import { useState, useRef, useEffect } from "react"
import "./chatbot.css"

const QUICK_SUGGESTIONS = [
  "How do I book a reservation?",
  "What are your cancellation policies?",
  "Check available dates",
  "Contact support"
]

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi there! 👋 I'm your Booking Assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [loading, setLoading] = useState(false)
  
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSendMessage = async (textToSend) => {
    const trimmedQuestion = (textToSend || question).trim()

    if (!trimmedQuestion || loading) {
      return
    }

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Add user's message to the chat
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        sender: "user",
        text: trimmedQuestion,
        time: currentTime
      }
    ])

    setQuestion("")

    // Handle greetings locally without backend call
    const lowerQuestion = trimmedQuestion.toLowerCase()
    if (
      lowerQuestion === "hi" ||
      lowerQuestion === "hello" ||
      lowerQuestion === "hey" ||
      lowerQuestion === "hi there" ||
      lowerQuestion === "hello there"
    ) {
      setTimeout(() => {
        setMessages((previousMessages) => [
          ...previousMessages,
          {
            sender: "bot",
            text: "Hello! 👋 How can I assist you with your booking today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ])
      }, 400)
      return
    }

    try {
      setLoading(true)

      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: trimmedQuestion
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "bot",
          text: data.answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } catch (error) {
      console.error("Chatbot error:", error)

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "bot",
          text: "Sorry, I couldn't process your request right now. Please try again later.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Chat cleared. How else can I assist you with your booking?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      <div className={`chatbot-box ${isOpen ? "open" : "closed"}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar-container">
              <div className="chatbot-avatar">🤖</div>
              <span className="status-dot"></span>
            </div>
            <div>
              <h3>Booking Assistant</h3>
              <span className="chatbot-status">Online • Ready to help</span>
            </div>
          </div>
          <div className="chatbot-header-actions">
            <button 
              className="action-btn" 
              onClick={clearChat} 
              title="Clear Conversation"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
            <button 
              className="action-btn close-btn" 
              onClick={() => setIsOpen(false)}
              title="Close Chat"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body / Messages */}
        <div className="chatbot-body">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-row ${message.sender === "user" ? "user-row" : "bot-row"}`}
            >
              {message.sender === "bot" && (
                <div className="message-avatar">🤖</div>
              )}
              <div className={`message-bubble ${message.sender === "user" ? "user-message" : "bot-message"}`}>
                <p>{message.text}</p>
                <span className="message-time">{message.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="message-row bot-row">
              <div className="message-avatar">🤖</div>
              <div className="message-bubble bot-message typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length <= 2 && !loading && (
          <div className="chatbot-suggestions">
            {QUICK_SUGGESTIONS.map((suggestion, idx) => (
              <button 
                key={idx} 
                className="suggestion-chip"
                onClick={() => handleSendMessage(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="chatbot-footer">
          <input
            type="text"
            className="chatbot-input"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your booking query..."
            disabled={loading}
          />
          <button
            className={`send-btn ${!question.trim() || loading ? "disabled" : ""}`}
            onClick={() => handleSendMessage()}
            disabled={!question.trim() || loading}
            title="Send Message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>

      {/* Launcher Button */}
      <button
        className={`chatbot-launcher ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
      >
        {isOpen ? (
          <span className="launcher-icon">✕</span>
        ) : (
          <>
            <span className="launcher-icon">💬</span>
            <span className="notification-badge">1</span>
          </>
        )}
      </button>
    </div>
  )
}

export default Chatbot