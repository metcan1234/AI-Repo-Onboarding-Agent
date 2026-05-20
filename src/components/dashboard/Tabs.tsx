"use client";

import { cn } from "@/lib/utils";
import { Brain, GitBranch, MessageCircle } from "lucide-react";

export type DashboardTab = "kus-bakisi" | "mimari" | "mentor";

const TABS: { id: DashboardTab; label: string; icon: typeof Brain }[] = [
  { id: "kus-bakisi", label: "Kuş Bakışı", icon: Brain },
  { id: "mimari", label: "Mimari Yol Haritası", icon: GitBranch },
  { id: "mentor", label: "AI Mentor Chat", icon: MessageCircle },
];

interface TabsProps {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
  disabled?: boolean;
}

export function Tabs({ active, onChange, disabled }: TabsProps) {
  return (
    <div
      className="flex flex-wrap gap-2 border-b border-surface-border pb-0"
      role="tablist"
    >
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={active === id}
          disabled={disabled}
          onClick={() => onChange(id)}
          className={cn(
            "inline-flex items-center gap-2 rounded-t-lg px-4 py-3 text-sm font-medium transition",
            active === id
              ? "border border-b-0 border-surface-border bg-surface-elevated text-white"
              : "text-slate-400 hover:text-slate-200",
            disabled && "cursor-not-allowed opacity-40"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
