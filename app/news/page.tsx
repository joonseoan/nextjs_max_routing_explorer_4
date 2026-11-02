import Link from "next/link"
import { DUMMY_NEWS } from "@/dummy-data";
import { NewsProps } from "@/dummy-data";

function NewsPage() {
  return <ul className="news-list">
    {DUMMY_NEWS.map((dummyNews: NewsProps) =>
      <li key={dummyNews.id}>
        <Link href={`/news/${dummyNews.slug}`}>
          <img
            src={`/images/news/${dummyNews.image}`}
            alt={dummyNews.title}
          />
        </Link>
        <span>{dummyNews.title}</span>
      </li>  
    )}
  </ul>
}

export default NewsPage;