import React from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Background } from "@/components/layout/Background";

export default async function AdminLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "pl" && locale !== "en") {
    notFound();
  }
  const currentLocale = locale;

  return (
    <NextIntlClientProvider locale={currentLocale} messages={{}}>
      <Background />
      <Header locale={currentLocale} linkMode="admin" />
      <main className="relative z-10">{children}</main>
      <Footer locale={currentLocale} linkMode="admin" />
    </NextIntlClientProvider>
  );
}
