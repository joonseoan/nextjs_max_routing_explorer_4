// export const dynamic = 'force-dynamic';
import { DUMMY_NEWS } from '@/dummy-data';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

async function NewsDetail({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const newsDetail = DUMMY_NEWS.find((newsDetail) => newsDetail?.slug === slug);

  if (!newsDetail) {
    notFound();
  }

  return <>
    <article className='news-article'>
      <header>
        <img src={`/images/news/${newsDetail?.image}`} alt={newsDetail?.title} /> 
        <h1>{newsDetail?.title}</h1>
        <time dateTime={newsDetail?.date}>{newsDetail?.date}</time>
      </header>
    </article>
    <h1>{newsDetail?.content}</h1>
  </>
}

function NewsDetailPage({ params }: NewsDetailPageProps) {
  return <Suspense fallback={<p>Loading...</p>}>
    <NewsDetail params={params} />
  </Suspense>
}

export default NewsDetailPage;
