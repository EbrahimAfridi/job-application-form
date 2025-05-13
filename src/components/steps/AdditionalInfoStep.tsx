import React from "react";
import { useFormContext } from "react-hook-form";
import { type ApplicationFormData } from "../../schema";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";

type howDidYouHearType = "jobBoard" | "socialMedia" | "referral" | "other";

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
      <div className="flex flex-col w-full max-w-sm gap-1.5">
        <Label className="label" htmlFor="howDidYouHear">
          How did you hear about this position?
          <span className="label-text-alt text-red-500">*</span>
        </Label>
        <Select
          value={howDidYouHear || ""}
          onValueChange={(value: howDidYouHearType) =>
            setValue("additionalInfo.howDidYouHear", value, {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger
            className={`select select-bordered w-full ${
              errors.additionalInfo?.howDidYouHear ? "border-red-500" : ""
            }`}
            id="howDidYouHear"
            aria-describedby="howDidYouHear-error"
          >
            <SelectValue placeholder="How did you hear about us?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jobBoard">Job Board</SelectItem>
            <SelectItem value="socialMedia">Social Media</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.additionalInfo?.howDidYouHear && (
          <p className="mt-1 text-xs text-red-500">
            {errors.additionalInfo.howDidYouHear.message}
          </p>
        )}
      </div>

      {/* Other Source - Shown only if "Other" is selected */}
      {howDidYouHear === "other" && (
        <div className="flex flex-col w-full max-w-sm gap-1.5">
          <Label className="label" htmlFor="otherSource">
            Please specify
            <span className="label-text-alt text-red-500">*</span>
          </Label>
          <Input
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
      <div className="flex flex-col w-full max-w-sm gap-1.5">
        <Label className="label" htmlFor="availableStartDate">
          When can you start working?
          <span className="label-text-alt text-red-500">*</span>
        </Label>
        <Input
          id="availableStartDate"
          type="date"
          className={`input input-bordered w-fit ${
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
      <div className="flex flex-col w-full max-w-sm gap-1.5">
        <Label className="label cursor-pointer justify-start gap-2">
          <Checkbox
            className="checkbox"
            {...register("additionalInfo.willingToRelocate")}
          />
          Are you willing to relocate if necessary?
        </Label>
        {errors.additionalInfo?.willingToRelocate && (
          <p className="mt-1 text-xs text-red-500">
            {errors.additionalInfo.willingToRelocate.message}
          </p>
        )}
      </div>

      {/* Reason for Applying */}
      <div className="flex flex-col w-full gap-1.5">
        <Label className="label" htmlFor="reasonForApplying">
          Why do you want to work with us?
          <span className="label-text-alt text-red-500">*</span>
        </Label>
        <Textarea
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
      <div className="flex flex-col w-full gap-1.5">
        <Label className="label" htmlFor="additionalComments">
          <span className="label-text font-medium">
            Additional comments (optional)
          </span>
        </Label>
        <Textarea
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
