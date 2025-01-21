import React from "react";
import {
  Fieldset,
  DateInputGroup,
  FormGroup,
  Label,
  Select,
  DateInput,
} from "@trussworks/react-uswds";

interface FieldDateInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  hasError: boolean;
  isErrorSuppressed?: boolean;
  errorMessage?: string;
}

const FieldDateInput: React.FC<FieldDateInputProps> = ({
  id,
  value,
  onChange,
  hasError,
  isErrorSuppressed,
  errorMessage,
}) => {
  // Parse the date into its components
  const [month = "", day = "", year = ""] = value.split("/");

  // Update the value dynamically as the user changes the inputs
  const updateDate = (updatedPart: Partial<{ month: string; day: string; year: string }>) => {
    const newValue = `${updatedPart.month ?? month}/${updatedPart.day ?? day}/${updatedPart.year ?? year}`;
    onChange(newValue);
  };

  return (
    <div className="flex-column m-0">
      {hasError && !isErrorSuppressed && (
        <p className="mt-1 !text-error_red">{errorMessage}</p>
      )}
      <Fieldset>
        <DateInputGroup>
          {/* Month Selector */}
          <FormGroup className="usa-form-group--month usa-form-group--select">
            <Label htmlFor={`${id}-month`}>Month</Label>
            <Select
              id={`${id}-month`}
              name={`${id}-month`}
              value={month}
              onChange={(e) => updateDate({ month: e.target.value })}
            >
              <option value="" disabled>
                - Select -
              </option>
              <option value="01">01 - January</option>
              <option value="02">02 - February</option>
              <option value="03">03 - March</option>
              <option value="04">04 - April</option>
              <option value="05">05 - May</option>
              <option value="06">06 - June</option>
              <option value="07">07 - July</option>
              <option value="08">08 - August</option>
              <option value="09">09 - September</option>
              <option value="10">10 - October</option>
              <option value="11">11 - November</option>
              <option value="12">12 - December</option>
            </Select>
          </FormGroup>
          {/* Day Input */}
          <DateInput
            id={`${id}-day`}
            name={`${id}-day`}
            label="Day"
            unit="day"
            maxLength={2}
            minLength={2}
            value={day}
            onChange={(e) => updateDate({ day: e.target.value })}
          />
          {/* Year Input */}
          <DateInput
            id={`${id}-year`}
            name={`${id}-year`}
            label="Year"
            unit="year"
            maxLength={4}
            minLength={4}
            value={year}
            onChange={(e) => updateDate({ year: e.target.value })}
          />
        </DateInputGroup>
      </Fieldset>
    </div>
  );
};

export default FieldDateInput;