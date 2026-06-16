"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

export default function DashboardBreadcrumb() {
  const fullPath = usePathname();
  const pathArray = fullPath.split("/").filter(Boolean);

  const buildPath = (index: number) =>
    "/" + pathArray.slice(0, index + 1).join("/");

  const formatLabel = (segment: string) =>
    segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathArray.map((segment, index) => {
          const isLast = index === pathArray.length - 1;
          const href = buildPath(index);
          return (
            <Fragment key={href}>
              <BreadcrumbItem className="hidden md:block">
                {isLast ? (
                  <BreadcrumbPage>{formatLabel(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href} render={<Link href={href} />}>
                    {formatLabel(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
