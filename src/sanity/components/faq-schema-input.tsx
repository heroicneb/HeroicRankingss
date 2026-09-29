import type { PortableTextBlock } from "@portabletext/react";
import { useCallback } from "react";
import { set, useFormValue, type ArrayOfObjectsInputProps, type ObjectInputProps } from "sanity";

import { extractFaqFromPortableText } from "@/lib/faq-from-portable-text";

const NOTE_STYLE = { fontSize: 13, lineHeight: "20px", margin: "0 0 12px", opacity: 0.85 } as const;
const BUTTON_STYLE = {
  border: "1px solid currentColor",
  borderRadius: 4,
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  font: "inherit",
  fontSize: 13,
  padding: "6px 12px",
} as const;

const key = () => Math.random().toString(36).slice(2, 10);

/** Wraps the whole "FAQ schema" object: shows how many questions the article's own FAQ section yields. */
export function FaqSchemaObjectInput(props: ObjectInputProps) {
  const body = useFormValue(["body"]) as PortableTextBlock[] | undefined;
  const mode = (props.value as { mode?: string } | undefined)?.mode ?? "auto";
  const detected = extractFaqFromPortableText(body).length;
  const note =
    mode === "manual"
      ? "Manual: the questions below are published as FAQ schema."
      : mode === "off"
        ? "Off: no FAQ schema is published for this post."
        : detected
          ? `Auto: ${detected} question${detected === 1 ? "" : "s"} detected in the article's "Frequently Asked Questions" section will be published as FAQ schema.`
          : "Auto: no FAQ section found in the article. Add an H2 \"Frequently Asked Questions\" with H3 questions, or switch to Manual.";
  return (
    <div>
      <p style={NOTE_STYLE}>{note}</p>
      {props.renderDefault(props)}
    </div>
  );
}

/** The manual list, with a button that copies the article's detected FAQs into it. */
export function FaqSchemaItemsInput(props: ArrayOfObjectsInputProps) {
  const body = useFormValue(["body"]) as PortableTextBlock[] | undefined;
  const { onChange } = props;
  const detected = extractFaqFromPortableText(body);
  const pull = useCallback(() => {
    onChange(set(detected.map((item) => ({ _type: "faqSchemaItem", _key: key(), question: item.question, answer: item.answer }))));
  }, [detected, onChange]);
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button disabled={!detected.length} onClick={pull} style={{ ...BUTTON_STYLE, opacity: detected.length ? 1 : 0.5 }} type="button">
          {detected.length ? `Pull ${detected.length} FAQ${detected.length === 1 ? "" : "s"} from the article` : "No FAQ section found in the article"}
        </button>
      </div>
      {props.renderDefault(props)}
    </div>
  );
}
