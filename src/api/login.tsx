import { NEXT_PUBLIC_API_URL } from "@/config";

export const fetchLogin = async (
  username: string,
  password: string
): Promise<{ access_token: string }> => {
  const endpoint = new URL("/api/login/token", NEXT_PUBLIC_API_URL).toString();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed. Check your credentials.");
  }

  return response.json();
};

export const fetchCurrentUser = async (token: string): Promise<any> => {
  const endpoint = new URL(
    "/api/login/users/me",
    NEXT_PUBLIC_API_URL
  ).toString();

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user details.");
  }

  return response.json();
};

export const fetchAdmin = async (token: string): Promise<any> => {
  const endpoint = new URL(
    "/api/login/user/isadmin",
    NEXT_PUBLIC_API_URL
  ).toString();

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user details.");
  }

  return response.json();
};
