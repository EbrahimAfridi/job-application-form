import React from "react";
import { useFormContext } from "react-hook-form";
import { type ApplicationFormData } from "../../schema";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const ProfessionalInfoStep: React.FC = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ApplicationFormData>();

  // Get experiences array
  const experiences = watch("professionalInfo.experiences");

  // Add new experience
  const addExperience = () => {
    setValue(
      "professionalInfo.experiences",
      [
        ...experiences,
        {
          company: "",
          position: "",
          startDate: new Date(),
          endDate: null,
          current: false,
          description: "",
        },
      ],
      { shouldValidate: true }
    );
  };

  // Remove experience
  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      const updatedExperiences = [...experiences];
      updatedExperiences.splice(index, 1);
      setValue("professionalInfo.experiences", updatedExperiences, {
        shouldValidate: true,
      });
    }
  };

  // Get skills array
  const skills = watch("professionalInfo.skills");

  // Add new skill
  const addSkill = () => {
    setValue("professionalInfo.skills", [...skills, ""], {
      shouldValidate: true,
    });
  };

  // Remove skill
  const removeSkill = (index: number) => {
    if (skills.length > 1) {
      const updatedSkills = [...skills];
      updatedSkills.splice(index, 1);
      setValue("professionalInfo.skills", updatedSkills, {
        shouldValidate: true,
      });
    }
  };

  // Handle date changes for experience
  const handleDateChange = (
    index: number,
    field: "startDate" | "endDate",
    date: Date | null
  ) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][field] = date ?? new Date(); // Default to today if null
    setValue("professionalInfo.experiences", updatedExperiences, {
      shouldValidate: true,
    });
  };

  // Handle checkbox changes for current position
  const handleCurrentChange = (index: number, checked: boolean) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index].current = checked;

    // If current job, set endDate to null
    if (checked) {
      updatedExperiences[index].endDate = null;
    } else if (!updatedExperiences[index].endDate) {
      // If not current and no end date, set to today
      updatedExperiences[index].endDate = new Date();
    }

    setValue("professionalInfo.experiences", updatedExperiences, {
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Professional Background</h2>

      {/* Work Experience Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Work Experience</h3>

        {experiences.map((experience, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg mb-4 bg-gray-50 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Experience {index + 1}</h4>
              {experiences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor={`company-${index}`}>
                  Company
                  <span className="label-text-alt text-red-500">*</span>
                </Label>
                <Input
                  id={`company-${index}`}
                  type="text"
                  className={`input input-bordered w-full ${
                    errors.professionalInfo?.experiences?.[index]?.company
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="Company name"
                  {...register(
                    `professionalInfo.experiences.${index}.company` as const
                  )}
                />
                {errors.professionalInfo?.experiences?.[index]?.company && (
                  <p className="mt-1 text-xs text-red-500">
                    {
                      errors.professionalInfo?.experiences?.[index]?.company
                        ?.message
                    }
                  </p>
                )}
              </div>

              {/* Position */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor={`position-${index}`}>
                  Position
                  <span className="label-text-alt text-red-500">*</span>
                </Label>
                <Input
                  id={`position-${index}`}
                  type="text"
                  className={`input input-bordered w-full ${
                    errors.professionalInfo?.experiences?.[index]?.position
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="Job title"
                  {...register(
                    `professionalInfo.experiences.${index}.position` as const
                  )}
                />
                {errors.professionalInfo?.experiences?.[index]?.position && (
                  <p className="mt-1 text-xs text-red-500">
                    {
                      errors.professionalInfo?.experiences?.[index]?.position
                        ?.message
                    }
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center mb-4">
              <Input
                type="checkbox"
                id={`current-job-${index}`}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={experience.current || false}
                onChange={(e) => handleCurrentChange(index, e.target.checked)}
              />
              <Label
                htmlFor={`current-job-${index}`}
                className="ml-2 block text-sm text-gray-900"
              >
                I currently work here
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="label" htmlFor={`start-date-${index}`}>
                  Start Date
                  <span className="label-text-alt text-red-500">*</span>
                </Label>
                <Input
                  id={`start-date-${index}`}
                  type="date"
                  className={`input input-bordered w-fit ${
                    errors.professionalInfo?.experiences?.[index]?.startDate
                      ? "border-red-500"
                      : ""
                  }`}
                  value={
                    experience.startDate
                      ? new Date(experience.startDate)
                          .toISOString()
                          .substr(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    handleDateChange(
                      index,
                      "startDate",
                      e.target.value ? new Date(e.target.value) : null
                    )
                  }
                />
                {errors.professionalInfo?.experiences?.[index]?.startDate && (
                  <p className="mt-1 text-xs text-red-500">
                    {
                      errors.professionalInfo?.experiences?.[index]?.startDate
                        ?.message
                    }
                  </p>
                )}
              </div>

              {/* End Date - hidden if current job */}
              {!experience.current && (
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label className="label" htmlFor={`end-date-${index}`}>
                    End Date
                    <span className="label-text-alt text-red-500">*</span>
                  </Label>
                  <Input
                    id={`end-date-${index}`}
                    type="date"
                    className={`input input-bordered w-fit ${
                      errors.professionalInfo?.experiences?.[index]?.endDate
                        ? "border-red-500"
                        : ""
                    }`}
                    value={
                      experience.endDate
                        ? new Date(experience.endDate)
                            .toISOString()
                            .substr(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      handleDateChange(
                        index,
                        "endDate",
                        e.target.value ? new Date(e.target.value) : null
                      )
                    }
                  />
                  {errors.professionalInfo?.experiences?.[index]?.endDate && (
                    <p className="mt-1 text-xs text-red-500">
                      {
                        errors.professionalInfo?.experiences?.[index]?.endDate
                          ?.message
                      }
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="grid w-full items-center gap-1.5">
              <Label className="label" htmlFor={`description-${index}`}>
                <span className="label-text font-medium">
                  Responsibilities & Achievements
                </span>
                <span className="label-text-alt text-red-500">*</span>
              </Label>
              <Textarea
                id={`description-${index}`}
                className={`textarea textarea-bordered w-full h-24 ${
                  errors.professionalInfo?.experiences?.[index]?.description
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Describe your responsibilities and achievements in this role"
                {...register(
                  `professionalInfo.experiences.${index}.description` as const
                )}
              />
              {errors.professionalInfo?.experiences?.[index]?.description && (
                <p className="mt-1 text-xs text-red-500">
                  {
                    errors.professionalInfo?.experiences?.[index]?.description
                      ?.message
                  }
                </p>
              )}
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          type="button"
          onClick={addExperience}
          className="mt-2"
        >
          <svg
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Another Experience
        </Button>
      </div>

      {/* Skills Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Skills</h3>

        <div className="space-y-4">
          {skills.map((_: any, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-grow">
                <Input
                  type="text"
                  className={`input input-bordered w-full ${
                    errors.professionalInfo?.skills?.[index]
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="e.g. JavaScript, Project Management, etc."
                  {...register(`professionalInfo.skills.${index}` as const)}
                />
                {errors.professionalInfo?.skills?.[index] && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.professionalInfo?.skills?.[index]?.message}
                  </p>
                )}
              </div>
              {skills.length > 1 && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-red-500 hover:text-red-700 hover:cursor-pointer"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              )}
            </div>
          ))}

          <Button variant="outline" type="button" onClick={addSkill}>
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Skill
          </Button>
        </div>
      </div>

      {/* Years of Experience */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Experience & Expectations</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="label" htmlFor="yearsOfExperience">
              Years of Professional Experience
              <span className="label-text-alt text-red-500">*</span>
            </Label>
            <Input
              id="yearsOfExperience"
              type="number"
              min="0"
              max="50"
              step="0.5"
              className={`input input-bordered w-full ${
                errors.professionalInfo?.yearsOfExperience
                  ? "border-red-500"
                  : ""
              }`}
              {...register("professionalInfo.yearsOfExperience", {
                valueAsNumber: true,
              })}
            />
            {errors.professionalInfo?.yearsOfExperience && (
              <p className="mt-1 text-xs text-red-500">
                {errors.professionalInfo.yearsOfExperience.message}
              </p>
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="label" htmlFor="salaryExpectation">
              Salary Expectation (INR)
              <span className="label-text-alt text-red-500">*</span>
            </Label>
            <Input
              id="salaryExpectation"
              type="number"
              min="0"
              step="1000"
              className={`input input-bordered w-full ${
                errors.professionalInfo?.salaryExpectation
                  ? "border-red-500"
                  : ""
              }`}
              {...register("professionalInfo.salaryExpectation", {
                valueAsNumber: true,
              })}
            />
            {errors.professionalInfo?.salaryExpectation && (
              <p className="mt-1 text-xs text-red-500">
                {errors.professionalInfo.salaryExpectation.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfoStep;
