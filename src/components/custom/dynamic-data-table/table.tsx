'use client';

import React from 'react';
import { DataTable } from './data-table';
import { ColumnDef, Table } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';
import useDynamicTable from '@/hooks/use-dynamic-table';
import { cn } from '@/lib/utils';
import DataTablePagination from './pagination';
import EditableTable from './editable-table';
import EditableCell from './editable-cell';

interface DynamicTableWrapperProps<T> {
  children: React.ReactNode;
  columns: ColumnDef<T>[];
  data: Partial<T>[];
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
  type?: 'normal' | 'editable';
}

interface DynamicTableContextType<T> {
  table: Table<T>;
  type?: 'normal' | 'editable';
  globalFilter: string;
}

const DynamicTableContext =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.createContext<DynamicTableContextType<any> | null>(null);

export function useDynamicTableContext<T>() {
  const ctx = React.useContext(DynamicTableContext);

  if (!ctx) {
    throw new Error('Cannot use this context outside its wrapper');
  }

  return ctx as DynamicTableContextType<T>;
}

export function DynamicTableWrapper<T>({
  children,
  columns,
  data,
  className,
  type,
}: DynamicTableWrapperProps<T>) {
  const { table, setData, setColumns, setDefaultColumn, globalFilter } =
    useDynamicTable<T>();

  React.useEffect(() => {
    setData(data);
  }, [data, setData]);

  React.useEffect(() => {
    setColumns(columns);

    if (type && type === 'editable') {
      const defaultColumn: Partial<ColumnDef<T>> = {
        cell: EditableCell,
      };

      setDefaultColumn(defaultColumn);
    } else {
      setDefaultColumn(undefined);
    }
  }, [columns, type, setColumns, setDefaultColumn]);

  return (
    <DynamicTableContext.Provider value={{ table, type, globalFilter }}>
      <div className={cn('mt-4', className)}>{children}</div>
    </DynamicTableContext.Provider>
  );
}

export function DynamicTableFilter<T>() {
  const { table, globalFilter } = useDynamicTableContext<T>();

  return (
    <div className="flex w-fit items-center gap-2">
      <div className="flex items-center gap-2">
        <Input
          className="w-60"
          placeholder="Search"
          value={globalFilter ?? ''}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            <ListFilter size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function DynamicTable<T>() {
  const { table, type } = useDynamicTableContext<T>();

  return type && type === 'editable' ? (
    <EditableTable table={table} />
  ) : (
    <DataTable table={table} />
  );
}

export function DynamicTablePagination<T>() {
  const { table } = useDynamicTableContext<T>();
  return <DataTablePagination table={table} />;
}
