import {DateTime} from "luxon";
import {Timestamp} from "firebase-admin/firestore";

export const TIME_ZONE = "America/New_York";
export const TIME_FORMAT = "MM-dd-yyyy";

/**
 * Helper function to validate the UNIX timestamp.
 * Validates the 'timestamp' query parameter.
 * Returns true if the timestamp is a valid UNIX timestamp.
 * Returns false otherwise.
 * @param {string} timestampString
 * - The timestamp string to validate.
 * @return {boolean}
 * - True if the timestamp is a valid UNIX timestamp, false otherwise.
 */
export const isValidUnixTimestamp = (timestampString: string) => {
  const timestamp = Number(timestampString);
  if (isNaN(timestamp)) {
    return false;
  }

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return false;
  }

  const start = new Date("1970-01-01").getTime();
  const end = new Date("2100-01-01").getTime();
  return timestamp >= start && timestamp <= end;
};

/**
 * Converts a luxon date time to a firestore timestamp.
 * @param {DateTime} date
 * - The date time to convert.
 * @return {Timestamp}
 * - The converted timestamp.
 */
export const convertLuxonDateTimeToFirestoreTimestamp =
    (date: DateTime): Timestamp => {
      const jsDate = date.toUTC().toJSDate();
      return Timestamp.fromDate(jsDate);
    };

