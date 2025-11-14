# Frontend-Backend Integration Guide

This guide explains how to integrate the React frontend with the NestJS backend.

## Backend Server

### Starting the Server

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Run the seed script to create demo data:
```bash
npm run seed
```

4. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3100/api`. Configure `APP_URL` and SMTP credentials in `server/.env` so registration and password reset emails are delivered. Without SMTP values, emails are logged to the server console for development.

### Demo Credentials

```
Email: demo@example.com
Password: password123
```

## Frontend Integration

### 1. Install Axios (or use Fetch API)

```bash
cd client
npm install axios
```

### 2. Create API Service

Create `client/src/services/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3100/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (email: string, password: string, firstName?: string, lastName?: string) => {
    const response = await api.post('/auth/register', { email, password, firstName, lastName });
    return response.data;
  },
  verifyEmail: async (email: string, code: string) => {
    const response = await api.post('/auth/verify-email', { email, code });
    return response.data;
  },
  resendVerification: async (email: string) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },
};

// Transaction API
export const transactionAPI = {
  getAll: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },
  getOne: async (id: number) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },
  create: async (transaction: any) => {
    const response = await api.post('/transactions', transaction);
    return response.data;
  },
  update: async (id: number, transaction: any) => {
    const response = await api.patch(`/transactions/${id}`, transaction);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
  getByType: async (type: string) => {
    const response = await api.get(`/transactions?type=${type}`);
    return response.data;
  },
  getByCategory: async (category: string) => {
    const response = await api.get(`/transactions?category=${category}`);
    return response.data;
  },
  getTotalByType: async (type: string) => {
    const response = await api.get(`/transactions/stats/total?type=${type}`);
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

export default api;
```

### 3. Update LoginForm Component

Update `client/src/components/Authentication/LoginForm.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api';
// ... other imports

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... update form with state and handlers
  );
}
```

### 4. Update SignupForm Component

Similar to LoginForm, update the SignupForm to call the register API.

### 5. Update Dashboard to Fetch Transactions

Update `client/src/components/Dashboard/Dashboard.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { transactionAPI } from '@/services/api';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await transactionAPI.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
}
```

### 6. Update AddTransactionDialog

Update the form submission to create transactions via API:

```typescript
import { transactionAPI } from '@/services/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const transactionData = {
    merchant,
    category,
    type,
    status: 'Done',
    amount: parseFloat(amount),
    date: selectedDate.toISOString().split('T')[0],
  };

  try {
    await transactionAPI.create(transactionData);
    // Refresh transaction list
    onSuccess();
  } catch (error) {
    console.error('Failed to create transaction:', error);
  }
};
```

### 7. Create Auth Context (Optional but Recommended)

Create `client/src/context/AuthContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '@/services/api';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await userAPI.getProfile();
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('access_token');
    } finally {
      setLoading(false);
    }
  };

  const login = (token: string, user: any) => {
    localStorage.setItem('access_token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile

### Transactions
- `GET /api/transactions` - Get all user transactions
- `GET /api/transactions/:id` - Get specific transaction
- `POST /api/transactions` - Create new transaction
- `PATCH /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions?type=Expense` - Filter by type
- `GET /api/transactions?category=Food` - Filter by category
- `GET /api/transactions/stats/total?type=Expense` - Get total by type

## Transaction Types

- `Expense` - Expenses
- `Income` - Income
- `Savings` - Savings
- `Liability` - Liabilities
- `Investment` - Investments

## Transaction Categories

- `Food`
- `Transportation`
- `Education`
- `Subscription`
- `Bills`

## Next Steps

1. Replace static data in Dashboard with API calls
2. Implement protected routes (redirect to login if no token)
3. Add error handling and loading states
4. Implement refresh token mechanism (optional)
5. Add toast notifications for CRUD operations
6. Implement real-time updates (optional, using WebSockets)

## Email Verification Flow

1. `POST /api/auth/register` returns `{ access_token, user }` immediately. Persist the session like a normal login, and use `user.isEmailVerified` to decide whether to remind them about verification.
2. Prompt the user for the 6-digit code delivered after login and call `POST /api/auth/verify-email` with `{ email, code }`.
3. Successful verification also returns `{ access_token, user }`; replace the stored session so the UI reflects the verified status.
4. If a code expires, call `POST /api/auth/resend-verification` to send a fresh one. The API responds with a simple `{ message }`.

## Password Reset Flow

1. Expose a "Forgot password" screen that calls `POST /api/auth/forgot-password` with only the user email.
2. The backend generates a signed token, stores a hashed version, and emails a link built from `APP_URL` (defaults to `http://localhost:5174`). In development, the email content is logged if SMTP isn’t configured.
3. Your reset form should read the `token` query param and submit it with the new password to `POST /api/auth/reset-password`.
4. Tokens expire after 30 minutes; display the API’s error message and prompt the user to restart the flow when that happens.

## Testing the Integration

1. Start the backend server (`npm run start:dev` in server directory)
2. Start the frontend dev server (`npm run dev` in client directory)
3. Navigate to `http://localhost:5174`
4. Register a new user, verify the email using the `/verify-email` route, then log in
5. Exercise the forgot-password flow to ensure emails (or console logs) show the reset link
6. Login with demo credentials and test CRUD operations on transactions

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure the backend is configured to allow requests from `http://localhost:5174`.

### Token Expiration
JWT tokens expire after 7 days. Implement a refresh token mechanism or handle token expiration gracefully.

### Database Issues
If the database gets corrupted, delete `server/observer-finance.db` and run `npm run seed` again.
