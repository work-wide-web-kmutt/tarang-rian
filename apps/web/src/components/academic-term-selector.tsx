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
  availableAcademicTerms,
  latestAcademicTerm,
  prefilledAcademicTerms,
  SEMESTERS,
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

export function AcademicTermSelector({ className }: AcademicTermSelectorProps) {
  const { t } = useTranslation();
  const activeTerm = useActiveAcademicTerm();
  const selected = useSelectedGenElectives();
  const { activateTerm } = useAcademicTermActions();

  const availableTerms = useMemo(() => {
    const catalogTerms = allCourses.map((course) => ({
      year: course.year,
      semester: course.semester,
    }));
    const newestCatalogTerm = latestAcademicTerm(catalogTerms);

    return availableAcademicTerms(
      [...catalogTerms, ...prefilledAcademicTerms(newestCatalogTerm.year)],
      selected.map((session) => ({
        year: session.year,
        semester: session.semester,
      })),
      activeTerm
    );
  }, [activeTerm, selected]);

  const years = useMemo(
    () => [...new Set(availableTerms.map((term) => term.year))],
    [availableTerms]
  );

  const semestersForYear = useMemo(
    () =>
      SEMESTERS.filter((semester) =>
        availableTerms.some(
          (term) => term.year === activeTerm.year && term.semester === semester
        )
      ),
    [activeTerm.year, availableTerms]
  );

  const activateTermForYear = (year: string) => {
    const term =
      availableTerms.find(
        (candidate) =>
          candidate.year === year && candidate.semester === activeTerm.semester
      ) ?? availableTerms.find((candidate) => candidate.year === year);
    if (term) {
      activateTerm(term);
    }
  };

  return (
    <div className={cn("flex w-full md:w-64", className)}>
      <Select
        onValueChange={(value) => {
          if (value) {
            activateTermForYear(value);
          }
        }}
        value={activeTerm.year}
      >
        <SelectTrigger
          aria-label={t("academic.year")}
          className="w-full min-w-0 rounded-none border-l-0 md:w-1/2 md:border"
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
        onValueChange={(value) => {
          if (value) {
            activateTerm({
              year: activeTerm.year,
              semester: value as AcademicTerm["semester"],
            });
          }
        }}
        value={activeTerm.semester}
      >
        <SelectTrigger
          aria-label={t("academic.semester")}
          className="w-full min-w-0 rounded-none border-l-0 md:w-1/2 md:border-r-0"
        >
          <SelectValue>
            {t(`filter.semesters.${activeTerm.semester}`)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {semestersForYear.map((semester) => (
            <SelectItem key={semester} value={semester}>
              {t(`filter.semesters.${semester}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
