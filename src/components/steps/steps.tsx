import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { type ApplicationFormData } from "../../schema";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

// File type helpers
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
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Helper to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

// File Dropzone Component
interface FileDropzoneProps {
  name: "resume" | "profilePicture" | "coverLetter";
  label: string;
  acceptedTypes: string[];
  maxSize: number;
  required?: boolean;
  multiple?: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  name,
  label,
  acceptedTypes,
  maxSize,
  required = false,
}) => {
  const {
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<ApplicationFormData>();

  // Get the current file if exists
  const currentFile = watch(`documents.${name}` as any);

  // State for preview
  const [preview, setPreview] = useState<string | null>(null);

  // Create a URL for image preview
  React.useEffect(() => {
    if (currentFile && ACCEPTED_IMAGE_TYPES.includes(currentFile.type)) {
      const objectUrl = URL.createObjectURL(currentFile);
      setPreview(objectUrl);

      // Clean up
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [currentFile]);

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Only use the first file if multiple is not allowed
      const file = acceptedFiles[0];

      if (file) {
        setValue(`documents.${name}` as any, file, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [setValue, name]
  );

  // Configuration for react-dropzone
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: acceptedTypes.reduce((acc, type) => {
        acc[type] = [];
        return acc;
      }, {} as Record<string, string[]>),
      maxSize,
      multiple: false,
      // Disable click if we already have a file
      noClick: !!currentFile,
    });

  // Get error message
  const errorMessage =
    errors.documents && errors.documents[name]
      ? errors.documents[name]?.message
      : fileRejections.length > 0
      ? fileRejections[0].errors[0].message
      : null;

  // Handle file removal
  const handleRemove = () => {
    setValue(`documents.${name}` as any, undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setPreview(null);
  };

  // Get accepted file types for display
  const displayAcceptedTypes = acceptedTypes
    .map((type) => {
      switch (type) {
        case "image/jpeg":
        case "image/jpg":
          return "JPG";
        case "image/png":
          return "PNG";
        case "image/webp":
          return "WebP";
        case "application/pdf":
          return "PDF";
        case "application/msword":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          return "DOC/DOCX";
        default:
          return type;
      }
    })
    .join(", ");

  return (
    <div className="form-control w-full">
      <Label className="mb-2">
        {label}
        {required && <span className="label-text-alt text-red-500">*</span>}
      </Label>

      {!currentFile ? (
        // Dropzone UI when no file is selected
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${
              errorMessage
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
            }
            ${isDragActive ? "border-blue-500 bg-blue-50" : ""}
          `}
        >
          <Input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            <svg
              className="h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {isDragActive ? (
              <p className="text-blue-600">Drop the file here</p>
            ) : (
              <>
                <p className="font-medium">
                  Drag & drop your file here, or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Accepted file types: {displayAcceptedTypes}. Maximum file
                  size: {formatFileSize(maxSize)}.
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        // Preview when file is selected
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium truncate max-w-xs">
              {currentFile.name}
            </span>
            <button
              type="button"
              onClick={handleRemove}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="text-sm text-gray-500">
            {formatFileSize(currentFile.size)}
          </div>

          {/* Image preview */}
          {preview && (
            <div className="mt-2 max-w-xs mx-auto">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 rounded border object-contain mx-auto"
              />
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

const DocumentsStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Upload Documents</h2>

      <p className="text-gray-600">
        Please upload the required documents for your application. All files
        must be less than 5MB in size.
      </p>

      <div className="space-y-8">
        {/* Resume Upload */}
        <FileDropzone
          name="resume"
          label="Resume/CV"
          acceptedTypes={ACCEPTED_FILE_TYPES}
          maxSize={MAX_FILE_SIZE}
          required
        />

        {/* Profile Picture Upload */}
        <FileDropzone
          name="profilePicture"
          label="Profile Picture"
          acceptedTypes={ACCEPTED_IMAGE_TYPES}
          maxSize={MAX_FILE_SIZE}
        />

        {/* Cover Letter Upload */}
        <FileDropzone
          name="coverLetter"
          label="Cover Letter"
          acceptedTypes={ACCEPTED_FILE_TYPES}
          maxSize={MAX_FILE_SIZE}
        />
      </div>

      <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Your resume is required. The profile picture and cover letter are
              optional but recommended.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsStep;
