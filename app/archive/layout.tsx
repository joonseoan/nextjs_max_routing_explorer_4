// paralell route!
// We can not use "children" props in the layout.ta
// because pararell rout shows multiple pages at the same time.
// localhost:3000/archive : works
// localhost:3000/latest: not found.

// [TODO!]
// Next!! why we need paraleel route!!!!!!!!!!!!

import { ReactNode } from "react";

// where it is folder that the route has paralle with @ symbol
function ArchiveLayout({ archive, latest }: { archive: ReactNode, latest: ReactNode }) {
  return (
    <div>
      <h1>News Archive</h1>
      {/* Paralell routes that two routes show up in the s */}
      <section id="archive-filter">
        {archive}
      </section>
      <section id="archive-latest">
        {latest}
      </section>
    </div>
  );
  
}

export default ArchiveLayout;