import React, { useState, useEffect } from "react";
import { Checkbox, TextInput } from "@trussworks/react-uswds";

interface CheckboxGroupProps {
  id: string;
  value: string[]; // Expected to be an array of strings
  onChange: (value: string[]) => void;
  options: Record<string, string>;
  hasError: boolean;
  isErrorSuppressed?: boolean;
  errorMessage?: string;
  otherText?: string;
  otherSpecifyText?: string;
  noneOfTheAboveText?: string;
  preferNotToSayText?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  id,
  value = [], // Default to an empty array
  onChange,
  options,
  hasError,
  isErrorSuppressed,
  errorMessage,
  otherText,
  otherSpecifyText,
  noneOfTheAboveText,
  preferNotToSayText,
}) => {
  const [otherInput, setOtherInput] = useState("");

  const safeValue = Array.isArray(value) ? value : []; // Type guard

  // Prefill the "Other" input if a matching value exists
  useEffect(() => {
    const otherValue = safeValue.find((v) => v.startsWith("Other"));
    if (otherValue) {
      setOtherInput(otherValue.split(": ")[1] || ""); // Extract user input after "other: "
    }
  }, [safeValue]);

  const handleCheckboxChange = (optionValue: string) => {
    if (optionValue === "prefer-not-to-say" || optionValue === "none-of-the-above") {
      onChange([optionValue]); // Clear all other selections
    } else if (optionValue === "Other") {
      const updatedValues = safeValue.includes("prefer-not-to-say") || safeValue.includes("none-of-the-above")
        ? ["Other"]
        : safeValue.includes("Other")
        ? safeValue.filter((v) => !v.startsWith("Other")) // Remove "other"
        : [...safeValue, "Other"];
      onChange(updatedValues);
    } else {
      const updatedValues =
        safeValue.includes("prefer-not-to-say") || safeValue.includes("none-of-the-above")
          ? [optionValue]
          : safeValue.includes(optionValue)
          ? safeValue.filter((v) => v !== optionValue)
          : [...safeValue, optionValue];
      onChange(updatedValues);
    }
  };

  const handleOtherInputChange = (input: string) => {
    setOtherInput(input);
    const updatedValues = safeValue.filter((v) => !v.startsWith("Other"));
    onChange([...updatedValues, `Other: ${input}`]); // Update value array
  };

  const renderedOptions = [
    ...Object.entries(options).map(([key, label]) => ({ label, value: key })),
    ...(otherText ? [{ label: otherText, value: "Other" }] : []),
    ...(noneOfTheAboveText ? [{ label: noneOfTheAboveText, value: "none-of-the-above" }] : []),
    ...(preferNotToSayText ? [{ label: preferNotToSayText, value: "prefer-not-to-say" }] : []),
  ];

  return (
    <div className="flex flex-col m-0 space-y-4">
      {hasError && !isErrorSuppressed && (
        <p className="mt-1 text-error_red">{errorMessage}</p>
      )}
      {renderedOptions.map((option) => (
        <div key={option.value}>
          <Checkbox
            id={`${id}-${option.value}`}
            name={id}
            label={option.label}
            tile
            checked={safeValue.some((v) => v === option.value || v.startsWith(option.value))}
            onChange={() => handleCheckboxChange(option.value)}
          />
          {option.value === "Other" && safeValue.some((v) => v.startsWith("Other")) && (
          <div className="my-4 flex-col">
            <label htmlFor={`${id}-other-input`} className="font-sans font-bold">
              {otherSpecifyText}
            </label>
              <TextInput
                id={`${id}-other-input`}
                name={`${id}-other-input`}
                type="text"
                value={otherInput}
                onChange={(e) => handleOtherInputChange(e.target.value)}
                className="max-w-full"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckboxGroup;