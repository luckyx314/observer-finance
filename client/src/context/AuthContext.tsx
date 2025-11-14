import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import { userAPI } from "@/services/api";
import type { User } from "@/types";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = "access_token";
const USER_STORAGE_KEY = "user";
const TOKEN_EXPIRY_STORAGE_KEY = "access_token_expires_at";

const getTokenExpiry = (token: string): number | null => {
    try {
        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload));
        if (typeof decoded?.exp !== "number") {
            return null;
        }
        return decoded.exp * 1000;
    } catch (error) {
        console.error("Failed to parse token payload:", error);
        return null;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);

    const clearSession = useCallback(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_STORAGE_KEY);
        setUser(null);
        setSessionExpiry(null);
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem(TOKEN_STORAGE_KEY);
            const storedUser = localStorage.getItem(USER_STORAGE_KEY);

            if (token) {
                const expiry = getTokenExpiry(token);
                if (!expiry || expiry <= Date.now()) {
                    clearSession();
                    setLoading(false);
                    return;
                }

                setSessionExpiry(expiry);
                localStorage.setItem(
                    TOKEN_EXPIRY_STORAGE_KEY,
                    expiry.toString()
                );

                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (error) {
                        console.error("Failed to parse stored user:", error);
                    }
                }

                try {
                    const userData = await userAPI.getProfile();
                    setUser(userData);
                    localStorage.setItem(
                        USER_STORAGE_KEY,
                        JSON.stringify(userData)
                    );
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                    clearSession();
                }
            }

            setLoading(false);
        };

        initAuth();
    }, [clearSession]);

    useEffect(() => {
        if (!sessionExpiry) {
            return;
        }

        const timeout = sessionExpiry - Date.now();
        if (timeout <= 0) {
            clearSession();
            return;
        }

        const timer = window.setTimeout(() => {
            clearSession();
        }, timeout);

        return () => window.clearTimeout(timer);
    }, [sessionExpiry, clearSession]);

    const login = (token: string, userData: User) => {
        const expiry = getTokenExpiry(token);
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

        if (expiry) {
            localStorage.setItem(
                TOKEN_EXPIRY_STORAGE_KEY,
                expiry.toString()
            );
            setSessionExpiry(expiry);
        } else {
            localStorage.removeItem(TOKEN_EXPIRY_STORAGE_KEY);
            setSessionExpiry(null);
        }

        setUser(userData);
    };

    const logout = () => {
        clearSession();
    };

    const updateUser = (userData: User) => {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider
            value={{ user, loading, isAuthenticated, login, logout, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
