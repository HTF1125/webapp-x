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

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Login failed. Check your credentials."
    );
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
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch user details.");
  }

  return response.json();
};

// Function to check if the user is an admin
export const fetchAdmin = async (
  token: string
): Promise<{ isAdmin: boolean }> => {
  const endpoint = new URL("/api/login/user/isadmin", NEXT_PUBLIC_API_URL).toString();

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch admin status.");
  }

  const isAdmin = await response.json();
  return { isAdmin };
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

  // Verify token and fetch user details
  const verifyToken = useCallback(async (token: string) => {
    try {
      const currentUser = await fetchCurrentUser(token);
      setUser(currentUser);
      setIsAuthenticated(true);

      const adminStatus = await fetchAdmin(token);
      setIsAdmin(adminStatus.isAdmin);
    } catch (error) {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUser(null);
      localStorage.removeItem("access_token");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize authentication state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        await verifyToken(storedToken);
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [verifyToken]);

  // Login function
  const login = useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      try {
        const { access_token } = await fetchLogin(username, password);
        localStorage.setItem("access_token", access_token);
        await verifyToken(access_token);
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [verifyToken]
  );

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  }, []);

  // Memoize context value
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
