import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Brand color values for reference and scripting
export const brandColors = {
  forest: "#0F3D2E",
  charcoal: "#1C1C1E",
  gold: "#C89B3C",
  terracotta: "#B85C38",
  slate: "#4A6FA5",
  cream: "#FAF6EE",
  mist: "#F4F6F5",
} as const;

export const businessUnitBranding = {
  the_hall: {
    name: "The Hall",
    accent: brandColors.gold,
    themeClass: "theme-hall",
  },
  the_table: {
    name: "The Table",
    accent: brandColors.terracotta,
    themeClass: "theme-table",
  },
  the_press: {
    name: "The Press",
    accent: brandColors.slate,
    themeClass: "theme-press",
  },
} as const;
