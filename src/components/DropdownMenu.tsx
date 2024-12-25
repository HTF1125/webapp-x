import React, { useEffect, useRef } from "react";

interface DropdownAction {
  label: string;
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void | Promise<void>;
}

interface DropdownMenuProps {
  actions: DropdownAction[];
  closeDropdown: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ actions, closeDropdown }) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&  // Clicked outside dropdown
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)        // Clicked outside button
      ) {
        closeDropdown();  // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);  // Cleanup the listener
    };
  }, [closeDropdown]);  // Only re-run if closeDropdown changes

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-44 bg-slate-800 text-white rounded-lg shadow-xl z-50"
      style={{ top: "100%", right: "0" }}
    >
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.stopPropagation();  // Prevent event bubbling
            closeDropdown();  // Close dropdown after action
            action.onClick(e);  // Execute the action's onClick handler
          }}
          className="block w-full text-left px-4 py-2 hover:bg-slate-700"
        >
          {action.icon}
          <span className="inline-block ml-2">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default DropdownMenu;
