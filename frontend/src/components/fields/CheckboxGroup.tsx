import React from "react";
import { Checkbox } from "@trussworks/react-uswds";

interface DropdownProps {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: { label: string; value: any }[];
  hasError: boolean;
  isErrorSuppressed?: boolean;
  errorMessage?: string;
}

const CheckboxGroup: React.FC<DropdownProps> = ({
  id,
  value,
  onChange,
  options,
  hasError,
  isErrorSuppressed,
  errorMessage,
}) => {
  const handleCheckboxChange = (optionValue: any) => {
    if (value.includes(optionValue)) {
      // If the value is already selected, remove it
      onChange(value.filter((v) => v !== optionValue));
    } else {
      // Otherwise, add it
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="flex flex-col m-0 space-y-4">
      {hasError && !isErrorSuppressed && (
        <p className="mt-1 text-error_red">{errorMessage}</p>
      )}
      {options.map((option) => (
        <Checkbox
          key={option.value}
          id={`${id}-${option.value}`} // Ensure unique ID for each checkbox
          name={id}
          label={option.label}
          tile
          checked={value.includes(option.value)} // Check if the option is selected
          onChange={() => handleCheckboxChange(option.value)} // Update value on selection
        />
      ))}
      {hasError && !isErrorSuppressed && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default CheckboxGroup;