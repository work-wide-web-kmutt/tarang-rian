import { GithubIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Wwwk } from "@/components/wwwk";

function Footer() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 border-t-2 border-dashed p-10">
      <div className="flex gap-4">
        <Wwwk size="xs" />
        <div className="flex flex-col text-sm">
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
      <div className="flex items-center gap-4">
        <Logo size="xs" />
        <div className="flex flex-col gap-1">
          <h1>Tarang Rian (ตารางเรียน)</h1>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {t("footer.contribute_message")}
            </span>
            <a
              href="https://github.com/work-wide-web-kmutt/tarang-rian/pulls"
              rel="noopener"
              target="_blank"
            >
              <Button size="xs">
                <GithubIcon />
                Github
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Footer;
