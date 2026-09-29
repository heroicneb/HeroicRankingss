"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

import { formatValue } from "./format-value";
import type { TableCellValue, TableColumnSpec, TableSpec } from "./proof-visual-types";

const ROW_STAGGER_MS = 70;

function Position({ value }: { value: number }) {
  return (
    <span
      className={cn(
        "inline-flex min-w-[34px] items-center justify-center rounded-full px-[8px] py-[2px] text-[13px] font-bold leading-[18px] tabular-nums",
        value <= 3 ? "bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)]" : "border border-[var(--color-border-inverse-20)] text-[var(--color-text-inverse-95)]",
      )}
    >
      #{value}
    </span>
  );
}

function Difficulty({ value }: { value: number }) {
  return (
    <span className="inline-flex min-w-[30px] items-center justify-center rounded-[6px] border border-[var(--color-border-inverse-15)] px-[6px] py-[1px] text-[12px] font-bold tabular-nums text-[var(--color-text-inverse-95)]">
      {value}
    </span>
  );
}

function Cell({ column, value }: { column: TableColumnSpec; value: TableCellValue | undefined }) {
  if (value == null || value === "") return <span className="text-[var(--color-text-inverse-30)]">—</span>;
  switch (column.kind) {
    case "position":
      return typeof value === "number" ? <Position value={value} /> : <span>{String(value)}</span>;
    case "positionChange":
      return Array.isArray(value) ? (
        <span className="inline-flex items-center gap-[6px]">
          <span className="text-[13px] tabular-nums text-[var(--color-text-inverse-50)]">#{value[0]}</span>
          <span aria-hidden className="text-[var(--color-text-inverse-50)]">→</span>
          <Position value={value[1]} />
        </span>
      ) : (
        <span>{String(value)}</span>
      );
    case "difficulty":
      return typeof value === "number" ? <Difficulty value={value} /> : <span>{String(value)}</span>;
    case "number":
      return <span className="tabular-nums">{typeof value === "number" ? formatValue(value, column.format) : String(value)}</span>;
    case "bar": {
      const numeric = typeof value === "number" ? value : 0;
      const width = column.max ? Math.max(4, Math.min(100, (numeric / column.max) * 100)) : 0;
      return (
        <span className="flex flex-col gap-[4px]">
          <span className="tabular-nums">{typeof value === "number" ? formatValue(value, column.format) : String(value)}</span>
          <span aria-hidden className="block h-[3px] w-full min-w-[48px] max-w-[120px] rounded-full bg-[var(--color-surface-inverse-10)]">
            <span className="proof-bar block h-full rounded-full" style={{ "--w": `${width}%` } as CSSProperties} />
          </span>
        </span>
      );
    }
    default:
      return <span>{String(value)}</span>;
  }
}

const alignRight = (kind?: TableColumnSpec["kind"]) => kind === "number" || kind === "difficulty" || kind === "position" || kind === "positionChange" || kind === "bar";

/**
 * Report-style table on the dark panel: rows fade and slide in one after
 * another when the panel is revealed. Numbers are tabular so columns stay
 * aligned while count-ups elsewhere settle.
 */
export function ProofTable({ table, revealed, animate }: { table: TableSpec; revealed: boolean; animate: boolean }) {
  const rowStyle = (index: number): CSSProperties | undefined => (animate ? ({ "--row-delay": `${index * ROW_STAGGER_MS}ms` } as CSSProperties) : undefined);
  const rowClass = (index: number) => cn(animate && "proof-row", animate && revealed && "proof-row-in", index > 0 && "border-t border-[var(--color-border-inverse-10)]");

  return (
    <div className="-mx-[6px] overflow-x-auto overflow-y-hidden [scrollbar-width:thin]">
      <table className="w-full border-collapse text-[13px] leading-[18px] text-[var(--color-text-inverse-95)] lg:text-[14px] lg:leading-[20px]">
        {table.caption ? <caption className="sr-only">{table.caption}</caption> : null}
        <thead>
          <tr>
            {table.columns.map((column) => (
              <th
                className={cn(
                  "px-[8px] pb-[8px] pt-[2px] text-[11px] font-normal uppercase tracking-[0.06em] text-[var(--color-text-inverse-50)]",
                  alignRight(column.kind) ? "text-right" : "text-left",
                  column.optional && "hidden sm:table-cell",
                )}
                key={column.key}
                scope="col"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, index) => (
            <tr className={rowClass(index)} key={index} style={rowStyle(index)}>
              {table.columns.map((column) => (
                <td
                  className={cn("px-[8px] py-[9px] align-middle", alignRight(column.kind) ? "text-right" : "text-left", column.optional && "hidden sm:table-cell")}
                  key={column.key}
                >
                  <Cell column={column} value={row[column.key]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {table.footer ? (
          <tfoot>
            <tr className={cn(rowClass(table.rows.length), "font-bold")} style={rowStyle(table.rows.length)}>
              {table.columns.map((column) => (
                <td
                  className={cn("px-[8px] pb-[2px] pt-[10px] align-middle", alignRight(column.kind) ? "text-right" : "text-left", column.optional && "hidden sm:table-cell")}
                  key={column.key}
                >
                  <Cell column={column} value={table.footer?.[column.key]} />
                </td>
              ))}
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}
