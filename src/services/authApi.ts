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
  const res = await fetchData(rurl("/api/login/token"), {username, password}, {method: "POST",});
  localStorage.setItem("access_token", res.access_token);
  return res;
};

export const fetchCurrentUser = async (): Promise<User> => {
  return fetchData(rurl("/api/login/users/me"));
};


export const fetchAdmin = async (): Promise<{ isAdmin: boolean }> => {
  return fetchData(rurl("/api/login/user/isadmin"));
};