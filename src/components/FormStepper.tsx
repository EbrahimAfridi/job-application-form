import React from "react";
import { useFormContext } from "react-hook-form";
import { useFormContext as useCustomFormContext } from "../context/FormContext";
import { type ApplicationFormData } from "../schema";

interface Step {
  id: string;
  label: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
}

const FormStepper: React.FC<FormStepperProps> = ({ steps, currentStep }) => {
  const { goToStep } = useCustomFormContext();
  const { trigger, getValues, formState } =
    useFormContext<ApplicationFormData>();

  // Step status determination
  const getStepStatus = (index: number) => {
    // Return "completed" if form was submitted and all fields are valid
    if (formState.isSubmitSuccessful) return "completed";

    if (index < currentStep) {
      // Previous steps - should be completed
      const stepId = steps[index].id as keyof ApplicationFormData;
      const stepData = getValues(stepId);

      // Check if the step has been filled out
      if (stepData && Object.keys(stepData).length > 0) {
        return "completed";
      }
      return "incomplete";
    } else if (index === currentStep) {
      // Current step
      return "current";
    } else {
      // Future steps
      return "upcoming";
    }
  };

  // Handle step click - attempt to navigate to that step
  const handleStepClick = async (index: number) => {
    // Don't allow clicking on future steps
    if (index > currentStep) return;

    // If clicking on previous steps, validate current step first
    if (index < currentStep) {
      const currentStepId = steps[currentStep].id as keyof ApplicationFormData;
      const isCurrentStepValid = await trigger(currentStepId);

      if (!isCurrentStepValid) {
        // Current step is invalid, show a message or handle as needed
        return;
      }
    }

    // Navigate to the clicked step
    goToStep(index);
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const status = getStepStatus(index);

          return (
            <React.Fragment key={step.id}>
              {/* Step button with circle */}
              <button
                type="button"
                onClick={() => handleStepClick(index)}
                disabled={index > currentStep}
                className={`flex flex-col items-center relative ${
                  index > currentStep ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                aria-current={status === "current" ? "step" : undefined}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    status === "completed"
                      ? "bg-green-600 text-white"
                      : status === "current"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {status === "completed" ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step label */}
                <div className="mt-2 text-xs font-medium text-center max-w-xs">
                  <span
                    className={`${
                      status === "current"
                        ? "text-blue-600"
                        : status === "completed"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </button>

              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-px mx-2 bg-gray-300 sm:mx-4" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FormStepper;
