import ContactPage from "@/components/pages/contact/contact-page";
import { getContactPage } from "@/lib/sanity-data";

export { metadata } from "@/components/pages/contact/contact-page";

export default async function ContactRoute() {
  const contactPage = await getContactPage().catch(() => null);
  return <ContactPage cmsPage={contactPage} />;
}
