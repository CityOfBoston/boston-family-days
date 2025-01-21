import { Radio } from "@trussworks/react-uswds";
import React from "react";

interface RadioButtonGroupProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>; // Updated to Record<string, string>
  hasError: boolean;
  isErrorSuppressed?: boolean;
  errorMessage?: string;
  preferNotToSayText?: string; // Optional Prefer Not to Say text
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  id,
  value,
  onChange,
  options,
  hasError,
  isErrorSuppressed,
  errorMessage,
  preferNotToSayText,
}) => {
  // Convert options to an array and add Prefer Not to Say dynamically
  const renderedOptions = [
    ...Object.entries(options).map(([key, label]) => ({ value: key, label })),
    ...(preferNotToSayText
      ? [{ label: preferNotToSayText, value: "prefer-not-to-say" }]
      : []),
  ];

  return (
    <div className="flex-column m-0">
      {hasError && !isErrorSuppressed && (
        <p className="mt-1 !text-error_red">{errorMessage}</p>
      )}
      <div className="space-y-6 font-sans" id={id}>
        {renderedOptions.map((option) => (
          <Radio
            id={`${id}-${option.value}`}
            key={option.value}
            name={id}
            label={<p className="font-sans">{option.label}</p>}
            value={option.value}
            onChange={() => onChange(option.value)}
            tile
            checked={value === option.value}
          />
        ))}
      </div>
    </div>
  );
};

export default RadioButtonGroup;