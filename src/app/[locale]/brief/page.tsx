import ContactPageWrapper from "@/components/pages/ContactPageWrapper";
import { getBriefPage } from "@/lib/tina/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "en" }];
}

export default async function BriefPage({ params }: PageProps) {
  const { locale } = await params;
  const data = await getBriefPage(locale);
  return <ContactPageWrapper data={{ ...data, locale }} />;
}
