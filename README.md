# News Management System

A full-stack news management application built with Node.js/Express (TypeScript) for the backend and React (TypeScript) for the frontend. The system uses PostgreSQL database with Knex.js ORM, includes comprehensive validation, error handling, logging, and category-based filtering with pagination.

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Running Both Applications
!!!!! From the root directory, you can start both server and client: !!!!!
    ```bash
        npm run start:app
    ```

### Database Setup
1. Install and start PostgreSQL server
2. Create a database for the application (or use the automated script)

### Backend Setup
1. Navigate to the server directory:
    ```bash
        cd server
    ```

2. Install dependencies:
    ```bash
        npm install
    ```

3. Create environment file (.env):
   ```
        NODE_ENV=development
        HOST=localhost
        PORT=8000
        REDIRECT_URL=http://localhost:5173
        
        DB_HOST=localhost
        DB_PORT=5432
        DB_USER=postgres
        DB_PASSWORD=your_password
        DB_NAME=yhorodnii_news
   ```

4. Set up the database:
    ```bash
        # Create database and run migrations
        npm run db:migrate
        
        # Load demo data (optional)
        npm run db:demo
    ```

5. Start the server in development mode:
    ```bash
        npm run dev:server
    ```

### Frontend Setup
1. Navigate to the client directory:
    ```bash
        cd client
    ```

2. Install dependencies:
    ```bash
        npm install
    ```

3. Start the development server:
    ```bash
        npm run dev:client
    ```

## Database Management

### Available Database Scripts
- `npm run db:create` - Create database automatically
- `npm run db:migrate` - Create database and run migrations  
- `npm run db:demo` - Load demo data interactively
- `npm run db:create-table` - Create newsPosts table
- `npm run db:get-all` - Get all news posts
- `npm run db:get-by-id` - Get post by ID
- `npm run db:insert` - Insert new post
- `npm run db:update` - Update existing post
- `npm run db:delete` - Delete post

### Database Schema
The application creates the following tables:
- **users** - User accounts with authentication
- **categories** - News categories (Technology, Business, Health, Other)
- **posts** - Main posts table
    
## Features

### Backend Features
- **RESTful API** with full CRUD operations for news posts
- **PostgreSQL Database** with Knex.js ORM for type-safe queries
- **Database Migrations** for schema management
- **TypeScript** implementation with strict type safety
- **Data Validation** using fastest-validator with custom schemas
- **Error Handling** with custom error classes and global error handler
- **Logging System** using Winston with log rotation and separate files for different log levels
- **Category-based Filtering** with server-side implementation
- **Pagination** with configurable page size
- **Request Logging** middleware for API monitoring
- **Demo Data Loading** with interactive scripts
- **Database Scripts** for development and testing

### Frontend Features
- **React with TypeScript** for type-safe UI development
- **Category Filtering** with color-coded buttons matching post card categories
- **Pagination** integrated with server-side filtering
- **Responsive Design** with modern CSS styling
- **Form Validation** for creating and editing posts
- **Error Boundaries** and loading states
- **Dynamic Color System** for category visualization

### Supported Categories
- **Technology** (Red color scheme)
- **Business** (Blue color scheme)
- **Health** (Green color scheme)
- **Other** (Gray color scheme)

## Project Structure

