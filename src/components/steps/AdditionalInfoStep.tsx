import React from "react";
import { useFormContext } from "react-hook-form";
import { type ApplicationFormData } from "../../schema";

const AdditionalInfoStep: React.FC = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ApplicationFormData>();

  // Get how they heard about us
  const howDidYouHear = watch("additionalInfo.howDidYouHear");

  // Handle date of start date change
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setValue("additionalInfo.availableStartDate", new Date(e.target.value), {
        shouldValidate: true,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Additional Information</h2>

      <p className="text-gray-600">
        Please provide some additional information to help us get to know you
        better.
      </p>

      {/* How Did You Hear About Us */}
      <div className="form-control">
        <label className="label" htmlFor="howDidYouHear">
          <span className="label-text font-medium">
            How did you hear about this position?
          </span>
          <span className="label-text-alt text-red-500">*</span>
        </label>
        <select
          id="howDidYouHear"
          className={`select select-bordered w-full ${
            errors.additionalInfo?.howDidYouHear ? "border-red-500" : ""
          }`}
          {...register("additionalInfo.howDidYouHear")}
        >
          <option value="jobBoard">Job Board</option>
          <option value="socialMedia">Social Media</option>
          <option value="referral">Referral</option>
          <option value="other">Other</option>
        </select>
        {errors.additionalInfo?.howDidYouHear && (
          <p className="mt-1 text-xs text-red-500">
            {errors.additionalInfo.howDidYouHear.message}
          </p>
        )}
      </div>

      {/* Other Source - Shown only if "Other" is selected */}
      {howDidYouHear === "other" && (
        <div className="form-control">
          <label className="label" htmlFor="otherSource">
            <span className="label-text font-medium">Please specify</span>
            <span className="label-text-alt text-red-500">*</span>
          </label>
          <input
            id="otherSource"
            type="text"
            className={`input input-bordered w-full ${
              errors.additionalInfo?.otherSource ? "border-red-500" : ""
            }`}
            placeholder="Please specify how you heard about us"
            {...register("additionalInfo.otherSource")}
          />
          {errors.additionalInfo?.otherSource && (
            <p className="mt-1 text-xs text-red-500">
              {errors.additionalInfo.otherSource.message}
            </p>
          )}
        </div>
      )}

      {/* Available Start Date */}
      <div className="form-control">
        <label className="label" htmlFor="availableStartDate">
          <span className="label-text font-medium">
            When can you start working?
          </span>
          <span className="label-text-alt text-red-500">*</span>
        </label>
        <input
          id="availableStartDate"
          type="date"
          className={`input input-bordered w-full ${
            errors.additionalInfo?.availableStartDate ? "border-red-500" : ""
          }`}
          value={
            watch("additionalInfo.availableStartDate")
              ? new Date(watch("additionalInfo.availableStartDate"))
                  .toISOString()
                  .substr(0, 10)
              : ""
          }
          onChange={handleStartDateChange}
        />
        {errors.additionalInfo?.availableStartDate && (
          <p className="mt-1 text-xs text-red-500">
            {errors.additionalInfo.availableStartDate.message}
          </p>
        )}
      </div>

      {/* Willing to Relocate */}
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-2">
          <input
            type="checkbox"
            className="checkbox"
            {...register("additionalInfo.willingToRelocate")}
          />
          <span className="label-text font-medium">
            Are you willing to relocate if necessary?
          </span>
        </label>
        {errors.additionalInfo?.willingToRelocate && (
          <p className="mt-1 text-xs text-red-500">
            {errors.additionalInfo.willingToRelocate.message}
          </p>
        )}
      </div>

      {/* Reason for Applying */}
      <div className="form-control">
        <label className="label" htmlFor="reasonForApplying">
          <span className="label-text font-medium">
            Why do you want to work with us?
          </span>
          <span className="label-text-alt text-red-500">*</span>
        </label>
        <textarea
          id="reasonForApplying"
          className={`textarea textarea-bordered w-full h-32 ${
            errors.additionalInfo?.reasonForApplying ? "border-red-500" : ""
          }`}
          placeholder="Tell us why you're interested in this position and what you can bring to our team..."
          {...register("additionalInfo.reasonForApplying")}
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-500">
            Min 50 characters, max 500 characters
          </p>
          <p className="text-xs text-gray-500">
            {watch("additionalInfo.reasonForApplying")?.length || 0}/500
          </p>
        </div>
        {errors.additionalInfo?.reasonForApplying && (
          <p className="mt-1 text-xs text-red-500">
            {errors.additionalInfo.reasonForApplying.message}
          </p>
        )}
      </div>

      {/* Additional Comments */}
      <div className="form-control">
        <label className="label" htmlFor="additionalComments">
          <span className="label-text font-medium">
            Additional comments (optional)
          </span>
        </label>
        <textarea
          id="additionalComments"
          className="textarea textarea-bordered w-full h-24"
          placeholder="Is there anything else you'd like us to know?"
          {...register("additionalInfo.additionalComments")}
        />
      </div>
    </div>
  );
};

export default AdditionalInfoStep;
