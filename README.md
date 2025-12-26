# Wedding Management API 🎎

A comprehensive, scalable, and production-ready GraphQL API for managing wedding events, guests, vendors, and all related wedding planning operations. Built with TypeScript, Express, Apollo Server, and MongoDB.

## ✨ Features

- **GraphQL API** - Full-featured GraphQL server with Apollo Server
- **TypeScript** - Type-safe development with modern TypeScript
- **MongoDB** - NoSQL database with Mongoose ODM
- **Swagger Documentation** - Interactive API documentation
- **Security** - Helmet, CORS, rate limiting, and input validation
- **Authentication** - JWT-based authentication system
- **File Uploads** - Support for image and file uploads
- **Logging** - Winston logger for production monitoring
- **Health Checks** - Comprehensive health monitoring
- **Scalable Architecture** - Modular and maintainable code structure

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas or local MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/quynguyen20-07/wedding-api.git
cd wedding-api
```

2. **Install dependencies**
```bash
yarn install
# or
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env
```
Edit `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wedding
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:3000,http://localhost:8080
MAX_FILE_SIZE=10mb
```

4. **Start Development Server**
```bash
yarn dev
# or
npm run dev
```

The server will start at `http://localhost:5000`

## 📁 Project Structure

```
wedding-api/
├── src/
│   ├── app.ts                  # Main application entry point
│   ├── graphql/
│   │   ├── schema.graphql      # GraphQL schema definitions
│   │   ├── resolvers.ts        # GraphQL resolvers
│   │   └── types/              # GraphQL type definitions
│   ├── middleware/
│   │   ├── auth.ts             # Authentication middleware
│   │   ├── errorHandler.ts     # Global error handling
│   │   └── logger.ts           # Request logging
│   ├── models/                 # Mongoose models
│   │   ├── User.ts
│   │   ├── Wedding.ts
│   │   ├── Guest.ts
│   │   └── Vendor.ts
│   ├── services/               # Business logic
│   ├── utils/                  # Utility functions
│   └── types/                  # TypeScript type definitions
├── uploads/                    # File uploads directory
├── .env.example                # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Available Scripts

```bash
# Development mode with hot reload
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Lint code
yarn lint

# Format code
yarn format

# Type checking
yarn type-check

# Run tests (coming soon)
yarn test
```

## 🌐 API Endpoints

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/` | GET | API information | Public |
| `/health` | GET | Health check | Public |
| `/graphql` | POST | GraphQL endpoint | Mixed |
| `/api-docs` | GET | Swagger documentation | Public |
| `/uploads/*` | GET | Static files | Public |
| `/api/v1/*` | Various | REST API endpoints (future) | Mixed |

## 🎯 GraphQL Schema

### Core Types
```graphql
type User {
  id: ID!
  email: String!
  name: String!
  role: UserRole!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Wedding {
  id: ID!
  name: String!
  date: DateTime!
  budget: Float
  location: String
  guests: [Guest!]!
  vendors: [Vendor!]!
  createdBy: User!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Guest {
  id: ID!
  name: String!
  email: String
  phone: String
  rsvpStatus: RSVPStatus!
  dietaryRestrictions: [String!]
  wedding: Wedding!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Vendor {
  id: ID!
  name: String!
  category: VendorCategory!
  contact: ContactInfo!
  services: [Service!]!
  wedding: Wedding!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### Example Queries
```graphql
# Get wedding details
query GetWedding($id: ID!) {
  wedding(id: $id) {
    id
    name
    date
    location
    guests {
      id
      name
      rsvpStatus
    }
    vendors {
      id
      name
      category
    }
  }
}

# Create new guest
mutation CreateGuest($input: CreateGuestInput!) {
  createGuest(input: $input) {
    id
    name
    email
    wedding {
      id
      name
    }
  }
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

```bash
# Request header
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **ADMIN** - Full system access
- **WEDDING_PLANNER** - Can manage multiple weddings
- **COUPLE** - Can manage their own wedding
- **GUEST** - Limited read-only access

## 📊 Database Schema

### Collections
1. **users** - User accounts and authentication
2. **weddings** - Wedding event details
3. **guests** - Guest information and RSVPs
4. **vendors** - Vendor services and contacts
5. **budgets** - Budget tracking and expenses
6. **tasks** - Wedding planning tasks and timeline
7. **galleries** - Photo and media galleries

### Indexes
- Email uniqueness on users
- Wedding ID indexes for guests and vendors
- Date-based queries on weddings
- Full-text search on vendor services

## 🛡️ Security Features

- **Helmet.js** - Security HTTP headers
- **CORS** - Configurable cross-origin requests
- **Rate Limiting** - Protection against brute force attacks
- **Input Validation** - Joi and class-validator
- **SQL Injection Protection** - Mongoose ORM
- **XSS Protection** - Input sanitization
- **JWT Best Practices** - Secure token handling

## 📈 Monitoring & Logging

### Log Levels
- **ERROR** - Application errors
- **WARN** - Warning conditions
- **INFO** - Informational messages
- **HTTP** - HTTP requests
- **DEBUG** - Debug information

### Health Metrics
- Database connection status
- Memory usage
- Response times
- Error rates
- Request counts

## 🐳 Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/app.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/wedding
    depends_on:
      - mongodb

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## ☁️ Deployment

### Heroku
```bash
# Deploy to Heroku
heroku create wedding-api
heroku addons:create mongolab
git push heroku main
```

### AWS Elastic Beanstalk
```bash
# Initialize EB
eb init -p node.js wedding-api
eb create wedding-api-prod
eb deploy
```

### Vercel
```bash
# Deploy to Vercel
vercel
vercel --prod
```

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run e2e tests
yarn test:e2e
```

Test structure:
- **Unit Tests** - Individual functions and services
- **Integration Tests** - API endpoints and database
- **E2E Tests** - Complete user scenarios

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | - | MongoDB connection string |
| `NODE_ENV` | `development` | Environment mode |
| `JWT_SECRET` | - | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | Token expiration time |
| `CORS_ORIGIN` | `*` | Allowed origins (comma-separated) |
| `RATE_LIMIT_WINDOW` | `15` | Rate limit window (minutes) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |
| `MAX_FILE_SIZE` | `10mb` | Maximum upload file size |
| `CLOUDINARY_URL` | - | Cloudinary configuration |

## 📚 API Documentation

### Interactive Docs
- **Swagger UI**: `http://localhost:5000/api-docs`
- **GraphQL Playground**: `http://localhost:5000/graphql`
- **Postman Collection**: Available in `/docs/postman`

### Code Examples

#### JavaScript/Node.js
```javascript
const { ApolloClient, InMemoryCache, gql } = require('@apollo/client');

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${token}`
  }
});
```

#### Python
```python
import requests

response = requests.post(
    'http://localhost:5000/graphql',
    json={'query': '{ hello }'},
    headers={'Authorization': f'Bearer {token}'}
)
```

#### cURL
```bash
curl -X POST http://localhost:5000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "{ hello }"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Use conventional commits
- Follow the code style guide

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Nguyen The Quy** - Lead Developer - [@quynguyen20-07](https://github.com/quynguyen20-07)

## 🙏 Acknowledgments

- [Apollo GraphQL](https://www.apollographql.com/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Swagger](https://swagger.io/)

## 📞 Support

For support, email support@weddingapi.com or create an issue in the GitHub repository.

---

**Happy Wedding Planning!** 🎉💍✨

*Built with ❤️ for couples, planners, and vendors*