// export const dynamic = 'force-dynamic';
import { Suspense } from 'react';

export type NewsPageItemProps = {
  params: PageProps<'/news/[id]'>['params'],
};

async function NewsPageItem({ params }: NewsPageItemProps) {
  const { id } = await params;

  return <h1>News ID: {id}</h1>;
}

function NewsPageItemReturn({ params }: PageProps<'/news/[id]'>) {
  return <Suspense fallback={<p>Loading...</p>}>
    <NewsPageItem params={params} />
  </Suspense>
}

export default NewsPageItemReturn;
