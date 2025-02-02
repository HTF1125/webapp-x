"use client";
// ^ If using Next.js 13+ app router, declare this file as a client component
//   so that localStorage is only accessed in the browser.

import { fetchData, rurl } from "@/lib/apiClient";

// Define types based on your backend models
export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  username: string;
  is_admin: boolean;
  disabled?: boolean;
}

export interface UserIn {
  username: string;
  password: string;
}

/**
 * Log in a user by sending a POST request to the `/api/auth/token` endpoint.
 * @param username - The username of the user.
 * @param password - The password of the user.
 * @returns A promise that resolves to the login response (access token).
 */
export const fetchLogin = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const res = await fetchData(
      rurl("/api/auth/token"),
      { username, password },
      { method: "POST" }
    );

    // Guard localStorage usage - only if `window` is available
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", res.access_token);
    }

    return res;
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Login failed. Please check your credentials and try again.");
  }
};

/**
 * Fetch the current logged-in user by sending a GET request to the `/api/auth/me` endpoint.
 * @returns A promise that resolves to the current user.
 */
export const fetchCurrentUser = async (): Promise<User> => {
  try {
    return await fetchData(rurl("/api/auth/me"), undefined, {
      method: "GET",
    });
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    throw new Error("Failed to fetch current user. Please try again.");
  }
};

/**
 * Create a new user by sending a POST request to the `/api/auth/create` endpoint.
 * @param user - The user details (username and password).
 * @returns A promise that resolves to the created user.
 */
export const fetchCreateUser = async (user: UserIn): Promise<User> => {
  try {
    return await fetchData(
      rurl("/api/auth/create"),
      user,
      { method: "POST" }
    );
  } catch (error) {
    console.error("Failed to create user:", error);
    throw new Error("Failed to create user. Please try again.");
  }
};

/**
 * Refresh the access token by sending a POST request to the `/api/auth/refresh` endpoint.
 * @returns A promise that resolves to the new access token.
 */
export const fetchRefreshToken = async (): Promise<LoginResponse> => {
  try {
    const res = await fetchData(
      rurl("/api/auth/refresh"),
      undefined,
      { method: "POST" }
    );

    // Update the access token in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", res.access_token);
    }

    return res;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw new Error("Failed to refresh token. Please log in again.");
  }
};
