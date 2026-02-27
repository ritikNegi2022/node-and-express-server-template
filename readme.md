Varun Kumar, 10:43
# Express Server Template

A lightweight, modular, and developer-friendly Node.js and Express server template designed for speed and scalability. This template features an automated route loader and a custom Router wrapper to simplify API development.

## 🚀 Features

**Automated Route Loading**: Just add a file in the routes/ directory, and it will be automatically registered.
**Custom Router Wrapper**: Enhanced Express Router with built-in asyncHandler to catch and forward errors automatically.
**Centralized Error Handling**: A clean and consistent way to handle errors across your application.
**ES Modules (ESM)**: Modern JavaScript syntax out of the box.
**Nodemon**: Integrated for a smooth development experience with automatic restarts.

## 📁 Project Structure

```
text
├── functions/
│   ├── handlers.js       # Centralized error management
│   ├── load_routes.js    # Automated recursive route loader
│   ├── router.js         # Custom Router wrapper
│   └── ...
├── routes/               # Your API routes go here
│   └── index.js          # Root route example
├── index.js              # Server entry point
└── package.json          # Configuration and dependencies
```
## 🛠️ Getting Started

### Prerequisites

[Node.js](https://nodejs.org/) (Version 14 or higher recommended)
npm (comes with Node.js)

### Installation

1.  Clone or download this template.
2.  Install dependencies:

bash
npm install

### Running the Server

Start the development server with Nodemon:

bash
npm run dev

The server will be running at http://localhost:4000.

## 📖 How to Use

### 1. Adding a New Route

Create a new .js file in the routes/ directory (e.g., routes/users.js). The server will automatically pick it up and mount it based on the filename.

Example: routes/users.js will be available at /users.

### 2. Using the Custom Router

Instead of the standard express.Router(), use the internal Router wrapper. It automatically wraps your handlers in a Promise-based error catcher.

javascript
import Router from "../functions/router.js";

const router = new Router("users");

router.get("/", (req, res) => {
  res.status(200).json({ users: [] });
});

router.post("/add", (req, res) => {
  // Your logic here
  res.status(201).json({ success: true });
});

export default router.build();

### 3. Error Handling

You don't need to use try/catch in every route. If an error occurs, it will be caught by the asyncHandler in the custom router and passed to the centralized error handler in functions/handlers.js.

## 📜 License

This project is licensed under the ISC License.
