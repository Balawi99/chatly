# Chatly - AI-Powered Chat Platform

Chatly is an intelligent chat widget that enables website owners to provide real-time, AI-powered responses to visitor inquiries. The platform includes a customizable chat widget and a comprehensive dashboard for managing conversations and settings.

## Features

- **AI Chatbot:** Automatically responds to user inquiries using OpenAI's API
- **Real-Time Messaging:** Instant communication between visitors and website owners
- **Dashboard Analytics:** Insights into chat volume, response times, and chatbot performance
- **Customizable Widget:** Modify the chat widget's design, colors, and branding
- **Knowledge Base Management:** Add FAQs or extract content from website crawling and uploaded files
- **Manual Intervention:** Take over AI conversations for direct interaction

## Technology Stack

### Frontend
- React.js
- Tailwind CSS
- Windmill Dashboard React (UI template)
- Vue-beautiful-chat (Chat widget)
- Socket.IO Client (Real-time communication)

### Backend
- Node.js
- Express.js
- Prisma ORM
- SQLite Database
- Socket.IO (Real-time communication)
- OpenAI API (AI chatbot functionality)
- JSON Web Tokens (Authentication)

## Project Structure

```
chatly/
├── frontend/         # React frontend application
├── backend/          # Node.js backend API
├── README.md         # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation and Setup
Detailed installation instructions will be provided as the project develops.

## Project Status

### Completed
- Backend API with Express.js and Prisma ORM
  - User authentication (register, login, profile management)
  - Widget management (create, read, update, delete)
  - Conversation and message handling
  - Knowledge base management
  - Socket.IO integration for real-time chat
- Frontend UI with React and Tailwind CSS
  - Authentication pages (login, register)
  - Dashboard with analytics overview
  - Conversations page for managing chats
  - Widgets page for managing chat widgets
  - Knowledge base page for managing FAQs
  - Settings page for user profile management
  - Chat widget component for embedding on websites
  - Widget embed script for easy integration

### Next Steps
1. **OpenAI Integration**
   - Implement OpenAI API integration for AI-powered responses
   - Add knowledge base context to AI prompts for better responses

2. **File Upload Support**
   - Add support for uploading files to the knowledge base
   - Implement PDF and document parsing for knowledge extraction

3. **Web Scraping**
   - Add support for scraping website content for knowledge base

4. **Analytics Dashboard**
   - Implement detailed analytics for chat performance
   - Add charts and graphs for visualizing data

5. **Testing and Deployment**
   - Write unit and integration tests
   - Set up CI/CD pipeline
   - Deploy to production environment

## Running the Project

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## License
This project is licensed under the MIT License. 