import Image from "next/image";

import { cn } from "@/lib/utils";

type PhotoSurfaceProps = {
  src: string;
  title: string;
  className?: string;
  fit?: "cover" | "contain";
  sizes?: string;
};

export function PhotoSurface({
  src,
  title,
  className,
  fit = "cover",
  sizes = "(max-width: 768px) 50vw, 240px",
}: PhotoSurfaceProps) {
  return (
    <div className={cn("relative overflow-hidden bg-surface-strong", className)}>
      {fit === "contain" ? (
        <Image
          alt=""
          aria-hidden="true"
          className="scale-110 object-cover opacity-40 blur-xl"
          fill
          sizes={sizes}
          src={src}
          unoptimized
        />
      ) : null}
      <Image
        alt={title}
        className={cn(fit === "contain" ? "object-contain" : "object-cover")}
        fill
        sizes={sizes}
        src={src}
        unoptimized
      />
    </div>
  );
}
