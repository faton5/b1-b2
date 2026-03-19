# Quiz App

## Overview
This project is a quiz application built using Next.js and TypeScript. It provides an interactive interface for users to take quizzes on various topics, with a focus on understanding AI and digital literacy.

## Features
- Interactive quiz interface
- Randomized question selection
- Multiple-choice questions with instant feedback
- Responsive design

## Project Structure
```
quiz-app
├── app
│   ├── (app)
│   │   └── quiz
│   │       ├── page.tsx          # Main component for the quiz page
│   │       └── question-bank.ts   # Contains quiz questions and types
│   ├── layout.tsx                 # Layout component for the application
│   ├── page.tsx                   # Entry point for the application
│   └── globals.css                # Global CSS styles
├── public                          # Static assets (images, fonts, etc.)
├── package.json                   # npm configuration file
├── tsconfig.json                  # TypeScript configuration file
├── tailwind.config.ts             # Tailwind CSS configuration
└── next.config.mjs                # Next.js configuration file
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd quiz-app
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage
To start the development server, run:
```
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.