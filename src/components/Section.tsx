import React from "react";

interface SectionProps {
  header: string;
  children: React.ReactNode;
  className?: string; // Optional prop for additional styling
}

const Section: React.FC<SectionProps> = ({ header, children, className }) => {
  return (
    <div className="p-2 w-full"> {/* Reduced outer padding */}
      <section
        className={`w-full shadow-md p-4 ${className || ""}`} // Reduced padding and adjusted shadow
      >
        <header className="flex items-center justify-between border-b border-gray-600 pb-2 mb-2"> {/* Reduced padding and margin */}
          <h2 className="text-lg font-medium text-white">{header}</h2> {/* Adjusted font size and weight */}
        </header>
        <div className="text-sm text-gray-300">{children}</div> {/* Adjusted font size and color */}
      </section>
    </div>
  );
};

export default Section;
