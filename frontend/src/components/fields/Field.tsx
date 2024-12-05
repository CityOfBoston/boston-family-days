import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import FieldTextInput from "./FieldTextInput";
import FieldSelect from "./FieldSelect";
import RadioButtonGroup from "./RadioButtonGroup";
import CheckboxGroup from "./CheckboxGroup";
import FieldDateInput from "./FieldDateInput";
import Dropdown from "./Dropdown";

export interface FieldProps {
  id: string;
  type: "text" | "select" | "dropdown" | "radio" | "checkbox" | "date";
  header: string;
  helperText?: string;
  required?: boolean;
  validate?: (value: any) => boolean;
  isErrorSuppressed?: boolean
  errorMessage?: string;
  options?: { label: string; value: any }[]; // For inputs, selects, radio buttons, and checkboxes
  value?: any;
  onValueChange?: (id: string, value: any) => void;
  onInputChange?: (value: string) => void;
}

export interface FieldRef {
  validateField: () => boolean;
  getValue: () => any;
}

const Field = forwardRef<FieldRef, FieldProps>(
  (
    {
      id,
      type,
      header,
      helperText,
      required = false,
      validate,
      isErrorSuppressed,
      errorMessage,
      options,
      value,
      onValueChange,
      onInputChange
    },
    ref
  ) => {
    const [fieldValue, setFieldValue] = useState<any>(value || "");
    const [hasError, setHasError] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      validateField: () => {
        if (validate && !validate(fieldValue)) {
          setHasError(true);
          return false;
        }
        setHasError(false);
        return true;
      },
      getValue: () => fieldValue,
    }));

    useEffect(() => {
      setFieldValue(value || ""); // Sync local state with pre-filled value
    }, [value]);

    const handleChange = (newValue: any) => {
      setFieldValue(newValue);
      setHasError(false);
      if (onValueChange) {
        onValueChange(id, newValue);
      }
      if (onInputChange) {
        onInputChange(newValue);
      }
    };

    let InputComponent;
    switch (type) {
      case "text":
        InputComponent = (
          <FieldTextInput
            id={id}
            value={fieldValue}
            onChange={handleChange}
            isErrorSuppressed={isErrorSuppressed}
            hasError={hasError}
            errorMessage={errorMessage}
          />
        );
        break;
      case "select":
        InputComponent = (
          <FieldSelect
            id={id}
            value={fieldValue}
            onChange={handleChange}
            options={options || []}
            hasError={hasError}
            isErrorSuppressed={isErrorSuppressed}
            errorMessage={errorMessage}
          />
        );
        break;
      case "radio":
        InputComponent = (
          <RadioButtonGroup
            id={id}
            value={fieldValue}
            onChange={handleChange}
            options={options || []}
            hasError={hasError}
            isErrorSuppressed={isErrorSuppressed}
            errorMessage={errorMessage}
          />
        );
        break;
      case "checkbox":
        InputComponent = (
          <CheckboxGroup
            id={id}
            value={fieldValue || []}
            onChange={handleChange}
            options={options || []}
            hasError={hasError}
            isErrorSuppressed={isErrorSuppressed}
            errorMessage={errorMessage}
          />
        );
        break;
      case "date":
        InputComponent = (
          <FieldDateInput
            id={id}
            value={fieldValue}
            onChange={handleChange}
            isErrorSuppressed={isErrorSuppressed}
            hasError={hasError}
            errorMessage={errorMessage}
          />
        )
        break;
      case "dropdown":
        InputComponent = (
          <Dropdown
            id={id}
            value={fieldValue}
            onChange={handleChange}
            options={options || []}
            isErrorSuppressed={isErrorSuppressed}
            hasError={hasError}
            errorMessage={errorMessage}
          />
        )
        break;
      default:
        throw new Error(`Unsupported input type: ${type}`);
    }

    return (
      <div className={`mb-6 ${hasError && !isErrorSuppressed ? "pl-4 border-l-4 border-error_red" : ""}`}>
        <label className="font-bold" htmlFor={id}>
          {header} {required ? <span className="text-required_red">*</span> : <span>(optional)</span>}
        </label>
        {helperText && <h5 className="text-text_grey">{helperText}</h5>}
        {InputComponent}
      </div>
    );
  }
);

export default Field;
