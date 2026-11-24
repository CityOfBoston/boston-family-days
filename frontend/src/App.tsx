import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { FormProvider } from "./context/FormContext";
import MultiStepForm from "./components/MultiStepForm";
import IntroPage from "./components/IntroPage";
import SuccessPage from "./components/SuccessPage";
import UploadPage from "./components/UploadPage";

const FormShell: React.FC = () => (
  <div className="mx-auto h-auto w-full md:w-5/6 py-20">
    <Outlet />
  </div>
);

const App: React.FC = () => {
  return (
    <FormProvider>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route element={<FormShell />}>
          <Route path="/forms" element={<MultiStepForm />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Route>
      </Routes>
    </FormProvider>
  );
};

export default App;