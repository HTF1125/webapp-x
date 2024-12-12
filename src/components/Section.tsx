"use client";

import React from "react";

interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, subtitle, children, className }) => {
  return (
    <section className={`py-8 px-4 md:px-8 lg:px-12 ${className || ""}`}>
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100">{title}</h2>
        {subtitle && <p className="text-gray-200">{subtitle}</p>}
      </header>
      <div className="flex flex-col space-y-4">{children}</div>
    </section>
  );
};

export default Section;
