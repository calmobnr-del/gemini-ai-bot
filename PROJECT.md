# Gemini AI Bot

This is a full-stack chatbot application built with NestJS, Angular, and PostgreSQL, containerized with Docker. The backend connects to the Google Gemini API to provide intelligent, context-aware responses.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

* [Node.js](https://nodejs.org/) (v22 or later)

* [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose

## Getting Started

### 1. Clone the Repository

```
git clone [https://github.com/calmobnr-del/gemini-ai-bot.git](https://github.com/calmobnr-del/gemini-ai-bot.git)
cd gemini-ai-bot

```

### 2. Create an Environment File

Create a file named `.env` in the root of the project and add the following content. Replace the placeholder values with your actual credentials.

```
# .env

# Google Gemini API Key
GOOGLE_API_KEY=your_google_api_key_here

# PostgreSQL Credentials
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secret_password
DB_DATABASE=chat_history

```

### 3. Run the Application

With Docker running, you can launch the entire backend stack (NestJS API + PostgreSQL Database) with a single command:

```
docker-compose up --build -d

```

* The API will be available at `http://localhost:3005`.

* To run the Angular frontend, open a new terminal and run:

  ```
  npm install
  nx serve client
  
  ```

* The client application will be available at `http://localhost:4205`.

## Docker Commands 🐳

Here are the essential Docker commands for managing this project.

### Start the Application

Starts all services (API and database) in the background.

```
docker-compose up -d

```

### Stop the Application

Stops and removes the containers and the network created by Docker Compose.

```
docker-compose down

```

This command stops and removes the containers and the network that were created. However, it does not remove the named volume (postgres-data) where your PostgreSQL database stores its data.

This is the command you'll use most of the time. It allows you to stop the application, but when you run docker-compose up again, your database will still have all the chat history you saved.


### Stop the Application and remove all

```
docker-compose down -v

```

The -v flag tells Docker Compose to do everything down does, but to also remove the named volumes defined in your docker-compose.yml file.

You would use this command when you want a completely fresh start, deleting all of your saved chat history and starting with an empty database the next time you run docker-compose up. It's like a factory reset for your application's data. ⚠️



### View Running Containers

Lists all currently running Docker containers. You should see `gemini-api` and `gemini-db`.

```
docker ps

```

### View Logs

Tails the live logs for a specific service. This is essential for debugging.

```
# View logs for the API
docker-compose logs -f api

# View logs for the database
docker-compose logs -f db

```

### Rebuild the Image

If you make changes to the `Dockerfile` or your backend source code, you'll need to rebuild the API image.

```
docker-compose up --build -d

```

### Run this command from the project root directory

```
docker-compose -f docker/docker-compose.yml up --build -d
docker-compose -f docker/docker-compose.yml down
or
docker-compose -f docker/docker-compose.dev.yml up --build -d
docker-compose -f docker/docker-compose.dev.yml down
```


### logs  in docker-compose.dev.yml (or docker-compose.yml file)

```
docker-compose -f docker/docker-compose.dev.yml logs api
docker-compose -f docker/docker-compose.dev.yml logs client
```
