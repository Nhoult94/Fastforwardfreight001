import { ReactNode } from "react";

export function Button({ children, onClick, className = "" }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded ${className}`}
    >
      {children}
    </button>
  );
}
