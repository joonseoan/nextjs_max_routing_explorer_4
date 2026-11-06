/**
 * [IMPORTANT] - intercepting route
 * So what's an intercepting route?

Well, an intercepting route is an alternative route,
which sometimes gets activated depending on
whether you are navigating to it
through an internal link from within the page.

So if you're in that single page application mode
and you're navigating around on the page,
or you are coming from an external link,
or you manually enter the URL or you reloaded the page

so that for the same path, different pages are shown
depending on how you got there.

That's the idea behind an intercepting route
because the intercepting route essentially intercepts
an internal navigation request
and instead of showing the page you would see
if you would reload the page or come to the page
from outside the website, a different page will be shown.

intercepting the page
[slug]
|
|image folder
|  page.tsx
|(.)image folder // "." means the location. so that it means it is intercepting `image` folder in the same directory.
|  page.tsx
*/


// Only for internal routing. Then this page is intercepted alternatively
// instead of `image` page.
// This page is is not activated when reloading page.

// It is useful when it combines with parallel routes
import { DUMMY_NEWS } from "@/dummy-data";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export type NewsImagePropsIntercepting = {
  params: Promise<{ slug: string }>;
}

async function NewsImageIntercepting({ params }: NewsImagePropsIntercepting) {
  const { slug } = await params;
  const newsItem = DUMMY_NEWS.find((news) => news.slug === slug);

  if (!newsItem) {
    notFound();
  }

  return <>
    <h2>Intercepted!</h2>
    <div className="fullscreen-image">
      <img
        src={`/images/news/${newsItem.image}`}
        alt={newsItem.title}
      />
    </div>
  </>
}

function NewsImageInterceptingPage({ params }: NewsImagePropsIntercepting) {
  return <Suspense>
    <NewsImageIntercepting params={params}/>
  </Suspense>
}

export default NewsImageInterceptingPage;