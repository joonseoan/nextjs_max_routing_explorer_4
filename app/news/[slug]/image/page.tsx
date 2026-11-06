import { DUMMY_NEWS } from "@/dummy-data";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export type NewsImageProps = {
  params: Promise<{ slug: string }>;
}

async function NewsImage({ params }: NewsImageProps) {
  const { slug } = await params;
  const newsItem = DUMMY_NEWS.find((news) => news.slug === slug);

  if (!newsItem) {
    notFound();
  }

  return <div className="fullscreen-image">
    <img
      src={`/images/news/${newsItem.image}`}
      alt={newsItem.title}
    />
  </div>
}


function NewsImagePage({ params }: NewsImageProps) {
  return <Suspense>
    <NewsImage params={params}/>
  </Suspense>
}

export default NewsImagePage;