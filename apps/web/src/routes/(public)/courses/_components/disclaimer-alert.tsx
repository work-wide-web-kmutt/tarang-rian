import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DisclaimerAlert() {
  const { t } = useTranslation();

  return (
    <Alert className="border-destructive" variant="destructive">
      <AlertTriangle />
      <AlertTitle>{t("courses.disclaimer_head")}</AlertTitle>
      <AlertDescription>
        {t("courses.disclaimer_text1")}{" "}
        <a
          href="https://www.facebook.com/genKMUTTofficial"
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("courses.disclaimer_text2")}
        </a>{" "}
        {t("courses.disclaimer_text3")}
      </AlertDescription>
    </Alert>
  );
}
