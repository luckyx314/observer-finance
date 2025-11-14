import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Dashboard/components/app-sidebar";
import { SiteHeader } from "@/components/Dashboard/components/site-header";
import { IconUser, IconMail, IconLock } from "@tabler/icons-react";

export default function Account() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        email: "",
        firstName: "",
        lastName: "",
    });

    useEffect(() => {
        // Load user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser({
                email: userData.email || "",
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
            });
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user.email) {
            toast.error("Email is required");
            return;
        }

        setLoading(true);

        try {
            // Update localStorage
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                const updatedUser = {
                    ...userData,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                };
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }

            toast.success("Account details updated successfully!");
        } catch (error: any) {
            console.error("Failed to update account:", error);
            toast.error("Failed to update account details");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.info("Password change functionality coming soon!");
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader headerTitle="Account Settings" />
                <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 lg:p-6">
                    <div className="">
                        <p className="text-sm text-muted-foreground mb-6">
                            Manage your account details and preferences
                        </p>
                    </div>
                    <div className="">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <IconUser className="size-5" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription>
                                    Update your personal details
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">
                                                First Name
                                            </Label>
                                            <Input
                                                id="firstName"
                                                value={user.firstName}
                                                onChange={(e) =>
                                                    setUser({
                                                        ...user,
                                                        firstName: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter your first name"
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">
                                                Last Name
                                            </Label>
                                            <Input
                                                id="lastName"
                                                value={user.lastName}
                                                onChange={(e) =>
                                                    setUser({
                                                        ...user,
                                                        lastName: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter your last name"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="flex items-center gap-2">
                                            <IconMail className="size-4" />
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={user.email}
                                            onChange={(e) =>
                                                setUser({ ...user, email: e.target.value })
                                            }
                                            placeholder="Enter your email"
                                            disabled={loading}
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => navigate("/dashboard")}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={loading}>
                                            {loading ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Password Section */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <IconLock className="size-5" />
                                    Password & Security
                                </CardTitle>
                                <CardDescription>
                                    Change your password and manage security settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordChange} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">
                                            Current Password
                                        </Label>
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            placeholder="Enter current password"
                                            disabled={loading}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">
                                                New Password
                                            </Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                placeholder="Enter new password"
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">
                                                Confirm Password
                                            </Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="Confirm new password"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            disabled={loading}
                                        >
                                            Change Password
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Danger Zone */}
                        <Card className="mt-6 border-destructive/50">
                            <CardHeader>
                                <CardTitle className="text-destructive">
                                    Danger Zone
                                </CardTitle>
                                <CardDescription>
                                    Irreversible actions for your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Delete Account</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Permanently delete your account and all data
                                        </p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            toast.error(
                                                "Account deletion is not available yet"
                                            )
                                        }
                                    >
                                        Delete Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
