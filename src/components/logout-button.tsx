"use client";
import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { logout } from "@/app/(dashboard)/actions";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleLogout = () => {
    startTransition(() => {
      logout();
      router.refresh();
    });
  };

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
  );
}
