"use server";

import { redirect } from "next/navigation";

import { createSession, deleteSession } from "./session";
import { FormState, LoginFormSchema } from "./type";

export async function signIn(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const url = `${process.env.API_SERVER_BASE_URL}/auth/login`;
  console.log("Attempting login to:", url);

  let shouldRedirect = false;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    console.log("Login response status:", response.status);

    if (response.ok) {
      const result = await response.json();
      // TODO: Create The Session For Authenticated User.

      const accessToken = result.accessToken || result.access_token;
      const refreshToken = result.refreshToken || result.refresh_token;

      await createSession({
        user: {
          id: String(result.user?.id),
          name: result.user?.name || "User",
        },
        accessToken,
        refreshToken,
      });
      shouldRedirect = true;
    } else {
      const errorText = await response.text();
      console.error("Login failed:", errorText);
      return {
        message:
          response.status === 401 ? "Invalid Credentials!" : `Login failed: ${response.statusText}`,
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      message: "Something went wrong. Please try again.",
    };
  }

  if (shouldRedirect) {
    redirect("/dashboard");
  }
}

export const refreshToken = async (oldRefreshToken: string) => {
  try {
    const response = await fetch(
      `${process.env.API_SERVER_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: oldRefreshToken,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to refresh token" + response.statusText);
    }

    const result = await response.json();
    const accessToken = result.accessToken || result.access_token;
    const refreshToken = result.refreshToken || result.refresh_token;

    // update session with new tokens
    const updateRes = await fetch("http://localhost:3000/api/auth/update", {
      method: "POST",
      body: JSON.stringify({
        accessToken,
        refreshToken,
      }),
    });
    if (!updateRes.ok) throw new Error("Failed to update the tokens");

    return accessToken;
  } catch (err) {
    console.error("Refresh Token failed:", err);
    return null;
  }
};

export async function signOut() {
  await deleteSession();
  redirect("/auth/login");
}
