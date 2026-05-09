import type { ReactNode } from "react";

import { AppLink } from "@/components/ui/app-link";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/cn";

export interface ServiceSuccessStory {
  title: string;
  description: string;
  date: string;
  heroClassName: string;
  href?: string;
}

export interface ServiceSuccessStoriesProps {
  buttonIcon: ReactNode;
  cardArrowIcon: ReactNode;
  contentShellClass: string;
  heading: ReactNode;
  pageShellClass: string;
  sectionId: string;
  stories: readonly ServiceSuccessStory[];
}

export function ServiceSuccessStories({
  buttonIcon,
  cardArrowIcon,
  contentShellClass,
  heading,
  pageShellClass,
  sectionId,
  stories,
}: ServiceSuccessStoriesProps) {
  return (
    <section className="pt-[60px] lg:pt-[120px]" id={sectionId}>
      <div className={pageShellClass}>
        <div className={contentShellClass}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="text-center lg:text-left">
              <SectionLabel>/ Proven Performance /</SectionLabel>
              <h2 className="type-h2 mt-5 max-w-[406px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {heading}
              </h2>
            </div>

            <AppLink
              className="type-cta motion-interactive motion-interactive-press hidden h-[45px] w-[168px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)] lg:inline-flex"
              href="/case-study"
              motionPreset="none"
            >
              See All Stories
              {buttonIcon}
            </AppLink>
          </div>

          <div className="mt-[40px] grid grid-cols-1 gap-5 lg:mt-[80px] lg:grid-cols-3">
            {stories.map((story) => {
              const cardContent = (
                <>
                  <div
                    className={cn(
                      "relative h-[250px] lg:h-[305px]",
                      story.heroClassName,
                    )}
                  >
                    <p className="type-h3 absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center text-[var(--color-hr-pure-white)]">
                      {story.title}
                    </p>
                  </div>

                  <div className="absolute right-5 top-[170px] inline-flex size-[60px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] lg:top-[213px] lg:size-[72px]">
                    {cardArrowIcon}
                  </div>

                  <div className="px-5">
                    <h3 className="type-h4 mt-5 text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-left">
                      {story.title}
                    </h3>
                    <p className="type-paragraph mt-[10px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-left">
                      {story.description}
                    </p>
                    <p className="type-paragraph mt-5 pb-5 text-center text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)] lg:pb-0 lg:text-left">
                      {story.date}
                    </p>
                  </div>
                </>
              );

              const cardClassName =
                "relative mx-auto w-full max-w-[348px] overflow-hidden rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:h-[501px] lg:max-w-none lg:rounded-[40px]";

              if (story.href) {
                return (
                  <AppLink
                    aria-label={`Open case study: ${story.title}`}
                    className={cn(
                      cardClassName,
                      "block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2",
                    )}
                    href={story.href}
                    key={story.title}
                    motionPreset="none"
                  >
                    {cardContent}
                  </AppLink>
                );
              }

              return (
                <article className={cardClassName} key={story.title}>
                  {cardContent}
                </article>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center lg:hidden">
            <AppLink
              className="type-cta motion-interactive motion-interactive-press inline-flex h-[45px] w-full max-w-[251px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
              href="/case-study"
              motionPreset="none"
            >
              See All Stories
              {buttonIcon}
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  );
}
