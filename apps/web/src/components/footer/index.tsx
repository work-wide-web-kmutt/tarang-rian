import { useTranslation } from "react-i18next";
import { Wwwk } from "@/components/wwwk";

function Footer() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-4 border-t-2 border-dashed p-10">
      <Wwwk size="sm" />
      <div className="flex flex-col text-lg">
        <h1 className="flex items-center gap-1">
          {t("footer.made_with")}{" "}
          {/* biome-ignore lint/correctness/useImageSize: width/height can be provided via props for flexible sizing */}
          <img
            alt="love"
            className="inline h-5 w-5"
            src="/static/logos/love.svg"
          />{" "}
          {t("footer.by")}
        </h1>
        <h1 className="font-bold">{t("footer.team_name")}</h1>
      </div>
    </div>
  );
}
export default Footer;
