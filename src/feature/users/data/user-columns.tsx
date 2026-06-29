import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Ellipsis } from 'lucide-react';
import { User } from '@/db/db';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GetUsersListServiceResponse } from '../service/user.service';

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

interface UserColumnActions {}

export const getUserColumns = (
  actions: UserColumnActions
): ColumnDef<GetUsersListServiceResponse['users'][0]>[] => {
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
      accessorKey: 'image',
      size: 50,
      header: () => <div>Avatar</div>,
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={row.getValue('image')} />
          <AvatarFallback>
            {(row.getValue('name') as string).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
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
      accessorKey: 'email',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0! hover:bg-transparent hover:opacity-50"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          <ArrowUpDown size={16} />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="truncate">{row.getValue('email')}</div>
      ),
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
