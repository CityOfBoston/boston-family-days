import React from "react";
import { Routes, Route } from "react-router-dom";
import { FormProvider } from "./context/FormContext";
import MultiStepForm from "./components/MultiStepForm";
import IntroPage from "./components/IntroPage";
import SuccessPage from "./components/SuccessPage"

const App: React.FC = () => {
  return (
    <FormProvider>
        <div className="mx-auto h-auto w-full md:w-5/6 py-20">
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