import { DUMMY_NEWS } from "@/dummy-data";
import NewsList from "@/components/news/news-list";

function NewsPage() {
  return <>
    <h1>News Page</h1>
    <NewsList news={DUMMY_NEWS} />
  </>
}

export default NewsPage;