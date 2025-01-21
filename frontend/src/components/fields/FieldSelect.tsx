import React from "react";
import { Select } from "@trussworks/react-uswds";

interface FieldSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>; // Updated type
  hasError: boolean;
  isErrorSuppressed?: boolean;
  errorMessage?: string;
}

const FieldSelect: React.FC<FieldSelectProps> = ({
  id,
  value,
  onChange,
  options,
  hasError,
  isErrorSuppressed,
  errorMessage,
}) => {
  return (
    <div className="flex-column m-0">
      {hasError && !isErrorSuppressed && (
        <p className="mt-1 !text-error_red">{errorMessage}</p>
      )}
      <Select
        id={id}
        name={id}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-full"
        value={value}
      >
        <option value="" disabled hidden>
          - Select -
        </option>
        {Object.entries(options).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default FieldSelect;