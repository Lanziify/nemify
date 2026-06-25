"use client";

import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

export default function useDynamicTable<T>() {
  const [data, setData] = React.useState<Partial<T>[]>([]);
  const [defaultColumn, setDefaultColumn] =
    React.useState<Partial<ColumnDef<T>>>();
  const [columns, setColumns] = React.useState<ColumnDef<T>[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilter] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: data as T[],
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilter,
    onColumnVisibilityChange: setColumnVisibility,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
    },
    state: {
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  return {
    table,
    setData,
    setColumns,
    setDefaultColumn,
    globalFilter,
    columnFilters,
    columnVisibility,
  };
}