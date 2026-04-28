interface VCardInput {
  name?: string;
  role?: string;
  company?: string;
  email?: string;
  phone?: string;
  url?: string;
}

const escape = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");

const normalizePhone = (p: string): string | null => {
  const digits = p.replace(/[^\d+]/g, "");
  if (!/^\+?\d{8,15}$/.test(digits)) return null;
  return digits.startsWith("+") ? digits : `+${digits}`;
};

export function generateVCard(input: VCardInput): string {
  if (!input.name && !input.email && !input.phone) return "";
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  if (input.name) lines.push(`FN:${escape(input.name)}`);
  if (input.role || input.company) {
    lines.push(
      `TITLE:${escape([input.role, input.company].filter(Boolean).join(", "))}`,
    );
  }
  if (input.email) lines.push(`EMAIL:${escape(input.email)}`);
  if (input.phone) {
    const tel = normalizePhone(input.phone);
    if (tel) lines.push(`TEL:${tel}`);
  }
  if (input.url) lines.push(`URL:${escape(input.url)}`);
  lines.push("END:VCARD");
  return lines.join("\r\n") + "\r\n";
}

export function generateVCardFilename(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacriticals
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}.vcf`;
}
