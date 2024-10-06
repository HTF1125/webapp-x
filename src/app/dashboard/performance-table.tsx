// components/PerformanceTable.tsx

import React from "react";
import { PeriodPerformances } from "@/lib/api/period-performance";
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

export default function PerformanceTable({ data, title }: TableData) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full">
      <h2 className="text-lg font-semibold p-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
        {title}
      </h2>
      <div className="overflow-x-auto">
        <Table className="w-full text-xs">
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
              <TableHead className="text-left px-2 py-2 font-semibold dark:text-gray-300 whitespace-nowrap">
                Index
              </TableHead>
              <TableHead className="text-right px-2 py-2 font-semibold dark:text-gray-300 whitespace-nowrap">
                Level
              </TableHead>
              {["1D", "1W", "1M", "3M", "6M", "1Y", "3Y", "MTD", "YTD"].map(
                (period) => (
                  <TableHead
                    key={period}
                    className="text-right px-2 py-2 font-semibold dark:text-gray-300 whitespace-nowrap"
                  >
                    {period}
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={item.index}
                className={`${
                  index % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-700"
                } hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}
              >
                <TableCell className="font-medium px-2 py-2 dark:text-gray-300 whitespace-nowrap">
                  {item.index}
                </TableCell>
                <TableCell className="text-right px-2 py-2 dark:text-gray-300 whitespace-nowrap">
                  {item.level?.toFixed(2) ?? "N/A"}
                </TableCell>
                {["1D", "1W", "1M", "3M", "6M", "1Y", "3Y", "MTD", "YTD"].map(
                  (period) => (
                    <TableCell
                      key={period}
                      className={`text-right px-2 py-2 whitespace-nowrap ${
                        (item[period as keyof PeriodPerformances] as
                          | number
                          | undefined) != null &&
                        (item[period as keyof PeriodPerformances] as number) >=
                          0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {(
                        item[period as keyof PeriodPerformances] as
                          | number
                          | undefined
                      )?.toFixed(2) ?? "N/A"}
                      %
                    </TableCell>
                  )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
