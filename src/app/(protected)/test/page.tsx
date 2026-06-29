'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemMedia,
} from '@/components/ui/item';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { CreateCampusButton } from '@/feature/multi-tenancy/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CampusColumnActions,
  getCampusColumns,
} from '@/feature/multi-tenancy/data/campus-colums';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AuthType } from '@/utils/auth';
import { apiErrorHandler } from '@/lib/api-handler';
import { User, School, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { GetUsersListServiceResponse } from '@/feature/users/service/user.service';
import { GetUsersListQueryFormValues } from '@/feature/users/schemaa/user.schema';
import React from 'react';
import { UserTable } from '@/feature/users/components/user-table';

export default function TestPage() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const { data: campusList, error: campusError } = useQuery({
    queryKey: ['campusList'],
    queryFn: async () => {
      const result = await axios.get<AuthType['Organization'][]>('/api/campus');
      return result.data;
    },
  });

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin');
  };

  const onCampusInviteEmail: CampusColumnActions['onCampusInviteEmail'] = (
    data
  ) => {
    console.log(data);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Test Page</CardTitle>
        <CardDescription>
          This page dedicated for testing functionalities only
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="account">
              <User />
              Account
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users />
              Users
            </TabsTrigger>
            <TabsTrigger value="campus">
              <School />
              Campus
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="bg-muted rounded-lg p-4">
            {user && (
              <>
                <h2 className="mb-2 font-semibold">User Information</h2>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Name:</span> {user.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p>
                    <span className="font-medium">Email Verified:</span>{' '}
                    {user.emailVerified ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Role:</span> {user.role}
                  </p>
                </div>
              </>
            )}
          </TabsContent>
          <TabsContent value="users" className="bg-muted rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              <UserTable />
            </div>
          </TabsContent>
          <TabsContent value="campus" className="bg-muted rounded-lg p-4">
            {/* RBAC: System Admin Actions */}
            <div className="flex w-full flex-col gap-6">
              {campusList &&
                campusList.map((campus) => (
                  <Item variant="outline" key={campus.id}>
                    <ItemMedia variant="image">
                      <Avatar className="size-10">
                        <AvatarImage src={campus.logo as string} />
                        <AvatarFallback>
                          {campus.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{campus.name}</ItemTitle>
                      <ItemDescription>
                        A simple item with title and description.
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button size="sm" asChild>
                        <Link
                          href={{ pathname: `/test/campus/${campus.slug}` }}>
                          View more
                          <ArrowRight />
                        </Link>
                      </Button>
                    </ItemActions>
                  </Item>
                ))}
              <CreateCampusButton />
            </div>
          </TabsContent>
        </Tabs>

        <Button onClick={handleSignOut} variant="destructive">
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
}
