import { cn } from "@/lib/utils";

const PALETTE = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-rose-500",
  "bg-indigo-500",
];

function pickColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
}

type Props = {
  src?: string | null;
  name?: string | null;
  size: number;
  className?: string;
};

export function Avatar({ src, name, size, className }: Props) {
  const letter = (name ?? "?").trim()[0]?.toUpperCase() ?? "?";

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? "User"}
        className={cn("object-cover block", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center text-white font-bold select-none shrink-0",
        pickColor(name ?? "?"),
        className
      )}
      style={{ width: size, height: size, fontSize: Math.max(12, Math.round(size * 0.4)) }}
    >
      {letter}
    </div>
  );
}
