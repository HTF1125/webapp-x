// lib/api.ts

export interface ApiHealth {
    status: string;
  }

  export async function checkApiHealth(): Promise<ApiHealth> {
    const apiUrl = process.env.API_URL || '';
    try {
      const fullUrl = `${apiUrl}/api/health`;
      const response = await fetch(fullUrl, {
        next: { revalidate: 60 } // Revalidate every minute
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { status: data.status || "unknown" };
    } catch (error) {
      console.error("Error checking API health:", error);
      throw error; // Throw the error instead of returning a default value
    }
  }