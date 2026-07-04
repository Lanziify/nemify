'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemMedia,
} from '@/components/ui/item';
import { useCampusQueries } from '@/feature/campus/hooks/use-campus-queries';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TestCampusPage() {
  const { campuses } = useCampusQueries({});

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Campus</CardTitle>
        {/* <CardDescription>
            This page dedicated for testing functionalities only
          </CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col gap-6">
          {campuses.data?.map((campus) => (
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
                  <Link href={{ pathname: `/test/campus/${campus.slug}` }}>
                    View more
                    <ArrowRight />
                  </Link>
                </Button>
              </ItemActions>
            </Item>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
