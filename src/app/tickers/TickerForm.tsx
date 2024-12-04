"use client";

import React from "react";
import { TickerInfo } from "@/api/all";

interface TickerFormProps {
  formData: Partial<TickerInfo>;
  isEditing: boolean;
  onChange: (field: keyof TickerInfo, value: string) => void;
}

export default function TickerForm({
  formData,
  isEditing,
  onChange,
}: TickerFormProps) {
  const renderField = (
    label: string,
    field: keyof TickerInfo,
    type = "text"
  ) => (
    <div className="mb-4">
      <label className="block text-sm text-gray-400">{label}</label>
      <input
        type={type}
        name={field}
        value={formData[field] || ""}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full p-2 bg-black text-white rounded-md"
        readOnly={!isEditing}
      />
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* General Information */}
      <div className="flex-1 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-6 border-b pb-2">
          General Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField("Ticker Code", "code")}
          {renderField("Name", "name")}
          {renderField("Exchange", "exchange")}
          {renderField("Market", "market")}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="flex-1 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-6 border-b  pb-2">
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField("Bloomberg", "bloomberg")}
          {renderField("FRED", "fred")}
          {renderField("Yahoo", "yahoo")}
          <div className="col-span-1 sm:col-span-2">
            {renderField("Remarks", "remark", "textarea")}
          </div>
        </div>
      </div>
    </div>
  );
}
