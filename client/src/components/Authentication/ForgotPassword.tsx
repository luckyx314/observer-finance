import { useState } from "react";
import { Link } from "react-router-dom";
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

export default function ForgotPassword({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email.");
            return;
        }
        setLoading(true);
        try {
            const response = await authAPI.forgotPassword(email.trim());
            toast.success(
                response.message ||
                    "If your email exists, we sent reset instructions."
            );
            setEmail("");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                "Unable to process password reset.";
            toast.error(message);
            console.error("Forgot password error:", error);
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
                            <CardTitle>Forgot password</CardTitle>
                            <CardDescription>
                                Enter your account email and we&apos;ll send you a reset
                                link.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Sending link..." : "Send reset link"}
                                </Button>
                            </form>
                            <div className="mt-4 text-center text-sm">
                                Remembered it?{" "}
                                <Link
                                    to="/login"
                                    className="underline underline-offset-4"
                                >
                                    Back to login
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
