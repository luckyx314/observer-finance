import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { authAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function ResetPassword({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState(searchParams.get("token") ?? "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error("Reset token is missing.");
            return;
        }
        if (!password || password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.resetPassword(token, password);
            toast.success(response.message || "Password updated successfully.");
            navigate("/login");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                "Failed to reset password. Please try again.";
            toast.error(message);
            console.error("Reset password error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Reset password</CardTitle>
                            <CardDescription>
                                Paste the token from your email and choose a new password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="token">Reset Token</Label>
                                    <Input
                                        id="token"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        placeholder="Reset token"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="At least 6 characters"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="confirmPassword">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Resetting password..." : "Reset password"}
                                </Button>
                            </form>
                            <div className="mt-4 text-center text-sm">
                                Return to{" "}
                                <Link
                                    to="/login"
                                    className="underline underline-offset-4"
                                >
                                    login
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
