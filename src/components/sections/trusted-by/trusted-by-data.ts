/**
 * "/ Trusted By / From Startups to Enterprise" — the client logos that float in
 * the homepage logo field. Every file in /public/trusted-by is the brand's own
 * mark flattened to white so the set reads as one family on the dark panel.
 * The CMS "Client Logo" documents replace this list when any exist.
 */
export interface ClientLogo {
  /** Brand name, used as the image alt text. */
  name: string;
  src: string;
  /** Intrinsic size (or SVG viewBox) so the browser knows the aspect ratio before the file loads. */
  width: number;
  height: number;
  /** Rendered height in px inside the pill; wordmarks sit around 24–28, emblems a little taller. */
  logoHeight: number;
  /** Flatten a dark-on-transparent mark to white (used for the partnership page's black partner logos). */
  invert?: boolean;
  /** Screen-blend a colour logo so a baked-in black background disappears into the pill. */
  blend?: boolean;
}

const logo = (name: string, file: string, width: number, height: number, logoHeight = 26): ClientLogo => ({
  name,
  src: `/trusted-by/${file}`,
  width,
  height,
  logoHeight,
});

export const DEFAULT_CLIENT_LOGOS: ClientLogo[] = [
  logo("Affinda", "affinda.svg", 9290, 1432, 24),
  logo("Draftable", "draftable.png", 600, 100, 24),
  logo("Zoomerang", "zoomerang.svg", 120, 58, 36),
  logo("BCMS", "bcms.png", 236, 75, 26),
  logo("SyncSpider", "syncspider.png", 400, 112, 30),
  logo("Nagish", "nagish.svg", 179, 56, 30),
  logo("Cirrus Insight", "cirrus-insight.svg", 220, 34, 24),
  logo("FrontBrick", "frontbrick.svg", 120, 22, 22),
  logo("OneLogin", "onelogin.svg", 324.72, 80.64, 24),
  logo("One Identity", "one-identity.svg", 413.64, 73.4065, 22),
  logo("Nursa", "nursa.svg", 190, 41, 24),
  logo("DesignRush", "designrush.svg", 154, 36, 30),
  logo("Warrior Willpower", "warrior-willpower.png", 145, 200, 40),
  logo("Art by Maudsch", "art-by-maudsch.svg", 221, 30, 20),
  logo("My Baskets", "my-baskets.png", 600, 189, 28),
  logo("Zip Moving & Storage", "zip-moving.png", 600, 145, 30),
  logo("Support Adventure", "support-adventure.png", 600, 189, 34),
];
