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
import { GetCampusMembersQueryFormValues } from '../../schema/campus.schema';
import { useCampusQueries } from '../../hooks/use-campus-queries';
import {
  getDepartmentsColumns,
  RowDepartment,
} from '../../data/department-columns';

interface DepartmentTableContentProps {
  onQueryChange: (
    updater: (
      prev: GetCampusMembersQueryFormValues
    ) => GetCampusMembersQueryFormValues
  ) => void;
}

function DepartmentTableContent() {
  // const { table } = useDynamicTableContext<RowDepartments>();

  return (
    <React.Fragment>
      {/* <DynamicTableFilter /> */}
      <DynamicTable />
      {/* <DynamicTablePagination /> */}
    </React.Fragment>
  );
}

export const DepartmentTable = ({ campusId }: { campusId: string }) => {
  const { departments } = useCampusQueries({
    campusId,
  });

  React.useEffect(() => {
    if (departments.error && axios.isAxiosError(departments.error)) {
      toast.error(departments.error.message);
    }
  }, [departments.error]);

  // const handleQueryChange = React.useCallback(
  //   (
  //     updater: (
  //       prev: GetCampusMembersQueryFormValues
  //     ) => GetCampusMembersQueryFormValues
  //   ) => {
  //     setMembersListQuery(updater);
  //   },
  //   []
  // );

  return (
    <React.Fragment>
      <DynamicTableProvider<RowDepartment>
        initialColumns={getDepartmentsColumns({})}
        initialData={departments?.data ?? []}>
        <DepartmentTableContent />
      </DynamicTableProvider>
    </React.Fragment>
  );
};
