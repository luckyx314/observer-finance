import LoginForm from "./components/Authentication/LoginForm";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignupForm } from "./components/Authentication/SignupForm";
import Dashboard from "./components/Dashboard/Dashboard";
import Income from "./components/Income/Income";
import Investments from "./components/Investments/Investments";
import Account from "./components/Account/Account";
import { ThemeProvider } from "@/components/Theme/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AuthProvider>
                <div>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/signup" element={<SignupForm />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/income"
                            element={
                                <ProtectedRoute>
                                    <Income />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/investments"
                            element={
                                <ProtectedRoute>
                                    <Investments />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/account"
                            element={
                                <ProtectedRoute>
                                    <Account />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                    <Toaster />
                </div>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
