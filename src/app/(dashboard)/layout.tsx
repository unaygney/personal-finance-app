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
      <div className="flex-1 px-4 py-6 md:px-10 md:py-8  overflow-scroll">
        {children}
      </div>
    </div>
  );
}
