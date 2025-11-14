# Observer Finance

A personal financial tracking application that monitors expenses, income, assets, liabilities, investments, and many more.

## Project Structure

```
observer-finance/
├── client/          # React 19 frontend (Vite, TypeScript, Tailwind CSS)
├── server/          # NestJS backend (SQLite, TypeORM, JWT Auth)
└── INTEGRATION_GUIDE.md  # Frontend-Backend integration guide
```

## Tech Stack

### Frontend
- React 19.1 + TypeScript
- Vite 7.1
- Tailwind CSS 4.1
- shadcn/ui components
- React Router 7.9
- TanStack Table
- Recharts

### Backend
- NestJS 10
- TypeORM
- SQLite database
- JWT authentication
- Passport
- bcrypt

## Quick Start

### Prerequisites
- Node.js v20+
- npm 9+

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Seed the database with demo data:
```bash
npm run seed
```

4. Start the development server:
```bash
npm run start:dev
```

Server will run at `http://localhost:3100/api`

**Demo Credentials:**
- Email: `demo@example.com`
- Password: `password123`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Application will run at `http://localhost:5174`

## Features

### Current Features
- ✅ User authentication (register/login)
- ✅ Transaction management (CRUD operations)
- ✅ Transaction filtering by type and category
- ✅ Dashboard with data visualization
- ✅ Responsive design with dark/light mode
- ✅ Advanced data tables with sorting and filtering

### Planned Features
- 🔄 Income tracking
- 🔄 Investment portfolio management
- 🔄 Budget planning
- 🔄 Financial reports and analytics
- 🔄 Multi-currency support
- 🔄 Data export (CSV, PDF)

## API Documentation

See `server/README.md` for detailed API documentation.

## Integration Guide

See `INTEGRATION_GUIDE.md` for instructions on connecting the frontend to the backend.

## Development

### Running Tests

Backend:
```bash
cd server
npm run test
```

Frontend:
```bash
cd client
npm run test
```

### Building for Production

Backend:
```bash
cd server
npm run build
npm run start:prod
```

Frontend:
```bash
cd client
npm run build
npm run preview
```

## Project Documentation

- `CLAUDE.md` - Architecture documentation and development guidelines
- `server/README.md` - Backend API documentation
- `INTEGRATION_GUIDE.md` - Frontend-Backend integration guide

## Database

The application uses SQLite for simplicity in development. The database file is created automatically at `server/observer-finance.db`.

To reset the database:
```bash
cd server
rm observer-finance.db
npm run seed
```

## Contributing

This is a personal project currently in active development.

## License

MIT

## Future Plans

- Docker containerization for easier deployment
- PostgreSQL migration for production
- Mobile app (React Native)
- Advanced analytics and reporting
