import * as admin from "firebase-admin";
import {StudentRegistrationData} from "./types";
import {parseBatchUploadCSV, parseUpakneeCSV} from "./csvParser";

const bucket = admin.storage().bucket(process.env.FILE_UPLOAD_BUCKET!);

interface FileData {
  name: string;
  data: string;
}

/**
 * Uploads a list of csv files to the firebase storage bucket.
 * @param {FileData[]} files
 * - A list of files to upload.
 * @param {string} folderPath
 * - A promise that resolves to an object containing the error if any.
 */
export const uploadFiles = async (files: FileData[], folderPath: string) => {
  console.log(`Starting upload of ${files.length} 
    files to folder: ${folderPath}`);
  try {
    await Promise.all(
      files.map(async (file: FileData) => {
        console.log(`Uploading file: ${file.name}`);
        const fileRef = bucket.file(
          `${folderPath}${file.name}`);
        await fileRef.save(file.data, {
          contentType: "text/csv",
        });
        console.log(`Successfully uploaded file: ${file.name}`);
      })
    );
  } catch (error) {
    console.error("Error uploading files:", error);
    return {error: `Error uploading files: ${error}`};
  }

  console.log("All files uploaded successfully.");
  return {success: true};
};

/* Reads all the csv files from the firebase storage bucket
 * given a folder name, checks for completeness on required
 * fields, appends them together and returns a list of records.
 * The csv files are expected to have the following columns:
 * School StudentNo FirstName LastName ContactName ContactEmail,
 * corresponding to the following parsed fields stored in firebase:
 * school, studentId, firstName, lastName,
 * parentFirstName & parentLastName, email
 * If any csv file is missing any of these required fields,
 * the function will return an error.
 * They may also have the following optional columns:
 * ContactPhone DateOfBirth Grade ZipCode IsEnglishLearner
 * HasIEP Neighborhood which
 * correspond to the following parsed fields stored in firebase:
 * phoneNumber, dob, grade, zip, englishLearner, iep, neighborhood
 * If any fields outside of these are present, they will be ignored.
 * The function will return a list of records with the
 * following fields:
 * school, studentId, firstName, lastName, parentFirstName,
 * parentLastName,
 * email, phoneNumber, dob, grade, zip, englishLearner, iep,
 * neighborhood
*/
export const readBatchUploadFiles = async (folderName: string):
Promise<{ records: StudentRegistrationData[], errors: string[] }> => {
  console.log(`Reading batch upload files from folder: ${folderName}`);
  const [files] = await bucket.getFiles({prefix: folderName});
  console.log(`Found ${files.length} files in folder: ${folderName}`);
  const records: StudentRegistrationData[] = [];
  const errors: string[] = [];

  for (const file of files) {
    console.log(`Processing file: ${file.name}`);
    const fileBuffer = await file.download();
    const fileContent = fileBuffer[0].toString("utf-8");

    const {records: fileRecords, errors: fileErrors} =
    parseBatchUploadCSV(fileContent, file.name);
    records.push(...fileRecords);
    errors.push(...fileErrors);
    console.log(`Processed file: ${file.name}, 
      Records: ${fileRecords.length}, 
      Errors: ${fileErrors.length}`);
  }

  if (errors.length > 0) {
    console.error("Errors found during file processing:", errors);
  } else {
    console.log("All files processed successfully with no errors.");
  }

  return {records, errors};
};

/**
 * Reads a csv file from the firebase storage bucket
 * given a folder name and returns a list of emails.
 * @param {string} folderName
 * - The name of the folder where the CSV file is located.
 * @return {Promise<string[]>}
 * - A promise that resolves to a list of emails.
 */
export const readUpakneeCSV = async (folderName: string):
Promise<string[]> => {
  console.log(`Reading Upaknee CSV files from folder: ${folderName}`);
  const [files] = await bucket.getFiles({prefix: folderName});
  console.log(`Found ${files.length} files in folder: ${folderName}`);
  const emails: string[] = [];

  for (const file of files) {
    console.log(`Processing file: ${file.name}`);
    const fileBuffer = await file.download();
    const fileContent = fileBuffer[0].toString("utf-8");
    const parsedEmails = parseUpakneeCSV(fileContent);
    emails.push(...parsedEmails);
    console.log(`Extracted ${parsedEmails.length} 
      emails from file: ${file.name}`);
  }

  console.log(`Total emails extracted: ${emails.length}`);
  return emails;
};
