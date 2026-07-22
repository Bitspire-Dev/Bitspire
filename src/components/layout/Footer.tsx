import Link from 'next/link';
import client from '@tina/__generated__/client';

interface FooterProps {
  locale: string;
}

export async function Footer({ locale }: FooterProps) {
  const { data } = await client.queries.footer({
    relativePath: `${locale}.md`,
  });

  const footer = data.footer;
  const navLinks = (footer?.navLinks ?? []) as { label: string; href: string }[];

  return (
    <footer className="w-full border-t border-border/60 bg-background py-12">
      <div className="container mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <p className="font-sans text-sm text-muted-foreground">{footer?.copyright ?? ''}</p>

        <nav className="flex flex-wrap items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
