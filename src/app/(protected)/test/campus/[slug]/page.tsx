'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
import { useCampusQueries } from '@/feature/multi-tenancy/hooks/use-campus-queries';
import { RolesPermissionTable } from '@/feature/multi-tenancy/components/roles-permission-table';

export default function TestCampusDetailPage() {
  const params = useParams();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editRoleValues, setEditRoleValues] = React.useState<CampusRoleRow>();
  const { slug } = params;
  const { campusBySlug } = useCampusQueries({ campusSlug: String(slug) });

  return (
    <>
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {campusBySlug?.data?.name}
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
              <p className="text-muted-foreground">Currently not available</p>
            </TabsContent>
            <TabsContent
              value="departments"
              className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground">Currently not available</p>
            </TabsContent>
            <TabsContent
              value="roles-permission"
              className="bg-muted rounded-lg p-4">
              <RolesPermissionTable campusSlug={String(slug)} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <CreateCampusRoleDialog
        campusId={campusBySlug?.data?.id as string}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editValues={editRoleValues}
      />
    </>
  );
}
