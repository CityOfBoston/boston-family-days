import React from "react";
import { useFormContext } from "../context/FormContext";
import AddressStep from "./steps/AddressStep";
import StudentStep from "./steps/StudentStep";
import { useNavigate } from "react-router-dom";
import ReviewPage from "./ReviewPage";
import FormStepIndicator from "./common/FormStepIndicator";
import { STEPS, STEP_NAMES } from "../utils/form";
import ContactStep from "./steps/ContactStep";
import LanguageStep from "./steps/LanguageStep";
import DemographicStep from "./steps/DemographicStep";
import OtherStep from "./steps/OtherStep";

const Form: React.FC = () => {
  const { state } = useFormContext();
  const navigate = useNavigate();

  const renderStep = () => {
    switch (STEPS[state.currentStepIndex]) {
      case "addressStep":
        return <AddressStep />;
      case "studentStep":
        return <StudentStep />;
      case "contactStep":
        return <ContactStep />;
      case "languageStep":
        return <LanguageStep />;
      case "demographicStep":
        return <DemographicStep />;
      case "otherStep":
        return <OtherStep />;
      case "reviewPage":
        return <ReviewPage onSubmit={() => navigate("/success")} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-11 py-14 bg-white">
      {state.currentStepIndex !== 0 && (
        <FormStepIndicator
          steps={STEP_NAMES}
          currentStepIndex={state.currentStepIndex}
        />
      )}
      {renderStep()}
    </div>
  );
};

export default Form;