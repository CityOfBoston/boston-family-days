import React, { createContext, useReducer, useContext } from "react";
import { STEPS } from "../utils/form";
import { saveFormData } from "../utils/firebaseConfig"

// Form state interface
interface FormState {
  formData: Record<string, any>;
  currentStepIndex: number;
  successData: Record<string, any> | null;
  error: string | null;
}

// Actions for the reducer
type Action =
  | { type: "UPDATE_FIELD"; stepKey: string; fieldKey: string; value: any }
  | { type: "GO_TO_NEXT_STEP" }
  | { type: "GO_TO_PREVIOUS_STEP" }
  | { type: "GO_TO_STEP"; targetStepIndex: number }
  | { type: "SET_SUCCESS_DATA"; data: Record<string, any> }
  | { type: "SET_ERROR"; error: string }
  | { type: "RESET_FORM" };

// Initial state
const initialState: FormState = {
  formData: {},
  currentStepIndex: 0,
  successData: null,
  error: null,
};

// Create context
const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<Action>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  editStep: (index: number) => void;
  submitForm: () => Promise<void>;
}>({
  state: initialState,
  dispatch: () => {},
  goToNextStep: () => {},
  goToPreviousStep: () => {},
  editStep: () => {},
  submitForm: async () => {},
});

// Reducer function
const formReducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.stepKey]: {
            ...state.formData[action.stepKey],
            [action.fieldKey]: action.value,
          },
        },
      };
    case "GO_TO_NEXT_STEP":
      return {
        ...state,
        currentStepIndex: Math.min(
          state.currentStepIndex + 1,
          STEPS.length - 1
        ),
      };
    case "GO_TO_PREVIOUS_STEP":
      return {
        ...state,
        currentStepIndex: Math.max(state.currentStepIndex - 1, 0),
      };
    case "GO_TO_STEP":
      return {
        ...state,
        currentStepIndex: Math.min(
          Math.max(action.targetStepIndex, 0),
          STEPS.length - 1
        ),
      };
    case "SET_SUCCESS_DATA":
      return {
        ...state,
        successData: action.data,
        error: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
        successData: null,
      };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
};

// Provider component
export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const goToNextStep = () => {
    dispatch({ type: "GO_TO_NEXT_STEP" });
  };

  const goToPreviousStep = () => {
    dispatch({ type: "GO_TO_PREVIOUS_STEP" });
  };

  const editStep = (targetStepIndex: number) => {
    dispatch({ type: "GO_TO_STEP", targetStepIndex });
  };

  const submitForm = async () => {
    try {
      const response = await saveFormData(state.formData);
      dispatch({ type: "SET_SUCCESS_DATA", data: response.data as Record<string, any> });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", error: error.message || "Submission failed" });
    }
  };

  return (
    <FormContext.Provider
      value={{
        state,
        dispatch,
        goToNextStep,
        goToPreviousStep,
        editStep,
        submitForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the context
export const useFormContext = () => useContext(FormContext);