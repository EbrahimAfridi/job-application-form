import React, { useState, useEffect } from "react";
import {
  FormContextProvider as CustomFormProvider,
  formSteps,
  useFormContext,
} from "../context/FormContext";

// Import step components properly
import {
  PersonalInfoStep,
  ProfessionalInfoStep,
  DocumentsStep,
  AdditionalInfoStep,
  ReviewStep,
} from "./steps/index";

import FormStepper from "./FormStepper";
import DraftBanner from "./DraftBanner";
import { Button } from "./ui/button";
import { Save } from "lucide-react";

const JobApplicationForm: React.FC = () => {
  const {
    currentStep,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    saveDraft,
    isDraftAvailable,
    loadDraft,
    clearDraft,
  } = useFormContext();

  // Show draft banner if a saved draft exists
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  useEffect(() => {
    // Check if there's a saved draft on component mount
    if (isDraftAvailable) {
      setShowDraftBanner(true);
    }
  }, [isDraftAvailable]);

  // Handle draft loading
  const handleLoadDraft = () => {
    loadDraft();
    setShowDraftBanner(false);
  };

  // Handle draft dismissal
  const handleDismissDraft = () => {
    setShowDraftBanner(false);
  };

  // Handle draft clearing
  const handleClearDraft = () => {
    clearDraft();
    setShowDraftBanner(false);
  };

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft();
    }, 30000);

    return () => clearInterval(interval);
  }, [saveDraft]);

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep />;
      case 1:
        return <ProfessionalInfoStep />;
      case 2:
        return <DocumentsStep />;
      case 3:
        return <AdditionalInfoStep />;
      case 4:
        return <ReviewStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      {showDraftBanner && (
        <DraftBanner
          onLoad={handleLoadDraft}
          onDismiss={handleDismissDraft}
          onClear={handleClearDraft}
        />
      )}

      <h1 className="text-3xl font-bold text-center mb-8">Job Application</h1>

      <FormStepper steps={formSteps} currentStep={currentStep} />

      <div className="mt-8">{renderStep()}</div>

      <div className={`mt-8 flex justify-${isFirstStep ? `end` : `between`}`}>
        {!isFirstStep && (
          <Button
            type="button"
            onClick={prevStep}
            className="bg-gray-300 rounded text-gray-800 hover:bg-gray-400 transition-colors"
          >
            Previous
          </Button>
        )}

        {!isLastStep ? (
          <div className="flex items-center gap-4">
            <Button
              variant={"ghost"}
              type="button"
              onClick={saveDraft}
              className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
            >
              <Save />
              Save Draft
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ml-auto"
            >
              Next
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            form="job-application-form"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ml-auto"
          >
            Submit Application
          </Button>
        )}
      </div>
    </div>
  );
};

// Wrapper component to provide context
const JobApplicationFormWithContext: React.FC = () => {
  return (
    <CustomFormProvider>
      <JobApplicationForm />
    </CustomFormProvider>
  );
};

export default JobApplicationFormWithContext;
