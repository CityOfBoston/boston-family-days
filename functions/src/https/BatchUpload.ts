import {readBatchUploadFiles} from "../lib/storageClient";
import {
  addStudentsAndSyncSubscribers,
  createHttpTrigger} from "../lib/functionsClient";

/**
 * Handles the batch upload of student registration data from a CSV file.
 * @param {functions.Request} req - The request object.
 * @param {functions.Response} res - The response object.
 * @return {Promise<void>}
 * A promise that resolves when the batch upload is complete.
 */
export const batchUpload = createHttpTrigger(
  "private",
  async (req, res) => {
    const folderName = req.query.folderName as string;

    console.log(`Batch upload request received for folder: ${folderName}`);

    if (!folderName) {
      console.error("Missing folder name in request.");
      res.status(400).send({
        error: "Missing folder name in request.",
        details: "The folderName query parameter is required.",
      });
      return;
    }

    try {
      // Read and parse CSV files from the
      // specified folder in the cloud bucket
      const {records: studentRecords, errors} =
        await readBatchUploadFiles(folderName);

      if (!studentRecords || studentRecords.length === 0) {
        console.error(`No student records found in folder: ${folderName}`);
        res.status(404).send({
          error: "Folder not found or empty.",
          details: "No valid student records could be extracted " +
            "in the specified folder.",
        });
        return;
      }

      if (errors.length > 0) {
        console.warn(
          `Encountered ${errors.length} errors while reading files: ` +
          `${JSON.stringify(errors)}`,
        );
      }

      console.log(
        `Parsed ${studentRecords.length} student records from CSV files.`,
      );

      try {
        console.log("Starting to add students and sync subscribers...");
        await addStudentsAndSyncSubscribers(studentRecords);
        console.log("Successfully added students and synced subscribers.");
      } catch (error) {
        console.error("Error during student addition and subscriber sync:",
          error);
        throw error; // Re-throw to be caught by outer catch block
      }

      console.log("Batch upload completed successfully.");
      res.status(200).send({
        status: "success",
        recordsProcessed: studentRecords.length,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error) {
      console.error("Error processing batch upload:", error);

      // Determine the specific error type and provide a more helpful message
      let errorMessage = "Internal Server Error";
      let errorDetails = "An unexpected error occurred during batch upload.";

      if (error instanceof TypeError &&
          error.message.includes("Cannot read properties of undefined")) {
        errorMessage = "Invalid CSV format";
        errorDetails = "One or more CSV files contain null values " +
          "in required fields. Please check that all required fields " +
          "(School, FirstName, LastName, " +
          "ContactName, ContactEmail) " +
          "are present and have valid values in all rows.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
        errorDetails = error.stack || "No stack trace available";
      }

      // Log the full error details for debugging
      console.error("Full error details:", {
        message: errorMessage,
        details: errorDetails,
        originalError: error,
      });

      res.status(500).send({
        error: errorMessage,
        details: errorDetails,
      });
    }
  }, true);
