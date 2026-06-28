import { ColumnDef } from '@tanstack/react-table';
import { CampusRoleServiceResult } from '../services/campus.service';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Ellipsis } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getPolicyDescription, PolicyPath } from '@/lib/auth/policies';
import { CAMPUS_POLICIES } from '@/lib/auth/policies.campus';

export type CampusRoleColumnActions = {
  onEditRole: (row: CampusRoleServiceResult[0]) => void;
};

export type CampusRoleRow = Parameters<
  CampusRoleColumnActions['onEditRole']
>[0];

export const getCampusRoleColumns = (
  actions: CampusRoleColumnActions
): ColumnDef<CampusRoleServiceResult[0]>[] => {
  return [
    {
      accessorKey: 'role',
      size: 50,
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
        <div className="flex w-full flex-wrap gap-1">
          {Object.entries(row.original.permission).map(([source, actions]) => {
            return actions.map((action, j) => {
              const path = `${String(source)}.${action}` as PolicyPath<
                typeof CAMPUS_POLICIES
              >;

              return (
                <Tooltip key={String(source + ':' + action)}>
                  <TooltipTrigger asChild>
                    <Badge variant="outline">{source + ':' + action}</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getPolicyDescription(CAMPUS_POLICIES, path)}</p>
                  </TooltipContent>
                </Tooltip>
              );
            });
          })}
        </div>
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
        return (
          <div className="flex w-full items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Members</DropdownMenuLabel>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Invite users
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>Email</DropdownMenuItem>
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
                  <DropdownMenuLabel>Manage</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => actions.onEditRole(row.original)}>
                    Edit Role
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
