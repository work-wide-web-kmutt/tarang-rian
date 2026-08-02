import { GitPullRequest } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useLatestCommit } from "@/hooks/use-latest-commit";

function Footer() {
  const { t } = useTranslation();
  const { data: commit, isLoading, isError } = useLatestCommit();

  return (
    <div className="flex gap-8 border-t-2 border-dashed p-10">
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
              rel="noreferrer"
              target="_blank"
            >
              <Button size="xs">
                <GitPullRequest />
                Github
              </Button>
            </a>
          </div>
          {!(isLoading || isError) && commit && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                {t("footer.latest_commit")}:{" "}
                <a
                  className="font-mono hover:underline"
                  href={commit.html_url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {commit.sha.slice(0, 7)}
                </a>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Footer;
