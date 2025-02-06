import * as functions from "firebase-functions";
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

    if (!folderName) {
      functions.logger.error("Missing folder name in request.");
      res.status(400).send({error: "Missing folder name in request."});
      return;
    }

    try {
    // Read and parse CSV files from the specified folder in the cloud bucket
      const {records: studentRecords, errors} =
      await readBatchUploadFiles(folderName);

      if (errors.length > 0) {
        functions.logger.warn(
          `Encountered errors while reading files: ${errors.join(", ")}`);
      }

      functions.logger.info(`Parsed ${studentRecords.length}
      student records from CSV files.`);

      await addStudentsAndSyncSubscribers(studentRecords);

      functions.logger.info("Batch upload completed successfully.");
      res.status(200).send({status: "success"});
    } catch (error) {
      functions.logger.error("Error processing batch upload:", error);
      res.status(500).send({error: "Internal Server Error"});
    }
  }, true);
