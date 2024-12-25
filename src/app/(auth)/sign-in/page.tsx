// app/sign-in/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Updated import for app directory
import { useAuth } from "@/context/Auth/AuthContext"; // Updated import

const SignInPage: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter(); // Updated to next/navigation
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(username, password); // Pass username and password to AuthContext's login
      router.push("/"); // Redirect to home page after login
    } catch (err: any) {
      setError(err.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-extrabold text-center mb-4 text-indigo-400">
          Welcome Back
        </h2>
        <p className="text-sm text-center mb-6 text-gray-400">
          Sign in to your account
        </p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-center text-sm">{error}</p>
          )}
          <button
            type="submit"
            className={`w-full py-3 px-6 rounded-lg font-semibold focus:outline-none ${
              loading
                ? "bg-indigo-500 cursor-not-allowed opacity-50"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Do not have an account?
          <Link
            href="/sign-up"
            className="text-indigo-400 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
