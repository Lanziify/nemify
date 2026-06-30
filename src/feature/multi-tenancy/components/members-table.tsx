import React from 'react';
import {
  DynamicTable,
  DynamicTableFilter,
  DynamicTablePagination,
} from '@/components/custom/dynamic-table';

import axios from 'axios';

import {
  DynamicTableProvider,
  useDynamicTableContext,
} from '@/components/provider/dynamic-table-provider';

import { toast } from 'sonner';
import { GetCampusMembersServiceResult } from '../services/campus.service';
import { getMemberColumns } from '../data/member-columns';
import { GetCampusMembersQueryFormValues } from '../schema/campus.schema';
import { useCampusQueries } from '../hooks/use-campus-queries';

interface MembersTableContentProps {
  onQueryChange: (
    updater: (
      prev: GetCampusMembersQueryFormValues
    ) => GetCampusMembersQueryFormValues
  ) => void;
}

function MembersTableContent({ onQueryChange }: MembersTableContentProps) {
  const { table } =
    useDynamicTableContext<GetCampusMembersServiceResult['members'][0]>();

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

export const MembersTable = ({ campusId }: { campusId: string }) => {
  const [membersListQuery, setMembersListQuery] =
    React.useState<GetCampusMembersQueryFormValues>({
      limit: 10,
      offset: 0,
    });

  const { members } = useCampusQueries({
    campusId,
    query: membersListQuery,
  });

  React.useEffect(() => {
    if (members.error && axios.isAxiosError(members.error)) {
      toast.error(members.error.message);
    }
  }, [members.error]);

  const handleQueryChange = React.useCallback(
    (
      updater: (
        prev: GetCampusMembersQueryFormValues
      ) => GetCampusMembersQueryFormValues
    ) => {
      setMembersListQuery(updater);
    },
    []
  );

  return (
    <React.Fragment>
      <DynamicTableProvider<GetCampusMembersServiceResult['members'][0]>
        initialColumns={getMemberColumns({})}
        initialData={members.data?.members ?? []}>
        <MembersTableContent onQueryChange={handleQueryChange} />
      </DynamicTableProvider>
    </React.Fragment>
  );
};
