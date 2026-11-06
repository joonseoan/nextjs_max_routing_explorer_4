// [IMPORTANT]!!!
// When using [year] route in the parallel route,
// ane then when we choose a year in `/archive` page,
// we can't see the year list  again in the `year` page (original-page-review-sibling).
// Also, we can't dive into `month` if it is required in the `year` route.

// We can realize the year and month list further in the  nested `layout.tsx`
// in the [year] folder. But there is a better way to achieve this is using
// `catch all route`.

// The page in [[...filter]] will be activated for any path segments after archive
// No matter how many segments we have there, and no matter how they are names.
// Fcan attach
//or instance,  `params.year` in [year] folder's page  (original-page-review-sibling) is not required. ([year] allows only `year params`. We  and pass any number/string value to that year property, though.)

// Also, we must not use the page (original-page-review-outer) because,
// like mentioned above, [[...filter]] is not matter of the path name including empty string route.
// So the error occurs when both pages (the current page and original-page-review-outer) coexist
// because NextJS recognizes that the duplicated pages exists.

import Link from "next/link";
import NewsList from "@/components/news/news-list";
import { getAvailableNewsMonths, getNewsForYear, getNewsForYearAndMonth } from "@/lib/news";
import { getAvailableNewsYears } from "@/lib/news";
import { notFound } from "next/navigation";
import { ReactNode, Suspense } from "react";
import { NewsProps } from "@/dummy-data";


// [IMPORTANT] // MUST IMPLEMENT THESE THREE COMPONENTS
export type FilteredNewsPageProps = {
  params: Promise<{
    filter: string[];
  }>;
};

async function FilteredNews({ params }: FilteredNewsPageProps) {
  const { filter } = await params;
  const selectedYear = filter?.[0];
  const selectedMonth = filter?.[1];

  let links = getAvailableNewsYears();
  let news: undefined | NewsProps[];
  let newsContent: ReactNode = <p>No news found for the selected period.</p>;

  if (selectedYear && !selectedMonth) {
    news = getNewsForYear(selectedYear);
    links = getAvailableNewsMonths(selectedYear);
  }

  if (selectedYear && selectedMonth) {
    news = getNewsForYearAndMonth(selectedYear, selectedMonth);
    links = [];
  }

  if (news && news.length) {
    newsContent = <NewsList news={news} />;
  }

  if (
    selectedYear && !getAvailableNewsYears().includes(+selectedYear) ||
    selectedMonth && !getAvailableNewsMonths(selectedYear).includes(+selectedMonth)
  ) {
    throw new Error('Invalid filter.');
  }

  return (
    <>
      <header id="archive-header">
        <nav>
          <ul>
            {
              links.map((link) => {
                const href = selectedYear ?
                  `/archive/${selectedYear}/${link}` :
                  `/archive/${link}`;

                return  (
                  <li key={link}>
                    <Link href={href}>{link}</Link>
                  </li>
                  )
                }
              )
            }
          </ul>
        </nav>
      </header>
      {newsContent}
    </>
  );
}

function FilteredNewsPage({ params }: FilteredNewsPageProps) {
  console.log('working at [[...filtered]]')

  return (
    <Suspense>
      <FilteredNews params={params}/>
    </Suspense>
  )
}

export default FilteredNewsPage;
