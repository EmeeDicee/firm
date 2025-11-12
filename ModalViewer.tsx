"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ModalViewer({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const src = images[index] || images[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange(Math.min(images.length - 1, index + 1));
      if (e.key === "ArrowLeft") onIndexChange(Math.max(0, index - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, index, onClose, onIndexChange]);

  const onWheel: React.WheelEventHandler = (e) => {
    e.preventDefault();
    const next = Math.max(0.5, Math.min(5, scale + (e.deltaY > 0 ? -0.1 : 0.1)));
    setScale(next);
  };

  const onPointerDown: React.PointerEventHandler = (e) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };
  const onPointerMove: React.PointerEventHandler = (e) => {
    if (!startRef.current) return;
    setOffset({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y });
  };
  const onPointerUp: React.PointerEventHandler = () => { startRef.current = null; };

  const download = () => {
    const a = document.createElement("a");
    a.href = src;
    a.download = src.split("/").pop() || "proof";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 text-white">
        <div className="text-sm">Proof {index + 1} / {images.length}</div>
        <div className="flex items-center gap-2">
          <button aria-label="Prev" className="px-3 py-1 rounded bg-white/10" onClick={() => onIndexChange(Math.max(0, index - 1))}>◀</button>
          <button aria-label="Next" className="px-3 py-1 rounded bg-white/10" onClick={() => onIndexChange(Math.min(images.length - 1, index + 1))}>▶</button>
          <button aria-label="Download" className="px-3 py-1 rounded bg-white/10" onClick={download}>Download</button>
          <button aria-label="Close" className="px-3 py-1 rounded bg-white/10" onClick={onClose}>✕</button>
        </div>
      </div>
      <div
        ref={containerRef}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="flex-1 relative overflow-hidden"
      >
        <div
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
          className="w-full h-full grid place-items-center"
        >
          <Image
            src={src}
            alt="Proof image"
            width={1600}
            height={1200}
            placeholder="blur"
            blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
            className="max-h-[80vh] max-w-[90vw] object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}