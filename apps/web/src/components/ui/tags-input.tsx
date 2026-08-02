import {
  TagsInputClear as TagsInputClearPrimitive,
  TagsInputInput as TagsInputInputPrimitive,
  TagsInputItemDelete,
  TagsInputItem as TagsInputItemPrimitive,
  TagsInputItemText,
  TagsInputLabel as TagsInputLabelPrimitive,
  TagsInputRoot,
} from "@diceui/tags-input";
import { X } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

function TagsInput({
  className,
  ...props
}: React.ComponentProps<typeof TagsInputRoot>) {
  return (
    <TagsInputRoot
      className={cn("flex w-full flex-col gap-2", className)}
      data-slot="tags-input"
      {...props}
    />
  );
}

function TagsInputLabel({
  className,
  ...props
}: React.ComponentProps<typeof TagsInputLabelPrimitive>) {
  return (
    <TagsInputLabelPrimitive
      className={cn(
        "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      data-slot="tags-input-label"
      {...props}
    />
  );
}

function TagsInputList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-none border border-input bg-background px-3 py-2 text-xs focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      data-slot="tags-input-list"
      {...props}
    />
  );
}

function TagsInputInput({
  className,
  ...props
}: React.ComponentProps<typeof TagsInputInputPrimitive>) {
  return (
    <TagsInputInputPrimitive
      className={cn(
        "flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      data-slot="tags-input-input"
      {...props}
    />
  );
}

function TagsInputItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TagsInputItemPrimitive>) {
  return (
    <TagsInputItemPrimitive
      className={cn(
        "inline-flex max-w-[calc(100%-8px)] items-center gap-1.5 rounded border bg-transparent px-2.5 py-1 text-sm focus:outline-hidden data-disabled:cursor-not-allowed data-editable:select-none data-editing:bg-transparent data-disabled:opacity-50 data-editing:ring-1 data-editing:ring-ring [&:not([data-editing])]:pr-1.5 [&[data-highlighted]:not([data-editing])]:bg-accent [&[data-highlighted]:not([data-editing])]:text-accent-foreground",
        className
      )}
      data-slot="tags-input-item"
      {...props}
    >
      <TagsInputItemText className="truncate">{children}</TagsInputItemText>
      <TagsInputItemDelete className="size-4 shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
        <X className="size-3.5" />
      </TagsInputItemDelete>
    </TagsInputItemPrimitive>
  );
}

function TagsInputClear({
  ...props
}: React.ComponentProps<typeof TagsInputClearPrimitive>) {
  return <TagsInputClearPrimitive data-slot="tags-input-clear" {...props} />;
}

export {
  TagsInput,
  TagsInputLabel,
  TagsInputList,
  TagsInputInput,
  TagsInputItem,
  TagsInputClear,
};
