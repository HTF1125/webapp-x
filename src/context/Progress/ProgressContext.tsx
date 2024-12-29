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


const FloatingTask: React.FC<{ task: Task }> = ({ task }) => {
  const { removeTask } = useProgress();

  useEffect(() => {
    if (task.completed && task.autoClearTime) {
      const timer = setTimeout(() => {
        removeTask(task.id);
      }, task.autoClearTime * 1000);
      return () => clearTimeout(timer);
    }
  }, [task, removeTask]);

  const taskStyle: React.CSSProperties = {
    backgroundColor: "#2D3748",
    border: task.error
      ? "2px solid #e53e3e"
      : task.completed
      ? "2px solid #4caf50"
      : "1px solid #4a5568",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    color: "#F7FAFC",
  };

  return (
    <div style={taskStyle}>
      <div>{task.name}</div>
      {task.error && <div style={{ color: "#e53e3e" }}>{task.error}</div>}
      {task.completed && !task.autoClearTime && (
        <button
          onClick={() => removeTask(task.id)}
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          OK
        </button>
      )}
    </div>
  );
};

const FloatingTaskList: React.FC = () => {
  const { tasks } = useProgress();

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "300px",
    maxHeight: "80vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    zIndex: 1000,
  };

  return (
    <div style={containerStyle}>
      {tasks.map((task: Task) => (
        <FloatingTask key={task.id} task={task} />
      ))}
    </div>
  );
};

// Define the structure of a Task
export interface Task {
  id: string;
  name: string;
  completed: boolean;
  createdAt: Date;
  error?: string; // Optional error message
  autoClearTime?: number; // Optional auto-clear time in seconds
}

// Define the actions for the reducer
type Action =
  | {
      type: "ADD_TASK";
      payload: { id: string; name: string; autoClearTime?: number };
    }
  | { type: "UPDATE_TASK"; payload: { id: string; completed: boolean } }
  | { type: "SET_TASK_ERROR"; payload: { id: string; error: string } }
  | { type: "REMOVE_TASK"; payload: { id: string } }
  | { type: "SET_TASKS"; payload: { tasks: Task[] } };

// Define the context value structure
interface ProgressContextValue {
  tasks: Task[];
  addTask: (name: string, autoClearTime?: number) => string;
  updateTask: (id: string, completed: boolean) => void;
  setTaskError: (id: string, error: string) => void;
  removeTask: (id: string) => void;
}

// Create the context
const ProgressContext = createContext<ProgressContextValue | undefined>(
  undefined
);

// Reducer function to manage task state
const taskReducer = (state: Task[], action: Action): Task[] => {
  switch (action.type) {
    case "ADD_TASK":
      const newTask: Task = {
        id: action.payload.id,
        name: action.payload.name,
        completed: false,
        createdAt: new Date(),
        autoClearTime: action.payload.autoClearTime,
      };
      return [...state, newTask];

    case "UPDATE_TASK":
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, completed: action.payload.completed, error: undefined }
          : task
      );

    case "SET_TASK_ERROR":
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, error: action.payload.error, completed: true }
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
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage:", error);
    }
  }, [tasks]);

  const addTask = useCallback(
    (name: string, autoClearTime?: number): string => {
      const id = uuidv4();
      dispatch({ type: "ADD_TASK", payload: { id, name, autoClearTime } });
      return id;
    },
    []
  );

  const updateTask = useCallback(
    (id: string, completed: boolean): void => {
      dispatch({ type: "UPDATE_TASK", payload: { id, completed } });

      const task = tasks.find((t) => t.id === id);
      if (completed && task?.autoClearTime) {
        setTimeout(() => {
          dispatch({ type: "REMOVE_TASK", payload: { id } });
        }, task.autoClearTime * 1000);
      }
    },
    [tasks]
  );

  const setTaskError = useCallback((id: string, error: string): void => {
    dispatch({ type: "SET_TASK_ERROR", payload: { id, error } });

    setTimeout(() => {
      dispatch({ type: "REMOVE_TASK", payload: { id } });
    }, 2000);
  }, []);

  const removeTask = useCallback((id: string): void => {
    dispatch({ type: "REMOVE_TASK", payload: { id } });
  }, []);

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
