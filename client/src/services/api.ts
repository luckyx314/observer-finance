import axios, { AxiosError } from "axios";
import type {
    LoginResponse,
    RegisterResponse,
    Transaction,
    CreateTransactionDto,
    UpdateTransactionDto,
    User,
    ApiMessageResponse,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3100/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>("/auth/login", {
            email,
            password,
        });
        return response.data;
    },

    register: async (
        email: string,
        password: string,
        firstName?: string,
        lastName?: string
    ): Promise<RegisterResponse> => {
        const response = await api.post<RegisterResponse>("/auth/register", {
            email,
            password,
            firstName,
            lastName,
        });
        return response.data;
    },

    verifyEmail: async (email: string, code: string): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>("/auth/verify-email", {
            email,
            code,
        });
        return response.data;
    },

    resendVerification: async (email: string): Promise<ApiMessageResponse> => {
        const response = await api.post<ApiMessageResponse>(
            "/auth/resend-verification",
            { email }
        );
        return response.data;
    },

    forgotPassword: async (email: string): Promise<ApiMessageResponse> => {
        const response = await api.post<ApiMessageResponse>(
            "/auth/forgot-password",
            { email }
        );
        return response.data;
    },

    resetPassword: async (token: string, password: string): Promise<ApiMessageResponse> => {
        const response = await api.post<ApiMessageResponse>("/auth/reset-password", {
            token,
            password,
        });
        return response.data;
    },
};

export const userAPI = {
    getProfile: async (): Promise<User> => {
        const response = await api.get<User>("/users/me");
        return response.data;
    },

    getById: async (id: number): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },
};

export const transactionAPI = {
    getAll: async (): Promise<Transaction[]> => {
        const response = await api.get<Transaction[]>("/transactions");
        return response.data;
    },

    getOne: async (id: number): Promise<Transaction> => {
        const response = await api.get<Transaction>(`/transactions/${id}`);
        return response.data;
    },

    create: async (
        transaction: CreateTransactionDto
    ): Promise<Transaction> => {
        const response = await api.post<Transaction>(
            "/transactions",
            transaction
        );
        return response.data;
    },

    update: async (
        id: number,
        transaction: UpdateTransactionDto
    ): Promise<Transaction> => {
        const response = await api.patch<Transaction>(
            `/transactions/${id}`,
            transaction
        );
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/transactions/${id}`);
    },

    getByType: async (type: string): Promise<Transaction[]> => {
        const response = await api.get<Transaction[]>(
            `/transactions?type=${type}`
        );
        return response.data;
    },

    getByCategory: async (category: string): Promise<Transaction[]> => {
        const response = await api.get<Transaction[]>(
            `/transactions?category=${category}`
        );
        return response.data;
    },

    getTotalByType: async (
        type: string
    ): Promise<{ type: string; total: number }> => {
        const response = await api.get<{ type: string; total: number }>(
            `/transactions/stats/total?type=${type}`
        );
        return response.data;
    },
};

export default api;
