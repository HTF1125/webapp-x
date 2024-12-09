import React from "react";

interface SectionProps {
  header: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ header, children, className }) => {
  return (
    <div className={`w-full p-4 ${className || ""}`}>
      <section className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-6">
        {/* Header */}
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-white border-b-2 border-blue-500 pb-2">
            {header}
          </h2>
        </header>

        {/* Content */}
        <div className="space-y-4">{children}</div>
      </section>
    </div>
  );
};

export default Section;
