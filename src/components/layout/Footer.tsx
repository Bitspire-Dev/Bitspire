import { Link } from '@/i18n/navigation';
import client from '@tina/__generated__/client';
import { Separator } from '@/components/ui/primitives/separator';

interface FooterProps {
  locale: string;
}

export async function Footer({ locale }: FooterProps) {
  const { data } = await client.queries.footer({
    relativePath: `${locale}.md`,
  });

  const footer = data.footer;
  const navLinks =
    footer?.navLinks?.flatMap(link => (link ? [{ label: link.label, href: link.href }] : [])) ?? [];

  return (
    <footer className="w-full bg-background py-12">
      <Separator className="bg-border/60" />
      <div className="container mx-auto flex max-w-360 flex-col items-center justify-between gap-6 px-6 pt-12 md:flex-row">
        <p className="font-sans text-sm text-muted-foreground">{footer?.copyright ?? ''}</p>

        <nav className="flex flex-wrap items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
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
