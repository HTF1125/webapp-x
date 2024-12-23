// src/components/FloatingTaskList.tsx
import React from "react";
import { useProgress, Task } from "./ProgressContext";
import FloatingTask from "./FloatingTask";

const FloatingTaskList: React.FC = () => {
  const { tasks, removeTask } = useProgress();

  // Inline styles for the task list container
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
    zIndex: 1000, // Ensure it appears above other elements
  };

  return (
    <div style={containerStyle}>
      {tasks.map((task: Task) => (
        <FloatingTask key={task.id} task={task} removeTask={removeTask} />
      ))}
    </div>
  );
};

export default FloatingTaskList;
