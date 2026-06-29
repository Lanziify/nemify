import { Table, flexRender } from '@tanstack/react-table';
import { DataTable } from './dynamic-data-table/data-table';
import { useDynamicTableContext } from '../provider/dynamic-table-provider';
import DataTablePagination from './dynamic-data-table/pagination';
import { Input } from '../ui/input';

export function DynamicTable<T>() {
  const { table } = useDynamicTableContext<T>();

  return <DataTable table={table} />;
}

export function DynamicTableFilter<T>() {
  const { table } = useDynamicTableContext<T>();

  return (
    <Input
      value={table.getState().globalFilter ?? ''}
      placeholder="Search"
      onChange={(e) => table.setGlobalFilter(e.target.value)}
    />
  );
}

export function DynamicTablePagination<T>() {
  const { table } = useDynamicTableContext<T>();
  return <DataTablePagination table={table} />;
}
