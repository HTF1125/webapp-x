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
  const endpoint = new URL("/api/login/users/me", NEXT_PUBLIC_API_URL).toString();

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  console.log(response)

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData?.message || "Failed to fetch user details. Please try again."
    );
  }

  return response.json();
};
