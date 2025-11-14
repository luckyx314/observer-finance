import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("access_token");
            const storedUser = localStorage.getItem("user");

            if (token) {
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
                    localStorage.setItem("user", JSON.stringify(userData));
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                    setUser(null);
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem("access_token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const updateUser = (userData: User) => {
        localStorage.setItem("user", JSON.stringify(userData));
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
