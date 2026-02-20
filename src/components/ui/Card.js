import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`p-4 bg-white rounded-2xl shadow-md ${className}`}>
      {children}
    </div>
  );
}