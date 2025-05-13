import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useFormContext as useCustomFormContext } from "../../context/FormContext";
import { type ApplicationFormData } from "../../schema";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PersonalInfoStep: React.FC = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ApplicationFormData>();
  const { checkUsernameAvailability } = useCustomFormContext();

  // State for async username validation
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );

  // Get the current username value
  const username = watch("personalInfo.username");

  // Handle username availability check
  const handleUsernameCheck = async () => {
    if (username && username.length >= 3) {
      setIsCheckingUsername(true);
      try {
        const isAvailable = await checkUsernameAvailability(username);
        setUsernameAvailable(isAvailable);
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameAvailable(null);
      } finally {
        setIsCheckingUsername(false);
      }
    }
  };

  // Handle date of birth change
  const handleDateOfBirthChange = (date: Date | null) => {
    setValue("personalInfo.dateOfBirth", date || new Date(), {
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-6" id="job-application-form">
      <h2 className="text-xl font-semibold">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="form-control">
          <label className="label" htmlFor="firstName">
            <span className="label-text font-medium">First Name</span>
            <span className="label-text-alt text-red-500">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            className={`input input-bordered w-full ${
              errors.personalInfo?.firstName ? "border-red-500" : ""
            }`}
            placeholder="John"
            {...register("personalInfo.firstName")}
            aria-invalid={errors.personalInfo?.firstName ? "true" : "false"}
            aria-describedby="firstName-error"
          />
          {errors.personalInfo?.firstName && (
            <p id="firstName-error" className="mt-1 text-xs text-red-500">
              {errors.personalInfo.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="form-control">
          <label className="label" htmlFor="lastName">
            <span className="label-text font-medium">Last Name</span>
            <span className="label-text-alt text-red-500">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            className={`input input-bordered w-full ${
              errors.personalInfo?.lastName ? "border-red-500" : ""
            }`}
            placeholder="Doe"
            {...register("personalInfo.lastName")}
            aria-invalid={errors.personalInfo?.lastName ? "true" : "false"}
            aria-describedby="lastName-error"
          />
          {errors.personalInfo?.lastName && (
            <p id="lastName-error" className="mt-1 text-xs text-red-500">
              {errors.personalInfo.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="form-control">
        <label className="label" htmlFor="email">
          <span className="label-text font-medium">Email</span>
          <span className="label-text-alt text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          className={`input input-bordered w-full ${
            errors.personalInfo?.email ? "border-red-500" : ""
          }`}
          placeholder="john.doe@example.com"
          {...register("personalInfo.email")}
          aria-invalid={errors.personalInfo?.email ? "true" : "false"}
          aria-describedby="email-error"
        />
        {errors.personalInfo?.email && (
          <p id="email-error" className="mt-1 text-xs text-red-500">
            {errors.personalInfo.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="form-control">
        <label className="label" htmlFor="phone">
          <span className="label-text font-medium">Phone Number</span>
          <span className="label-text-alt text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          className={`input input-bordered w-full ${
            errors.personalInfo?.phone ? "border-red-500" : ""
          }`}
          placeholder="+1 123 456 7890"
          {...register("personalInfo.phone")}
          aria-invalid={errors.personalInfo?.phone ? "true" : "false"}
          aria-describedby="phone-error"
        />
        {errors.personalInfo?.phone && (
          <p id="phone-error" className="mt-1 text-xs text-red-500">
            {errors.personalInfo.phone.message}
          </p>
        )}
        {/* <p className="mt-1 text-xs text-gray-500">
          Please include country code
        </p> */}
      </div>

      {/* Username with availability check */}
      <div className="form-control">
        <label className="label" htmlFor="username">
          <span className="label-text font-medium">Username</span>
          <span className="label-text-alt text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <input
              id="username"
              type="text"
              className={`input input-bordered w-full ${
                errors.personalInfo?.username ? "border-red-500" : ""
              }`}
              placeholder="johndoe123"
              {...register("personalInfo.username")}
              onChange={(e) => {
                register("personalInfo.username").onChange(e);
                setUsernameAvailable(null); // Reset availability status on change
              }}
              aria-invalid={errors.personalInfo?.username ? "true" : "false"}
              aria-describedby="username-error"
            />

            {usernameAvailable !== null && !errors.personalInfo?.username && (
              <div
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${
                  usernameAvailable ? "text-green-500" : "text-red-500"
                }`}
              >
                {usernameAvailable ? "✓ Available" : "✗ Taken"}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleUsernameCheck}
            disabled={
              isCheckingUsername ||
              !username ||
              username.length < 3 ||
              !!errors.personalInfo?.username
            }
            className="btn btn-outline"
          >
            {isCheckingUsername ? "Checking..." : "Check Availability"}
          </button>
        </div>

        {errors.personalInfo?.username && (
          <p id="username-error" className="mt-1 text-xs text-red-500">
            {errors.personalInfo.username.message}
          </p>
        )}

        {/* <p className="mt-1 text-xs text-gray-500">
          Username must be at least 3 characters and can only contain letters,
          numbers, and underscores
        </p> */}
      </div>

      {/* Date of Birth with DatePicker */}
      <div className="form-control">
        <label className="label" htmlFor="dateOfBirth">
          <span className="label-text font-medium">Date of Birth</span>
          <span className="label-text-alt text-red-500">*</span>
        </label>
        <DatePicker
          id="dateOfBirth"
          selected={watch("personalInfo.dateOfBirth")}
          onChange={handleDateOfBirthChange}
          className={`input input-bordered w-full ${
            errors.personalInfo?.dateOfBirth ? "border-red-500" : ""
          }`}
          placeholderText="Select your date of birth"
          maxDate={new Date()}
          showYearDropdown
          dropdownMode="select"
          dateFormat="MMMM d, yyyy"
        />
        {errors.personalInfo?.dateOfBirth && (
          <p id="dateOfBirth-error" className="mt-1 text-xs text-red-500">
            {errors.personalInfo.dateOfBirth.message}
          </p>
        )}
      </div>

      {/* Address Section */}
      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-medium mb-4">Address Information</h3>

        {/* Street */}
        <div className="form-control">
          <label className="label" htmlFor="street">
            <span className="label-text font-medium">Street Address</span>
            <span className="label-text-alt text-red-500">*</span>
          </label>
          <input
            id="street"
            type="text"
            className={`input input-bordered w-full ${
              errors.personalInfo?.address?.street ? "border-red-500" : ""
            }`}
            placeholder="123 Main St"
            {...register("personalInfo.address.street")}
          />
          {errors.personalInfo?.address?.street && (
            <p className="mt-1 text-xs text-red-500">
              {errors.personalInfo.address.street.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* City */}
          <div className="form-control">
            <label className="label" htmlFor="city">
              <span className="label-text font-medium">City</span>
              <span className="label-text-alt text-red-500">*</span>
            </label>
            <input
              id="city"
              type="text"
              className={`input input-bordered w-full ${
                errors.personalInfo?.address?.city ? "border-red-500" : ""
              }`}
              placeholder="Anytown"
              {...register("personalInfo.address.city")}
            />
            {errors.personalInfo?.address?.city && (
              <p className="mt-1 text-xs text-red-500">
                {errors.personalInfo.address.city.message}
              </p>
            )}
          </div>

          {/* State */}
          <div className="form-control">
            <label className="label" htmlFor="state">
              <span className="label-text font-medium">State/Province</span>
              <span className="label-text-alt text-red-500">*</span>
            </label>
            <input
              id="state"
              type="text"
              className={`input input-bordered w-full ${
                errors.personalInfo?.address?.state ? "border-red-500" : ""
              }`}
              placeholder="CA"
              {...register("personalInfo.address.state")}
            />
            {errors.personalInfo?.address?.state && (
              <p className="mt-1 text-xs text-red-500">
                {errors.personalInfo.address.state.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Zip */}
          <div className="form-control">
            <label className="label" htmlFor="zip">
              <span className="label-text font-medium">ZIP/Postal Code</span>
              <span className="label-text-alt text-red-500">*</span>
            </label>
            <input
              id="zip"
              type="text"
              className={`input input-bordered w-full ${
                errors.personalInfo?.address?.zip ? "border-red-500" : ""
              }`}
              placeholder="12345"
              {...register("personalInfo.address.zip")}
            />
            {errors.personalInfo?.address?.zip && (
              <p className="mt-1 text-xs text-red-500">
                {errors.personalInfo.address.zip.message}
              </p>
            )}
          </div>

          {/* Country */}
          <div className="form-control">
            <label className="label" htmlFor="country">
              <span className="label-text font-medium">Country</span>
              <span className="label-text-alt text-red-500">*</span>
            </label>
            <select
              id="country"
              className={`select select-bordered w-full ${
                errors.personalInfo?.address?.country ? "border-red-500" : ""
              }`}
              {...register("personalInfo.address.country")}
            >
              <option value="">Select a country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="IN">India</option>
              {/* Add more countries as needed */}
            </select>
            {errors.personalInfo?.address?.country && (
              <p className="mt-1 text-xs text-red-500">
                {errors.personalInfo.address.country.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
