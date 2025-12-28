import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/card";
import { User, Shield, KeyRound } from "lucide-react";
import { getSession } from "@/lib/session";
import { EditProfileForm } from "@/components/features/settings/edit-profile-form";
import { ApiKeyForm } from "@/components/features/settings/api-key-form";
import { ChangePasswordForm } from "@/components/features/settings/change-password-form";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";

async function getUserProfile(accessToken: string) {
    const url = `${process.env.API_SERVER_BASE_URL}/auth/me`;
    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!res.ok) {
            console.error(`Failed to fetch user profile ${url}: ${res.status} ${res.statusText}`);
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

export default async function SettingsPage() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect("/auth/login");
    }

    const userData = await getUserProfile(session.accessToken);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your personal information and security preferences.
                </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="profile">
                        <User className="mr-2 h-4 w-4" />
                        General Information
                    </TabsTrigger>
                    <TabsTrigger value="password">
                        <KeyRound className="mr-2 h-4 w-4" />
                        Change Password
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Profile Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {userData ? (
                                <div className="space-y-6">
                                    <EditProfileForm
                                        initialData={{
                                            name: userData.name || "",
                                            email: userData.email || ""
                                        }}
                                        userId={session.user.id}
                                    />
                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-medium mb-4">API Configuration</h3>
                                        <ApiKeyForm
                                            userId={session.user.id}
                                            hasKey={userData.hasGeminiKey || !!userData.geminiApiKeyMasked}
                                            maskedKey={userData.geminiApiKeyMasked}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-destructive">
                                    Failed to load user profile. Please try again later.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Secure your account by updating your password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChangePasswordForm userId={session.user.id} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
