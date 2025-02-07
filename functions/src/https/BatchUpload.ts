import {readBatchUploadFiles} from "../lib/storageClient";
import {addStudentsAndSyncSubscribers,
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
      res.status(400).send({error: "Missing folder name in request."});
      return;
    }

    try {
      // Read and parse CSV files from the
      // specified folder in the cloud bucket
      const {records: studentRecords, errors} =
      await readBatchUploadFiles(folderName);

      if (!studentRecords || studentRecords.length === 0) {
        console.error(`No student records found in folder: ${folderName}`);
        res.status(404).send({error: "Folder not found or empty."});
        return;
      }

      if (errors.length > 0) {
        console.warn(`Encountered errors 
          while reading files: ${errors.join(", ")}`);
      }

      console.log(`Parsed ${studentRecords.length}
      student records from CSV files.`);

      await addStudentsAndSyncSubscribers(studentRecords);

      console.log("Batch upload completed successfully.");
      res.status(200).send({status: "success"});
    } catch (error) {
      console.error("Error processing batch upload:", error);
      res.status(500).send({error: "Internal Server Error"});
    }
  }, true);
