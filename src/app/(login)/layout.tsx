import React from "react";
import Image from "next/image";
import { Logo } from "@/components/ui/icons";
export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-full w-full flex-col lg:flex-row lg:p-5">
      <div className="flex h-[70px] w-full items-center justify-center rounded-b-lg bg-grey-900 lg:hidden">
        <Logo />
      </div>
      <div className="relative hidden h-full max-w-[560px] flex-1 overflow-hidden rounded-[12px] bg-grey-900 p-10 lg:flex lg:flex-col">
        <Logo className="z-10" />
        <div className="absolute inset-0 z-0 h-full w-full">
          <Image
            src={"/image.png"}
            alt="login and signup illustration image"
            unoptimized
            fill
          />
        </div>
        <div className="z-10 mt-auto flex flex-col gap-6 text-white">
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
