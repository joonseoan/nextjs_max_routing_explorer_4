// Since we does not implement [year] slug as same as the way of archive page,
// we need to set `default.tsx` here.
// Then we can delete `@latest/page.tsx`
// because this page will be a role of `page.tsx`

import NewsList from "@/components/news/news-list";
import { getLatestNews } from "@/lib/news";

function LatestNewsPage() {
  const latestNews = getLatestNews();

  return <>
    <h2>Latest Page</h2>
    <NewsList news={latestNews} />
  </>
}

export default LatestNewsPage;