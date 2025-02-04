"use client";

import {
  fetchCurrentUser,
  fetchLogin,
  fetchRefreshToken,
  User,
} from "@/services/authApi";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

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

  const isVerifyingRef = useRef(false);
  const isRefreshingRef = useRef(false);

  // Reset authentication state and remove token from localStorage
  const resetAuthState = useCallback(() => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem("access_token");
  }, []);

  // Verify the token and fetch the current user
  const verifyToken = useCallback(async () => {
    if (isVerifyingRef.current) return;
    isVerifyingRef.current = true;

    const token = localStorage.getItem("access_token");
    if (!token) {
      resetAuthState();
      setLoading(false);
      isVerifyingRef.current = false;
      return;
    }

    try {
      const user = await fetchCurrentUser();
      setUser(user);
      setIsAuthenticated(true);
      setIsAdmin(user.is_admin);
    } catch (error) {
      console.error("Token verification failed:", error);
      resetAuthState();
    } finally {
      setLoading(false);
      isVerifyingRef.current = false;
    }
  }, [resetAuthState]);

  // Refresh the access token if it expires
  const refreshToken = useCallback(async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;

    try {
      const refreshResponse = await fetchRefreshToken();
      localStorage.setItem("access_token", refreshResponse.access_token);
      await verifyToken();
    } catch (error) {
      console.error("Token refresh failed:", error);
      resetAuthState();
    } finally {
      isRefreshingRef.current = false;
    }
  }, [verifyToken, resetAuthState]);

  // Login function
  const login = useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      try {
        const loginResponse = await fetchLogin(username, password);
        localStorage.setItem("access_token", loginResponse.access_token);
        await verifyToken();
      } catch (error) {
        resetAuthState();
        console.error("Login failed:", error);
        throw new Error(
          "Login failed. Please check your credentials and try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [verifyToken, resetAuthState]
  );

  // Logout function
  const logout = useCallback(() => {
    resetAuthState();
  }, [resetAuthState]);

  // Check token validity on initial load and periodically
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkTokenValidity = async () => {
      await verifyToken();
      // Set up a periodic token refresh (e.g., every 60 minutes)
      intervalId = setInterval(refreshToken, 60 * 60 * 1000);
    };

    checkTokenValidity();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []); // Empty dependency array

  const contextValue = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
