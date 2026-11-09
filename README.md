# TinyGate - Full-Stack URL Shortener

TinyGate is a scalable full-stack URL shortening platform built with React.js, Node.js, Express.js, and MongoDB. It provides secure REST APIs, user authentication, URL management, real-time analytics, Docker-based deployment, AWS EC2 hosting, and Nginx reverse proxy configuration.

## 🌐 Live Application

https://tinygate.tech/



https://github.com/user-attachments/assets/8c50f347-2da3-40c1-87e7-53bde7340d88


## 🚀 Overview

TinyGate is a full-stack web application that allows users to create, manage, and analyze shortened URLs through a responsive interface.

The application follows a client-server architecture where the React.js frontend communicates with the Node.js and Express.js backend through REST APIs, while MongoDB is used for persistent data storage.

The project demonstrates practical experience across frontend development, backend development, API integration, database management, authentication, analytics, containerization, cloud deployment, performance optimization, and scalable application design.

## ✨ Features

- Create and manage shortened URLs
- User authentication using JWT
- Protected REST API endpoints
- URL redirection
- Click tracking
- Real-time URL analytics
- Traffic and link performance insights
- Responsive React.js frontend
- RESTful backend APIs
- MongoDB database integration
- Dockerized application
- Docker Compose configuration
- AWS EC2 deployment
- Nginx reverse proxy
- Environment-based configuration
- Performance optimization
- Scalable client-server architecture

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS
- Vite

### Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication

### Database

- MongoDB

### DevOps and Deployment

- Docker
- Docker Compose
- AWS EC2
- Nginx

### Development Tools

- Git
- GitHub
- VS Code

## 🏗️ Architecture

```text
                         USER
                           |
                           v
                  +------------------+
                  |     React.js     |
                  |     Frontend     |
                  +--------+---------+
                           |
                       REST APIs
                           |
                           v
                  +------------------+
                  | Node.js +        |
                  | Express.js       |
                  | Backend          |
                  +--------+---------+
                           |
                           v
                  +------------------+
                  |     MongoDB      |
                  |     Database     |
                  +------------------+

                    Production Layer

                  +------------------+
                  |      Nginx       |
                  |  Reverse Proxy   |
                  +--------+---------+
                           |
                           v
                  +------------------+
                  |      Docker      |
                  |    Containers    |
                  +--------+---------+
                           |
                           v
                  +------------------+
                  |     AWS EC2      |
                  +------------------+
```

## 🔄 Application Workflow

### URL Creation

```text
User enters long URL
        |
        v
React.js Frontend
        |
        v
REST API Request
        |
        v
Node.js / Express.js Backend
        |
        v
URL Validation
        |
        v
Short URL Generation
        |
        v
MongoDB
        |
        v
Short URL Returned
        |
        v
Displayed to User
```

### URL Redirection

```text
User opens shortened URL
        |
        v
Express.js Backend
        |
        v
Find URL in MongoDB
        |
        v
Record Click / Analytics
        |
        v
Redirect User
        |
        v
Original URL
```

### Analytics

```text
User clicks shortened URL
        |
        v
Backend processes request
        |
        v
Click information recorded
        |
        v
MongoDB
        |
        v
Analytics API
        |
        v
React.js Dashboard
        |
        v
Traffic and Performance Insights
```

## 🔐 Authentication and Security

TinyGate uses JWT-based authentication to protect user-specific resources and API endpoints.

Security-related implementation includes:

- JWT-based authentication
- Protected API endpoints
- Environment variables for sensitive configuration
- Configurable JWT secret
- MongoDB connection through environment variables
- Nginx reverse proxy for production deployment

Sensitive configuration is stored through environment variables instead of being hardcoded into the application.

**Never commit production secrets or `.env` files to GitHub.**

## ⚡ Performance and Scalability

TinyGate was designed with performance, scalability, and maintainability in mind.

Key considerations include:

- Lightweight Node.js and Express.js backend
- REST-based client-server communication
- Efficient MongoDB data access
- Docker-based deployment
- Nginx reverse proxy
- Separation of frontend and backend services
- Cloud deployment using AWS EC2
- Optimized request handling
- Modular application structure

The application achieves sub-200ms response time under the tested project conditions.

## 🐳 Docker

The repository includes Docker configurations for containerized development and production deployment.

**Start the application**

```bash
docker compose up -d
```

**Check running containers**

```bash
docker ps
```

**View container logs**

```bash
docker logs <container-name>
```

**Stop the application**

```bash
docker compose down
```

The repository includes:

- `docker-compose.yml`
- `docker-compose.prod.yml`

## 💻 Local Development

### ⚡ Quick start (one command)

Requires Node.js 18+. Docker Desktop is only needed if you don't already have MongoDB running locally (or an Atlas URI in `.env`).

```bash
npm run local
```

This will:

- create `.env` from `.env.example` on first run (local MongoDB, random JWT secret)
- install API and client dependencies if they are missing
- start MongoDB in Docker (`docker-compose.dev.yml`) **only** if nothing is listening on the configured local port
- run the API on http://localhost:5000 and the web app on http://localhost:3000 (Ctrl+C stops both)

Optional demo data — creates `demo@tinygate.local` / `DemoPass123` with sample links and clicks:

```bash
npm run local:seed
```

Stop the MongoDB container when you're done:

```bash
npm run local:stop
```

### Manual setup

### Prerequisites

Make sure the following are installed:

- Node.js 18+
- npm
- MongoDB
- Git

### ⚙️ Environment Configuration

Copy the example environment file.

**Windows PowerShell**

```powershell
copy .env.example .env
```

**Linux / macOS**

```bash
cp .env.example .env
```

