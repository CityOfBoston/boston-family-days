import React from "react";
import StepContainer from "./StepContainer";
import Field from "../fields/Field";
import { GRADE_OPTIONS, SCHOOLS_IN_BOSTON } from "../../utils/form";

const StudentStep: React.FC = () => {
  const isValidDate = (dateString: string): boolean => {
      // Match MM/DD/YYYY or M/D/YY formats
      const datePattern = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})$/;
      const match = dateString.match(datePattern);

      if (!match) return false;

      let [_, month, day, year] = match.map(Number);

      // Convert two-digit year to four-digit year
      if (year < 100) {
        year += year >= 70 ? 1900 : 2000; // If >= 70, assume 20th century; otherwise, 21st century
      }

      // Adjust JavaScript months (0-based index)
      month -= 1;

      // Create a Date object and validate
      const date = new Date(year, month, day);
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day
      ) {
        return false; // Invalid date (e.g., Feb 31st)
      }

      // Dynamic range validation
      const currentDate = new Date();
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);
      const lowerBound = new Date("2000-01-01");

      return date >= lowerBound && date <= threeYearsAgo;
    };

  return (
    <StepContainer stepKey="studentData" stepTitle={"Student Information"}>
      <Field id="firstName" type="text" header="First name" required />
      <Field id="middleName" type="text" header="Middle name" />
      <Field id="lastName" type="text" header="Last name" required />
      <Field id="studentId" type="text" header="Student ID" 
      helperText={`Please enter the student’s identification number as provided by the school. For example, for BPS students, this is a six-digit ID.`}/>
      <Field id="dob" 
        type="date" 
        header="Date of Birth"
        helperText="For example, 03-March 09 2017"
        validate={(value) => isValidDate(value.trim())}
        errorMessage="Please enter a valid date of birth. Note: Students must be at least 3 years old."
        required />
      <Field
        id="school"
        type="dropdown"
        header="School name"
        helperText="If your school isn't listed, please select 'Other'."
        otherText="Other (Not Listed)"
        otherSpecifyText="Please specify the name of the school."
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