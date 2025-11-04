"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SectionTitle from "./ui/SectionTitle";
import ReleaseCard from "./ReleaseCard";
import type { Release } from "@/lib/types";

interface ReleasesResponse {
  releases: Release[];
  pagination: {
    page: 1;
    limit: 8;
    total: 8;
    pages: 1;
  };
}

const fetchLatestReleases = async (): Promise<ReleasesResponse> => {
  const { data } = await axios.get("/api/releases?limit=8");
  return data;
};

const LatestReleases: React.FC = () => {
  const { data: latestReleases, isLoading } = useQuery<ReleasesResponse>({
    queryKey: ["latestReleases"],
    queryFn: fetchLatestReleases,
  });

  return (
    <section>
      <SectionTitle title="Latest Releases" buttonTitle="View all releases" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 pb-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center">Loading...</div>
        ) : (
          <>
            {latestReleases?.releases?.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default LatestReleases;