Configure the following variables:

```env
MONGO_URI=mongodb://localhost:27017/tinygate
JWT_SECRET=your-secret-key
PORT=5000
BASE_URL=http://localhost:5000
```

### 🖥️ Backend Setup

From the project root:

```bash
npm install
```

Start the backend in development mode:

```bash
npm run dev
```

The backend runs by default at:

```
http://localhost:5000
```

For production:

```bash
npm start
```

### 🎨 Frontend Setup

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend runs at:

```
http://localhost:3000/
```

### 🔄 Running Frontend and Backend Together

**Terminal 1 - Backend**

```bash
npm run dev
```

**Terminal 2 - Frontend**

```bash
cd client
npm run dev
```

After both services are running, open the frontend in your browser.

## 🗄️ MongoDB Setup

TinyGate uses MongoDB for persistent application and URL data.

Default local MongoDB connection:

```
mongodb://localhost:27017/tinygate
```

If MongoDB is not installed locally, it can be started using Docker:

```bash
docker run -d -p 27017:27017 --name tinygate-mongo mongo:6
```

Check the MongoDB container:

```bash
docker ps
```

## ☁️ AWS EC2 Deployment

TinyGate is containerized using Docker and deployed on an AWS EC2 instance.

### Production Architecture

```text
                         Internet
                            |
                            v
                    +---------------+
                    |     Nginx     |
                    | Reverse Proxy |
                    +-------+-------+
                            |
                +-----------+-----------+
                |                       |
                v                       v
        +---------------+       +---------------+
        |   Frontend    |       |    Backend    |
        |   React.js    |       | Node/Express  |
        +---------------+       +-------+-------+
                                        |
                                        v
                                 +-------------+
                                 |   MongoDB   |
                                 +-------------+
```

### Deployment Technologies

- AWS EC2
- Docker
- Docker Compose
- Nginx
- React.js
- Node.js
- Express.js
- MongoDB

## 🌐 Nginx Reverse Proxy

Nginx is used as a reverse proxy in the production deployment.

It provides a single entry point for incoming requests and routes traffic to the appropriate frontend and backend services.

The Nginx-based setup also supports a structured production deployment architecture.

## 📊 Analytics Dashboard

TinyGate includes an analytics dashboard for monitoring shortened URL performance.

The analytics functionality focuses on:

- Total clicks
- Click-through metrics
- Link performance
- Traffic insights
- URL-level analytics
- Click tracking

This allows users to understand how their shortened links are performing.

## 🧪 Troubleshooting

### Port Already in Use

For Windows:

```powershell
netstat -ano | findstr :5000
```

Terminate the process:

```powershell
taskkill /PID <PID> /F
```

### MongoDB Connection Error

Check that:

- MongoDB is running.
- `MONGO_URI` is correctly configured.
- MongoDB is accessible on the configured port.
- The backend can access the MongoDB instance.

### Docker Container Issues

Check running containers:

```bash
docker ps
```

View logs:

```bash
docker logs <container-name>
```

Restart the application:

```bash
docker compose down
docker compose up -d
```

## 📂 Project Structure

```text
TinyGate/
|
├── client/
|   └── Frontend Application
|
├── src/
|   └── config/
|       └── db.js
|
├── server.js
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── package.json
└── README.md
```

## 📌 Important Files

- **Backend Entry Point**: `server.js`
- **Database Configuration**: `src/config/db.js`
- **Frontend**: `client/`
- **Docker Configuration**: `docker-compose.yml`, `docker-compose.prod.yml`
- **Environment Configuration**: `.env.example`

## 👨‍💻 My Contributions

I worked across the full-stack development lifecycle of TinyGate.

My contributions included:

- Developed the React.js frontend
- Built backend services using Node.js and Express.js
- Designed and integrated REST APIs
- Implemented URL shortening and redirection functionality
- Integrated MongoDB for persistent data storage
- Implemented JWT-based authentication
- Developed URL analytics and click tracking
- Built the analytics dashboard
- Containerized the application using Docker
- Created Docker Compose configurations
- Deployed the application on AWS EC2
- Configured Nginx as a reverse proxy
- Managed environment-based configuration
- Focused on application performance and scalability
- Used Git and GitHub for version control

## 🎯 Skills Demonstrated

- Full-Stack Development
- Frontend Development
- Backend Development
- React.js
- JavaScript
- Node.js
- Express.js
- REST API Development
- API Integration
- MongoDB
- JWT Authentication
- Docker
- Docker Compose
- AWS EC2
- Nginx
- Git
- GitHub
- Database Management
- Cloud Deployment
- Performance Optimization
- Scalable Application Design

## 📈 Engineering Highlights

The project demonstrates practical experience in:

- Building responsive frontend applications
- Connecting frontend applications with backend REST APIs
- Developing backend services using Node.js and Express.js
- Designing database-driven applications
- Implementing authentication and protected resources
- Containerizing applications using Docker
- Deploying applications on AWS EC2
- Configuring Nginx reverse proxy
- Monitoring URL usage and analytics
- Optimizing application performance
- Designing applications with scalability and maintainability in mind

## 🔮 Future Improvements

Planned improvements include:

- React Native mobile client
- Advanced analytics and reporting
- Custom short URLs
- QR code generation
- Rate limiting
- Automated CI/CD deployment pipeline
- Application monitoring and observability
- Improved mobile experience
- Automated testing and deployment

## 🌐 Live Application

https://tinygate.tech/

## 👤 Author

**Akshat Raj**

Bachelor of Technology - Computer Science and Engineering
Lovely Professional University

GitHub: https://github.com/AkshatRaj2004

## ⭐ Support

If you find this project useful, consider giving the repository a star.
