import { useId, type SVGProps } from "react";

/**
 * Gradient arrow-up-right icon used as CTA decoration across service pages.
 * viewBox 0 0 11.5 11.5 — gradient stroke from #998AFF to #2A2260.
 * Uses static gradient IDs (all instances share one gradient definition) to
 * avoid SSR/client useId hydration mismatches in Client Components.
 */
export function GradientArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  const id = useId();
  const g0 = `${id}-aur-0`;
  const g1 = `${id}-aur-1`;

  return (
    <svg
      aria-hidden="true"
      fill="none"
      suppressHydrationWarning
      viewBox="0 0 11.5 11.5"
      {...props}
    >
      <path
        d="M0.75 10.75L10.75 0.75"
        stroke={`url(#${g0})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        suppressHydrationWarning
      />
      <path
        d="M0.75 0.75H10.75V10.75"
        stroke={`url(#${g1})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        suppressHydrationWarning
      />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={g0}
          suppressHydrationWarning
          x1="18.131"
          x2="-3.23742"
          y1="3.30556"
          y2="10.7207"
        >
          <stop offset="0.168269" stopColor="#998AFF" />
          <stop offset="0.5" stopColor="#9956AF" />
          <stop offset="1" stopColor="#2A2260" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={g1}
          suppressHydrationWarning
          x1="18.131"
          x2="-3.23742"
          y1="3.30556"
          y2="10.7207"
        >
          <stop offset="0.168269" stopColor="#998AFF" />
          <stop offset="0.5" stopColor="#9956AF" />
          <stop offset="1" stopColor="#2A2260" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Diagonal arrow icon (22x22) used in success story cards.
 * Replaces ~8 <Image src="...arrow-circle/group27.svg"> instances.
 * Stroke uses currentColor for dark-mode compatibility.
 */
export function DiagonalArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 22 22" {...props}>
      <path
        d="M1 21L21 1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M1 1H21V21"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

/**
 * Plus icon (19x19) used as FAQ toggle across all service/partnership pages.
 * Replaces ~16+ <Image src="...faq-plus/faq-icon/vector.svg"> instances.
 * Stroke uses currentColor for dark-mode compatibility.
 */
export function FaqPlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 19 19" {...props}>
      <path
        d="M9.5 0.5V18.5M18.5 9.5H0.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Gradient right-arrow icon (15x15) used in process-step-switcher active state.
 * Replaces ~8 <Image src="...active-arrow.svg"> instances.
 * Gradient stroke from #998AFF to #2A2260.
 */
export function ProcessArrowActiveIcon(props: SVGProps<SVGSVGElement>) {
  const id = useId();
  const g0 = `${id}-pa-0`;
  const g1 = `${id}-pa-1`;

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 15 15" {...props}>
      <path
        d="M0.5 7.5H14.5"
        stroke={`url(#${g0})`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 0.5L14.5 7.5L7.5 14.5"
        stroke={`url(#${g1})`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={g0}
          x1="24.8333"
          x2="23.4709"
          y1="7.75556"
          y2="14.3744"
        >
          <stop offset="0.168269" stopColor="#998AFF" />
          <stop offset="0.5" stopColor="#9956AF" />
          <stop offset="1" stopColor="#2A2260" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={g1}
          x1="19.6667"
          x2="3.39737"
          y1="4.07778"
          y2="6.90063"
        >
          <stop offset="0.168269" stopColor="#998AFF" />
          <stop offset="0.5" stopColor="#9956AF" />
          <stop offset="1" stopColor="#2A2260" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Muted right-arrow icon (15x15) used in process-step-switcher inactive state.
 * Replaces ~8 <Image src="...muted-arrow.svg"> instances.
 * Stroke uses currentColor — styled via className (grey by default, dark-mode invert).
 */
export function ProcessArrowMutedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 15 15" {...props}>
      <path
        d="M0.5 7.5H14.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 0.5L14.5 7.5L7.5 14.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
