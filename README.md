# Meeting-GPT

Welcome to the Meeting-GPT repository, a monorepo designed for running a client-server application where the client side provides an interface for various GPT-powered bots and the server side handles API requests and business logic.

## Structure

The repository is structured as follows:
```
.
├── client # Client-side code, including the user interface and bot interactions
│ ├── public # Static files like images and icons
│ ├── src # Source files for the client application
│ ├── assets # Media assets used in the client application
│ ├── services # Services for handling operations like API calls and data management
│ ├── types # TypeScript type definitions
│ └── ... # Other configuration and script files
└── server # Server-side code for API handling and backend logic
```
## Client

The `client` directory contains a modern web application built with React, TypeScript, and TailwindCSS. It is set up with a series of components, hooks, and services to interact with various GPT bots and handle user sessions.

### Key Components

- `AppRouter`: Manages the routing of the application.
- `bots`: Abstract representations of different GPT-powered bots, including their APIs and utilities.
- `components`: Reusable UI components like buttons, inputs, and chat messages.
- `hooks`: Custom React hooks for state and context management.
- `i18n`: Internationalization support for multi-language functionality.
- `pages`: The various pages rendered by the router, each corresponding to a route in the application.
- `services`: Service functions to handle external API interactions and internal data management.

### Running the Client

To run the client application, navigate to the `client` directory and run:

```bash
npm install
npm run dev
```

This will start the development server, usually on `http://localhost:3000`, where you can interact with the application.

Server
The `server/` directory contains a Node.js application responsible for handling backend logic, such as API request processing and data management.

Running the Server
To get the server up and running, switch to the `server/` directory and execute:

```bash
npm install
npm start
```

The server will start, and by default, it listens on `http://localhost:8000`.


## Getting Started
To set up the entire Meeting-GPT application, follow these steps:

1. Clone the repository.
2. Set up the client application by running npm install in the client directory.
3. Start the client development server with npm run dev.
4. In a separate terminal, set up the server application with npm install in the server directory.
5. Start the server with npm start.

Now you're ready to use the Meeting-GPT application for your meetings!

## Contribution
Contributions are welcome. Please read the README files within each sub-directory for more detailed instructions on contributing to the client or server parts of the project.

Thank you for being a part of Meeting-GPT!