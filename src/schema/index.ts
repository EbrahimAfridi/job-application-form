import { z } from "zod";

// Helper function to limit file size (5MB max)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Schema for the entire form
export const applicationFormSchema = z.object({
  // Step 1: Personal Information
  personalInfo: z.object({
    firstName: z.string().min(2, "First name must have at least 2 characters"),
    lastName: z.string().min(2, "Last name must have at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    dateOfBirth: z.date().refine(
      (date) => {
        // Must be at least 18 years old
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
        return date <= eighteenYearsAgo;
      },
      { message: "You must be at least 18 years old" }
    ),
    address: z.object({
      street: z.string().min(1, "Street address is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zip: z
        .string()
        .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
      country: z.string().min(1, "Country is required"),
    }),
  }),

  // Step 2: Professional Background
  professionalInfo: z.object({
    experiences: z
      .array(
        z.object({
          company: z.string().min(1, "Company name is required"),
          position: z.string().min(1, "Position is required"),
          startDate: z.date(),
          endDate: z.date().nullable().optional(),
          current: z.boolean().default(false).optional(),
          description: z
            .string()
            .min(1, "Please describe your responsibilities"),
        })
      )
      .min(1, "Please add at least one work experience"),

    skills: z
      .array(z.string().min(1, "Skill name cannot be empty"))
      .min(1, "Please add at least one skill"),

    yearsOfExperience: z
      .number()
      .min(0, "Years cannot be negative")
      .max(50, "Please enter a valid number of years"),

    salaryExpectation: z
      .number()
      .min(0, "Salary expectation cannot be negative"),
  }),

  // Step 3: Document Uploads
  documents: z.object({
    resume: z
      .instanceof(File)
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "File size must be less than 5MB"
      )
      .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type),
        "Only PDF, DOC, or DOCX files are accepted"
      ),

    profilePicture: z
      .instanceof(File)
      .optional()
      .refine(
        (file) => !file || file.size <= MAX_FILE_SIZE,
        "Image size must be less than 5MB"
      )
      .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only JPEG, JPG, PNG, or WebP images are accepted"
      ),

    coverLetter: z
      .instanceof(File)
      .optional()
      .refine(
        (file) => !file || file.size <= MAX_FILE_SIZE,
        "File size must be less than 5MB"
      )
      .refine(
        (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
        "Only PDF, DOC, or DOCX files are accepted"
      ),
  }),

  // Step 4: Additional Questions
  additionalInfo: z.object({
    howDidYouHear: z.enum(["jobBoard", "socialMedia", "referral", "other"]),
    otherSource: z.string().optional(),

    availableStartDate: z.date(),

    willingToRelocate: z.boolean(),

    reasonForApplying: z
      .string()
      .min(50, "Please provide at least 50 characters")
      .max(500, "Please keep your response under 500 characters"),

    additionalComments: z.string().optional(),
  }),

  // Step 5: Terms and Review
  termsAndReview: z.object({
    agreeToTerms: z.literal(true, {
      errorMap: () => ({
        message: "You must agree to the terms and conditions",
      }),
    }),

    agreeToBackgroundCheck: z.literal(true, {
      errorMap: () => ({ message: "You must consent to a background check" }),
    }),

    confirmInformationAccurate: z.literal(true, {
      errorMap: () => ({
        message: "You must confirm all information is accurate",
      }),
    }),
  }),
});

// Create a type from the schema
export type ApplicationFormData = z.infer<typeof applicationFormSchema>;

// Default values for the form
export const defaultValues: Partial<ApplicationFormData> = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    dateOfBirth: new Date(),
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  },
  professionalInfo: {
    experiences: [
      {
        company: "",
        position: "",
        startDate: new Date(),
        endDate: null,
        current: false,
        description: "",
      },
    ],
    skills: [""],
    yearsOfExperience: 0,
    salaryExpectation: 0,
  },
  additionalInfo: {
    howDidYouHear: "jobBoard",
    availableStartDate: new Date(),
    otherSource: "",
    willingToRelocate: false,
    reasonForApplying: "",
    additionalComments: "",
  },
  termsAndReview: {
    agreeToTerms: true,
    agreeToBackgroundCheck: true,
    confirmInformationAccurate: true,
  },
};
