import React from "react";
import { StepIndicator, StepIndicatorStep } from "@trussworks/react-uswds";

interface FormStepIndicatorProps {
  steps: string[];
  currentStepIndex: number;
}

const FormStepIndicator: React.FC<FormStepIndicatorProps> = ({
  steps,
  currentStepIndex,
}) => {
  return (
    <div>
      <StepIndicator
        listProps={{
          className:
            "usa-step-indicator__segments [&_li]:min-w-0 [&_span]:!leading-5 [&_span]:!text-base [&_span]:!font-normal [&_span]:font-sans [&_span]:pr-0",
        }}
        className="max-w-full"
        headingLevel="h4"
        headingProps={{ className: "hidden" }}
      >
        {steps.map((step, index) => {
          if (index == 0) {return <></>}
          let status: "complete" | "current" | undefined;
          if (index < currentStepIndex) {
            status = "complete";
          } else if (index === currentStepIndex) {
            status = "current";
          }

          return <StepIndicatorStep key={index} label={step} status={status} />;
        })}
      </StepIndicator>
      <div className="border-t border-gray-300 py-7">
        <p className="italic font-normal text-optimistic_blue">
          Step {currentStepIndex} of {steps.length - 1}
        </p>
      </div>
    </div>
  );
};

export default FormStepIndicator;
