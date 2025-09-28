import LoginForm from "./components/Authentication/LoginForm";
import { Routes, Route } from "react-router-dom";
import { SignupForm } from "./components/Authentication/SignupForm";
import Dashboard from "./components/Dashboard/Dashboard";
import Income from "./components/Income/Income";
import Investments from "./components/Investments/Investments";
import { ThemeProvider } from "@/components/Theme/theme-provider";

const App = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div>
                <Routes>
                    <Route path="/" element={<LoginForm />} />{" "}
                    {/* root defaults to dashboard */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/income" element={<Income />} />
                    <Route path="/investments" element={<Investments />} />
                </Routes>
            </div>
        </ThemeProvider>
    );
};

export default App;
