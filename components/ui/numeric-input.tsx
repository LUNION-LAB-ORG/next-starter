import React from "react";
import { Input } from "@/components/ui/input";

function NumericInput({
  className,
  onChange,
  value,
  ...props
}: React.ComponentProps<"input">) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
      .replace(/\s/g, "")
      .replace(/,/g, "")
      .replace(/\./g, "");

    if (!/^\d*$/.test(raw)) return;

    const newEvent = {
      ...e,
      target: { ...e.target, value: raw },
    } as React.ChangeEvent<HTMLInputElement>;

    if (onChange) {
      onChange(newEvent);
    }
  };

  const displayValue =
    value && value !== ""
      ? new Intl.NumberFormat("fr-FR").format(Number(value))
      : "";

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      className={className}
      {...props}
    />
  );
}

export default NumericInput;
