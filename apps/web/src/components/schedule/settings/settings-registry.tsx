import type { ReactNode } from "react";
import { SizeSelector } from "./size-selector";

export interface SettingItem {
  id: string;
  label: string;
  keywords: string[];
  render: () => ReactNode;
}

export function getSettingsRegistry(t: (key: string) => string): SettingItem[] {
  return [
    {
      id: "size",
      label: t("settings.size"),
      keywords: ["size", "scale", "dimension", "width", "height", "layout"],
      render: () => <SizeSelector />,
    },
  ];
}

export function filterSettings(
  items: SettingItem[],
  query: string
): SettingItem[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (normalizedQuery === "") {
    return items;
  }

  return items.filter((item) => {
    const normalizedLabel = item.label.toLowerCase();
    const normalizedKeywords = item.keywords.map((k) => k.toLowerCase());

    return (
      normalizedLabel.includes(normalizedQuery) ||
      normalizedKeywords.some((keyword) => keyword.includes(normalizedQuery))
    );
  });
}
