import { MODEL_MARKS, type ModelId } from "./model-marks";

export function ModelMark({ id, className }: { id: ModelId; className?: string }) {
  return (
    <svg aria-hidden className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d={MODEL_MARKS[id].path} />
    </svg>
  );
}
