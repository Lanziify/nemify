'use client';

import {
  DynamicTableWrapper,
  DynamicTable,
  DynamicTablePagination,
} from '@/components/custom/dynamic-data-table/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CreateCampusRoleButton } from '@/feature/multi-tenancy/components/create-campus-role-button';
import { CreateCampusRoleDialog } from '@/feature/multi-tenancy/components/create-campus-role-dialog';
import {
  CampusRoleColumnActions,
  CampusRoleRow,
  getCampusRoleColumns,
} from '@/feature/multi-tenancy/data/role-columns';
import { CampusRoleServiceResult } from '@/feature/multi-tenancy/services/campus.service';
import { AuthType } from '@/utils/auth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserKey, Users } from 'lucide-react';

export default function TestCampusDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editRoleValues, setEditRoleValues] = React.useState<CampusRoleRow>();
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

  const onEditRole: CampusRoleColumnActions['onEditRole'] = (data) => {
    setIsDialogOpen(true);
    setEditRoleValues(data);
  };

  React.useEffect(() => {
    if (!currentCampus && currentCampusError) {
      router.push('/test/campus');
    }
  }, [currentCampus, currentCampusError, router]);

  if (currentCampusLoading) return <div>Loading...</div>;

  return (
    <>
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {currentCampus?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="members" className="w-full">
            <TabsList>
              <TabsTrigger value="members">
                <Users />
                Members
              </TabsTrigger>
              <TabsTrigger value="departments">
                <UserKey />
                Departments
              </TabsTrigger>
              <TabsTrigger value="roles-permission">
                <UserKey />
                Roles and Permissions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="members" className="bg-muted rounded-lg p-4">
              <DynamicTableWrapper
                columns={getCampusRoleColumns({ onEditRole })}
                data={currentCampusRoles ?? []}>
                <div className="mb-4 flex w-full items-center justify-between">
                  <h2 className="text-2xl font-bold">Members</h2>
                  <CreateCampusRoleButton
                    campusId={currentCampus?.id as string}
                  />
                </div>
                <DynamicTable />
                <DynamicTablePagination />
              </DynamicTableWrapper>
            </TabsContent>
            <TabsContent
              value="departments"
              className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground">Currently not available</p>
            </TabsContent>
            <TabsContent
              value="roles-permission"
              className="bg-muted rounded-lg p-4">
              <DynamicTableWrapper
                columns={getCampusRoleColumns({ onEditRole })}
                data={currentCampusRoles ?? []}>
                <div className="mb-4 flex w-full items-center justify-between">
                  <h2 className="text-2xl font-bold">Roles and Permissions</h2>
                  <CreateCampusRoleButton
                    campusId={currentCampus?.id as string}
                  />
                </div>
                <DynamicTable />
                {/* <DynamicTablePagination /> */}
              </DynamicTableWrapper>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <CreateCampusRoleDialog
        campusId={currentCampus?.id as string}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editValues={editRoleValues}
      />
    </>
  );
}
