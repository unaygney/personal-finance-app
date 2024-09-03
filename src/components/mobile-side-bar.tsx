"use client";
import React from "react";
import { ArrowsDownUp, ChartDonut, House, Jar, Receipt } from "./ui/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  {
    id: 0,
    name: "Overview",
    icon: <House />,
    link: "/",
  },
  {
    id: 1,
    name: "Transactions",
    icon: <ArrowsDownUp />,
    link: "/transactions",
  },
  {
    id: 2,
    name: "Budgets",
    icon: <ChartDonut />,
    link: "/budgets",
  },
  {
    id: 3,
    name: "Pots",
    icon: <Jar />,
    link: "/pots",
  },
  {
    id: 4,
    name: "Recurring bills",
    icon: <Receipt />,
    link: "/recurring-bills",
  },
] as const;
type NavLinkType = (typeof NAV_LINKS)[number];

export default function MobileSideBar() {
  return (
    <div className="fixed bottom-0 rounded-t-lg left-0 right-0 w-full h-11 bg-grey-900 text-grey-300 pt-2 px-4 md:px-10 md:h-[66px] lg:hidden ">
      <div className="w-full h-full flex">
        {NAV_LINKS.map((link) => (
          <NavLink key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}

function NavLink({ link }: { link: NavLinkType }) {
  const pathname = usePathname();

  return (
    <Link
      href={link.link}
      className={cn(
        "flex-1 gap-1 inline-flex flex-col items-center justify-center  w-full h-full",
        {
          "bg-white text-secondary-green border-b-4 border-secondary-green rounded-t-lg":
            link.link === pathname,
        }
      )}
    >
      <span>{link.icon}</span>
      <p
        className={cn(
          "text-preset-5 text-xs text-grey-300 font-bold hidden md:block ",
          {
            "text-grey-900": link.link === pathname,
          }
        )}
      >
        {link.name}
      </p>
    </Link>
  );
}
