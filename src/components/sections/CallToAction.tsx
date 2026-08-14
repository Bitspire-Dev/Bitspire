'use client';

import { memo } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { tinaField } from 'tinacms/dist/react';
import type { ComponentProps } from 'react';
import type { PagePartsFragment } from '@tina/__generated__/types';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/primitives/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/primitives/card';
import { FadeIn } from '@/components/ui/composites/fade-in';
import { StaggerContainer, StaggerItem } from '@/components/ui/composites/stagger';

type Href = ComponentProps<typeof Link>['href'];

interface CallToActionProps {
  page: PagePartsFragment;
}

function CallToActionContent({ page }: CallToActionProps) {
  const locale = useLocale();
  const cta = page.callToAction;

  if (!cta?.title) {
    return null;
  }

  return (
    <section className="relative w-full bg-background">
      <div className="container mx-auto max-w-360 px-6 py-24">
        <FadeIn>
          <Card
            data-tina-field={tinaField(page, 'callToAction')}
            className="relative overflow-hidden ring-1 ring-border transition-shadow duration-300 hover:ring-2 hover:ring-ring/20"
          >
            <div className="grid grid-cols-1 items-center gap-8 p-8 lg:grid-cols-2 lg:gap-12 lg:p-12">
              <div className="flex flex-col items-start gap-6">
                <CardHeader className="p-0">
                  <CardTitle
                    data-tina-field={tinaField(cta, 'title')}
                    className="max-w-xl font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
                  >
                    {cta.title}
                  </CardTitle>

                  {cta.description ? (
                    <CardDescription
                      data-tina-field={tinaField(cta, 'description')}
                      className="max-w-lg font-sans text-base text-muted-foreground md:text-lg"
                    >
                      {cta.description}
                    </CardDescription>
                  ) : null}
                </CardHeader>

                <StaggerContainer className="flex flex-wrap gap-3" stagger={0.1}>
                  {cta.primaryLabel ? (
                    <StaggerItem>
                      <Button asChild size="lg" variant="default">
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
                      <Button asChild size="lg" variant="outline">
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
                  className="relative hidden aspect-square w-full max-w-sm justify-self-end lg:flex"
                >
                  <Image
                    src="/layout/gryf-2.png"
                    alt=""
                    fill
                    className="object-contain opacity-90 dark:invert"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </FadeIn>
              ) : null}
            </div>
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}

export const CallToAction = memo(CallToActionContent);
