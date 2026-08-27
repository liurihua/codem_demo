import type { CSSProperties, ReactNode } from "react";
import type { Theme } from "@/lib/types";

type ThemeStyle = CSSProperties & {
  "--theme-primary": string;
  "--theme-accent": string;
};

export function ThemeFrame({ theme, className, children }: { theme: Theme; className: string; children: ReactNode }) {
  const style: ThemeStyle = {
    "--theme-primary": theme.primary,
    "--theme-accent": theme.accent,
  };
  return <main className={className} style={style}>{children}</main>;
}
