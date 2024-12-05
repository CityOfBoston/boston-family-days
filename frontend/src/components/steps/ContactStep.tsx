import {useState} from "react";
import StepContainer from "./StepContainer";
import Field from "../fields/Field";
import { LANGUAGE_OPTIONS } from "../../utils/form";

const ContactStep: React.FC = () => {
  const [email, setEmail] = useState("");

  return (
    <StepContainer stepKey="contactData" stepTitle={"Parent or Guardian Contact?"}>
      <Field id="parentFirstName" type="text" header="Parent or Guardian first name" required />
      <Field id="parentLastName" type="text" header="Parent or Guardian last name" required />
      <Field id="preferredCommunicationLanguage" type="dropdown" header="Preferred communication language" options={LANGUAGE_OPTIONS} required />
      <h1 className="uppercase">Where are we sending the pass?</h1>
      <div>This email will be receiving the pass for the program.</div>
      <Field id="email" 
        type="text" 
        header="Email where the pass should be sent" 
        helperText="For example, kylesmith@gmail.com" 
        validate={(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
        errorMessage="Must be a valid email address"
        onInputChange={(value) => {setEmail(value)}}
        required/>
      <Field id="confirm" 
        type="text" 
        header="Confirm your email" 
        helperText="For example, kylesmith@gmail.com"
        errorMessage="Email addresses must match"
        validate={(value) => value === email}
        required/>
      <Field id="phoneNumber" 
        type="text" 
        header="Phone Number" 
        helperText="10-digit, U.S. only, for example 999-999-9999"
        errorMessage="Must be a valid US based phone number"
        validate={(value) => /^\d{10}$|^\d{3}-?\d{3}-?\d{4}$/.test(value.trim())}/>
    </StepContainer>
  );
};

export default ContactStep;