import React from "react";
import { Button } from "@/components/ui/button";

interface DraftBannerProps {
  onLoad: () => void;
  onDismiss: () => void;
  onClear: () => void;
}

const DraftBanner: React.FC<DraftBannerProps> = ({
  onLoad,
  onDismiss,
  onClear,
}) => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
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
              You have a saved draft of this application. Would you like to
              continue where you left off?
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={"outline"}
            type="button"
            onClick={onLoad}
            className="border-blue-300 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
          >
            Load Draft
          </Button>
          <Button
            variant={"outline"}
            type="button"
            onClick={onDismiss}
            className="border border-gray-300 text-xs text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-500"
          >
            Continue Without Draft
          </Button>
          <Button
            variant={"outline"}
            type="button"
            onClick={onClear}
            className="border text-xs  border-red-300  text-red-700 bg-white hover:text-red-700 hover:bg-red-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500"
          >
            Delete Draft
          </Button>
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-500">
        <p>
          Your draft is saved locally on this device. If you switch browsers or
          devices, you won't be able to access this draft.
        </p>
      </div>
    </div>
  );
};

export default DraftBanner;
