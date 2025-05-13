import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useFormContext as useCustomFormContext } from "../../context/FormContext";
import { type ApplicationFormData } from "../../schema";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="firstName" className="gap-0.5">
            First Name <span className="label-text-alt text-red-500">*</span>
          </Label>
          <Input
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
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="label gap-0.5" htmlFor="lastName">
            Last Name
            <span className="label-text-alt text-red-500">*</span>
          </Label>
          <Input
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
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label className="gap-0.5 label" htmlFor="email">
          Email
          <span className="label-text-alt text-red-500">*</span>
        </Label>
        <Input
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
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label className="gap-0.5 label" htmlFor="phone">
          Phone
          <span className="label-text-alt text-red-500">*</span>
        </Label>
        <Input
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
        <p className="mt-1 text-xs text-gray-500">
          Please include country code
        </p>
      </div>

      {/* Username with availability check */}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label className="gap-0.5 label" htmlFor="username">
          Username
          <span className="label-text-alt text-red-500">*</span>
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Input
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

          <Button
            variant={"secondary"}
            type="button"
            onClick={handleUsernameCheck}
            disabled={
              isCheckingUsername ||
              !username ||
              username.length < 3 ||
              !!errors.personalInfo?.username
            }
          >
            {isCheckingUsername ? "Checking..." : "Check Availability"}
          </Button>
        </div>

        {errors.personalInfo?.username && (
          <p id="username-error" className="mt-1 text-xs text-red-500">
            {errors.personalInfo.username.message}
          </p>
        )}

        <p className="mt-1 text-xs text-gray-500">
          Username must be at least 3 characters and can only contain letters,
          numbers, and underscores
        </p>
      </div>

      {/* Date of Birth with DatePicker */}
      <div className="grid items-center gap-1.5">
        <Label className="gap-0.5 label" htmlFor="dateOfBirth">
          Birthdate
          <span className="label-text-alt text-red-500">*</span>
        </Label>
        <div className="relative">
          <DatePicker
            id="dateOfBirth"
            selected={watch("personalInfo.dateOfBirth")}
            onChange={handleDateOfBirthChange}
            className={`w-[200px] pl-8 h-[36px] cursor-pointer bg-white border border-gray-300 text-xs font-medium 
               text-gray-950 rounded-md ${
                 errors.personalInfo?.dateOfBirth ? "border-red-500" : ""
               }`}
            placeholderText="Select your date of birth"
            maxDate={new Date()}
            showYearDropdown
            dropdownMode="select"
            dateFormat="MMMM d, yyyy"
            calendarClassName="!z-50"
          />
          {/* Calendar icon */}
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <CalendarDays size={18} />
          </span>
        </div>
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
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="gap-0.5 label" htmlFor="street">
            Street
            <span className="label-text-alt text-red-500">*</span>
          </Label>
          <Input
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
          <div className="flex flex-col w-full max-w-sm gap-1.5">
            <Label className="gap-0.5 label" htmlFor="city">
              City
              <span className="label-text-alt text-red-500">*</span>
            </Label>
            <Input
              id="city"
              type="text"
              className={`input input-bordered w-full ${
          errors.personalInfo?.address?.city ? "border-red-500" : ""
              }`}
              placeholder="Anytown"
              {...register("personalInfo.address.city")}
            />
            <div style={{ minHeight: "20px" }}>
              {errors.personalInfo?.address?.city && (
          <p className="mt-1 text-xs text-red-500">
            {errors.personalInfo.address.city.message}
          </p>
              )}
            </div>
          </div>

          {/* State/Province */}
          <div className="flex flex-col w-full max-w-sm gap-1.5">
            <Label className="gap-0.5 label" htmlFor="state">
              State / Province
              <span className="label-text-alt text-red-500">*</span>
            </Label>
            <Input
              id="state"
              type="text"
              className={`input input-bordered w-full ${
          errors.personalInfo?.address?.state ? "border-red-500" : ""
              }`}
              placeholder="CA"
              {...register("personalInfo.address.state")}
            />
            <div style={{ minHeight: "20px" }}>
              {errors.personalInfo?.address?.state && (
          <p className="mt-1 text-xs text-red-500">
            {errors.personalInfo.address.state.message}
          </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Zip */}
          <div className="flex flex-col w-full max-w-sm gap-1.5">
            <Label className="gap-0.5 label" htmlFor="zip">
              Pin Code
              <span className="label-text-alt text-red-500">*</span>
            </Label>
            <Input
              id="zip"
              type="text"
              className={`input input-bordered w-full ${
                errors.personalInfo?.address?.zip ? "border-red-500" : ""
              }`}
              placeholder="12345"
              {...register("personalInfo.address.zip")}
            />
            <div style={{ minHeight: "20px" }}>
              {errors.personalInfo?.address?.zip && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.personalInfo.address.zip.message}
                </p>
              )}
            </div>
          </div>

          {/* Country */}
          <div className="flex flex-col w-full max-w-sm gap-1.5">
            <Label htmlFor="country" className="gap-0.5">
              Country
              <span className="label-text-alt text-red-500">*</span>
            </Label>
            <Select
              value={watch("personalInfo.address.country") || ""}
              onValueChange={(value) =>
                setValue("personalInfo.address.country", value, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                id="country"
                className={`w-full ${
                  errors.personalInfo?.address?.country ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.personalInfo?.address?.country ? "true" : "false"
                }
                aria-describedby="country-error"
              >
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
            <div style={{ minHeight: "20px" }}>
              {errors.personalInfo?.address?.country && (
                <p id="country-error" className="mt-1 text-xs text-red-500">
                  {errors.personalInfo.address.country.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
