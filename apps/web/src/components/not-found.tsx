import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

interface NotFoundProps {
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function NotFound({ description, action, className }: NotFoundProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex flex-col items-center px-4 md:flex-row md:justify-center md:gap-8",
        className
      )}
    >
      <img
        alt=""
        aria-hidden="true"
        className="mb-4 w-24 shrink-0 object-contain md:mb-0"
        src="/static/icons/not-found.png"
      />
      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <h2 className="font-semibold text-xl">{t("not_found.title")}</h2>
        <p className="text-muted-foreground">{description}</p>
        {action !== null && action !== undefined && action !== false && (
          <div className="mt-4">{action}</div>
        )}
      </div>
    </div>
  );
}
