import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "../../context/FormContext";
import { FormData } from "../../utils/form";
import { FieldRef } from "../fields/Field";
import { Alert, ButtonGroup } from "@trussworks/react-uswds";
import NavButton from "../common/NavButton";

interface StepContainerProps {
  stepKey: keyof FormData;
  stepTitle?: string;
  stepDescription?: string;
  children: React.ReactNode;
  errorMessage?: string
}

const StepContainer: React.FC<StepContainerProps> = ({
  stepKey,
  stepTitle,
  stepDescription,
  children,
  errorMessage
}) => {
  const { state, dispatch } = useFormContext();
  const fieldRefs = useRef<Record<string, React.RefObject<FieldRef>>>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [hasError, setHasError] = useState(false)

  // Register refs for fields
  useEffect(() => {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props.id) {
        if (!fieldRefs.current[child.props.id]) {
          fieldRefs.current[child.props.id] = React.createRef<FieldRef>();
        }
      }
    });
  }, [children]);

  // Check if all required fields are filled
  const checkRequiredFields = () => {
    const stepData = state.formData[stepKey] as Record<string, any>;

    const allRequiredFieldsFilled = React.Children.toArray(children).every((child) => {
      if (React.isValidElement(child) && child.props.required) {
        const fieldId = child.props.id;
        const fieldValue = stepData?.[fieldId]?.toString() || ""; // Convert value to string
        return fieldValue.trim().length > 0;
      }
      return true; // Ignore non-required fields
    });

    setIsButtonDisabled(!allRequiredFieldsFilled);
  };

  useEffect(() => {
    checkRequiredFields(); // Re-run check when formData changes
  }, [state.formData]);

  const handleFieldChange = (id: string, value: any) => {
    // Update field value in form data
    dispatch({
      type: "UPDATE_FIELD",
      stepKey,
      fieldKey: id,
      value,
    });
  };

  const handleNext = () => {
    let isValid = true;

    // Trigger validation for all fields
    Object.entries(fieldRefs.current).forEach(([fieldId, ref]) => {
      if (ref?.current && !ref.current.validateField()) {
        isValid = false;
        console.log(`Validation failed for field: ${fieldId}`);
      }
    });
    setHasError(!isValid)
    if (isValid) {
      dispatch({type: "GO_TO_NEXT_STEP"}); // Proceed to the next step if all fields are valid
    } else {
      console.log("Validation failed for one or more fields.");
    }
  };

  return (
    <div className="flex-col flex gap-y-6">
      <h1 className="uppercase">{stepTitle}</h1>
      {stepDescription && <span className="usa-hint font-sans">{stepDescription}</span>}
      {hasError && errorMessage && <Alert type="error" headingLevel="h4" noIcon>{errorMessage}</Alert>}
      <p>Required fields are marked with an asterisk (<span className="text-required_red">*</span>).</p>
      <div className="space-y-6">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.props.id) {
            return React.cloneElement(child, {
              ref: fieldRefs.current[child.props.id],
              value:
                state.formData[stepKey] &&
                (state.formData[stepKey] as Record<string, any>)[child.props.id] !== undefined
                  ? (state.formData[stepKey] as Record<string, any>)[child.props.id]
                  : "",
              onValueChange: handleFieldChange,
            } as React.Attributes);
          }
          return child;
        })}
      </div>
      <div className="flex w-full mt-7">
        {state.currentStepIndex === 0 ? (
          <div className="w-full flex justify-center">
            <NavButton
              onClick={handleNext}
              disabled={isButtonDisabled}
              className="w-full m-0"
            >
              Continue
            </NavButton>
          </div>
        ) : (
          <ButtonGroup type="default" className="flex w-full justify-start">
            <NavButton
              onClick={() => dispatch({ type: "GO_TO_PREVIOUS_STEP" })}
              className="w-40"
              outline
            >
              Back
            </NavButton>
            <NavButton
              onClick={handleNext}
              disabled={isButtonDisabled}
              className="w-40"
            >
              Continue
            </NavButton>
          </ButtonGroup>
        )}
      </div>
    </div>
  );
};

export default StepContainer;