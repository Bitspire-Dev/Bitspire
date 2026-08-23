'use client';

import { memo } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { tinaField } from 'tinacms/dist/react';
import type { ComponentProps } from 'react';
import type { PagePartsFragment } from '@tina/__generated__/types';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/primitives/button';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { StaggerContainer, StaggerItem } from '@/components/animations/primitives/stagger';
import { useMounted } from '@/lib/use-mounted';

type Href = ComponentProps<typeof Link>['href'];

interface CallToActionProps {
  page: PagePartsFragment;
}

function CallToActionContent({ page }: CallToActionProps) {
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const cta = page.callToAction;
  const gryfSrc = mounted && resolvedTheme === 'dark'
    ? '/layout/dark-mode/gryf-cta.png'
    : '/layout/light-mode/gryf-cta.png';

  if (!cta?.title) {
    return null;
  }

  return (
    <section
      data-tina-field={tinaField(page, 'callToAction')}
      className="relative w-full bg-background"
    >
      <div className="container mx-auto max-w-360 px-6 py-24">
        <FadeIn>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col items-start gap-8">
              <h2
                data-tina-field={tinaField(cta, 'title')}
                className="max-w-3xl font-heading text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl"
              >
                {cta.title}
              </h2>

              {cta.description ? (
                <p
                  data-tina-field={tinaField(cta, 'description')}
                  className="max-w-2xl font-sans text-lg text-muted-foreground md:text-xl lg:text-2xl"
                >
                  {cta.description}
                </p>
              ) : null}

              <StaggerContainer className="flex flex-wrap gap-4" stagger={0.1}>
                {cta.primaryLabel ? (
                  <StaggerItem>
                    <Button
                      asChild
                      size="lg"
                      variant="default"
                      className="h-11 px-6 text-base md:h-12 md:px-8 md:text-lg"
                    >
                      <Link
                        data-tina-field={tinaField(cta, 'primaryLabel')}
                        href={(cta.primaryHref ?? '/contact') as Href}
                        locale={locale}
                      >
                        {cta.primaryLabel}
                      </Link>
                    </Button>
                  </StaggerItem>
                ) : null}

                {cta.secondaryLabel ? (
                  <StaggerItem>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-11 px-6 text-base md:h-12 md:px-8 md:text-lg"
                    >
                      <Link
                        data-tina-field={tinaField(cta, 'secondaryLabel')}
                        href={(cta.secondaryHref ?? '/portfolio') as Href}
                        locale={locale}
                      >
                        {cta.secondaryLabel}
                      </Link>
                    </Button>
                  </StaggerItem>
                ) : null}
              </StaggerContainer>
            </div>

            {cta.showImage !== false ? (
              <FadeIn
                delay={0.2}
                className="relative aspect-2500/1555 w-full max-w-xl justify-self-end lg:block"
              >
                <Image
                  src={gryfSrc}
                  alt={locale === 'pl' ? 'Gryf' : 'Griffin'}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </FadeIn>
            ) : null}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export const CallToAction = memo(CallToActionContent);
