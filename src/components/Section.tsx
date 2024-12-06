import React from "react";

interface SectionProps {
  header: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ header, children, className }) => {
  return (
    <div className="p-2 w-full h-full flex-grow">
      <section
        className={`h-full rounded-md shadow-lg p-6 flex flex-col ${className || ""}`}
      >
        <header className="border-b border-gray-600 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-white">{header}</h2>
        </header>
        <div className="flex-1 overflow-auto">{children}</div>
      </section>
    </div>
  );
};

export default Section;
