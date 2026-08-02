import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, InputHTMLAttributes } from "react";

// oxlint-disable react/react-compiler -- this low-level bridge intentionally reads refs and measures DOM synchronously

type InputValue = string[] | string;

function serializeValue(
  value: unknown,
  isCheckInput: boolean,
  checked: boolean | undefined
): string | boolean | undefined {
  if (isCheckInput) {
    return checked;
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }
  if (typeof value === "string") {
    return value;
  }
  return undefined;
}

function dispatchInputEvent(
  input: HTMLInputElement,
  propertyKey: "checked" | "value",
  eventType: "click" | "input",
  serializedValue: string | boolean | undefined,
  bubbles: boolean
): void {
  const inputProto = window.HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(inputProto, propertyKey);
  // oxlint-disable-next-line typescript/unbound-method -- setter invoked with explicit input receiver
  const setter = descriptor?.set;

  if (!setter) {
    return;
  }

  const event = new Event(eventType, { bubbles });
  Reflect.apply(setter, input, [serializedValue]);
  input.dispatchEvent(event);
}

interface VisuallyHiddenInputProps<T = InputValue> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "checked" | "onReset"
> {
  value?: T;
  checked?: boolean;
  control: HTMLElement | null;
  bubbles?: boolean;
}

function VisuallyHiddenInput<T = InputValue>(
  props: VisuallyHiddenInputProps<T>
) {
  const {
    control,
    value,
    checked,
    bubbles = true,
    type = "hidden",
    style,
    ...inputProps
  } = props;

  const isCheckInput = useMemo(
    () => type === "checkbox" || type === "radio" || type === "switch",
    [type]
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const prevValueRef = useRef<{
    value: T | boolean | undefined;
    previous: T | boolean | undefined;
  }>({
    previous: isCheckInput ? checked : value,
    value: isCheckInput ? checked : value,
  });

  const prevValue = useMemo(() => {
    const currentValue = isCheckInput ? checked : value;
    if (prevValueRef.current.value !== currentValue) {
      prevValueRef.current.previous = prevValueRef.current.value;
      prevValueRef.current.value = currentValue;
    }
    return prevValueRef.current.previous;
  }, [isCheckInput, value, checked]);

  const [controlSize, setControlSize] = useState<{
    width?: number;
    height?: number;
  }>({});

  useLayoutEffect(() => {
    if (!control) {
      setControlSize({});
      return;
    }

    setControlSize({
      height: control.offsetHeight,
      width: control.offsetWidth,
    });

    if (typeof window === "undefined") {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0) {
        return;
      }

      const [entry] = entries;

      let width: number;
      let height: number;

      const [borderSize] = entry.borderBoxSize;
      if (borderSize === undefined) {
        width = control.offsetWidth;
        height = control.offsetHeight;
      } else {
        width = borderSize.inlineSize;
        height = borderSize.blockSize;
      }

      setControlSize({ height, width });
    });

    resizeObserver.observe(control, { box: "border-box" });
    // oxlint-disable-next-line typescript/consistent-return -- effect cleanup is returned only after observer setup
    return () => {
      resizeObserver.disconnect();
    };
  }, [control]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    const currentValue = isCheckInput ? checked : value;
    if (prevValue === currentValue) {
      return;
    }

    const propertyKey = isCheckInput ? "checked" : "value";
    const eventType = isCheckInput ? "click" : "input";
    const serializedCurrentValue = serializeValue(value, isCheckInput, checked);

    dispatchInputEvent(
      input,
      propertyKey,
      eventType,
      serializedCurrentValue,
      bubbles
    );
  }, [prevValue, value, checked, bubbles, isCheckInput]);

  const composedStyle = useMemo<CSSProperties>(
    () => ({
      ...style,
      ...(controlSize.width !== undefined && controlSize.height !== undefined
        ? controlSize
        : {}),
      border: 0,
      clipPath: "inset(50%)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      whiteSpace: "nowrap",
      width: "1px",
    }),
    [style, controlSize]
  );

  return (
    <input
      type={type}
      {...inputProps}
      aria-hidden={isCheckInput}
      defaultChecked={isCheckInput ? checked : undefined}
      ref={inputRef}
      style={composedStyle}
      tabIndex={-1}
    />
  );
}

export { VisuallyHiddenInput };

// oxlint-enable react/react-compiler
