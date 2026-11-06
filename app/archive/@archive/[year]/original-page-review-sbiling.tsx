import NewsList from "@/components/news/news-list";
import { getNewsForYear } from "@/lib/news";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// [IMPORTANT] // MUST IMPLEMENT THESE THREE COMPONENTS
export type YearNewsPageProps = {
  params: { year: string};
};

async function YearNews({ params }: YearNewsPageProps) {
  const { year } = await params;
  const news = getNewsForYear(year);

  if (!news) {
    notFound();
  }

  return <NewsList news={news} />;
}

function YearNewsPage({ params }: YearNewsPageProps) {
  console.log('working at [year]')
  return (
    <Suspense>
      <YearNews params={params}/>
    </Suspense>
  )
}

export default YearNewsPage;
