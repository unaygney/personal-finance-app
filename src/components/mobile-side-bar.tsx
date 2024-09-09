'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { cn } from '@/lib/utils'

import { ArrowsDownUp, ChartDonut, House, Jar, Receipt } from './ui/icons'

const NAV_LINKS = [
  {
    id: 0,
    name: 'Overview',
    icon: <House />,
    link: '/',
  },
  {
    id: 1,
    name: 'Transactions',
    icon: <ArrowsDownUp />,
    link: '/transactions',
  },
  {
    id: 2,
    name: 'Budgets',
    icon: <ChartDonut />,
    link: '/budgets',
  },
  {
    id: 3,
    name: 'Pots',
    icon: <Jar />,
    link: '/pots',
  },
  {
    id: 4,
    name: 'Recurring bills',
    icon: <Receipt />,
    link: '/recurring-bills',
  },
] as const
type NavLinkType = (typeof NAV_LINKS)[number]

export default function MobileSideBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-11 w-full rounded-t-lg bg-grey-900 px-4 pt-2 text-grey-300 md:h-[66px] md:px-10 lg:hidden">
      <div className="flex h-full w-full">
        {NAV_LINKS.map((link) => (
          <NavLink key={link.id} link={link} />
        ))}
      </div>
    </div>
  )
}

function NavLink({ link }: { link: NavLinkType }) {
  const pathname = usePathname()

  return (
    <Link
      href={link.link}
      className={cn(
        'inline-flex h-full w-full flex-1 flex-col items-center justify-center gap-1',
        {
          'rounded-t-lg border-b-4 border-secondary-green bg-white text-secondary-green':
            link.link === pathname,
        }
      )}
    >
      <span>{link.icon}</span>
      <p
        className={cn(
          'text-preset-5 hidden text-xs font-bold text-grey-300 md:block',
          {
            'text-grey-900': link.link === pathname,
          }
        )}
      >
        {link.name}
      </p>
    </Link>
  )
}
