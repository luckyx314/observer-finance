import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { authAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
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

export default function VerifyEmail({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState(searchParams.get("email") ?? "");
    const [code, setCode] = useState(searchParams.get("code") ?? "");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !code) {
            toast.error("Please provide both email and verification code.");
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.verifyEmail(email.trim(), code.trim());
            login(response.access_token, response.user);
            toast.success("Email verified! Redirecting you to the dashboard.");
            navigate("/dashboard");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                "Verification failed. Please try again.";
            toast.error(message);
            console.error("Verification error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error("Enter your email first to resend the code.");
            return;
        }
        setResending(true);
        try {
            const response = await authAPI.resendVerification(email.trim());
            toast.success(response.message || "Verification code re-sent.");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                "Unable to resend verification code.";
            toast.error(message);
            console.error("Resend verification error:", error);
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Verify your email</CardTitle>
                            <CardDescription>
                                Enter the code sent to your inbox to activate your
                                account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="m@example.com"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="code">Verification Code</Label>
                                    <Input
                                        id="code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="6-digit code"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading ? "Verifying..." : "Verify Email"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        disabled={resending || !email}
                                        onClick={handleResend}
                                    >
                                        {resending ? "Sending..." : "Resend Code"}
                                    </Button>
                                </div>
                            </form>
                            <div className="mt-4 text-center text-sm">
                                Back to{" "}
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
