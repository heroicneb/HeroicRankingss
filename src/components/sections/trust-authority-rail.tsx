import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";
import type { TrustAuthorityItem } from "@/types";

export interface TrustAuthorityRailProps {
  items: TrustAuthorityItem[];
}

type RailColumn = {
  delay: string;
  duration: string;
  itemIndexes: number[];
  startOffset: number;
};

function isTrustAuthorityItem(
  item: TrustAuthorityItem | undefined,
): item is TrustAuthorityItem {
  return Boolean(item);
}

const RAIL_COLUMNS: RailColumn[] = [
  {
    delay: "-9s",
    duration: "27s",
    itemIndexes: [0, 1, 2, 3, 4],
    startOffset: 46,
  },
  {
    delay: "-16s",
    duration: "31s",
    itemIndexes: [4, 5, 6, 7, 8, 9],
    startOffset: -64,
  },
  {
    delay: "-12s",
    duration: "29s",
    itemIndexes: [8, 9, 10, 11, 12, 13],
    startOffset: 12,
  },
  {
    delay: "-18s",
    duration: "33s",
    itemIndexes: [13, 14, 15, 16, 17, 18],
    startOffset: -10,
  },
];

export const TRUST_AUTHORITY_RAIL_HEIGHT_CLASS = "h-[580px]";

function TrustAuthorityCard({ item }: { item: TrustAuthorityItem }) {
  return (
    <article className="flex h-[100px] w-[160px] flex-col items-center rounded-[20px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-1 text-center dark:border-[color-mix(in_srgb,var(--color-hr-pure-white)_10%,var(--color-bg-dark))] dark:bg-[var(--color-bg-dark)] [transform:translateZ(0)] [backface-visibility:hidden]">
      <span
        aria-hidden
        className={cn(
          "trust-authority-icon mt-[25px] inline-block size-7 rounded-full",
          item.iconTone === "google"
            ? "trust-authority-icon-google"
            : "trust-authority-icon-hubspot",
        )}
      />
      <p
        className={cn(
          "type-cert mt-[5px] text-[var(--color-hr-grey)] dark:text-[color-mix(in_srgb,var(--color-hr-pure-white)_50%,var(--color-bg-dark))]",
          item.compact ? "w-[136px]" : "w-[156px]",
        )}
      >
        {item.label}
      </p>
    </article>
  );
}

export function TrustAuthorityRail({ items }: TrustAuthorityRailProps) {
  return (
    <div
      className={cn(
        "trust-authority-rail relative w-[670px] overflow-hidden",
        TRUST_AUTHORITY_RAIL_HEIGHT_CLASS,
      )}
    >
      <div className="grid h-full w-full grid-cols-4 gap-[10px]">
        {RAIL_COLUMNS.map((column, columnIndex) => {
          const columnItems = column.itemIndexes
            .map((itemIndex) => items[itemIndex])
            .filter(isTrustAuthorityItem);
          const stackHeight =
            columnItems.length * 100 + columnItems.length * 10;
          const trackStyle = {
            "--ta-delay": column.delay,
            "--ta-distance": `-${stackHeight}px`,
            "--ta-duration": column.duration,
            "--ta-start": `${column.startOffset}px`,
          } as CSSProperties;

          return (
            <div
              className="relative h-full w-[160px] overflow-hidden"
              key={`col-${columnIndex}`}
            >
              <div
                className="trust-authority-track is-running flex flex-col gap-[10px]"
                style={trackStyle}
              >
                {[0, 1].flatMap((loopIndex) =>
                  columnItems.map((item, rowIndex) => (
                    <div
                      aria-hidden={loopIndex === 1}
                      key={`${columnIndex}-${loopIndex}-${rowIndex}-${item.label}`}
                    >
                      <TrustAuthorityCard item={item} />
                    </div>
                  )),
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
