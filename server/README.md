# Observer Finance - Backend API

NestJS-based REST API for the Observer Finance application with SQLite database and JWT authentication.

## Features

- JWT-based authentication with bcrypt password hashing
- Email verification via OTP codes (sent immediately after login) with resend support
- Password reset links delivered via email
- User registration and login
- Transaction CRUD operations
- SQLite database with TypeORM
- Input validation with class-validator
- CORS enabled for frontend integration

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript
- **SQLite** - Lightweight database
- **Passport JWT** - JWT authentication
- **bcrypt** - Password hashing
- **class-validator** - DTO validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```env
PORT=3100
JWT_SECRET=your-secret-key-change-in-production
APP_URL=http://localhost:5174
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
MAIL_FROM="Observer Finance <no-reply@observerfinance.local>"
```

### Running the Application

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3100/api`

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": false
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": false
  }
}
```

#### Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### Resend Verification Code
```http
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

Response:
```json
{ "message": "Password reset link sent." }
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "<reset_token_from_email>",
  "password": "newStrongPassword"
}
```

### User Endpoints

All user endpoints require JWT authentication (Bearer token in Authorization header).

#### Get Current User Profile
```http
GET /api/users/me
Authorization: Bearer <access_token>
```

### Transaction Endpoints

All transaction endpoints require JWT authentication.

#### Create Transaction
```http
POST /api/transactions
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "merchant": "Jollibee",
  "category": "Food",
  "type": "Expense",
  "status": "Done",
  "amount": 29.99,
  "date": "2025-11-13",
  "description": "Lunch"
}
```

#### Get All Transactions
```http
GET /api/transactions
Authorization: Bearer <access_token>
```

Query parameters:
- `type` - Filter by transaction type (Expense, Income, Savings, Liability, Investment)
- `category` - Filter by category (Food, Transportation, Education, Subscription, Bills)

#### Get Transaction by ID
```http
GET /api/transactions/:id
Authorization: Bearer <access_token>
```

#### Update Transaction
```http
PATCH /api/transactions/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "merchant": "Updated Merchant",
  "amount": 35.50
}
```

#### Delete Transaction
```http
DELETE /api/transactions/:id
Authorization: Bearer <access_token>
```

#### Get Total by Type
```http
GET /api/transactions/stats/total?type=Expense
Authorization: Bearer <access_token>
```

## Database Schema

### User Entity
- `id` - Primary key (auto-increment)
- `email` - Unique email address
- `password` - Hashed password
- `firstName` - Optional first name
- `lastName` - Optional last name
- `isEmailVerified` - Indicates whether the user confirmed their email
- `emailVerificationCode` - Hashed verification code (nullable)
- `emailVerificationCodeExpiresAt` - Verification code expiration timestamp
- `passwordResetToken` - Hashed password reset token (nullable)
- `passwordResetTokenExpiresAt` - Reset token expiration timestamp
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Transaction Entity
- `id` - Primary key (auto-increment)
- `merchant` - Merchant name
- `category` - Transaction category
- `type` - Transaction type (Expense, Income, Savings, Liability, Investment)
- `status` - Transaction status (In Process, Done, Pending, Cancelled)
- `amount` - Transaction amount (decimal)
- `date` - Transaction date
- `description` - Optional description
- `userId` - Foreign key to User
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

## Project Structure

```
server/
├── src/
│   ├── auth/                 # Authentication module
│   │   ├── dto/              # Auth DTOs
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   └── jwt-auth.guard.ts
│   ├── user/                 # User module
│   │   ├── dto/              # User DTOs
│   │   ├── entities/         # User entity
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   ├── transaction/          # Transaction module
│   │   ├── dto/              # Transaction DTOs
│   │   ├── entities/         # Transaction entity
│   │   ├── transaction.controller.ts
│   │   ├── transaction.service.ts
│   │   └── transaction.module.ts
│   ├── app.module.ts         # Root module
│   └── main.ts               # Application entry point
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Development

### Lint
```bash
npm run lint
```

### Tests
```bash
npm run test
npm run test:watch
npm run test:cov
```

## Security Considerations

1. **JWT Secret**: Change the default JWT secret in production
2. **Password Hashing**: Passwords are hashed using bcrypt with salt rounds of 10
3. **Input Validation**: All inputs are validated using class-validator
4. **CORS**: Configured for localhost during development, update for production
5. **SQL Injection**: Protected by TypeORM's parameterized queries

## License

MIT
