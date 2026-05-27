"use client";

import { Label, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  processed: {
    label: "Processed",
    color: "var(--primary)",
  },
  remaining: {
    label: "Remaining",
    color: "var(--hairline-soft)",
  },
} satisfies ChartConfig;

type ProcessingProgressDonutProps = {
  progress: number;
};

export function ProcessingProgressDonut({
  progress,
}: ProcessingProgressDonutProps) {
  const processed = Math.min(Math.max(progress, 0), 100);
  const remaining = 100 - processed;
  const chartData = [
    {
      status: "processed",
      value: processed,
      fill: "var(--color-processed)",
    },
    {
      status: "remaining",
      value: remaining,
      fill: "var(--color-remaining)",
    },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square size-40 sm:mx-0"
      initialDimension={{ width: 160, height: 160 }}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="status"
          innerRadius={60}
          outerRadius={70}
          paddingAngle={2}
          strokeWidth={0}
        >
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
                      className="fill-ink text-4xl font-medium"
                    >
                      {processed}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 22}
                      className="fill-muted text-xs"
                    >
                      complete
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
