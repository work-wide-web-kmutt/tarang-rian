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
  SEMESTERS,
  uniqueAcademicTerms,
} from "@/course/academic-term";
import { cn } from "@/lib/utils";
import {
  useAcademicTermActions,
  useActiveAcademicTerm,
} from "@/stores/academic-context";
import { useSelectedGenElectives } from "@/stores/selected";

interface AcademicTermSelectorProps {
  variant?: "compact" | "split";
  className?: string;
}

function formatTerm(term: AcademicTerm, t: (key: string) => string): string {
  return `${t("academic.year")} ${term.year} · ${t("academic.semester")} ${term.semester}`;
}

export function AcademicTermSelector({
  variant = "split",
  className,
}: AcademicTermSelectorProps) {
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

  const years = useMemo(
    () => [...new Set(availableTerms.map((term) => term.year))],
    [availableTerms]
  );

  const semestersForYear = useMemo(
    () =>
      availableTerms
        .filter((term) => term.year === activeTerm.year)
        .map((term) => term.semester),
    [activeTerm.year, availableTerms]
  );

  const activateByKey = (key: string) => {
    const term = availableTerms.find(
      (candidate) => academicTermKey(candidate) === key
    );
    if (term) {
      activateTerm(term);
    }
  };

  if (variant === "compact") {
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
            <SelectItem
              key={academicTermKey(term)}
              value={academicTermKey(term)}
            >
              {formatTerm(term, t)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={cn("flex w-full md:w-fit", className)}>
      <Select
        onValueChange={(year) => {
          const nextTerm =
            availableTerms.find(
              (term) =>
                term.year === year && term.semester === activeTerm.semester
            ) ?? availableTerms.find((term) => term.year === year);
          if (nextTerm) {
            activateTerm(nextTerm);
          }
        }}
        value={activeTerm.year}
      >
        <SelectTrigger
          aria-label={t("academic.year")}
          className="w-full md:w-35"
        >
          <SelectValue>{activeTerm.year}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(semester) => {
          const nextTerm = availableTerms.find(
            (term) =>
              term.year === activeTerm.year && term.semester === semester
          );
          if (nextTerm) {
            activateTerm(nextTerm);
          }
        }}
        value={activeTerm.semester}
      >
        <SelectTrigger
          aria-label={t("academic.semester")}
          className="w-full border-l-0 md:w-40"
        >
          <SelectValue>
            {t(`filter.semesters.${activeTerm.semester}`)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SEMESTERS.filter((semester) =>
            semestersForYear.includes(semester)
          ).map((semester) => (
            <SelectItem key={semester} value={semester}>
              {t(`filter.semesters.${semester}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
