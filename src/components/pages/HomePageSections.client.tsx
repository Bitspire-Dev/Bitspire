"use client";

import dynamic from "next/dynamic";
import { tinaField } from "tinacms/dist/react";

const SectionPlaceholder = ({ minHeight }: { minHeight: string }) => (
  <div className="w-full" style={{ minHeight }} aria-hidden="true" />
);

const Technology = dynamic(() => import("@/components/sections/home-page/Technology"), {
  loading: () => <SectionPlaceholder minHeight="240px" />
});

const Features = dynamic(() => import("@/components/sections/home-page/Features"), {
  loading: () => <SectionPlaceholder minHeight="520px" />
});

const FeaturedProjectsCarousel = dynamic(() => import("@/components/sections/home-page/FeaturedProjectsCarousel"), {
  loading: () => <SectionPlaceholder minHeight="520px" />
});

const Statistics = dynamic(
  () => import("@/components/sections/home-page/Statistics").then((mod) => mod.Statistics),
  {
    loading: () => <SectionPlaceholder minHeight="420px" />
  }
);

export function TechnologySectionClient({ data }: { data: Record<string, unknown> }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <Technology data={data} />
    </div>
  );
}

export function FeaturesSectionClient({ data }: { data: Record<string, unknown> }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <Features data={data} />
    </div>
  );
}

export function PortfolioHighlightsSectionClient({
  data,
  projectsIndex
}: {
  data: Record<string, unknown>;
  projectsIndex?: Array<Record<string, unknown>>;
}) {
  return (
    <div data-tina-field={tinaField(data)}>
      <FeaturedProjectsCarousel data={data} projectsIndex={projectsIndex} />
    </div>
  );
}

export function StatisticsSectionClient({ data }: { data: Record<string, unknown> }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <Statistics data={data} />
    </div>
  );
}
