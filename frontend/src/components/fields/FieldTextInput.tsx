import React from "react";
import { TextInput } from "@trussworks/react-uswds";

interface TextInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  hasError: boolean;
  isErrorSuppressed?: boolean;
  errorMessage?: string;
}

const FieldTextInput: React.FC<TextInputProps> = ({
  id,
  value,
  onChange,
  hasError,
  isErrorSuppressed,
  errorMessage,
}) => {
  return (
    <div className="flex-column m-0">
      {hasError && !isErrorSuppressed && (
        <p className="mt-1 text-error_red">{errorMessage}</p>
      )}
      <TextInput
        id={id}
        name={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-full"
        {...(hasError && !isErrorSuppressed ? { validationStatus: "error" } : {})}
      />
    </div>
  );
};

export default FieldTextInput;
