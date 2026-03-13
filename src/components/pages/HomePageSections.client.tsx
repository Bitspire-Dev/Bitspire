"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { tinaField } from "tinacms/dist/react";
import { canPrefetchInBackground, schedulePageIdleTask } from "@/lib/ui/prefetch";

const SectionPlaceholder = ({ minHeight }: { minHeight: string }) => (
  <div className="w-full" style={{ minHeight }} aria-hidden="true" />
);

const loadTechnologySection = () => import("@/components/sections/home-page/Technology");
const loadFeaturesSection = () => import("@/components/sections/home-page/Features");
const loadFeaturedProjectsCarouselSection = () => import("@/components/sections/home-page/FeaturedProjectsCarousel");
const loadStatisticsSection = () => import("@/components/sections/home-page/Statistics");

const Technology = dynamic(loadTechnologySection, {
  loading: () => <SectionPlaceholder minHeight="240px" />
});

const Features = dynamic(loadFeaturesSection, {
  loading: () => <SectionPlaceholder minHeight="520px" />
});

const FeaturedProjectsCarousel = dynamic(loadFeaturedProjectsCarouselSection, {
  loading: () => <SectionPlaceholder minHeight="520px" />
});

const Statistics = dynamic(
  () => loadStatisticsSection().then((mod) => mod.Statistics),
  {
    loading: () => <SectionPlaceholder minHeight="420px" />
  }
);

function preloadHomePageSections() {
  void Promise.allSettled([
    loadTechnologySection(),
    loadFeaturesSection(),
    loadFeaturedProjectsCarouselSection(),
    loadStatisticsSection(),
  ]);
}

export function HomePageSectionsWarmup() {
  useEffect(() => {
    if (!canPrefetchInBackground()) {
      return;
    }

    return schedulePageIdleTask(() => {
      preloadHomePageSections();
    }, { timeout: 5000, fallbackDelay: 700 });
  }, []);

  return null;
}

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
