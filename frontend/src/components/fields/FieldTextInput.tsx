import React, { useState, useEffect } from "react";
import { Checkbox, TextInput } from "@trussworks/react-uswds";

interface TextInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  hasError: boolean;
  isErrorSuppressed?: boolean;
  errorMessage?: string;
  preferNotToSayText?: string;
}

const FieldTextInput: React.FC<TextInputProps> = ({
  id,
  value,
  onChange,
  hasError,
  isErrorSuppressed,
  errorMessage,
  preferNotToSayText,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(value === "prefer-not-to-say");

  useEffect(() => {
    // Sync checkbox state on external value change
    setIsChecked(value === "prefer-not-to-say");
  }, [value]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);

    if (checked) {
      // Set value to "prefer-not-to-say" when checked
      onChange("prefer-not-to-say");
    } else {
      // Clear value when unchecked
      onChange("");
    }
  };

  return (
    <div className="flex-column m-0">
      {hasError && !isErrorSuppressed && (
        <p className="mt-1 !text-error_red">{errorMessage}</p>
      )}
      <TextInput
        id={id}
        name={id}
        type="text"
        value={isChecked ? "" : value} // Controlled input
        onChange={(e) => onChange(e.target.value)}
        className="max-w-full font-sans"
        disabled={isChecked} // Disable input when checkbox is checked
        {...(hasError && !isErrorSuppressed ? { validationStatus: "error" } : {})}
      />
      {preferNotToSayText && <Checkbox
        className="font-sans mt-6"
        id={`${id}-prefer-not-to-say`}
        name={`${id}-prefer-not-to-say`}
        label={preferNotToSayText}
        checked={isChecked}
        onChange={handleCheckboxChange}
      />}
    </div>
  );
};

export default FieldTextInput;