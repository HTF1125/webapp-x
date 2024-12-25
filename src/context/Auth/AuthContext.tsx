// src/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";


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
  console.log(`API: Attempting login at ${endpoint} with username: ${username}`);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API: Login failed:", errorData);
    throw new Error(errorData.message || "Login failed. Check your credentials.");
  }

  const data = await response.json();
  console.log("API: Login successful, received data:", data);
  return data;
};

// Function to fetch current user details
export const fetchCurrentUser = async (token: string): Promise<any> => {
  const endpoint = new URL("/api/login/users/me", NEXT_PUBLIC_API_URL).toString();
  console.log(`API: Fetching current user at ${endpoint} with token: ${token}`);

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API: Fetch current user failed:", errorData);
    throw new Error(errorData.message || "Failed to fetch user details.");
  }

  const user = await response.json();
  console.log("API: Current user fetched:", user);
  return user;
};

// Function to check if the user is an admin
export const fetchAdmin = async (token: string): Promise<{ isAdmin: boolean }> => {
  const endpoint = new URL("/api/login/user/isadmin", NEXT_PUBLIC_API_URL).toString();
  console.log(`API: Checking admin status at ${endpoint} with token: ${token}`);

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API: Fetch admin status failed:", errorData);
    throw new Error(errorData.message || "Failed to fetch admin status.");
  }

  const adminStatusRaw = await response.json();
  console.log("API: Admin status raw:", adminStatusRaw);

  // Transform the raw boolean into an object
  const adminStatus = { isAdmin: adminStatusRaw };
  console.log("API: Admin status wrapped:", adminStatus);

  return adminStatus;
};


// Define a proper User type based on your API response
interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to verify the token and fetch user details
  const verifyToken = useCallback(async (token: string) => {
    console.log("AuthContext: Verifying token:", token);
    try {
      // Fetch current user details
      const currentUser = await fetchCurrentUser(token);
      console.log("AuthContext: Current user fetched:", currentUser);
      setUser(currentUser);
      setIsAuthenticated(true);
      console.log("AuthContext: User authenticated:", true);

      // Fetch admin status
      const adminStatus = await fetchAdmin(token);
      console.log("AuthContext: Admin status fetched:", adminStatus);
      setIsAdmin(adminStatus.isAdmin);
      console.log("AuthContext: isAdmin set to:", adminStatus.isAdmin);
    } catch (error) {
      console.error("AuthContext: Token verification failed:", error);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUser(null);
      console.log("AuthContext: Authentication state reset due to token verification failure.");
      localStorage.removeItem("access_token");
    } finally {
      setLoading(false);
      console.log("AuthContext: Loading state set to false.");
    }
  }, []);

  // Initialize authentication state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("AuthContext: Initializing authentication state.");
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        console.log("AuthContext: Found stored token:", storedToken);
        await verifyToken(storedToken);
      } else {
        console.log("AuthContext: No stored token found.");
        setLoading(false);
        console.log("AuthContext: Loading state set to false.");
      }
    };

    initializeAuth();
  }, [verifyToken]);

  // Login function that authenticates the user and stores the token
  const login = useCallback(
    async (username: string, password: string) => {
      console.log(`AuthContext: Attempting to log in user: ${username}`);
      setLoading(true);
      try {
        const { access_token } = await fetchLogin(username, password);
        console.log("AuthContext: Received access_token:", access_token);
        localStorage.setItem("access_token", access_token);
        console.log("AuthContext: access_token stored in localStorage.");
        await verifyToken(access_token);
        console.log("AuthContext: User successfully logged in.");
      } catch (error: any) {
        console.error("AuthContext: Login error:", error);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
        console.log("AuthContext: Authentication state reset due to login failure.");
        throw new Error(error.message || "Failed to login.");
      } finally {
        setLoading(false);
        console.log("AuthContext: Loading state set to false after login attempt.");
      }
    },
    [verifyToken]
  );

  // Logout function that clears the authentication state and token
  const logout = useCallback(() => {
    console.log("AuthContext: Logging out user.");
    localStorage.removeItem("access_token");
    console.log("AuthContext: access_token removed from localStorage.");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    console.log("AuthContext: Authentication state reset after logout.");
  }, []);

  // Log changes to isAuthenticated
  useEffect(() => {
    console.log(`AuthContext: isAuthenticated changed to: ${isAuthenticated}`);
  }, [isAuthenticated]);

  // Log changes to isAdmin
  useEffect(() => {
    console.log(`AuthContext: isAdmin changed to: ${isAdmin}`);
  }, [isAdmin]);

  // Log changes to user
  useEffect(() => {
    console.log("AuthContext: User state changed to:", user);
  }, [user]);

  // Memoize the context value to optimize performance
  const contextValue: AuthContextProps = React.useMemo(
    () => ({
      isAuthenticated,
      isAdmin,
      login,
      logout,
      loading,
      user,
    }),
    [isAuthenticated, isAdmin, login, logout, loading, user]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
