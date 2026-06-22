"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink_TP = {
  href: string;
  className?: string;
  children?: React.ReactNode;
};
export default function NavLink({ href, className, children }: NavLink_TP) {
  const path = usePathname();

  return (
    <Link
      href={href}
      className={`${className} relative group uppercase tracking-widest w-full block transition-colors`}>
      {children}
      <span
        className={`absolute bottom-0 left-0 h-px bg-primary group-hover:w-1/2 group-hover:translate-x-1/2 ${path.endsWith(href) ? "w-full" : "w-0"} transition-all duration-300`}
      />
    </Link>
  );
}
