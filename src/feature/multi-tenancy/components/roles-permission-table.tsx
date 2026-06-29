import React from 'react';
import { DynamicTable } from '@/components/custom/dynamic-table';

import {
  DynamicTableProvider,
  useDynamicTableContext,
} from '@/components/provider/dynamic-table-provider';

import { toast } from 'sonner';
import { CampusInviationDialog } from '@/feature/multi-tenancy/components/user-invitation-dialog';
import { getCampusColumns } from '../data/campus-colums';
import { useCampusQueries } from '../hooks/use-campus-queries';
import { CampusRoleServiceResult } from '../services/campus.service';
import {
  CampusRoleColumnActions,
  CampusRoleRow,
  getCampusRoleColumns,
} from '../data/role-columns';
import { CreateCampusRoleDialog } from './create-campus-role-dialog';

interface RolesPermissionContentProps {
  // onQueryChange: (
  //   updater: (prev: GetUsersListQueryFormValues) => GetUsersListQueryFormValues
  // ) => void;
}

function RolesPermissionContent() {
  //   {
  //   onQueryChange,
  // }: RolesPermissionContentProps
  const { table } = useDynamicTableContext<CampusRoleServiceResult[0]>();

  // const pagination = table.getState().pagination;

  // const globalFilter = table.getState().globalFilter;

  // React.useEffect(() => {
  //   onQueryChange((prev) => ({
  //     ...prev,

  //     limit: pagination.pageSize,

  //     offset: pagination.pageIndex * pagination.pageSize,
  //   }));
  // }, [pagination.pageIndex, pagination.pageSize, onQueryChange]);

  // React.useEffect(() => {
  //   onQueryChange((prev) => ({
  //     ...prev,

  //     searchValue: globalFilter || undefined,
  //   }));
  // }, [globalFilter, onQueryChange]);

  return (
    <React.Fragment>
      {/* <DynamicTableFilter /> */}
      <DynamicTable />
      {/* <DynamicTablePagination /> */}
    </React.Fragment>
  );
}

export const RolesPermissionTable = ({
  campusSlug,
}: {
  campusSlug?: string;
}) => {
  const { campusBySlug, roles } = useCampusQueries({ campusSlug });

  const [editRoleValues, setEditRoleValues] = React.useState<CampusRoleRow>();

  const onEditRole: CampusRoleColumnActions['onEditRole'] = (row) => {
    setIsDialogOpen(true);
    setEditRoleValues(row);
  };

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  // const [rowUser, setRowUser] = React.useState<RowUser>();

  // const [usersListQuery, setUsersListQuery] =
  //   React.useState<GetUsersListQueryFormValues>({
  //     limit: 10,
  //     offset: 0,
  //   });

  // React.useEffect(() => {
  //   if (error && axios.isAxiosError(error)) {
  //     toast.error(error.message);
  //   }
  // }, [error]);

  // const handleQueryChange = React.useCallback(
  //   (
  //     updater: (
  //       prev: GetUsersListQueryFormValues
  //     ) => GetUsersListQueryFormValues
  //   ) => {
  //     setUsersListQuery(updater);
  //   },
  //   []
  // );

  return (
    <React.Fragment>
      <DynamicTableProvider<CampusRoleServiceResult[0]>
        initialColumns={getCampusRoleColumns({ onEditRole })}
        initialData={roles.data ?? []}>
        <RolesPermissionContent />
      </DynamicTableProvider>

      <CreateCampusRoleDialog
        campusId={campusBySlug?.data?.id as string}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editValues={editRoleValues}
      />
    </React.Fragment>
  );
};
