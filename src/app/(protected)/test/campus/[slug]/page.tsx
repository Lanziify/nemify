'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AuthType } from '@/utils/auth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

export default function TestCampusDetailPage() {
  const params = useParams();
  const router = useRouter();

  const { slug } = params;

  const { data, error, isLoading } = useQuery({
    queryKey: ['campus', slug],
    queryFn: async () => {
      const result = await axios.get<AuthType['Organization']>(
        `/api/campus/${slug}`
      );
      return result.data;
    },
  });

  React.useEffect(() => {
    if (!data && error && !isLoading) {
      router.push('/test/campus');
    }
  }, [data, error, router, isLoading]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{data?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4">
            {JSON.stringify(data, undefined, 2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
