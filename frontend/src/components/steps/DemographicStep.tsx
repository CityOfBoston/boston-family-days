import React from "react";
import StepContainer from "./StepContainer";
import Field from "../fields/Field";
import { DEMOGRAPHIC_MESSAGE } from "../../utils/form";


const DemographicStep: React.FC = () => {
  return (
    <StepContainer
      stepKey="demographicData"
      stepTitle={"RACE AND ETHNICITY"}
      stepDescription={DEMOGRAPHIC_MESSAGE}
    >
    <h1 className="uppercase">Race</h1>
    <Field
    id="race"
    helperText={`Select all that apply. For example, "Black or African American" and "White"`}
    type="checkbox"
    header="Which of the following race classifications best describe you?"
    options={[
        { label: "American Indian and Alaska Native", value: "american-indian-and-alaska-native" },
        { label: "Asian", value: "asian" },
        { label: "Black or African American", value: "blac-of-afican-american" },
        { label: "Native Hawaiian or other Pacific Islander", value: "native-hawailian-or-other-pacific-islander" },
        { label: "White", value: "white" },
        { label: "Not listed here", value: "not-listed" },
        { label: "I prefer not to say", value: "prefer-not-to-say" }
    ]}
    required
    />
    <h1 className="uppercase pt-6">Ethnicity</h1>
    <Field
    id="ethnicity"
    helperText={`You may report more than one ethnicity. For example, "Hmong and Italian"`}
    type="text"
    header="I identify my ethnicity as:"
    />
    </StepContainer>
  );
};

export default DemographicStep;
