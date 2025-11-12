"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function PortfolioAreaChart({
  data,
  headline,
  dateRangeLabel,
  kpis,
  methodologyProfits,
  methodologyInvestments,
  loading,
}: {
  data: { date: string; profits: number; investments: number }[];
  headline: string;
  dateRangeLabel: string;
  kpis: { profits30: number; investments30: number };
  methodologyProfits?: string;
  methodologyInvestments?: string;
  loading: boolean;
}) {
  const totalProfits = data.reduce((s, d) => s + d.profits, 0);
  const last = data.at(-1)?.profits ?? 0;
  const prev = data.at(-2)?.profits ?? 0;
  const delta = last - prev;

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur overflow-hidden">
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="font-semibold">{headline}</div>
          <div className="text-sm text-gray-400">{dateRangeLabel}</div>
        </div>
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-sm text-gray-400">30d Profits</div>
          <div className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis">{new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalProfits)}</div>
          <div className={`inline-flex items-center gap-1 text-sm ${delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {delta >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(Math.abs(delta))}
          </div>
        </div>
      </div>

      {/* Main area chart */}
      <div className="h-72 px-2 pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="earn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="dep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false}/>
            <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#9CA3AF" />
            <YAxis tickLine={false} axisLine={false} stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ background: "rgba(12,12,12,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, color: "#fff" }}
            />
            <Area type="monotone" dataKey="profits" stroke="#22c55e" fill="url(#earn)" strokeWidth={2}/>
            <Area type="monotone" dataKey="investments" stroke="#60a5fa" fill="url(#dep)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mini bars summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 border-t border-white/10">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="text-sm text-gray-400">Investments (by day)</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Bar dataKey="investments" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="text-sm text-gray-400">Totals</div>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <Info label="30-Day Profits" value={new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(kpis.profits30)} tooltip={methodologyProfits} />
            <Info label="30-Day Investments" value={new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(kpis.investments30)} tooltip={methodologyInvestments} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, tooltip }: { label: string; value: string; tooltip?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-gray-400" title={tooltip}>{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
