import React from "react";
import StepContainer from "./StepContainer";
import Field from "../fields/Field";
import { DEMOGRAPHIC_MESSAGE, LANGUAGE_OPTIONS } from "../../utils/form";

const LanguageStep: React.FC = () => {
  return (
    <StepContainer stepKey="languageData" stepTitle={"Parent Guardian or Adult Point of Contact?"} stepDescription={DEMOGRAPHIC_MESSAGE}>
      <Field id="firstLanguage" type="dropdown" header="First language" options={LANGUAGE_OPTIONS} required />
    <Field id="familyLanguage" type="dropdown" header="Family preferred communication language" options={LANGUAGE_OPTIONS} required />
    <Field id="englishLearner" type="radio" header="Has your child been identified by their school as an English Learner (EL)?" options={[
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "Unsure", value: "unsure" },
        { label: "Prefer not to say", value: "prefer-not-to-say" }
    ]} required/>
    </StepContainer>
  );
};

export default LanguageStep;