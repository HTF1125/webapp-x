

import { fetchData, rurl } from "@/lib/apiClient";




export const callDailyTask = async (): Promise<{ message: string }> => {
    try {
      const response = await fetchData(rurl("/api/tasks/daily"));
  
      if (!response.ok) {
        throw new Error("Failed to trigger the background task");
      }
  
      const data = await response.json();
      return data; // This will return the message from the backend: { message: "Task is running in the background" }
    } catch (error) {
      console.error("Error triggering daily task:", error);
      throw error; // You can handle this error as needed, e.g., show a notification
    }
  };
  