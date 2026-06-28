import DynamicBreadcrumbs from './breadcrumbs';

type Props = {
  params: Promise<{
    catchAll: string[];
  }>;
};
export default async function BreadcrumbsSlot(props: Props) {
  const { catchAll } = await props.params;

  return (
    <div className="mb-6 w-full max-w-3xl">
      <DynamicBreadcrumbs segments={catchAll} />
    </div>
  );
}
