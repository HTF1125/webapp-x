// components/DashboardClient.tsx

'use client';

import React, { useState } from "react";
import { format, subDays, isWeekend } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PerformanceTable from "./PerformanceTable";
import { PeriodPerformances } from "./api";

interface TableData {
  data: PeriodPerformances[];
  title: string;
}

interface DashboardClientProps {
  initialTables: TableData[];
  initialDate: Date;
}

function getPreviousWorkday(date: Date): Date {
  let previousDay = subDays(date, 1);
  while (isWeekend(previousDay)) {
    previousDay = subDays(previousDay, 1);
  }
  return previousDay;
}

export default function DashboardClient({ initialTables, initialDate }: DashboardClientProps) {
  const [date, setDate] = useState<Date>(getPreviousWorkday(initialDate));
  const [tables, setTables] = useState<TableData[]>(initialTables);

  const handleDateChange = async (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      // Here you would typically fetch new data based on the selected date
      // For now, we'll just use the initial data
      setTables(initialTables);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Market Performance Dashboard</h1>
        <div className="mb-6 flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <span className="text-sm text-gray-600 dark:text-gray-400">Last updated: {format(new Date(), "PPP")}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
          {tables.map((table, index) => (
            <PerformanceTable key={index} data={table.data} title={table.title} />
          ))}
        </div>
      </div>
    </div>
  );
}