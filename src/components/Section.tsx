import React from "react";

interface SectionProps {
  header: string;
  children: React.ReactNode;
  className?: string; // Optional prop for additional styling
}

const Section: React.FC<SectionProps> = ({ header, children, className }) => {
  return (
    <div className="p-6"> {/* Added padding around the section */}
      <section className={`w-full shadow rounded-lg p-2 ${className || ""}`}>
        <header className="flex items-center justify-between border-b border-gray-200 pb-2 mb-1">
          <h2 className="text-xl font-bold text-white">{header}</h2>
        </header>

        <div>{children}</div>
      </section>
    </div>
  );
};

export default Section;
