import { allCourses } from "content-collections";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type AcademicTerm,
  academicTermKey,
  uniqueAcademicTerms,
} from "@/course/academic-term";
import { cn } from "@/lib/utils";
import {
  useAcademicTermActions,
  useActiveAcademicTerm,
} from "@/stores/academic-context";
import { useSelectedGenElectives } from "@/stores/selected";

interface AcademicTermSelectorProps {
  className?: string;
}

function formatTerm(term: AcademicTerm, t: (key: string) => string): string {
  return `${t("academic.year")} ${term.year} · ${t("academic.semester")} ${term.semester}`;
}

export function AcademicTermSelector({ className }: AcademicTermSelectorProps) {
  const { t } = useTranslation();
  const activeTerm = useActiveAcademicTerm();
  const selected = useSelectedGenElectives();
  const { activateTerm } = useAcademicTermActions();

  const availableTerms = useMemo(
    () =>
      uniqueAcademicTerms([
        ...allCourses.map((course) => ({
          year: course.year,
          semester: course.semester,
        })),
        ...selected.map((session) => ({
          year: session.year,
          semester: session.semester,
        })),
        activeTerm,
      ]),
    [activeTerm, selected]
  );

  const activateByKey = (key: string) => {
    const term = availableTerms.find(
      (candidate) => academicTermKey(candidate) === key
    );
    if (term) {
      activateTerm(term);
    }
  };

  return (
    <Select
      onValueChange={(value) => {
        if (value) {
          activateByKey(value);
        }
      }}
      value={academicTermKey(activeTerm)}
    >
      <SelectTrigger
        aria-label={t("academic.select_term")}
        className={cn("w-fit min-w-28", className)}
      >
        <SelectValue>{`${activeTerm.year} / ${activeTerm.semester}`}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableTerms.map((term) => (
          <SelectItem key={academicTermKey(term)} value={academicTermKey(term)}>
            {formatTerm(term, t)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
