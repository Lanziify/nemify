import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Ellipsis } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GetCampusDepartmentsServiceResult } from '../services/campus.service';

export type RowDepartment = GetCampusDepartmentsServiceResult[0];

export interface DepartmentRowActions {
  // onInviteUserByEmail: (row: GetUsersListServiceResponse['users'][0]) => void;
}

export const getDepartmentsColumns = (
  actions: DepartmentRowActions
): ColumnDef<RowDepartment>[] => {
  return [
    {
      accessorKey: 'id',
      size: 100,
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0! hover:bg-transparent hover:opacity-50"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Id
          <ArrowUpDown size={16} />
        </Button>
      ),
      cell: ({ row }) => <div className="truncate">{row.getValue('id')}</div>,
    },

    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0! hover:bg-transparent hover:opacity-50"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown size={16} />
        </Button>
      ),
      cell: ({ row }) => <div className="truncate">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'action',
      size: 50,
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-full p-0! hover:bg-transparent hover:opacity-50">
          Action
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-full items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Campus</DropdownMenuLabel>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Invite user</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>Email</DropdownMenuItem>
                        <DropdownMenuItem>Message</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>More...</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Manage</DropdownMenuLabel>
                  <DropdownMenuItem>Edit user</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
