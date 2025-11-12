"use client";

import { format } from "date-fns";
import { useState } from "react";
import dynamic from "next/dynamic";
const ModalViewer = dynamic(() => import("@/components/ui/ModalViewer"), { ssr: false });

type Investment = {
  id: string;
  plan: string;
  amountUSD: number;
  roiPercent: number;
  durationDays: number;
  status: string;
  createdAt: string;
  activatedAt?: string | null;
  completedAt?: string | null;
  proofUrl?: string | null;
};

export default function RecentTable({
  loading,
  investments,
}: {
  loading: boolean;
  investments: Investment[];
}) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIdx, setViewerIdx] = useState(0);
  const [viewerImages, setViewerImages] = useState<string[]>([]);

  const openViewer = (url: string) => {
    setViewerImages([url]);
    setViewerIdx(0);
    setViewerOpen(true);
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-gray-300">
          <tr>
            <Th>Date</Th>
            <Th>Plan</Th>
            <Th className="text-right">Amount</Th>
            <Th className="text-right">ROI</Th>
            <Th>Proof</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={6} className="p-6 text-center text-gray-400">Loading…</td>
            </tr>
          )}
          {!loading && investments.length === 0 && (
            <tr>
              <td colSpan={6} className="p-6 text-center text-gray-400">No activity yet.</td>
            </tr>
          )}
          {investments.map((i) => (
            <tr key={i.id} className="border-t border-white/10">
              <td className="p-3">{format(new Date(i.createdAt), "PP p")}</td>
              <td className="p-3 capitalize">{i.plan}</td>
              <td className="p-3 text-right">${i.amountUSD.toLocaleString()}</td>
              <td className="p-3 text-right">{i.roiPercent}%</td>
              <td className="p-3">
                {i.proofUrl ? (
                  <button onClick={() => openViewer(i.proofUrl!)} className="text-emerald-300 hover:text-emerald-200 underline">
                    View
                  </button>
                ) : (
                  <a href={`/dashboard/investments/${i.id}/upload-proof`} className="text-blue-300 hover:text-blue-200 underline">
                    Upload
                  </a>
                )}
              </td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-lg text-xs ${
                  i.status === "active" ? "bg-emerald-500/20 text-emerald-300" :
                  i.status === "pending" ? "bg-amber-500/20 text-amber-300" :
                  i.status === "completed" ? "bg-blue-500/20 text-blue-300" :
                  "bg-rose-500/20 text-rose-300"
                }`}>
                  {i.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {viewerOpen && (
        <ModalViewer images={viewerImages} index={viewerIdx} onClose={() => setViewerOpen(false)} onIndexChange={setViewerIdx} />
      )}
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`text-left p-3 ${className ?? ""}`}>{children}</th>;
}
// End of file