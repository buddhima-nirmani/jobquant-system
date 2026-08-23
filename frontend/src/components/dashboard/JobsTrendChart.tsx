"use client";

import { useMemo, useState } from "react";
import type { TrendPoint } from "@/lib/api";

const CREATED_COLOR = "#FF6B00";
const COMPLETED_COLOR = "#2563EB";

const WIDTH = 640;
const HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 28, left: 28 };

export default function JobsTrendChart({ points }: { points: TrendPoint[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { createdPath, completedPath, xFor, yFor, maxValue, gridValues } = useMemo(() => {
    const innerWidth = WIDTH - PADDING.left - PADDING.right;
    const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;

    const max = Math.max(1, ...points.map((p) => Math.max(p.created, p.completed)));
    const niceMax = Math.ceil(max / 4) * 4 || 4;

    const xFor = (index: number) =>
      PADDING.left +
      (points.length <= 1 ? 0 : (index / (points.length - 1)) * innerWidth);
    const yFor = (value: number) =>
      PADDING.top + innerHeight - (value / niceMax) * innerHeight;

    const buildPath = (key: "created" | "completed") =>
      points
        .map((point, index) => `${index === 0 ? "M" : "L"}${xFor(index)},${yFor(point[key])}`)
        .join(" ");

    return {
      createdPath: buildPath("created"),
      completedPath: buildPath("completed"),
      xFor,
      yFor,
      maxValue: niceMax,
      gridValues: [0, niceMax / 4, niceMax / 2, (niceMax * 3) / 4, niceMax],
    };
  }, [points]);

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="relative">
      <div className="mb-3 flex items-center gap-5">
        <LegendDot color={CREATED_COLOR} label="Created" />
        <LegendDot color={COMPLETED_COLOR} label="Completed" />
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Jobs created versus completed per week"
        onMouseLeave={() => setHoverIndex(null)}
      >
        {gridValues.map((value) => (
          <line
            key={value}
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={yFor(value)}
            y2={yFor(value)}
            stroke="#F1F5F9"
            strokeWidth={1}
          />
        ))}

        <path d={createdPath} fill="none" stroke={CREATED_COLOR} strokeWidth={2} strokeLinecap="round" />
        <path d={completedPath} fill="none" stroke={COMPLETED_COLOR} strokeWidth={2} strokeLinecap="round" />

        {points.map((point, index) => (
          <g key={point.label}>
            <circle cx={xFor(index)} cy={yFor(point.created)} r={4} fill={CREATED_COLOR} stroke="#fff" strokeWidth={1.5} />
            <circle cx={xFor(index)} cy={yFor(point.completed)} r={4} fill={COMPLETED_COLOR} stroke="#fff" strokeWidth={1.5} />

            {index % 2 === 0 && (
              <text
                x={xFor(index)}
                y={HEIGHT - 8}
                textAnchor="middle"
                fontSize={10}
                fill="#94A3B8"
              >
                {point.label}
              </text>
            )}

            <rect
              x={xFor(index) - (WIDTH / points.length) / 2}
              y={PADDING.top}
              width={WIDTH / points.length}
              height={HEIGHT - PADDING.top - PADDING.bottom}
              fill="transparent"
              onMouseEnter={() => setHoverIndex(index)}
            />
          </g>
        ))}
      </svg>

      {hovered && (
        <div className="pointer-events-none absolute right-2 top-0 rounded-lg border border-[#EAEAEA] bg-white px-3 py-2 text-xs shadow-md">
          <p className="font-semibold text-[#0F172A]">{hovered.label}</p>
          <p style={{ color: CREATED_COLOR }}>Created: {hovered.created}</p>
          <p style={{ color: COMPLETED_COLOR }}>Completed: {hovered.completed}</p>
        </div>
      )}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-[#475569]">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </div>
  );
}
