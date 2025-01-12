const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const rurl = (url: string) => {
  console.log(NEXT_PUBLIC_API_URL, process.env.NEXT_PUBLIC_API_URL);
  return new URL(url, NEXT_PUBLIC_API_URL).toString();
};

/**
 * Unified request handler
 * @param url Request path
 * @param params Request parameters
 * @param options Fetch configuration
 * @returns Promise
 */
export const fetchData = async (
  url: string,
  params: Record<string, any> = {},
  options: RequestInit = {}
) => {
  // Setup default options
  const defaultOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Guard against `localStorage` usage in SSR
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("access_token");
  }

  if (token) {
    (defaultOptions.headers as Record<string, string>)["Authorization"] =
      "Bearer " + token;
  }

  // Merge user-provided options
  const newOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...(defaultOptions.headers ?? {}),
      ...(options.headers ?? {}),
    },
  };

  // Handle GET parameters
  if (
    newOptions.method &&
    newOptions.method.toUpperCase() === "GET" &&
    params &&
    Object.keys(params).length > 0
  ) {
    const queryString = new URLSearchParams(params).toString();
    url += (url.includes("?") ? "&" : "?") + queryString;
  }

  // Handle non-GET request body
  if (
    newOptions.method &&
    newOptions.method.toUpperCase() !== "GET" &&
    params &&
    (newOptions.headers as Record<string, string>)["Content-Type"] ===
      "application/json"
  ) {
    newOptions.body = JSON.stringify(params);
  }

  const response = await fetch(url, newOptions);
  if (!response.ok) {
    const errorData = await resolveResponse(response);
    throw new Error(errorData?.message || "Request failed. Please try again.");
  }

  return resolveResponse(response);
};

function resolveResponse(response: Response) {
  const contentType = (response.headers.get("Content-Type") ?? "")
    .split(";")[0]
    .toLowerCase();

  if (contentType.includes("application/json")) {
    return response.json();
  } else if (contentType.includes("text/")) {
    return response.text();
  } else if (contentType.includes("application/octet-stream")) {
    return response.blob();
  } else {
    return response;
  }
}
