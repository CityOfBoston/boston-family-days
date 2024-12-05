import React, { useState } from "react";
import { useFormContext } from "../context/FormContext";
import NavButton from "./common/NavButton";

const ReviewPage: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const { state, editStep, dispatch } = useFormContext(); // Use dispatch to clear data
  const [showModal, setShowModal] = useState(false);
  const [stepToEdit, setStepToEdit] = useState<number | null>(null);

  const renderStack = (stepKey: string, stepIndex: number) => {
    const stepData = state.formData[stepKey];

    const handleEditClick = () => {
      if (stepIndex === 0) {
        setStepToEdit(stepIndex); // Store the step index
        setShowModal(true); // Show the confirmation modal
      } else {
        editStep(stepIndex); // Directly edit non-stepKey-0 steps
      }
    };

    return (
      <div key={stepKey} className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="uppercase">{stepKey.replace(/([A-Z])/g, " $1")}</h2>
          <NavButton
            onClick={handleEditClick}
            outline
            className="mt-5"
          >
            Edit
          </NavButton>
        </div>
        <ul className="mt-2 space-y-4">
          {Object.entries(stepData || {}).map(([key, value]) => (
            <li key={key} className="">
              <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}: </span>
              <span>{typeof value === "string" || typeof value === "number" ? value : "N/A"}</span>
            </li>
          ))}
        </ul>
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

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h1 className="uppercase">Review Information and Submit</h1>
      {Object.keys(state.formData).map((stepKey, index) =>
        renderStack(stepKey, index)
      )}
      <NavButton
        onClick={onSubmit}
        className="mt-6" // Add spacing above the submit button if necessary
      >
        Submit
      </NavButton>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg">Are you sure?</h2>
            <p className="mt-2">
              Editing your address will require you to complete the enrollment process again.
            </p>
            <p className="mt-2">
              Do you want to continue?
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <NavButton
                onClick={handleModalCancel}
                className="px-4 py-2"
              >
                No
              </NavButton>
              <NavButton
                onClick={handleModalConfirm}
                className="px-4 py-2"
              >
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