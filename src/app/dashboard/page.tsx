"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  fetchPeriodPerformances,
  PeriodPerformances,
} from "@/lib/api/period-performance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableData {
  data: PeriodPerformances[];
  title: string;
}

function PerformanceTable({ data, title }: TableData) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full">
      <h2 className="text-lg font-semibold p-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
        {title}
      </h2>
      <div className="overflow-x-auto">
        <Table className="w-full text-xs"> {/* Changed to text-xs for smaller font */}
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
              <TableHead className="text-left px-2 py-2 font-semibold dark:text-gray-300 whitespace-nowrap">Index</TableHead>
              <TableHead className="text-right px-2 py-2 font-semibold dark:text-gray-300 whitespace-nowrap">Level</TableHead>
              {["1D", "1W", "1M", "3M", "6M", "1Y", "3Y", "MTD", "YTD"].map((period) => (
                <TableHead key={period} className="text-right px-2 py-2 font-semibold dark:text-gray-300 whitespace-nowrap">{period}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.index} className={`${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}>
                <TableCell className="font-medium px-2 py-2 dark:text-gray-300 whitespace-nowrap">{item.index}</TableCell>
                <TableCell className="text-right px-2 py-2 dark:text-gray-300 whitespace-nowrap">{item.level?.toFixed(2) ?? "N/A"}</TableCell>
                {["1D", "1W", "1M", "3M", "6M", "1Y", "3Y", "MTD", "YTD"].map((period) => (
                  <TableCell
                    key={period}
                    className={`text-right px-2 py-2 whitespace-nowrap ${
                      (item[period as keyof PeriodPerformances] as number | undefined) != null &&
                      (item[period as keyof PeriodPerformances] as number) >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {(item[period as keyof PeriodPerformances] as number | undefined)?.toFixed(2) ?? "N/A"}%
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [tables, setTables] = useState<TableData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const tableGroups = [
        { group: "local-indices", title: "Local Indices" },
        { group: "global-markets", title: "Global Markets" },
        { group: "us-gics", title: "US GICS" },
        { group: "global-bonds", title: "Global Bonds" },
        { group: "currency", title: "Currency" },
        { group: "commodities", title: "Commodities" },
        { group: "theme", title: "Theme" },
      ];

      try {
        const results = await Promise.all(
          tableGroups.map((group) =>
            fetchPeriodPerformances(formatDate(date), group.group)
          )
        );

        setTables(
          results.map((data, index) => ({
            data,
            title: tableGroups[index].title,
          }))
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred");
        console.error("Error fetching performance data:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [date]);

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen text-xl font-semibold">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-600">Error: {error}</div>;

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

        {/* Adjusted grid to have a maximum of two tables per row */}
        {/* Removed overflow-x-auto for better visibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
          {tables.map((table, index) => (
            <PerformanceTable key={index} data={table.data} title={table.title} />
          ))}
        </div>
      </div>
    </div>
  );
}