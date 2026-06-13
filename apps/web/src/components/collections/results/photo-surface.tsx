import Image from "next/image";

import { cn } from "@/lib/utils";

type PhotoSurfaceProps = {
  src: string;
  title: string;
  className?: string;
  sizes?: string;
};

export function PhotoSurface({
  src,
  title,
  className,
  sizes = "(max-width: 768px) 50vw, 240px",
}: PhotoSurfaceProps) {
  return (
    <div className={cn("relative overflow-hidden bg-surface-strong", className)}>
      <Image
        alt={title}
        className="object-cover"
        fill
        sizes={sizes}
        src={src}
        unoptimized
      />
    </div>
  );
}
