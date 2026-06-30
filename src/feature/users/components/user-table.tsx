import React from 'react';
import {
  DynamicTable,
  DynamicTableFilter,
  DynamicTablePagination,
} from '@/components/custom/dynamic-table';

import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import {
  DynamicTableProvider,
  useDynamicTableContext,
} from '@/components/provider/dynamic-table-provider';

import {
  getUserColumns,
  RowUser,
  UserColumnActions,
} from '../data/user-columns';

import { GetUsersListServiceResponse } from '../service/user.service';
import { GetUsersListQueryFormValues } from '../schemaa/user.schema';

import { toast } from 'sonner';
import { CampusInvitationDialog } from '@/feature/multi-tenancy/components/user-invitation-dialog';

interface UserTableContentProps {
  onQueryChange: (
    updater: (prev: GetUsersListQueryFormValues) => GetUsersListQueryFormValues
  ) => void;
}

function UserTableContent({ onQueryChange }: UserTableContentProps) {
  const { table } =
    useDynamicTableContext<GetUsersListServiceResponse['users'][0]>();

  const pagination = table.getState().pagination;

  const globalFilter = table.getState().globalFilter;

  React.useEffect(() => {
    onQueryChange((prev) => ({
      ...prev,

      limit: pagination.pageSize,

      offset: pagination.pageIndex * pagination.pageSize,
    }));
  }, [pagination.pageIndex, pagination.pageSize, onQueryChange]);

  React.useEffect(() => {
    onQueryChange((prev) => ({
      ...prev,

      searchValue: globalFilter || undefined,
    }));
  }, [globalFilter, onQueryChange]);

  return (
    <React.Fragment>
      <DynamicTableFilter />
      <DynamicTable />
      <DynamicTablePagination />
    </React.Fragment>
  );
}

export const UserTable = () => {
  const [onOpenInvitationDialog, setOnOpenInvitationDialog] =
    React.useState(false);
  const [rowUser, setRowUser] = React.useState<RowUser>();

  const [usersListQuery, setUsersListQuery] =
    React.useState<GetUsersListQueryFormValues>({
      limit: 10,
      offset: 0,
    });

  const { data, error } = useQuery({
    queryKey: ['usersList', usersListQuery],

    queryFn: async () => {
      const result = await axios.get<GetUsersListServiceResponse>(
        '/api/users',
        {
          params: usersListQuery,
        }
      );

      return result.data;
    },

    placeholderData: (previousData) => previousData,
  });

  const onInviteUserByEmail: UserColumnActions['onInviteUserByEmail'] = (
    row
  ) => {
    setRowUser(row);
    setOnOpenInvitationDialog(true);
  };

  React.useEffect(() => {
    if (error && axios.isAxiosError(error)) {
      toast.error(error.message);
    }
  }, [error]);

  const handleQueryChange = React.useCallback(
    (
      updater: (
        prev: GetUsersListQueryFormValues
      ) => GetUsersListQueryFormValues
    ) => {
      setUsersListQuery(updater);
    },
    []
  );

  return (
    <React.Fragment>
      <DynamicTableProvider<GetUsersListServiceResponse['users'][0]>
        initialColumns={getUserColumns({
          onInviteUserByEmail,
        })}
        initialData={data?.users ?? []}>
        <UserTableContent onQueryChange={handleQueryChange} />
      </DynamicTableProvider>

      <CampusInvitationDialog
        user={rowUser!}
        open={onOpenInvitationDialog}
        onOpenChange={setOnOpenInvitationDialog}
      />
    </React.Fragment>
  );
};
