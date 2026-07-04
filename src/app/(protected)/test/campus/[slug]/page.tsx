'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserKey, Users } from 'lucide-react';
import { useCampusQueries } from '@/feature/campus/hooks/use-campus-queries';
import {
  MembersTable,
  CreateCampusRoleButton,
  RolesPermissionTable,
} from '@/feature/campus/components';

export default function TestCampusDetailPage() {
  const params = useParams();
  const { slug } = params;
  const { campusBySlug } = useCampusQueries({ campusSlug: String(slug) });

  if (campusBySlug.isPending) return <div>Loading...</div>;

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
              <div className="space-y-4">
                <MembersTable campusId={campusBySlug.data?.id!} />
              </div>
            </TabsContent>
            <TabsContent
              value="departments"
              className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground">Currently not available</p>
            </TabsContent>
            <TabsContent
              value="roles-permission"
              className="bg-muted rounded-lg p-4">
              <CreateCampusRoleButton
                className="mb-4 ml-auto block"
                campusId={campusBySlug.data?.id!}
                disabled={!campusBySlug}
              />
              <RolesPermissionTable campusId={campusBySlug.data?.id!} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
