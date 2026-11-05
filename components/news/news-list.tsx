import { NewsProps } from '../../dummy-data';
import Link from 'next/link';

export interface NewsListProps {
  news: NewsProps[];
}

function NewsList({ news }: NewsListProps) {
    return <ul className="news-list">
    {news.map((dummyNews: NewsProps) =>
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

export default NewsList;