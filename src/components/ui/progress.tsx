"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorColor?: string;
  addedValue?: number;
  withdrawnValue?: number;
  maxValue: number;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      indicatorColor,
      addedValue = 0,
      withdrawnValue = 0,
      maxValue,
      ...props
    },
    ref,
  ) => {
    const progressPercentage = Math.min(((value || 0) / maxValue) * 100, 100);

    const addedPercentage = Math.min(
      (addedValue / maxValue) * 100 + progressPercentage,
      100,
    );

    const withdrawnPercentage = Math.max(
      progressPercentage - (withdrawnValue / maxValue) * 100,
      0,
    );

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
          className,
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 transition-all"
          style={{
            transform: `translateX(-${100 - progressPercentage}%)`,
            backgroundColor: indicatorColor,
          }}
        />

        {addedValue > 0 && addedPercentage > progressPercentage && (
          <ProgressPrimitive.Indicator
            className="absolute left-0 top-0 z-10 h-full w-full bg-green-500 opacity-50 transition-all"
            style={{
              transform: `translateX(-${100 - addedPercentage}%)`,
            }}
          />
        )}

        {withdrawnValue > 0 && withdrawnPercentage < progressPercentage && (
          <ProgressPrimitive.Indicator
            className="absolute left-0 top-0 h-full w-full bg-red-900 opacity-50 transition-all"
            style={{
              transform: `translateX(-${100 - withdrawnPercentage}%)`,
            }}
          />
        )}
      </ProgressPrimitive.Root>
    );
  },
);

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
