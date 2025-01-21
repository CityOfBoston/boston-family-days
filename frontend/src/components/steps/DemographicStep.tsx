import React from "react";
import StepContainer from "./StepContainer";
import Field from "../fields/Field";
import { DEMOGRAPHIC_MESSAGE, RACE_OPTIONS, ETHNICTY_OPTIONS } from "../../utils/form";


const DemographicStep: React.FC = () => {
  return (
    <StepContainer
      stepKey="demographicData"
      stepTitle={"RACE AND ETHNICITY"}
      stepDescription={DEMOGRAPHIC_MESSAGE}
    >
    <p className="font-bold uppercase !text-lg !font-heading">Race</p>
    <Field
    id="race"
    helperText={`Select all that apply. For example, "Black or African American" and "White"`}
    type="checkbox"
    header="Which of the following race classifications best describe you?"
    options={RACE_OPTIONS}
    noneOfTheAboveText="Not listed here"
    preferNotToSayText="Prefer not to answer"
    required
    />
    <h1 className="font-bold uppercase !text-lg pt-6 !font-heading">Ethnicity</h1>
    <Field
    id="ethnicity"
    helperText={`Select all that apply. For example, "Colombian" and "Haitian"`}
    options={ETHNICTY_OPTIONS}
    type="checkbox"
    header="What is your ethnicity?"
    otherText="Not listed here"
    otherSpecifyText="Please enter your ethnicity."
    preferNotToSayText="Prefer not to answer"
    required
    />
    </StepContainer>
  );
};

export default DemographicStep;
