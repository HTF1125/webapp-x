// app/regimes/api.ts
export interface Regime {
  _id: string;
  code: string;
  data: Record<string, string>;
}

export async function fetchRegimes(): Promise<Regime[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const fullUrl = `${apiUrl}/api/data/regimes`;

  try {
    const response = await fetch(fullUrl, {
      next: { revalidate: 10800 } // 3 hours in seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as Regime[];
  } catch (error) {
    console.error("Error fetching regimes:", error);
    throw error;
  }
}
