"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface LoginResponse {
  access_token: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
}

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
    throw new Error(errorData?.message || "Login failed. Please try again.");
  }

  return response.json();
};

export const fetchCurrentUser = async (token: string): Promise<User> => {
  const endpoint = new URL(
    "/api/login/users/me",
    NEXT_PUBLIC_API_URL
  ).toString();

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  console.log(response);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData?.message || "Failed to fetch user details. Please try again."
    );
  }

  return response.json();
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const resetAuthState = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem("access_token");
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const { access_token } = await fetchLogin(username, password);
      localStorage.setItem("access_token", access_token);
      await verifyToken();
    } catch (error) {
      resetAuthState();
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    resetAuthState();
  };

  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      resetAuthState();
      setLoading(false);
      return;
    }

    try {
      const user = await fetchCurrentUser(token);
      // const adminStatus = await fetchAdmin(token);
      setUser(user);
      setIsAuthenticated(true);
      setIsAdmin(user.is_admin);
    } catch (error) {
      console.error(error);
      resetAuthState();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
