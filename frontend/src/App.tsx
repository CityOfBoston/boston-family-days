import React from "react";
import { Routes, Route } from "react-router-dom";
import { FormProvider } from "./context/FormContext";
import MultiStepForm from "./components/MultiStepForm";
import IntroPage from "./components/IntroPage";
import SuccessPage from "./components/SuccessPage"

const App: React.FC = () => {
  return (
    <FormProvider>
        <div className="h-auto">
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/forms" element={<MultiStepForm />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </div>
    </FormProvider>
  );
};

export default App;