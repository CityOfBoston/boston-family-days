import React from "react";
import StepContainer from "./StepContainer";
import Field from "../fields/Field";
import { DEMOGRAPHIC_MESSAGE } from "../../utils/form";


const OtherStep: React.FC = () => {
  return (
    <StepContainer
      stepKey="otherData"
      stepTitle={"Additional Questions"}
      stepDescription={DEMOGRAPHIC_MESSAGE}
    >
      <Field
        id="programs"
        helperText="Select all that apply."
        type="checkbox"
        header="Is the student currently enrolled in or receiving assistance from any of the following state-administered programs?"
        options={[
            { label: "Supplemental Nutrition Assistance Program (SNAP)", value: "snap" },
            { label: "Transitional Assistance for Families with Dependent Children (TAFDC)", value: "tafdc" },
            { label: "Department of Children and Families (DCF) foster care program", value: "dcf" },
            { label: "MassHealth (Medicaid)", value: "medicaid" },
            { label: "None of the above", value: "none-above" },
            { label: "I prefer not to say", value: "prefer-not-to-say" }
        ]}
        required
      />
      <Field
        id="iep"
        helperText="Select all that apply."
        type="radio"
        header="Does the student currently have an Individualized Education Program (IEP)?"
        options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
            { label: "Unsure", value: "unsure" },
            { label: "Prefer not to say", value: "prefer-not-to-say" }
        ]}
        required
      />
    </StepContainer>
  );
};

export default OtherStep;
