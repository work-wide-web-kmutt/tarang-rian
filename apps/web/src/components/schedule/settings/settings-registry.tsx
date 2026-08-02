import type { ReactNode } from "react";
import { SizeSelector } from "./size-selector";
import { TimeRangeSelector } from "./time-range-selector";

export interface SettingItem {
  id: string;
  label: string;
  keywords: string[];
  render: () => ReactNode;
}

export interface SettingsGroup {
  id: string;
  header: string;
  items: SettingItem[];
}

export function getSettingsRegistry(
  t: (key: string) => string
): SettingsGroup[] {
  return [
    {
      id: "appearance",
      header: "settings.group.appearance",
      items: [
        {
          id: "size",
          label: t("settings.size"),
          keywords: ["size", "scale", "dimension", "width", "height", "layout"],
          render: () => <SizeSelector />,
        },
      ],
    },
    {
      id: "schedule",
      header: "settings.group.schedule",
      items: [
        {
          id: "time-range",
          label: t("settings.time_range"),
          keywords: ["time", "range", "hour", "hours", "schedule", "grid"],
          render: () => <TimeRangeSelector />,
        },
      ],
    },
  ];
}

export function filterSettings(
  groups: SettingsGroup[],
  query: string
): SettingsGroup[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (normalizedQuery === "") {
    return groups;
  }

  return groups
    .map((group) => {
      const filteredItems = group.items.filter((item) => {
        const normalizedLabel = item.label.toLowerCase();
        const normalizedKeywords = item.keywords.map((k) => k.toLowerCase());

        return (
          normalizedLabel.includes(normalizedQuery) ||
          normalizedKeywords.some((keyword) =>
            keyword.includes(normalizedQuery)
          )
        );
      });

      if (filteredItems.length === 0) {
        return null;
      }

      return {
        ...group,
        items: filteredItems,
      };
    })
    .filter((group): group is SettingsGroup => group !== null);
}
