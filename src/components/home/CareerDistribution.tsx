"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useIndustryDistribution } from "@/hooks/usePublicHome";
import { SkeletonBlock } from "@/components/shared/Loading";

const COLORS = [
  "#4F46E5",
  "#6366F1",
  "#818CF8",
  "#A5B4FC",
  "#C7D2FE",
  "#312E81",
  "#3730A3",
  "#4338CA",
  "#4F46E5",
  "#6366F1",
];

export default function CareerDistribution() {
  const { data: distribution, isLoading } = useIndustryDistribution();

  const chartData = distribution?.map((item) => ({
    name: item.industry,
    count: item.count,
  })) ?? [];

  return (
    <section className="bg-[#0A0A0A] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Career Distribution by Industry
          </h2>
          <p className="mt-3 text-base text-[#A1A1AA] max-w-2xl mx-auto">
            See how careers are distributed across different industries in our platform.
          </p>
        </div>
        <div className="mt-12 rounded-2xl border border-[#27272A] bg-[#111111] p-6 sm:p-8">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <SkeletonBlock className="h-8 w-32 rounded-lg" />
              <SkeletonBlock className="h-64 rounded-xl" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm text-[#A1A1AA]">
                No career data available yet.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#71717A" }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 12, fill: "#71717A" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #27272A",
                    backgroundColor: "#111111",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3)",
                    fontSize: "14px",
                    color: "#FFFFFF",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}
