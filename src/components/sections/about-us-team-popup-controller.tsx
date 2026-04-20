"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  POPUP_DATA,
  createTeamMemberHash,
} from "@/components/sections/about-us-team-data";
import type { TeamMemberPopupData } from "@/types";

const TeamMemberPopup = dynamic(
  () =>
    import("@/components/sections/team-member-popup").then(
      (module) => module.TeamMemberPopup,
    ),
  { ssr: false },
);

function getPopupIndexFromHash(
  hash: string,
  popupMemberNames: string[],
): number | null {
  if (!hash) {
    return null;
  }

  const normalizedHash = hash.replace(/^#/, "");
  const memberIndex = popupMemberNames.findIndex(
    (memberName) => createTeamMemberHash(memberName) === normalizedHash,
  );

  return memberIndex >= 0 ? memberIndex : null;
}

function updateHashForIndex(
  index: number,
  popupMemberNames: string[],
): void {
  const memberName = popupMemberNames[index];
  if (!memberName) {
    return;
  }

  window.history.pushState(
    { teamMember: memberName },
    "",
    `#${createTeamMemberHash(memberName)}`,
  );
}

function clearHash(): void {
  const nextUrl = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(window.history.state, "", nextUrl);
}

interface AboutUsTeamPopupControllerProps {
  popupDataOverride?: Record<string, TeamMemberPopupData>;
  popupMemberNames?: string[];
}

export function AboutUsTeamPopupController({
  popupDataOverride,
  popupMemberNames,
}: AboutUsTeamPopupControllerProps) {
  const activePopupData = popupDataOverride ?? POPUP_DATA;
  const activePopupMemberNames = useMemo(
    () =>
      (popupMemberNames ?? Object.keys(activePopupData)).filter(
        (memberName) => memberName in activePopupData,
      ),
    [activePopupData, popupMemberNames],
  );

  const [popupIndex, setPopupIndex] = useState<number | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return getPopupIndexFromHash(window.location.hash, activePopupMemberNames);
  });

  const syncPopupIndexFromLocation = useCallback(() => {
    setPopupIndex(
      getPopupIndexFromHash(window.location.hash, activePopupMemberNames),
    );
  }, [activePopupMemberNames]);

  useEffect(() => {
    const timeoutId = window.setTimeout(syncPopupIndexFromLocation, 0);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [syncPopupIndexFromLocation]);

  useEffect(() => {
    window.addEventListener("hashchange", syncPopupIndexFromLocation);
    window.addEventListener("popstate", syncPopupIndexFromLocation);

    return () => {
      window.removeEventListener("hashchange", syncPopupIndexFromLocation);
      window.removeEventListener("popstate", syncPopupIndexFromLocation);
    };
  }, [syncPopupIndexFromLocation]);

  const closePopup = useCallback(() => {
    clearHash();
    setPopupIndex(null);
  }, []);

  const goToPrevious = useCallback(() => {
    setPopupIndex((currentIndex) => {
      if (currentIndex === null || currentIndex === 0) {
        return currentIndex;
      }

      const nextIndex = currentIndex - 1;
      updateHashForIndex(nextIndex, activePopupMemberNames);
      return nextIndex;
    });
  }, [activePopupMemberNames]);

  const goToNext = useCallback(() => {
    setPopupIndex((currentIndex) => {
      if (
        currentIndex === null ||
        currentIndex >= activePopupMemberNames.length - 1
      ) {
        return currentIndex;
      }

      const nextIndex = currentIndex + 1;
      updateHashForIndex(nextIndex, activePopupMemberNames);
      return nextIndex;
    });
  }, [activePopupMemberNames]);

  if (popupIndex === null) {
    return null;
  }

  const popupMemberName = activePopupMemberNames[popupIndex];
  const activeMember = popupMemberName
    ? activePopupData[popupMemberName]
    : undefined;

  if (!activeMember) {
    return null;
  }

  return (
    <TeamMemberPopup
      key={activeMember.name}
      member={activeMember}
      onClose={closePopup}
      onNext={popupIndex < activePopupMemberNames.length - 1 ? goToNext : null}
      onPrevious={popupIndex > 0 ? goToPrevious : null}
    />
  );
}
