import React from "react";

interface SectionProps {
  header: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ header, children, className }) => {
  return (
    <div className={`w-full p-3 ${className || ""}`}>
      <section className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
        {/* Header */}
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
            {header}
          </h2>
        </header>

        {/* Content */}
        <div className="space-y-3 text-gray-300 text-sm">{children}</div>
      </section>
    </div>
  );
};

export default Section;
