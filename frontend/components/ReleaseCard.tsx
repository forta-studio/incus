import type { Release } from "@/lib/types";
import HoverEffectImage from "./HoverEffectImage";

interface ReleaseCardProps {
  release: Release;
}

const ReleaseCard: React.FC<ReleaseCardProps> = ({ release }) => {
  const firstImage = release.images?.[0];

  return (
    <div className="relative group">
      {/* Background shadow div */}
      <div className="absolute top-2 left-2 w-full h-full bg-card/70 transition-all duration-300 ease-in-out" />

      {/* Main card content */}
      <div className="relative bg-card transition-all duration-300 ease-in-out translate-x-0 translate-y-0 group-hover:translate-x-2 group-hover:translate-y-2">
        <div>
          {firstImage ? (
            <HoverEffectImage
              src={`/api/storage/images/${firstImage.id}`}
              alt={firstImage.alt || release.title}
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
