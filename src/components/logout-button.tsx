'use client'

import { Loader2, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'

import { logout } from '@/app/(dashboard)/actions'

import { Button } from './ui/button'

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const handleLogout = () => {
    startTransition(() => {
      logout()
      router.refresh()
    })
  }

  return (
    <Button
      disabled={isPending}
      onClick={handleLogout}
      size="sm"
      className="gap-2"
    >
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <LogOut />
          Logout
        </>
      )}
    </Button>
  )
}
