"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { FC } from "react";
import { NavItem, navItems } from "./nav-config";

// Default user-friendly labels for common admin routes
const ROUTE_LABELS: Record<string, string> = {
  admin: "Admin",
  projects: "Projects",
  categories: "Categories",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
  profile: "Profile & Socials",
};

// Map plural section names to their singular form for "New [Item]" / "Edit [Item]"
const ENTITY_SINGULARS: Record<string, string> = {
  projects: "Project",
  categories: "Category",
  skills: "Skill",
  experience: "Experience",
  education: "Education",
  profile: "Profile",
};

function getEntitySingular(segment: string): string {
  const lower = segment.toLowerCase();
  if (ENTITY_SINGULARS[lower]) {
    return ENTITY_SINGULARS[lower];
  }
  const clean = segment.replace(/-/g, " ").trim();
  if (clean.endsWith("ies")) return clean.slice(0, -3) + "y";
  if (clean.endsWith("s") && !clean.endsWith("ss")) return clean.slice(0, -1);
  return clean.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Check if a URL segment is a dynamic identifier (MongoDB ObjectId, UUID, or numeric ID)
function isDynamicIdentifier(segment: string): boolean {
  const isMongoId = /^[0-9a-fA-F]{24}$/.test(segment);
  const isUuid = /^[0-9a-fA-F-]{36}$/.test(segment);
  const isNumeric = /^\d+$/.test(segment);
  return isMongoId || isUuid || isNumeric;
}

interface AdminBreadcrumbProps {
  customLabels?: Record<string, string>;
  className?: string;
}

export const AdminBreadcrumb: FC<AdminBreadcrumbProps> = ({
  customLabels = {},
  className = "",
}) => {
  const pathname = usePathname();

  // If on login, do not show admin breadcrumbs
  if (pathname === "/admin/login") return null;

  // Split path into segments, ignoring empty strings (e.g., "/admin/projects/new" -> ["admin", "projects", "new"])
  const segments = pathname.split("/").filter(Boolean);

  // If no segments or not an admin route, return null
  if (segments.length === 0) return null;

  const breadcrumbItems = segments.map((segment, index) => {
    const currentHref = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;
    const parentSegment = index > 0 ? segments[index - 1] : "";

    // 1. Check custom overrides first
    if (customLabels[currentHref]) {
      return { href: currentHref, title: customLabels[currentHref], isLast };
    }

    // 2. Action: "new" -> "New Project", "New Category", etc.
    if (segment.toLowerCase() === "new" && parentSegment) {
      return {
        href: currentHref,
        title: `New ${getEntitySingular(parentSegment)}`,
        isLast,
      };
    }

    // 3. Action: dynamic ID -> "Edit Project", "Edit Category", etc.
    if (isDynamicIdentifier(segment) && parentSegment) {
      return {
        href: currentHref,
        title: `Edit ${getEntitySingular(parentSegment)}`,
        isLast,
      };
    }

    // 4. Action: "edit" explicitly in path
    if (segment.toLowerCase() === "edit" && parentSegment) {
      return {
        href: currentHref,
        title: `Edit ${getEntitySingular(parentSegment)}`,
        isLast,
      };
    }

    // 5. Predefined route dictionary
    if (ROUTE_LABELS[segment.toLowerCase()]) {
      return {
        href: currentHref,
        title: ROUTE_LABELS[segment.toLowerCase()],
        isLast,
      };
    }

    // 6. Matched nav item from layout config
    const matchedItem = navItems.find((item) => item.href === currentHref);
    if (matchedItem?.title) {
      return {
        href: currentHref,
        title: matchedItem.title,
        isLast,
      };
    }

    // 7. Fallback: humanize kebab-case segment
    const fallbackTitle = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      href: currentHref,
      title: fallbackTitle,
      isLast,
    };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-xs text-muted-foreground font-medium ${className}`}
    >
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center gap-1.5">
          {index > 0 && (
            <ChevronRight
              aria-hidden="true"
              className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0"
            />
          )}
          {item.isLast ? (
            <span
              aria-current="page"
              className="text-foreground font-semibold"
            >
              {item.title}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default AdminBreadcrumb;
