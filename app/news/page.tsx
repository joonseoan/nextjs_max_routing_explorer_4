import Link from "next/link"


function NewsPage() {
  return <div>
    <div>
      <Link href="/news/abc">ABC</Link>
    </div>
    <div>
      <Link href="/news/def">DEF</Link>
    </div>
    <div>
      <Link href="/news/ghi">GHI</Link>
    </div>
  </div>
}

export default NewsPage;