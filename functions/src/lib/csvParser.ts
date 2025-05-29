import {parse} from "csv-parse/sync";
import {StudentRegistrationData} from "./types";
import {sanitizeString} from "./utils";
/**
 * Detects if a name is in the format "LastName, FirstName"
 * and converts it to "FirstName LastName"
 * @param {string} name - The name to check and potentially convert
 * @return {string} The converted name if it was in reversed format,
 * or the original name if not
 */
const fixReversedName = (name: string): string => {
  if (!name) return "";

  // Check if the name contains a comma
  if (name.includes(",")) {
    const parts = name.split(",").map((part) => part.trim());
    if (parts.length === 2) {
      // If we have exactly two parts after splitting by comma, reverse them
      return `${parts[1]} ${parts[0]}`;
    }
  }
  return name;
};

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
  const requiredFields = ["School",
    "FirstName", "LastName", "ContactName", "ContactEmail"];
  const records: StudentRegistrationData[] = [];
  const errors: string[] = [];

  // Regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    // First check if the file is empty
    if (!fileContent || fileContent.trim() === "") {
      errors.push(`File is empty: ${fileName}`);
      return {records, errors};
    }

    // Try to parse the CSV file
    const fileRecords = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true, // Allow rows with inconsistent column counts
    });

    // Check if any records were parsed
    if (!fileRecords || fileRecords.length === 0) {
      errors.push(`No records found in file: ${fileName}`);
      return {records, errors};
    }

    // Check if the CSV has the required headers
    const headers = Object.keys(fileRecords[0]);
    for (const field of requiredFields) {
      if (!headers.includes(field)) {
        errors.push(
          `Missing required header: ${field} in file: ${fileName}`,
        );
      }
    }

    // If missing required headers, return early
    if (errors.length > 0) {
      return {records, errors};
    }

    // Process each record
    for (let i = 0; i < fileRecords.length; i++) {
      const record = fileRecords[i];
      const rowNumber = i + 2; // +2 because row 1 is headers,
      //  and we're 0-indexed
      const rowErrors: string[] = [];

      // Check for required fields
      for (const field of requiredFields) {
        if (!record[field]) {
          rowErrors.push(
            `Row ${rowNumber}: Missing required field: ${field} in file: ` +
            `${fileName}`,
          );
        }
      }

      // If missing required fields, skip this record
      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
        continue;
      }

      // Validate email format
      if (!emailRegex.test(record["ContactEmail"])) {
        errors.push(
          `Row ${rowNumber}: Invalid email format: ${record["ContactEmail"]} ` +
          `in file: ${fileName}`,
        );
        continue;
      }

      try {
        // Split ContactName into first and last name
        let parentFirstName = "";
        let parentLastName = "";

        if (record["ContactName"]) {
          // First check and fix if the name is in reversed format
          // Do this before any sanitization to preserve the comma
          const fixedContactName = fixReversedName(record["ContactName"]);
          const nameParts = fixedContactName.split(" ");
          if (nameParts.length > 1) {
            // For names with multiple parts, last part is last name
            // and everything else is first name
            parentLastName = nameParts.pop() || "";
            parentFirstName = nameParts.join(" ");
          } else {
            // For single part names, treat as last name
            parentLastName = fixedContactName;
          }
        }

        const parsedRecord: StudentRegistrationData = {
          school: sanitizeString(record["School"]),
          studentId: sanitizeString(record["StudentNo"] || ""),
          firstName: sanitizeString(record["FirstName"]),
          lastName: sanitizeString(record["LastName"]),
          // Apply sanitization after name splitting
          parentFirstName: sanitizeString(parentFirstName),
          parentLastName: sanitizeString(parentLastName),
          email: record["ContactEmail"],
          phoneNumber: sanitizeString(record["ContactPhone"]),
          dob: sanitizeString(record["DateOfBirth"]),
          grade: sanitizeString(record["Grade"]),
          zip: sanitizeString(record["ZipCode"]),
          englishLearner: sanitizeString(record["IsEnglishLearner"]),
          iep: sanitizeString(record["HasIEP"]),
          neighborhood: sanitizeString(record["Neighborhood"]),
        };

        records.push(parsedRecord);
      } catch (error) {
        if (error instanceof Error) {
          errors.push(
            `Row ${rowNumber}: Error processing record: ${error.message} ` +
            `in file: ${fileName}`,
          );
        } else {
          errors.push(
            `Row ${rowNumber}: 
            Unknown error processing record in file: ${fileName}`,
          );
        }
      }
    }
  } catch (error) {
    // Handle CSV parsing errors
    if (error instanceof Error) {
      errors.push(`Error parsing CSV file ${fileName}: ${error.message}`);
    } else {
      errors.push(`Unknown error parsing CSV file: ${fileName}`);
    }
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
  try {
    const records = parse(fileContent, {columns: true,
      skip_empty_lines: true});
    console.log("Parsed records:", records);
    return records.map((record: {email: string}) => record["email"] || "");
  } catch (error) {
    console.error("Error parsing Upaknee CSV:", error);
    return [];
  }
};
