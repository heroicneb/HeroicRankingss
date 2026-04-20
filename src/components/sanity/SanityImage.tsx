import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { urlFor } from "@/sanity/lib/image";

interface SanityImageProps {
  image: SanityImageSource & { alt?: string; asset?: { metadata?: { lqip?: string } } };
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export function SanityImage({
  image,
  width,
  height,
  sizes,
  priority = false,
  className,
}: SanityImageProps) {
  const imageUrl = urlFor(image).width(width).height(height).url();
  const lqip = image.asset?.metadata?.lqip;

  return (
    <Image
      alt={(image as { alt?: string }).alt || ""}
      blurDataURL={lqip}
      className={className}
      fetchPriority={priority ? "high" : undefined}
      height={height}
      placeholder={lqip ? "blur" : "empty"}
      priority={priority}
      sizes={sizes || `(max-width: 768px) 100vw, ${width}px`}
      src={imageUrl}
      width={width}
    />
  );
}
