import { getSession } from "@/lib/session";
import { User } from "@/types/user";

export async function getCurrentUser(): Promise<User | null> {
    const session = await getSession();
    if (!session?.accessToken) return null;

    try {
        const url = `${process.env.API_SERVER_BASE_URL}/auth/me`;
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
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
        console.error("Error fetching current user:", error);
        return null;
    }
}
