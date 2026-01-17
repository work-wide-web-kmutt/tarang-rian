import {
  AlertTriangle,
  CalendarIcon,
  ClockIcon,
  PencilIcon,
  Trash2Icon,
  User,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { useCourseVaulContext } from "@/components/course/vaul/context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CourseVaulContent() {
  const { session, overlappingSessions, setIsEditing, handleRemove } =
    useCourseVaulContext();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  if (!session) {
    return null;
  }

  const handleConfirmRemove = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    handleRemove();
    setShowRemoveDialog(false);
  };

  return (
    <>
      <div>
        <div className="flex items-start gap-2">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-2xl">{session.courseName}</h2>
            <Badge>{session.courseCode}</Badge>
            <p className="mt-1 flex gap-2 text-muted-foreground">
              Year{" "}
              <Badge className="text-black dark:text-white" variant="outline">
                {session.year}
              </Badge>
              Semester{" "}
              <Badge className="text-black dark:text-white" variant="outline">
                {session.semester}
              </Badge>
            </p>
          </div>
          {session.type === "custom" && (
            <Button
              aria-label="Edit course information"
              onClick={() => setIsEditing(true)}
              size="icon"
              type="button"
              variant="outline"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {session.type === "fixed" && (
        <Alert className="mb-4" variant="destructive">
          <AlertTriangle />
          <AlertTitle>Course Information Disclaimer</AlertTitle>
          <AlertDescription>
            Course information displayed here may not be accurate. Always verify
            details by checking{" "}
            <a
              href="https://www.facebook.com/genKMUTTofficial"
              rel="noopener noreferrer"
              target="_blank"
            >
              the official Facebook page
            </a>{" "}
            and official course documents.
          </AlertDescription>
        </Alert>
      )}

      <table className="table-fixed text-sm">
        <tbody>
          <tr>
            <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>Day</span>
              </div>
            </td>
            <td className="py-1.5">{session.day}</td>
          </tr>
          <tr>
            <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <ClockIcon className="h-3.5 w-3.5" />
                <span>Time</span>
              </div>
            </td>
            <td className="py-1.5">
              {session.start} - {session.end}
            </td>
          </tr>
          <tr>
            <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <UsersIcon className="h-3.5 w-3.5" />
                <span>Group</span>
              </div>
            </td>
            <td className="py-1.5">{session.group}</td>
          </tr>
          <tr>
            <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span>Instructor</span>
              </div>
            </td>
            <td className="py-1.5">
              <div className="flex flex-wrap gap-2">
                {session.instructor.map((instructor) => (
                  <Badge key={instructor} variant="outline">
                    {instructor}
                  </Badge>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {overlappingSessions.length > 0 && (
        <div className="space-y-2">
          <div className="font-medium text-sm">Overlaps:</div>
          <div className="flex flex-wrap gap-2">
            {overlappingSessions.map((overlapSession) => {
              const overlapKey = `${overlapSession.courseCode}-${overlapSession.group}-${overlapSession.day}-${overlapSession.start}-${overlapSession.end}`;
              return (
                <Badge key={overlapKey} variant="outline">
                  {overlapSession.courseCode}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex">
        <Button onClick={() => setShowRemoveDialog(true)} variant="destructive">
          <Trash2Icon />
          Remove from selected
        </Button>
        <AlertDialog onOpenChange={setShowRemoveDialog} open={showRemoveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove class from schedule?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {session.courseCode} -{" "}
                {session.courseName} from your schedule? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmRemove}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
