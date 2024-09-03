import MobileSideBar from "@/components/mobile-side-bar";
import SideBar from "@/components/side-bar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full ">
      <MobileSideBar />
      <SideBar />
      {children}
    </div>
  );
}
