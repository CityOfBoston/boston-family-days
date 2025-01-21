import React, { useEffect, useState } from "react";
import { useFormContext } from "../context/FormContext";
import NavButton from "./common/NavButton";
import { DISPLAY_MAP } from "../utils/form";

const ReviewPage: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const { state, editStep, dispatch } = useFormContext();
  const [showModal, setShowModal] = useState(false);
  const [stepToEdit, setStepToEdit] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  const formatValue = (stepKey: string, fieldKey: string, value: any) => {
    const fieldConfig =
      (DISPLAY_MAP as Record<string, any>)[stepKey]?.fields?.[fieldKey];

    const getHardcodedLabel = (option: string) => {
      if (option === "prefer-not-to-say") return "Prefer not to say";
      if (option === "none-of-the-above") return "None of the above";
      return null;
    };

    if (Array.isArray(value)) {
      return value
        .map((v) => getHardcodedLabel(v) || fieldConfig?.options?.[v] || v)
        .join(", ");
    }

    if (value && (typeof value === "string" || typeof value === "number")) {
      return getHardcodedLabel(value.toString()) || fieldConfig?.options?.[value] || value;
    }

    return "N/A";
  };

  const renderStack = (stepKey: string, stepIndex: number) => {
    const stepData = state.formData[stepKey];
    const stepConfig = DISPLAY_MAP[stepKey];

    const handleEditClick = () => {
      if (stepIndex === 0) {
        setStepToEdit(stepIndex);
        setShowModal(true);
      } else {
        editStep(stepIndex);
      }
    };

    return (
      <div key={stepKey} className="mb-6">
        <div className="flex justify-between items-center pt-6 gap-7 border-t-2 !border-gray-300">
          <h2 className="uppercase">{stepConfig?.stepHeader || stepKey}</h2>
          {/* Fixed-size Edit Button */}
          <NavButton
            onClick={handleEditClick}
            outline
            className="w-24 text-center"
          >
            Edit
          </NavButton>
        </div>
        <div className="space-y-4 py-4">
          {Object.entries(stepData || {}).map(([fieldKey, value]) => (
            <div key={fieldKey} className="flex flex-col">
              <p className="font-bold">{stepConfig?.fields?.[fieldKey]?.fieldHeader || fieldKey}</p>
              <p className="text-normal">{formatValue(stepKey, fieldKey, value)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleModalConfirm = () => {
    if (stepToEdit === 0) {
      dispatch({ type: "RESET_FORM" });
    }
    editStep(stepToEdit as number);
    setShowModal(false);
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="uppercase mb-6">Review Information and Submit</h1>
      {Object.keys(state.formData).map((stepKey, index) =>
        renderStack(stepKey, index)
      )}
      <div className="mt-6">
        <NavButton
          onClick={handleSubmit}
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-gray-700">Submitting...</span>
            </div>
          ) : (
            "Submit"
          )}
        </NavButton>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg">Address change</h2>
            <p className="mt-6">
              <span className="font-bold">Please note: </span>Editing your address will reset your progress. 
              You will need to complete the enrollment process again.
            </p>
            <p className="mt-6">Do you want to continue?</p>
            <div className="mt-6 flex w-full gap-4">
              <NavButton
                onClick={handleModalCancel}
                outline
                className="w-1/2"
              >
                No
              </NavButton>
              <NavButton onClick={handleModalConfirm} className="w-1/2">
                Yes
              </NavButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;