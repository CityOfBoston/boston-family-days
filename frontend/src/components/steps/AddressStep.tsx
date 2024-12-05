import React from "react";
import StepContainer from "./StepContainer";
import Field from "../fields/Field";
import { NEIGHBORHOODS_IN_BOSTON, BOSTON_ZIP_CODES } from "../../utils/form"

const AddressStep: React.FC = () => {
  return (
    <StepContainer
      stepKey="addressData"
      stepTitle={"What's Your Address?"}
      stepDescription={
        "This program is only for children and families who live in the City of Boston. Please enter your home address where you and your family live."
      }
      errorMessage="Sorry, the Boston Family Pass isn't available at your location"
    >
      <Field
        id="street1"
        helperText="For example, 13 W Sixth Street, 24 Cooper St"
        type="text"
        header="Street Address 1"
        required
      />
      <Field id="street2"
        helperText="Apt. # or unit #" type="text" header="Street Address line 2" />
      <Field id="city" type="dropdown" options={NEIGHBORHOODS_IN_BOSTON} header="Neighborhood" required />
      <Field
        id="zip"
        type="text"
        header="Zip Code"
        required
        validate={(value) => /^[0-9]{5}$/.test(value) && BOSTON_ZIP_CODES.includes(value)}
        isErrorSuppressed={true}
        errorMessage="Zip Code must be a 5-digit number"
      />
    </StepContainer>
  );
};

export default AddressStep;
