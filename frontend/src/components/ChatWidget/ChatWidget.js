import React, { useState, useEffect, useRef } from 'react';
import './ChatWidgetStyles.css';

const ChatWidget = ({ widgetId, position = 'right', color = '#3B82F6', welcomeMessage = 'Hello! How can I help you today?' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Add welcome message when widget is first opened
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          content: welcomeMessage,
          isFromUser: false,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length, welcomeMessage]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      content: newMessage,
      isFromUser: true,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate AI response
    simulateResponse(newMessage);
  };

  const simulateResponse = (userMessage) => {
    setIsTyping(true);
    
    // Simulate API delay
    setTimeout(() => {
      const aiMessage = {
        id: `ai-${Date.now()}`,
        content: getAIResponse(userMessage),
        isFromUser: false,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userMessage) => {
    // This is a placeholder. In a real implementation, this would call the backend API
    const responses = [
      "Thank you for your message. How can I assist you further?",
      "I understand. Is there anything specific you'd like to know?",
      "That's interesting! Let me help you with that.",
      "I'm here to help. Could you provide more details?",
      "Thanks for sharing. Is there anything else you'd like to discuss?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`chatly-widget ${position}`} style={{ '--primary-color': color }}>
      {isOpen ? (
        <div className="chatly-widget-container">
          <div className="chatly-widget-header">
            <h3>Chatly Support</h3>
            <button onClick={toggleWidget} className="chatly-close-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="chatly-messages-container">
            {messages.map((message) => (
              <div key={message.id} className={`chatly-message ${message.isFromUser ? 'user' : 'ai'}`}>
                <div className="chatly-message-content">{message.content}</div>
                <div className="chatly-message-time">{formatTime(message.timestamp)}</div>
              </div>
            ))}
            {isTyping && (
              <div className="chatly-message ai">
                <div className="chatly-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="chatly-input-container">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="chatly-input"
            />
            <button type="submit" className="chatly-send-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      ) : (
        <button onClick={toggleWidget} className="chatly-widget-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.5 20 9.06 19.75 7.74 19.28L3 20L4.5 15.97C3.56 14.9 3 13.5 3 12C3 7.582 7.03 4 12 4C16.97 4 21 7.582 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatWidget; 