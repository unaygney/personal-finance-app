import { Logo } from "@/components/ui/icons";
import React from "react";
import Image from "next/image";
export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full h-full flex flex-col lg:flex-row lg:p-5">
      <div className="w-full  flex items-center justify-center rounded-b-lg bg-grey-900 h-[70px] lg:hidden">
        <Logo />
      </div>
      <div className="relative overflow-hidden h-full hidden lg:flex lg:flex-col max-w-[560px] flex-1 bg-grey-900 p-10 rounded-[12px]">
        <Logo className="z-10" />
        <div className="absolute inset-0 z-0 w-full h-full  ">
          <Image
            src={"/image.png"}
            alt="login and signup illustration image"
            unoptimized
            fill
          />
        </div>
        <div className="flex flex-col gap-6 mt-auto z-10 text-white">
          <h2 className="text-preset-1 max-w-[20ch]">
            Keep track of your money and save for your future
          </h2>
          <p className="text-preset-4 font-normal">
            Personal finance app puts you in control of your spending. Track
            transactions, set budgets, and add to savings pots easily.
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
