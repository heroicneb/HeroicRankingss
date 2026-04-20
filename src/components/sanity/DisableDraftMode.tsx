"use client";

import { useTransition } from "react";
import { disableDraftMode } from "@/app/actions/draft-mode";

export function DisableDraftMode() {
  const [pending, startTransition] = useTransition();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-gray-800"
        disabled={pending}
        onClick={() => startTransition(() => disableDraftMode())}
        type="button"
      >
        {pending ? "Disabling..." : "Disable Draft Mode"}
      </button>
    </div>
  );
}
