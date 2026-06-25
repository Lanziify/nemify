import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { User } from '@/db/db';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const usersColumns: ColumnDef<User>[] = [
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
    accessorKey: 'avatar',
    header: () => <div>Avatar</div>,
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.getValue('avatar')} />
        <AvatarFallback>
          {(row.getValue('avatar') as string).charAt(0).toUpperCase()}
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
    cell: ({ row }) => <div className="truncate">{row.getValue('email')}</div>,
  },
];
