import Script from "next/script";
import { headers } from "next/headers";

import { CSP_NONCE_HEADER } from "@/lib/csp";

/**
 * The GA4 property and Microsoft Clarity project already running on the live
 * heroicrankings.com, so reporting continues unbroken after the cutover. Both
 * ids can be overridden per environment; production only.
 */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-JQPE5M229E";
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_ID?.trim() || "vtitv6fbvf";

export async function SiteAnalytics() {
  if (process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === "true") return null;
  const nonce = (await headers()).get(CSP_NONCE_HEADER) ?? undefined;
  const ga = JSON.stringify(GA_MEASUREMENT_ID);
  const clarity = JSON.stringify(CLARITY_PROJECT_ID);

  return (
    <>
      <Script nonce={nonce} src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`} strategy="afterInteractive" />
      <Script id="ga4-init" nonce={nonce} strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${ga});`}
      </Script>
      <Script id="clarity-init" nonce={nonce} strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;${nonce ? `t.nonce=${JSON.stringify(nonce)};` : ""}y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${clarity});`}
      </Script>
    </>
  );
}
