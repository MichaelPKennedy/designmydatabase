# DesignMyDatabase

DesignMyDatabase is a web application that helps users create database schemas using AI-powered suggestions. It provides an intuitive interface for designing database structures and generates both SQL code and Entity-Relationship Diagrams (ERDs).

## Features

- AI-powered database schema generation
- Interactive form for inputting business details
- Real-time Entity-Relationship Diagram (ERD) visualization
- SQL code generation for database creation
- Contact form for user inquiries

## Tech Stack

- Frontend: React with TypeScript
- Backend: Feathers.js (Node.js)
- Database: MongoDB
- AI Integration: OpenAI API
- Styling: Styled-components
- Diagram Generation: Mermaid.js

## Project Structure

The project is organized into two main packages:

1. `packages/web`: React frontend application
2. `packages/api`: Feathers.js backend application

## Getting Started

### Prerequisites

- Node.js (v18.18.0 or later)
- npm (comes with Node.js)
- MongoDB

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/designmydatabase.git
   cd designmydatabase
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add necessary environment variables (e.g., MongoDB connection string, OpenAI API key)

### Running the Application

1. Start the fronted/backend servers:

   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite)

## API Documentation

The backend provides the following main services:

1. OpenAI Service: Generates database schemas and ERDs
2. Email Service: Handles contact form submissions
