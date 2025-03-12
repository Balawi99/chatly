/**
 * Chatly Widget Embed Script
 * This script loads and initializes the Chatly chat widget on your website.
 */
(function() {
  // Configuration
  let config = {
    widgetId: null,
    position: 'right',
    color: '#3B82F6',
    welcomeMessage: 'Hello! How can I help you today?'
  };

  // API endpoint - use absolute URL to avoid CORS issues
  const API_URL = 'https://backend-kl3qplmvj-ibras-projects-1d6e8dd6.vercel.app/api';
  
  // CSS URL - use absolute URL to avoid CORS issues
  const CSS_URL = 'https://back-ihd7klbr6-ibras-projects-1d6e8dd6.vercel.app/widget.css';

  // Widget container
  let widgetContainer = null;
  
  // Debug mode
  const DEBUG = false;
  
  // Logger
  const log = (message, ...args) => {
    if (DEBUG) {
      console.log(`[Chatly Widget] ${message}`, ...args);
    }
  };

  // Initialize the widget
  window.chatly = function(action, options) {
    log('Action called:', action, options);
    
    if (action === 'init') {
      if (!options || !options.widgetId) {
        console.error('Chatly: widgetId is required for initialization');
        return;
      }
      
      config = { ...config, ...options };
      log('Initializing with config:', config);
      loadWidget();
    }
  };

  // Load widget styles
  function loadStyles() {
    log('Loading styles from:', CSS_URL);
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CSS_URL;
    
    // Add error handling for CSS loading
    link.onerror = () => {
      console.error('Chatly: Failed to load widget styles from', CSS_URL);
    };
    
    document.head.appendChild(link);
  }

  // Create widget container
  function createWidgetContainer() {
    log('Creating widget container');
    
    // Check if container already exists
    const existingContainer = document.getElementById('chatly-widget-container');
    if (existingContainer) {
      log('Widget container already exists, reusing it');
      return existingContainer;
    }
    
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'chatly-widget-container';
    document.body.appendChild(widgetContainer);
    return widgetContainer;
  }

  // Fetch widget configuration from API
  async function fetchWidgetConfig() {
    try {
      log('Fetching widget config for ID:', config.widgetId);
      
      const response = await fetch(`${API_URL}/widgets/public/${config.widgetId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch widget configuration: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      log('Received widget config:', data);
      
      if (data.success && data.data && data.data.widget) {
        // Update config with server values
        config = {
          ...config,
          position: data.data.widget.position || config.position,
          color: data.data.widget.color || config.color,
          welcomeMessage: data.data.widget.welcomeMessage || config.welcomeMessage
        };
        log('Updated config:', config);
      } else {
        log('Invalid widget config response:', data);
        // Use default config if server response is invalid
      }
    } catch (error) {
      console.error('Chatly: Error fetching widget configuration', error);
      // Continue with default config on error
    }
  }

  // Load the widget
  async function loadWidget() {
    try {
      log('Loading widget');
      
      // Load styles
      loadStyles();
      
      // Create widget container
      const container = createWidgetContainer();
      
      // Fetch widget configuration
      await fetchWidgetConfig();
      
      // Render widget button
      renderWidgetButton(container);
      
      log('Widget loaded successfully');
    } catch (error) {
      console.error('Chatly: Error loading widget', error);
    }
  }

  // Render the widget button
  function renderWidgetButton(container) {
    log('Rendering widget button');
    
    container.innerHTML = `
      <div class="chatly-widget ${config.position}" style="--primary-color: ${config.color}">
        <button class="chatly-widget-button" id="chatly-widget-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.5 20 9.06 19.75 7.74 19.28L3 20L4.5 15.97C3.56 14.9 3 13.5 3 12C3 7.582 7.03 4 12 4C16.97 4 21 7.582 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    `;
    
    // Add click event to button
    const button = document.getElementById('chatly-widget-button');
    if (button) {
      button.addEventListener('click', openChatWidget);
    } else {
      console.error('Chatly: Failed to find widget button element');
    }
  }

  // Open the chat widget
  function openChatWidget() {
    log('Opening chat widget');
    
    // Replace button with full widget
    widgetContainer.innerHTML = `
      <div class="chatly-widget ${config.position}" style="--primary-color: ${config.color}">
        <div class="chatly-widget-container">
          <div class="chatly-widget-header">
            <h3>Chatly Support</h3>
            <button id="chatly-close-button" class="chatly-close-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          <div class="chatly-messages-container" id="chatly-messages">
            <div class="chatly-message ai">
              <div class="chatly-message-content">${config.welcomeMessage}</div>
              <div class="chatly-message-time">${formatTime(new Date())}</div>
            </div>
          </div>
          <form id="chatly-message-form" class="chatly-input-container">
            <input
              type="text"
              placeholder="Type your message..."
              class="chatly-input"
              id="chatly-input"
            />
            <button type="submit" class="chatly-send-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    `;
    
    // Add event listeners
    const closeButton = document.getElementById('chatly-close-button');
    if (closeButton) {
      closeButton.addEventListener('click', closeChatWidget);
    }
    
    const messageForm = document.getElementById('chatly-message-form');
    if (messageForm) {
      messageForm.addEventListener('submit', handleMessageSubmit);
    }
    
    // Initialize conversation
    initConversation();
  }

  // Close the chat widget
  function closeChatWidget() {
    log('Closing chat widget');
    renderWidgetButton(widgetContainer);
  }

  // Initialize conversation
  async function initConversation() {
    try {
      log('Initializing conversation for widget:', config.widgetId);
      
      // Create a conversation on the server
      const response = await fetch(`${API_URL}/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          widgetId: config.widgetId,
          visitorId: generateVisitorId()
        }),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to initialize conversation: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      log('Conversation initialized:', data);
      
      if (data.success && data.data && data.data.conversation) {
        // Store conversation ID
        config.conversationId = data.data.conversation.id;
        log('Conversation ID stored:', config.conversationId);
      } else {
        log('Invalid conversation response:', data);
      }
    } catch (error) {
      console.error('Chatly: Error initializing conversation', error);
      // Continue without conversation ID, will use fallback responses
    }
  }

  // Generate a unique visitor ID
  function generateVisitorId() {
    // Use existing visitor ID from localStorage if available
    const storedId = localStorage.getItem('chatly-visitor-id');
    if (storedId) {
      log('Using stored visitor ID:', storedId);
      return storedId;
    }
    
    // Generate new visitor ID
    const newId = 'visitor_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('chatly-visitor-id', newId);
    log('Generated new visitor ID:', newId);
    return newId;
  }

  // Handle message submission
  async function handleMessageSubmit(event) {
    event.preventDefault();
    
    const input = document.getElementById('chatly-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    log('Handling message submission:', message);
    
    // Add user message to chat
    addMessage(message, true);
    
    // Clear input
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
      // Send message to server if we have a conversation ID
      if (config.conversationId) {
        log('Sending message to server for conversation:', config.conversationId);
        
        const response = await fetch(`${API_URL}/chats/${config.conversationId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            content: message,
            isFromVisitor: true
          }),
          mode: 'cors'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
        }
        
        log('Message sent successfully, requesting AI response');
        
        // Wait for AI response
        const aiResponse = await fetch(`${API_URL}/chats/${config.conversationId}/ai-response`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors'
        });
        
        if (!aiResponse.ok) {
          throw new Error(`Failed to get AI response: ${aiResponse.status} ${aiResponse.statusText}`);
        }
        
        const data = await aiResponse.json();
        log('Received AI response:', data);
        
        if (data.success && data.data && data.data.message) {
          // Remove typing indicator
          hideTypingIndicator();
          
          // Add AI response
          addMessage(data.data.message.content, false);
          return;
        } else {
          log('Invalid AI response:', data);
          throw new Error('Invalid AI response format');
        }
      } else {
        log('No conversation ID available, using fallback response');
        throw new Error('No conversation ID available');
      }
    } catch (error) {
      console.error('Chatly: Error handling message', error);
      
      // Fallback if API call fails
      log('Using fallback response');
      setTimeout(() => {
        // Remove typing indicator
        hideTypingIndicator();
        
        // Add AI response
        const responses = [
          "Thank you for your message. How can I assist you further?",
          "I understand. Is there anything specific you'd like to know?",
          "That's interesting! Let me help you with that.",
          "I'm here to help. Could you provide more details?",
          "Thanks for sharing. Is there anything else you'd like to discuss?"
        ];
        
        const aiResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(aiResponse, false);
      }, 1500);
    }
  }

  // Add message to chat
  function addMessage(content, isFromUser) {
    log('Adding message to chat:', { content, isFromUser });
    
    const messagesContainer = document.getElementById('chatly-messages');
    if (!messagesContainer) {
      console.error('Chatly: Messages container not found');
      return;
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `chatly-message ${isFromUser ? 'user' : 'ai'}`;
    messageElement.innerHTML = `
      <div class="chatly-message-content">${content}</div>
      <div class="chatly-message-time">${formatTime(new Date())}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
  }

  // Show typing indicator
  function showTypingIndicator() {
    log('Showing typing indicator');
    
    const messagesContainer = document.getElementById('chatly-messages');
    if (!messagesContainer) {
      console.error('Chatly: Messages container not found');
      return;
    }
    
    // Remove existing typing indicator if any
    hideTypingIndicator();
    
    const typingElement = document.createElement('div');
    typingElement.id = 'chatly-typing-indicator';
    typingElement.className = 'chatly-message ai';
    typingElement.innerHTML = `
      <div class="chatly-typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    
    messagesContainer.appendChild(typingElement);
    scrollToBottom();
  }

  // Hide typing indicator
  function hideTypingIndicator() {
    log('Hiding typing indicator');
    
    const typingIndicator = document.getElementById('chatly-typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Scroll to bottom of messages
  function scrollToBottom() {
    const messagesContainer = document.getElementById('chatly-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  // Format time
  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
})(); 