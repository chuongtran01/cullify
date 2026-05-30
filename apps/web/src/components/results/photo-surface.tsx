type PhotoSurfaceProps = {
  src: string;
  title: string;
  className?: string;
};

export function PhotoSurface({ src, title, className = "" }: PhotoSurfaceProps) {
  return (
    <div
      aria-label={title}
      className={`bg-cover bg-center ${className}`}
      role="img"
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}