```
nd-6-hw10/
├── server/                             # Backend application
│   ├── config/                         # Database configuration
│   │   └── database.ts                 # PostgreSQL/Knex.js setup
│   ├── controller/                     # Route controllers
│   │   └── newspostsController.ts
│   ├── data/                           # Demo data for posts and categories
│   │   └── demoData.ts                 
│   ├── helpers/                        # Utility functions and middleware
│   │   ├── errors.ts                   # Custom error classes
│   │   ├── errorHandler.ts             # Global error handler
│   │   ├── helper.ts                   # File management utilities
│   │   ├── logger.ts                   # Winston logger configuration
│   │   ├── requestLogger.ts            # Request logging middleware
│   │   └── validator.ts                # Data validation schemas
│   ├── logs/                           # Application logs
│   ├── migrations/                     # Database migrations
│   │   └── 001_create_tables.ts        # Initial schema setup
│   ├── routes/                         # API routes
│   │   ├── newsPosts.ts
│   │   └── staticGet.ts
│   ├── scripts/                        # Database management scripts
│   │   ├── createDatabase.ts           # Auto database creation
│   │   ├── createTable.ts              # Table creation
│   │   ├── getAll.ts                   # Retrieve all posts
│   │   ├── getById.ts                  # Retrieve post by ID
│   │   ├── insert.ts                   # Insert new post
│   │   ├── update.ts                   # Update existing post
│   │   ├── delete.ts                   # Delete post
│   │   └── loadDemoData.ts             # Interactive demo data loader
│   ├── services/                       # Business logic layer
│   │   ├── baseService.ts              # Base service with common methods
│   │   └── postsService.ts             # Posts business logic
│   ├── types/                          # TypeScript type definitions
│   │   └── types.ts
│   ├── server.ts                       # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                            # Environment configuration
├── client/                             # Frontend application
│   ├── src/
│   │   ├── components/                 # Reusable React components
│   │   │   ├── GenreFilter/            # Category filtering component
│   │   │   ├── PostCard/               # News post display component
│   │   │   ├── Pagination/             # Pagination component
│   │   │   ├── Loading/                # Loading indicator
│   │   │   └── Error/                  # Error display component
│   │   ├── pages/                      # Page components
│   │   │   ├── HomePage/               # Main news list page
│   │   │   ├── PostDetailPage/         # Individual post view
│   │   │   └── PostFormPage/           # Create/edit post form
│   │   ├── services/                   # API communication
│   │   │   └── api.ts
│   │   ├── types/                      # TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.txt                          # This file
```

## API Endpoints

### News Posts
- **GET** `/api/newsposts` - Get paginated news posts with optional category filtering
  - Query parameters:
    - `page` (number): Page number (default: 0)
    - `size` (number): Items per page (default: 10, max: 100)
    - `category` (string): Filter by category (Technology, Business, Health, Other)
  
- **GET** `/api/newsposts/:id` - Get single news post by ID
- **POST** `/api/newsposts` - Create new news post
- **PUT** `/api/newsposts/:id` - Update existing news post
- **DELETE** `/api/newsposts/:id` - Delete news post

### Categories
- **GET** `/api/categories` - Get all available categories

## Data Model

### News Post Schema
```typescript
interface Post {
  id: string;               // UUID
  title: string;            // 1-255 characters
  content: string;          // Post content
  excerpt: string;          // Short excerpt
  image?: string;           // Optional image URL
  category: string;         // Technology | Business | Health | Other
  tags?: string[];          // Optional tags array
  author_id: string;        // UUID of author
  is_published: boolean;    // Publication status
  is_featured: boolean;     // Featured status
  views_count: number;      // View counter
  likes_count: number;      // Likes counter
  slug: string;             // URL-friendly slug
  meta_title?: string;      // SEO meta title
  meta_description?: string; // SEO meta description
  reading_time: number;     // Estimated reading time in minutes
  created_at: Date;         // Creation timestamp
  updated_at: Date;         // Last update timestamp
  published_at?: Date;      // Publication timestamp
}

interface Category {
  id: string;               // UUID
  name: string;             // Category name
  slug: string;             // URL-friendly slug
  color: string;            // Display color
  color_active: string;     // Active state color
  created_at: Date;
  updated_at: Date;
}
```

## Validation Rules

### Create/Update Post
- **Title**: Required, 1-255 characters
- **Content**: Required, minimum 10 characters
- **Category**: Must be one of: Technology, Business, Health, Other
- **Excerpt**: Optional, auto-generated from content if not provided
- **is_published**: Boolean value (default: true)
- **is_featured**: Boolean value (default: false)
- **tags**: Optional array of strings

## Error Handling

The application implements comprehensive error handling:

