// lib/api/regime.ts

export interface Regime {
    _id: string;
    code: string;
    data: Record<string, string>;
  }

  export async function fetchRegimes(): Promise<Regime[]> {
    const apiUrl = process.env.API_URL || '';
    try {
      const fullUrl = `${apiUrl}/api/data/regimes`;
      const response = await fetch(fullUrl, {
        next: { revalidate: 10800 } // 3 hours in seconds
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as Regime[];
    } catch (error) {
      console.error("Error fetching regimes:", error);
      throw error;
    }
  }