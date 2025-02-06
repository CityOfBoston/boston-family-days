import {parse} from "csv-parse/sync";
import {StudentRegistrationData} from "./types";
import {sanitizeString} from "./utils";
/**
 * Parses a CSV file specifically used for batch uploads
 * and returns a list of StudentRegistrationData objects.
 * @param {string} fileContent
 * - The content of the CSV file.
 * @param {string} fileName
 * - The name of the CSV file.
 * @return {Promise<{records: StudentRegistrationData[], errors: string[]}>}
 * - A promise that resolves to an object containing the parsed records and
 * errors.
 */
export const parseBatchUploadCSV = (fileContent: string, fileName: string):
{ records: StudentRegistrationData[], errors: string[] } => {
  const requiredFields = ["School", "StudentNo",
    "FirstName", "LastName", "ContactName", "ContactEmail"];
  const records: StudentRegistrationData[] = [];
  const errors: string[] = [];

  // Regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fileRecords = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  for (const record of fileRecords) {
    // Check for required fields
    for (const field of requiredFields) {
      if (!record[field]) {
        errors.push(
          `Missing required field: ${field} in file: ${fileName}`);
        continue;
      }
    }

    // Validate email format
    if (!emailRegex.test(record["ContactEmail"])) {
      errors.push(
        `Invalid email format: ${record["ContactEmail"]} in file: ${fileName}`
      );
      continue;
    }

    const parsedRecord: StudentRegistrationData = {
      school: sanitizeString(record["School"]),
      studentId: sanitizeString(record["StudentNo"]),
      firstName: sanitizeString(record["FirstName"]),
      lastName: sanitizeString(record["LastName"]),
      parentFirstName:
      sanitizeString(record["ContactName"].split(" ").slice(0, -1).join(" ")),
      parentLastName:
      sanitizeString(record["ContactName"].split(" ").slice(-1).join(" ")),
      email: record["ContactEmail"],
      phoneNumber: sanitizeString(record["ContactPhone"] || ""),
      dob: sanitizeString(record["DateOfBirth"] || ""),
      grade: sanitizeString(record["Grade"] || ""),
      zip: sanitizeString(record["ZipCode"] || ""),
      englishLearner: sanitizeString(record["IsEnglishLearner"] || ""),
      iep: sanitizeString(record["HasIEP"] || ""),
      neighborhood: sanitizeString(record["Neighborhood"] || ""),
    };

    records.push(parsedRecord);
  }

  return {records, errors};
};

/**
 * Parses a exported CSV file from the Upaknee platform and
 * only return the values in the email column as a list of emails.
 * @param {string} fileContent
 * - The content of the CSV file.
 * @return {Promise<string[]>}
 * - A promise that resolves to a list of emails.
 */
export const parseUpakneeCSV = (fileContent: string): string[] => {
  const records = parse(fileContent, {columns: true, skip_empty_lines: true});
  console.log("Parsed records:", records);
  return records.map((record: {email: string}) => record["email"]);
};
