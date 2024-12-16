"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchAdmin } from "@/api/login";

interface AuthContextProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Helper Functions for Cookies
  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; path=/; secure; SameSite=Strict; expires=${expires}`;
  };

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
  };

  const removeCookie = (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  };

  // Initialize Authentication Status
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const token = getCookie("authToken");
        if (token) {
          setIsAuthenticated(true);

          const adminStatus = await fetchAdmin(token);
          if (isMounted) {
            setIsAdmin(adminStatus);
          }
        }
      } catch (error) {
        console.error("Error initializing authentication:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, []);

  // Login Function
  const login = async (token: string) => {
    try {
      setCookie("authToken", token, 7); // Store token for 7 days
      setIsAuthenticated(true);

      const adminStatus = await fetchAdmin(token);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error("Error during login:", error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  // Logout Function
  const logout = () => {
    try {
      removeCookie("authToken");
      setIsAuthenticated(false);
      setIsAdmin(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
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
