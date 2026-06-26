'use client';

import {
  DynamicTableWrapper,
  DynamicTable,
  DynamicTablePagination,
} from '@/components/custom/dynamic-data-table/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CreateCampusRoleButton } from '@/feature/multi-tenancy/components/create-campus-role-button';
import { getCampusRoleColumns } from '@/feature/multi-tenancy/data/role-columns';
import { CampusRoleServiceResult } from '@/feature/multi-tenancy/services/campus.service';
import { apiErrorHandler } from '@/lib/api-handler';
import { AuthType } from '@/utils/auth';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

export default function TestCampusDetailPage() {
  const params = useParams();
  const router = useRouter();

  const { slug } = params;

  const {
    data: currentCampus,
    error: currentCampusError,
    isLoading: currentCampusLoading,
  } = useQuery({
    queryKey: ['campus', slug],
    queryFn: async () => {
      const result = await axios.get<AuthType['Organization']>(
        `/api/campus/by-slug/${slug}`
      );
      return result.data;
    },
  });

  const {
    data: currentCampusRoles,
    error: currentCampusRolesError,
    isLoading: currentCampusRolesLoading,
  } = useQuery({
    queryKey: ['campusRole', currentCampus?.id],
    queryFn: async () => {
      const result = await axios.get<CampusRoleServiceResult>(
        `/api/campus/${currentCampus?.id}/roles`
      );
      return result.data;
    },
    enabled: !!currentCampus,
  });

  React.useEffect(() => {
    if (!currentCampus && currentCampusError) {
      router.push('/test/campus');
    }
  }, [currentCampus, currentCampusError, router]);

  if (currentCampusLoading) return <div>Loading...</div>;

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {currentCampus?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicTableWrapper
            columns={getCampusRoleColumns(getCampusRoleColumns({}))}
            data={currentCampusRoles ?? []}>
            <div className="mb-4 flex w-full items-center justify-between">
              <h2 className="text-2xl font-bold">Roles and Permissions</h2>
              <CreateCampusRoleButton campusId={currentCampus?.id as string}/>
            </div>
            <DynamicTable />
            <DynamicTablePagination />
          </DynamicTableWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
