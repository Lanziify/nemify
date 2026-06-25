import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Ellipsis } from 'lucide-react';
import { CampusWithRegisteredCount } from '../services/campus.service';
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

export type CampusColumnActions = {
  onCampusInviteEmail: (row: CampusWithRegisteredCount) => void;
};

export const getCampusColumns = (
  actions: CampusColumnActions
): ColumnDef<CampusWithRegisteredCount>[] => {
  return [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   size: 25,
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'id',
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
      // size: 100,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0! hover:bg-transparent hover:opacity-50"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Campus Name
          <ArrowUpDown size={16} />
        </Button>
      ),
      cell: ({ row }) => <div className="truncate">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'slug',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0! hover:bg-transparent hover:opacity-50"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Campus Slug
          <ArrowUpDown size={16} />
        </Button>
      ),
      cell: ({ row }) => <div className="truncate">{row.getValue('slug')}</div>,
    },
    {
      accessorKey: 'registeredMembers',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0! hover:bg-transparent hover:opacity-50"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Total Registered
          <ArrowUpDown size={16} />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="truncate text-right">
          {row.getValue('registeredMembers')}
        </div>
      ),
    },
    {
      accessorKey: 'action',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-full p-0! hover:bg-transparent hover:opacity-50">
          Action
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;

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
                    <DropdownMenuSubTrigger>
                      Invite users
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={() => actions.onCampusInviteEmail(user)}>
                          Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>Message</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>More...</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem>Members</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Departments</DropdownMenuLabel>
                  <DropdownMenuItem>New department</DropdownMenuItem>
                  <DropdownMenuItem>Department List</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Manage</DropdownMenuLabel>
                  <DropdownMenuItem>Edit campus</DropdownMenuItem>
                  <DropdownMenuItem>Roles and permissions</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
