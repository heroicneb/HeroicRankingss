"use server";

import { draftMode } from "next/headers";

export async function disableDraftMode() {
  const dm = await draftMode();
  dm.disable();
}
