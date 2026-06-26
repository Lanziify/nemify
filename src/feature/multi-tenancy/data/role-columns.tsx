import { ColumnDef } from '@tanstack/react-table';
import { CampusRoleServiceResult } from '../services/campus.service';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export type CampusRoleColumnActions = {};

export const getCampusRoleColumns = (
  actions: CampusRoleColumnActions
): ColumnDef<CampusRoleServiceResult[0]>[] => {
  return [
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0! hover:bg-transparent hover:opacity-50"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Role
          <ArrowUpDown size={16} />
        </Button>
      ),
      cell: ({ row }) => <div className="truncate">{row.getValue('role')}</div>,
    },
    {
      accessorKey: 'permission',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0! hover:bg-transparent hover:opacity-50"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Permissions
          <ArrowUpDown size={16} />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="truncate">{row.getValue('permission')}</div>
      ),
    },
  ];
};
