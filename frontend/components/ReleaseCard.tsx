import type { Release } from "@/lib/types";
import Image from "next/image";

interface ReleaseCardProps {
  release: Release;
}

const ReleaseCard: React.FC<ReleaseCardProps> = ({ release }) => {
  const firstImage = release.images?.[0];

  // Custom loader for Next.js Image component (uses dedicated image API route)
  const imageLoader = ({ src }: { src: string }) => {
    return `/api/storage/images/${src}`;
  };

  console.log("firstImage", firstImage);

  return (
    <div className="relative">
      {/* Background shadow div */}
      <div className="absolute top-2 left-2 w-full h-full bg-card/70" />

      {/* Main card content */}
      <div className="relative bg-card">
        <div>
          {firstImage ? (
            <Image
              src={firstImage.id}
              alt={firstImage.alt || release.title}
              loader={imageLoader}
              width={firstImage.width || 500}
              height={firstImage.height || 500}
              className="w-full h-auto"
            />
          ) : (
            <div className="w-full aspect-square bg-gray-200" />
          )}
        </div>
        <div className="p-3">
          <h2 className="text-lg font-semibold mb-2">{release.title}</h2>
          <h4 className="text-lg font-semibold mb-2">
            {release.displayArtist || release.artist?.name}
          </h4>
          <small className="text-xs text-gray-500">{release.releaseDate}</small>
        </div>
      </div>
    </div>
  );
};

export default ReleaseCard;
