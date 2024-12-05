import React from "react";
import StepContainer from "./StepContainer";
import Field from "../fields/Field";
import { GRADE_OPTIONS, SCHOOLS_IN_BOSTON } from "../../utils/form";

const StudentStep: React.FC = () => {
  return (
    <StepContainer stepKey="studentData" stepTitle={"Student Information"}>
      <Field id="firstName" type="text" header="First name" required />
      <Field id="middleName" type="text" header="Middle name" />
      <Field id="lastName" type="text" header="Last name" required />
      <Field id="studentID" type="text" header="Student ID" 
      helperText={`Please enter the student’s identification number as provided by the school. For example, for BPS students, this is a six-digit ID.`}/>
      <Field id="dob" 
        type="date" 
        header="Date of Birth"
        validate={(value) => /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(200[0-9]|201[0-9]|202[0-4])$/.test(value.trim())}
        errorMessage="Please enter a valid date of birth"
        required />
      <Field
        id="school"
        type="dropdown"
        header="School name"
        helperText="If your school isn't listed, please select 'Other'"
        required
        options={SCHOOLS_IN_BOSTON}
      />
      <Field
        id="grade"
        type="select"
        header="Grade level"
        required
        options={GRADE_OPTIONS}
      />
    </StepContainer>
  );
};

export default StudentStep;