"use client";
import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";
import {
  ArrowFatLinesLeft,
  Logo,
  ShortLogo,
  ArrowsDownUp,
  ChartDonut,
  House,
  Jar,
  Receipt,
} from "./ui/icons";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

export default function SideBar() {
  const [isActive, setActive] = React.useState<boolean>(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    if (isActive) setActive(false);
  });

  const toggle = () => setActive(!isActive);
  return (
    <motion.div
      ref={ref}
      initial={{
        width: "88px",
      }}
      animate={{
        width: isActive ? "300px" : "88px",
      }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-grey-900 rounded-r-lg text-grey-300  flex-col gap-6 hidden lg:flex"
    >
      {/* LOGO */}
      <div className="py-10 px-8 flex justify-start items-center h-[101px]">
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="full-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href="/">
                <Logo />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="short-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href="/">
                <ShortLogo />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MENU */}
      <nav className="flex-grow   w-full">
        <ul className="flex flex-col gap-1 pr-6">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.id} link={link} isActive={isActive} />
          ))}
        </ul>
      </nav>

      {/* TOGGLE */}
      <motion.button
        onClick={toggle}
        className="mt-auto px-8 py-4 gap-2 flex items-center group mb-6"
      >
        <motion.div
          className="w-fit h-fit group-hover:text-white"
          animate={{
            rotate: isActive ? 0 : 180,
          }}
          transition={{ duration: 0.3 }}
        >
          <ArrowFatLinesLeft />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-preset-3 font-bold text-grey-300 truncate group-hover:text-white"
        >
          Minimize Menu
        </motion.p>
      </motion.button>
    </motion.div>
  );
}

function NavLink({ link, isActive }: { link: NavLinkType; isActive: boolean }) {
  const pathname = usePathname();

  return (
    <Link
      href={link.link}
      className={cn("flex gap-4 items-center px-8 py-4 group", {
        "text-white border-l-4 border-secondary-green bg-white rounded-r-lg":
          pathname === link.link && isActive,
        "hover:text-white hover:bg-grey-800": pathname !== link.link,
      })}
    >
      <span
        className={cn("text-current", {
          "text-secondary-green": pathname === link.link,
        })}
      >
        {link.icon}
      </span>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={cn("text-preset-3 font-bold truncate", {
          "group-hover:text-white": pathname !== link.link,
          "text-grey-900": pathname === link.link,
          "text-grey-300": pathname !== link.link,
        })}
      >
        {link.name}
      </motion.p>
    </Link>
  );
}
