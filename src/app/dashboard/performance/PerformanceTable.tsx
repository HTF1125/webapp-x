"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";

interface PerformanceTableProps {
  data: any[];
  group: string;
}

const PerformanceTable: React.FC<PerformanceTableProps> = ({ data, group }) => {
  const getCellColor = (value: number) => {
    if (value > 0) return "text-success";
    if (value < 0) return "text-danger";
    return "text-default-500";
  };

  const columns = [
    { key: "code", label: "CODE" },
    { key: "name", label: "NAME" },
    { key: "1d", label: "1D", tooltip: "1-Day Performance" },
    { key: "1w", label: "1W", tooltip: "1-Week Performance" },
    { key: "1m", label: "1M", tooltip: "1-Month Performance" },
    { key: "3m", label: "3M", tooltip: "3-Month Performance" },
    { key: "6m", label: "6M", tooltip: "6-Month Performance" },
    { key: "1y", label: "1Y", tooltip: "1-Year Performance" },
    { key: "mtd", label: "MTD", tooltip: "Month-to-Date Performance" },
    { key: "ytd", label: "YTD", tooltip: "Year-to-Date Performance" },
  ];

  const rows = data.map((item, index) => ({
    key: index.toString(),
    code: item.code,
    name: item.name,
    "1d": item.pct_chg_1d,
    "1w": item.pct_chg_1w,
    "1m": item.pct_chg_1m,
    "3m": item.pct_chg_3m,
    "6m": item.pct_chg_6m,
    "1y": item.pct_chg_1y,
    "mtd": item.pct_chg_mtd,
    "ytd": item.pct_chg_ytd,
  }));

  return (
    <div className="w-full">
      <h2 className="text-sm font-medium mb-2 text-foreground">{group}</h2>
      <Table
        aria-label={`Performance table for ${group}`}
        classNames={{
          base: "max-h-[300px] overflow-y-auto",
          table: "min-h-[180px]",
        }}
        className="compact"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "code" || column.key === "name" ? "start" : "end"}
            >
              <Tooltip content={column.tooltip || column.label}>
                <span className="text-xs font-medium">{column.label}</span>
              </Tooltip>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.key} className="p-1">
              {(columnKey) => (
                <TableCell className="py-1 px-2">
                  {columnKey === "code" || columnKey === "name" ? (
                    <span className="text-xs">{item[columnKey as keyof typeof item]}</span>
                  ) : (
                    <span
                      className={`text-xs ${getCellColor(
                        item[columnKey as keyof typeof item] as number
                      )}`}
                    >
                      {(item[columnKey as keyof typeof item] as number)?.toFixed(1)}%
                    </span>
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PerformanceTable;
