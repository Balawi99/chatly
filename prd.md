**# Phase 1: Project Setup and Environment Configuration**

## **1. Initialize the Project**
- Create a new directory for the project and initialize it:
  ```sh
  mkdir chatly && cd chatly
  ```
- Initialize a **Node.js** project:
  ```sh
  npm init -y
  ```
- Install **TypeScript** and configure it:
  ```sh
  npm install -D typescript @types/node ts-node
  npx tsc --init
  ```

## **2. Set Up the Backend with Express.js**
- Install **Express.js** and essential middleware:
  ```sh
  npm install express cors dotenv
  ```
- Install TypeScript types for Express:
  ```sh
  npm install -D @types/express
  ```
- Create `src/server.ts` and set up a basic Express server:
  ```ts
  import express from 'express';
  import cors from 'cors';
  import dotenv from 'dotenv';
  
  dotenv.config();
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  
  app.get('/', (req, res) => {
      res.send('Chatly API is running...');
  });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  ```

## **3. Set Up Database (SQLite + Prisma)**
- Install Prisma and SQLite:
  ```sh
  npm install @prisma/client
  npm install -D prisma
  ```
- Initialize Prisma and configure SQLite:
  ```sh
  npx prisma init
  ```
- Modify `prisma/schema.prisma`:
  ```prisma
  datasource db {
    provider = "sqlite"
    url      = "file:./dev.db"
  }
  
  generator client {
    provider = "prisma-client-js"
  }
  ```
- Run the migration to create the database:
  ```sh
  npx prisma migrate dev --name init
  ```

## **4. Set Up the Frontend with Windmill Dashboard (React + Tailwind CSS)**
- Clone the Windmill Dashboard template:
  ```sh
  git clone https://github.com/estevanmaito/windmill-dashboard-react.git frontend
  ```
- Navigate to the frontend folder and install dependencies:
  ```sh
  cd frontend
  npm install
  ```
- Start the React development server:
  ```sh
  npm start
  ```

## **5. Install Additional Dependencies**
- Install **Socket.IO** for real-time chat functionality:
  ```sh
  npm install socket.io
  npm install -D @types/socket.io
  ```
- Install **OpenAI API** for AI-powered chat responses:
  ```sh
  npm install openai
  ```
- Install **Vue-Beautiful-Chat** for chat UI components (to be integrated into the React project later):
  ```sh
  npm install vue-beautiful-chat
  ```

## **6. Verify Everything Works**
- Start the backend server:
  ```sh
  npm run dev
  ```
- Start the frontend server:
  ```sh
  npm start
  ```
- Open `http://localhost:3000/` and confirm that the Windmill Dashboard loads correctly.
- Send a request to `http://localhost:5000/` and confirm that the backend API responds.

## **Next Steps**
After completing this setup, we will move to **Phase 2**, where we will define the core features of Chatly, refine the UI/UX, and start customizing components based on our needs.

