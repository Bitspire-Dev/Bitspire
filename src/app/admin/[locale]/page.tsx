import { redirect } from "next/navigation";

interface PageProps {
  params: { locale: string };
}

export async function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "en" }];
}

export default function AdminLocaleIndex({ params }: PageProps) {
  const { locale } = params;
  redirect(`/admin/${locale}/home`);
}
