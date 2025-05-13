import React, { createContext, useState, useContext, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  applicationFormSchema,
  type ApplicationFormData,
  defaultValues,
} from "../schema";

// Form steps
export const formSteps = [
  { id: "personalInfo", label: "Personal Information" },
  { id: "professionalInfo", label: "Professional Background" },
  { id: "documents", label: "Upload Documents" },
  { id: "additionalInfo", label: "Additional Questions" },
  { id: "termsAndReview", label: "Review & Submit" },
];

// LocalStorage key
const STORAGE_KEY = "job_application_draft";

// Context type definition
type FormContextType = {
  currentStep: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  totalSteps: number;
  saveDraft: () => void;
  loadDraft: () => void;
  clearDraft: () => void;
  isDraftAvailable: boolean;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
};

// Form Context
const FormContext = createContext<FormContextType | null>(null);

// Provider component
export const FormContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDraftAvailable, setIsDraftAvailable] = useState(false);

  // Initializing the form with react-hook-form
  const methods = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues,
    mode: "onChange", // Validate on change for immediate feedback
  });

  // Check if draft exists on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    setIsDraftAvailable(!!savedData);
  }, []);

  // Navigate to a specific step
  const goToStep = (step: number) => {
    const targetStep = Math.max(0, Math.min(step, formSteps.length - 1));
    setCurrentStep(targetStep);
  };

  // Move to next step
  const nextStep = () => {
    if (currentStep < formSteps.length - 1) {
      // Get the current step's form part
      const currentStepId = formSteps[currentStep]
        .id as keyof ApplicationFormData;

      // Validate only the current step's fields
      methods.trigger(currentStepId).then((isValid) => {
        if (isValid) {
          setCurrentStep((prev) => prev + 1);
          // Save draft automatically when moving to next step
          saveDraft();
        }
      });
    }
  };

  // Move to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Save form data to localStorage
  const saveDraft = () => {
    try {
      const formData = methods.getValues();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      setIsDraftAvailable(true);
      return true;
    } catch (error) {
      console.error("Error saving draft:", error);
      return false;
    }
  };

  // Load form data from localStorage
  const loadDraft = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);

        // Handle Date objects which are serialized as strings
        if (parsedData.personalInfo?.dateOfBirth) {
          parsedData.personalInfo.dateOfBirth = new Date(
            parsedData.personalInfo.dateOfBirth
          );
        }

        if (parsedData.additionalInfo?.availableStartDate) {
          parsedData.additionalInfo.availableStartDate = new Date(
            parsedData.additionalInfo.availableStartDate
          );
        }

        if (parsedData.professionalInfo?.experiences) {
          parsedData.professionalInfo.experiences =
            parsedData.professionalInfo.experiences.map((exp: any) => ({
              ...exp,
              startDate: exp.startDate ? new Date(exp.startDate) : undefined,
              endDate: exp.endDate ? new Date(exp.endDate) : undefined,
            }));
        }

        methods.reset(parsedData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error loading draft:", error);
      return false;
    }
  };

  // Clear draft from localStorage
  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsDraftAvailable(false);
  };

  // Mock function for username availability check
  const checkUsernameAvailability = async (
    username: string
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo purposes, let's say usernames containing "taken" are not available
    return !username.toLowerCase().includes("taken");
  };

  // Context value
  const value = {
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === formSteps.length - 1,
    totalSteps: formSteps.length,
    saveDraft,
    loadDraft,
    clearDraft,
    isDraftAvailable,
    checkUsernameAvailability,
  };

  return (
    <FormContext.Provider value={value}>
      <FormProvider {...methods}>{children}</FormProvider>
    </FormContext.Provider>
  );
};

// Custom hook to use the form context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
