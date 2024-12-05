import { Radio } from "@trussworks/react-uswds";
import React from "react";

interface RadioButtonGroupProps {
  id: string;
  value: any;
  onChange: (value: any) => void;
  options: { label: string; value: any }[];
  hasError: boolean;
  isErrorSuppressed?: boolean;
  errorMessage?: string;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  id,
  value,
  onChange,
  options,
  hasError,
  isErrorSuppressed,
  errorMessage,
}) => {
  return (
    <div>
      <div className="space-y-6" id={id}>
        {options.map((option) => (
          <Radio
            id={`${id}-${option.value}`}
            key={option.value}
            name={id}
            label={option.label}
            value={option.value}
            onChange={() => onChange(option.value)}
            tile
            checked={value === option.value}
          />
        ))}
      </div>
      {hasError && !isErrorSuppressed && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default RadioButtonGroup;