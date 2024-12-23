// src/components/FloatingTask.tsx
import React from "react";
import { Task } from "./ProgressContext";

interface FloatingTaskProps {
  task: Task;
  removeTask: (id: string) => void;
}

const FloatingTask: React.FC<FloatingTaskProps> = ({ task, removeTask }) => {
  const handleOk = () => {
    removeTask(task.id);
  };

  // Inline styles for the task container
  const taskStyle: React.CSSProperties = {
    backgroundColor: "#2D3748", // Dark background
    border: task.error
      ? "2px solid #e53e3e" // Red border for error
      : task.completed
      ? "2px solid #4caf50" // Green border for completed
      : "1px solid #4a5568", // Darker border for in-progress
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, opacity 0.3s ease",
    opacity: 1,
    color: "#F7FAFC", // Light text
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  };

  const taskNameStyle: React.CSSProperties = {
    fontWeight: "bold",
    fontSize: "16px",
  };

  const taskProgressStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#CBD5E0",
  };

  const progressBarStyle: React.CSSProperties = {
    width: "100%",
    height: "10px",
    borderRadius: "5px",
    backgroundColor: "#4a5568",
    overflow: "hidden",
  };

  const progressFillStyle: React.CSSProperties = {
    height: "100%",
    borderRadius: "5px",
    backgroundColor: task.error
      ? "#e53e3e"
      : task.completed
      ? "#4caf50"
      : "#3182ce",
    width: `${task.progress}%`,
    transition: "width 0.5s ease",
  };

  const completedStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const errorStyle: React.CSSProperties = {
    color: "#e53e3e",
    fontSize: "14px",
    marginTop: "10px",
  };

  const okButtonStyle: React.CSSProperties = {
    backgroundColor: task.error ? "#e53e3e" : "#4caf50",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const buttonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (task.error) {
      (e.target as HTMLButtonElement).style.backgroundColor = "#c53030";
    } else {
      (e.target as HTMLButtonElement).style.backgroundColor = "#45a049";
    }
  };

  const buttonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (task.error) {
      (e.target as HTMLButtonElement).style.backgroundColor = "#e53e3e";
    } else {
      (e.target as HTMLButtonElement).style.backgroundColor = "#4caf50";
    }
  };

  return (
    <div style={taskStyle}>
      <div style={headerStyle}>
        <span style={taskNameStyle}>{task.name}</span>
        {!task.completed && !task.error && (
          <span style={taskProgressStyle}>{task.progress}%</span>
        )}
      </div>
      {!task.completed && !task.error ? (
        <div style={progressBarStyle}>
          <div style={progressFillStyle}></div>
        </div>
      ) : task.error ? (
        <div style={errorStyle}>{task.error}</div>
      ) : (
        <div style={completedStyle}>
          <span>Completed!</span>
          <button
            onClick={handleOk}
            style={okButtonStyle}
            onMouseOver={buttonHover}
            onMouseOut={buttonLeave}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingTask;
