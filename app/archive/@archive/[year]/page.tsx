import NewsList from "@/components/news/news-list";
import { getNewsForYear } from "@/lib/news";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export type FilteredNewsPageProps = {
  params: PageProps<'/archive/[year]'>['params'],
};

async function FilteredNewsPage({ params }: FilteredNewsPageProps) {
  const { year } = await params;
  const news = getNewsForYear(year);

  if (!news) {
    notFound();
  }

  return <Suspense fallback={<p>Loading...</p>}>
    <NewsList news={news} />
  </Suspense>
}

export default FilteredNewsPage;


// ??????????????????????
// import NewsList from "@/components/news/news-list";
// import { getNewsForYear } from "@/lib/news";
// import { notFound } from "next/navigation";
// import { Suspense } from "react";

// // 1. 빌드 시점에 생성할 연도 목록을 Next.js에 알려줍니다.
// export async function generateStaticParams() {
//   // 예시: 존재하는 연도 배열을 반환합니다. (실제 데이터 함수에 맞게 수정하세요)
//   const years = ["2024", "2025", "2026"]; 
  
//   return years.map((year) => ({
//     year: year,
//   }));
// }

// export type FilteredNewsPageProps = {
//   params: Promise<{ year: string }>; // Next.js 15 타입 반영
// };

// export default async function FilteredNewsPage({ params }: FilteredNewsPageProps) {
//   const { year } = await params;
//   const news = getNewsForYear(year);

//   if (!news) {
//     notFound();
//   }

//   return (
//     <Suspense fallback={<p>Loading...</p>}>
//       <NewsList news={news} />
//     </Suspense>
//   );
// }