import PrivacyPolicyPage from "@/components/pages/privacy-policy/privacy-policy-page";
import { getLegalPageBySlug } from "@/lib/sanity-data";

export { metadata } from "@/components/pages/privacy-policy/privacy-policy-page";

export default async function PrivacyPolicyRoute() {
  const privacyPage = await getLegalPageBySlug("privacy-policy").catch(() => null);
  return <PrivacyPolicyPage cmsPage={privacyPage} />;
}