### Custom Error Types
- **ValidationError**: For data validation failures
- **DatabaseError**: For database operation failures
- **PostsServiceError**: For business logic errors
- **NotFoundError**: For missing resources

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **404**: Not Found
- **500**: Internal Server Error

## Logging

The application uses Winston for logging with the following features:

### Log Levels
- **Error**: Logged to `logs/error.log`
- **Warn**: Logged to `logs/warn.log`
- **Info**: Console output and general logging
- **Debug**: Development debugging

### Log Rotation
- Daily rotation for error and warning logs
- Maximum 14 days retention
- Maximum 20MB file size

### Request Logging
All API requests are logged with:
- HTTP method and URL
- Response status code
- Response time
- Request timestamp

## Frontend Features

### Category Filtering
- Color-coded filter buttons matching post card categories
- Server-side filtering for optimal performance
- Real-time filtering without page reload

### Pagination
- Integrated with category filtering
- Shows current page and total results
- Responsive pagination controls

### Color System
Each category has a consistent color scheme:
- **Technology**: Red (#e74c3c / #c0392b)
- **Business**: Blue (#3498db / #2980b9)
- **Health**: Green (#27ae60 / #229954)
- **Other**: Gray (#95a5a6 / #7f8c8d)

## Development

### Available Scripts

#### Server
- `npm run dev:server` - Start development server with nodemon
- `npm run build:server` - Compile TypeScript to JavaScript
- `npm run start:prod` - Start production server

#### Database
- `npm run db:create` - Create database
- `npm run db:migrate` - Run migrations
- `npm run db:demo` - Load demo data
- `npm run db:create-table` - Create tables
- `npm run db:get-all` - Get all posts
- `npm run db:get-by-id` - Get post by ID
- `npm run db:insert` - Insert new post
- `npm run db:update` - Update post
- `npm run db:delete` - Delete post

#### Client
- `npm run dev:client` - Start Vite development server
- `npm run build:client` - Build for production
- `npm run preview` - Preview production build

### Development URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api

## Testing

### Manual Testing
Use the following curl commands to test the API:

```bash
# Get all posts (first page)
curl "http://localhost:8000/api/newsposts?page=0&size=10"

# Get posts filtered by category
curl "http://localhost:8000/api/newsposts?page=0&size=10&category=Technology"

# Get single post
curl "http://localhost:8000/api/newsposts/1"

# Create new post
curl -X POST "http://localhost:8000/api/newsposts" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"Test content with more than 10 characters","category":"Technology","is_published":true}'

# Get categories
curl "http://localhost:8000/api/categories"
```

## Architecture

### Backend Architecture
- **Controller Layer**: Handles HTTP requests and responses
- **Service Layer**: Contains business logic and validation with BaseService abstraction
- **Database Layer**: PostgreSQL with Knex.js ORM for type-safe queries
- **Migration System**: Version-controlled database schema changes
- **Middleware**: Error handling, logging, and request processing

### Frontend Architecture
- **Component-based**: Reusable React components
- **Type Safety**: Full TypeScript implementation
- **State Management**: React hooks for local state
- **API Layer**: Centralized API communication

## Performance Considerations

### Backend
- Server-side filtering reduces data transfer
- PostgreSQL database with optimized queries
- Pagination limits response size
- Knex.js query builder for efficient SQL generation
- Database connection pooling
- Request logging for monitoring

### Frontend
- Component-based architecture for reusability
- Efficient re-rendering with React hooks
- Responsive design for mobile devices
- Optimized build with Vite

## Future Enhancements

Potential improvements for the application:
- ✅ Database integration (PostgreSQL) - **COMPLETED**
- ✅ Database migrations and schema management - **COMPLETED**
- ✅ Demo data loading system - **COMPLETED**
- User authentication and authorization
- Real-time updates with WebSockets
- Image upload for news posts
- Full-text search functionality
- Admin dashboard
- API rate limiting
- Unit and integration tests
- Redis caching layer
- Email notifications
- Comment system
- Social media sharing

## License

This project is for educational purposes.
