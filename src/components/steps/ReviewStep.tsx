import React from "react";
import { useFormContext } from "react-hook-form";
import { useFormContext as useCustomFormContext } from "../../context/FormContext";
import { type ApplicationFormData } from "../../schema";

const ReviewStep: React.FC = () => {
  const {
    watch,
    handleSubmit,
    formState: { errors },
  } = useFormContext<ApplicationFormData>();
  const { clearDraft } = useCustomFormContext();

  // Get all form data
  const formData = watch();

  // Format date
  const formatDate = (date: Date | undefined | null) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  // Handle form submission
  const onSubmit = (data: ApplicationFormData) => {
    // In a real application, you would send the data to your server here
    console.log("Form submitted:", data);

    // Show success message
    alert("Application submitted successfully!");

    // Clear the draft data
    clearDraft();

    // In a real app, you would redirect to a success page
    // window.location.href = '/application-submitted';
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Review Your Application</h2>

      <p className="text-gray-600">
        Please review your information before submitting. You can go back to
        edit any section if needed.
      </p>

      <form id="job-application-form" onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Information */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4 border-b pb-2">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="mt-1">
                {formData.personalInfo?.firstName}{" "}
                {formData.personalInfo?.lastName}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1">{formData.personalInfo?.email}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="mt-1">{formData.personalInfo?.phone}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Username</p>
              <p className="mt-1">{formData.personalInfo?.username}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="mt-1">
                {formatDate(formData.personalInfo?.dateOfBirth)}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="mt-1">
                {formData.personalInfo?.address.street},{" "}
                {formData.personalInfo?.address.city},{" "}
                {formData.personalInfo?.address.state}{" "}
                {formData.personalInfo?.address.zip},{" "}
                {formData.personalInfo?.address.country}
              </p>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4 border-b pb-2">
            Professional Background
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Years of Experience
              </p>
              <p className="mt-1">
                {formData.professionalInfo?.yearsOfExperience} years
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Salary Expectation
              </p>
              <p className="mt-1">
                $
                {formData.professionalInfo?.salaryExpectation?.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Skills</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {formData.professionalInfo?.skills.map(
                  (skill: any, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Work Experience
              </p>
              <div className="mt-2 space-y-3">
                {formData.professionalInfo?.experiences.map(
                  (experience: any, index: number) => (
                    <div
                      key={index}
                      className="border-l-2 border-gray-200 pl-3 py-1"
                    >
                      <p className="font-medium">
                        {experience.position} at {experience.company}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(experience.startDate)} -{" "}
                        {experience.current
                          ? "Present"
                          : formatDate(experience.endDate)}
                      </p>
                      <p className="text-sm mt-1">{experience.description}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Document Information */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4 border-b pb-2">
            Uploaded Documents
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Resume</p>
              <p className="mt-1">{formData.documents?.resume?.name}</p>
            </div>

            {formData.documents?.profilePicture && (
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Profile Picture
                </p>
                <p className="mt-1">{formData.documents.profilePicture.name}</p>
              </div>
            )}

            {formData.documents?.coverLetter && (
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Cover Letter
                </p>
                <p className="mt-1">{formData.documents.coverLetter.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4 border-b pb-2">
            Additional Information
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                How did you hear about us?
              </p>
              <p className="mt-1">
                {formData.additionalInfo?.howDidYouHear === "jobBoard"
                  ? "Job Board"
                  : formData.additionalInfo?.howDidYouHear === "socialMedia"
                  ? "Social Media"
                  : formData.additionalInfo?.howDidYouHear === "referral"
                  ? "Referral"
                  : "Other"}
              </p>
              {formData.additionalInfo?.howDidYouHear === "other" &&
                formData.additionalInfo?.otherSource && (
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.additionalInfo.otherSource}
                  </p>
                )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Available Start Date
              </p>
              <p className="mt-1">
                {formatDate(formData.additionalInfo?.availableStartDate)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Willing to Relocate
              </p>
              <p className="mt-1">
                {formData.additionalInfo?.willingToRelocate ? "Yes" : "No"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Reason for Applying
              </p>
              <p className="mt-1">
                {formData.additionalInfo?.reasonForApplying}
              </p>
            </div>

            {formData.additionalInfo?.additionalComments && (
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Additional Comments
                </p>
                <p className="mt-1">
                  {formData.additionalInfo.additionalComments}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Terms and Agreements */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4 border-b pb-2">
            Terms and Conditions
          </h3>

          <div className="space-y-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                className={`h-4 w-4 mt-1 text-blue-600 rounded border-gray-300 focus:ring-blue-500 ${
                  errors.termsAndReview?.agreeToTerms ? "border-red-500" : ""
                }`}
                {...(useFormContext().register(
                  "termsAndReview.agreeToTerms"
                ) as any)}
              />
              <label
                htmlFor="agreeToTerms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  terms and conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  privacy policy
                </a>
                .
              </label>
            </div>
            {errors.termsAndReview?.agreeToTerms && (
              <p className="text-xs text-red-500">
                {errors.termsAndReview.agreeToTerms.message}
              </p>
            )}

            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToBackgroundCheck"
                className={`h-4 w-4 mt-1 text-blue-600 rounded border-gray-300 focus:ring-blue-500 ${
                  errors.termsAndReview?.agreeToBackgroundCheck
                    ? "border-red-500"
                    : ""
                }`}
                {...(useFormContext().register(
                  "termsAndReview.agreeToBackgroundCheck"
                ) as any)}
              />
              <label
                htmlFor="agreeToBackgroundCheck"
                className="ml-2 block text-sm text-gray-700"
              >
                I consent to a background check if required for the position.
              </label>
            </div>
            {errors.termsAndReview?.agreeToBackgroundCheck && (
              <p className="text-xs text-red-500">
                {errors.termsAndReview.agreeToBackgroundCheck.message}
              </p>
            )}

            <div className="flex items-start">
              <input
                type="checkbox"
                id="confirmInformationAccurate"
                className={`h-4 w-4 mt-1 text-blue-600 rounded border-gray-300 focus:ring-blue-500 ${
                  errors.termsAndReview?.confirmInformationAccurate
                    ? "border-red-500"
                    : ""
                }`}
                {...(useFormContext().register(
                  "termsAndReview.confirmInformationAccurate"
                ) as any)}
              />
              <label
                htmlFor="confirmInformationAccurate"
                className="ml-2 block text-sm text-gray-700"
              >
                I confirm that all information provided is accurate and complete
                to the best of my knowledge.
              </label>
            </div>
            {errors.termsAndReview?.confirmInformationAccurate && (
              <p className="text-xs text-red-500">
                {errors.termsAndReview.confirmInformationAccurate.message}
              </p>
            )}
          </div>
        </div>

        {/* Warning about saving drafts */}
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Once you submit this application, you will no longer be able to
                access or edit your draft.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReviewStep;
