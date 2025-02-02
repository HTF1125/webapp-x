"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/Auth/AuthContext";
import { FaGoogle, FaFacebook} from "react-icons/fa";

const SignInPage: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(credentials.username, credentials.password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Welcome Back
        </h1>
        <p className="text-sm text-center mb-8 text-gray-300">
          Sign in to access your account
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Input */}
          <div className="relative">
            <input
              id="username"
              type="text"
              value={credentials.username}
              onChange={handleChange}
              onFocus={() => setFocusedInput("username")}
              onBlur={() => setFocusedInput(null)}
              className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 ease-in-out"
              placeholder={focusedInput === "username" ? "" : "Username"}
              required
              aria-label="Username"
            />
            <label
              htmlFor="username"
              className={`absolute left-4 top-3 text-gray-400 transition-all duration-200 ease-in-out ${
                focusedInput === "username" || credentials.username
                  ? "text-xs -top-4 bg-gray-800 px-1"
                  : ""
              }`}
            >
              Username
            </label>
          </div>
          {/* Password Input */}
          <div className="relative">
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
              className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 ease-in-out"
              placeholder={focusedInput === "password" ? "" : "Password"}
              required
              aria-label="Password"
            />
            <label
              htmlFor="password"
              className={`absolute left-4 top-3 text-gray-400 transition-all duration-200 ease-in-out ${
                focusedInput === "password" || credentials.password
                  ? "text-xs -top-4 bg-gray-800 px-1"
                  : ""
              }`}
            >
              Password
            </label>
          </div>
          {/* Error Message */}
          {error && (
            <div
              className="text-sm text-center text-red-400 bg-red-900/20 py-2 px-4 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
              loading
                ? "bg-indigo-500/50 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            }`}
            disabled={loading}
            aria-label={loading ? "Signing in..." : "Sign In"}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Social Login Buttons */}
        <div className="mt-8 flex flex-col space-y-4">
          <button
            className="flex items-center justify-center bg-white text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Sign in with Google"
          >
            <FaGoogle className="mr-2" /> Sign in with Google
          </button>
          <button
            className="flex items-center justify-center bg-blue-600 py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Sign in with Facebook"
          >
            <FaFacebook className="mr-2" /> Sign in with Facebook
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="mt-8 text-sm text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            aria-label="Sign up"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
