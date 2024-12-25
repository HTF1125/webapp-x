import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchBackendTask } from "./CallBackend";  // Assuming fetchBackendTask is defined in CallBackend.ts

interface TaskContextType {
  isTaskRunning: boolean;
  startTask: () => void;
  stopTask: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

// Add type for 'children' prop here
interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [isTaskRunning, setIsTaskRunning] = useState(false);

  const startTask = async () => {
    setIsTaskRunning(true);
    try {
      // Call the backend API to start the task
      await fetchBackendTask();
      console.log("Task started and API called");
    } catch (error) {
      console.error("Error starting the task:", error);
    }
  };

  const stopTask = () => {
    setIsTaskRunning(false);
    // Logic to stop the task (if necessary)
    console.log("Task stopped");
  };

  useEffect(() => {
    // Automatically trigger the task every hour
    const interval = setInterval(() => {
      startTask();
    }, 1000 * 60 * 60); // Every hour

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <TaskContext.Provider value={{ isTaskRunning, startTask, stopTask }}>
      {children}
    </TaskContext.Provider>
  );
};
