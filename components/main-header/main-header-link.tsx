'use client';
import Link  from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export interface MainHeaderLinkProps {
  href: string;
  children: ReactNode
}

function MainHeaderLink({ href,  children}: MainHeaderLinkProps) {
  const path = usePathname();

  return <Link href={href} className={path.startsWith(href) ? "active" : undefined}>
    {children}
  </Link>
}

export default MainHeaderLink;