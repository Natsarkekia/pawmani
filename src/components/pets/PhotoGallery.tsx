"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { images: { url: string; isPrimary: boolean }[]; title: string };

export function PhotoGallery({ images, title }: Props) {
  const primary = images.find((i) => i.isPrimary) ?? images[0];
  const [active, setActive] = useState(primary?.url ?? "");

  const go = (dir: 1 | -1) => {
    const idx = images.findIndex((i) => i.url === active);
    const next = (idx + dir + images.length) % images.length;
    setActive(images[next].url);
  };

  if (!active) return null;

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 group">
        <Image
          src={active}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((img) => (
                <button
                  key={img.url}
                  onClick={() => setActive(img.url)}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    img.url === active ? "bg-white w-4" : "bg-white/60"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img) => (
            <button
              key={img.url}
              onClick={() => setActive(img.url)}
              className={cn(
                "relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                img.url === active ? "border-blue-700" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img.url} alt={title} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
