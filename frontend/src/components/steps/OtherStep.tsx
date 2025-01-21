import React from "react";
import StepContainer from "./StepContainer";
import Field from "../fields/Field";
import { DEMOGRAPHIC_MESSAGE, IEP_OPTIONS, PROGRAM_OPTIONS } from "../../utils/form";


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
        options={PROGRAM_OPTIONS}
        noneOfTheAboveText="None of the above"
        preferNotToSayText="I prefer not to say"
        required
      />
      <Field
        id="iep"
        type="radio"
        header="Does the student currently have an Individualized Education Program (IEP)?"
        options={IEP_OPTIONS}
        preferNotToSayText="Prefer not to say"
        required
      />
    </StepContainer>
  );
};

export default OtherStep;
