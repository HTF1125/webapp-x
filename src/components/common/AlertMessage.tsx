import React from "react";

const AlertMessage = ({ message, type }: { message: string; type: "success" | "error" }) => {
    const className = type === "success" ? "alert-success" : "alert-error";
    return <div className={className}>{message}</div>;
};

export default AlertMessage;
