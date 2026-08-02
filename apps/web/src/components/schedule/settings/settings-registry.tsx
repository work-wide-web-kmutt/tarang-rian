import type { ReactNode } from "react";

import { SizeSelector } from "@/components/schedule/settings/size-selector";
import { TimeRangeSelector } from "@/components/schedule/settings/time-range-selector";

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
      header: "settings.group.appearance",
      id: "appearance",
      items: [
        {
          id: "size",
          keywords: ["size", "scale", "dimension", "width", "height", "layout"],
          label: t("settings.size"),
          render: () => <SizeSelector />,
        },
      ],
    },
    {
      header: "settings.group.schedule",
      id: "schedule",
      items: [
        {
          id: "time-range",
          keywords: ["time", "range", "hour", "hours", "schedule", "grid"],
          label: t("settings.time_range"),
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
