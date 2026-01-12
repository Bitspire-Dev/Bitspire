import HomePageWrapper from "@/components/pages/HomePageWrapper";
import { getHomePage } from "@/lib/tina/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const data = await getHomePage(locale);
  return <HomePageWrapper data={{ ...data, locale }} />;
}
