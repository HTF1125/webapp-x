"use client"

import { NEXT_PUBLIC_API_URL } from "@/config";

// Interface for the login response
export interface LoginResponse {
  access_token: string;
}

// Function to handle user login
export const fetchLogin = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const endpoint = new URL("/api/login/token", NEXT_PUBLIC_API_URL).toString();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed. Check your credentials.");
  }

  return response.json();
};

// Function to fetch current user details
export const fetchCurrentUser = async (token: string): Promise<any> => {
  const endpoint = new URL("/api/login/users/me", NEXT_PUBLIC_API_URL).toString();

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user details.");
  }

  return response.json();
};

// Function to check if the user is an admin
export const fetchAdmin = async (token: string): Promise<{ isAdmin: boolean }> => {
  const endpoint = new URL("/api/login/user/isadmin", NEXT_PUBLIC_API_URL).toString();

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin status.");
  }

  return response.json();
};
