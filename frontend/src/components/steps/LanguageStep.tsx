import React from "react";
import StepContainer from "./StepContainer";
import Field from "../fields/Field";
import { DEMOGRAPHIC_MESSAGE, LANGUAGE_OPTIONS, ENGLISH_LEARNER_OPTIONS } from "../../utils/form";

const LanguageStep: React.FC = () => {
  return (
    <StepContainer stepKey="languageData" stepTitle={"Language"} stepDescription={DEMOGRAPHIC_MESSAGE}>
    <Field id="languageSpokenAtHome" type="dropdown" header="Language spoken at home" options={LANGUAGE_OPTIONS} required />
    <Field id="englishLearner" type="radio" 
    header="Has your child been identified by their school as an English Learner (EL)?" 
    options={ENGLISH_LEARNER_OPTIONS}
    preferNotToSayText="Prefer not to say" required/>
    </StepContainer>
  );
};

export default LanguageStep;