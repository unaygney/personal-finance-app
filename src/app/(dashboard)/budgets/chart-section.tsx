"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import React from "react";
import { cn } from "@/lib/utils";

const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig;

export const description = "A donut chart with text";

export function ChartSection({ chartData }: { chartData: any }) {
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

  const slicedChartData = chartData.slice(0, 4);

  return (
    <div className="w-full self-start rounded-lg bg-white p-5 text-grey-500 md:p-8">
      <div className="flex flex-col gap-8 md:flex-row lg:flex-col">
        <div className="mx-auto h-full w-full md:max-w-[296px]">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] w-full"
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
        </div>
        <div className="flex w-full flex-col">
          <h3 className="text-preset-2 text-grey-900">Spending Summary</h3>
          <div className="mt-6 flex flex-col gap-4">
            {slicedChartData.map((item: any, index: any) => (
              <div
                key={index}
                className={`relative flex items-center justify-between pb-4 pl-4 ${
                  index !== chartData.length - 1 ? "border-b" : ""
                }`}
              >
                <span
                  className="absolute bottom-0 left-0 top-0 h-[21px] w-1 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />

                <h4 className="text-preset-4 font-normal text-grey-500">
                  {item.category}
                </h4>
                <p className="text-preset-4 font-normal text-grey-500">
                  <span className="text-preset-3 text-grey-900">
                    ${Math.abs(item.totalSpent)?.toFixed(2) ?? "N/A"}
                  </span>{" "}
                  of ${item.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
