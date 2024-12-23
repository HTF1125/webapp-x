// src/context/Progress/ProgressContext.tsx
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import FloatingTaskList from "./FloatingTaskList";

// Define the structure of a Task
export interface Task {
  id: string;
  name: string;
  completed: boolean;
  progress: number;
  createdAt: Date;
  error?: string; // Optional error message
}

// Define the actions for the reducer
type Action =
  | { type: "ADD_TASK"; payload: { id: string; name: string } }
  | { type: "UPDATE_TASK"; payload: { id: string; newProgress: number } }
  | { type: "SET_TASK_ERROR"; payload: { id: string; error: string } }
  | { type: "REMOVE_TASK"; payload: { id: string } }
  | { type: "SET_TASKS"; payload: { tasks: Task[] } };

// Define the context value structure
interface ProgressContextValue {
  tasks: Task[];
  addTask: (name: string) => string;
  updateTask: (id: string, newProgress: number) => void;
  setTaskError: (id: string, error: string) => void;
  removeTask: (id: string) => void;
}

// Create the context
const ProgressContext = createContext<ProgressContextValue | undefined>(
  undefined
);

// Reducer function to manage task state
const taskReducer = (state: Task[], action: Action): Task[] => {
  console.log("Dispatching action:", action); // For debugging
  switch (action.type) {
    case "ADD_TASK":
      const newTask: Task = {
        id: action.payload.id,
        name: action.payload.name,
        completed: false,
        progress: 0,
        createdAt: new Date(),
      };
      return [...state, newTask];

    case "UPDATE_TASK":
      return state.map((task) =>
        task.id === action.payload.id
          ? {
              ...task,
              progress: Math.min(Math.max(action.payload.newProgress, 0), 100),
              completed: action.payload.newProgress >= 100,
              error: undefined, // Reset error on progress update
            }
          : task
      );

    case "SET_TASK_ERROR":
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, error: action.payload.error, progress: 100, completed: true }
          : task
      );

    case "REMOVE_TASK":
      return state.filter((task) => task.id !== action.payload.id);

    case "SET_TASKS":
      return action.payload.tasks;

    default:
      return state;
  }
};

// Define provider props
interface ProgressProviderProps {
  children: ReactNode;
}

// ProgressProvider Component
export const ProgressProvider: React.FC<ProgressProviderProps> = ({
  children,
}) => {
  const [tasks, dispatch] = useReducer(taskReducer, []);

  // Load tasks from localStorage on client-side
  useEffect(() => {
    if (typeof window === "undefined") return; // Skip if SSR

    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        const parsedTasks: Task[] = JSON.parse(storedTasks, (key, value) => {
          if (key === "createdAt") return new Date(value);
          return value;
        });
        dispatch({ type: "SET_TASKS", payload: { tasks: parsedTasks } });
      } catch (error) {
        console.error("Failed to parse tasks from localStorage:", error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined") return; // Skip if SSR

    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage:", error);
    }
  }, [tasks]);

  // Define context functions with useCallback to memoize them
  const addTask = useCallback((name: string): string => {
    const id = uuidv4();
    dispatch({ type: "ADD_TASK", payload: { id, name } });
    return id;
  }, []);

  const updateTask = useCallback(
    (id: string, newProgress: number): void => {
      dispatch({ type: "UPDATE_TASK", payload: { id, newProgress } });
    },
    []
  );

  const setTaskError = useCallback(
    (id: string, error: string): void => {
      dispatch({ type: "SET_TASK_ERROR", payload: { id, error } });
    },
    []
  );

  const removeTask = useCallback((id: string): void => {
    dispatch({ type: "REMOVE_TASK", payload: { id } });
  }, []);

  // Memoize the context value to optimize performance
  const contextValue = useMemo(
    () => ({ tasks, addTask, updateTask, setTaskError, removeTask }),
    [tasks, addTask, updateTask, setTaskError, removeTask]
  );

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
      <FloatingTaskList />
    </ProgressContext.Provider>
  );
};

// Custom hook to use the ProgressContext
export const useProgress = (): ProgressContextValue => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};
