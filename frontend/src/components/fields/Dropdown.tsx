import React from "react";
import { ComboBox } from "@trussworks/react-uswds";

interface DropdownProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: any }[];
  hasError: boolean;
  isErrorSuppressed?: boolean;
  errorMessage?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
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
        <p className="mt-1 text-error_red">{errorMessage}</p>
      )}
        <ComboBox
          id={id}
          name={id}
          options={options}
          onChange={(value) => onChange(value as string)}
          defaultValue={value || ""}
          className="max-w-full"
        />
      {hasError && !isErrorSuppressed && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default Dropdown;