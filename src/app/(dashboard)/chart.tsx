"use client";
import React from "react";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";

import { cn } from "@/lib/utils";

const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig;

export const description = "A donut chart with text";
export default function Chart({ chartData }: { chartData: any }) {
  const totalAmount = React.useMemo(() => {
    return chartData.reduce(
      (acc: any, curr: any) => acc + Math.abs(curr.amount),
      0,
    );
  }, [chartData]);
  const totalSpent = React.useMemo(() => {
    return chartData.reduce(
      (acc: any, curr: any) => acc + Math.abs(curr.totalSpent),
      0,
    );
  }, [chartData]);

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square max-h-[250px] w-full"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="amount"
          nameKey="category"
          innerRadius={60}
          strokeWidth={5}
        >
          {chartData.map((entry: any, index: any) => (
            <React.Fragment key={`slice-${index}`}>
              <Label position="inside" />
            </React.Fragment>
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      ${totalSpent.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className={cn("fill-muted-foreground", {
                        "fill-secondary-red": totalSpent > totalAmount,
                      })}
                    >
                      of ${totalAmount.toLocaleString()} limit
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
