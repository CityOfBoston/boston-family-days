import React, { useState, ChangeEvent } from "react";
import { saveFileData } from "../utils/firebaseConfig";
import NavButton from "./common/NavButton";

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 10;

const UploadPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const validFiles = newFiles.filter((file) => {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          alert(`File "${file.name}" exceeds the 10MB size limit.`);
          return false;
        }
        if (!file.name.toLowerCase().endsWith('.csv')) {
          alert(`File "${file.name}" is not a CSV file. Only CSV files are accepted.`);
          return false;
        }
        return true;
      }).map(file => {
        // Create a new File object with a sanitized name
        const sanitizedName = file.name
          .toLowerCase() // Convert to lowercase
          .replace(/[^a-z0-9.-]/g, '_') // Replace special chars with underscore
          .replace(/_{2,}/g, '_'); // Replace multiple underscores with single
        return new File([file], sanitizedName, { type: file.type });
      });

      if (files.length + validFiles.length <= MAX_FILES) {
        setFiles([...files, ...validFiles]);
      } else {
        alert(`You can upload a maximum of ${MAX_FILES} files.`);
      }
    }
  };

  const handleFileDelete = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !description || files.length === 0) {
      alert("Please fill in all fields and upload at least one file.");
      return;
    }

    setLoading(true);
    setUploadId(null);
    setErrorMessage(null);

    try {
      const fileData = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          data: await file.text(),
        }))
      );

      const result = await saveFileData({
        title,
        description,
        files: fileData,
      });

      if (result && typeof result.data === "object" && result.data !== null) {
        if ("id" in result.data && typeof result.data.id === "string") {
          setUploadId(result.data.id); // Success case
        } else if ("error" in result.data && typeof result.data.error === "string") {
          setErrorMessage(result.data.error); // Error case
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setErrorMessage("An error occurred while uploading files.");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = !title || !description || files.length === 0 || loading;

  const handleCopyId = () => {
    if (uploadId) {
      navigator.clipboard.writeText(uploadId);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Student Batch Uploads for Boston Family Days</h1>
      <p className="mb-6 text-text_grey">
        This page is used by school administrators to securely upload student data for Boston Family Days batch registrations. 
        Please fill in all the required fields, and ensure that all uploaded files meet formatting requirements. 
        To avoid spamming, there is a limit of 5 submissions per minute and 50 submissions per day.
      </p>

      {loading ? (
        <div className="mt-10 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-text_grey">Uploading files... Please wait.</p>
        </div>
      ) : uploadId || errorMessage ? (
        <div className="mt-10">
          {uploadId && (
            <div>
              <p>
                Files uploaded successfully with ID:
              </p>
              <div className="flex w-full items-center py-4 align-middle flex-wrap">
                <h1 className="overflow-auto">
                    {uploadId}
                </h1>
                <button
                    className="flex items-center text-blue-500 hover:text-blue-700"
                    onClick={handleCopyId}
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy ID
                </button>
              </div>
            </div>
          )}
          {errorMessage && <p className="text-red-500 text-lg">{errorMessage}</p>}
          <NavButton
            className="text-bold w-full mt-4"
            onClick={() => {
              setTitle("");
              setDescription("");
              setFiles([]);
              setUploadId(null);
              setErrorMessage(null);
            }}
          >
            Submit Another Batch
          </NavButton>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="title" className="block font-bold">
              Title<span className="!text-required_red">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Please identify your school(s) and/or represented category of students.
            </p>
            <input
              type="text"
              id="title"
              className="border border-gray-400 px-3 py-2 rounded w-full"
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block font-bold">
              Description<span className="!text-required_red">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Please add a detailed description about the data in the files you're uploading.
            </p>
            <textarea
              id="description"
              className="border border-gray-400 px-3 py-2 rounded w-full h-32"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="files" className="block font-bold">
              Files<span className="!text-required_red">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Select up to {MAX_FILES} files. Maximum file size: {MAX_FILE_SIZE_MB}MB per file.
            </p>

            <ul className="mb-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between border-b border-gray-300 py-2"
                >
                  <span>{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleFileDelete(index)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            <input
              type="file"
              id="files"
              className="border border-gray-400 px-3 py-2 rounded w-full"
              multiple
              onChange={handleFileChange}
            />
          </div>

          <NavButton
            className={'font-bold w-full'}
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            Submit
          </NavButton>
        </>
      )}
    </div>
  );
};

export default UploadPage;
