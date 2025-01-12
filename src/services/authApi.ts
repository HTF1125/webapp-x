"use client";
// ^ If using Next.js 13+ app router, declare this file as a client component
//   so that localStorage is only accessed in the browser.

import { fetchData, rurl } from "@/lib/apiClient";

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
  // This call is done in the client, so localStorage is safe here.
  const res = await fetchData(
    rurl("/api/login/token"),
    { username, password },
    { method: "POST" }
  );

  // Guard localStorage usage - only if `window` is available
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", res.access_token);
  }

  return res;
};

export const fetchCurrentUser = async (): Promise<User> => {
  // This call does not directly use localStorage here, so it should be fine.
  // However, if `fetchData` internally uses localStorage, it must also be guarded.
  return fetchData(rurl("/api/login/users/me"));
};

export const fetchAdmin = async (): Promise<{ isAdmin: boolean }> => {
  // Same comment as above for fetchCurrentUser
  return fetchData(rurl("/api/login/user/isadmin"));
};
